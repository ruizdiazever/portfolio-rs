# Portfolio

Context for agents working on the live portfolio at
[www.everdev.it](https://www.everdev.it).

This file is the operational entry point. Read it with:

- [DESIGN.md](DESIGN.md): the visual system, components, states and UI rules.
- [docs/skills/SKILLS.md](docs/skills/SKILLS.md): the skill routing map and UI
  review process.
- [docs/agent-readiness.md](docs/agent-readiness.md): the agent-facing surfaces,
  boundaries and Agent lens design.
- [README.md](README.md): the public description. Keep it short.

DeepSeek Harness loads the root `AGENTS.md` as durable workspace instructions,
then follows the project chain from broad to specific. Keep this file concise;
do not duplicate the design system or the skill instructions.

## Scope

- `frontend/`: the live Astro and Svelte application.
- `api/`: the Rust feedback and visit API.
- `deploy/`: the production Compose stack, Caddy routing and update timer.
- `leptos/`: a legacy implementation. Do not build, test or deploy it.

## Repository map

```text
frontend/
  src/pages/          Astro routes and endpoints
  src/layouts/        Page shells
  src/components/     Common, landing, blog, projects, sections and UI primitives
  src/common/         Data loaders, API boundaries, media and SEO helpers
  src/styles/         Tailwind entry, tokens, motion and light/dark mapping
  e2e/                Playwright tests
api/
  src/cfg.rs          Validated, redacted runtime configuration
  src/routes.rs       Router, HTTP client, timeouts and shutdown
  src/services/       Feedback and visit handlers
  src/redis/          Redis persistence and visitor logic
  src/security/       Errors and SMTP delivery
  src/common/         Request metadata, IP, HTML, rate limit and helpers
deploy/               Compose stack and production operations
docs/skills/          Skill routing and review criteria
```

## Local development

Prerequisites: Node 24, pnpm 10, Rust 1.99 and Docker.

```bash
cp .env.template .env
cp frontend/.env.template frontend/.env
pnpm -C frontend install
docker compose up -d redis
(cd api && cargo run)
pnpm -C frontend dev
```

The frontend runs at `127.0.0.1:4321`. Vite proxies `/api` to
`127.0.0.1:3002`; production Caddy performs the same routing.

## Checks

Run the checks for every touched side before pushing:

```bash
pnpm -C frontend install --frozen-lockfile
pnpm -C frontend build
pnpm -C frontend test:e2e

(cd api && cargo fmt --all --check)
(cd api && cargo clippy --all-targets -- -D warnings)
(cd api && cargo test --locked)
(cd api && cargo build --release --locked)
```

Playwright covers routing, 320px layout, SEO, S3 assets, books, language,
feedback, theme behavior, the organizations table and the agent surfaces. Add a
test when behavior has a user-visible contract. Use a free port for local runs; do not assume
`4321` or `4322` is available.

## Architecture invariants

### Frontend

- Astro renders SSR; Svelte is used for islands and native-like interactions.
  Keep client JavaScript small and justified.
- All network calls go through `frontend/src/common/api.ts` and the server or
  browser wrapper. Include a timeout and surface a typed failure.
- URL builders are request-scoped. Never capture the locale at module load.
- Static JSON is validated once and cached. Do not re-parse it for every call.
- Requests for content come from S3. `public/` is only for root-level files.
- The feedback dialog is a native `<dialog>` with `showModal()`, `autofocus`,
  `closedby` and a backdrop. Do not reintroduce a focus trap or `role="dialog"`.
- `light-dark()` tokens and the `<meta name="color-scheme">` element own the
  color scheme. Never hardcode a root light or dark scheme.
- The API is same-origin in production. Never ship a server secret in a client
  bundle. `GITHUB_TOKEN` is server-only.

### API

- `ConfigPortfolio` is the only source of runtime settings. Handlers must not
  read environment variables or panic on missing configuration.
- Validate the feedback boundary: UUID, reaction, title, message and language.
  Keep the public error body generic.
- Email is best-effort and runs on a blocking worker. Redis is the source of
  truth for a saved feedback item.
- Rate limit feedback and visit writes by client IP. Trust forwarding headers
  only from a local or private proxy.
- Bind API and frontend ports to `127.0.0.1` in production; Caddy is the only
  public entry point.

## UI rules

The full system lives in [DESIGN.md](DESIGN.md). The short version:

- Inter, system color scheme, semantic tokens, 12px cards, 6px controls, pill
  filters, no card shadows, no second accent in the human view. Agent lens is
  the documented machine-palette exception.
- Text stays readable at 320px and 200% scaling. Long content wraps or
  truncates with a way to the full value.
- Every interactive element has a name, focus ring and keyboard path. Hover is
  an enhancement, never the only way to reach content.
- Motion stays between 150 and 200ms for UI; the book flip is 620ms. Honor
  `prefers-reduced-motion`; no auto-rotating text.
- Search the actual page and both themes before changing spacing, typography,
  color or interaction. Follow the review evidence in
  [docs/skills/SKILLS.md](docs/skills/SKILLS.md).

## Agent surface

- Agent lens is a public inspection mode, not a chatbot. It is a two-state,
  icon-only header control with no visible label and an aura. It writes
  `html.agent-mode`, `?mode=agent` and the `portfolio-agent-mode` localStorage
  key. The whole page becomes the machine surface; the panel is in normal flow
  below the header, never a fixed overlay or modal.
- Keep `/llms.txt`, `/agent.md` and `/agent.json` generated from the same data
  as the pages. Every HTML page carries the `describedby`, Markdown alternate,
  RSS, JSON Feed and JSON-LD discovery tags.
- `robots.txt` carries the public content signal:
  `search=yes, ai-input=yes, ai-train=no, use=reference`.
- The sitemap, robots and machine files are root-level, not locale-prefixed.
  Keep them in the middleware non-localized bypass so a browser document
  request is not redirected to `/en/...` or `/zh/...`.
- Do not add an A2A card or MCP server card unless there is a real callable
  service and an authorization model. Do not add a model, chat endpoint or
  generated claims to the agent panel.
- The brief and manifest are public. Never add private email, admin state,
  analytics identifiers or session data to them.
- Run the agent Playwright spec when changing the panel, the endpoints, the
  manifest shape or the discovery headers.

## Environment and secrets

| File | Purpose |
| --- | --- |
| Root `.env` | API, Redis, SMTP, IPinfo and email settings |
| `frontend/.env` | Public `API_URL` and server-only `INTERNAL_API_URL`, `GITHUB_TOKEN` |

Production secrets live in `/etc/portfolio/env` on the VM, mode `0600`. Never
commit a real secret. `.env.template` files are safe examples.

## Media

Originals live in `frontend/media-src/`. Generated AVIF, WebP and PNG files are
published to `s3.berli.app/portfolio/v1` by `pnpm -C frontend media:sync`; the
build never reads originals. Reference content with `<Media>` or `media()`.

If a file changes, bump the version in `frontend/src/common/media.ts` and
`frontend/scripts/sync-media.mjs`. Immutable caches keep the old object for a
year; never reuse a key for different bytes.

## Deploy

A push to `main` runs CI, publishes both GHCR images and lets the
`portfolio-update.timer` converge the VM every 10 minutes.

```bash
sudo systemctl start portfolio-update.service
journalctl -u portfolio-update.service -n 50
```

Caddy terminates TLS and routes `/api/*` to the API and all other paths to the
frontend. Full pipeline and rollback: [deploy/README.md](deploy/README.md).

## Conventions

- English and Chinese are native copy, not literal translations.
- No em dashes or en dashes in user-facing strings. Use commas, periods,
  colons or parentheses.
- Prefer native HTML and the platform over a custom rebuild.
- Reuse tokens and reachable components. Do not add an unused UI tree or a
  dependency that no reachable file imports.
- Keep source text selectable. Do not disable selection across content.
- Do not add comments that restate the code; explain a non-obvious decision.
- Keep the public README free of deploy, test and secret operations.
