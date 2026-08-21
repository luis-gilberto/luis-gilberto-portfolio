# Localization DELTA · Criar Sin Culpas edit

Send **this folder** to translators for the second pass.

| File | Use |
|------|-----|
| **[CSC-EDIT-LOC-DELTA.md](./CSC-EDIT-LOC-DELTA.md)** | Brief + tables (EN → empty ES) |
| **[csc-edit-delta-strings.csv](./csc-edit-delta-strings.csv)** | Import to Sheets / Phrase / Lokalise |
| `csc-edit-delta-strings.json` | Machine-readable (optional) |
| `csc-edit-retire-orphans.csv` | Prior ES strings no longer on the page (do not translate) |

Baseline already translated: `../ES/`

Regenerate anytime: `node loc/_build_delta_pack.js`
