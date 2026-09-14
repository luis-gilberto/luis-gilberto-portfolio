# Costello Portal · Reference / Files Reconciliation Audit

**Date:** 14 September 2026  
**Scope:** Inventory only — no UI or content changes  
**Sources:** `reference.html`, `files.html`, `costello-files.json`, `costello-project-state.json`, on-disk tree under `studio/kitchen/costello/` and `studio/capabilities/costello/`

**Canonical model used for recommendations**

| Tab | Definition |
|---|---|
| **Reference** | What we know, where it came from, and how it should be used (provenance / context) |
| **Files** | The actual documents, deliverables, and records (canonical artifacts) |

**Governing rule:** One artifact → one canonical file. Reference may point to Files. Files owns the thing.

---

## Routes & data sources (current)

| Surface | Route | Content source |
|---|---|---|
| Reference | `/studio/kitchen/costello/reference.html` | **Static HTML** ledger rows (not JSON-driven) |
| Files | `/studio/kitchen/costello/files.html` | **`capabilities/costello/data/costello-files.json`** + agreement block from `costello-project-state.json` |
| Brand alias | `brand.html` → redirects to `reference.html` | Redirect only |
| Shared state | `costello-project-state.json` | `sourceInventory`, `urls.brandSystem`, agreement package |

---

## A. REFERENCE reconciliation table

Deduped logical entries (UI currently repeats some items across sections).

| # | Reference title (UI) | Status shown | What UI claims / implies | Backing file in repo? | Canonical path if found | Already in Files? | Supports | Status accurate? | Recommended action |
|---|---|---|---|---|---|---|---|---|---|
| R1 | Positioning anchor | Draft in development · Monday review | One firm story / two altitudes; not approved | No discrete file | Kitchen exploration text in `costello-project-state.json` → `kitchen.explorations` | No (and should not be a “file”) | Website + bios framing | Yes as draft | **NEEDS REVIEW** — keep as Reference-only working note; link to Kitchen when ready; do not invent a file |
| R2 | Costello Brand System Portal | Working review · for reference (section) / Open portal CTA | Costello-owned brand artifact; some guide content may still refine | Yes (HTML portal) | `capabilities/costello/Costello_Brand_Portal_Elevated.html` | Yes — Files category **Brand / Reference** (`brand-portal`) | Brand, approved short bios (claimed) | Mostly | **LINK TO EXISTING FILE** — Reference owns context; Files holds the HTML artifact once; remove duplicate “browser” feel from Reference beyond one portal card |
| R3 | Approved short bios | Available / reference | Held in Brand System Portal | Embedded in portal HTML, not a separate bio file | Via Brand Portal | Indirect (portal only) | Website / bios | Unclear — “approved” vs bios “in development” conflict | **NEEDS REVIEW** — reconcile with R8; if only inside portal, status should say “in Brand Portal · confirm version when used” |
| R4 | FAQs | Reference copy available / Current source (dup section) | Confirm current version; order revised; one clarification open | **No file in repo** | State claims FAQ edits logged; Notion / prior set | Files row `faq-website-edits` has **no href** | Website FAQ page | Partial — edits known; artifact missing | **NOT FILED YET** — obtain FAQ source file; until then Reference must not imply downloadable copy |
| R5 | Practice-area copy | Received | Current website source | **No file in repo** | Claimed received 13 Sep in state | Files row `practice-areas` · no href · note “File not stored” | Website practice pages | Received claim OK; availability false if user expects a file | **NOT FILED YET** — file the source into Files; Reference links to it |
| R6 | Chambers | Received | Authority / proof source | **No file in repo** | Claimed in `sourceInventory.received` / Notion | No | Proof / bios / authority | Received claim OK; no artifact | **NOT FILED YET** (or **LINK TO EXTERNAL SOURCE** if Chambers URL is the only source) |
| R7 | Updated bios / Bios | In development | Integrated as completed; work in Kitchen | No finished bio package file | — | Files row `bios-in-development` · no href | Website attorney pages | Yes | **NOT FILED YET** + Kitchen for active work |
| R8 | Social-media deck | Received | Inventory first | **No file in repo** | Claimed received 13 Sep | Files row `social-media` · no href · “Slides not extracted” | Website / social thinking | Received OK; not filed | **NOT FILED YET** |
| R9 | Representative matters | Received | Held with prior reference set | **No file in repo** | Notion / prior set claimed | No | Website proof / matters | Unverified beyond inventory claim | **NOT FILED YET** |
| R10 | Taglines | Received | Held with prior reference set | **No file in repo** | Notion / prior set claimed | No | Messaging | Unverified | **NOT FILED YET** |
| R11 | Current state (Source materials) | Reference set received | Additional prior-agency files to inventory | Meta row only | — | Partial overlap with Files expected items | Intake posture | Yes as meta | **MOVE / RECLASSIFY** — this is inventory status, not a source entry; fold into section intro |
| R12 | Historical / prior agency | Note only | Belongs in Files once received | None filed | — | Expected / empty Assets | Continuity | Yes | Keep note; when files arrive → **Files**; Reference points to them |
| R13 | Clio support documentation | *(not on Reference UI; only Files + state)* | — | **No file in repo** | Claimed received 13 Sep | Files row `clio` · no href | Website intake / Grow | Should appear in Reference | **NOT FILED YET** + add Reference row (provenance of Clio instructions) |

