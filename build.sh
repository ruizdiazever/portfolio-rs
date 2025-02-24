#!/bin/bash

# Build the services
echo "Building Portfolio..."
sudo docker compose -p portfolio build --no-cache
sudo docker compose -p portfolio up -d --force-recreate
echo "Portfolio started and running in the background."
