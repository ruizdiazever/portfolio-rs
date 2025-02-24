#!/bin/bash
sudo cp ./portfolio.service /etc/systemd/system/portfolio.service
sudo systemctl enable portfolio.service
sudo systemctl start portfolio.service
sudo systemctl status portfolio.service
sudo systemctl daemon-reload