**Reference structural finding:** The tab currently behaves as a **status ledger**, not a provenance layer with links. Most “Received” rows have **no openable artifact** and **no external URL**. Several items are duplicated across “Approved messaging,” “Firm facts,” and “Source materials.”

---

## B. FILES reconciliation table

### B1. Agreement + Legal

| Display title | Actual path | Type | Category / status | Linked from Reference? | Duplicate? | Current vs superseded | Recommended action |
|---|---|---|---|---|---|---|
| Website Scope of Work | `kitchen/costello/documents/Costello_Website_SOW_Revised_2026-09-10.docx` | DOCX | CLIENT REVIEW / Prepared for signature | No | Canonical package agreement | **Conflict:** state says “final language being completed”; Files says prepared for signature | **NEEDS REVIEW** — align status language with DocuSign reality before client trust |
| Website SOW · LG Studio signature copy | `…/Costello_Website_SOW_Itemized_Final_2026-09-10_SIGNED_LG.pdf` | PDF | WORKING | No | Prior signature copy | Working / not DocuSign package | Keep; consider status **PRIOR WORKING** not “current-feeling” WORKING |
| Website SOW · Editable reference | `…/Costello_Website_SOW_Itemized_Final_2026-09-10.docx` | DOCX | WORKING | No | Unsigned Word | Working reference | Keep; label clearly not-to-sign |
| Website SOW · Redline | `…/Costello_Website_SOW_Itemized_Redline_2026-09-10.docx` | DOCX | SUPERSEDED | No | — | Superseded | Keep in agreements or move fully to Archive for clarity |
| General Liability COI | `…/COI_General_Liability.pdf` | PDF | SOURCE / exhibit | No | — | Source | Keep |
| Professional Liability COI | `…/COI_Professional_Liability.pdf` | PDF | SOURCE / exhibit | No | — | Source | Keep |
| Cyber Liability COI | `…/COI_Cyber.pdf` | PDF | SOURCE / exhibit | No | — | Source | Keep |

### B2. Referral Campaign

| Display title | Actual path | Type | Status | From Reference? | Notes | Recommended action |
|---|---|---|---|---|---|---|
| Kitchen review surface | `kitchen/costello-review/` | PAGE | CLIENT REVIEW | No | Work surface, not a document | **MOVE / RECLASSIFY** — link from Kitchen; optional Files pointer as “working surface,” not canonical file |
| Referral letter · client-supplied source | `…/referral/CLF_expanding_2026-09-10.docx` | DOCX | WORKING | No (should be Reference provenance) | Client source | Keep in Files; **add Reference** “Letter 1 client source → this file” |
| Referral letter · working proof | `…/referral/Costello_Referral_Letter_PROOF.pdf` | PDF | WORKING | No | Also used by Kitchen | Keep as canonical proof path; Kitchen should deep-link here |
| Referral letter · clean review | `…/referral/Costello_Referral_Letter_CLEAN_REVIEW.pdf` | PDF | WORKING | No | — | Keep |

### B3. Website (source rows without files)

