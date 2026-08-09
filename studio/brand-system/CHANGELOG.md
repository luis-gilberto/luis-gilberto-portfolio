# LG Studio — Brand & Design System

## v1.2 · August 2026

Two changes: the legacy host surface is now documented, and the Asset Index joins the system as its third document.

---

### 1 · Legacy host surface

The v1.1 architecture documented three modes but never accounted for luis-gilberto.com itself, which carries its own established palette. That gap is now closed, per direction:

> The new LG Studio Brand System is the canonical direction for new work. The existing visual language of luis-gilberto.com is a legacy implementation that migrates opportunistically. It does not become a fourth mode.

Both documents now carry a **Legacy host surface** band directly beneath the three mode cards, set in a dashed rule so it reads as adjacent to the model rather than part of it. It states four rules: existing pages remain valid, new work follows the master system, no retrofit required, migrates opportunistically. The migration chapter names the single trigger: when one of its surfaces is substantially redesigned anyway, it migrates at that moment.

### 2 · Asset Index folded in

`lg-studio-asset-index.html` was migrated onto the shared core and is now the third document, reachable from `index.html`.

**Token layer replaced, not duplicated.** The file previously defined its own palette and type. It now links `tokens.css` and carries no local palette or type definitions. Legacy values were remapped: obsidian to Deep Ink, cloud to Warm Ivory, coral `#F96F6E` to Terracotta `#C96E53`, teal `#4BADA8` to Teal `#2F5D5A`, Cormorant Garamond to Fraunces. Zero legacy tokens or hexes remain.

**Surfaces declared properly.** The masthead and footer now carry `data-surface="ink"` instead of hard-coded dark backgrounds, so semantic tokens re-point through the scope. The card canvas toggle was relabelled from obsidian/cloud to Ink/Paper, which is what it was already demonstrating.

**Typography by role.** The h1 moved from Big Shoulders 800 uppercase to Fraunces, since large propositions belong to the editorial role. Section heads, card names and labels stay structural. Card descriptions moved to the body role. The tri-colour gradient rule under the masthead was replaced with a single hairline, since a three-colour bar is exactly the decorative confetti the system prohibits.

**Vocabulary reconciled to the Brand Guide.** logomark became monogram, logotype became wordmark, in both the data and the filter chips. Spanish keeps Monograma and Logotipo. Cloudinary public IDs were **not** renamed, and the naming section now says so explicitly, since two still contain the old word.

**Four-tier hierarchy added.** Every asset now carries a `tier` field matching the Brand Guide: Primary, Secondary, Environmental, Extension, plus Archive. Reversed white files are Environmental, which is what that tier means. The tier renders as the first tag on each card.

**READ / DIRECT / BUILD** was reframed in the usage rules from "tagline, never below 160px" to a signature of the practice that is not a mandatory tagline, with the minimum size retained.

### 3 · A real data defect found and surfaced

LGS-007 and LGS-008 were listed as the white and black pair of one family, but their public IDs point at two different marks: `LG_Studio_Logo_tag_white` and `LG_Studio_Logo_lockup_stacked`. One is the signature lockup, the other is a stacked lockup.

Rather than silently pick a reading, the entries were **split into two families**, both set to `revisar` state with notes explaining the discrepancy. The coverage matrix now surfaces two genuine production gaps:

| Family | White | Black |
|---|---|---|
| Monograma | LGS-001 | LGS-002 |
| Logotipo | LGS-003 | LGS-004 |
| Lockup horizontal | LGS-005 | LGS-006 |
| Lockup con firma | LGS-007 | **missing** |
| Lockup apilado | **missing** | LGS-008 |

**Open for Luis:** confirm which artwork each of LGS-007 and LGS-008 actually is, then produce the two missing counterparts.

### 4 · Also in this pass

- `index.html` gained a third door for the Asset Index; `.door-meta` now wraps, fixing a 320px overflow the third door introduced.
- `build-standalone.py` includes the Asset Index, and its leftover-reference check moved to a second pass so sibling links no longer register as false positives.
- Standalone set regenerated: index 42KB, Brand Guide 581KB, Design System 393KB, Asset Index 61KB.
- Verified: tag balance on all four files, zero page errors, zero missing local resources, anchors and cross-links resolve, clean at 320 to 1440 in both linked and standalone sets, print styles intact.

---

## v1.1 · August 2026

An evolution of the existing system, not a reset. The approved logo assets, the Deep Ink / Warm Ivory foundation, the restrained accent use, the editorial architecture, and both document layouts are preserved. What changed is the architecture the documentation describes.

**The governing principle for this pass:**

> The objective is not visual uniformity across LG Studio, StrategyIQ and Insights. The objective is recognizable kinship: one underlying system capable of changing mode according to what the experience is doing.

