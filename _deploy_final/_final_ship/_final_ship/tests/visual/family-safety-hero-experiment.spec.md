# Visual Regression Test Plan – Family Safety Hero Tile Experiment

This plan describes manual visual checks and optional automated screenshot tests to verify the hero tile treatment remains consistent across viewports.

## URLs

- Local dev: `http://127.0.0.1:5500/insights/family-safety-launch/index-experiment.html`
- Production (after deploy): `https://luis-gilberto.com/insights/family-safety-launch/index-experiment.html`

## Viewports to Test

- 768×1024 (tablet portrait)
- 992×768 (tablet landscape)
- 1200×900 (large tablet / small desktop)
- 1440×900 (desktop)

## Assertions

1. Overlap effect
   - The hero image visually extends below the hero banner on tablet.
   - The drop shadow is visible and consistent with `--tile-shadow`.

2. Positioning
   - Tablet: the image is shifted downward (`--tile-offset-y-tablet`) and remains visually balanced with the headline/subtitle.
   - Desktop: the image remains in the lower-right corner with subtle offsets.

3. Stacking context
   - The image tile is above the overlay and content (`z-index: 4`).
   - No interactive elements are obstructed.

4. Responsiveness
   - No layout shifts or clipping as width changes across the test breakpoints.

5. Accessibility & contrast
   - Alt text present on the image (`Family Safety App Launch`).
   - Dark mode remains readable; tile shadow does not reduce legibility of text.

## Optional: Playwright screenshot baseline

If Playwright is available, add a baseline pass and then compare:

1. Install (one-time):
   ```bash
   npm i -D @playwright/test
   npx playwright install
   ```
2. Create `tests/playwright/family-safety-hero.spec.ts` (a stub has been added) and run:
   ```bash
   npx playwright test tests/playwright/family-safety-hero.spec.ts
   ```
3. Review screenshots for regressions between commits.

