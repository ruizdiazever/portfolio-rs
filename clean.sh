#!/bin/bash
docker volume ls -q | grep -v "portfolio_redis_data" | xargs -r docker volume rm
docker system prune -a
