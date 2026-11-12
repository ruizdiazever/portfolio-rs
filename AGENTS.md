# Portfolio Repo Notes

Context for agents working on https://www.everdev.it.

The public `README.md` is intentionally short. Keep local setup, media, test and deploy details in this file. Do not turn the README into an operations manual.

## Stack

- `frontend/`: Astro 7 SSR, Astro Fonts API (Inter), Svelte 5, TailwindCSS 4, shadcn-svelte, Paraglide (EN/ZH), Playwright.
- `api/`: Rust, Axum, Redis, lettre for feedback email.
- Media: RustFS S3 at `https://s3.berli.app/portfolio/v1`, sharp, rclone.
- Edge: Caddy on the BERLi network VM, `www.everdev.it`.
- Delivery: GitHub Actions, GHCR, Docker Compose, pull-based timer on the `portfolio` VM.
- `leptos/`: pre-Astro implementation. Reference only. Not built, tested or deployed.

## Layout

```text
frontend/
  media-src/              original images, committed
  scripts/sync-media.mjs  sharp + rclone pipeline
  src/common/media.ts     media() and mediaSrcSet()
  src/components/common/Media.astro
  e2e/                    Playwright
api/                      Axum API and Redis
deploy/                   Compose stack and update units
leptos/                   legacy
.github/workflows/ci.yml  CI
```

## Local development

Prerequisites: Node 24, pnpm 10, Rust (CI uses 1.99), Docker.

```bash
cp .env.template .env
cp frontend/.env.template frontend/.env
pnpm -C frontend install

docker compose up -d redis
(cd api && cargo run)          # API at 127.0.0.1:3002
pnpm -C frontend dev           # site at 127.0.0.1:4321
```

`frontend/.env` keeps the browser on same-origin `/api`; Vite proxies it to `127.0.0.1:3002`. In production Caddy does that routing.

## Environment

- Root `.env`: API env. Redis URL/password, SMTP, logos, IPinfo.
- `frontend/.env`: `API_URL=/api`, `INTERNAL_API_URL`, server-only `GITHUB_TOKEN` for the contributions graph.
- Production secrets live in `/etc/portfolio/env` on the VM, `0600`.
- Never commit real secrets. `.env.template` files are safe examples.

## Test

```bash
pnpm -C frontend test:e2e:install   # first run, installs Chromium
pnpm -C frontend build
pnpm -C frontend test:e2e

cd api
cargo fmt --all --check
cargo clippy --all-targets -- -D warnings
cargo test --locked
```

Playwright covers pages, the 320 px layout, SEO metadata, S3 assets, book filters, language switching and feedback. CI runs the same checks on every PR and push to `main`.

## Media

There are three locations on purpose:

| Location | Role | In Git | Runtime |
| --- | --- | --- | --- |
| `frontend/media-src/` | Originals, edited by hand | Yes | No |
| `frontend/.media-output/v1/` | Generated AVIF/WebP/PNG | No | No |
| `s3.berli.app/portfolio/v1/` | Public derivatives | No | Yes |

`frontend/.dockerignore` excludes `media-src/` and `.media-output/`. The frontend build never reads `media-src/`; only `scripts/sync-media.mjs` does. Content images have no app endpoint and no local fallback. The one app image route is the social preview endpoint.

`frontend/public/` is only for root-level files such as `manifest.webmanifest`, `humans.txt` and `browserconfig.xml`. Never put content images there.

### Social previews

`frontend/src/pages/og/[...slug].png.ts` generates 1200x630 PNGs at request time with `satori-astro`, `satori-html` and sharp. `frontend/src/common/og.ts` maps routes to copy. It reads Inter from the Astro Fonts API with `fontData` and `experimental_getFontFileURL`, sets a one hour cache and is not part of the S3 media pipeline.

The frontend `package.json` overrides `satori` to 0.63.2 because `satori-astro` 0.4.1 pins 0.26.0, which cannot parse WOFF2. Cards are English, matching the previous static OG assets; localized titles stay in the page metadata.

### Commands

```bash
# Generate only. No network, no upload.
pnpm -C frontend media:build

# Rebuild and upload. Requires rclone and a configured remote.
RCLONE_CONFIG=~/.config/rclone/rclone.conf pnpm -C frontend media:sync
```

`media:sync` rebuilds `.media-output/v1` and copies it to `${MEDIA_REMOTE:-rustfs}:${MEDIA_BUCKET:-portfolio}/v1` with `Cache-Control: public, max-age=31536000, immutable`.

### Add or replace an image

1. Put the original in `frontend/media-src/...`.
2. Add a `responsive()` or `single()` call in `frontend/scripts/sync-media.mjs`, or add the book to its `books` array.
3. Run `media:sync`.
4. Reference it with `<Media path="..." />` or `media("...")`.

`media()` returns the base S3 URL. `mediaSrcSet()` builds responsive candidates. `Media.astro` renders `<picture>` with AVIF and WebP.

If you replace an existing key, bump `v1` in both `frontend/src/common/media.ts` and `frontend/scripts/sync-media.mjs`. Do not reuse a key after changing the file; immutable caches will keep serving the old object for a year.

`media:sync` needs an rclone remote named `rustfs` with write access to the `portfolio` bucket. `MEDIA_REMOTE` and `MEDIA_BUCKET` override the defaults. No credentials are committed.

## Deploy

1. CI runs Rust checks, the Astro build and Playwright.
2. On `main`, GHCR publishes `ghcr.io/ruizdiazever/portfolio-api` and `portfolio-frontend`, tagged `latest` and the commit SHA.
3. The `portfolio` VM runs `portfolio-update.timer` every 10 minutes. It resets to `origin/main`, pulls images and converges `deploy/compose.yaml`.

Manual update:

```bash
sudo systemctl start portfolio-update.service
journalctl -u portfolio-update.service -n 50
```

Caddy terminates TLS for `www.everdev.it`, routes `/api/*` to the API and everything else to the frontend. Full pipeline and rollback: `deploy/README.md`.

## Typography

Inter is registered once in `astro.config.mjs` through `fontProviders.fontsource()` and rendered with `<Font>` in `src/layouts/Layout.astro`. Use the Tailwind scale in `src/styles/app.css`; do not add local `@font-face` blocks or a second family. Long-form copy uses `text-md` (18px) with a 60 to 75 character measure. Chinese falls back to the system CJK stack.

## Conventions

- The README is public-facing. It shows the work, not the brush. Keep it to stack, architecture, the media flow, repository map and a footer.
- No em dashes or en dashes in user-facing copy. Use commas, periods, colons or parentheses. The same applies to the README.
- All content images come from S3. Do not add local content images. Social previews come from the Satori OG route; that is the only app image endpoint.
- Write English and Chinese as native copy, not literal translations.
- Avoid unnecessary comments in code.
- Do not build, test or deploy `leptos/`.
- Keep the public README free of deploy, test and media publishing instructions. Those belong here.
