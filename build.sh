#!/bin/bash

# Build the services
echo "Building PostgreSQL and RedisDB..."
sudo docker compose -f docker-compose.db.yml build  --no-cache

# Start the services in the background
echo "Starting the services..."
sudo docker compose -f docker-compose.db.yml up  -d

echo "PostgreSQL and RedisDB started and running in the background."
