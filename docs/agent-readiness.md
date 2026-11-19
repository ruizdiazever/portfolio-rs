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
| JSON-LD | every HTML page | `Person`, `WebSite` and the page entity: `ProfilePage`, `BlogPosting`, `CollectionPage`, `AboutPage`, `ContactPage` or `SoftwareSourceCode`. Home and contact carry `FAQPage` |
| RSS | `/en/feed.xml`, `/zh/feed.xml` | Writing feed |
| JSON Feed | `/en/feed.json`, `/zh/feed.json` | Writing feed as JSON |
| Sitemap | `/sitemap.xml` | Indexable pages, with hreflang alternates. `/sitemap-index.xml` indexes it. Root-level; bypasses locale redirects |
| Robots | `/robots.txt` | Crawling, AI crawler groups and content signals. Root-level; bypasses locale redirects |
| Agent guide | `/AGENTS.md` | What the site offers and what an agent may do, in Markdown |
| Trust pages | `/about`, `/contact`, `/privacy` | Real content at the root; canonical to the localized page |
| Discovery links | every HTML page | `<link>` relations point to the brief, manifest and map; SSR responses also carry a `Link` header |

The HTML pages remain the source of truth. The brief and manifest are generated
from the same validated post, project and book data, so a content change cannot
silently leave the machine files behind.

## Boundaries

`robots.txt` states:

```text
Content-Signal: search=yes, ai-input=yes, ai-train=no, use=reference
```

`Content-Usage` repeats the same policy in the AIPREF draft syntax. The
manifest states it in JSON. The intent is plain: retrieval and citation are
welcome with a link; training is not. The site exposes no private email, no
admin data, no analytics identifiers and no session data.

## Readable by machines

- **Content negotiation.** Any HTML page answers `Accept: text/markdown` with a
  Markdown version of that page and `Vary: Accept`. `/` returns the curated
  brief, because it is a redirect with no body of its own. The app owns the
  conversion (`src/common/markdown.ts`), so a page-level `.md` file cannot drift.
- **Trust pages.** `/about`, `/contact` and `/privacy` answer at the root, in
  English, with the canonical URL pointing at the localized page. Agents probe
  those three paths before they recommend a site, and Astro only serves page
  routes under a locale prefix, so the root aliases are injected routes.
- **FAQ.** The home page and the contact page answer four real questions in
  visible copy and in `FAQPage` JSON-LD. Both read `src/common/faq.ts`.
- **Security headers.** The edge owns HSTS, `nosniff`, frame options and
  `Referrer-Policy`. The app adds `Content-Security-Policy`, because it knows
  the inline theme scripts, the self-hosted fonts, the S3 media origin and the
  Plausible host. Every HTML response, including the root aliases, carries it.

There is deliberately **no MCP server and no A2A agent card**. Those protocols
describe callable services. This portfolio has nothing to execute on behalf of
an agent, so publishing a server card would be a false promise. If a future
service exists, it should get its own discovery file and authorization model.

## Agent lens

The header control switches the site into a reader for the exact plain text an
agent receives:

- **Enter.** The icon-only control switches from a bot to a person. It adds
  `?mode=agent`, stores the preference and replaces the human page with the
  generated agent brief for the current locale. There is no visible label.
- **Exit.** The icon, the query parameter `mode=human` or the `Human view`
  action in the document returns to the normal site.
- **Persistence.** The state lives in `localStorage` and in the URL. The root
  class is applied in the head before the first paint. Navigation keeps it.
- **Document.** The main landmark renders the generated Markdown in a
  monospace `<pre>`, at most 86 characters wide. It keeps the `#` headings,
  lists and URLs; that is the point. English uses the English canonical copy;
  Chinese uses native Chinese labels, profile, work, writing and reading copy.
  `/agent.md` and `/agent.json` remain the English canonical files. The header
  stays for controls, the footer hides.
- **Toolbar.** A hairline row names `text/markdown`, shows the line count and
  offers `Copy agent brief`, `agent.md` and `Human view`. Copy confirms in a
  polite live region. There is no panel, dashboard, binary layer or palette
  switch.
- **Motion.** The mode adds no decorative motion. The header button keeps the
  shared press feedback, and scroll-to-top honors reduced motion.

The human view is one click away. Agent lens is a reader, not a chat window.

## Verification

- `pnpm -C frontend build` completes with no errors.
- Playwright covers the endpoint content, the JSON-LD graph, the `Link` header,
  the header toggle, URL state, persistence, the 320px layout and clipboard
  copy.
- `e2e/agent-readiness.spec.ts` covers the sitemap, robots groups, `AGENTS.md`,
  Markdown negotiation, the CSP, the root trust pages, the FAQ graph, author
  attribution and the accessibility surface of every page type.
- The panel is checked in both themes at 1440 and 320, and with English and Chinese labels.
- The agent text view is keyboard reachable and every control has an accessible
  name.
- A rendered check confirms the panel sits above the main content, not over it.

## Deliberate gaps

- **No page-by-page `.md` files.** The curated `/agent.md` is the canonical
  Markdown surface; a page answers negotiation from its own rendered HTML
  instead of a hand-written twin that would drift.
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