**The migration rule:**

> Unify the edges first. Preserve the interiors until they need to change.

---

## 1 · The expression-mode model

The system previously read as "one visual system, one typography system, applied everywhere." That is not the model. It now documents **one brand, one shared core, three expression modes**, with LG Studio as the master brand.

Both documents now open on the architecture rather than on foundations, so a future designer or AI tool encounters the mode model before it encounters a single token.

**Brand Guide** gained a new Chapter 02, *Architecture — One system. Three modes.* It contains the master-brand diagram, the shared-core inventory, three mode cards, a shared-versus-varies matrix, dedicated notes on StrategyIQ and Insights, and the migration principle.

**Design System** gained two new sections ahead of Foundations: *01 · Expression Modes* and *02 · Migration Principle*. The sidebar now leads with an **Architecture** group.

The shared core is documented as: logo system, color vocabulary, semantic color roles, spacing logic, grid principles, hairlines and rules, border behavior, icon grammar, interaction principles, image principles, voice principles, navigation philosophy, CTA philosophy, accessibility expectations, semantic typography roles, and Read / Direct / Build.

The matrix makes explicit, per mode, what is **always shared** (identity, semantic color roles, spacing logic, hairline behavior, interaction principles, voice, CTA philosophy, accessibility) and what is **allowed to vary** (page composition, dominant surface, density, typographic implementation, component interiors, image weight).

### Mode positioning

| Mode | Framing in the docs |
|---|---|
| 01 · Practice / Editorial | The authored practice. Paper-led with cinematic Ink anchors. This is the mode that can use the new visual language most strongly. |
| 02 · StrategyIQ / Instrument | An instrument and subsystem, **not** a separate competing brand and **not** something requiring a redesign. Participates through shared principles and selected shared tokens. Ink-led by design. |
| 03 · Insights / Publishing | A publishing mode with forward-looking alignment, **not** an immediate retrofit mandate. Paper-led, reading-first. |

---

## 2 · Migration principle: unify the edges first

Documented in both the narrative Brand Guide and the technical Design System, as three steps:

- **First · unify the edges** — identity, logo usage, shell behaviors, navigation, footer, semantic tokens, CTA behaviors, spacing logic, interaction standards.
- **Then · preserve the interiors** — existing product and page interiors stay in their established visual language until naturally revisited. A working interior is not a defect.
- **Always · new work uses the system** — migration happens opportunistically, never as a scheduled sweep.

Stated plainly in both documents: **there is no mandatory global retrofit, and existing work is not automatically obsolete.**

---

## 3 · Typography architecture

### Barlow Condensed removed

Removed as a canonical dependency, from the Google Fonts import and from every file. It forked the identity against the structural/display language already established in the broader ecosystem. **Zero Barlow references remain in the package.**

### Four semantic roles replace three named families

The model is now four roles, not four brands. A role describes the job the type is doing, so a mode can map a role to a different family and remain recognizably LG Studio.

| Role | Practice mapping | Job |
|---|---|---|
| `--font-editorial` | Fraunces | Editorial thought, large propositions, display headlines, names, authored argument |
| `--font-body` | Inter | Universal readable layer, body, interface, navigation, buttons, forms |
| `--font-structural` | Big Shoulders Display | Section labels, taxonomy, indexes, chapter identifiers, wayfinding. Selective, with tracking and restraint |
| `--font-system` | JetBrains Mono | System and technical metadata only. Not a fourth expressive headline family |

Big Shoulders Display was added to the import; Fraunces and Inter kept; JetBrains Mono promoted from an ad-hoc hard-coded stack to a proper role.

### Compatibility principle documented

> Existing pages may retain their current editorial typeface until they are substantially revisited.

Fraunces is the preferred editorial voice for **new** LG Studio Practice work. No historical typography migration is created. StrategyIQ keeps its canonical product typography.

---

## 4 · Backward-compatible type tokens

`tokens.css` now defines semantic roles, with **aliases retained** so existing selectors elsewhere in the ecosystem keep resolving without a rewrite:

```css
--font-display: var(--font-editorial);
--font-label:   var(--font-structural);
--font-mono:    var(--font-system);
```

Within this package, the three HTML files were migrated to reference the semantic roles directly, and all hard-coded `'JetBrains Mono', monospace` stacks were replaced with `var(--font-system)`. No font-family values are hard-coded where a semantic token belongs.

### One judgment call worth flagging

A blanket alias would have put Big Shoulders on every button, form label and nav item. That contradicts the brief's own guidance that Inter carries *"buttons where readability is more important than editorial character."*

So the alias is retained for compatibility, but these specific selectors were re-pointed to `--font-body` at weight 500: `.btn`, `.field label`, `.nav-sample ul`, `.nav-doc ul`, `.print-btn`. Big Shoulders now does structural work only.

