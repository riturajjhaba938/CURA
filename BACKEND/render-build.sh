#!/usr/bin/env bash
# Render Build Script — installs Node.js + Python dependencies
set -e

echo "=== Installing Node.js dependencies ==="
npm install

echo "=== Installing Python dependencies for scraper ==="
pip install -r scripts/requirements.txt

echo "=== Build complete ==="

echo "=== Build complete ==="
