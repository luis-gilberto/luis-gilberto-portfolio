# LUIS GILBERTO ECOSYSTEM — SESSION CONTINUITY DNA
**Date compiled:** Saturday, March 21, 2026
**Purpose:** Complete transferable context for continuing work across chat sessions.
**Paste this at the start of a new conversation to restore full context instantly.**

---

## WHO I AM

Luis Gilberto — Senior Integrated Marketing Lead at Microsoft (Edge, Copilot, M365) + independent consultancy **The Hub**. Personal brand ecosystem at **luis-gilberto.com**. Deployed via Cloudflare Pages connected to GitHub. Local dev uses live-server (Trae as coding assistant, Claude as design-thinking + strategy partner). Location: Tacoma/Seattle, WA. Background: Venezuelan-born, came to US on scholarship.

**Aesthetic philosophy:** "Caracas meets Cascadia" — Latin warmth + Scandinavian minimalism.

---

## ECOSYSTEM TAXONOMY (locked, do not violate)

Three surfaces. Three nav components. Non-negotiable.

| Surface | Pages | Nav Component | Visual DNA |
|---------|-------|--------------|------------|
| **Portfolio** | `/`, `/about`, `/timeline`, `/myexperience`, `/contact`, `/cv`, `/brand/` | `nav-component.js` v14.2 | Dark-first, Big Shoulders Display / Playfair / Inter |
| **Work / Case Studies** | `/work/*.html` | `work-nav.js` v1.0 | Dark-first, same tokens as Portfolio |
| **Insights channel** | `/insights/**` | `insights-nav.js` ← PLANNED, NOT YET BUILT | Warm cream/obsidian, Cormorant Garamond, bespoke inline nav |

**Director's Commentary articles** (`/insights/article-name/`) = Insights surface, Insights nav.
**Technical Blueprints** (`/work/*.html`) = Work surface, `work-nav.js`.
They are editorially paired but architecturally separate.

---

## DESIGN SYSTEM TOKENS (stable)

```
--coral:  #F96F6E
--teal:   #2ED3C6  (Portfolio/Work) / #4BADA8 (Insights)
--gold:   #C9A84C

--font-strategist:  'Big Shoulders Display', sans-serif
--font-storyteller: 'Playfair Display', serif  (Portfolio/Work)
                    'Cormorant Garamond', serif (Insights)
--font-orchestrator:'Inter', sans-serif

Dark background:    #080808 (Portfolio/Work) / #1A1714 (Insights dark)
Light background:   #FAFAF8 (Portfolio/Work) / #F5F0EB (Insights light)

localStorage key:   lg-theme   ← HYPHEN NOT UNDERSCORE — recurring bug source
Header height:      64px (all surfaces, normalized)
Portal logo height: 32px (all nav instances — governance standard)
```

**StrategyIQ logotype rule:** Always rendered as Big Shoulders Display 900 italic, STRATEGY in white, IQ in coral (`.siq-logotype`). Never in Playfair. Never as plain text.

**No em dashes anywhere in the ecosystem.** Use colons, parentheses, or periods instead.

---

## FILE PATHS (all relative to repo root)

