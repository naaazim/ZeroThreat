#!/bin/bash

# ZeroThreat Socket Server Startup Script

echo "Starting ZeroThreat Socket Server..."
echo "===================================="

# Activate virtual environment if it exists
if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
    echo "Virtual environment activated"
fi

# Run the socket server
python3 socket_server.py --socket-host 0.0.0.0 --socket-port 5000 --web-host 0.0.0.0 --web-port 8000

echo "Socket server stopped"