# Criar Sin Culpas — Production Handoff Manifest

Approved Lovable version → new canonical implementation at `/studio/case-studies/criar-sin-culpas/`.
Lovable page = visual + editorial source of truth. Existing repo = technical + production source of truth.

---

## FILES

### `page/` (the approved page)
| File | Purpose |
| --- | --- |
| `index.production.html` | **Use this one.** Approved markup, bilingual attributes, responsive `<picture>`, a11y attributes, metadata. Mobile hero points at the Cloudinary source; `robots` set to `index, follow`. |
| `index.lovable-preview.html` | Byte-for-byte copy of what was approved in the Lovable preview. Reference only (mobile hero points at Lovable CDN, `robots` = `noindex, nofollow`). Diff against it if anything looks off. |
| `csc-case-v0.css` | Primary case-study stylesheet (layout, chapters, hero, cards, evidence modules, desktop typography scale). |
| `csc-crops.css` | Crop framework: aspect boxes, focal-point variables, object-position primitives. |
| `csc-crops-applied.css` | Generated per-image crop/focal-point values. Pairs with `csc-image-crops.js`. |
| `csc-mobile-editorial.css` | **Approved mobile refinement layer** (loads last). Owns mobile rhythm, edge-to-edge bleeds, brief-card gutters, alternating paper tones, eyebrow legibility fix, reduced-motion handling. Must remain the last stylesheet. |
| `csc-image-crops.js` | Applies crop/focal data to images at runtime. |
| `csc-director-bridge.js` | Reveal-on-scroll (`[data-reveal]`) + editorial director hooks. Fails open: content stays visible if JS is off. |
| `icons/*.svg` | Page-specific inline-referenced icons: `estetoscopio-cream.svg`, `pin.svg`, `prohibido.svg`. |
| `evidence/*.png` | Evidence crops: `Gen-A..D-source.png`, `gov-brand-crop.png`, `gov-sor-crop.png`. |

### `shared-reference/` (do NOT overwrite production copies)
`studio-shell.js`, `studio-i18n.js`, `lg-studio-shell.css` — included only so Cursor can confirm the contracts the page depends on (`#studio-chrome-root`, `#studio-footer-root`, `data-i18n-*`). Production versions win.

### `assets/`
`csc-case-study-hero-mobile.png.asset.json` — Lovable CDN pointer for the mobile hero, for provenance only.

---

## ASSETS

| Asset | Status |
| --- | --- |
| `/studio/assets/csc_case-study_hero_landscape.png` | existing production asset (desktop/tablet hero) |
| `/studio/assets/csc_case-study_hero_vertical.png`, `csc_case-study_moment-landscape.png` | existing production assets |
| `/studio/brand-system/assets/monogram.png`, `lockup-full.png` | existing production assets (favicon, shell/footer) |
| `/studio/case-studies/criar-sin-culpas/icons/*.svg` | existing production assets (re-handed off unchanged) |
| `/studio/case-studies/criar-sin-culpas/evidence/*.png` | existing production assets (re-handed off unchanged) |
| All `res.cloudinary.com/dogtoagya/...` images (behind-screen governance/production/measurement/protected-access, protocol-test, protocol-mom movil/tablet/desktop, intervention, secure, the_reads, learn_article, mockup real screens, CSC_Product_Architecture, CSC_EL-Estudio, csc-social-live-practice, Rhyth_landscape) | Cloudinary assets — **keep the existing URLs and `srcset` widths exactly as written** |
| Mobile hero `IMG_8843_crbeka.png` (`v1787447134`) | Cloudinary asset — new to this version; referenced in `index.production.html`. Do not re-upload. |

No new binary assets need to be added to the repo.

---

## FONTS

Lovable preview loads, and production should keep, the canonical LG Studio families via one Google Fonts `<link>`:
`Fraunces` (editorial display), `Inter` (body), `Big Shoulders Display` (structural labels), `JetBrains Mono` (system/evidence labels).

- Consume them through the existing tokens (`--font-ed`, `--font-body`, etc.) from `/studio/brand-system/tokens.css`. Do not introduce new font variables or a second type system.
- The earlier temporary Instrument Serif / Work Sans override was already removed — do not reintroduce it.
- One deliberate exception, keep it: on mobile the eyebrow/label elements render in `Inter`, not Big Shoulders Display, for legibility. That rule lives in `csc-mobile-editorial.css` and is approved.
- If production already loads these families globally, drop the page-level `<link>` rather than double-loading.

---

## BREAKPOINTS

