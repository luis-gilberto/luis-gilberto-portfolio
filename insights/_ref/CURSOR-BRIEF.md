# Cursor Brief
## What I Built After Microsoft · consolidated update

**Target file:** the live essay, `what-i-built-after-microsoft.html`
**Local preview:** `http://localhost:4173/insights/what-i-built-after-microsoft.html`

---

## Before you start

Work on a branch. Six changes, two of them structural. If anything looks wrong in preview, you want a clean revert rather than a hand-undo on a live page.

```
git checkout -b essay-update-aug27
```

Place these four files in `_ref/` so Cursor can read them. They are reference sources only. None of them is a replacement for the live file, and none of them contains the site header nav or footer.

| File | Used by |
|---|---|
| `insights-feature-what-i-built-after-microsoft.html` | Change 1 |
| `figure-a-dropin.html` | Change 5 |
| `plate-03-inline.html` | Change 4 |
| `section-01-optionB-dropin.html` | Change 6 |

---

## The prompt

Paste everything between the rules into Cursor.

---

```
Update the live essay file what-i-built-after-microsoft.html.

GROUND RULES
- The reference files in _ref/ are SOURCES ONLY. Never replace the live
  file with one of them. They are missing the site header nav and the site
  footer, both of which must survive this edit byte for byte.
- Apply only the six changes below. Touch nothing else.
- Do not reformat, reindent, reorder, or clean up code you were not asked
  to change.
- Do not add em dashes or en dashes to any visible copy.
- Do not add fonts, CDN links, or dependencies. Every new rule uses CSS
  custom properties that already exist in this file.
- Do not touch the OG or Twitter meta tags.

CSS ORDER
Changes 4, 5, and 6 each contribute a CSS block. All three go at the END of
the existing <style> element, immediately BEFORE the comment
"/* ---------- print ---------- */", in this order: Change 6, then 5,
then 4. Paste the CSS without its <style> wrapper.

---

CHANGE 1 — Chronology in the Criar Sin Culpas section

Find the paragraph beginning "The turn came when a sequence surfaced in the
material". Replace that single <p> with the TWO paragraphs occupying the
same position in _ref/insights-feature-what-i-built-after-microsoft.html.
They begin "The turn came on April 8" and "A week later, a second pattern
surfaced". Copy verbatim.

Then find the Plate 03 figcaption and replace its text with the version in
the reference file, which ends with a link to
https://www.luis-gilberto.com/studio/case-studies/criar-sin-culpas/es/

---

CHANGE 2 — Print fix for the cover

In the @media print block, add this line directly after the body rule:

  .fade{animation:none;opacity:1;transform:none;}

Do NOT modify the .fade rule outside the print block. Do NOT modify the
prefers-reduced-motion block. Both stay exactly as they are.

---

CHANGE 3 — Read-time meter

In the .readtime element, change

  <b>12 minute read</b> &nbsp;&middot;&nbsp; 2,700 words &middot; 7 plates

to

  <b>13 minute read</b> &nbsp;&middot;&nbsp; 3,100 words &middot; 7 plates

---

CHANGE 4 — Plate 03 becomes an inline evidence plate

Source: _ref/plate-03-inline.html, which has two labeled blocks.

- BLOCK A: the CSS. Place per the CSS ORDER note above.
- BLOCK B: replaces the ENTIRE existing Plate 03 <figure>, including its
  wrapper div, its <img>, and its <figcaption>.

The old figure references the Cloudinary asset CSC_LGStudio_g8tucl.png.
That asset is no longer used on this page. Remove the markup only. Leave
the file on Cloudinary.

---

CHANGE 5 — Figure A (conditional)

First check whether the page already has a Figure A in the section listing
Insights / StrategyIQ / Studio / Portal.

If it does, SKIP this change entirely and say so in your report.

If it does not, add it from _ref/figure-a-dropin.html, which has three
labeled blocks: CSS per the CSS ORDER note, HTML into that section, and JS
immediately before </body>.

---

CHANGE 6 — Section 1 layout, "The first Tuesday"

Source: _ref/section-01-optionB-dropin.html, three labeled blocks.

6a. BLOCK A: the CSS. Place per the CSS ORDER note above.

6b. DELETE the existing badge figure. It currently sits AFTER the closing
    </div> of the .cols-2 block and carries class="plate plate--artifact".
    Remove the whole figure including its figcaption.

6c. INSERT BLOCK B1 INSIDE the .cols-2 div, between the paragraph ending
    "...what week of what quarter this was supposed to be." and the
    paragraph beginning "I had been so busy for so long".

    CRITICAL: this figure uses class="plate plate--incol". Do NOT also give
    it plate--artifact. That class sets width:min(42vw,13.5rem) and
    margin-left:auto, which is exactly the bug this change exists to fix.

6d. REPLACE the existing diptych figure entirely with BLOCK B2. That is the
    figure with class="plate plate--span plate--transition" containing
    throughline_zd76el.png. BLOCK B2 adds an .era-seam span inside the
    plate-window and converts the figcaption into a two-column .era-rail.

Do NOT modify the .plate--artifact CSS rule itself. It is still used by
other plates on the page.

---

REPORT BACK
1. Changed line ranges for each of the six changes.
2. Whether Change 5 was applied or skipped.
3. Confirmation that the header nav and footer are unchanged.
4. Any place where the live file did not match what these instructions
   described, with the actual text you found.
```

---

## Verify before you merge

Six checks, roughly two minutes.

**Section 1.** The badge fills the full width of the second text column, with text above and below it. It is not floating right at a smaller size. If it is, `plate--artifact` is still on the element.

**The diptych.** Year labels sit *below* the photograph in dark type on the panel, each with a short colored rule, blue for 2020 and vermilion for 2026. Nothing sits on top of the image except the thin center seam.

**Plate 03.** Renders as live typography, four concept blocks with Spanish fragments, not as an image. At 375px wide it collapses to a single column, so you should see four stacked blocks rather than a squeezed grid.

**The print path.** Click your own Save as PDF button. The cover must show the title, deck, byline, and read-time meter. This is the bug fix and it is the fastest thing on this list to confirm.

**The CSC section.** April 8 comes before April 15, and the sentence about the four words not having come from you is intact.

**Header and footer.** Unchanged.

---

## Known open items, not in this pass

- **Plate 02 is still too dark** and its screen content is unreadable. Needs a crop or a reshoot. Does not block this update.
- **Plate 03's old Cloudinary asset** was 783×562 and under-resolved. Now moot on this page, since the plate is typographic.
- **Aspect ratio system** still carries one-off native ratios (`csc-proof`, `throughline`) rather than the intended 3:2 / 4:5 / 16:7. Worth repairing when the plates get re-exported.
- **The OG image crop** has not been verified. Check that Cloudinary's `g_auto` centers on the figure before any post links to this page.
