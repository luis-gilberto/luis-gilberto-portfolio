# Costello Letter 1 · Production Assembly Line

One-command pipeline: final letter + final mailing list → QA → printer-ready package.

Luis’s role after finals arrive: **REVIEW + SEND**.

## Command

```bash
npm run costello:letter1 -- --letter "/path/to/final-letter.docx" --list "/path/to/final-list.xlsx"
```

Dry run (non-final copies; does **not** change client-facing workspace status):

```bash
npm run costello:letter1 -- --dry-run \
  --letter "studio/kitchen/costello/documents/referral/production-prep/Costello_Letter_1_APPROVED_CLEAN.pdf" \
  --list "studio/kitchen/costello/documents/sources/mailing/CLF-MAILING-LIST-CORRECTED_2026-09-11.xlsx"
```

Live apply (publishes **LG STUDIO EDITORIAL PROOF** only — not Kris approval):

```bash
npm run costello:letter1 -- --letter "..." --list "..." --apply
```

`--apply` means: workspace shows LG Studio editorial proof awaiting Kris final approval.  
It does **not** mean client approved, print approved, READY TO SEND, or released to printer.

## Status model

```
CLIENT SOURCE COPY
  → LG STUDIO EDITORIAL PROOF          ← current after --apply
  → KRIS COSTELLO FINAL APPROVAL       ← requires explicit Luis confirmation after Kris responds
  → PRINTER PROOF
  → READY TO SEND
  → SENT / IN PRODUCTION
```

Successful technical QA = **EDITORIAL PROOF READY FOR CLIENT REVIEW**  
Vendor package may be **STAGED / NOT AUTHORIZED TO SEND** until Kris approval + Luis authorization.

## Inputs

| Input | Formats |
|-------|---------|
| Letter | `.docx`, `.pdf` (preferred if already print-approved), `.txt` / `.md` / `.html` fallback |
| List | `.xlsx`, `.csv` |

## Outputs (gitignored — recipient PII)

```
production/letter-1/
  ready/Costello_Letter_1_PRINT_READY.pdf
  ready/Costello_Letter_1_MAILING_LIST_CONNECT.xlsx
  qa/Costello_Letter_1_QA.xlsx
  qa/QA-REPORT.md
  qa/workspace-patch.json
  vendor/CONNECT-PACKAGE/   (may be STAGED / NOT AUTHORIZED; never auto-sent)
  vendor/email-to-steven.txt
  vendor/Costello_Letter_1_CONNECT_PACKAGE.zip
  source/ORIGINAL_LETTER.*
  archive/                  (prior runs when inputs change)
  runs/run-*.json           (counts/status only — no addresses)
```

## Connect columns

Business Name · Addressee Name · Street Address · Suite or Apartment · City · State · ZIP · First Name / Salutation

ZIP is written as text. No internal QA columns on the printer sheet.

## Safety

- Does **not** auto-send email
- Does **not** mark SENT_TO_CONNECT / IN_PRODUCTION
- Does **not** invent missing addresses or first names
- Does **not** commit mailing lists / QA workbooks / vendor Excel (see root `.gitignore`)
- Console logs counts and filenames only — never recipient addresses

## Human approval gate before send

1. Open `qa/QA-REPORT.md` — technical disposition clear
2. Kris Costello gives **final approval** of the editorial proof (Luis records it explicitly)
3. Spot-check print PDF + Connect xlsx
4. Confirm Costello written vendor/spend approval exists
5. Manually email Steven using an **authorized** `vendor/email-to-steven.txt` + zip

`--apply` alone never authorizes vendor send.
