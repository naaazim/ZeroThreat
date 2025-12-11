#!/bin/bash
# Wrapper script to run scanner with correct Python environment

# Set PYTHONPATH to include user site-packages
export PYTHONPATH="/Users/nazim/Library/Python/3.9/lib/python/site-packages:$PYTHONPATH"

# Run the scanner
python3 "$(dirname "$0")/scanner.py" "$@"