```
C:\Users\luisg\OneDrive\Documents\Luis Gilberto\
├── index.html                          — Homepage (3-journey smart hero)
├── about.html
├── timeline.html
├── myexperience.html
├── contact.html
├── cv.html
├── brand/
├── assets/
│   ├── js/
│   │   ├── nav-component.js            — Portfolio nav (v14.2)
│   │   ├── work-nav.js                 — Work/Case Studies nav (v1.0)
│   │   └── portal-nav.js              — Portal nav (v1.0)
│   └── images/
│       ├── logo-rotator/               — 15 brand logos for marquee/rotator
│       │   ├── Copilot.png
│       │   ├── Copilot_in_Edge.png
│       │   ├── familysafety.png
│       │   ├── M365_Free_apps.png
│       │   ├── Microsoft_Band.png
│       │   ├── Microsoft365.png
│       │   ├── O365.png
│       │   ├── Office365.png
│       │   ├── Office2016-19.png
│       │   ├── Surface-Pro.png
│       │   ├── Teams.png
│       │   ├── Windows8.png
│       │   ├── SurfaceRT.png
│       │   ├── Office2013.png
│       │   └── MSAccessories.png
│       ├── white_lg-portfolio-logo.webp    — Portfolio nav logo (dark mode)
│       ├── black_lg-portfolio-logo_black.webp — Portfolio nav logo (light mode)
│       ├── TheLGPortal_dark-mode.png   — Portal logo lockup (dark)
│       └── TheLGPortal_light-mode.png  — Portal logo lockup (light)
├── work/
│   ├── case-study-teams-launch.html    — STABLE (work-nav.js applied)
│   ├── edge-mobile-technical-blueprint.html — STABLE
│   ├── case-study-family-safety.html   — STABLE
│   ├── case-study-ai-browsing.html     — needs-governance
│   └── case-study-free-to-be-free.html — needs-governance
├── insights/
│   ├── index.html                      — STABLE
│   ├── series/
│   │   └── index.html                  — STABLE
│   ├── translation-problem/            — STABLE
│   ├── edge-mobile-rebrand/            — STABLE
│   ├── teams-consumer-launch/          — needs-governance
│   ├── family-safety-launch/           — needs-governance
│   ├── building-the-ecosystem/         — needs-governance
│   ├── building-insights/              — needs-governance
│   ├── building-the-hub/               — needs-governance
│   ├── unlocking-the-blank-page/       — stable content, needs nav component
│   ├── proof-of-life/                  — stable content, needs nav component
│   ├── move-at-your-speed/             — stable content, needs nav component
│   ├── edge-ucational-series/          — stable content, needs nav component
│   └── transforming-browsing-ai/       — needs-governance
├── TheHub/
│   ├── index.html                      — STABLE
│   ├── advisory/index.html             — STABLE
│   ├── studio.html                     — STABLE
│   ├── strategy-iq/index.html          — needs-governance (trademark pending)
│   └── clients/index.html              — STABLE
├── portal/
│   ├── recruiters/index.html           — needs-governance
│   └── partners/index.html             — needs-governance
└── site_index.html                     — Mission Control dashboard (v10)
```

---

## `work-nav.js` v1.0 — FULL SPEC

**Location:** `/assets/js/work-nav.js`

**What it injects (self-contained, no dependencies):**
- Sticky header with portfolio logo (`white_lg-portfolio-logo.webp` / `black_lg-portfolio-logo_black.webp`)
- 4-panel mega menu: Portfolio (4 items), Insights (4 series), Hub (4 arms 2-col grid), Portal (feature list + teal CTA)
- Portal nav item = logo image at `height:32px`, NOT text
- Teams-standard rich mobile drawer: 4 Insights series cards + ecosystem global links + pulsing teal status dot
- Theme toggle with logo swap, reads/writes `lg-theme` localStorage key
- Header scroll state: semi-transparent → opaque on scroll
- Reading progress bar (targets `#progress` element in page)
- Active state via `data-active` attribute on `<body>`
- CSS Grid `1fr auto 1fr` layout for centered nav

**Usage (two lines only):**
```html
<body data-active="portfolio">
...
<script src="/assets/js/work-nav.js" defer></script>
</body>
```

**Do NOT use on:** Insights pages, Portfolio pages. Those have their own nav systems.

---

## INSIGHTS NAV STANDARD (bespoke inline — `insights-nav.js` NOT YET BUILT)

Every Insights page currently has inline bespoke nav. The standard was established on `insights/index.html` and `insights/series/index.html`. Key rules:

- Logo: `Insights_logo_black.png` (light) / `Insights_logo_white.png` (dark)
- Mobile logo: `LG-logomark-BlackCoral.png` (light) / `Symbol_mobile.png` (dark)
- Mobile toggle: `style.display='flex'/'none'` — NOT classList.toggle
- Theme: reads/writes `lg-theme` localStorage key
- Header: always-visible background (not transparent on load)
- Mega menu Insights panel: links to `#building`, `#strategic`, `#directors`, `#reflections`
- Portal item: logo lockup image at `height:32px`

**NEXT SESSION PRIORITY:** Extract this into `insights-nav.js` injectable component. Apply to all 11 Insights article pages. Clears `needs-governance` on 8 articles.

---

## HOMEPAGE — KEY ARCHITECTURE

**File:** `index.html`

**Page structure (do not reorder):**
1. Smart hero (3-journey system: assess/partner/explore) — `#portfolio`
2. Strategy Strip (audience-aware rotating question)
3. Narrative Journey area `#quick-tour`
4. The System Bridge
5. Portal Reveal section
6. What's Next CTA
7. Footer

