package com.zerothreat.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "sqlmap_results")
@Data
@EqualsAndHashCode(exclude = "scan")
@ToString(exclude = "scan")
@NoArgsConstructor
@AllArgsConstructor
public class SqlMapResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scan_id", nullable = false)
    private Scan scan;

    @Column(name = "vulnerability_type", length = 100)
    private String vulnerabilityType;

    @Column(columnDefinition = "TEXT")
    private String payload;

    @Column(length = 255)
    private String parameter;

    @Column(columnDefinition = "TEXT")
    private String description;
}
