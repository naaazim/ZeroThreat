package com.zerothreat.service;

import com.zerothreat.dto.*;
import com.zerothreat.entity.*;
import com.zerothreat.repository.ScanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.net.URISyntaxException;
import java.net.InetAddress;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ScanService {

    @Autowired
    private ScanRepository scanRepository;

    @Autowired
    private CveService cveService;

    @Transactional
    public Scan createScanFromRequest(ScanRequestDTO request) {
        Scan scan = new Scan();
        scan.setTarget(request.getTarget());

        // Parse timestamp
        try {
            scan.setTimestamp(LocalDateTime.parse(request.getTimestamp(), DateTimeFormatter.ISO_DATE_TIME));
        } catch (Exception e) {
            scan.setTimestamp(LocalDateTime.now());
        }

        scan.setStatus(Scan.ScanStatus.COMPLETED);

        // ---------------------------
        // NMAP RESULTS
        // ---------------------------
        if (request.getNmap() != null) {
            Set<NmapResult> nmapResults = request.getNmap().stream()
                    .map(dto -> {
                        NmapResult result = new NmapResult();
                        result.setPort(dto.getPort());
                        result.setProtocol(dto.getProtocol());
                        result.setService(dto.getService());
                        result.setVersion(dto.getVersion());
                        result.setState(dto.getState());
                        result.setScan(scan);
                        return result;
                    })
                    .collect(Collectors.toSet());
            scan.setNmapResults(nmapResults);
        }

        // ---------------------------
        // SQLMAP RESULTS
        // ---------------------------
        if (request.getSqlmap() != null) {
            Set<SqlMapResult> sqlMapResults = request.getSqlmap().stream()
                    .map(dto -> {
                        SqlMapResult result = new SqlMapResult();
                        result.setVulnerabilityType(dto.getVulnerability_type());
                        result.setPayload(dto.getPayload());
                        result.setParameter(dto.getParameter());
                        result.setDescription(dto.getDescription());
                        result.setScan(scan);
                        return result;
                    })
                    .collect(Collectors.toSet());
            scan.setSqlMapResults(sqlMapResults);
        }

        // ---------------------------
        // NIKTO RESULTS
        // ---------------------------
        if (request.getNikto() != null) {
            Set<NiktoResult> niktoResults = request.getNikto().stream()
                    .map(dto -> {
                        NiktoResult result = new NiktoResult();
                        result.setOsvdbId(dto.getOsvdb_id());
                        result.setMethod(dto.getMethod());
                        result.setUri(dto.getUri());
                        result.setDescription(dto.getDescription());
                        result.setScan(scan);
                        return result;
                    })
                    .collect(Collectors.toSet());
            scan.setNiktoResults(niktoResults);
        }

        // Save scan first to generate ID
        Scan savedScan = scanRepository.save(scan);

        // ---------------------------
        // CVE RESULTS
        // ---------------------------
        if (savedScan.getNmapResults() != null && !savedScan.getNmapResults().isEmpty()) {
            Set<CveResult> cveResults = new HashSet<>();

            for (NmapResult nmapResult : savedScan.getNmapResults()) {
                // Only search for CVEs if version info is available
                if (nmapResult.getVersion() != null && !nmapResult.getVersion().isBlank()) {
                    String product = extractProductName(nmapResult.getService(), nmapResult.getVersion());
                    String version = extractVersionNumber(nmapResult.getVersion());

                    // Search CVEs for this product/version
                    List<CveService.CveData> cveDataList = cveService.searchCvesByKeyword(product, version);

                    // Convert to CveResult entities
                    for (CveService.CveData cveData : cveDataList) {
                        CveResult cveResult = new CveResult();
                        cveResult.setScan(savedScan);
                        cveResult.setNmapResult(nmapResult);
                        cveResult.setCveId(cveData.getCveId());
                        cveResult.setDescription(cveData.getDescription());
                        cveResult.setCvssV3Score(cveData.getCvssV3Score());
                        cveResult.setCvssV3Severity(cveData.getCvssV3Severity());
                        cveResult.setPublishedDate(cveData.getPublishedDate());
                        cveResult.setLastModifiedDate(cveData.getLastModifiedDate());
                        cveResult.setReferences(cveData.getReferences());
                        cveResults.add(cveResult);
                    }
                }
            }

            savedScan.setCveResults(cveResults);
        }

        return scanRepository.save(savedScan);
    }

    /**
     * Extract product name from service and version string
     */
    private String extractProductName(String service, String version) {
        if (version == null || version.isBlank()) {
            return service != null ? service : "unknown";
        }

        // Try to extract product name from version string
        // Common format: "ProductName Version"
        String[] parts = version.trim().split("\\s+");
        if (parts.length > 0 && !parts[0].matches("\\d+.*")) {
            return parts[0];
        }

        return service != null ? service : "unknown";
    }

    /**
     * Extract version number from version string
     */
    private String extractVersionNumber(String version) {
        if (version == null || version.isBlank()) {
            return "";
        }

        // Try to find version number pattern (e.g., "2.4.52", "1.0", etc.)
        String[] parts = version.trim().split("\\s+");
        for (String part : parts) {
            if (part.matches("\\d+(\\.\\d+)*")) {
                return part;
            }
        }

        return version;
    }

    public Page<ScanResponseDTO> getAllScans(int page, int size) {
        List<Scan> allScans = scanRepository.findAllOrderByCreatedAtDesc();

        // Initialize collections (avoid lazy errors)
        allScans.forEach(scan -> {
            if (scan.getNmapResults() != null)
                scan.getNmapResults().size();
            if (scan.getSqlMapResults() != null)
                scan.getSqlMapResults().size();
            if (scan.getNiktoResults() != null)
                scan.getNiktoResults().size();
            if (scan.getCveResults() != null)
                scan.getCveResults().size();
        });

        int start = Math.min(page * size, allScans.size());
        int end = Math.min(start + size, allScans.size());

        List<Scan> pageScans = allScans.subList(start, end);
        List<ScanResponseDTO> dtos = pageScans.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());

        return new PageImpl<>(dtos, PageRequest.of(page, size), allScans.size());
    }

    public ScanResponseDTO getScanById(Long id) {
        return scanRepository.findByIdWithResults(id)
                .map(this::convertToResponseDTOWithResults)
                .orElseThrow(() -> new RuntimeException("Scan not found with id: " + id));
    }

    private ScanResponseDTO convertToResponseDTO(Scan scan) {
        ScanResponseDTO dto = new ScanResponseDTO();
        dto.setId(scan.getId());
        dto.setTarget(scan.getTarget());
        dto.setTimestamp(scan.getTimestamp());
        dto.setStatus(scan.getStatus().name());
        dto.setCreatedAt(scan.getCreatedAt());

        // Summary only
        ScanResponseDTO.ScanSummaryDTO summary = new ScanResponseDTO.ScanSummaryDTO();
        summary.setTotalOpenPorts(scan.getNmapResults() != null ? scan.getNmapResults().size() : 0);
        summary.setSqlVulnerabilities(scan.getSqlMapResults() != null ? scan.getSqlMapResults().size() : 0);
        summary.setWebVulnerabilities(scan.getNiktoResults() != null ? scan.getNiktoResults().size() : 0);
        summary.setTotalCves(scan.getCveResults() != null ? scan.getCveResults().size() : 0);
        dto.setSummary(summary);

        return dto;
    }

    private ScanResponseDTO convertToResponseDTOWithResults(Scan scan) {
        ScanResponseDTO dto = convertToResponseDTO(scan);

        dto.setNmapResults(scan.getNmapResults().stream()
                .map(r -> new ScanResponseDTO.NmapResultDTO(
                        r.getId(), r.getPort(), r.getProtocol(), r.getService(), r.getVersion(), r.getState()))
                .collect(Collectors.toList()));

        dto.setSqlMapResults(scan.getSqlMapResults().stream()
                .map(r -> new ScanResponseDTO.SqlMapResultDTO(
                        r.getId(), r.getVulnerabilityType(), r.getPayload(), r.getParameter(), r.getDescription()))
                .collect(Collectors.toList()));

        dto.setNiktoResults(scan.getNiktoResults().stream()
                .map(r -> new ScanResponseDTO.NiktoResultDTO(
                        r.getId(), r.getOsvdbId(), r.getMethod(), r.getUri(), r.getDescription()))
                .collect(Collectors.toList()));

        dto.setCveResults(scan.getCveResults().stream()
                .map(r -> new ScanResponseDTO.CveResultDTO(
                        r.getId(), r.getCveId(), r.getDescription(), r.getCvssV3Score(),
                        r.getCvssV3Severity(), r.getPublishedDate(), r.getLastModifiedDate(),
                        r.getReferences()))
                .collect(Collectors.toList()));

        return dto;
    }

    public void launchScan(String target, Long userId) {
        new Thread(() -> {
            try {
                String normalizedTarget = normalizeTarget(target);
                if (normalizedTarget == null || normalizedTarget.isBlank()) {
                    System.err.println("Invalid target provided, aborting scan.");
                    return;
                }
                String targetUrl = buildTargetUrl(target);
                String nmapTarget = resolveToIp(normalizedTarget);
                if (nmapTarget == null) {
                    nmapTarget = normalizedTarget;
                }

                System.out.println("Launching scan for target: " + target);
                System.out.println("Normalized target for scanner: " + normalizedTarget);
                System.out.println("Nmap target: " + nmapTarget);

                java.io.File scannerScript = resolveScannerScript();
                if (scannerScript == null) {
                    System.err.println("Scanner script not found in expected locations. Aborting launch.");
                    return;
                }
                System.out.println("Using scanner script at: " + scannerScript.getAbsolutePath());

                String pythonCmd = "python3";
                try {
                    new ProcessBuilder("python3", "--version").start().waitFor();
                } catch (Exception e) {
                    pythonCmd = "python";
                }

                System.out.println("Using python command: " + pythonCmd);

                ProcessBuilder pb = new ProcessBuilder(
                        pythonCmd,
                        scannerScript.getAbsolutePath(),
                        nmapTarget);

                if (targetUrl != null && !targetUrl.isBlank()) {
                    pb.command().add("--url");
                    pb.command().add(targetUrl);
                }

                pb.directory(scannerScript.getParentFile());
                System.out.println("Setting working directory to: " + scannerScript.getParentFile().getAbsolutePath());

                java.util.Map<String, String> env = pb.environment();
                String pythonPath = "/Users/nazim/Library/Python/3.9/lib/python/site-packages";
                String existingPath = env.get("PYTHONPATH");
                if (existingPath != null)
                    env.put("PYTHONPATH", pythonPath + ":" + existingPath);
                else
                    env.put("PYTHONPATH", pythonPath);

                pb.redirectErrorStream(true);

                Process process = pb.start();

                try (java.io.BufferedReader reader = new java.io.BufferedReader(
                        new java.io.InputStreamReader(process.getInputStream()))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        System.out.println("[Scanner] " + line);
                    }
                }

                int exitCode = process.waitFor();
                System.out.println("Scanner finished with exit code: " + exitCode);

            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }

    private String normalizeTarget(String target) {
        if (target == null)
            return null;

        String trimmed = target.trim();
        if (trimmed.isEmpty())
            return null;

        try {
            URI uri = trimmed.contains("://") ? new URI(trimmed) : new URI("http://" + trimmed);
            if (uri.getHost() != null) {
                return uri.getHost();
            }
            return trimmed;
        } catch (URISyntaxException e) {
            return trimmed;
        }
    }

    private String buildTargetUrl(String target) {
        if (target == null)
            return null;

        String trimmed = target.trim();
        if (trimmed.isEmpty())
            return null;

        if (!trimmed.contains("://")) {
            return "http://" + trimmed;
        }

        try {
            URI uri = new URI(trimmed);
            String scheme = uri.getScheme() == null ? "http" : uri.getScheme();
            String authority = uri.getAuthority();
            if (authority != null) {
                return scheme + "://" + authority + (uri.getPath() == null ? "" : uri.getPath());
            }
            return trimmed;
        } catch (URISyntaxException e) {
            return trimmed.startsWith("http") ? trimmed : "http://" + trimmed;
        }
    }

    private String resolveToIp(String host) {
        try {
            InetAddress address = InetAddress.getByName(host);
            return address.getHostAddress();
        } catch (Exception e) {
            System.err.println("Unable to resolve host to IP: " + host + " (" + e.getMessage() + ")");
            return null;
        }
    }

    private java.io.File resolveScannerScript() {
        Path userDir = Paths.get(System.getProperty("user.dir")).toAbsolutePath();
        System.out.println("Current working directory: " + userDir);

        Path repoRoot = userDir.getFileName().toString().equalsIgnoreCase("backend") && userDir.getParent() != null
                ? userDir.getParent()
                : userDir;

        Path[] candidates = new Path[] {
                repoRoot.resolve("scanner/scanner.py"),
                userDir.resolve("scanner/scanner.py"),
                repoRoot.getParent() != null ? repoRoot.getParent().resolve("scanner/scanner.py") : null
        };

        for (Path candidate : candidates) {
            if (candidate != null && Files.exists(candidate)) {
                return candidate.toFile();
            }
        }

        System.err.println("Scanner script not found. Checked:");
        for (Path candidate : candidates) {
            if (candidate != null) {
                System.err.println(" - " + candidate.toAbsolutePath());
            }
        }
        return null;
    }
}
