"""
ZeroThreat Scanner Configuration
"""

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Config:
    """Configuration settings for the vulnerability scanner"""
    
    # API Configuration
    API_ENDPOINT = os.getenv(
        'API_ENDPOINT',
        'http://localhost:8080/api/scans/results'
    )
    API_TOKEN = os.getenv('API_TOKEN', '')
    
    # Scan Timeouts (in seconds)
    NMAP_TIMEOUT = int(os.getenv('NMAP_TIMEOUT', 300))  # 5 minutes
    SQLMAP_TIMEOUT = int(os.getenv('SQLMAP_TIMEOUT', 600))  # 10 minutes
    NIKTO_TIMEOUT = int(os.getenv('NIKTO_TIMEOUT', 600))  # 10 minutes
    
    # Tool Paths (optional, if tools are not in PATH)
    NMAP_PATH = os.getenv('NMAP_PATH', 'nmap')
    SQLMAP_PATH = os.getenv('SQLMAP_PATH', 'sqlmap')
    NIKTO_PATH = os.getenv('NIKTO_PATH', 'nikto')
    
    # Scan Options
    NMAP_TOP_PORTS = int(os.getenv('NMAP_TOP_PORTS', 100))
    SQLMAP_RISK_LEVEL = int(os.getenv('SQLMAP_RISK_LEVEL', 1))
    SQLMAP_TEST_LEVEL = int(os.getenv('SQLMAP_TEST_LEVEL', 1))
    
    # Output Configuration
    RESULTS_DIR = os.getenv('RESULTS_DIR', 'results')
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    
    # Socket Server Configuration
    SOCKET_SERVER_HOST = os.getenv('SOCKET_SERVER_HOST', 'localhost')
    SOCKET_SERVER_PORT = int(os.getenv('SOCKET_SERVER_PORT', 5000))
