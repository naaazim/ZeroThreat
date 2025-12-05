package com.zerothreat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScanResponseDTO {

    private Long id;
    private String target;
    private LocalDateTime timestamp;
    private String status;
    private LocalDateTime createdAt;
    private List<NmapResultDTO> nmapResults;
    private List<SqlMapResultDTO> sqlMapResults;
    private List<NiktoResultDTO> niktoResults;
    private ScanSummaryDTO summary;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NmapResultDTO {
        private Long id;
        private Integer port;
        private String protocol;
        private String service;
        private String version;
        private String state;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SqlMapResultDTO {
        private Long id;
        private String vulnerabilityType;
        private String payload;
        private String parameter;
        private String description;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NiktoResultDTO {
        private Long id;
        private String osvdbId;
        private String method;
        private String uri;
        private String description;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ScanSummaryDTO {
        private Integer totalOpenPorts;
        private Integer sqlVulnerabilities;
        private Integer webVulnerabilities;
    }
}
