package com.zerothreat.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "nmap_results")
@Data
@EqualsAndHashCode(exclude = "scan")
@ToString(exclude = "scan")
@NoArgsConstructor
@AllArgsConstructor
public class NmapResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scan_id", nullable = false)
    private Scan scan;

    @Column(nullable = false)
    private Integer port;

    @Column(length = 20)
    private String protocol;

    @Column(length = 100)
    private String service;

    @Column(length = 255)
    private String version;

    @Column(nullable = false, length = 20)
    private String state;
}
