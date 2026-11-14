# Typography study

## Reference

The reference is [pheralb.dev](https://pheralb.dev/), a Svelte and Tailwind
personal site built around one typeface and very few size steps. Its source is
useful because the restraint is explicit:

- Body copy is 16px with a loose line height.
- Section headings are `text-xl`, 20px.
- A post title is `text-3xl md:text-4xl`, 30px to 36px.
- Card and post links are 16px to 18px.
- Dates, tags and source labels use 12px to 14px.
- Hierarchy comes from spacing, weight and a thin rule before it comes from
  display size.
- The largest text is a post title at 36px. There is no 48px or 60px display
  heading.

Source examples:

- [Experience section](https://github.com/pheralb/pheralb.dev/blob/main/src/components/experience.svelte)
- [Post page](https://github.com/pheralb/pheralb.dev/blob/main/src/routes/post/%5Bslug%5D/%2Bpage.svelte)
- [Global styles](https://github.com/pheralb/pheralb.dev/blob/main/src/styles/globals.css)

This is a reference for restraint, not a template to copy. The portfolio is
more editorial than pheralb.dev, so it keeps a slightly larger page title and a
larger section title, but it removes the oversized display scale.

## Scale

The project uses Inter Variable and Tailwind. The scale is a 1.125 to 1.25
progression from a 16px body, with line heights that tighten as the size grows.

| Token | Size | Line height | Role |
| --- | --- | --- | --- |
| `text-xs` | 13px | 1.5 | Metadata, captions, table details |
| `text-sm` | 14px | 1.55 | Controls, dense UI, notes |
| `text-base` / `text-md` | 16px | 1.6 | Body and long-form copy |
| `text-lg` | 18px | 1.5 | Lead, intros, card titles on mobile |
| `text-xl` | 20px | 1.4 | Card titles, roles, dialog titles |
| `text-2xl` | 24px | 1.3 | Section titles on mobile, article subheads |
| `text-3xl` | 28px | 1.25 | Section titles on desktop, page titles on mobile |
| `text-4xl` | 32px | 1.2 | Page titles at tablet, article titles |
| `text-5xl` | 36px | 1.15 | Page titles at desktop |
| `text-6xl` | 40px | 1.1 | Reserved; not used for a page title |

The applied roles:

| Role | Mobile | Desktop | Class |
| --- | --- | --- | --- |
| Header wordmark | 18px | 20px | `text-lg md:text-xl` |
| Section heading | 24px | 28px | `text-2xl md:text-3xl` |
| Page title, editorial | 28px | 36px | `text-3xl sm:text-4xl md:text-5xl` |
| Page title, compact | 28px | 32px | `text-3xl sm:text-4xl` |
| Post title | 28px | 32px | `text-3xl md:text-4xl` |
| Card title | 18px | 20px | `text-lg md:text-xl` |
| Body | 16px | 16px | `text-md` |
| Metadata | 13px | 13px | `text-xs` |

## Decisions

- **One body size.** Body copy remains 16px. A 15px body would look denser but
  would break the reading rhythm and the 320px measure.
- **Page titles stop at 36px.** The old 60px page titles were competing with the
  content. The new page title is 2.25 times the body, close to pheralb.dev's
  36px post title.
- **Section titles are 24px to 28px.** They stay clearly below the page title
  and above the 18px to 20px card title. The extra 4px at desktop is enough to
  separate the section from the card.
- **Article titles are 28px to 32px.** An article title is a reading entry
  point, not a billboard. The body and the meta row stay close to it.
- **Card titles are 18px to 20px.** Project and post titles remain easy to scan
  without becoming display type.
- **Line height tightens with size.** 1.6 for body, 1.4 for card titles, 1.25
  for section titles, 1.15 for page titles.
- **Tracking stays optical.** Display text uses `-0.022em`; card and control
  text uses `-0.012em` or less. Smaller text is not tracked tighter.
- **Spacing carries hierarchy.** The reduced heading scale works with the 24px
  gap between sections and the 60 to 75 character measure. Do not compensate
  for smaller headings by adding more weight.
- **The scale is static at breakpoints.** Fluid clamp values made the headings
  change at every viewport and produced inconsistent line breaks. The scale now
  steps at 640px, 768px and 1024px with the rest of the layout.
- **Chinese uses the same steps.** The CJK fallback stack inherits the size and
  line height. No separate Chinese display scale.

## Rules

- Use `text-md` for body, never below 16px on a long-form page.
- Use `text-xs` for metadata, never for a paragraph.
- Use `text-2xl md:text-3xl` for section titles.
- Use the page title classes only once per page.
- Do not use `text-6xl` for a page title.
- Do not use 700 or 800 weights to fake hierarchy after reducing size.
- Keep headings at `text-wrap: balance` and paragraphs at `text-wrap: pretty`.
- Keep display tracking at `-0.022em` and body tracking at zero.
- At 320px, the page title is 28px and the section title is 24px. At 200% text
  scaling the layout must still reflow without horizontal overflow.

## Verification

- `pnpm -C frontend build` passes.
- The type-scale Playwright test checks a 36px page title, a 28px desktop
  section title, a 24px mobile section title and a 16px body.
- The 320px and 200% checks cover the same pages.
- Both themes use the same scale.