A `--fw-structural: 500` token was added and applied to micro labels via one documented compatibility block per file. Big Shoulders sets narrower than Barlow did, and labels were going thin at 9–11px.

---

## 5 · Color evolved, not replaced

The core palette direction is unchanged: Deep Ink `#0F1111`, Warm Ivory `#F7F2E9`, Terracotta `#C96E53`, Teal `#2F5D5A`. No values were invented or altered.

**Raw values are now separated from usage tokens.** Raw `--ink` / `--ivory` / `--terracotta` / `--teal` are kept, and semantic roles added:

```css
--accent-action: var(--terracotta);  /* human intervention, emphasis, authored decision */
--accent-signal: var(--teal);        /* signal, structure, system, analytical precision */
```

### Paper Surface and Ink Surface

Both are documented as first-class, co-equal parts of the identity. The language "light mode" and "dark mode" is deliberately avoided; these are compositional tools inside one identity. Practice and Insights are generally Paper-led with deliberate Ink sections. StrategyIQ may remain substantially Ink-led.

Implemented as scopes in `tokens.css`:

```css
[data-surface="ink"]  { /* semantic tokens re-point; raw palette does not */ }
[data-surface="paper"]{ /* … */ }
```

Both documents state that neither accent becomes decorative confetti.

---

## 6 · Read / Direct / Build reframed

> READ / DIRECT / BUILD is a signature of the practice, not a mandatory logo tagline.

The Brand Guide gained a *where it belongs / where it does not* pairing. It belongs in the full signature lockup, opening and closing moments, section wayfinding, decks, case studies, methodology diagrams, footer moments, and selected branded artifacts. It does **not** need to appear with every logo, on every page, in every navigation, in every application, or underneath the wordmark by default.

The monogram and wordmark are explicitly allowed to stand independently. Application examples were updated accordingly.

---

## 7 · Logo system

**Assets are untouched.** Nothing was redrawn, approximated, regenerated, or replaced with AI-generated variants. All eight files in `/assets` are byte-identical to the originals.

A four-tier hierarchy was documented in both files:

- **Primary** — horizontal lockup, monogram + wordmark
- **Secondary** — wordmark only, monogram only, stacked lockup
- **Environmental** — reversed versions for Ink and other dark surfaces
- **Extension** — partnership / co-brand lockup templates

Partnership lockups are now explicitly framed as an extension of the identity, never a primary identity variant.

---

## 8 · Application examples now prove the mode change

The previous examples demonstrated one editorial world. Both documents now carry three labelled specimen bands:

- **A · Practice / Editorial** — studio hero, case study opening, social, business card, letterhead, deck divider. Paper ground with a deliberate Ink hero.
- **B · StrategyIQ / Instrument** — a dark diagnostic Pattern Readout with signal bars, human read, and next move. Related through precision, spacing, rules, language and token logic. Deliberately **not** an ivory editorial magazine page.
- **C · Insights / Publishing** — an essay spread with margin metadata, editorial hierarchy and a disciplined measure.

Specimen B is labelled a **compatibility demonstration** in both documents, with explicit text that it is not a redesign of the StrategyIQ product and does not replace its canonical product system.

---

## 9 · Language corrections

Removed: *"This document supersedes all prior brand references."*

Replaced with: *"This document defines the LG Studio master identity and the direction for new work. Existing canonical product systems and established surfaces remain valid until intentionally migrated."*

Also revised: copy implying only one visual mode is valid; that three named families must appear everywhere; that dark surfaces are secondary; that the new system invalidates product-specific canon; that every property must become editorial; and that Read / Direct / Build must accompany every logo.

The index proposition became **One identity. One shared core. Three modes of expression.** with a quiet three-mode strip. It was not turned into another landing page.

---

## 10 · Responsive repairs

Horizontal overflow was measured across 320 / 375 / 414 / 600 / 768 / 1024 / 1280 / 1440. Several defects were found; benchmarking against the v1.0 originals confirmed all but one were **pre-existing**, not introduced by this pass.

| Viewport | v1.0 scrollWidth | v1.1 |
|---|---|---|
| Brand Guide @375 | 875 | clean |
| Brand Guide @768 | 875 | clean |
| Design System @375 | 774 | clean |
| Design System @768 | 774 | clean |

Fixes: grid children given `min-width: 0` so tracks can shrink below content min-width; two inline `grid-column: span 2` declarations moved to classes so breakpoints can undo them; an inline two-up grid promoted to a class; `.type-scale`, `.sp-row`, `.c-usage`, `.type-block .row`, `.donts`, `.nav-sample` and `.nav-doc` given narrow-viewport treatments; new 400px breakpoints.

