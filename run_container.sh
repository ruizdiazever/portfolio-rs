#!/usr/bin/bash
sudo docker build -t portfolio-rs .
sudo docker run -p 3000:3000 -d portfolio-rs
