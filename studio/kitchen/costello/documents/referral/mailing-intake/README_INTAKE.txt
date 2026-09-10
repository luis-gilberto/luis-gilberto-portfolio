COSTELLO REFERRAL LETTER — MAILING LIST INTAKE
Status: mailing list not received. Do not mark RECEIVED until a real file exists.

--------------------------------------------------------------------------------
SCHEMA
--------------------------------------------------------------------------------
Required
  First Name
  Last Name
  Address 1
  City
  State
  ZIP

Optional
  Firm / Company
  Address 2 / Suite
  Email
  Internal Note

Accepted source: Excel (.xlsx / .xls) or CSV.
Production filename after a real list is cleaned:
  Costello_Mailing_List_PRODUCTION_YYYY-MM-DD.xlsx
Use CSV only if the selected printer requires CSV.
Do not create the PRODUCTION file until source data exists.

--------------------------------------------------------------------------------
VALIDATION CHECKLIST (run when a real file arrives)
--------------------------------------------------------------------------------
[ ] File opens; sheet used for mailing is identified
[ ] Header row is a single row; no duplicated headers
[ ] No merged cells in the data range
[ ] No hidden rows or columns in the data range
[ ] No live spreadsheet formulas in data cells
[ ] Column names mapped to the schema above
[ ] First Name present (blank = flag; no invented salutation)
[ ] Last Name present
[ ] Address 1 present
[ ] City present
[ ] State present
[ ] ZIP present
[ ] ZIP shape checked (5-digit or ZIP+4); malformed values flagged
[ ] State values checked for inconsistent abbreviations / full names
[ ] Leading and trailing whitespace flagged
[ ] Exact duplicate rows flagged
[ ] Obvious duplicate people / firms flagged
[ ] Multiple contacts at the same address flagged (keep unless client says otherwise)
[ ] Blank personalization field (First Name) flagged
[ ] Row count recorded before and after any cleanup
[ ] No address “correction” treated as authoritative truth

CASS / NCOA remains the printer or vendor’s responsibility unless otherwise agreed.

--------------------------------------------------------------------------------
NORMALIZATION STEPS (after a real file arrives)
--------------------------------------------------------------------------------
1. Work from a copy. Keep the client original unchanged.
2. Map incoming columns to the schema names.
3. Trim stray whitespace from all text fields.
4. Normalize State to two-letter USPS abbreviations where the value is unambiguous; flag the rest.
5. Keep ZIP as text so leading zeros are not dropped. Flag malformed ZIPs.
6. Split combined “City, ST ZIP” cells only when the parts are clear; otherwise flag.
7. Do not fill blank First Name, street, city, state, or ZIP.
8. Do not delete flagged rows without Costello confirmation.
9. Record row counts and flags in a short intake note next to the cleaned file.
10. Write Costello_Mailing_List_PRODUCTION_YYYY-MM-DD.xlsx only after flags are resolved or explicitly accepted.

--------------------------------------------------------------------------------
MERGE-FIELD LOGIC
--------------------------------------------------------------------------------
Letter greeting: Dear [First Name],
Working proof merge token: «FirstName»
Source column: First Name

If First Name is blank: flag for review.
Do not invent a salutation fallback without approval.

--------------------------------------------------------------------------------
PRINTER-HANDOFF FIELDS
--------------------------------------------------------------------------------
Send only after letter approval and a real, cleaned list exist.

Files
  - Final letter PDF (copy approved · production prep; not a printer submission)
  - Source DOCX if the printer asks for it
  - Cleaned mailing list (PRODUCTION xlsx, or CSV if required)
  - Return address copy for envelopes, if the printer is printing envelopes

List fields to include
  First Name (merge)
  Last Name
  Firm / Company
  Address 1
  Address 2 / Suite
  City
  State
  ZIP

Envelope / production items to confirm with the selected printer
  - Envelope size and whether a window envelope is used
  - How return address is printed
  - Fold / insert / seal
  - First-Class postage
  - CASS / NCOA
  - Proof required before production
  - Preferred list file type and column names

Do not assume unconfirmed vendor rules.

Return address (current firm address)
  Costello Law Firm, PLLC
  315 Fifth Avenue South, Suite 1000
  Seattle, WA 98104

--------------------------------------------------------------------------------
QUESTIONS FOR THE SELECTED PRINTER
--------------------------------------------------------------------------------
- Required file type: xlsx or csv?
- Required column headers, exactly?
- Who runs CASS / NCOA, and what happens to undeliverable records?
- Envelope spec (#10, window, printed face)?
- Return-address placement and type?
- Fold, insert, and seal method?
- First-Class postage included or separate?
- What proof is required before production, and in what form?
- How should the First Name merge field be named in the data file?

--------------------------------------------------------------------------------
CURRENT PROJECT FACTS (do not treat as list receipt)
--------------------------------------------------------------------------------
Mailing list: pending. Not received.
Letter: COPY APPROVED · PRODUCTION PREP. Not printer-ready. Not submitted.
Printer: not submitted.
Personalization: First Name merge; blank First Name flagged.
