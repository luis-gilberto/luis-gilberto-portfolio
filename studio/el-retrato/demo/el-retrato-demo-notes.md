# El Retrato + El Revelado · Interactive Excerpt
## Implementation Notes · LG Studio

Prototype: single self-contained `index.html`. No build step, no backend, no dependencies beyond Google Fonts (already in the LG Studio stack). Deploy by dropping the file at the route.

---

## 1. Screen-by-screen flow

| # | ID | Chapter | Register | Purpose |
|---|-----|---------|----------|---------|
| 1 | s1 | Entry | Obsidian · cinematic | Frame the excerpt, set expectations, privacy note |
| 2 | s2 | El Retrato 01/06 | Ivory paper · editorial | Open question, underlined serif textarea |
| 3 | s3 | El Retrato 02/06 | Ivory paper | Tension selection, editorial index rows (not radio buttons) |
| 4 | s4 | El Retrato 03/06 | Deep ivory | Four direction tiles, each styled in its own register |
| 5 | s5 | El Retrato 04/06 | Obsidian · coral | Editorial intervention, two-line staggered reveal |
| 6 | s6 | El Retrato 05/06 | Ivory paper | Transition: "That is enough for a first read" |
| · | wash | · | Full obsidian | Chapter wash: "Capítulo Dos · El Revelado" (~2.3s beat) |
| 7 | s7 | El Revelado 01/07 | Ivory · gold rule | Evidence: the visitor's words return in italic Cormorant |
| 8 | s8 | El Revelado 02/07 | Deep ivory · analytical | Pattern lead (tension-mapped) + two-column transformation |
| 9 | s9 | El Revelado 03/07 | Obsidian · cinematic | Central reading, largest type, two-line reveal |
| 10 | s10 | El Revelado 04/07 | Ivory paper | Five protected principles, staggered hairline rows |
| 11 | s11 | El Revelado 05/07 | Ivory paper | Three unresolved decisions with one-line rationales |
| 12 | s12 | El Revelado 06/07 | Deep ivory | Direction statement + mapped line + Evidence → Application progression |
| 13 | s13 | El Revelado 07/07 | Obsidian | Closing pair, three CTAs |

13 moments total. Roughly 2.5 minutes at a reading pace.

## 2. Personalization mapping

Three sessionStorage keys, nothing else.

- `lgx_words` · the S2 free text. Returns verbatim on S7 (Evidence), rendered via `textContent` so it is injection-safe. If empty, S7 falls back to quoting the selected tension with the line "You kept your words to yourself. The tension you chose speaks in their place."
- `lgx_tension` · S3 selection. Maps to one of four pattern lead sentences on S8:
  - clear → "...clarity that has not yet chosen a signature."
  - beautiful → "...craft still searching for its center of gravity."
  - personal → "...a tension between what feels true and what can be clearly expressed."
  - ambitious → "...ambition that has not yet settled on its frame."
- `lgx_direction` · S4 selection. Maps to one "In your case:" line on S12.

That is the entire personalization surface, per the brief. Everything else is fixed copy.

## 3. Interaction and transition notes

- One primary action per screen. Continue buttons on S3/S4 stay disabled until a selection exists.
- Screen transitions: 650ms crossfade with a 14px upward drift, custom ease. The chapter wash between S6 and S7 is the only long beat, and it is the only full-screen interstitial in the experience.
- Progress: a single mono marker top-left ("EL RETRATO · 02 / 06"), gold chapter name. No bars, no dots, no percentages.
- Staggered line reveals only where the copy earns them: the intervention (S5), the central reading (S9), the principles (S10), and the progression (S12).
- Accessibility: keyboard focus moves to the incoming screen's heading, visible gold focus rings, `aria-pressed` on all selectable elements, `prefers-reduced-motion` collapses all transitions and skips the wash.
- Exit: a quiet "Exit ×" link top-right returns to /studio/ at any point.

## 4. Component and state model

State machine is a flat list of sections toggled by an `.active` class; `go(id, useWash)` is the only navigation function. `prepare(id)` hydrates personalized screens just before they enter. Components are CSS-only: `.eyebrow`, `.statement`, `.question`, `.option`, `.tile`, `.evidence-block`, `.columns`, `.principle`, `.decision`, `.progression`, `.wash`.

If this later becomes a real product, the seams are already where they need to be: `prepare()` becomes the hydration point for real reading content, `go()` becomes a router, and the fixed copy blocks become templates.

## 5. Deploying and linking from the case-study page

1. Place the file at `studio/el-retrato/demo/index.html` in the Cloudflare Pages repo. It resolves at `luis-gilberto.com/studio/el-retrato/demo/` with no config.
2. On `studio/el-retrato/index.html`, add the CTA block wherever the page transitions from explanation to proof (recommended: after the process narrative, before the closing):

```html
<div class="retrato-demo-cta">
  <a href="/studio/el-retrato/demo/" class="btn-editorial">Try a short excerpt</a>
  <p class="demo-note">Experience a condensed version of El Retrato and the reading it produces. About three minutes.</p>
</div>
```

Match `.btn-editorial` and `.demo-note` to the page's existing button and metadata styles (mono label button, small mono supporting line). Same-tab navigation, per the brief: the prototype opens in the same site experience, and its own Exit link and closing CTAs handle the return path.

3. If the two "Exit / Explore LG Studio" URLs should point at the El Retrato case-study page instead of /studio/, change the two hrefs at the top and bottom of the file.

## 6. Assumptions and shortcuts

- Bilingual EN/ES via `data-i18n-*` attributes and a quiet top-right language toggle. Language preference shares the Studio key (`studio-lang`) so it stays consistent with the case-study page.
- Google Fonts via CDN. If the site self-hosts Cormorant/Inter/JetBrains Mono, swap the `<link>` tags for the local `@font-face` declarations.
- Reference tiles are CSS-drawn abstract marks, not photography or analog artifacts. This kept the file dependency-free; swapping in Cloudinary-hosted artifact imagery is a one-line change per tile.
- The S2 answer is optional by design. Forcing input would make it feel like a form; the fallback line on S7 turns skipping into part of the reading.
- "Talk with LG Studio" points at the Outlook booking link. "Explore LG Studio" and "Exit" point at /studio/.
- sessionStorage only. A page refresh mid-flow returns to S1 with state intact for the reading screens, but no attempt is made to restore scroll position within the flow. Acceptable for a 3-minute excerpt.

## 7. Future expansion points

- Swap tile marks for real reference imagery (Cloudinary `dogtoagya`).
- Expand the tension → pattern mapping into a fuller matrix (tension × direction) without touching the flow logic.
- Wire the closing CTA to pass the session's selections as URL params into the real El Retrato intake, so the excerpt becomes a genuine top-of-funnel.
- Add a Plausible event per screen advance if you want completion-rate data (frozen event names, one per screen ID).
