# Family Safety – Hero "Tile" Experiment (Tablet-first)

This document explains the experimental hero visual treatment implemented in `insights/family-safety-launch/index-experiment.html`. The goal is to create a floating "tile" appearance for the hero image that overlaps the hero banner, with responsive, accessible behavior.

## Objectives

- Overlap the hero image beyond the hero-section to create depth and visual interest
- Use CSS transforms for precise, animation-friendly positioning
- Apply a configurable drop shadow for depth and hierarchy
- Maintain responsive behavior across tablet breakpoints; stay lower-right on desktop
- Preserve accessibility standards (meaningful alt text, non-obstructive layout)

## Implementation Notes

- Overlap achieved by setting `overflow: visible` on `.hero-section` at tablet widths, and shifting `.hero-image-container` downward via `transform`.
- Stacking order ensured by raising `.hero-image-container` to `z-index: 4`, above overlay/content.
- Shadow configured via a CSS variable to enable easy tuning.

### Key CSS Variables (in `:root`)

- `--tile-offset-y-tablet`: default `28px` – amount to move the image downward on tablet
- `--tile-offset-x-tablet`: default `0px` – horizontal adjustment on tablet
- `--tile-shadow`: default `0 16px 40px rgba(0,0,0,0.35)` – drop shadow for depth
- `--tile-offset-x-desktop`: default `16px` – slight right offset on desktop
- `--tile-offset-y-desktop`: default `12px` – slight down offset on desktop

### Breakpoint Behavior

- Tablet (`min-width: 768px and max-width: 1200px`):
  - `.hero-section { overflow: visible; }`
  - `.hero-image-container { z-index: 4; box-shadow: var(--tile-shadow); transform: translate(var(--tile-offset-x-tablet), var(--tile-offset-y-tablet)); }`

- Desktop (`min-width: 1201px`):
  - `.hero-image-container { z-index: 4; transform: translate(var(--tile-offset-x-desktop), var(--tile-offset-y-desktop)); }`

- Mobile (`max-width: 968px` and below):
  - Original layout maintained for stability; no overlap effect applied.

## Accessibility

- Hero image retains meaningful alt text.
- Decorative diagonal slices and overlay are `aria-hidden` to avoid noise.
- Focus styles are provided for `.hero-image-container` if made focusable (optional).

## How to Tweak

1. Open `insights/family-safety-launch/index-experiment.html`.
2. Adjust the CSS variables in `:root` for offsets and shadow.
3. Preview across widths: 768px, 992px, 1200px, and 1440px.

## Known Considerations

- Enabling `overflow: visible` for `.hero-section` can expose diagonal slice boundaries if they extend beyond the banner. Current slice positions are tuned to avoid visual artifacts.
- If the overlapping tile should clip to the banner at certain widths, reduce `--tile-offset-y-tablet` or revert to `overflow: hidden` for specific narrow bands.

