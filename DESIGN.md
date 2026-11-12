# Design System

The portfolio is an editorial interface with one typeface, hairline structure and a single neutral active state. It follows the system color scheme by default and keeps a dark, Linear-like canvas as its dark theme. It is built from the direction given for this site: Inter, no yellow selector, book cards that flip in place and no modal for book details.

## Principles

1. **Type carries the hierarchy.** Inter, tight tracking and a small weight range do the work. Color is not used to rank content.
2. **Structure comes from hairlines.** Cards and panels are separated by 1px borders and surface shifts, never by shadows.
3. **One active state.** The selected filter and the primary form action are paper white on dark, black on light. There is no acid lime, yellow or second accent.
4. **Click is explicit.** Book cards reveal their notes by flipping in place. No hover-only details and no modal.
5. **Motion explains state.** Flips, fades and press feedback are short and interruptible. Reduced motion keeps the state change without the movement.

## Color

The site follows the system color scheme by default. A light or dark override is stored only when it differs from the system; toggling back to the system value removes the override. `color-scheme` is declared as `light dark`, mapped from the `<meta name="color-scheme">` element and consumed by `light-dark()` tokens. Light mode is a paper alternative; dark mode is the Linear-like canvas.

| Token | Dark | Light | Use |
| --- | --- | --- | --- |
| `--background` | `#08090a` | `#ffffff` | Page canvas |
| `--card` | `#0f1011` | `#ffffff` | Cards and panels |
| `--popover` | `#161718` | `#ffffff` | Dialogs and elevated surfaces |
| `--foreground` | `#ffffff` | `#000000` | Headings, emphasis |
| `--card-foreground` | `#d0d6e0` | `#000000` | Body copy |
| `--muted-foreground` | `#8a8f98` | `#666666` | Metadata, captions |
| `--border` | `#23252a` | `rgb(0 0 0 / 12%)` | Hairline borders |
| `--input` | `#62666d` | `#767676` | Form control borders, 3:1 against the surface |
| `--primary` | `#ffffff` | `#000000` | Active filter, primary action |
| `--primary-foreground` | `#08090a` | `#ffffff` | Text on primary |
| `--secondary` | `#161718` | `#f1f1f1` | Badges, quiet fills |
| `--accent` | `#23252a` | `#f1f1f1` | Hover and selected surfaces |
| `--destructive` | `#eb5757` | `oklch(0.577 0.245 27.325)` | Errors only |

Color in covers, technology marks and the contributions graph is content, not UI chrome. Do not add colored hover states, gradients or card shadows.

## Typography

Inter Variable is loaded once through the Astro Fonts API. Use the Tailwind scale in `frontend/src/styles/app.css`.

| Role | Size | Line height | Weight |
| --- | --- | --- | --- |
| Caption | 13px | 1.5 | 400 |
| Meta | 14px | 1.55 | 400 to 510 |
| Body | 16px | 1.6 | 400 |
| Lead | 20px | 1.4 | 400 |
| Card title | 16 to 24px | 1.3 | 510 |
| Subheading | 30px | 1.2 | 510 |
| Page title | 40 to 48px | 1.08 | 510 |
| Section title | 32 to 44px | 1.15 | 510 |

Rules:

- Weights are 400, 510 and 590. Never 700 or 800.
- Display tracking is `-0.022em`; medium sizes use `-0.012em`; small uppercase labels use `0.08em` to `0.1em`.
- Enable `cv01` and `ss03`, and use slashed zero through `font-variant-numeric`.
- Long-form copy stays between 60 and 75 characters per line.
- Line heights are unitless.

## Shape and spacing

| Element | Radius |
| --- | --- |
| Cards | 12px |
| Buttons and inputs | 6px |
| Badges | 4px |
| Filters | 9999px |

Use a 4px base. Common steps are 8, 12, 16, 24, 32, 48 and 64px. Cards have 16 to 24px padding. The reading column is 768px; Books may use 1024px with the header matching that width.

Do not use shadows on cards. Use `border-border`; change to `border-foreground/30` on hover or focus.

## Motion

- UI transitions: 150 to 200ms.
- Book flip: 620ms with `cubic-bezier(0.34, 1.2, 0.64, 1)`.
- Easing tokens: `--ease-out`, `--ease-in-out`, `--ease-drawer`.
- Use explicit transition properties, never `transition-all`.
- Movement uses `transform` and `opacity`; colors use `ease`.
- Reduced motion keeps the state change and removes transforms, tilt and glare.
- Do not auto-rotate text. The header tagline is static.

## Components

### Header

Solid `background`, no blur. A two-line wordmark at 510 weight, 40px controls on mobile and 36px on desktop. The Books page header matches the 1024px grid.

### Filter pills

Outlined, 14px, 510 weight, fully rounded. Inactive uses `border-border` and `card-foreground`. Active uses `bg-primary` and `text-primary-foreground`. No yellow. Hover darkens the border.

### Book card

- The card is a 3D flip surface with perspective 1200px.
- Front: cover, title, author, year and type. A small `FLIP` pill sits on the cover.
- Back: notes, title, author, description and a two-column metadata grid. It fills the same box as the front.
- Clicking the front, or pressing Enter or Space on the card control, flips the card. The back has a visible Flip back control. The card does not open a modal.
- The hidden face is `aria-hidden` and `inert`; `aria-pressed` reports the state.
- The overlay trigger is a real button with a visible focus ring. Cards in a row share the same height.
- Reduced motion changes faces without the 3D rotation.

### Links

Text links are underlined with `decoration-foreground/30` and become fully underlined on hover. No blue or other colored hovers. Arrow icons are allowed where they clarify the action.

### Feedback dialog and toast

Dialogs use the native `<dialog>` element with `showModal()`, `closedby`, `::backdrop` and `autofocus`. Do not add `role="dialog"`, `aria-modal`, a focus trap or manual focus return. The panel uses a 12px radius and a 200ms entrance. The submit action uses `bg-primary`. Toasts follow the current theme and remain neutral.

## Don'ts

- No yellow or acid-lime selector.
- No hardcoded root `color-scheme: light` or `color-scheme: dark`; keep the base at `light dark` and map the meta element.
- No modal for book details.
- No auto-rotating or updating text without a pause control.
- No hover-only book content.
- No card shadows.
- No weights above 590.
- No second typeface.
- No additional accent colors in UI chrome.
