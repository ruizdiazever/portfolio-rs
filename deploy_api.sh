#!/bin/bash

# Build the services
echo "Building Portfolio..."
sudo docker compose -p portfolio build --no-cache api
sudo docker compose -p portfolio up --force-recreate -d --wait api
echo "Portfolio started and running in the background."
