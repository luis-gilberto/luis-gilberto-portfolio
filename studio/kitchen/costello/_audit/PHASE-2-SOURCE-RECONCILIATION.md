# Phase 2 · Source Reconciliation Report

**Date:** 14 September 2026  
**Prior audit:** `studio/kitchen/costello/_audit/REFERENCE-FILES-RECONCILIATION.md`  
**Recovery package (staged, not promoted):**  
`studio/kitchen/costello/_audit/source-recovery-2026-09-14/Costello_Source_Recovery_2026-09-14/`  
*(extracted from `Downloads/Costello_Source_Recovery_2026-09-14.zip`; not yet moved into `documents/` or wired into UI)*

**No UI wiring. No file promotion/rename beyond audit staging.**

---

## Scope note

None of the recovered binary artifacts currently exist under `studio/kitchen/costello/documents/` (filename check: all **NEW**).  
Mailing XLSX matches `Downloads/CLF_Mailing_List_Corrected_Final.xlsx` byte-for-byte (SHA256 prefix `BA4FE2227CD6D78F`) — Downloads duplicate only, not a Files shelf duplicate.

Recommended **future** canonical root (do not move yet):

`studio/kitchen/costello/documents/sources/`

---

## A. SOURCES NOW RECOVERED

| Recovered artifact (staging path) | Satisfies audit gap | Already in Files shelf? | Recommended canonical path (later) | Class | Files category (later) | Reference status (later) | Notes |
|---|---|---|---|---|---|---|---|
| `website/PRACTICE-AREAS_2026-09-13.docx` | R5 Practice-area copy | No (`practice-areas` stub only) | `documents/sources/website/PRACTICE-AREAS_2026-09-13.docx` | **source-only / current source** | Website sources | **OPEN FILE** | Client-supplied from Nari |
| `website/FAQ-BASELINE-KC-EDITS_2026-09-12.docx` | R4 FAQs | No (`faq-website-edits` stub) | `documents/sources/website/FAQ-BASELINE-KC-EDITS_2026-09-12.docx` | **source · amended** | Website sources | **OPEN FILE · AMENDED BY EMAIL** | Pair with email record below |
| `email-records/WEBSITE-PAGE-CHANGES_2026-09-13.md` | R4 FAQ amendments + quote/Results | No | `documents/sources/email-records/WEBSITE-PAGE-CHANGES_2026-09-13.md` | **email record · current amendment** | Website sources (records) | **OPEN FILE** (companion to FAQ) | DOH duplicate still open |
| `website/BIOS-REFERENCE-BASELINE_2026-08-28.docx` | R3 / R7 bios | No (`bios-in-development` stub) | `documents/sources/website/BIOS-REFERENCE-BASELINE_2026-08-28.docx` | **baseline source · not final** | Website sources | **OPEN FILE · BASELINE** | Updated package still outstanding |
| `reference/CHAMBERS-CLF-2027-FINAL.docx` | R6 Chambers | No | `documents/sources/reference/CHAMBERS-CLF-2027-FINAL.docx` | **final source** (per Kris) | Research + Proof / Authority | **OPEN FILE · FINAL SOURCE** | Firm Chambers submission |
| `reference/CHAMBERS-KRIS-2027-FINAL.docx` | R6 Chambers | No | `documents/sources/reference/CHAMBERS-KRIS-2027-FINAL.docx` | **final source** (per Kris) | Research + Proof / Authority | **OPEN FILE · FINAL SOURCE** | Kris Chambers submission |
| `reference/TAGLINE-PHILOSOPHIES_v1.pdf` | R10 Taglines | No | `documents/sources/reference/TAGLINE-PHILOSOPHIES_v1.pdf` | **historical / source-only** | Research + Proof | **OPEN FILE · REFERENCE** | Writer input; not auto-approved positioning |
| `reference/REPRESENTATIVE-MATTERS_2026-09-05.pdf` | R9 Representative matters | No | `documents/sources/reference/REPRESENTATIVE-MATTERS_2026-09-05.pdf` | **source-only** | Research + Proof | **OPEN FILE · REFERENCE** | Chambers described as more refined/current list |
| `website/HOME-ABOUT-COPY_2026-08-18.docx` | Prior website copy (not explicit audit row; fills “prior reference set”) | No | `documents/sources/website/HOME-ABOUT-COPY_2026-08-18.docx` | **historical source** | Website sources | **OPEN FILE** | From Nari Marketing Assets email |
| `external/EXTERNAL-REFERENCE-LINKS.md` (Social PPT link) | R8 Social-media deck | No | Keep as Reference link doc **or** file under `documents/sources/external/` | **external only** | — (no local PPTX) | **OPEN EXTERNAL** | SharePoint; local PPTX still desirable |
| `social/NARI-WELCOME.png`, `social/WENDY-WELCOME.png` | Partial R8 support | No | `documents/sources/social/…` | **support assets** | Assets | **OPEN FILE** (if shown) | Not a substitute for the deck |
| `email-records/CLIO-SUPPORT-INSTRUCTIONS_2026-07-27.md` | R13 Clio | No (`clio` stub) | `documents/sources/email-records/CLIO-SUPPORT-INSTRUCTIONS_2026-07-27.md` | **email record · source** | Website sources (records) | **OPEN FILE · INTEGRATION PATH TO CONFIRM** | Domain-mapping ≠ intake |
| `mailing/CLF-MAILING-LIST-CORRECTED_2026-09-11.xlsx` | Expected mailing list | No (expected row only; template exists separately) | `documents/sources/mailing/CLF-MAILING-LIST-CORRECTED_2026-09-11.xlsx` | **working / verify production-final** | Referral / Mailing | **OPEN FILE · VERIFY PRODUCTION FINAL** | Matches Downloads corrected list; Monday final still anticipated in state |
| `external/…` Brand Voice + Authority Framework URLs | Prior-agency materials | No | External only | **external** | — | **OPEN EXTERNAL** | Radically Distinct |
| `external/…` Notion Costello page URL | Notion reference set | No | External only | **external** | — | **OPEN EXTERNAL** | No raw export recovered |

