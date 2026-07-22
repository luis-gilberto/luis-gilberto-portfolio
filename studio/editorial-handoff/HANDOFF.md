# LG Studio Homepage · Engineering Handoff

**Version:** 2.0 (corrected)
**Date:** 20 July 2026
**Author:** Design (LG Studio) → Cursor / engineering
**Nature of work:** Controlled visual-system transplant into an existing static HTML page. Not a redesign. Not a rebuild. Not a framework migration.

---

## 0 · Read this first

This handoff replaces v1.0, which incorrectly targeted a React / Vite / TypeScript port. That was wrong.

**The correct implementation context:**

| Detail | Value |
|---|---|
| Canonical repository | `luis-gilberto/luis-gilberto-portfolio` |
| Local working path | `C:\Users\luisg\Projects\luis-gilberto-portfolio\luis-gilberto-portfolio-fresh` |
| Homepage file | `studio/index.html` |
| Current stylesheet (retiring) | `studio/css/studio-lovable.css` |
| Current JavaScript | `studio/js/studio.js` |
| Production URL | `https://www.luis-gilberto.com/studio/` |
| Cloudflare Pages preview | `https://studio-lovable-faithful-port.misitio-6ld.pages.dev/studio/` |
| Stack | Static HTML · vanilla CSS · vanilla JS · Cloudflare Pages |

**No framework migration. No React. No Vite. No TypeScript. No Next.js. No StrategyIQ repo.**

**The task:** Transplant the approved editorial visual system from the GenSpark prototype into `studio/index.html`, replacing the current `.lv-*` presentation, while preserving every accessibility affordance and behavioral contract already living on the Phase 2 page.

**Two sources of truth:**

- **Visual + content:** the GenSpark prototype (`index.html`, `assets/css/lg-studio-editorial.css`, `assets/js/lg-studio-editorial.js` in this bundle)
- **Behavior + accessibility + routing:** the existing Phase 2 `studio/index.html` in the repo

Where the two conflict, **visual** comes from the prototype and **behavior** comes from the existing page. Both must survive the transplant.

---

## 1 · What is already working on the Phase 2 page — preserve these

The current `studio/index.html` (Phase 2) contains working, tested, accessible:

- **Symptom → Underlying Conditions Explorer** — one responsive DOM structure, semantic buttons/tabs, arrow-key navigation, Home/End key support, visible keyboard focus, accurate `aria-selected`, associated `role="tabpanel"`, progressive enhancement, `aria-live="polite"` on the interpretation region
- **Engagement Paths** — desktop tabs + mobile accordion (two distinct DOM structures) with the correct tab/accordion behavior
- **Microsoft Bookings link** — the production Outlook `bookwithme` URL, correctly parameterized
- **StrategyIQ Light link** — the current production path
- **Approved diagnostic-first section order**
- **Approved positioning and scope boundaries** — do not remove or reword scoped-out language

**None of this is up for debate in this pass.** If the transplant would break any of the above, hold the transplant on that section and flag it.

---

## 2 · Why we did this redesign

The prior visual system on `studio/index.html` had the right content architecture but the wrong presentation:

- Flat type hierarchy · every section read as equally weighted
- Muddy warm-tan palette with no clear anchor
- Decorative graphics that read as placeholders (matrix grid, signal scatter)
- Two competing dark sections (Read.Direct.Build + Architecture First)
- Utilitarian nav + footer with no publication feel
- An AI-generated hero illustration that carried no narrative weight

The redesign chose **full editorial magazine** direction (Aperture / 032c energy), and layered in the sibling **Cinematic Storytelling System** (already in production for the Criar Sin Culpas case study) so the homepage and its case studies feel like they belong to the same practice.

---

## 3 · Two visual subsystems — how they relate

LG Studio uses two related-but-distinct visual subsystems. Do not merge them. Do not force one to look like the other.

### 3.1 LG Studio Editorial Framework

**Where it lives:**
- The homepage (`studio/index.html`)
- Practice pages (`/studio/practice/*` if/when added)
- Studio navigation, engagement, and conversion sections
- Any StrategyIQ presentation embedded in Studio pages

**Typography:**
- **Fraunces** (300, occasional 400/500) — editorial serif, display headlines, pull quotes, drop caps
- **Barlow Condensed** (500) — structural condensed sans, LG frame chrome, section markers, all-caps meta labels (letter-spacing 0.22–0.32em)
- **Inter** (400/500/600) — body copy, UI text
- **JetBrains Mono** (400/500) — numerals, metadata, figure captions, small labels

