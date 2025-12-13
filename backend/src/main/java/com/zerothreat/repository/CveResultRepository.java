package com.zerothreat.repository;

import com.zerothreat.entity.CveResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CveResultRepository extends JpaRepository<CveResult, Long> {

    List<CveResult> findByScanId(Long scanId);
}
