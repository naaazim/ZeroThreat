#!/usr/bin/env python3
"""
Test script for socket connection between scanner and socket server
"""

import socket
import json
import time
import threading
from datetime import datetime

def test_socket_server():
    """Test the socket server by sending a mock scan result"""
    
    # Mock scan result
    mock_result = {
        "scan_id": f"test_scan_{int(time.time())}",
        "target": "127.0.0.1",
        "timestamp": datetime.now().isoformat(),
        "nmap": [
            {
                "port": 80,
                "protocol": "tcp",
                "state": "open",
                "service": "http",
                "version": "Apache 2.4.41"
            }
        ],
        "sqlmap": [],
        "nikto": [],
        "summary": {
            "total_open_ports": 1,
            "sql_vulnerabilities": 0,
            "web_vulnerabilities": 0,
            "scan_completed": datetime.now().isoformat()
        }
    }
    
    try:
        # Connect to socket server
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(5)
            s.connect(("localhost", 5000))
            
            # Send JSON data
            json_data = json.dumps(mock_result)
            s.sendall(json_data.encode('utf-8'))
            
            # Receive response
            response = s.recv(4096).decode('utf-8')
            response_data = json.loads(response)
            
            if response_data.get('status') == 'success':
                print("✅ Socket connection test PASSED")
                print(f"   Scan ID: {response_data.get('scan_id')}")
                print(f"   Message: {response_data.get('message')}")
                return True
            else:
                print("❌ Socket connection test FAILED")
                print(f"   Error: {response_data.get('message', 'Unknown error')}")
                return False
                
    except ConnectionRefusedError:
        print("❌ Socket connection test FAILED")
        print("   Error: Connection refused. Is the socket server running?")
        return False
    except Exception as e:
        print("❌ Socket connection test FAILED")
        print(f"   Error: {str(e)}")
        return False

def test_scanner_socket_method():
    """Test the scanner's socket sending method"""
    
    # Import the scanner module
    try:
        from scanner import VulnerabilityScanner
        from config import Config
        
        # Create a scanner instance
        scanner = VulnerabilityScanner("127.0.0.1")
        
        # Create mock results
        mock_results = {
            "target": "127.0.0.1",
            "timestamp": datetime.now().isoformat(),
            "nmap": [],
            "sqlmap": [],
            "nikto": [],
            "summary": {
                "total_open_ports": 0,
                "sql_vulnerabilities": 0,
                "web_vulnerabilities": 0,
                "scan_completed": datetime.now().isoformat()
            }
        }
        
        # Test the socket sending method
        success = scanner.send_via_socket(mock_results)
        
        if success:
            print("✅ Scanner socket method test PASSED")
            return True
        else:
            print("❌ Scanner socket method test FAILED")
            return False
            
    except Exception as e:
        print("❌ Scanner socket method test FAILED")
        print(f"   Error: {str(e)}")
        return False

def main():
    """Run all tests"""
    
    print("Testing ZeroThreat Socket System")
    print("=" * 40)
    
    # Test 1: Socket server connection
    print("\n1. Testing socket server connection...")
    test1_passed = test_socket_server()
    
    # Test 2: Scanner socket method
    print("\n2. Testing scanner socket method...")
    test2_passed = test_scanner_socket_method()
    
    # Summary
    print("\n" + "=" * 40)
    print("Test Summary:")
    print(f"  Socket Server Connection: {'PASSED' if test1_passed else 'FAILED'}")
    print(f"  Scanner Socket Method:    {'PASSED' if test2_passed else 'FAILED'}")
    
    if test1_passed and test2_passed:
        print("\n🎉 All tests PASSED! Socket system is working correctly.")
        return 0
    else:
        print("\n💥 Some tests FAILED. Check the errors above.")
        return 1

if __name__ == "__main__":
    exit(main())