**Visual language:**
- Publication masthead with a bordered LG monogram
- Issue folio strip
- Numbered section markers (`§ 01`, `§ 02`, …)
- Figure captions (`Fig. 01`, `Fig. II`, …)
- Marginalia column beside the hero lede
- Pull quotes with hairline coral border
- Restrained hairline rules
- Cream ivory / navy-black ink / terracotta accent
- **One primary dark anchor section per page** (Read. Direct. Build.)

### 3.2 LG Studio Cinematic Storytelling System

**Where it lives:**
- The full Criar Sin Culpas case study page (already in production)
- Future project features (Casa con Max, Taller Sixtos, Sharnay Photography)
- Any Context → System → Experience storytelling sequence
- Immersive project imagery (Worlds 1 / 2 / 3)

**Reference documents** (already in the sibling design-system repo):
- `DESIGN-SYSTEM.md` — the full specification
- `tokens.css` — the drop-in CSS custom properties
- `index.html` — a canonical case-study implementation
- `templates/case-study.html` and `templates/feature-card.html`

**Typography (case-study surfaces only):**
- **Newsreader** (Google Fonts) — the sole body serif
- **IBM Plex Mono** — the museum-wall / caption mono

**Visual language:**
- Three-Act structure (Human Reality → The Product Exists → Inside the Experience)
- Warm ink darkness for World 3 (never pure black)
- The Guide Card component (warm-glass background, ember external glow)
- Cursor Reveal (hover-to-peel) interaction
- 35mm grain overlay on World 3
- Cross-dissolve palette transitions between Acts II and III

### 3.3 What the two subsystems share

Both must remain visibly related through these shared foundations:

| Foundation | Editorial | Cinematic |
|---|---|---|
| Palette family | cream / ivory · navy-black ink · terracotta | cream · bone · terracotta · ember · ink · warm-shadow |
| Motion philosophy | "deep breath" — 620ms emerge, 320ms settle | "clarity emerging from overwhelm" — 720ms emerge, 320ms settle |
| Editorial discipline | figure labels · section numerals · hairline rules | act labels · running mono headers · plaque captions |
| Emphasis rule | color, not slant · `.accent-text` class | color, not slant · `.accent` class |
| Italic reservation | pull quotes with direct quotations · titled works · true italic voice only | identical rule |
| Voice | editorial · considered · present tense | identical |

### 3.4 Where the homepage compresses the Cinematic system

The Selected Work section on the homepage (§ 04) includes the **Criar Sin Culpas Feature Triptych** — a compressed three-act preview that follows the Cinematic system's Context → System → Experience arc, but uses the Editorial Framework's typography (Fraunces + Barlow Condensed) so it reads as native to the homepage.

This is intentional. The **homepage previews the Cinematic language**; the full case study **realizes it**. Clicking through to the full case study should feel like the same story amplified, not a jarring stylistic switch.

---

## 4 · Deliverables in this bundle

```
handoff/
├── HANDOFF.md                          ← this document
├── index.html                          ← the working editorial prototype
└── assets/
    ├── css/
    │   └── lg-studio-editorial.css     ← the Editorial Framework, single file
    ├── js/
    │   └── lg-studio-editorial.js      ← ~200 lines, no dependencies
    └── img/
        ├── hero/
        │   └── lg-studio-hero-v3.png   ← Luis at the wall
        ├── founder/
        │   └── lg-portrait.jpg
        └── work/
            ├── csc-hero.png            ← candid photo (kept for reference)
            ├── csc-devices-mockup.jpg  ← devices in situ (kept for reference)
            ├── csc-act1-context.png    ← World 1 photo for the triptych
            ├── csc-act2-system.png     ← World 2 photo for the triptych
            └── csc-act3-experience.png ← World 3 photo for the triptych
```

Open `index.html` in any modern browser. No build step required. Google Fonts is the only external dependency for the Editorial Framework typography.

---

## 5 · Target file layout in the portfolio repo

The transplant should land in this structure:

```
luis-gilberto-portfolio-fresh/
└── studio/
    ├── index.html                              ← replace lv-* markup with the editorial prototype's markup
    ├── css/
    │   ├── studio-lovable.css                  ← retire; do not delete until parity confirmed
    │   └── lg-studio-editorial.css             ← new · from this bundle
    ├── js/
    │   ├── studio.js                           ← retain; existing accessible Explorer + Engagement live here
    │   └── lg-studio-editorial.js              ← new · scroll reveal + smooth anchor scroll (see § 8.4)
    └── assets/images/
        ├── hero/
        │   └── lg-studio-hero-v3.png
        ├── founder/
        │   └── lg-portrait.jpg
        └── work/
            ├── csc-act1-context.png
            ├── csc-act2-system.png
            └── csc-act3-experience.png
```

**During transplant:**
1. Keep `studio-lovable.css` in the file tree so a rollback is one-line.
2. `index.html` swaps its `<link rel="stylesheet">` from `studio-lovable.css` to `lg-studio-editorial.css`.
3. The existing `studio.js` continues to handle the Symptom Explorer, Engagement tabs/accordion, and any progressive enhancement already in production. The new `lg-studio-editorial.js` in this bundle is **additive** — scroll-reveal and smooth-anchor behaviors only. See § 8.4 for the decision tree on which JS handles what.
4. Once parity is verified in Cloudflare preview, remove `studio-lovable.css` in a follow-up commit.

---

## 6 · Design tokens (source of truth)

Ported from `assets/css/lg-studio-editorial.css`. These sit in `:root` and can either stay inline in the stylesheet or move to a `studio/css/tokens.css` file, imported first.

### 6.1 Palette

| Token | Hex | Purpose |
|---|---|---|
| `--ivory` | `#F5EEE3` | Primary background |
| `--ivory-alt` | `#EFE6D8` | Alt background · subtle section shift |
| `--paper` | `#FBF6EC` | Raised surface · cards · rails |
| `--paper-warm` | `#F0E6D2` | Warmer paper for warm sections |
| `--ink` | `#0B0F1A` | Primary text · dark anchor background |
| `--ink-2` | `#17223B` | Body text (navy-black) |
| `--ink-soft` | `#2A3552` | Nav links · muted UI |
| `--terracotta` | `#E27D6C` | THE accent · numerals · emphasis · rules |
| `--terracotta-d` | `#C4604F` | CTA hover · pressed state |
| `--rule` | `rgba(11,15,26,0.14)` | Standard hairline |
| `--rule-strong` | `rgba(11,15,26,0.28)` | Stronger grid hairline |
| `--rule-light` | `rgba(245,238,227,0.16)` | Hairline on dark surfaces |
| `--rule-light-2` | `rgba(245,238,227,0.32)` | Stronger hairline on dark surfaces |

**Reserved (not currently applied on the Editorial homepage, but reserved for interoperability with the Cinematic system):**

| Token | Hex | Purpose |
|---|---|---|
| `--teal` | `#486E6C` | Reserved |
| `--gold` | `#C8A557` | Reserved |

### 6.2 Typography

Loaded from Google Fonts, all four families in a single request:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;500;600&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,300;1,9..144,400&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

Self-hosting these as WOFF2 subset files is fine for perf. Preserve the four family roles.

### 6.3 Type scale (fluid, `clamp()`)

| Token | Value | Use |
|---|---|---|
| `--display-lg` | `clamp(64px, 9vw, 168px)` | Hero title |
| `--display` | `clamp(52px, 7vw, 128px)` | Section headlines |
| `--lede` | `clamp(18px, 1.4vw, 22px)` | Lead paragraphs |
| `--body` | `17px` | Body copy |
| `--mono-sz` | `12px` | Standard mono |
| `--mono-sm` | `11px` | Small mono labels |

### 6.4 Motion

| Token | Value | Use |
|---|---|---|
| `--ease` | `cubic-bezier(0.16, 1, 0.3, 1)` | Standard reveal ("deep breath") |
| `--ease-out` | `cubic-bezier(0.22, 0.61, 0.36, 1)` | UI transitions |
| `--dur` | `320ms` | Standard interaction |
| `--dur-slow` | `620ms` | Accordion expand · scroll reveals |

**Respect `prefers-reduced-motion`** — a global override in the stylesheet already kills animation duration for users who've opted out. Preserve this.

---

## 7 · Emphasis rule (critical — corrected from v1)

**The v1 handoff was wrong.** It said we globally redefined `<em>` to render as upright terracotta. That was a hack, not a system. This version corrects it.

### The rule

