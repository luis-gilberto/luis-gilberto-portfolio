# The Hub Style Guide — Responsive Icon & Navigation

## Responsive Icon Implementation

- Asset: `/TheHub/assets/images/3D_icon_Transparent.png`
- Usage: Mobile drawer logo on Hub pages
- HTML: `img` uses `loading="lazy"`, `decoding="async"`, `sizes` and `srcset` with width hints
- CSS breakpoints:
  - `@media (max-width: 480px) { width: 80px }`
  - `@media (min-width: 481px) and (max-width: 768px) { width: 100px }`
  - `@media (min-width: 769px) and (max-width: 1024px) { width: 120px }`
  - Default: `width: 120px; max-width: 180px; height: auto; object-fit: contain`
- Theme: Do not invert colors; transparency should render naturally (`filter: none`)

## Hamburger Menu Icon

- Selector: `.mobile-menu-toggle span`
- Color: `#FFFFFF` for strong contrast against dark nav background
- Behavior: Keep transition effects; ensure visibility in light and dark modes

## Performance & Accessibility

- Add `alt` text to all images
- Use `loading="lazy"` and `decoding="async"`
- Keep file sizes small; target PNG <50KB, provide WebP alternative when available

## Favicons & Meta Icons

- Canonical favicon set for Hub and brand pages:

  ```html
  <link rel="apple-touch-icon" sizes="180x180" href="/assets/images/apple-touch-icon-180x180.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/images/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/assets/images/favicon-16x16.png">
  <link rel="manifest" href="/assets/images/site.webmanifest">
  <link rel="shortcut icon" href="/assets/images/favicon.ico">
  ```

- Use absolute paths from the site root so pages under `/brand`, `/TheHub`, and `/insights` share the same icon set.
- Verify icons load without 404s and render correctly in Chrome, Firefox, Safari, and Edge.

## QA Checklist

- Lighthouse Performance: target >90 on Hub pages
- Validate HTML/CSS with W3C validators
- Cross-browser transparency checks: Chrome, Firefox, Safari, Edge; iOS and Android
- Device tests: iPhone 8, Samsung Galaxy S9

## File Paths Updated

- `/TheHub/IMCServices/index.html`: responsive logo + hamburger color
- `/TheHub/advisory/index.html`: responsive logo CSS
- `/TheHub/scopeiq/index.html`: responsive logo CSS
- `/TheHub/strategyiq/index.html`: responsive logo

## Insights Case Studies — Title Color

- Scope: Only pages under `Insights` categorized as `Work That Mattered` featuring Microsoft use cases
- Selector: `.hero-section .hero-content .hero-title { color: #FFFFFF; }`
- Rationale: Ensures high contrast against dark hero overlays; preserves all font properties
- Contrast: White text on dark overlay achieves ≥ 7:1, exceeding WCAG AA 4.5:1
- Pages: `family-safety-launch`, `free-to-be-free`, `transforming-browsing-ai`, `edge-ucational-series`, `teams-consumer-launch`, `edge-mobile-rebrand`
