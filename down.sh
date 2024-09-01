#!/bin/bash

# Stop and remove the services
echo "Stopping PostgreSQL and RedisDB of BERLi System..."
sudo docker compose down

echo "PostgreSQL and RedisDB of BERLi System stopped."
