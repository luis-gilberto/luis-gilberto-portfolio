const fs = require('fs');
const path = require('path');

function readCsv(filePath) {
  const text = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  const lines = text.split(/\r?\n/).filter(Boolean);
  const header = lines[0];
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const cols = [];
    let cur = '';
    let inQuotes = false;
    for (let j = 0; j < line.length; j++) {
      const ch = line[j];
      if (ch === '"') {
        if (inQuotes && line[j + 1] === '"') {
          cur += '"';
          j++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        cols.push(cur);
        cur = '';
      } else {
        cur += ch;
      }
    }
    cols.push(cur);
    rows.push({
      string_id: cols[0],
      section_id: cols[1],
      section: cols[2],
      element: cols[3],
      status: cols[4],
      en: cols[5],
      es: cols[6],
      translator_notes: cols[7] || '',
    });
  }
  return { header, rows };
}

const base = path.join(__dirname);
const sourcePath = path.join(base, 'loc', 'csc-case-study-strings.csv');
const transPath = path.join(base, 'loc', 'lovable', 'criar-sin-culpas-transcreation-es.csv');
const htmlPath = path.join(base, 'index.html');

const source = readCsv(sourcePath);
const trans = readCsv(transPath);
const html = fs.readFileSync(htmlPath, 'utf8');

const issues = [];
const warnings = [];

if (trans.header !== source.header) {
  issues.push('Header mismatch between source and transcreation file.');
}

const sourceById = new Map(source.rows.map((r) => [r.string_id, r]));
const transById = new Map(trans.rows.map((r) => [r.string_id, r]));

for (const row of source.rows) {
  if (!transById.has(row.string_id)) {
    issues.push(`Missing string_id in transcreation: ${row.string_id}`);
  }
}

for (const row of trans.rows) {
  if (!sourceById.has(row.string_id)) {
    warnings.push(`Extra string_id in transcreation: ${row.string_id}`);
  }
}

let emptyEs = 0;
let emDash = 0;
let changedFromSource = 0;
let changedFromHtml = 0;
let htmlMismatch = 0;
const sampleChanges = [];

for (const row of trans.rows) {
  if (!row.es || !row.es.trim()) {
    emptyEs++;
    issues.push(`Empty es for ${row.string_id}`);
  }
  if (row.es.includes('—') || row.es.includes('–')) {
    emDash++;
    warnings.push(`Em/en dash in ${row.string_id}`);
  }

  const src = sourceById.get(row.string_id);
  if (src && src.es !== row.es) changedFromSource++;

  const enAttr = row.en.replace(/ \[line break\] /g, '<br />').replace(/"/g, '&quot;');
  const esAttr = row.es.replace(/ \[line break\] /g, '<br />').replace(/"/g, '&quot;');
  const pairRe = new RegExp(
    `data-i18n-en="${enAttr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*data-i18n-es="([^"]*)"`,
    'm'
  );
  const m = html.match(pairRe);
  if (m) {
    const htmlEs = m[1].replace(/&quot;/g, '"');
    const fileEs = esAttr.replace(/&quot;/g, '"');
    if (htmlEs !== fileEs) {
      changedFromHtml++;
      if (sampleChanges.length < 8) {
        sampleChanges.push({ id: row.string_id, html: htmlEs.slice(0, 80), file: fileEs.slice(0, 80) });
      }
    }
  } else {
    htmlMismatch++;
  }
}

const notes = trans.rows.filter((r) => r.translator_notes && r.translator_notes.trim());

console.log(JSON.stringify({
  sourceRows: source.rows.length,
  transRows: trans.rows.length,
  idsMatch: source.rows.length === trans.rows.length && issues.filter((i) => i.startsWith('Missing')).length === 0,
  emptyEs,
  emDash,
  changedFromSourceKit: changedFromSource,
  changedFromLiveHtml: changedFromHtml,
  htmlPairLookupMisses: htmlMismatch,
  translatorNotes: notes.length,
  issues: issues.slice(0, 20),
  warnings: warnings.slice(0, 20),
  sampleChanges,
  notesPreview: notes.slice(0, 5).map((n) => ({ id: n.string_id, note: n.translator_notes })),
}, null, 2));
