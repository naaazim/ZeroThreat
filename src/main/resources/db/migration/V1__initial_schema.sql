-- ZeroThreat Database Schema
-- Version 1: Initial schema creation

-- Users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Scans table
CREATE TABLE scans (
    id BIGSERIAL PRIMARY KEY,
    target VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL,
    user_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_scan_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Nmap results table
CREATE TABLE nmap_results (
    id BIGSERIAL PRIMARY KEY,
    scan_id BIGINT NOT NULL,
    port INTEGER NOT NULL,
    protocol VARCHAR(20),
    service VARCHAR(100),
    version VARCHAR(255),
    state VARCHAR(20) NOT NULL,
    CONSTRAINT fk_nmap_scan FOREIGN KEY (scan_id) REFERENCES scans(id) ON DELETE CASCADE
);

-- SQLMap results table
CREATE TABLE sqlmap_results (
    id BIGSERIAL PRIMARY KEY,
    scan_id BIGINT NOT NULL,
    vulnerability_type VARCHAR(100),
    payload TEXT,
    parameter VARCHAR(255),
    description TEXT,
    CONSTRAINT fk_sqlmap_scan FOREIGN KEY (scan_id) REFERENCES scans(id) ON DELETE CASCADE
);

-- Nikto results table
CREATE TABLE nikto_results (
    id BIGSERIAL PRIMARY KEY,
    scan_id BIGINT NOT NULL,
    osvdb_id VARCHAR(50),
    method VARCHAR(10),
    uri VARCHAR(500),
    description TEXT,
    CONSTRAINT fk_nikto_scan FOREIGN KEY (scan_id) REFERENCES scans(id) ON DELETE CASCADE
);

-- Indexes for performance optimization
CREATE INDEX idx_scans_user_id ON scans(user_id);
CREATE INDEX idx_scans_timestamp ON scans(timestamp DESC);
CREATE INDEX idx_scans_created_at ON scans(created_at DESC);
CREATE INDEX idx_scans_status ON scans(status);

CREATE INDEX idx_nmap_scan_id ON nmap_results(scan_id);
CREATE INDEX idx_nmap_port ON nmap_results(port);
CREATE INDEX idx_nmap_state ON nmap_results(state);

CREATE INDEX idx_sqlmap_scan_id ON sqlmap_results(scan_id);
CREATE INDEX idx_sqlmap_vuln_type ON sqlmap_results(vulnerability_type);

CREATE INDEX idx_nikto_scan_id ON nikto_results(scan_id);

-- Comments for documentation
COMMENT ON TABLE users IS 'Stores user account information';
COMMENT ON TABLE scans IS 'Stores scan metadata and status';
COMMENT ON TABLE nmap_results IS 'Stores Nmap port scan results';
COMMENT ON TABLE sqlmap_results IS 'Stores SQLMap SQL injection findings';
COMMENT ON TABLE nikto_results IS 'Stores Nikto web vulnerability findings';
