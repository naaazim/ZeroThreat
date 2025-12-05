package com.zerothreat.controller;

import com.zerothreat.dto.ScanRequestDTO;
import com.zerothreat.dto.ScanResponseDTO;
import com.zerothreat.entity.Scan;
import com.zerothreat.service.ScanService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.Map;
import java.util.HashMap;
import org.springframework.http.HttpStatus;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/scans")
@CrossOrigin(origins = "*")
public class ScanController {

    @Autowired
    private ScanService scanService;

    /**
     * Endpoint to receive scan results from Python scanner
     */
    @PostMapping("/results")
    public ResponseEntity<Map<String, Object>> receiveScanResults(@Valid @RequestBody ScanRequestDTO request) {
        try {
            Scan scan = scanService.createScanFromRequest(request);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Scan results received successfully");
            response.put("scanId", scan.getId());

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to process scan results: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Get all scans (paginated)
     */
    @GetMapping
    public ResponseEntity<Page<ScanResponseDTO>> getAllScans(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ScanResponseDTO> scans = scanService.getAllScans(page, size);
        return ResponseEntity.ok(scans);
    }

    /**
     * Get detailed scan results by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ScanResponseDTO> getScanById(@PathVariable Long id) {
        System.out.println(">>> getScanById called with id = " + id);
        try {
            ScanResponseDTO scan = scanService.getScanById(id);
            return ResponseEntity.ok(scan);
        } catch (RuntimeException e) {
            System.out.println(">>> getScanById error: " + e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Launch a new scan
     */
    @PostMapping("/launch")
    public ResponseEntity<Map<String, Object>> launchScan(
            @Valid @RequestBody com.zerothreat.dto.LaunchScanRequestDTO request) {
        try {
            // In a real app, we would get the user ID from the security context
            Long userId = 1L;

            scanService.launchScan(request.getTarget(), userId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Scan launched successfully against " + request.getTarget());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to launch scan: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