- **Emphasis in headlines is carried by COLOR, not by slant.**
- Use the **`.accent-text`** class:
  ```html
  <h1>Good marketing isn't decoration. <span class="accent-text">It's architecture.</span></h1>
  ```
- **Semantic `<em>` is reserved for real italics only:**
  - Pull quotes containing direct quotations
  - Titled works: `<em class="true-italic">Criar Sin Culpas</em>` or `<cite class="true-italic">Criar Sin Culpas</cite>`
  - True italic voice inside body prose
- **Italic is not decoration.** Do not italicize headline emphasis words, nav active states, tag labels, or UI ornaments.

### The transitional shim (temporary — remove after migration)

The prototype HTML in this bundle still uses `<em>` tags for headline emphasis (a legacy of an earlier iteration). To preserve the current visual state without forcing a migration in this pass, the stylesheet includes:

```css
/* Transitional shim — remove once markup is migrated to .accent-text */
em {
  font-style: normal;
  color: var(--terracotta);
}
em.true-italic,
cite.true-italic {
  font-style: italic;
  color: inherit;
}
```

**Migration path for Cursor:**

1. During the transplant, replace every emphasis `<em>...</em>` in markup with `<span class="accent-text">...</span>`. Do a search-and-replace pass across `studio/index.html`.
2. Any real italic (titled work, direct quote) becomes `<em class="true-italic">` or `<cite class="true-italic">`.
3. Once all `<em>` in `studio/index.html` are accounted for, remove the shim block from `lg-studio-editorial.css` and let semantic `<em>` return to its default behavior (real italics).

This gets us to the canonical rule (semantic `<em>` = real italic; `.accent-text` = color emphasis) without a risky refactor in a single pass.

---

## 8 · Section-by-section transplant plan

Approved page order (14 blocks). Do not add, remove, rename, or reorder:

1. Masthead
2. Folio
3. Hero
4. Diagnostic Belief
5. Symptom → Underlying Conditions Explorer
6. StrategyIQ
7. Selected Work
8. Read. Direct. Build.
9. Strategist Notes
10. Architecture First
11. Founder
12. Engagement Paths
13. Final CTA
14. Footer / Colophon

### 8.1 Masthead + Folio (new markup)

Both are entirely new. Add above the current `.lv-hero` in `studio/index.html`. No existing behavior to preserve.

- Sticky masthead with `backdrop-filter` blur, LG monogram, nav links, terracotta CTA pill.
- Folio strip: `LG Studio · Selected essays & work | Issue No. I / Vol. 2026 | Est. 2026 · Seattle`.

### 8.2 Hero (new markup, minor behavior)

Two-column grid: type left, editorial photo right. The photo is `position: sticky` so it holds while the type column scrolls beside it on desktop.

- Editorial headline: **"Good marketing isn't ~~decoration~~. It's *architecture.*"** (`.strike` on decoration, `.accent-text` on "It's architecture.")
- Drop cap paragraph — the `L` and `G` of LG treated as a two-letter drop cap glyph.
- Marginalia column: Read / Direct / Build with mono numerals.
- CTA row: `FIND THE REAL PROBLEM` (primary), `SEE HOW THE PRACTICE WORKS` (ghost).

### 8.3 Diagnostic Belief (mostly new markup, copy preserved)

Two-column split: essay left (headline + lede + pull quote), Depth column right (surface tags + numbered list of 7 conditions + footnote).

All copy is preserved verbatim from Phase 2. Only the presentation changes.

### 8.4 Symptom Explorer (KEEP existing behavior; swap presentation only)

**This is the highest-risk section.** The existing Phase 2 Explorer is accessible and working. Do not rebuild it.

**Transplant approach:**

1. **Keep** the existing `studio/js/studio.js` handlers for the Explorer intact. They already implement:
   - Semantic buttons as tabs (`role="tab"`, `aria-selected`, `aria-controls`)
   - Arrow-key navigation (Up/Down/Left/Right)
   - Home / End key support
   - Visible keyboard focus state
   - `aria-live="polite"` on the interpretation region so screen readers hear the updated read
   - Progressive enhancement — the panel content is server-rendered for the initial tab
2. **One responsive DOM structure only.** Do not duplicate the Explorer markup for desktop and mobile. If the current Phase 2 page already has one responsive structure, keep it. If it has two, keep the desktop one and use CSS to adapt on mobile.
3. **Replace only the classnames and structural CSS.** Reskin `.lv-explorer-*` classes to the new `.explorer-*` classes from `lg-studio-editorial.css`. The DOM shape and ARIA attributes remain identical.
4. **The `symptomData` map** in the new `lg-studio-editorial.js` in this bundle is **illustrative** — the Phase 2 Explorer already has its own data source. Do not double-wire the data model. If the Phase 2 data source is server-rendered or ships different copy, that copy wins.

