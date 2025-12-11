#!/bin/bash

# ZeroThreat Scanner with Socket Output

echo "Starting ZeroThreat Scanner with Socket Output..."
echo "=================================================="

# Activate virtual environment if it exists
if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
    echo "Virtual environment activated"
fi

# Check if target is provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 <target_ip_or_url> [--url <web_url>] [--save-local]"
    echo "Example: $0 192.168.1.1 --save-local"
    exit 1
fi

# Run the scanner with socket output
python3 scanner.py "$@" --use-socket --save-local

echo "Scanner completed"