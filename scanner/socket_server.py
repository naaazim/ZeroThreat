#!/usr/bin/env python3
"""
ZeroThreat - Socket Server for Vulnerability Scanner
Receives scan results via sockets and serves them to web clients
"""

import socket
import json
import threading
import logging
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import time
from datetime import datetime

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('socket_server.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class ScanResultsStore:
    """Store scan results in memory"""
    
    def __init__(self):
        self.results = {}
        self.lock = threading.Lock()
    
    def add_result(self, scan_id: str, result: dict):
        """Add scan result to store"""
        with self.lock:
            self.results[scan_id] = result
            logger.info(f"Added scan result for {scan_id}")
    
    def get_result(self, scan_id: str) -> dict:
        """Get scan result by ID"""
        with self.lock:
            return self.results.get(scan_id)
    
    def get_all_results(self) -> dict:
        """Get all scan results"""
        with self.lock:
            return self.results.copy()

# Global results store
results_store = ScanResultsStore()

class SocketServer:
    """Socket server to receive scan results from scanner"""
    
    def __init__(self, host='0.0.0.0', port=5000):
        self.host = host
        self.port = port
        self.server_socket = None
        self.running = False
    
    def start(self):
        """Start the socket server"""
        self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.server_socket.bind((self.host, self.port))
        self.server_socket.listen(5)
        
        logger.info(f"Socket server started on {self.host}:{self.port}")
        self.running = True
        
        try:
            while self.running:
                client_socket, addr = self.server_socket.accept()
                logger.info(f"Connection from {addr}")
                
                # Handle client in a new thread
                client_thread = threading.Thread(
                    target=self._handle_client,
                    args=(client_socket, addr)
                )
                client_thread.daemon = True
                client_thread.start()
        except Exception as e:
            logger.error(f"Socket server error: {e}")
        finally:
            self.stop()
    
    def _handle_client(self, client_socket, addr):
        """Handle a client connection"""
        try:
            # Receive data
            data = b''
            while True:
                chunk = client_socket.recv(4096)
                if not chunk:
                    break
                data += chunk
            
            if data:
                # Parse JSON data
                try:
                    result_data = json.loads(data.decode('utf-8'))
                    scan_id = result_data.get('scan_id', f"scan_{int(time.time())}")
                    
                    # Store result
                    results_store.add_result(scan_id, result_data)
                    
                    # Send acknowledgment
                    response = json.dumps({
                        "status": "success",
                        "scan_id": scan_id,
                        "message": "Results received successfully"
                    })
                    client_socket.sendall(response.encode('utf-8'))
                    
                    logger.info(f"Received scan results for {scan_id}")
                except json.JSONDecodeError:
                    error_response = json.dumps({
                        "status": "error",
                        "message": "Invalid JSON data"
                    })
                    client_socket.sendall(error_response.encode('utf-8'))
                    logger.error(f"Invalid JSON data from {addr}")
        except Exception as e:
            logger.error(f"Error handling client {addr}: {e}")
        finally:
            client_socket.close()
    
    def stop(self):
        """Stop the socket server"""
        self.running = False
        if self.server_socket:
            self.server_socket.close()
        logger.info("Socket server stopped")


class WebHandler(BaseHTTPRequestHandler):
    """HTTP handler for serving scan results"""
    
    def _set_headers(self, content_type='application/json'):
        """Set common headers"""
        self.send_response(200)
        self.send_header('Content-type', content_type)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_OPTIONS(self):
        """Handle OPTIONS requests for CORS"""
        self._set_headers()
    
    def do_GET(self):
        """Handle GET requests"""
        parsed_url = urlparse(self.path)
        
        # Handle different endpoints
        if parsed_url.path == '/api/scans':
            # Get all scans
            self._handle_get_all_scans()
        elif parsed_url.path.startswith('/api/scans/'):
            # Get specific scan
            scan_id = parsed_url.path.split('/')[-1]
            self._handle_get_scan(scan_id)
        elif parsed_url.path == '/':
            # Serve simple HTML page
            self._serve_html()
        else:
            # 404 for unknown paths
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b'Not Found')
    
    def _handle_get_all_scans(self):
        """Return all scan results"""
        self._set_headers()
        all_results = results_store.get_all_results()
        response = json.dumps({
            "status": "success",
            "scans": all_results
        })
        self.wfile.write(response.encode('utf-8'))
    
    def _handle_get_scan(self, scan_id: str):
        """Return specific scan result"""
        self._set_headers()
        result = results_store.get_result(scan_id)
        
        if result:
            response = json.dumps({
                "status": "success",
                "scan": result
            })
        else:
            response = json.dumps({
                "status": "error",
                "message": "Scan not found"
            })
        
        self.wfile.write(response.encode('utf-8'))
    
    def _serve_html(self):
        """Serve simple HTML page with scan results"""
        self._set_headers('text/html')
        
        html_content = """
        <!DOCTYPE html>
        <html>
        <head>
            <title>ZeroThreat Scan Results</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { color: #333; }
                .scan { border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 5px; }
                .scan h2 { margin-top: 0; }
                .vulnerability { background: #fff8e1; padding: 10px; margin: 5px 0; border-left: 3px solid #ffc107; }
                .port { background: #e3f2fd; padding: 10px; margin: 5px 0; border-left: 3px solid #2196f3; }
            </style>
        </head>
        <body>
            <h1>ZeroThreat Scan Results</h1>
            <div id="scans"></div>
            
            <script>
                async function fetchScans() {
                    try {
                        const response = await fetch('/api/scans');
                        const data = await response.json();
                        
                        const scansDiv = document.getElementById('scans');
                        
                        if (data.scans && Object.keys(data.scans).length > 0) {
                            Object.entries(data.scans).forEach(([scanId, scan]) => {
                                const scanDiv = document.createElement('div');
                                scanDiv.className = 'scan';
                                scanDiv.innerHTML = `
                                    <h2>Scan: ${scanId}</h2>
                                    <p><strong>Target:</strong> ${scan.target || 'N/A'}</p>
                                    <p><strong>Timestamp:</strong> ${scan.timestamp || 'N/A'}</p>
                                    <p><strong>Completed:</strong> ${scan.summary?.scan_completed || 'N/A'}</p>
                                    
                                    <h3>Open Ports (${scan.nmap?.length || 0})</h3>
                                    ${scan.nmap?.map(port => `
                                        <div class="port">
                                            <strong>Port ${port.port}:</strong> ${port.service} (${port.version})
                                        </div>
                                    `).join('') || '<p>No open ports found</p>'}
                                    
                                    <h3>SQL Vulnerabilities (${scan.sqlmap?.length || 0})</h3>
                                    ${scan.sqlmap?.map(vuln => `
                                        <div class="vulnerability">
                                            <strong>${vuln.vulnerability_type}:</strong> ${vuln.description}
                                            <p>Parameter: ${vuln.parameter}</p>
                                        </div>
                                    `).join('') || '<p>No SQL vulnerabilities found</p>'}
                                    
                                    <h3>Web Vulnerabilities (${scan.nikto?.length || 0})</h3>
                                    ${scan.nikto?.map(vuln => `
                                        <div class="vulnerability">
                                            <strong>${vuln.osvdb_id || 'Vulnerability'}:</strong> ${vuln.description}
                                            <p>URI: ${vuln.uri}</p>
                                        </div>
                                    `).join('') || '<p>No web vulnerabilities found</p>'}
                                `;
                                scansDiv.appendChild(scanDiv);
                            });
                        } else {
                            scansDiv.innerHTML = '<p>No scan results available</p>';
                        }
                    } catch (error) {
                        console.error('Error fetching scans:', error);
                        document.getElementById('scans').innerHTML = '<p>Error loading scan results</p>';
                    }
                }
                
                // Fetch scans when page loads
                fetchScans();
                
                // Refresh every 30 seconds
                setInterval(fetchScans, 30000);
            </script>
        </body>
        </html>
        """
        
        self.wfile.write(html_content.encode('utf-8'))


