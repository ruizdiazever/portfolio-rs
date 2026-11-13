# Agent skills

This file is the routing map for interface and engineering judgment in this
repository. It is not a second `AGENTS.md`, and it does not restate skill
instructions. The skill catalog installed in the current DeepSeek Harness
session is authoritative; this page says which owner to load and in what order.

Read it with [AGENTS.md](../../AGENTS.md), [DESIGN.md](../../DESIGN.md), the
[agent readiness note](../agent-readiness.md) and the public
[README.md](../../README.md).

## Installed capability

| Source | Use | Load by |
| --- | --- | --- |
| Emil Kowalski pack | Motion judgment, choreography, gestures, animation review and performance | `emil-design-eng`, `animate`, `choreograph`, `gestures`, `remove-animations`, `find-animation-opportunities`, `improve-animations`, `animation-performance`, `animation-vocabulary`, `apple-design` |
| Jakub Krehel pack | Interface craft, accessibility, layout, writing, typography, color, polish, stress testing, mobile feel | `better-*`, `better-interface`, `break-ui`, `mobile-native` |
| Vercel Web Interface Guidelines | Interaction detail: focus, keyboard, names, forms, state, motion and HTML behavior | `web-design-guidelines` |
| DeepSeek Harness native | Harness facts, docs, badges, security review, office files, screen-recording paint timing, shadcn-svelte | `dsh-doc`, `dsh-badge`, `security-audit`, `office*`, `ui-recording-timeline`, `shadcn-svelte` |

Never edit an installed skill in place. Update it through the skill manager.
When a skill and this repository disagree about a project convention, the
repository owner wins. Always write the fix in this project's stack and tokens.

## One axis, one owner

| Axis | Owner | Skill that applies it | Not for |
| --- | --- | --- | --- |
| Motion judgment: whether to animate, curve, duration, interruption | Emil Kowalski | `emil-design-eng`, `animate`, `choreograph`, `remove-animations` | type, color, layout |
| Interface craft: a11y, type, color, layout, copy, ranked review | Jakub Krehel | `better-*`, `better-interface`, `break-ui` | motion decisions |
| Interaction detail: focus, keyboard, names, forms, hover, micro-states | Rauno Freiberg | `web-design-guidelines` | art direction |
| Motion implementation: springs, gestures, frame budget | Matt Perry | `animation-performance`, `gestures` | taste, art direction |
| Inclusive accessibility: WCAG, focus, assistive technology | Sara Soueidan | `better-accessibility` | visual polish |
| Typography: rendering, fonts, wrapping, punctuation | Rasmus Andersson | `better-typography` | layout, motion |
| Hierarchy and spacing: grouping, responsive structure, density | Steve Schoger and Adam Wathan | `better-layout`, `better-interface` | motion, deep a11y |
| Stress testing: long, empty, one, huge and translated data | Jakub Krehel | `break-ui` | redesign |
| Phone feel: hover, tap, viewport, inputs, safe areas | Emil Kowalski | `mobile-native` | desktop art direction |
| Engineering quality: performance, CWV, build budget | Addy Osmani | no installed skill; use judgment and measurements | visual taste |

Load the owning skill before judging its axis. Do not use one axis as a proxy
for another. A UI review and a motion review are separate passes.

## Routing

| Task | Skill |
| --- | --- |
| Build or change one animation or transition | `animate` |
| Several elements move as one | `choreograph` |
| Drag, swipe, fling or sheet dismissal | `gestures` |
| Too much motion, keyboard motion, "feels slow" | `remove-animations` |
| Where motion is missing | `find-animation-opportunities` |
| Audit existing motion | `improve-animations` |
| Janky or dropped frames | `animation-performance` |
| Surfaces, radii, shadows, icons, optical alignment | `better-ui` |
| Keyboard, ARIA, focus, zoom, reduced motion | `better-accessibility` |
| Type scale, wrapping, tabular numbers, line length | `better-typography` |
| Palette, semantic tokens, contrast | `better-colors` |
| Grouping, alignment, responsive, RTL | `better-layout` |
| Labels, errors, empty states, confirmations | `better-writing` |
| Whole screen, ranked report | `better-interface` |
| UI code against the interaction checklist | `web-design-guidelines` |
| Worst-case data and states | `break-ui` |
| Phone feel: tap, hover, viewport, safe areas | `mobile-native` |
| Native `<dialog>`, popover, forms | `web-design-guidelines`, `shadcn-svelte` |
| Repository security review | `security-audit` |
| Screen-recording paint timeline | `ui-recording-timeline` |
| DeepSeek Harness facts | `dsh-doc` |

