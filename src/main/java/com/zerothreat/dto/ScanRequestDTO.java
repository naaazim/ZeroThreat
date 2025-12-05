package com.zerothreat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScanRequestDTO {

    private String target;
    private String timestamp;
    private List<NmapResultDTO> nmap;
    private List<SqlMapResultDTO> sqlmap;
    private List<NiktoResultDTO> nikto;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NmapResultDTO {
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
        private String vulnerability_type;
        private String payload;
        private String parameter;
        private String description;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NiktoResultDTO {
        private String osvdb_id;
        private String method;
        private String uri;
        private String description;
    }
}
