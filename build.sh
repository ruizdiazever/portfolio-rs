#!/bin/bash

# Build the services
echo "Building Portfolio WASM..."
sudo docker compose build --no-cache && sudo docker compose up -d
echo "Portfolio WASM started and running in the background."