**Experience Band** was removed from the version reconciled on 2026-03-21 during the v3.5 sync. If re-adding, use spec below.

**Experience Band spec (`.homepage-experience-band`) — if re-added:**
- Eyebrow: "PRODUCTS & PLATFORMS" — `letter-spacing: 0.06em` (editorial, not UI)
- Support line: "Fifteen years helping shape products people use every day."
- Infinite marquee of 15 brand logos (Sets A + B duplicated for seamless loop)
- Logo height: `52px` desktop / `42px` mobile, opacity `0.65` at rest
- Animation: `expBandScroll 70s linear infinite` — hover pauses
- Padding: `96px 0` top and bottom for editorial breathing room

---

## HOMEPAGE PERSONA / JOURNEY SYSTEM

Three journeys. Three hero states. One intent gate.

| Persona key | Journey | Accent | Video | Logo |
|-------------|---------|--------|-------|------|
| `coral` | Assess Fit (Recruiting) | Coral | `bg-hire.mp4` | `coral-3d_logomark.webp` |
| `teal` | Partnership (CMO/Founder) | Teal | `bg-partner.mp4` | `teal-3d_logomark.webp` |
| `neutral` | Exploring | White | `bg-explore.mp4` | `white-3d_logomark.webp` |

**localStorage key for persona:** `luxe-persona`

**Intent gate behavior:** Opens on EVERY homepage visit (not just first visit). User can also reopen it by clicking the badge in the nav.

**nav-component.js v14.2 persona sync:**
- Reads `luxe-persona` from localStorage on load
- Exposes `#snav-logo-desktop`, `#snav-logo-mobile`, `#snav-badge`, `#snav-badge-text` as update targets
- Has its own internal badge click listener that opens `#intentGate`
- `applyNavPersona()` in `index.html` uses a retry loop (0ms / 300ms / 800ms) to handle nav async injection timing

---

## INSIGHTS CHANNEL — ARTICLE COUNT & SERIES

**Total: 13 articles**

| Series | Articles |
|--------|----------|
| Building Series (3) | building-the-ecosystem, building-insights, building-the-hub |
| Strategic Lens (4) | transforming-browsing-ai, edge-ucational-series, + 2 more |
| Director's Commentary (4) | translation-problem, teams-consumer-launch, family-safety-launch, edge-mobile-rebrand |
| Reflections (4) | unlocking-the-blank-page, proof-of-life, move-at-your-speed, free-to-be-free |

**Series page filter IDs:** `#building`, `#strategic`, `#directors`, `#reflections`, `#use-cases`

**Hash format:** `/insights/series#use-cases` — NO trailing slash before `#`

**Megamenu footer text:** "4 series · 13 articles"

---

## NAV GOVERNANCE RULES (non-negotiable)

1. **No absolute internal links** — all `href` values use root-relative paths (`/insights/`, `/TheHub/`, etc.). Exception: `https://portal.luis-gilberto.com` (subdomain, stays absolute).

2. **Portal logo = image lockup, never text** — `TheLGPortal_dark-mode.png` / `TheLGPortal_light-mode.png` at `height:32px` in ALL nav instances.

3. **Hub panel = 3 arms, not 4** — StrategyIQ removed from nav panels (trademark pending). Hub panel shows: Advisory, The Studio, The Portal ↗.

4. **Insights mega panel = 4 series** — Building Series, Strategic Lens, Director's Commentary, Reflections. Never "Use Cases" in the mega panel.

5. **localStorage key = `lg-theme`** — hyphen, never underscore. Any `lg_theme`, `insights-theme`, `teams-theme` occurrences are bugs.

6. **No `nav-component.js` on Insights or Work pages** — only on Portfolio surface pages.

7. **No live-server scripts in production** — always strip before deploy.

8. **Mobile drawer governance** — Teams case study (`/work/case-study-teams-launch.html`) is the canonical rich mobile drawer standard: series cards grid + ecosystem global links + pulsing teal status dot.

9. **`nav-component.js` loads ONCE, at the bottom of `<body>` only** — never in `<head>`. Loading it twice causes race conditions and duplicate event listeners.

---

## EDGE MOBILE — TWO-ARTICLE SYSTEM

