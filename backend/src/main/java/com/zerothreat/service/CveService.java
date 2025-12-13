package com.zerothreat.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class CveService {

    @Value("${nvd.api.url:https://services.nvd.nist.gov/rest/json/cves/2.0}")
    private String nvdApiUrl;

    @Value("${nvd.api.key:}")
    private String nvdApiKey;

    @Value("${nvd.api.rate.limit.delay:6000}")
    private int rateLimitDelay;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private long lastRequestTime = 0;

    public CveService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Search for CVEs based on product name and version using keyword search
     */
    public List<CveData> searchCvesByKeyword(String product, String version) {
        if (product == null || product.isBlank()) {
            return new ArrayList<>();
        }

        try {
            // Rate limiting: wait if needed
            enforceRateLimit();

            // Build search keyword from product and version
            String keyword = buildSearchKeyword(product, version);
            log.info("Searching CVEs for: {}", keyword);

            // Build API URL
            UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(nvdApiUrl)
                    .queryParam("keywordSearch", keyword)
                    .queryParam("resultsPerPage", "20");

            String url = uriBuilder.toUriString();

            // Prepare headers
            HttpHeaders headers = new HttpHeaders();
            if (nvdApiKey != null && !nvdApiKey.isBlank()) {
                headers.set("apiKey", nvdApiKey);
            }

            HttpEntity<String> entity = new HttpEntity<>(headers);

            // Make API call
            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    String.class);

            lastRequestTime = System.currentTimeMillis();

            // Parse response
            return parseCveResponse(response.getBody());

        } catch (Exception e) {
            log.error("Error searching CVEs for {} {}: {}", product, version, e.getMessage());
            return new ArrayList<>();
        }
    }

    /**
     * Enforce rate limiting between API calls
     */
    private void enforceRateLimit() {
        long currentTime = System.currentTimeMillis();
        long timeSinceLastRequest = currentTime - lastRequestTime;

        if (timeSinceLastRequest < rateLimitDelay) {
            long sleepTime = rateLimitDelay - timeSinceLastRequest;
            try {
                log.debug("Rate limiting: sleeping for {} ms", sleepTime);
                Thread.sleep(sleepTime);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                log.warn("Rate limiting sleep interrupted");
            }
        }
    }

    /**
     * Build search keyword from product and version
     */
    private String buildSearchKeyword(String product, String version) {
        String cleanProduct = product.trim();

        // If version is provided and not empty, include it
        if (version != null && !version.isBlank()) {
            String cleanVersion = version.trim();
            return cleanProduct + " " + cleanVersion;
        }

        return cleanProduct;
    }

    /**
     * Parse NVD API response and extract CVE data
     */
    private List<CveData> parseCveResponse(String jsonResponse) {
        List<CveData> cveDataList = new ArrayList<>();

        try {
            JsonNode root = objectMapper.readTree(jsonResponse);
            JsonNode vulnerabilities = root.path("vulnerabilities");

            if (vulnerabilities.isArray()) {
                for (JsonNode vulnNode : vulnerabilities) {
                    JsonNode cveNode = vulnNode.path("cve");

                    CveData cveData = new CveData();

                    // CVE ID
                    cveData.setCveId(cveNode.path("id").asText());

                    // Description
                    JsonNode descriptions = cveNode.path("descriptions");
                    if (descriptions.isArray() && descriptions.size() > 0) {
                        cveData.setDescription(descriptions.get(0).path("value").asText());
                    }

                    // Published and modified dates
                    String published = cveNode.path("published").asText();
                    String lastModified = cveNode.path("lastModified").asText();
                    cveData.setPublishedDate(parseNvdDateTime(published));
                    cveData.setLastModifiedDate(parseNvdDateTime(lastModified));

                    // CVSS v3 metrics
                    JsonNode metrics = cveNode.path("metrics");
                    JsonNode cvssV3 = metrics.path("cvssMetricV31");
                    if (cvssV3.isArray() && cvssV3.size() > 0) {
                        JsonNode cvssData = cvssV3.get(0).path("cvssData");
                        cveData.setCvssV3Score(cvssData.path("baseScore").asDouble());
                        cveData.setCvssV3Severity(cvssData.path("baseSeverity").asText());
                    } else {
                        // Try cvssMetricV30 as fallback
                        JsonNode cvssV30 = metrics.path("cvssMetricV30");
                        if (cvssV30.isArray() && cvssV30.size() > 0) {
                            JsonNode cvssData = cvssV30.get(0).path("cvssData");
                            cveData.setCvssV3Score(cvssData.path("baseScore").asDouble());
                            cveData.setCvssV3Severity(cvssData.path("baseSeverity").asText());
                        }
                    }

                    // References
                    JsonNode references = cveNode.path("references");
                    if (references.isArray()) {
                        StringBuilder refBuilder = new StringBuilder();
                        for (JsonNode ref : references) {
                            if (refBuilder.length() > 0)
                                refBuilder.append(";");
                            refBuilder.append(ref.path("url").asText());
                        }
                        cveData.setReferences(refBuilder.toString());
                    }

                    cveDataList.add(cveData);
                }
            }

            log.info("Found {} CVEs", cveDataList.size());

        } catch (Exception e) {
            log.error("Error parsing CVE response: {}", e.getMessage());
        }

        return cveDataList;
    }

    /**
     * Parse NVD datetime format to LocalDateTime
     */
    private LocalDateTime parseNvdDateTime(String dateTimeStr) {
        try {
            if (dateTimeStr != null && !dateTimeStr.isBlank()) {
                // NVD uses ISO-8601 format
                return LocalDateTime.parse(dateTimeStr, DateTimeFormatter.ISO_DATE_TIME);
            }
        } catch (Exception e) {
            log.warn("Failed to parse datetime: {}", dateTimeStr);
        }
        return null;
    }

    /**
     * Data class for CVE information
     */
    public static class CveData {
        private String cveId;
        private String description;
        private Double cvssV3Score;
        private String cvssV3Severity;
        private LocalDateTime publishedDate;
        private LocalDateTime lastModifiedDate;
        private String references;

        // Getters and setters
        public String getCveId() {
            return cveId;
        }

        public void setCveId(String cveId) {
            this.cveId = cveId;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public Double getCvssV3Score() {
            return cvssV3Score;
        }

        public void setCvssV3Score(Double cvssV3Score) {
            this.cvssV3Score = cvssV3Score;
        }

        public String getCvssV3Severity() {
            return cvssV3Severity;
        }

        public void setCvssV3Severity(String cvssV3Severity) {
            this.cvssV3Severity = cvssV3Severity;
        }

        public LocalDateTime getPublishedDate() {
            return publishedDate;
        }

        public void setPublishedDate(LocalDateTime publishedDate) {
            this.publishedDate = publishedDate;
        }

        public LocalDateTime getLastModifiedDate() {
            return lastModifiedDate;
        }

        public void setLastModifiedDate(LocalDateTime lastModifiedDate) {
            this.lastModifiedDate = lastModifiedDate;
        }

        public String getReferences() {
            return references;
        }

        public void setReferences(String references) {
            this.references = references;
        }
    }
}