## Portfolio adaptation

- Stack: Astro 7 SSR, Svelte 5, TailwindCSS 4, bits-ui, Paraglide EN/ZH and
  Playwright. No React, no Motion, no Base UI, no Expo, no Swift.
- Translate recipes, never paste them. `AnimatePresence` becomes Svelte
  `{#if}` with `in:`/`out:` or a CSS transition; Motion springs become
  `svelte/motion` or the project's easing tokens; React dialog recipes become
  native `<dialog>` or bits-ui.
- Project tokens and components outrank skill defaults. A deliberate project
  convention is not a finding.
- Skip `ask-sonner` (React), `animate-expo`, `write-swift` and any React-only
  library pick. Check Svelte support before adopting a library.
- Highest-value rules for this reading-first portfolio:
  - Body text is 16px and long-form measures stay at 60 to 75 characters.
  - 320px and 200% text scaling must not clip content or hide actions.
  - Every control has a name, a visible focus ring and a keyboard path.
  - No hover-only content. Books flip on click, not on hover.
  - No auto-rotating text. The header tagline is static.
  - Motion is 150 to 200ms for UI, 620ms for the book flip, and always honors
    `prefers-reduced-motion`.
  - Color is content. UI chrome stays inside the semantic tokens.
  - English and Chinese are native copy, never literal translations.

## Review process

Use `better-interface` as the orchestrator when the request is a whole-screen
review. It loads the owning skills in this order:

1. `better-accessibility`
2. `better-layout`
3. `better-writing`
4. `better-typography`
5. `better-colors`
6. `better-ui`

Then add `web-design-guidelines` for interaction detail and `break-ui` for
worst-case data. Run motion separately with `emil-design-eng` and the relevant
motion skill. Do not merge the two reports.

### Evidence required

- Inspect the actual page in the assembled layout, not only the component or
  CSS. Include directly affected neighbors and states.
- Inspect both themes for color, opacity, text and borders.
- Inspect a constrained width, 320px, and 200% text scaling for layout,
  spacing, type and sizing.
- Inspect long and wrapping content, empty and one-item states, and the
  affected loading, error, disabled, selected and focus states.
- Trace shared-component consumers before calling a shared fix verified.
- Report what was inspected, what was fixed and what remains uninspected. A
  passing test does not replace a rendered inspection.

This is the DeepSeek Harness UI change workflow. See the
[UI skill](https://github.com/deepseek-ai/deepseek-harness/blob/master/.agents/skills/dsh-client-ui-ux/SKILL.md)
and the
[review cookbook](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cookbook/reviewing-ui-design.md).

## Agent surfaces

Agent readiness is a product surface, not a skill. The owner is
[docs/agent-readiness.md](../agent-readiness.md). Keep the agent panel, the
machine files and the discovery tags in the same change as the content they
describe. See `AGENTS.md` for the invariants.

## What DeepSeek Harness does with these files

DeepSeek Harness loads `AGENTS.md` as a durable workspace instruction chain.
It starts with the user-global file and walks from the repository root to the
session working directory, broad to specific. Duplicate sibling files render
once, and the baseline carries a size budget. Keep project instructions short,
specific and linked to deeper owners instead of copying skill text into them.
See the [agent-instructions package](https://www.npmjs.com/package/@deepseek-ai/dsh-agent-instructions).

Skills are loaded on demand from the session catalog. This file is a map, not
a skill and not a preload. Load one owner at a time, apply its checks, and keep
the skill's instructions out of the repository.
