#!/usr/bin/env python3

import socket
import json
from datetime import datetime

# Test simple pour vérifier que le serveur socket répond
try:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(3)
        s.connect(('localhost', 5000))
        
        # Envoyer un petit test
        test_data = {
            'scan_id': 'test_123',
            'target': '127.0.0.1',
            'timestamp': datetime.now().isoformat(),
            'nmap': [],
            'sqlmap': [],
            'nikto': [],
            'summary': {
                'total_open_ports': 0,
                'sql_vulnerabilities': 0,
                'web_vulnerabilities': 0,
                'scan_completed': datetime.now().isoformat()
            }
        }
        
        s.sendall(json.dumps(test_data).encode('utf-8'))
        response = s.recv(1024).decode('utf-8')
        print('✅ Socket server is working!')
        print(f'Response: {response}')
        
except Exception as e:
    print(f'❌ Socket server test failed: {e}')