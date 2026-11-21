# Portfolio

Context for agents working on the live portfolio at
[www.everdev.it](https://www.everdev.it).

This file is the operational entry point. Read it with:

- [DESIGN.md](DESIGN.md): the visual system, components, states and UI rules.
- [docs/skills/SKILLS.md](docs/skills/SKILLS.md): the skill routing map and UI
  review process.
- [docs/agent-readiness.md](docs/agent-readiness.md): the agent-facing surfaces,
  boundaries and machine view design.
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

Playwright covers routing, 320px layout, SEO, S3 assets, the library, language,
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
- Requests for content come from S3. `public/` is only for root-level files. Game
  capsules are the one content-image exception, served by Steam's CDN and
  allowlisted in the CSP.
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
  filters, no card shadows, no second accent. The machine view is the deliberate
  exception: dark only, with a transient green entrance that settles to the
  neutral document.
- Text stays readable at 320px and 200% scaling. Long content wraps or
  truncates with a way to the full value.
- Every interactive element has a name, focus ring and keyboard path. Hover is
  an enhancement, never the only way to reach content.
- Stateful icons use Morphicons with Lucide icon data: header theme and table
  sorting. The language link uses the in-repo `中` and `A` IconNodes, showing the
  target language. The machine view control is a static Terminal icon, not a
  stateful morph. Keep `reducedMotion="user"`; do not duplicate the same states
  as static SVGs.
- Motion stays between 150 and 200ms for UI; the library card flip is 620ms. The machine
  view entrance is the one longer sequence, and it is skippable. Honor
  `prefers-reduced-motion`; no auto-rotating text.
- Search the actual page and both themes before changing spacing, typography,
  color or interaction. Follow the review evidence in
  [docs/skills/SKILLS.md](docs/skills/SKILLS.md).

## Machine view

- The machine view is a public inspection mode, not a chatbot. It lives at
  `?view=machine`; the old `?mode=agent` link canonicalizes to it and
  `?mode=human` returns to Human. It adds `html[data-view="machine"]`, renders a
  floating Human/Machine switch and stores the `portfolio-view` key, migrating
  `portfolio-agent-mode`. The human page, header and footer are hidden and the
  generated brief for the current locale renders in a 720px mono column inside
  `main`.
- The header control is an icon-only Terminal button with no visible label, the
  same size and styling as the theme control. It opens the view. The floating
  switch and `Shift+M` return to Human and restore the reader's theme. The
  switch's shortcut hint uses the shadcn-svelte `Kbd` keycaps.
- The view is dark only. The header, footer, theme and language controls are
  hidden. Copy as Markdown, the `agent.md` link, the source line and the
  Human/Machine switch are the only controls.
- The brief types in once per URL entry in the transient green. The machine
  head, the copy action and the agent.md link enter in the same green. When the
  first screen finishes, a green scanline sweeps the viewport and the head
  decodes to the neutral document. Reduced motion skips the whole entrance;
  scroll, touch, a key or a pointer finishes it without the settle. The green
  never becomes permanent UI chrome.
- `/agent.md` and `/agent.json` remain the English canonical files. The view
  exposes no model, chat endpoint, A2A server or MCP server, and no generated
  claims. No private data enters the brief.
- Keep `/llms.txt`, `/agent.md` and `/agent.json` generated from the same data
  as the pages. Every HTML page carries the `describedby`, Markdown alternate,
  RSS, JSON Feed and JSON-LD discovery tags.
- `robots.txt` carries the public content signal and the AIPREF line:
  `search=yes, ai-input=yes, ai-train=no, use=reference` and
  `search=y, ai-input=y, train-ai=n`. It points at `/sitemap.xml`.
- `/sitemap.xml` is the urlset with hreflang alternates; `/sitemap-index.xml`
  indexes it. The page list lives in `src/common/siteRoutes.ts`.
- `/AGENTS.md` is the site guide for visiting agents. It is not this file: this
  one is for people and agents working on the repository.
- The sitemap, robots, sitemap index, agent guide and machine files are
  root-level, not locale-prefixed. Keep them in the middleware root bypass so a
  browser document request is not redirected to `/en/...` or `/zh/...`.
- `/about`, `/contact` and `/privacy` answer at the root in English. Astro only
  serves page routes under a locale prefix, so those aliases are injected
  routes (`astro.config.mjs`), not files in `src/pages`. Their canonical URL is
  the localized page.
- Any HTML page answers `Accept: text/markdown` with Markdown and `Vary: Accept`.
  Keep the conversion in `src/common/markdown.ts`; do not hand-write a second
  copy of a page.
- The app owns `Content-Security-Policy`. The edge owns HSTS, `nosniff`, frame
  options and `Referrer-Policy`. If the edge starts sending CSP too, remove the
  app header in the same change; two policies intersect.
- The FAQ JSON-LD and the visible questions read `src/common/faq.ts`. Never let
  the graph describe a question the page does not show.
- Do not add an A2A card, MCP server card, OpenAPI or API catalog unless there
  is a real callable service. The portfolio has none, and adding the document
  turns the API category on and changes the score. Do not add a model, chat
  endpoint or generated claims to the machine view.
- The brief, manifest and agent guide are public. Never add private email,
  admin state, analytics identifiers or session data to them.
- Run `e2e/agent.spec.ts` and `e2e/agent-readiness.spec.ts` when changing the
  machine view, the endpoints, the manifest shape, the discovery headers or the
  trust pages.

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
Game capsules are referenced directly from Steam's CDN; do not copy them into
the media source tree.

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
