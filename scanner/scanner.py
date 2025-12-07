#!/usr/bin/env python3
"""
ZeroThreat - Vulnerability Scanner
Automated security scanning using Nmap, SQLMap, and Nikto
"""

import subprocess
import json
import re
import requests
from datetime import datetime
from typing import Dict, List, Optional
import logging
from pathlib import Path
import sys
from urllib.parse import urlparse, urlunparse

# Configuration
from config import Config

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('scanner.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)


class VulnerabilityScanner:
    """Main scanner class orchestrating Nmap, SQLMap, and Nikto scans"""
    
    def __init__(self, target_ip: str, target_url: Optional[str] = None):
        """
        Initialize scanner with target information. Accepts IPs, hostnames or full URLs.
        
        Args:
            target_ip: Target host/IP or URL to scan
            target_url: Optional URL override for web vulnerability scanning
        """
        self.target_ip, normalized_url = self._normalize_targets(target_ip, target_url)
        self.target_url = normalized_url
        self.timestamp = datetime.now().isoformat()
        self.results = {
            "target": normalized_url,
            "timestamp": self.timestamp,
            "nmap": [],
            "sqlmap": [],
            "nikto": []
        }

    @staticmethod
    def _normalize_targets(raw_target: str, web_target: Optional[str]) -> tuple[str, str]:
        """
        Normalize the raw target so Nmap gets a clean host/IP and web scanners get a full URL.
        """
        if not raw_target or not raw_target.strip():
            raise ValueError("Target IP/URL is required")

        cleaned_target = raw_target.strip()

        # Normalize Nmap target: strip scheme if provided so hostnames/ips are valid.
        parsed_target = urlparse(cleaned_target if "://" in cleaned_target else f"//{cleaned_target}", allow_fragments=False)
        nmap_target = parsed_target.hostname or cleaned_target

        # Normalize web target: prefer explicit override, otherwise reuse the main target.
        web_target_value = web_target.strip() if web_target else cleaned_target
        parsed_web = urlparse(web_target_value if "://" in web_target_value else f"http://{web_target_value}")

        netloc = parsed_web.netloc or parsed_web.path
        path = parsed_web.path if parsed_web.netloc else ""
        normalized_url = urlunparse((
            parsed_web.scheme or "http",
            netloc,
            path,
            parsed_web.params,
            parsed_web.query,
            parsed_web.fragment
        ))

        logger.info(f"Normalized targets -> Nmap: {nmap_target}, Web: {normalized_url}")
        return nmap_target, normalized_url
    
    def run_nmap_scan(self) -> List[Dict]:
        """
        Execute Nmap port scan with service/version detection
        
        Returns:
            List of discovered ports with service information
        """
        logger.info(f"Starting Nmap scan on {self.target_ip}")
        
        try:
            # Nmap command: -sV (version detection), -T4 (faster), --top-ports (common ports)
            cmd = [
                "nmap",
                "-sV",  # Service version detection
                "-Pn",  # Skip host discovery (treat host as up), useful when ping is blocked
                "-T4",  # Timing template (faster)
                "--top-ports", "100",  # Scan top 100 ports
                "-oX", "-",  # XML output to stdout
                self.target_ip
            ]
            
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=Config.NMAP_TIMEOUT
            )
            
            if result.returncode != 0:
                logger.error(f"Nmap scan failed: {result.stderr}")
                return []
            
            # Parse Nmap XML output
            nmap_results = self._parse_nmap_output(result.stdout)
            logger.info(f"Nmap scan completed: {len(nmap_results)} ports found")
            
            return nmap_results
            
        except subprocess.TimeoutExpired:
            logger.error(f"Nmap scan timed out after {Config.NMAP_TIMEOUT}s")
            return []
        except FileNotFoundError:
            logger.error("Nmap not found. Please install nmap.")
            return []
        except Exception as e:
            logger.error(f"Nmap scan error: {str(e)}")
            return []
    
    def _parse_nmap_output(self, xml_output: str) -> List[Dict]:
        """Parse Nmap XML output to extract port information"""
        import xml.etree.ElementTree as ET
        
        ports = []
        
        try:
            root = ET.fromstring(xml_output)
            
            # Find all port elements
            for port_elem in root.findall('.//port'):
                port_id = port_elem.get('portid')
                protocol = port_elem.get('protocol')
                
                # Get state
                state_elem = port_elem.find('state')
                state = state_elem.get('state') if state_elem is not None else 'unknown'
                
                # Only include open ports
                if state == 'open':
                    # Get service information
                    service_elem = port_elem.find('service')
                    if service_elem is not None:
                        service_name = service_elem.get('name', 'unknown')
                        product = service_elem.get('product', '')
                        version = service_elem.get('version', '')
                        service_info = f"{product} {version}".strip() or service_name
                    else:
                        service_name = 'unknown'
                        service_info = ''
                    
                    ports.append({
                        "port": int(port_id),
                        "protocol": protocol,
                        "state": state,
                        "service": service_name,
                        "version": service_info
                    })
            
            logger.info(f"Parsed {len(ports)} open ports from XML")
            
        except ET.ParseError as e:
            logger.error(f"Failed to parse XML output: {e}")
        except Exception as e:
            logger.error(f"Error parsing nmap output: {e}")
        
        return ports
    
    def run_sqlmap_scan(self) -> List[Dict]:
        """
        Execute SQLMap scan for SQL injection vulnerabilities
        
        Returns:
            List of detected SQL injection vulnerabilities
        """
        logger.info(f"Starting SQLMap scan on {self.target_url}")
        
        try:
            # SQLMap command: --batch (non-interactive), --risk/level for thoroughness
            cmd = [
                "sqlmap",
                "-u", self.target_url,
                "--batch",  # Non-interactive mode
                "--risk=1",  # Risk level (1-3)
                "--level=1",  # Test level (1-5)
                "--output-dir=/tmp/sqlmap_output",
                "--flush-session",
                "--fresh-queries"
            ]
            
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=Config.SQLMAP_TIMEOUT
            )
            
            # Parse SQLMap output
            sqlmap_results = self._parse_sqlmap_output(result.stdout)
            logger.info(f"SQLMap scan completed: {len(sqlmap_results)} vulnerabilities found")
            
            return sqlmap_results
            
        except subprocess.TimeoutExpired:
            logger.error(f"SQLMap scan timed out after {Config.SQLMAP_TIMEOUT}s")
            return []
        except FileNotFoundError:
            logger.error("SQLMap not found. Please install sqlmap.")
            return []
        except Exception as e:
            logger.error(f"SQLMap scan error: {str(e)}")
            return []
    
    def _parse_sqlmap_output(self, output: str) -> List[Dict]:
        """Parse SQLMap output to extract vulnerability information"""
        vulnerabilities = []
        
        # Check for SQL injection indicators
        if "is vulnerable" in output.lower() or "injectable" in output.lower():
            # Extract parameter and injection type
            param_pattern = r"Parameter: ([^\s]+)"
            type_pattern = r"Type: ([^\n]+)"
            payload_pattern = r"Payload: ([^\n]+)"
            
            param_match = re.search(param_pattern, output)
            type_match = re.search(type_pattern, output)
            payload_match = re.search(payload_pattern, output)
            
            vulnerabilities.append({
                "vulnerability_type": type_match.group(1) if type_match else "SQL Injection",
                "parameter": param_match.group(1) if param_match else "unknown",
                "payload": payload_match.group(1) if payload_match else "",
                "description": "SQL injection vulnerability detected"
            })
        
        # If no vulnerabilities found
        if not vulnerabilities and "all tested parameters" in output.lower():
            logger.info("No SQL injection vulnerabilities detected")
        
        return vulnerabilities
    
    def run_nikto_scan(self) -> List[Dict]:
        """
        Execute Nikto web vulnerability scan
        
        Returns:
            List of detected web vulnerabilities
        """
        logger.info(f"Starting Nikto scan on {self.target_url}")
        
        try:
            # Nikto command: -h (host), -output (JSON format if supported)
            cmd = [
                "nikto",
                "-h", self.target_url,
                "-Format", "csv",
                "-output", "/tmp/nikto_output.csv"
            ]
            
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=Config.NIKTO_TIMEOUT
            )
            
            # Parse Nikto output
            nikto_results = self._parse_nikto_output(result.stdout)
            logger.info(f"Nikto scan completed: {len(nikto_results)} findings")
            
            return nikto_results
            
        except subprocess.TimeoutExpired:
            logger.error(f"Nikto scan timed out after {Config.NIKTO_TIMEOUT}s")
            return []
        except FileNotFoundError:
            logger.error("Nikto not found. Please install nikto.")
            return []
        except Exception as e:
            logger.error(f"Nikto scan error: {str(e)}")
            return []
    
    def _parse_nikto_output(self, output: str) -> List[Dict]:
        """Parse Nikto output to extract vulnerability information"""
        findings = []
        
        # Parse CSV-like output
        lines = output.strip().split('\n')
        for line in lines:
            if line and not line.startswith('#'):
                parts = line.split(',')
                if len(parts) >= 4:
                    findings.append({
                        "osvdb_id": parts[0].strip('"') if len(parts) > 0 else "",
                        "method": parts[1].strip('"') if len(parts) > 1 else "GET",
                        "uri": parts[2].strip('"') if len(parts) > 2 else "/",
                        "description": parts[3].strip('"') if len(parts) > 3 else ""
                    })
        
        return findings
    
    def aggregate_results(self) -> Dict:
        """
        Run all scans and aggregate results into a single JSON structure
        
        Returns:
            Complete scan results dictionary
        """
        logger.info(f"Starting comprehensive scan of {self.target_ip}")
        
        # Run all scans
        self.results["nmap"] = self.run_nmap_scan()
        self.results["sqlmap"] = self.run_sqlmap_scan()
        self.results["nikto"] = self.run_nikto_scan()
        
        # Add summary statistics
        self.results["summary"] = {
            "total_open_ports": len(self.results["nmap"]),
            "sql_vulnerabilities": len(self.results["sqlmap"]),
            "web_vulnerabilities": len(self.results["nikto"]),
            "scan_completed": datetime.now().isoformat()
        }
        
        logger.info("Scan completed successfully")
        return self.results
    
    def send_to_api(self, results: Dict) -> bool:
        """
        Send scan results to Spring Boot API
        
        Args:
            results: Scan results dictionary
            
        Returns:
            True if successful, False otherwise
        """
        logger.info(f"Sending results to API: {Config.API_ENDPOINT}")
        
        try:
            headers = {
                "Content-Type": "application/json"
            }
            
            # Add authentication token if configured
            if Config.API_TOKEN:
                headers["Authorization"] = f"Bearer {Config.API_TOKEN}"
            
            response = requests.post(
                Config.API_ENDPOINT,
                json=results,
                headers=headers,
                timeout=30
            )
            
            if response.status_code in [200, 201]:
                logger.info(f"Results sent successfully. Response: {response.json()}")
                return True
            else:
                logger.error(f"API request failed: {response.status_code} - {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to send results to API: {str(e)}")
            return False
    
    def save_results_locally(self, results: Dict, filename: str = None):
        """Save results to local JSON file as backup"""
        if not filename:
            filename = f"scan_results_{self.target_ip}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        output_path = Path("results") / filename
        output_path.parent.mkdir(exist_ok=True)
        
        with open(output_path, 'w') as f:
            json.dump(results, f, indent=2)
        
        logger.info(f"Results saved to {output_path}")


