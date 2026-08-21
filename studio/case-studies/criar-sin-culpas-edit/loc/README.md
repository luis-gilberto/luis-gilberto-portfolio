# Localization pack · Criar Sin Culpas edit case study

## Full pack (baseline)

Give your localization team `ES/` for the first complete pass.

| File | Use |
|------|-----|
| **[ES/CSC-EDIT-LOC-HANDOFF.md](./ES/CSC-EDIT-LOC-HANDOFF.md)** | Human-readable brief + chapter tables (EN → ES) |
| **[ES/csc-edit-strings.csv](./ES/csc-edit-strings.csv)** | Import into Google Sheets / Phrase / Lokalise |
| `ES/csc-edit-strings.json` | Machine-readable dump (optional) |

## Delta pack (second pass)

After narrative/evidence edits, send **[ES-delta/](./ES-delta/)** — only new and revised strings since the ES baseline.

Regenerate delta: `node loc/_build_delta_pack.js`

Apply merged translations into the edit HTML: `node loc/_apply_i18n.js`  
(Uses `ES-delta/csc-master-strings-MERGED.json` → `data-i18n-en` / `data-i18n-es` for the Studio EN/ES toggle.)

Target: **Spanish (es) · LATAM / Mexico preferred**.

Source page: `/studio/case-studies/criar-sin-culpas-edit/`