### 8.5 StrategyIQ + Readout Artifact (new markup, canonical content)

Structural content is canonical per the **StrategyIQ Light Readout Artifact spec** (separate document, provided by the StrategyIQ Light product team). Eight sections, in this exact order:

1. The Read
2. Why This Reads This Way
3. The Constraint Underneath
4. What Matters Now
5. The Move
6. The Next Seven Days
7. Do Not Do This
8. Signal Quality

**Pattern displayed:** Single-Point Bottleneck (quality-lock subtype). Copy in the prototype uses the canonical worked example verbatim.

**Voice discipline (non-negotiable):**
- No em dashes — use middots (`·`) or restructure
- No italics for emphasis — use `.accent-text` on operative words
- No self-rating language ("clear," "strong")
- No theatrical reassurance

**Glyph:** SVG funnel narrowing to a thin exit, `stroke="currentColor"` inheriting `--terracotta`. Do not swap for a bitmap.

**When the engine returns INSUFFICIENT signal:** render the four-block layout (What Is Clear / What Is Still Unresolved / The One Thing That Would Sharpen This / Where to Go from Here). **Do not name a pattern** in that state.

### 8.6 Selected Work — Criar Sin Culpas Feature Triptych (new markup)

Three-act editorial spread inside `.csc-feature`:

- `.csc-masthead` — project meta rail (project number, name, category, URL, dates)
- `.csc-act` (Act 01 · The Context, ivory) — left rail copy + full-height photograph
- `.csc-act.csc-act-alt` (Act 02 · The System, paper) — same layout, alt tone
- `.csc-act.csc-act-dark` (Act 03 · The Experience, ink) — same layout, inverted palette
- `.csc-feature-foot` — credits rail: Client / Role / Focus / VIEW FULL PROJECT

The three background tones (ivory → paper → dark ink) tell the arc. Do not reorder.

After the triptych, the `.work-index` lists Casa con Max, Taller Sixtos, and Sharnay Photography as a numbered index (compressed preview only — no imagery). Each row hover-tints coral. Clicking each row should route to that project's Cinematic case study page once those pages exist.

### 8.7 Read. Direct. Build. (new markup, dark anchor)

**This is the ONE dark anchor on the page.** If Architecture First (§ 10 below) is currently dark on the Phase 2 page, it must be reverted to ivory during the transplant.

Three-column grid with `.rdb-signals` / `.rdb-priority` / `.rdb-build` visuals. All decorative — no interaction, no data binding.

### 8.8 Strategist Notes (new markup, copy preserved)

2×2 grid of `.notes-card`. Copy verbatim from Phase 2. Cards hover-tint coral.

### 8.9 Architecture First (new markup, ivory now, was dark)

Was dark on Phase 2 — now ivory to enforce the "one dark anchor per page" rule. Two-column: essay left (headline + lede + pull quote), diagram right (`.arch-diagram` with surface/structure layers).

### 8.10 Founder (new markup, portrait retained)

Three-column layout: intro (headline + pull quote) · portrait with corner ticks · body (lede + numbered roles list).

The founder portrait `assets/img/founder/lg-portrait.jpg` is retained from the current Cloudinary source.

### 8.11 Engagement Paths (KEEP existing dual-DOM approach)

**Preserve the existing Phase 2 approach: desktop tabs + mobile accordion, two separate DOM structures.**

Do NOT force a risky refactor merely to deduplicate the markup. The current Phase 2 approach works and is accessible. This pass replaces only the classnames and visual treatment:

- Desktop tabs → reskin to the new `.engage-*` classes
- Mobile accordion → reskin to the new accordion presentation

The new `lg-studio-editorial.js` in this bundle contains an accordion example — treat it as illustrative. **The existing `studio.js` handlers own this section.** If your existing `studio.js` uses a `data-*` attribute or ID hook to bind, keep it.

Consolidating the two DOM structures into one responsive DOM is a **separate future task**, not part of this transplant.

### 8.12 Final CTA + Colophon (new markup)