**One regression introduced by this pass, found and fixed:** adding *Architecture* to the Brand Guide masthead brought the nav to ten items, which overflowed between 901px and roughly 1200px. The rail gap was tightened and the nav hide breakpoint raised from 900px to 1100px.

All three files are now clean at every tested width.

---

## 11 · Deliberately left untouched

To avoid unnecessary retrofit:

- **All logo assets** and the two reference images (`brand-board.png`, `landing-page-ref.png`)
- **StrategyIQ's product system** — no redesign, no prescribed retrofit, no overwriting of canonical product typography or UI rules
- **Existing Insights pages** — no redesign mandate
- **Palette values** — no colour was altered or invented
- Hairline rules, near-square components, generous spacing, `.srcmap.json` files, `.gitattributes`
- Click-to-copy behavior, scrollspy, smooth scroll, toast, print styles
- The Brand Guide's Voice, Spacing, Components and Imagery chapters, beyond removing Barlow references and renumbering
- The Design System's Spacing, Radii, Buttons, Inputs, Chips, Cards and Navigation sections, beyond copy corrections

---

## 12 · Quality control results

| Check | Result |
|---|---|
| HTML tag balance, all three files | pass |
| Local asset paths resolve | 8/8 |
| Cross-document links | pass |
| In-page anchors resolve | pass |
| Barlow Condensed references | 0 |
| "Supersedes all prior brand references" | removed |
| Hard-coded JetBrains Mono stacks | 0 |
| Console errors | none (only the sandbox's offline Google Fonts 403) |
| External dependencies | 1, the existing Google Fonts import |
| Responsive, 320→1440 | clean |
| Print styles, both documents | chrome hidden, PDFs render |
| `index.html` opens both documents | pass |

---

## File-by-file summary

| File | Status |
|---|---|
| `tokens.css` | Rewritten to v1.1. Semantic type and color roles, surface scopes, aliases, reduced-motion. All v1.0 values preserved. |
| `index.html` | Reworked proposition and three-mode strip. Two entry points preserved. |
| `LG Studio — Brand Guide.html` | New Chapter 02; chapters renumbered to 11; Logo, Color, Typography and Applications chapters rebuilt; colophon rewritten. |
| `design-system.html` | Two new Architecture sections; sections renumbered to 14; Color, Typography, Logo and Applications rebuilt. |
| `assets/*` | Untouched. |
| `CHANGELOG.md` | New. |

---

## 13 · Standalone set (`/standalone/`)

Added after the main pass, at request. Three fully self-contained HTML files for migration and handoff, generated from the linked originals. **Non-destructive:** the linked working set is unchanged.

Each standalone file inlines the full token layer and embeds every logo it uses as base64. No `tokens.css`, no `assets/` folder, no build step. Page CSS and JavaScript were already inline.

| File | Linked | Standalone |
|---|---|---|
| `index.html` | 8KB | 42KB |
| `LG Studio — Brand Guide.html` | 105KB | 579KB |
| `design-system.html` | 80KB | 391KB |

### Embedded logos

Resampled to 800px wide and palette-reduced to 256 colors. The largest render anywhere in the documents is 130px CSS, so 800px stays retina-safe at better than 3x. Verified visually lossless: **PSNR 53–72dB** composited over both Paper and Ink surfaces, measured at realistic render size.

The master artwork in `/assets/` remains byte-identical to the originals. The three unreferenced reference images (`brand-board`, `landing-page-ref`, `partnership-lockups` — 2.9MB of the 3.3MB) are not embedded, since no document uses them.

### Still external

The Google Fonts request. Offline, every stack falls back to a system serif, sans or mono, so the documents degrade rather than break. Embedding woff2 files was not possible in this environment.

### Source-of-truth tension, and how it is handled

Inlining tokens into three files contradicts the single-source-of-truth principle. Rather than choose, both forms ship:

- `tokens.css` stays the source of truth for the linked set.
- `build-standalone.py` regenerates the standalone set from it in one command.
- Each generated file carries a header comment stating it is a generated copy and must not be edited directly.
- `standalone/README.md` documents the workflow.

### Verification

Standalone files were diffed against the linked originals: **identical rendered body heights** (1167 / 27831 / 15972px), identical computed tokens and background, zero broken images (24 and 17 embedded per document), zero remaining local file requests, cross-document links resolve, click-to-copy intact, print styles intact, and clean at 320–1440px.

### One more regression caught here

The standalone screenshot revealed the ten-item masthead nav wrapping to two rows at 1440px — again from adding *Architecture*. Fixed at source: font-size reduced to 11px, gap tightened to 14px, a compact treatment added below 1300px, and the hide breakpoint raised to 1199px. The nav is now a single row at every width where it is visible, and the standalone set was regenerated from the corrected source.
