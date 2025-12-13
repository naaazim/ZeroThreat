package com.zerothreat.repository;

import com.zerothreat.entity.Scan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScanRepository extends JpaRepository<Scan, Long> {

    @Query("SELECT s FROM Scan s ORDER BY s.createdAt DESC")
    List<Scan> findAllOrderByCreatedAtDesc();

    Page<Scan> findAllByOrderByCreatedAtDesc(Pageable pageable);

    List<Scan> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT DISTINCT s FROM Scan s LEFT JOIN FETCH s.nmapResults LEFT JOIN FETCH s.sqlMapResults LEFT JOIN FETCH s.niktoResults LEFT JOIN FETCH s.cveResults WHERE s.id = :id")
    java.util.Optional<Scan> findByIdWithResults(Long id);
}
