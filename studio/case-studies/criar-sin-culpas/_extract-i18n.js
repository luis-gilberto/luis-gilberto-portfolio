const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'index.html');
const rawHtml = fs.readFileSync(htmlPath, 'utf8');

// Collapse multiline tags so data-i18n-en and data-i18n-es stay paired
const html = rawHtml.replace(/<([a-zA-Z][^>]*?)\n([\s\S]*?)>/g, (match, start, middle) => {
  if (!middle.includes('data-i18n')) return match;
  return '<' + start + ' ' + middle.replace(/\s+/g, ' ').trim() + '>';
});

const SECTION_LABELS = {
  open: '00 · Hero',
  brief: 'Brief · La versión corta',
  'starting-point': '01 · La situación',
  'the-read': '02 · El diagnóstico',
  method: '03 · Method',
  brand: '04 · Brand',
  governance: '05 · Governance',
  moment: '07 · Designing for the moment',
  languages: '07 · Two visual languages',
  infrastructure: '08 · Image infrastructure',
  circulation: '08 · Social / In circulation',
  operations: '10 · Operate',
  product: '10 · From support to product',
  'what-changed': '13 · What changed',
  close: '14 · Living case / Close',
};

function normalize(text) {
  return text
    .replace(/&quot;/g, '"')
    .replace(/<br \/>/g, ' [line break] ');
}

function getStatus(sectionId, en) {
  if (sectionId === 'open' || sectionId === 'brief') return 'REVISED';
  if (sectionId === 'starting-point') {
    const draftMarkers = [
      'What needed to be organized',
      'Source material',
      'Discovery material',
      'Initial intake',
      'Collect',
    ];
    if (draftMarkers.some((m) => en.startsWith(m) || en.includes(m))) return 'DRAFT';
    if (en === '01') return 'SKIP';
    return 'REVISED';
  }
  return 'DRAFT';
}

const rows = [];
let sectionId = 'Page metadata';
let sectionLabel = 'Page metadata';

const lines = html.split(/\r?\n/);
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  const chapComment = lines[i + 1]?.match(/^\s*(\d+\s*·\s*.+?)\s*$/);
  if (line.includes('<!-- ===') && chapComment) {
    sectionLabel = chapComment[1].trim();
  }

  const idMatch = line.match(/<(?:section|header)[^>]*id="([^"]+)"/);
  if (idMatch) {
    sectionId = idMatch[1];
    if (SECTION_LABELS[sectionId]) sectionLabel = SECTION_LABELS[sectionId];
  }

  const ens = [...line.matchAll(/data-i18n-en="([^"]*)"/g)].map((m) => m[1]);
  const ess = [...line.matchAll(/data-i18n-es="([^"]*)"/g)].map((m) => m[1]);
  if (!ens.length) continue;

  const attrM = line.match(/data-i18n-attr="([^"]+)"/);
  const tagM = line.match(/<(\w+)[^>]*data-i18n-en/);
  const tag = tagM ? tagM[1] : (line.match(/<(\w+)/) || ['', 'unknown'])[1];

  if (line.includes('class="num"')) continue;

  for (let j = 0; j < ens.length; j++) {
    const en = normalize(ens[j]);
    const es = normalize(ess[j] || '');
    const status = getStatus(sectionId, en);
    if (status === 'SKIP') continue;

    rows.push({
      id: `csc-${String(rows.length + 1).padStart(3, '0')}`,
      sectionId,
      section: sectionLabel,
      element: tag + (attrM ? ` [${attrM[1]}]` : ''),
      en,
      es,
      status,
    });
  }
}

function csvEscape(value) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

const outDir = path.join(__dirname, 'loc');
fs.mkdirSync(outDir, { recursive: true });

const csvLines = [
  ['string_id', 'section_id', 'section', 'element', 'status', 'en', 'es', 'translator_notes'].map(csvEscape).join(','),
  ...rows.map((r) =>
    [r.id, r.sectionId, r.section, r.element, r.status, r.en, r.es, ''].map(csvEscape).join(',')
  ),
];
fs.writeFileSync(path.join(outDir, 'csc-case-study-strings.csv'), '\uFEFF' + csvLines.join('\n'), 'utf8');

