# Localization README

## What you are translating

The **Criar Sin Culpas** case study page on luis-gilberto.com. It is a long-form portfolio piece with EN/ES toggle.

## Workflow

1. Open `csc-case-study-strings.csv` in Excel, Google Sheets, or your CAT tool.
2. Work in the **es** column. Leave **en** unchanged unless flagging a source issue.
3. Use **status** to prioritize:
   - `REVISED` — owner-approved Spanish (Hero, Brief, Section 01 cards/headline)
   - `DRAFT` — needs full review
4. Add questions in **translator_notes**.
5. Return the completed CSV.

## Technical notes

- `[line break]` = keep as-is; maps to HTML line break in headlines
- `section_id` maps to HTML `id` attributes for reference
- `element` indicates tag type (p, h2, span, meta [content], img [alt], etc.)

## Regenerating this kit

From repo root:

```bash
node studio/case-studies/criar-sin-culpas/_extract-i18n.js
```

Run after `index.html` copy changes to refresh strings.