### Reference rows that can move off NOT FILED YET

| Audit row | New Reference state |
|---|---|
| R4 FAQs | **OPEN FILE · AMENDED BY EMAIL** |
| R5 Practice areas | **OPEN FILE** |
| R6 Chambers | **OPEN FILE · FINAL SOURCE** (two files) |
| R7 / R3 Bios | **OPEN FILE · BASELINE** (not “Approved available” alone; updated package still NOT FILED) |
| R8 Social deck | **OPEN EXTERNAL** (+ optional OPEN FILE for welcome PNGs) |
| R9 Representative matters | **OPEN FILE · REFERENCE** |
| R10 Taglines | **OPEN FILE · REFERENCE** |
| R13 Clio | **OPEN FILE · INTEGRATION PATH TO CONFIRM** |
| Expected mailing list | **OPEN FILE · VERIFY PRODUCTION FINAL** (still confirm Monday final) |

---

## B. SOURCES STILL MISSING / OUTSTANDING

| Item | Status | Recommended Reference label |
|---|---|---|
| Local Social media PowerPoint (canonical PPTX) | SharePoint only | **OPEN EXTERNAL** until filed; then OPEN FILE |
| Updated bios package (post-baseline) | Expected / forthcoming | **NOT FILED YET** |
| Notion raw export / native prior-agency package | Link only | **OPEN EXTERNAL** |
| Final production mailing list confirmation | Sep 11 filed copy exists; Monday final anticipated | **NEEDS REVIEW** / verify before “production-final” |
| FAQ duplicate DOH clarification | Content decision | Keep amendment note; do not treat FAQ order as final |
| Clio intake integration path | Decision open | Keep companion status on Clio record |
| Prior-agency Framer / project source | Confirmed unavailable from prior agency | **UNAVAILABLE FROM PRIOR AGENCY** (not “Luis failed to file”) |
| Executed DocuSign package / countersigned agreement | Outside this recovery | Unrelated to source gaps; separate agreement track |