let md = `# Criar Sin Culpas · Case Study · Localization Kit\n\n`;
md += `| | |\n|---|---|\n`;
md += `| **Source** | \`studio/case-studies/criar-sin-culpas/index.html\` |\n`;
md += `| **Generated** | ${new Date().toISOString().slice(0, 10)} |\n`;
md += `| **Strings** | ${rows.length} |\n`;
md += `| **Target language** | Spanish (es) |\n`;
md += `| **Source language** | English (en) |\n\n`;

md += `## Files in this kit\n\n`;
md += `| File | Purpose |\n|---|---|\n`;
md += `| \`csc-case-study-strings.csv\` | Import into CAT tool or Google Sheets |\n`;
md += `| \`csc-case-study-strings.md\` | Human-readable reference (this file) |\n`;
md += `| \`README.md\` | Instructions for translators |\n\n`;

md += `## Status key\n\n`;
md += `- **REVISED** — Owner-approved Spanish; review for consistency, grammar, and register only\n`;
md += `- **DRAFT** — Needs full editorial review and refinement\n\n`;

md += `## Editorial brief\n\n`;
md += `**Project:** Living case study for LG Studio portfolio documenting work for Criar Sin Culpas (parenting practice, Nari).\n\n`;
md += `**Engagement:** April–August 2026 (5 months).\n\n`;
md += `**Voice:** First person (Luis Gilberto) describing strategic and design work delivered for a client.\n\n`;
md += `**Tone:** Professional, precise, evidence-led. Not promotional or sentimental.\n\n`;
md += `**Key framing:** The practice already had real value (trust, audience, knowledge, identity). The strategic gap was structural: organizing that value into a sustainable system. Do not imply the practice was broken, amateur, or without substance.\n\n`;
md += `**Constraints:**\n`;
md += `- No em dashes (—)\n`;
md += `- Preserve \`[line break]\` markers (rendered as \`<br />\` in the page)\n`;
md += `- Preserve proper names: Nari, StrategyIQ, LG Studio, Criar Sin Culpas, Plausible\n`;
md += `- Use neutral Latin American Spanish unless otherwise directed\n\n`;

let currentSection = '';
for (const r of rows) {
  if (r.section !== currentSection) {
    currentSection = r.section;
    md += `\n---\n\n## ${r.section}\n\n`;
    md += `*Section ID: \`${r.sectionId}\`*\n\n`;
  }
  md += `| ID | ${r.id} |\n`;
  md += `| Status | ${r.status} |\n`;
  md += `| Element | ${r.element} |\n`;
  md += `| **EN** | ${r.en} |\n`;
  md += `| **ES** | ${r.es} |\n\n`;
}

const readme = `# Localization README

## What you are translating

The **Criar Sin Culpas** case study page on luis-gilberto.com. It is a long-form portfolio piece with EN/ES toggle.

## Workflow

1. Open \`csc-case-study-strings.csv\` in Excel, Google Sheets, or your CAT tool.
2. Work in the **es** column. Leave **en** unchanged unless flagging a source issue.
3. Use **status** to prioritize:
   - \`REVISED\` — owner-approved Spanish (Hero, Brief, Section 01 cards/headline)
   - \`DRAFT\` — needs full review
4. Add questions in **translator_notes**.
5. Return the completed CSV.

## Technical notes

- \`[line break]\` = keep as-is; maps to HTML line break in headlines
- \`section_id\` maps to HTML \`id\` attributes for reference
- \`element\` indicates tag type (p, h2, span, meta [content], img [alt], etc.)

## Regenerating this kit

From repo root:

\`\`\`bash
node studio/case-studies/criar-sin-culpas/_extract-i18n.js
\`\`\`

Run after \`index.html\` copy changes to refresh strings.
`;

fs.writeFileSync(path.join(outDir, 'csc-case-study-strings.md'), md, 'utf8');
fs.writeFileSync(path.join(outDir, 'README.md'), readme, 'utf8');

const revised = rows.filter((r) => r.status === 'REVISED').length;
const draft = rows.filter((r) => r.status === 'DRAFT').length;
console.log(`Wrote ${rows.length} strings (${revised} REVISED, ${draft} DRAFT) to ${outDir}`);
