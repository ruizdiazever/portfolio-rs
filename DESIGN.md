# Design system

The portfolio is a reading-first personal site. It uses one typeface, a small
neutral palette, hairline structure and a single active state. The interface
follows the system color scheme and keeps a dark, Linear-like canvas as its dark
theme.

The visual owner is this file. The operational owner is [AGENTS.md](AGENTS.md).
The skill routing and review process are in
[docs/skills/SKILLS.md](docs/skills/SKILLS.md).

## Principles

1. **Reading first.** Type, measure and contrast carry the site. Decoration
   never competes with the work.
2. **Structure from hairlines.** Cards and panels use a 1px border and a surface
   shift. Content cards do not use shadows.
3. **One active state.** The selected filter and the primary action use paper
   white on dark and black on light. There is no yellow, acid lime or second
   accent.
4. **Interaction is explicit.** Content is reachable by a visible control.
   Nothing important exists only behind hover, and book notes are reached by a
   click or keyboard flip.
5. **Motion explains state.** Transitions are short, interruptible and
   removable. Reduced motion keeps the state change and drops the movement.
6. **The platform first.** Prefer native elements, system color scheme,
   `light-dark()`, native `<dialog>`, real buttons and links, and the browser's
   focus behavior.

## Color

The site follows the system color scheme by default. A light or dark override
is stored only when it differs from the system. Toggling back to the system
value removes the override. `color-scheme` is `light dark` on `:root`; the
`<meta name="color-scheme">` element is mapped back into CSS; tokens use
`light-dark()`.

| Token | Light | Dark | Role |
| --- | --- | --- | --- |
| `--background` | `#ffffff` | `#08090a` | Page canvas |
| `--foreground` | `#000000` | `#ffffff` | Headings and emphasis |
| `--card` | `#ffffff` | `#0f1011` | Cards and panels |
| `--card-foreground` | `#000000` | `#d0d6e0` | Body copy on cards |
| `--popover` | `#ffffff` | `#161718` | Dialogs and elevated surfaces |
| `--muted-foreground` | `#666666` | `#8a8f98` | Metadata and captions |
| `--border` | `rgb(0 0 0 / 12%)` | `#23252a` | Hairline borders |
| `--input` | `#767676` | `#62666d` | Form borders, at least 3:1 |
| `--primary` | `#000000` | `#ffffff` | Active filter and primary action |
| `--primary-foreground` | `#ffffff` | `#08090a` | Text on primary |
| `--secondary` | `#f1f1f1` | `#161718` | Badges and quiet fills |
| `--accent` | `#f1f1f1` | `#23252a` | Hover and selected surfaces |
| `--destructive` | semantic red | `#eb5757` | Errors only |

Content color is allowed in book covers, technology marks and the contribution
graph. UI chrome uses the tokens above. Do not add a colored hover, a gradient
behind UI text or a card shadow. Agent lens keeps the same neutral system; only
the content changes.

Body and control pairs must meet their WCAG contrast ratio in both themes.
Muted text is for secondary metadata, not for body copy. State is never carried
by color alone.

## Typography

Inter Variable is loaded once through the Astro Fonts API. Use the Tailwind
scale in `frontend/src/styles/app.css`; do not add a second family or local
`@font-face` blocks. The raw agent document is the one place where the system
monospace stack is appropriate.

| Role | Size | Line height | Weight |
| --- | --- | --- | --- |
| Caption, metadata | 13px | 1.5 | 400 to 510 |
| Body, long form | 16px | 1.6 | 400 |
| Lead, intro | 18px | 1.5 | 400 |
| Card title | 18 to 20px | 1.4 | 510 |
| Subheading | 20 to 24px | 1.3 | 510 |
| Section title | 24 to 28px | 1.25 | 510 |
| Page title | 28 to 36px | 1.15 | 510 |

