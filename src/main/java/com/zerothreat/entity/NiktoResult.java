package com.zerothreat.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "nikto_results")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NiktoResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scan_id", nullable = false)
    private Scan scan;

    @Column(name = "osvdb_id", length = 50)
    private String osvdbId;

    @Column(length = 10)
    private String method;

    @Column(length = 500)
    private String uri;

    @Column(columnDefinition = "TEXT")
    private String description;
}