- Final CTA: dark closing anchor mirroring § 5's tone. Single primary CTA button + email fallback.
- Colophon: publication-style footer with monogram, section links, "Set in Fraunces, Barlow Condensed, Inter, and JetBrains Mono."

---

## 9 · JavaScript · what lives where

| Concern | Owner |
|---|---|
| Symptom Explorer tab logic, ARIA, keyboard nav | Existing `studio/js/studio.js` |
| Engagement Paths desktop tabs | Existing `studio/js/studio.js` |
| Engagement Paths mobile accordion | Existing `studio/js/studio.js` |
| Microsoft Bookings CTA click handling | Existing `studio/js/studio.js` (or plain `<a href>`) |
| Scroll-reveal on major elements | New `studio/js/lg-studio-editorial.js` |
| Smooth anchor scroll with masthead offset | New `studio/js/lg-studio-editorial.js` |

The new script is ~200 lines, no dependencies, IntersectionObserver-based, and respects `prefers-reduced-motion`. Load it after `studio.js`, both `defer`.

---

## 10 · Voice discipline (applies to all copy on this page)

- "You" not "we." Second person always.
- Short declarative sentences, then one longer one to breathe.
- No hedge words ("just," "simply," "actually," "really").
- No exclamation marks.
- Sentence case for headlines (except uppercase mono eyebrows).
- No emoji.
- Numerals when they carry weight (`4 minutes`, `1 move`, `7-day path`).
- **No em dashes anywhere** — use a middot (`·`) or restructure.
- Italic is voice, not ornament — see § 7.

---

## 11 · Accessibility checklist (must survive transplant)

- [ ] Skip-to-content link at the top: `<a href="#studio-main" class="visually-hidden focusable">Skip to content</a>`
- [ ] Landmarks: `<header>`, `<main id="studio-main">`, `<footer>`, `<nav>`, each major section with `aria-labelledby="…"` pointing to its heading
- [ ] Symptom Explorer: `role="tablist"`, each tab `role="tab"` + `aria-selected` + `aria-controls`, panel `role="tabpanel"` + `aria-labelledby`, interpretation region `aria-live="polite"`
- [ ] Engagement (desktop): identical ARIA pattern to the Explorer
- [ ] Engagement (mobile): each accordion trigger `aria-expanded` + `aria-controls`, panel `role="region"` + `aria-labelledby`
- [ ] Every `<img>` has descriptive `alt` text
- [ ] `:focus-visible` outline: 2px terracotta, offset 3px (already in stylesheet)
- [ ] `@media (prefers-reduced-motion: reduce)` disables all transitions/animations (already in stylesheet)
- [ ] Contrast: primary text ink `#0B0F1A` on ivory `#F5EEE3` = 15.8:1. Small terracotta text (<18px) can fail 4.5:1 — reserved for decorative mono labels only.
- [ ] No horizontal overflow at any breakpoint (test 375px, 700px, 900px, 1280px, 1440px)
- [ ] All existing anchors resolve to the correct section IDs

---

## 12 · Assets

The prototype references six images already saved to `assets/img/` in this bundle. All six trace back to Cloudinary URLs listed below — you may either self-host them under `studio/assets/images/` or continue serving from Cloudinary with `f_auto,q_auto,w_1600,dpr_auto` transformations.

| Asset | Cloudinary source | Purpose |
|---|---|---|
| `hero/lg-studio-hero-v3.png` | `v1784579804/ChatGPT_Image_Jul_20_2026_01_34_16_PM_ikgiwk.png` | Hero photograph — Luis at the wall |
| `founder/lg-portrait.jpg` | `v1782459574/lg-portrait_kz6qcj.jpg` | Founder portrait |
| `work/csc-hero.png` | `v1782367676/CSC_hero_kk7odu.png` | Reference — retained for parity checks |
| `work/csc-devices-mockup.jpg` | `v1784585697/photo_2026-06-24_08-54-36_zxfgss.jpg` | Reference — retained for parity checks |
| `work/csc-act1-context.png` | `v1784274061/ChatGPT_Image_Jul_16_2026_10_37_12_PM_2_rveu2l.png` | Triptych Act 01 |
| `work/csc-act2-system.png` | `v1784590843/ChatGPT_Image_Jul_20_2026_04_35_20_PM_x6n3v5.png` | Triptych Act 02 |
| `work/csc-act3-experience.png` | `v1784589365/ChatGPT_Image_Jul_20_2026_03_39_40_PM_ph0qrb.png` | Triptych Act 03 |

