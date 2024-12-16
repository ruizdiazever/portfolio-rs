#!/usr/bin/bash

export RUST_LOG=portfolio=info,tower_http=info
export LEPTOS_OUTPUT_NAME=portfolio
export LEPTOS_SITE_ROOT=site
export LEPTOS_SITE_PKG_DIR=pkg
export LEPTOS_SITE_ADDR=0.0.0.0:3003
export LEPTOS_RELOAD_PORT=3020
export API_URL=http://localhost:3002

if [ -f .env ]; then
    export $(cat .env | xargs)
fi

npx tailwindcss -i ./style/tailwind.css -o ./style/output.css
./target/release/portfolio
