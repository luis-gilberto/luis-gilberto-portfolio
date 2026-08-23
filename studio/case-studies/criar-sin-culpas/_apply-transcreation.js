const fs = require('fs');
const path = require('path');

function readCsv(filePath) {
  const text = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  const lines = text.split(/\r?\n/).filter(Boolean);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const cols = [];
    let cur = '';
    let inQuotes = false;
    for (let j = 0; j < line.length; j++) {
      const ch = line[j];
      if (ch === '"') {
        if (inQuotes && line[j + 1] === '"') { cur += '"'; j++; } else inQuotes = !inQuotes;
      } else if (ch === ',' && !inQuotes) { cols.push(cur); cur = ''; } else cur += ch;
    }
    cols.push(cur);
    rows.push({ string_id: cols[0], en: cols[5], es: cols[6] });
  }
  return rows;
}

function toHtmlAttr(value) {
  return value
    .replace(/ \[line break\] /g, '<br />')
    .replace(/"/g, '&quot;');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const base = path.join(__dirname);
const csvPath = path.join(base, 'loc', 'lovable', 'criar-sin-culpas-transcreation-es.csv');
const htmlPath = path.join(base, 'index.html');

const rows = readCsv(csvPath);
let html = fs.readFileSync(htmlPath, 'utf8');

let applied = 0;
const missed = [];

for (const row of rows) {
  const enAttr = toHtmlAttr(row.en);
  const esAttr = toHtmlAttr(row.es);
  const re = new RegExp(
    `(data-i18n-en="${escapeRegExp(enAttr)}")([^>]*?data-i18n-es=")([^"]*)(")`,
    'm'
  );

  if (!re.test(html)) {
    missed.push(row.string_id);
    continue;
  }

  html = html.replace(re, `$1$2${esAttr}$4`);
  applied++;
}

if (missed.length) {
  console.error('Missed IDs:', missed.join(', '));
  process.exit(1);
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log(`Applied ${applied} Spanish strings to index.html`);
