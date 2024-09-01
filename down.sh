#!/bin/bash

# Stop and remove the services
echo "Stopping PostgreSQL and RedisDB of Portfolio WASM..."
sudo docker compose down

echo "PostgreSQL and RedisDB of Portfolio WASM stopped."
