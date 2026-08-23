# Cursor prompt — paste this whole block

You have access to my LG Studio / portfolio repository. I am giving you a handoff package (folder `csc-handoff/`) containing an **approved** redesign of my Criar Sin Culpas case study. Read `csc-handoff/HANDOFF-MANIFEST.md` first.

This is a **migration of an approved case-study experience into an existing production system**. It is not a redesign and not a site rebuild.

- The handoff page is the **visual and editorial source of truth**.
- My repository is the **technical and production source of truth**.
- The final implementation combines the two.

## Step 0 — Inspect before touching anything

1. Inspect the current production implementation of `/studio/case-studies/criar-sin-culpas/` (markup, all page CSS/JS, assets, metadata, analytics).
2. Inspect the shared LG Studio shell and every dependency that page uses: `/studio/brand-system/tokens.css`, `/studio/css/lg-studio-shell.css`, `/studio/js/studio-shell.js`, `/studio/js/studio-i18n.js`, `/assets/css/lg-ecosystem-strip.css`, `/assets/js/nav-component.js`, and the brand/hero assets.
3. Look for an existing **archival or versioning convention** in the repo (any `archive/`, `v1/`, `legacy/`, `_previous/` pattern). If one exists, use it. Do not invent a path when a convention exists.

## Step 1 — Produce a short implementation plan first

Before writing any code, output a plan that names:

- which existing files will be modified
- which new files, if any, will be added
- which existing shared systems will be reused as-is
- which Lovable-specific code will be discarded or translated
- any asset-path differences between the handoff and production
- the archive path you chose and why (existing convention vs. new)
- any potential regressions or conflicts you detect

Then proceed.

## Step 2 — Preserve the current live version as a historical snapshot

Before replacing anything:

1. Copy the current implementation and everything it needs to render (page markup, page-specific CSS/JS, any assets not shared) into a non-canonical archive location. If the repo has no convention, use `/studio/case-studies/criar-sin-culpas/archive/v1/`.
2. Fix up the archived page's internal paths so it renders standalone.
3. Add `<meta name="robots" content="noindex, nofollow">` to the archived page.
4. Label it internally as the previous/historical version (an HTML comment at the top plus a small non-intrusive on-page note is fine).
5. Keep it out of navigation, sitemaps, and canonical/SEO surfaces. Do not link to it from the canonical page.
6. Verify the archived page renders independently and does not affect the canonical route.

## Step 3 — Replace the canonical implementation

1. Use `csc-handoff/page/index.production.html` as the markup for the canonical page at the **same URL**: `/studio/case-studies/criar-sin-culpas/`. Adapt it to the repo's file conventions (static HTML vs. template/partial) without changing the DOM structure, class names, `data-reveal` hooks, or `data-i18n-*` attributes.
2. Install the page CSS/JS from `csc-handoff/page/`: `csc-case-v0.css`, `csc-crops.css`, `csc-crops-applied.css`, `csc-mobile-editorial.css`, `csc-image-crops.js`, `csc-director-bridge.js`. Keep the load order exactly: tokens → ecosystem strip → studio shell → `csc-case-v0` → `csc-crops` → `csc-crops-applied` → `csc-mobile-editorial` **last**.
3. Icons and evidence images in the handoff are already production assets — if identical files exist in the repo, keep the existing ones and do not duplicate.
4. Set `robots` to `index, follow` on the canonical page. Apply the repo's existing `?v=` cache-busting values to shared CSS/JS.

## Step 4 — Preserve production infrastructure

Reuse, do not replace: the canonical route, LG Studio navigation/shell (`#studio-chrome-root`), site footer (`#studio-footer-root`), ecosystem nav (`#site-nav` + `body.has-ecosystem-nav`), the language-toggle infrastructure (`studio-i18n.js`), Plausible/analytics instrumentation, SEO and metadata behavior, accessibility behavior, shared design tokens, and the production asset architecture. Keep the mount divs from the handoff markup; keep production's shell code.

## Step 5 — Typography

Use the existing LG Studio typography system: Fraunces (editorial display), Inter (body), Big Shoulders Display (structural labels), JetBrains Mono (system/evidence labels), consumed through the existing token variables. Do not introduce a new global design system, new font variables, or any temporary Lovable font treatment. If production already loads these families globally, remove the page-level Google Fonts `<link>` instead of double-loading.

One approved exception to keep: on mobile, eyebrow/label elements render in Inter rather than Big Shoulders Display for legibility. That rule already lives in `csc-mobile-editorial.css`.

## Step 6 — Preserve every approved editorial refinement

Carry over verbatim: the new opening/origin framing (Nari's trusted voice and audience as the starting point, not a website rebuild), the stronger first-person authorship, the 60-second read module, the approved section sequence (hero → formation arc → 60-second read → chapters 01–10 → final synthesis), the mobile spacing refinements, the improved card composition, the improved eyebrow legibility, the evidence/validation distinctions, the final LG Studio synthesis and closing line, headlines without trailing periods, lowercase `sec`/`seg`, and **zero em dashes anywhere in visible English or Spanish copy**.

Preserve the approved responsive behavior exactly, including the `<picture>` sources, `srcset` widths, breakpoints, and crops. Do not reinterpret or re-derive them.

## Step 7 — Translate, don't import

The only Lovable-specific pattern is the mobile hero asset path (`/__l5e/assets-v1/...`), already replaced with the Cloudinary URL in `index.production.html`. Discard all other Lovable scaffolding (React/TanStack files, `src/`, config). Nothing else from the Lovable environment should enter the repo. No npm dependencies and no build step are required.

## Do NOT

- create a new route, or leave the old page running alongside the new one at a canonical/indexable location
- redesign or "improve" the approved page
- replace shared LG Studio navigation, shell, or footer with Lovable versions
- duplicate assets that already exist in the repo or on Cloudinary
- introduce a new global design system or font stack
- alter unrelated pages
- remove or weaken analytics
- break bilingual functionality or drop any `data-i18n-*` pair
- replace production infrastructure just because Lovable implemented it differently

## Step 8 — QA both pages

Run the QA checklist in `csc-handoff/HANDOFF-MANIFEST.md` against the new canonical page **and** the archived v1 snapshot. Confirm that only the new version is canonical and indexable, that the archive is `noindex, nofollow` and renders standalone, that there is no horizontal overflow at 393px / 768px / 1440px, that Spanish toggles cleanly, that no asset 404s, and that zero em dashes and zero `/__l5e/` references remain. Report the results.
