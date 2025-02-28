#!/bin/bash

# Build the services
echo "Building Portfolio..."
sudo docker compose -p portfolio build --no-cache api redis frontend
sudo docker compose -p portfolio up --force-recreate -d api redis frontend
echo "Portfolio started and running in the background."
