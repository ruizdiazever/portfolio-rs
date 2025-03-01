#!/bin/bash
sudo docker volume ls -q | grep -v "portfolio_redis_data" | xargs -r docker volume rm
sudo docker system prune -a