def main():
    """Main entry point for the scanner"""
    import argparse
    
    parser = argparse.ArgumentParser(description='ZeroThreat Vulnerability Scanner')
    parser.add_argument('target', help='Target IP/hostname or URL to scan')
    parser.add_argument('--url', help='Optional URL for web scanning (defaults to target)', default=None)
    parser.add_argument('--no-api', action='store_true', help='Skip sending results to API')
    parser.add_argument('--save-local', action='store_true', help='Save results locally')
    
    args = parser.parse_args()
    
    # Create scanner instance
    scanner = VulnerabilityScanner(args.target, args.url)
    
    # Run scans
    results = scanner.aggregate_results()
    
    # Display results summary
    print("\n" + "="*60)
    print("ZEROTHREAT SCAN RESULTS")
    print("="*60)
    print(f"Target: {results['target']}")
    print(f"Timestamp: {results['timestamp']}")
    print(f"Open Ports: {results['summary']['total_open_ports']}")
    print(f"SQL Vulnerabilities: {results['summary']['sql_vulnerabilities']}")
    print(f"Web Vulnerabilities: {results['summary']['web_vulnerabilities']}")
    print("="*60 + "\n")
    
    # Save locally if requested
    if args.save_local:
        scanner.save_results_locally(results)
    
    # Send to API unless disabled
    if not args.no_api:
        scanner.send_to_api(results)
    else:
        logger.info("Skipping API submission (--no-api flag set)")


if __name__ == "__main__":
    main()
