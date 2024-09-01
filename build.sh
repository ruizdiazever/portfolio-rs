#!/bin/bash

# Build the services
echo "Building PostgreSQL and RedisDB of Portfolio WASM..."
sudo docker compose build  --no-cache

# Start the services in the background
echo "Starting the services..."
sudo docker compose up  -d

echo "PostgreSQL and RedisDB started and running in the background."