| Article | URL | Surface | Nav |
|---------|-----|---------|-----|
| Director's Commentary — "The Smallest Canvas" | `/insights/edge-mobile-rebrand/` | Insights | Bespoke Insights nav |
| Technical Blueprint | `/work/edge-mobile-technical-blueprint.html` | Work | `work-nav.js` |

**Bridge links between them:**
- Commentary → Blueprint: `href="/work/edge-mobile-technical-blueprint.html"`
- Blueprint → Commentary: `href="/insights/edge-mobile-rebrand/"`

---

## DEPLOYMENT PIPELINE

```
Local files (OneDrive)
  → git add -A
  → git commit -m "..."
  → git push origin main
  → Cloudflare Pages (auto-build on push)
  → ecosystem-status.json (written by GitHub Actions on every push)
  → site_index.html reads status.json for live node states
```

**Repo root:** `C:\Users\luisg\OneDrive\Documents\Luis Gilberto\`

---

## WORKING METHOD

- **Claude:** Design thinking, architecture decisions, governance rules, Trae-ready prompts, full file builds
- **Trae:** Implementation, file edits, git operations
- **Workflow:** Claude specifies → Trae executes → Claude audits output
- **Preference:** Surgical fixes over full rewrites. Direct file outputs over instructions. Always include "do not touch" constraints in Trae prompts.
- **Trae prompt structure:** ROLE → TARGET FILE → OPERATIONS (numbered) → CONSTRAINTS → CONFIRM with line numbers

---

## ASSETS COMPONENTS FOLDER

Trae-ready component files and reference docs are saved at:
`C:\Users\luisg\OneDrive\Documents\Luis Gilberto\assets\Components\`

---

## THINGS THAT RECUR AS BUGS (memorize these)

1. `lg_theme` (underscore) instead of `lg-theme` (hyphen) — localStorage key bug. **UNIFIED to `lg-theme` (hyphen) across all files as of 2026-03-21 v3.5 sync.**
2. Live-server `<script>` block injected at bottom of files — always strip before deploy
3. Absolute `https://www.luis-gilberto.com/` links in nav/footer — always relative
4. Portal logo as text link instead of image lockup
5. `nav-component.js` loaded on Insights or Work pages — wrong nav surface
6. Double X buttons in mobile drawer — header z-index fighting drawer z-index
7. `body padding-top` left at old `var(--header-height): 80px` after migrating to 64px nav
8. `insights/series/#use-cases` (slash before hash) → should be `insights/series#use-cases`
9. StrategyIQ in Hub nav panel — removed, trademark pending, do not re-add
10. Em dashes anywhere — fully purged, must not return
11. **`nav-component.js` loaded twice (once in `<head>`, once in `<body>`)** — causes race conditions, duplicate event listeners, and persona state conflicts. Load ONCE at bottom of `<body>` only.
12. **`lg_theme` vs `lg-theme` key mismatch between `index.html` and `nav-component.js`** — nav-component.js reads `lg-theme` (hyphen). index.html must write `lg-theme` (hyphen). Any underscore variant is a bug.

---

## IMMEDIATELY PENDING WORK (next session)

### Priority 1 — `insights-nav.js` component
Extract the bespoke Insights nav into a single injectable component. Apply to all 11 Insights article pages with one script tag each.

**Pages that need it:**
- `teams-consumer-launch/index.html`
- `family-safety-launch/index.html`
- `building-the-ecosystem/index.html`
- `building-insights/index.html`
- `building-the-hub/index.html`
- `unlocking-the-blank-page/index.html`
- `proof-of-life/index.html`
- `move-at-your-speed/index.html`
- `edge-ucational-series/index.html`
- `transforming-browsing-ai/index.html`

### Priority 2 — Portfolio entry points
- End of `/myexperience.html` → "See the system behind the work." CTA → `/portal/recruiters/`
- Hub closing CTA: "Or see the operating environment first →" → `/portal/`

### Priority 3 — Portal content governance
- `/portal/index.html`, `/portal/recruiters/`, `/portal/partners/`
- Remove Hub voice, sharpen recruiter vs partner flows

### Priority 4 — Remaining work case studies
- `case-study-ai-browsing.html` — apply `work-nav.js`, content pass
- `case-study-free-to-be-free.html` — apply `work-nav.js`, content pass
- `case-study-family-safety.html` — verify `work-nav.js` applied

### Priority 5 — StrategyIQ launch
- Pending trademark resolution before any public-facing activation