| Display title | Path | Type | Status | From Reference? | Recommended action |
|---|---|---|---|---|---|
| Practice-area content | *(none)* | — | RECEIVED / SOURCE | Yes (R5) | **This is Reference, not Files** until filed → **MOVE / RECLASSIFY** to Reference; Files only after artifact lands |
| Social media / Instagram presentation | *(none)* | — | RECEIVED | Yes (R8) | Same |
| Clio Grow domain-mapping instructions | *(none)* | — | RECEIVED | Missing on Reference UI | Same + add Reference |
| FAQ + website edits | *(none)* | — | CURRENT SOURCE | Yes (R4) | Same |
| Bios | *(none)* | — | IN DEVELOPMENT | Yes (R7) | Same |

### B4. Brand / Reference (misplaced category)

| Display title | Path | Recommended action |
|---|---|---|
| Costello Brand System Portal | `capabilities/costello/Costello_Brand_Portal_Elevated.html` | Keep **one** Files entry as the artifact; Reference explains it — do not present Files as a second “brand browser” |

### B5. Research + Proof (mostly portal pages)

| Display title | Path | Recommended action |
|---|---|---|
| Referral Mailing · Operating Detail | `kitchen/costello/mailing.html` | **MOVE / RECLASSIFY** — operating UI, not a filed record (or label as “workspace page”) |
| Website Launch Path | `capabilities/costello/Costello_Launch_Path.html` | Keep as strategic artifact **or** demote once Launch Plan is canonical |
| Control document | `capabilities/costello/Costello_Control.html` | Internal LG tool — **NEEDS REVIEW** for client Files visibility |
| Programme Overview | `kitchen/costello/` | Workspace page — remove from Files shelf or mark non-document |

### B6. Plans (Files page section, not shelf categories)

| Title | Path | Recommended action |
|---|---|---|
| Website Launch Plan | `kitchen/costello/plans/costello-website-launch-plan.html` | Keep in Files as plan artifact |
| Referral Letter Campaign Plan | `kitchen/costello/plans/costello-referral-letter-campaign-plan.html` | Keep |
| Firm Marketing Foundation | *(no href)* | Reference-only / Costello-owned context — **REMOVE** from Files cards or mark “no document supplied” (already does) |

### B7. Production / Vendors

| Title | Path | Recommended action |
|---|---|---|
| Connect Printing · Quote 014564 | `…/Connect_Printing_Quote_014564.pdf` | Keep; Reference optional “vendor estimate provenance” |
| Connect Printing · FAQ / Helpful Hints | `…/Connect_Printing_FAQ_Helpful_Hints.pdf` | Keep |

### B8. Archive

All listed archive paths **exist on disk**. Status SUPERSEDED is appropriate. Keep.

### B9. Expected (filing state — not files)

| Label | Status | Recommended action |
|---|---|---|
| Final mailing list | IN PROGRESS | Stay as expected intake |
| Updated bios | IN DEVELOPMENT | Align with Reference |
| Clio account / implementation specifics | TO CONFIRM | Stay expected |

---

## C. MISSING SOURCE MATERIALS (need to obtain / file)

These are claimed received or in use but **have no canonical file in the repository**:

1. Practice-area content package  
2. Social-media / Instagram presentation (slides)  
3. Chambers materials (PDF or export) — or confirm external-only URL  
4. FAQ source document / ordered FAQ list (including DOH clarification)  
5. Taglines source  
6. Representative matters source  
7. Prior reference set currently “preserved in Notion” — export into Files if they are engagement records  
8. Clio support thread / domain-mapping instructions (email PDF or doc)  
9. Final mailing list (expected; template exists but final list does not)  
10. Updated / approved bios package (when complete)  
11. Any additional prior-agency source files beyond Notion  

Until filed: Reference status must be **NOT FILED YET** (or **EXTERNAL ONLY**), never “Available” without a target.

---

## D. ORPHANED FILES (on disk, not in Files manifest / shelf)

