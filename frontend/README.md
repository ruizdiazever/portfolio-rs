# Portfolio powered by Rust 🦀

<img src="./public/images/mascot.png" alt="Ferris, mascot of Rust" width="100"/>

Portfolio SSR powered by Rust with Astro and Svelte

## Powered by ⚡️

- [Rust](https://www.rust-lang.org/): The core programming language used to build the backend API and main services.
- [Axum](https://github.com/tokio-rs/axum): Web framework used to create the RESTful API endpoints and handle HTTP requests for the portfolio.
- [TailwindCSS](https://tailwindcss.com/): Utility-first CSS framework used for styling the frontend components and responsive design.
- [RedisDB](https://redis.io/): Used as a caching layer to store data and improve portfolio performance.
- [Proxmox](https://proxmox.com/): Virtualization platform used to host and manage the portfolio's virtual machine.
- [Docker](https://www.docker.com/): Used to containerize the portfolio application and its dependencies for consistent deployment.
- [Fedora](https://getfedora.org/): The Linux distribution running on the server that hosts my portfolio.
- [Beszel](https://beszel.dev/): To monitorization and alerting.
- [Caddy](https://caddyserver.com/): Web server that handles SSL/TLS, reverse proxy, and serves the portfolio to visitors.

## Future implementation for fun 🤪
- [TiKV](https://tikv.org/): a highly scalable, low latency, and easy to use
key-value database coded in Rust.
- [Meilisearch](https://www.meilisearch.com/): a powerful, open-source search engine offering fast and relevant full-text searches in Rust.

## Run

```bash
pnpm i
pnpm run dev
pnpm run build

ncu --upgrade   # To upgrade all packages
```