| Range | Behavior |
| --- | --- |
| `≤767px` | Approved mobile editorial layer active. Portrait Cloudinary hero via `<source media="(max-width: 767px)">`. Single-column, edge-to-edge image bleeds, tightened card heights with ~25px internal gutters, alternating paper tones, inset counter numerals, Inter eyebrows. |
| `768–1023px` | Tablet: landscape hero, shell gutters, two-up modules where defined in `csc-case-v0.css`. |
| `≥1024px` | Full desktop editorial grid, wide evidence layouts, chapter rhythm from `csc-case-v0.css`. |
| `prefers-reduced-motion: reduce` | Reveal transitions disabled; all content renders in final state. |

`srcset` widths per image are already tuned. Do not re-derive them.

---

## INTERACTIONS

- **Reveal on scroll** — `[data-reveal]` elements, driven by `csc-director-bridge.js` (IntersectionObserver). Content must remain visible if the script fails or motion is reduced.
- **Crops** — `csc-image-crops.js` + `csc-crops-applied.css` set focal points; both must load.
- **Shell** — `#studio-chrome-root` (`data-studio-page="studio"`, `data-studio-chapters=""`) and `#studio-footer-root` (`data-studio-footer="site"`) are mounted by production `studio-shell.js`. Keep the mount divs; keep the production shell.
- **Ecosystem nav** — `#site-nav` with `data-base="/"` plus `body.has-ecosystem-nav`, styled by `/assets/css/lg-ecosystem-strip.css`.
- **Language toggle** — production `studio-i18n.js` swaps `data-i18n-en` / `data-i18n-es`, honoring `data-i18n-attr` for `alt`, `content`, `aria-label`. Every visible string on the page has a matched pair; visible fallback text equals the English value.
- **Analytics** — Plausible: `<script defer data-domain="luis-gilberto.com" src="https://plausible.io/js/script.js">`. Keep whatever production already uses; never drop instrumentation.

---

## DEPENDENCIES

No npm packages, no build step, no framework. Plain HTML + CSS + vanilla JS.
Required to already exist in the repo: `/studio/brand-system/tokens.css`, `/studio/css/lg-studio-shell.css`, `/studio/js/studio-shell.js`, `/studio/js/studio-i18n.js`, `/assets/css/lg-ecosystem-strip.css`, `/assets/js/nav-component.js`, and the hero/monogram assets above.

---

## MIGRATION NOTES

1. **Lovable-only pattern:** the mobile hero in `index.lovable-preview.html` uses a Lovable CDN path (`/__l5e/assets-v1/...`). `index.production.html` already replaces it with the Cloudinary URL. No `/__l5e/` path should reach production.
2. **Robots:** the Lovable preview was `noindex, nofollow`. The production canonical page must be indexable — `index.production.html` sets `index, follow`. The archived v1 snapshot gets `noindex, nofollow`.
3. **Cache busting:** production uses `?v=` query strings on shared CSS/JS. Match the repo's current values rather than the ones in the handoff HTML.
4. **Stylesheet order is load-bearing:** tokens → ecosystem strip → studio shell → `csc-case-v0` → `csc-crops` → `csc-crops-applied` → `csc-mobile-editorial` (last).
5. `csc-case-study-image-manifest.json` is a Lovable-side derivation aid and is intentionally not handed off; the applied crop CSS already contains the values.
6. Any React/TanStack files in the Lovable project are scaffolding only. Discard them.

---

## QA CHECKLIST

- [ ] Canonical URL `/studio/case-studies/criar-sin-culpas/` serves the new version; no second/parallel route
- [ ] Desktop (≥1280px): hero, chapter rhythm, evidence layouts intact
- [ ] Tablet (768–1024px): landscape hero, no clipped modules
- [ ] Mobile (393px and 430px): portrait hero, approved card gutters, alternating tones, inset counters
- [ ] English renders with correct fallback text everywhere
- [ ] Spanish toggle swaps all copy, `alt`, `content`, and `aria-label` values with no leftover English
- [ ] LG Studio nav, drawer, ecosystem strip, and site footer mount from production shell code
- [ ] Language toggle works in both header and mobile drawer
- [ ] All imagery loads; crops and focal points match the approved reference
- [ ] Typography: Fraunces / Inter / Big Shoulders / JetBrains Mono all load; mobile eyebrows in Inter
- [ ] Responsive text wrapping: no orphaned or broken headline wraps at 393px, 768px, 1440px
- [ ] Plausible fires on the canonical page
- [ ] Title, description, robots, favicon correct; canonical page indexable
- [ ] Accessibility: single H1, alt text present, focus visible, drawer focus trap, reduced-motion respected
- [ ] No horizontal overflow at any breakpoint
- [ ] Zero 404s in console/network
- [ ] Zero em dash (`—`) characters in visible English or Spanish copy
- [ ] Zero `/__l5e/` references
- [ ] Archive route renders standalone, is labeled historical, and is `noindex, nofollow`
