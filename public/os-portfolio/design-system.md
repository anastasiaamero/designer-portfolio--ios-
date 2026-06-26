# Portfolio OS Design System

## Design Read

Portfolio OS is a single-screen desktop portfolio for a graphic designer. The visual language is an Apple Liquid Glass web approximation: soft translucent surfaces, restrained motion, dark gray Inter typography, and consistent widget grids.

## Foundations

### Typography

- Font family: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- Primary text: `#232428`
- Secondary text: `rgba(35, 36, 40, 0.64)`
- Tertiary text: `rgba(35, 36, 40, 0.48)`

### Type Scale

- Label: `12px / 1`, weight `600`
- Body: `14px / 1.2`, weight `430`
- Statement: `14-17px / 1.12`, weight `600`
- Title: `25px / 1.04`, weight `680`

### Color Tokens

- `--color-text-primary`: main text
- `--color-text-secondary`: body/support text
- `--color-text-tertiary`: quiet UI text
- `--color-glass`: widget background
- `--color-glass-strong`: hover widget background
- `--color-glass-control`: gray button/icon surface
- `--color-glass-control-hover`: gray button/icon hover
- `--color-glass-dark`: dark top controls
- `--color-accent`: editor focus/accent only
- `--color-danger`: destructive actions only

### Wallpaper

- Desktop background uses `assets/sky-wallpaper.jpg`.
- Widget glass should remain light enough for the sky to show through, but text must stay dark and readable.
- Do not add synthetic hill/gradient scenery over the wallpaper.

### Radius Tokens

- Widget: `29px`
- Inner card: `21px`
- Control: `19px`
- Pill: `999px`

### Spacing Tokens

- `--space-1`: `4px`
- `--space-2`: `8px`
- `--space-3`: `12px`
- `--space-4`: `16px`
- `--space-5`: `18px`
- `--space-6`: `22px`
- `--space-7`: `26px`
- `--space-8`: `32px`

## Widget Grid

Every widget uses the same internal grid:

- Horizontal padding: `--widget-pad-x` (`26px`)
- Bottom/content padding: `--widget-pad-y` (`22px`)
- Header height: `--widget-head-h` (`52px`)
- Main content gap: `--widget-gap` (`18px`)
- Dense inner gap: `--widget-tight-gap` (`12px`)
- Desktop column gap: responsive `18-24px`
- Under-main gap for widgets below the central card: same as desktop column gap

No text, icon, or button can ignore these tokens. If content does not fit, increase widget height or clamp text inside the frame.

## Components

### Widget Frame

Base class: `.widget`

Rules:
- Absolute-positioned desktop element.
- Uses Liquid Glass surface tokens.
- Always `overflow: hidden`.
- Always uses `--radius-widget`.
- Hover only changes transform, background, border, shadow, and filter.

### Widget Header

Base class: `.widget-head`

Rules:
- Fixed height: `--widget-head-h`.
- Horizontal padding: `--widget-pad-x`.
- Label text uses `--type-label` and `--weight-semibold`.
- Right-side actions use the same size and color across all widgets.

### Widget Content

Pattern:

```html
<div class="widget-head">...</div>
<div class="widget-content">...</div>
```

Rules:
- Content must use `--widget-pad-x` and `--widget-pad-y`.
- Use `--widget-gap` between major content groups.
- Use `--widget-tight-gap` inside compact cards.

### Glass Control

Base class: `.glass-control`

Used for dock buttons and contact bubbles.

Rules:
- Background: `--color-glass-control`.
- Hover: `--color-glass-control-hover`.
- Text/icon color: `--color-text-primary`.
- Border: translucent white.
- Active state scales down slightly.
- Contact labels use the same header grid as all other widget labels.
- Label and icon must never touch. Use `--widget-gap` between a contact header and its icon row.

### Icons

Base class: `.ui-icon`

Rules:
- Icons come from `assets/icons`, extracted from the supplied `icons.zip`.
- Use regular SVG image tags for Safari and `file://` stability.
- SVG icons from the supplied set are white by default; apply `filter: brightness(0)` on light controls and remove the filter on dark controls.
- Dock mapping: `User_Circle` for `Обо мне`, `Files` for `Проекты`, `Mail` for `Контакты`.
- Contact mapping: `Paper_Plane` for Telegram, `Mail` for email, `Link_Horizontal` for LinkedIn/external profile.
- Use `Caret_Right_SM` for project/open arrows and `Caret_Down_SM` for the contacts widget.
- Do not mix inline hand-drawn SVG with this icon system.

### Project Category Widget

Base class: `.project-category-widget`

Rules:
- Project categories are separate draggable widgets, not cards inside one large widget.
- Header uses the same widget label system, with a circular `>` action on the right.
- Internal padding is `20px` on compact category widgets.
- Body content is anchored to the bottom so the top header stays visually clean.
- Do not add decorative text bars/lines above project descriptions.
- Text is clamped to 3 lines and must never overflow the frame.
- Current default categories: `Айдентика`, `Web`, `Коммуникации`, `Моушин`.

### Legacy Project Strip

Base class: `.projects-strip`

Rules:
- Only use this if the design returns to one large project widget.
- Horizontal internal scroll.
- Scroll snapping on project cards.
- Hidden scrollbar for macOS/iOS-like behavior.
- Enough right padding for fade overlay and partial next-card visibility.

### Dock

Base class: `.dock`

Rules:
- Contains only primary portfolio areas: `Обо мне`, `Проекты`, `Контакты`.
- Buttons use glass control color.
- Labels must fit on one line.
- Icon and text always have an `8px` gap.

## Layout Grid

The desktop uses a three-column widget grid:

- Left column: bio and contacts.
- Center column: main about widget with statement text inside.
- Right column: four project category widgets in a 2x2 grid.
- Column and category gap: responsive `18-24px`.
- New widgets should use `layoutMetrics()` and `nextFreePosition()` instead of manual coordinates.
- The internal desktop canvas has a minimum logical width of `1180px`.
- If the browser viewport is narrower, scale the whole desktop canvas instead of recalculating widgets into skinny columns.
- Saved layouts must be validated before use; broken or legacy widget sizes reset to the starter grid.
- Starter widgets are vertically centered as one group on the desktop canvas, with room left for the dock below.

## Motion

Motion is only used for feedback:

- Widget hover: lift and slight scale.
- Widget drag: stronger lift, brighter glass, higher z-index.
- Project category hover: widget lift, brighter glass, active press state.
- Button hover: lift and background change.
- Active state: small scale down.
- Reduced motion disables transforms.

## Rules For Future Changes

- Add new colors only as semantic tokens.
- Add new widget spacing only as tokens.
- Do not hardcode new widget padding.
- Do not let visible text overflow a widget.
- Do not add a new dock item unless it is a primary portfolio section.
- Keep Inter everywhere.
