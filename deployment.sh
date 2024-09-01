#!/bin/bash

# Inicializar la variable exit_code
exit_code=0

# Stop the BERLi service
sudo systemctl stop portfolio.service
echo "1) Exit code of 'sudo systemctl stop portfolio.service': $exit_code"

# Build the cargo project
echo "2) Building Portfolio WASM with cargo, please wait.."
export PATH="$HOME/.cargo/bin:$PATH"
source ~/.bashrc
cargo leptos build --release -vv
exit_code=$?
echo "3) Exit code of Portfolio WASM build: $exit_code"

# Remove the berli-core folder
sudo rm -rf /opt/portfolio-rs
exit_code=$?
echo "4) Exit code of 'sudo rm -rf /opt/portfolio-rs': $exit_code"

# Copy the berli-core folder to /opt/berli
sudo cp -r ../portfolio-rs /opt
exit_code=$?
echo "5) Exit code of 'sudo cp -r ../portfolio-rs /opt': $exit_code"

# Start the berli service
sudo systemctl start portfolio
exit_code=$?
echo "6) Exit code of 'sudo systemctl start portfolio': $exit_code"

# Check the status of the berli service
sudo systemctl status portfolio.service
exit_code=$?
echo "7) Exit code of 'sudo systemctl status portfolio.service': $exit_code"