---

## C. DUPLICATES TO CONSOLIDATE

| Pair / set | Finding | Action |
|---|---|---|
| Recovery mailing XLSX ↔ Downloads `CLF_Mailing_List_Corrected_Final.xlsx` | Identical hash | One canonical Files entry after promotion; ignore Downloads |
| Recovery package ↔ existing `documents/` | **No filename collisions** | Promote once; do not copy into Reference |
| `social/*-WELCOME.png` ↔ Social PPT | Related, not duplicates | PNGs support assets; deck remains separate |
| Chambers CLF vs Chambers Kris | Two distinct submissions | Two Files entries; one Reference parent “Chambers” with two opens |
| Representative matters PDF vs Chambers | Overlapping subject, different artifacts | Keep both; Reference notes Chambers as more refined list |
| Bios baseline vs Brand Portal short bios | Conceptual overlap | Portal may display derived copy; **baseline DOCX is the filed source**; do not duplicate into Reference |
| FAQ Aug 25 Downloads vs Sep 12 recovered FAQ | Different dates/names (not hash-compared as same) | Treat recovered Sep 12 as filed baseline for portal; retire older Downloads copy from consideration |
| Referral proof copies (`documents/referral/` vs `production-prep/`) | Pre-existing (Phase 1) | Still need human choice of canonical proof path (unchanged by recovery) |
| SOW redline root vs archive | Pre-existing (Phase 1) | Still open |
| Brand Portal in Reference + Files | Pre-existing | Allowed as explain vs hold; one HTML artifact |

**Do not** create a second copy of any recovered file under Reference.

---

## D. REFERENCE ROW → CANONICAL FILE mapping

| Reference row | Point to | Status label |
|---|---|---|
| Brand System Portal | Existing `capabilities/costello/Costello_Brand_Portal_Elevated.html` | OPEN FILE (existing) |
| Positioning anchor | Kitchen / state text (no recovery file) | NEEDS REVIEW / draft |
| Approved short bios (portal) | Brand Portal + baseline DOCX | NEEDS REVIEW — split “portal display” vs “filed baseline” |
| Updated bios | — | NOT FILED YET |
| Bios baseline | `…/BIOS-REFERENCE-BASELINE_2026-08-28.docx` | OPEN FILE · BASELINE |
| FAQs | `…/FAQ-BASELINE-KC-EDITS_2026-09-12.docx` + `…/WEBSITE-PAGE-CHANGES_2026-09-13.md` | OPEN FILE · AMENDED BY EMAIL |
| Practice-area copy | `…/PRACTICE-AREAS_2026-09-13.docx` | OPEN FILE |
| Chambers | `…/CHAMBERS-CLF-2027-FINAL.docx` + `…/CHAMBERS-KRIS-2027-FINAL.docx` | OPEN FILE · FINAL SOURCE |
| Taglines | `…/TAGLINE-PHILOSOPHIES_v1.pdf` | OPEN FILE · REFERENCE |
| Representative matters | `…/REPRESENTATIVE-MATTERS_2026-09-05.pdf` | OPEN FILE · REFERENCE |
| Home / About copy *(add row)* | `…/HOME-ABOUT-COPY_2026-08-18.docx` | OPEN FILE |
| Social-media deck | SharePoint URL in `EXTERNAL-REFERENCE-LINKS.md` | OPEN EXTERNAL |
| Social welcome assets *(optional)* | `…/NARI-WELCOME.png`, `…/WENDY-WELCOME.png` | OPEN FILE |
| Clio instructions *(add row)* | `…/CLIO-SUPPORT-INSTRUCTIONS_2026-07-27.md` | OPEN FILE · INTEGRATION PATH TO CONFIRM |
| Brand Voice (prior agency) | External URL | OPEN EXTERNAL |
| Authority Framework (prior agency) | External URL | OPEN EXTERNAL |
| Notion reference set | External URL | OPEN EXTERNAL |
| Prior-agency Framer source | — | UNAVAILABLE FROM PRIOR AGENCY |
| Letter 1 client source *(add)* | Existing `documents/referral/CLF_expanding_2026-09-10.docx` | OPEN FILE |
| Mailing list | `…/CLF-MAILING-LIST-CORRECTED_2026-09-11.xlsx` | OPEN FILE · VERIFY PRODUCTION FINAL |
| Connect quote | Existing quote PDF | OPEN FILE (existing) |

