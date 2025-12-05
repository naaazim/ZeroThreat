package com.zerothreat.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "scans")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Scan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String target;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ScanStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // -------------------------
    // FIX Hibernate MultipleBagFetchException:
    // Use Set instead of List
    // -------------------------

    @OneToMany(
            mappedBy = "scan",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private Set<NmapResult> nmapResults = new HashSet<>();

    @OneToMany(
            mappedBy = "scan",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private Set<SqlMapResult> sqlMapResults = new HashSet<>();

    @OneToMany(
            mappedBy = "scan",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private Set<NiktoResult> niktoResults = new HashSet<>();

    // -------------------------
    // Auto timestamps
    // -------------------------
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = ScanStatus.COMPLETED;
        }
    }

    public enum ScanStatus {
        PENDING,
        RUNNING,
        COMPLETED,
        FAILED
    }
}