The reference for this restraint is [pheralb.dev](https://pheralb.dev/): 16px
body, 20px section headings, a 30 to 36px post title and no display size above
36px. The full study and the token table are in
[docs/typography.md](docs/typography.md). Keep page titles at or below 36px and
section titles at or below 28px.

Rules:

- Weights are 400, 510 and 590. Avoid 700 and 800.
- Display tracking is `-0.022em`; medium sizes use `-0.012em`; uppercase
  microcopy uses `0.08em` to `0.1em`.
- The scale steps at the layout breakpoints. Do not use a separate fluid display
  size for every viewport; it makes line breaks unpredictable.
- Enable `cv01` and `ss03`; use `font-variant-numeric: slashed-zero` and
  `tabular-nums` for counters, dates and table figures.
- Long-form copy is 60 to 75 characters per line. Use `text-wrap: balance` on
  headings and `text-wrap: pretty` on paragraphs, never balance on body copy.
- Chinese uses the same scale with the system CJK fallback stack. Mixed
  direction values use `<bdi>` when needed.
- Keep control text at 12px or larger. Book microcopy is the deliberate lower
  exception at 11px; it is not a general UI size.
- Use typographic punctuation in copy: curly quotes and the ellipsis
  character. Code keeps straight punctuation.

## Layout and spacing

Use a 4px base with common steps of 8, 12, 16, 24, 32, 48 and 64px. The reading
column is 768px; Books may use 1024px with the header and footer matching that
width.

- Cards use 12px radii; buttons and inputs 6px; badges 4px; filters are pills.
- Content cards have no shadows. Use `border-border`, changing to
  `border-foreground/30` on hover or focus.
- Keep the reading measure and section rhythm stable. Group with space first,
  then a surface, and only then a line.
- Keep text starts on shared axes across sections. A title and its metadata
  share the leading edge; actions align to the trailing edge.
- At 320px, content must reflow without clipping, horizontal page scroll or
  hidden actions. At 200% text scaling, the same applies.
- Use the supported breakpoints: 640, 768 and 1024px. Books use one column on
  small screens, two at `md`, four at `lg`.
- The header is sticky. Its height is part of `scroll-padding-top`, so focused
  anchors are not hidden under it.
- Safe areas are respected on mobile with `env(safe-area-inset-*)`; the viewport
  opts into `viewport-fit=cover`.

## Components

### Header

Solid `background`, no blur. A two-line wordmark in 510 weight. Mobile controls
are 40px; desktop controls are 36px. The language control has visible text; the
theme and Agent lens controls are icon-only with accessible names, not visible
labels.

Stateful header icons use Morphicons with Lucide icon data. The theme control
morphs `Sun` to `Moon`; Agent lens morphs `Bot` to `User`. Both are 20px,
`spring="snappy"`, and `reducedMotion="user"`, so the OS preference is honored.
The theme script switches with `set()` on initial paint and `morphTo()` after a
click or system change. The SVG is server-rendered, so there is no layout shift
while the custom element upgrades. Do not keep a second hand-drawn copy of these
states.

### Section links

A bordered card row with a label and a trailing arrow. The whole row is the
link. Hover changes the border and surface; focus uses the global ring; active
presses to a subtle scale.

### Writing cards

An article with a heading, description, view count, tag count and date. The
title is an `h3` on the home page and an `h2` on the Writing page. Metadata is
13px. Dates use `Intl.DateTimeFormat` and the active locale.

### Experience

A timeline with a dot aligned to the date line. Dates are `tabular-nums`. The
role is an `h3`; the company link is external and clearly underlined. The dot is
decorative and never the only status cue.

### Project cards

A bordered card with a title, a three-line description, a repository link and
wrapped technology links. Technology targets are at least 24px and wrap instead
of overflowing. The full description lives on the project page.

### Book card

The card is a 3D flip surface with perspective 1200px.

- Front: cover, title, author, year and type. A small `FLIP` hint sits on the
  cover and is decorative for assistive technology.
- Back: notes, title, author, description and a two-column metadata grid. It
  fills the same box as the front.
- Clicking the front, or pressing Enter or Space on the card control, flips it.
  The back contains a real `Flip back` control. No dialog opens.
- The hidden face is `aria-hidden` and `inert`; the trigger reports
  `aria-pressed`. The focus ring is visible.
- Cards in a row share height. The back is scrollable if content exceeds the
  card; the overlay must not block that scroll.
- Reduced motion changes faces without the 3D rotation.

### Filter pills

Outlined, 14px, 510 weight, fully rounded. Inactive uses `border-border`;
active uses `bg-primary` and `text-primary-foreground`. No yellow. Filtering is
reflected in the query string, and the number of visible books is announced in
a polite status region.

### Contribution graph

A compact 52 or 53 week calendar. Column count and month offsets come from the
data, never a fixed 51. Dates, totals and month labels use `Intl`. Cells are
square and scale with the grid; the card uses its content height rather than a
fixed height. A `Less` to `More` legend sits under the month labels. The graph
scrolls horizontally on narrow screens; provide a visible scrollbar or a fade at
the trailing edge. An empty data set is an error state, not a zero count. The
GitHub link is at least 28px. Keep at least 24px between the card and the
section links below.

### Tables

Organization and icon tables keep names on one line where they are compared,
but descriptions and long values wrap. Long values retain access to the full
string through a title or a detail surface. Empty results use a localized empty
state. Pagination, column visibility, sorting and filtering have text labels or
accessible names; menus are localized. The sort header icon is a 16px Morphicon
between `ChevronsUpDown`, `ArrowUp` and `ArrowDown`, with `reducedMotion="user"`.
Tables never force the page wider than the viewport; the table wrapper scrolls
if necessary.

### Feedback dialog

Native `<dialog>` opened with `showModal()`, named with `aria-labelledby`, with
`autofocus` on the textarea, `closedby="any"` and a `::backdrop`. Do not add
`role="dialog"`, `aria-modal`, a focus trap or manual focus return. The page
behind is inert by the platform. The message field has a visible or
screen-reader label; the counter and error remain associated.

### Agent lens

The agent layer is exposed by a two-state icon-only control in the header. It
uses the same size, radius, hover, active and focus treatment as the theme
control. There is no aura, no special fill and no visible label at any
breakpoint. The icon switches between a bot and a person; the action lives in
the accessible name and `aria-pressed`.

When active, the root gets `agent-mode`. The header stays so the reader can
leave or change theme and language. The human page and footer are hidden. The
main landmark shows one plain-text document:

- The content is the generated agent brief for the current locale, built from
  the same post, project and book data as the human pages. `/agent.md` and
  `/agent.json` remain the English canonical files.
- The document is monospace, 0.875rem, 1.7 line height and at most 86
  characters wide. Long URLs wrap. It scrolls with the page; there is no card,
  image, terminal palette or animation.
- A single hairline toolbar names the surface as `text/markdown`, shows the
  line count, and offers `Copy agent brief`, `agent.md` and `Human view`.
- Copy confirms in a polite live region that clears after 2.5 seconds. The
  `Human view` action returns focus to the header control.
- The state persists in `localStorage` and `?mode=agent`, applied before first
  paint. The human view stays hidden from assistive technology; the text view
  stays hidden when the mode is off.
- The mode adds no entrance animation or decorative motion. The header press
  scale is the same as every other button; scroll-to-top honors
  `prefers-reduced-motion`.

The machine files and boundaries are documented in
[docs/agent-readiness.md](docs/agent-readiness.md).

### Toast and footer

Toasts follow the active theme and stay neutral. The footer mirrors the header
width, keeps the mascot and copyright readable, and respects the bottom safe
area.

## States

- **Hover:** only under `(hover: hover) and (pointer: fine)`. It is never the
  only way to reach content.
- **Focus:** global `:focus-visible` ring with a 2px foreground perimeter and
  offset. Do not remove it without an equivalent.
- **Active:** a short press scale or surface shift between 100 and 160ms.
- **Selected:** a surface or border change plus an accessible state attribute.
- **Disabled:** native `disabled`, reduced opacity and no press motion.
- **Loading:** keep the current context, disable duplicate submission and show
  a spinner or progress cue. Text loading states use an ellipsis.
- **Empty:** a localized message and a path forward. Never render a broken
  layout.
- **Error:** say what failed and what the reader can do next. Keep valid input.

## Motion

- UI transitions: 150 to 200ms with `--ease-out`.
- Book flip: 620ms with `cubic-bezier(0.34, 1.2, 0.64, 1)`.
- Use explicit transition properties, never `transition-all`.
- Animate `transform` and `opacity` for movement; colors use `ease`.
- Hover motion is gated; reduced motion keeps color and opacity and removes
  transforms, tilt and glare.
- Do not auto-rotate text. The header tagline is static.
- No motion on functional data while it is being read.

## Accessibility

- Native elements first: `<button>` for actions, `<a href>` for navigation,
  `<dialog>` for modals.
- Every control has an accessible name; icon-only controls use a localized
  label.
- Every pointer action has a keyboard path. Focus order follows DOM order.
- Focus is never hidden under the sticky header; `scroll-padding-top` covers it.
- Targets are at least 24px; primary mobile controls are 40px.
- Form fields have labels, error associations and a 3:1 boundary. Text inputs
  are at least 16px on mobile.
- Images have dimensions and meaningful alt text. Decorative icons are
  `aria-hidden`.
- Respect `prefers-reduced-motion` and 200% text scaling.
- Tables and the contribution graph have accessible summaries. An empty state
  is announced, not only drawn.

## Content and internationalization

- English and Chinese are native copy, not literal translations.
- No em dashes or en dashes in user-facing strings. Use commas, periods,
  colons, parentheses or a semicolon.
- Buttons are verb-first. Links describe their destination. Errors name a
  recovery.
- Use one vocabulary for an object across the site.
- Dates and numbers use `Intl`. Counters use plural rules, not string
  concatenation.
- Keep strings whole for translation; do not assemble sentences from
  fragments.

## Implementation

- Tokens live in `frontend/src/styles/app.css`; components consume semantic
  tokens and avoid literal UI colors.
- `light-dark()` and the color-scheme meta own theming. Do not add a second
  theme switch mechanism.
- The native `<dialog>` owns modal behavior; do not rebuild a focus trap.
- Use the project's Tailwind scale and existing component primitives. Do not
  add a second component library.
- Only keep reachable UI modules. Do not add a dependency no reachable file
  imports.
- Run the review in [docs/skills/SKILLS.md](docs/skills/SKILLS.md) before
  claiming a UI change is verified.
- Agent files and JSON-LD are data, not decoration. Keep them in sync with the
  page data and keep `docs/agent-readiness.md` current.
- Do not add an A2A or MCP surface without a real callable service.

## Review checklist

For every UI change, inspect the actual page in both themes:

- 1440px, a narrow layout and 320px; 200% text scaling.
- Long and wrapping content, one item, empty and error states.
- Hover, focus, active, disabled, loading and selected states, where affected.
- Shared component consumers, not only the edited surface.
- The full page composition, not only the isolated component.
- The keyboard path, accessible names and focus visibility.
- Agent lens at 320px and 200%, with the human view hidden and the plain-text
  document readable.
- No clipped content, hidden action, horizontal page scroll or overlapping
  label.
- No state carried by color or motion alone.
- No unverified claim: report what was inspected and what was not.

The DeepSeek Harness UI workflow and review cookbook are the source of the
evidence requirements:

- [UI development workflow](https://github.com/deepseek-ai/deepseek-harness/blob/master/.agents/skills/dsh-client-ui-ux/SKILL.md)
- [Review cookbook](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cookbook/reviewing-ui-design.md)
- [UI design principles](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/ui-design-review-cases.md)

## Don'ts

- No yellow or acid-lime selector.
- No hardcoded root `color-scheme: light` or `color-scheme: dark`; map the meta.
- No modal for book details.
- No auto-rotating or auto-updating text without a pause control.
- No hover-only content.
- No card shadows.
- No weights above 590.
- No second typeface.
- No additional accent colors in UI chrome.
- No clipped content at 320px or 200% scaling.
- No dead UI tree or unused dependency.
- No em dashes or en dashes in user-facing copy.
