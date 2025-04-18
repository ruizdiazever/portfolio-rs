#!/usr/bin/bash
sudo docker compose --project-name portfolio build beszel-agent
sudo docker compose --project-name portfolio up -d --wait beszel-agent --force-recreate
