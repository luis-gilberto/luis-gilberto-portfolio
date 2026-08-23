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
    rows.push({ string_id: cols[0], section_id: cols[1], section: cols[2], en: cols[5], es: cols[6] });
  }
  return rows;
}

const base = path.join(__dirname);
const source = readCsv(path.join(base, 'loc', 'csc-case-study-strings.csv'));
const trans = readCsv(path.join(base, 'loc', 'lovable', 'criar-sin-culpas-transcreation-es.csv'));
const sourceById = new Map(source.map((r) => [r.string_id, r]));

const changes = [];
for (const row of trans) {
  const src = sourceById.get(row.string_id);
  if (src && src.es !== row.es) {
    changes.push({ id: row.string_id, section_id: row.section_id, section: row.section, en: row.en, oldEs: src.es, newEs: row.es });
  }
}

const bySection = {};
for (const c of changes) {
  bySection[c.section_id] = (bySection[c.section_id] || 0) + 1;
}

console.log('Total changes:', changes.length);
console.log('By section:', bySection);
console.log('\nAll changes:');
for (const c of changes) {
  console.log(`\n${c.id} [${c.section_id}]`);
  console.log(`EN: ${c.en}`);
  console.log(`OLD: ${c.oldEs}`);
  console.log(`NEW: ${c.newEs}`);
}