| Path | Likely role | Suggestion |
|---|---|---|
| `documents/Costello_Website_SOW_Redline_2026-09-10.docx` | Non-archive redline sibling | **NEEDS REVIEW** — duplicate of archive redline lineage? Add to Archive or delete after confirm |
| `documents/referral/production-prep/*` (PROOF, CLEAN_REVIEW, CLF_expanding copies, APPROVED_CLEAN pdf/png, signature PNG, letter HTML) | Production working copies | Decide canonical vs working-folder; avoid dual “current” proofs |
| `documents/referral/mailing-intake/Costello_Mailing_List_TEMPLATE.csv` (+ schema/README) | Intake tooling | Add to Files as **TEMPLATE** or keep as tooling with note |
| `artifacts/how-the-work-connects/current/*` | Orientation film | Linked from Overview/Files orientation; optional Files category “Orientation” |
| `artifacts/.../v1`, `v2`, root duplicates | Historical film builds | Archive; not client shelf |
| `vignette/` | Historical | Archive |
| `capabilities/costello/_archive/Costello_Brand_Portal.html` | Old brand portal | Archive only |
| `capabilities/costello/Mailing_Timeline.html` | Likely alias of superseded timeline | Confirm vs `Costello_Mailing_Timeline.html` |
| Kitchen `costello-review/Costello_Referral_Letter_PROOF.pdf` (if present separately) | Duplicate proof channel | One canonical path in Files |

QA/preview PNGs under `_previews/` and film `previews/` are **not** client records.

---

## E. DUPLICATES / CONFLICTS

1. **Brand Portal in both tabs** — Reference CTA + Files `brand-portal` (same HTML). Allowed conceptually if Reference explains and Files owns; today both feel like destinations.  
2. **Reference ledger duplicates** — Chambers, Bios, FAQs, Practice areas appear in multiple Reference sections.  
3. **Source materials live in Files without files** — practice areas, social, Clio, FAQ, bios violate “Files holds the thing.”  
4. **SOW status conflict** — Project state: final language being completed / execution pending. Files package: Prepared for signature / CLIENT REVIEW.  
5. **Bios conflict** — “Approved short bios · Available” vs “Updated bios · In development.”  
6. **Referral proof copies** — `documents/referral/` vs `production-prep/` copies of PROOF and CLEAN_REVIEW.  
7. **SOW redline paths** — itemized redline in shelf + non-itemized in archive + extra non-manifest `Costello_Website_SOW_Redline_2026-09-10.docx` at documents root.  
8. **“Folio” / shelf naming** — Files “Brand / Reference” category blurs the model.  
9. **Control / Overview / Mailing pages in Files** — workspace surfaces mixed into document repository.  
10. **Word collision risk** — Connect FAQ PDF vs firm FAQs (different things; naming must stay distinct).

---

## F. Recommended final information architecture

### Reference (provenance layer)

Sections (conceptual):

1. **Brand system** — what it is, status, link → Files `brand-portal`  
2. **Messaging & proof sources** — FAQs, practice areas, Chambers, taglines, matters, social deck, Clio instructions — each row: meaning · status · usage · **Open file** / **External** / **NOT FILED YET**  
3. **People sources** — approved portal bios vs bios in development  
4. **Positioning** — draft anchor (Kitchen), not a file  
5. **Historical / prior agency** — inventory note + links once filed  

No second file browser. No download implied without `href`.

### Files (artifact repository)

Categories (conceptual):

1. **Agreements & exhibits** — SOW package + COIs + working/prior SOW copies clearly labeled  
2. **Plans** — Website Launch Plan, Referral Campaign Plan  
3. **Referral production** — client source Word, current proof, clean review, vendor quotes/specs  
4. **Orientation / film** (optional) — current How the Work Connects only  
5. **Brand artifact** — Brand Portal HTML (single entry)  
6. **Archive** — superseded SOWs, letter proofs, old status/timeline pages  
7. **Filing state** — expected intakes (list, bios, Clio account)  

**Remove from Files (or relabel as workspace links, not records):** Overview, Kitchen surface as primary “file,” Mailing operating page, Control (unless intentionally client-visible), empty “source received” stubs.

**Move stubs to Reference** until artifacts exist: practice areas, social, Clio docs, FAQ edits, bios-in-development.

---

## G. Proposed user-facing tab descriptions

**Reference**  
What we know, where it came from, and how it should be used. Provenance for brand, messaging, proof sources, and client-supplied material. When a document exists, open it from Files. When it does not, the row says so.

**Files**  
The actual documents, deliverables, and records behind the work—agreements, exhibits, proofs, plans, vendor documents, and archives. One canonical file per artifact.

---

## Implementation readiness (for later — not this pass)

Do not wire until:

1. Missing materials in **C** are either filed or marked NOT FILED YET / EXTERNAL  
2. SOW and bios status language is reconciled  
3. Files stubs without `href` are removed or relocated to Reference  
4. Production-prep vs referral canonical paths are chosen  

**Audit complete. No UI changes made.**
