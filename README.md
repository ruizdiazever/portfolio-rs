# Portfolio powered by Rust 🦀

<img src="./frontend/public/assets/images/mascot.png" alt="Ferris, mascot of Rust" width="100"/>

Personal portfolio at [www.everdev.it](https://www.everdev.it): Astro 7 + Svelte 5
frontend, Axum API, Redis.

## Stack

- **Frontend** (`frontend/`): Astro 7 SSR (`@astrojs/node`), Svelte 5,
  TailwindCSS 4, shadcn-svelte, Paraglide (en/zh), Playwright e2e.
- **API** (`api/`): Rust, Axum, Redis (visit counters + feedback), lettre SMTP.
- **Edge**: Caddy on the BERLi `network` VM terminates TLS and proxies
  `/api/*` to the API, everything else to the frontend.
- **Host**: `portfolio` VM (Fedora), Docker Compose, images from GHCR.
- `leptos/` is the pre-Astro implementation, kept for reference only; it is not
  built or deployed.

## Local development

```bash
cp .env.template .env                 # API env
cp frontend/.env.template frontend/.env
pnpm -C frontend install

docker compose up -d redis            # or any Redis 8
cd api && cargo run                   # http://127.0.0.1:3002
pnpm -C frontend dev                  # http://127.0.0.1:4321
```

`frontend/.env` defaults: `API_URL=/api` (Vite proxies `/api` to
`127.0.0.1:3002` in dev) and `INTERNAL_API_URL=http://127.0.0.1:3002` for SSR.

## Build and test

```bash
pnpm -C frontend build                # paraglide + astro check + astro build
pnpm -C frontend test:e2e             # Playwright (build first in CI)
cd api && cargo fmt --all --check
cd api && cargo clippy --all-targets -- -D warnings
cd api && cargo test --locked
```

## Deploy

CI (`.github/workflows/ci.yml`) runs Rust checks, the Astro build and
Playwright. On `main` it publishes `ghcr.io/ruizdiazever/portfolio-{api,frontend}`
and the `portfolio` VM converges the stack from `deploy/compose.yaml` every
10 minutes. Details and manual operations: [`deploy/README.md`](deploy/README.md).

## Powered by ⚡️

- [Rust](https://www.rust-lang.org/), [Axum](https://github.com/tokio-rs/axum)
- [Astro](https://astro.build/), [Svelte](https://svelte.dev/),
  [TailwindCSS](https://tailwindcss.com/),
  [shadcn-svelte](https://shadcn-svelte.com/)
- [Redis](https://redis.io/), [Caddy](https://caddyserver.com/),
  [Proxmox](https://proxmox.com/), [Docker](https://www.docker.com/),
  [Fedora](https://getfedora.org/)