---

## E. FILES entries to remove (status-only stubs)

These `costello-files.json` rows have **no `href`** and must leave Files once Reference carries provenance (after promotion/wiring):

| id | title |
|---|---|
| `practice-areas` | Practice-area content |
| `social-media` | Social media / Instagram presentation |
| `clio` | Clio Grow domain-mapping instructions |
| `faq-website-edits` | FAQ + website edits |
| `bios-in-development` | Bios |

Replace later with **real** Files entries pointing at promoted source paths (or drop entirely if Reference-only email records are preferred for MD files — recommendation: **file the MD email records in Files** as openable records).

Also: empty `assets` category stays empty until welcome PNGs / other assets are promoted.

---

## F. Workspace pages currently misclassified as files

Unchanged from Phase 1; still remove or relabel as workspace links (not records):

| id | title | Actual |
|---|---|---|
| `kitchen-review` | Kitchen review surface | Working UI |
| `mailing-sequence` | Referral Mailing · Operating Detail | `mailing.html` |
| `overview` | Programme Overview | `kitchen/costello/` |
| `control-document` | Control document | LG Control tool — confirm client visibility |
| `launch-path` | Website Launch Path | Strategic HTML — optional keep as artifact, not “source file” |
| Plans card `firm-marketing-foundation` | Firm Marketing Foundation | No document (`is-reference`) |

Brand Portal HTML may remain **one** Files artifact.

---

## G. Unresolved status conflicts requiring human decision

1. **Bios:** UI “Approved short bios · Available” vs recovered **baseline** + outstanding **updated package**. Decide public labels.  
2. **FAQ:** Filed baseline vs 13 Sep email amendment; **DOH appears twice** — content clarification required.  
3. **Mailing list:** Sep 11 “Corrected Final” filename vs project state expecting Monday production-final — do not silently mark production-final.  
4. **Social:** Accept OPEN EXTERNAL indefinitely vs require local PPTX before “complete.”  
5. **Representative matters vs Chambers:** Which list is authoritative for website claims?  
6. **Taglines PDF:** Reference-only vs usable for live positioning (positioning anchor still draft).  
7. **Clio:** Confirm intake integration approach; do not imply Grow domain mapping is the architecture.  
8. **SOW package** (pre-existing): “Prepared for signature” vs “final language being completed.”  
9. **Canonical referral proof path** (pre-existing): `documents/referral/` vs `production-prep/`.  
10. **Promote staging now?** Recovery lives under `_audit/…` only — approve move into `documents/sources/` before wiring.

---

## Later wiring pass — files that would change (preview only)

Not executed in this phase:

- Promote staged sources → `documents/sources/**`
- `capabilities/costello/data/costello-files.json` — add real hrefs; remove stubs; fix categories  
- `kitchen/costello/reference.html` — provenance rows + OPEN FILE / EXTERNAL / NOT FILED YET  
- Possibly `costello-project-state.json` — `sourceInventory` align with filed reality  
- Do **not** redesign tab chrome

---

## Verdict

Recovery package **closes most Phase 1 “NOT FILED YET” source gaps** with real artifacts. Remaining hard gaps are: local social PPTX, updated bios package, Notion export, mailing production-final confirmation, FAQ DOH decision, Clio path, and prior-agency Framer (unavailable).

**Stop here — awaiting review before promotion or UI wiring.**