Add `loading="lazy"` to every `<img>` except the hero, which uses `loading="eager" fetchpriority="high"`.

---

## 13 · Testing checklist

Run through the following before promoting from Cloudflare preview to production.

**Visual parity**
- [ ] Screenshot comparison at 375px, 700px, 900px, 1280px, 1440px against this bundle's `index.html`
- [ ] All headlines render in Fraunces 300; no font fallback flash
- [ ] All eyebrows render in Barlow Condensed 500 uppercase 0.22–0.32em letter-spacing
- [ ] All numerals and mono labels render in JetBrains Mono
- [ ] Terracotta accent only on emphasis words, section numerals, hairline rules, primary buttons
- [ ] One dark anchor section only (Read. Direct. Build.) — Architecture First is ivory
- [ ] Hero photograph loads sharp on retina; `object-position: 55% 50%` centers Luis at the wall

**Behavior**
- [ ] Symptom Explorer: click each of 5 tabs; content updates; `aria-selected` moves; interpretation region announces via `aria-live`
- [ ] Symptom Explorer keyboard: Tab lands on active tab; arrow keys cycle; Home/End jump to first/last
- [ ] Engagement (desktop): click each of 4 tabs; content updates; `aria-selected` moves
- [ ] Engagement (mobile): tap each trigger; only one panel open at a time; `aria-expanded` toggles; `+` rotates to `×`
- [ ] Anchor links in nav scroll with masthead offset (no content hidden under sticky bar)
- [ ] `Book a Conversation` opens the correct Microsoft Bookings URL in a new tab
- [ ] `Start the readout` opens the correct StrategyIQ Light path
- [ ] Reveal-on-scroll fires once per element and does not re-fire on scroll-up

**Accessibility**
- [ ] `axe-core` reports zero violations
- [ ] All interactive elements reachable via Tab in reading order
- [ ] `:focus-visible` rings are visible everywhere (not `outline: none`)
- [ ] `prefers-reduced-motion` disables scroll-reveal, hover-scale, and background gradient shifts

**Performance**
- [ ] Lighthouse: Performance ≥ 85, Accessibility = 100, Best Practices ≥ 95, SEO = 100
- [ ] LCP < 2.5s on Fast 3G throttling
- [ ] No layout shift after fonts load

**SEO + share**
- [ ] `<title>` unchanged from Phase 2
- [ ] `<meta name="description">` unchanged from Phase 2
- [ ] OpenGraph `og:title` / `og:description` / `og:image` preserved
- [ ] Twitter card meta preserved

---

## 14 · Open questions to resolve before shipping

Route these to Luis:

1. **CTA text under Act 01/02/03 links** — currently `VIEW PROJECT →` on each. Should these point somewhere yet (e.g. `/studio/work/criar-sin-culpas`), or stay decorative until the case study route is live?
2. **`See the full publication →` button** (after Work Index) — currently `href="#"`. Should it link to `/studio/selected-work/` (a publication cover page), or a specific project?
3. **Colophon copy** — currently "Editorial direction · design · build by Luis Gilberto." Confirm this is the credit line you want to ship.
4. **Nav order** — Practice / StrategyIQ / Work / Engagement / Luis Gilberto / Book. Should "Luis Gilberto" (personal site link) stay in the primary nav, or move to the colophon?

---

## 15 · What this handoff does NOT do

Explicitly out of scope for this pass:

- ❌ Migrate the page to React / Vite / TypeScript / Next.js
- ❌ Consolidate the Engagement Paths desktop-tabs + mobile-accordion into a single responsive DOM
- ❌ Rebuild the Symptom Explorer JavaScript
- ❌ Change the Microsoft Bookings URL, StrategyIQ Light URL, or any other production destination
- ❌ Alter approved copy anywhere on the page
- ❌ Change the section order
- ❌ Merge the Editorial Framework and Cinematic Storytelling System into one typography stack
- ❌ Introduce new brand colors or new type families

If any of these become necessary during the transplant, stop and route to Luis before proceeding.

---

## 16 · Contact

- Design questions → **Luis Gilberto**
- StrategyIQ Light readout content or structure → **StrategyIQ Light product team** (see the canonical readout reference document)
- Repository access → **luis-gilberto/luis-gilberto-portfolio** — Luis provisions

---

**End of handoff.** Ship the transplant, then remove the transitional `<em>` shim in a follow-up commit.

