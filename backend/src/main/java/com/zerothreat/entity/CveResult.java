package com.zerothreat.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;

@Entity
@Table(name = "cve_results")
@Data
@EqualsAndHashCode(exclude = { "scan", "nmapResult" })
@ToString(exclude = { "scan", "nmapResult" })
@NoArgsConstructor
@AllArgsConstructor
public class CveResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scan_id", nullable = false)
    private Scan scan;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nmap_result_id")
    private NmapResult nmapResult;

    @Column(nullable = false, length = 50)
    private String cveId;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "cvss_v3_score")
    private Double cvssV3Score;

    @Column(name = "cvss_v3_severity", length = 20)
    private String cvssV3Severity;

    @Column(name = "published_date")
    private LocalDateTime publishedDate;

    @Column(name = "last_modified_date")
    private LocalDateTime lastModifiedDate;

    @Column(name = "cve_references", columnDefinition = "TEXT")
    private String references;
}
