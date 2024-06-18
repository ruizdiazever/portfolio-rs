#!/usr/bin/bash
cargo install trunk
rustup toolchain install nightly
rustup default nightly
rustup override set nightly
rustup target add wasm32-unknown-unknown
trunk serve --open
