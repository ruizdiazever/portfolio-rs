# Agent readiness

The portfolio has two audiences: a person reading the site and an agent trying
to understand it without a browser session. The second audience gets a small,
public, deterministic layer built from the same data as the human pages.

This is a product decision, not a hidden API. The header exposes it as **Agent
lens**, and the page shows a receipt of what an agent can read and where the
files live.

## What an agent needs

Research across the current proposals converges on four jobs:

1. **Discover.** Find the canonical pages, the sitemap and the machine entry
   points without guessing a path.
2. **Understand.** Read stable facts in semantic HTML, a plain-text brief and a
   structured manifest, with dates, sources and links.
3. **Act.** Reach a real contact route. This is a portfolio, not a store: there
   is no checkout, booking or account to automate.
4. **Respect boundaries.** State what may be retrieved, referenced or used for
   training. Do not expose private data or pretend a static profile is a live
   agent service.

`llms.txt` is a discovery map, not a ranking guarantee. Markdown versions are
useful when they exist, but a curated brief is better than a scraped copy that
drifts from the site. The site follows the stable part of the emerging
conventions and keeps the surface small enough to maintain.

## Surfaces

| Surface | Path | Purpose |
| --- | --- | --- |
| HTML | `/{en,zh}/...` | Server-rendered pages with canonical URLs, semantic headings and visible links |
| `llms.txt` | `/llms.txt` | Orientation, profile summary and links to the important resources |
| Agent brief | `/agent.md` | Complete plain-text profile with work, writing, reading and contact |
| Agent manifest | `/agent.json` | The same facts as validated JSON: profile, capabilities, endpoints, counts and signals |
| JSON-LD | every HTML page | `Person`, `WebSite` and `ProfilePage` or `WebPage` |
| RSS | `/en/feed.xml`, `/zh/feed.xml` | Writing feed |
| JSON Feed | `/en/feed.json`, `/zh/feed.json` | Writing feed as JSON |
| Sitemap | `/sitemap-index.xml` | Indexable pages |
| Robots | `/robots.txt` | Crawling and content signals |
| Discovery links | every HTML page | `<link>` relations point to the brief, manifest and map; SSR responses also carry a `Link` header |

The HTML pages remain the source of truth. The brief and manifest are generated
from the same validated post, project and book data, so a content change cannot
silently leave the machine files behind.

## Boundaries

`robots.txt` states:

```text
Content-Signal: search=yes, ai-input=yes, ai-train=no, use=reference
```

The manifest repeats the same policy in machine-readable form. The intent is
plain: retrieval and citation are welcome with a link; training is not. The
site exposes no private email, no admin data, no analytics identifiers and no
session data.

There is deliberately **no MCP server and no A2A agent card**. Those protocols
describe callable services. This portfolio has nothing to execute on behalf of
an agent, so publishing a server card would be a false promise. If a future
service exists, it should get its own discovery file and authorization model.

## Agent lens

The header button switches the ordinary site into an explicit inspection mode:

- **Enter.** The control shows a bot and "Agent"; activating it adds
  `?mode=agent`, stores the preference and renders the panel.
- **Exit.** The control shows a person and "Human"; the close button, the same
  control or the query parameter `mode=human` returns to the human view.
- **Persistence.** The state lives in `localStorage` and in the URL. The root
  class is applied in the head before the first paint, so there is no flash of
  the wrong mode. Internal navigation keeps the mode.
- **Feedback.** The panel is the receipt: a handshake label, the public profile,
  project, note and book counts, six surface links, a copy-brief action, the
  contact route and the line "No model, no chat, no private data."
- **Copy.** The primary action copies `/agent.md` and confirms in a polite live
  region. It does not call a model.
- **Layout.** The panel is in normal document flow below the header, not a
  fixed overlay. It never covers the page. On desktop it uses three columns; on
  mobile it stacks and the page follows below. The page keeps its scroll,
  focus order and reading flow.
- **Motion.** A 200ms rise on enter, a slow status dot and a 0.96 press scale.
  All of it is removed under `prefers-reduced-motion`.

The human site is unchanged. Agent lens is a reading instrument, not a chat
window.

## Verification

- `pnpm -C frontend build` completes with no errors.
- Playwright covers the endpoint content, the JSON-LD graph, the `Link` header,
  the header toggle, URL state, persistence, the 320px layout and clipboard
  copy.
- The panel is checked in both themes at 1440 and 320, and with English and Chinese labels.
- The agent panel is keyboard reachable and every control has an accessible
  name.
- A rendered check confirms the panel sits above the main content, not over it.

## Deliberate gaps

- **No page-by-page `.md` files.** The curated `/agent.md` is the canonical
  Markdown surface. Duplicating every page by hand would create a second source
  of truth; if the archive grows, a generated page-level Markdown route is the
  next step.
- **No `Accept: text/markdown` negotiation.** That requires a server-side HTML
  to Markdown pipeline. The brief is explicit and cheap to fetch; the site does
  not pretend every page has a negotiated representation.
- **No MCP or A2A.** See boundaries above.
- **No booking or payments.** The contact route is the action; there is no
  calendar or checkout to automate.

## Sources

- [The /llms.txt file, v2](https://llmstxt.org/): the discovery and Markdown
  proposal, including `rel="alternate"` and `rel="describedby"`.
- [Cloudflare Markdown for Agents](https://developers.cloudflare.com/changelog/post/2026-02-12-markdown-for-agents/):
  content negotiation at the edge, which this site does not rely on.
- [agentready.ch: make your business agent-ready](https://agentready.ch/en/for-companies):
  the `agent.md`, `agent.json`, `llms.txt` and controlled-actions model.
- [Frase: How to make your website agent-ready](https://www.frase.io/blog/how-to-make-your-website-agent-ready):
  discover, understand and act, plus honest expectations for `llms.txt`.
- [DatoCMS: How to make your website agent-ready](https://www.datocms.com/blog/how-to-make-your-website-agent-ready):
  server-rendered HTML, content signals, Markdown versions and discovery files.
- [Schema.org ProfilePage](https://schema.org/ProfilePage) and
  [Google profile page structured data](https://developers.google.com/search/docs/appearance/structured-data/profile-page):
  the profile graph.
- [Content Signals](https://contentsignals.org/): the `Content-Signal` syntax
  used in `robots.txt`.
- [A2A agent card](https://a2a-protocol.org/latest/specification/) and
  [MCP server cards](https://modelcontextprotocol.info/): the callable-service
  protocols this static profile deliberately does not claim.