class WebServer:
    """Simple web server to display scan results"""
    
    def __init__(self, host='0.0.0.0', port=8000):
        self.host = host
        self.port = port
        self.server = None
    
    def start(self):
        """Start the web server"""
        server_address = (self.host, self.port)
        self.server = HTTPServer(server_address, WebHandler)
        
        logger.info(f"Web server started on http://{self.host}:{self.port}")
        
        try:
            self.server.serve_forever()
        except KeyboardInterrupt:
            logger.info("Web server stopped")
        except Exception as e:
            logger.error(f"Web server error: {e}")
    
    def stop(self):
        """Stop the web server"""
        if self.server:
            self.server.shutdown()
        logger.info("Web server stopped")


def main():
    """Main entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(description='ZeroThreat Socket Server')
    parser.add_argument('--socket-host', default='0.0.0.0', help='Socket server host')
    parser.add_argument('--socket-port', type=int, default=5000, help='Socket server port')
    parser.add_argument('--web-host', default='0.0.0.0', help='Web server host')
    parser.add_argument('--web-port', type=int, default=8000, help='Web server port')
    
    args = parser.parse_args()
    
    # Start socket server in a separate thread
    socket_server = SocketServer(args.socket_host, args.socket_port)
    socket_thread = threading.Thread(target=socket_server.start)
    socket_thread.daemon = True
    socket_thread.start()
    
    # Start web server
    web_server = WebServer(args.web_host, args.web_port)
    web_server.start()


if __name__ == "__main__":
    main()