#!/usr/bin/bash

npx tailwindcss -i ./style/tailwind.css -o ./style/output.css
cargo leptos watch
