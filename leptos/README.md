# Portfolio WASM 🦀

<img src="./public/images/mascot.png" alt="Ferris, mascot of Rust" width="100"/>

Portfolio WASM powered by Rust with Leptos and Axum

## Powered by ⚡️

- [Rust](https://www.rust-lang.org/): most powerfull language in solar system.
- [Leptos](https://www.leptos.dev/): A cutting-edge Rust framework for the modern web.
- [Axum](https://github.com/tokio-rs/axum): a web application framework that focuses on ergonomics and modularity.
- [TailwindCSS](https://tailwindcss.com/): CSS framework.
- [RedisDB](https://redis.io/): in-memory data store.

## Future implementation for fun 🤪
- [TiKV](https://tikv.org/): a highly scalable, low latency, and easy to use
key-value database coded in Rust.
- [Meilisearch](https://www.meilisearch.com/): a powerful, open-source search engine offering fast and relevant full-text searches in Rust.

## Run
```bash
rustup toolchain install nightly
rustup default nightly
cargo install cargo-leptos
rustup target add wasm32-unknown-unknown
cargo leptos watch
```
