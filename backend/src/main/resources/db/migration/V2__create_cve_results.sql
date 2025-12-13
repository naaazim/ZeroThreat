-- Create cve_results table
CREATE TABLE cve_results (
    id BIGSERIAL PRIMARY KEY,
    scan_id BIGINT NOT NULL,
    nmap_result_id BIGINT,
    cve_id VARCHAR(50) NOT NULL,
    description TEXT,
    cvss_v3_score DOUBLE PRECISION,
    cvss_v3_severity VARCHAR(20),
    published_date TIMESTAMP,
    last_modified_date TIMESTAMP,
    cve_references TEXT,
    CONSTRAINT fk_cve_scan FOREIGN KEY (scan_id) REFERENCES scans(id) ON DELETE CASCADE,
    CONSTRAINT fk_cve_nmap FOREIGN KEY (nmap_result_id) REFERENCES nmap_results(id) ON DELETE SET NULL
);

-- Create indexes for performance
CREATE INDEX idx_cve_scan_id ON cve_results(scan_id);
CREATE INDEX idx_cve_nmap_result_id ON cve_results(nmap_result_id);
CREATE INDEX idx_cve_cve_id ON cve_results(cve_id);

-- Comments for documentation
COMMENT ON TABLE cve_results IS 'Stores CVE vulnerabilities found during scans';
