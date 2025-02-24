#!/bin/bash

# Build the services
echo "Building Portfolio..."
sudo docker compose build --project-name portfolio --no-cache && sudo docker compose --project-name portfolio up -d --force-recreate
echo "Portfolio started and running in the background."
