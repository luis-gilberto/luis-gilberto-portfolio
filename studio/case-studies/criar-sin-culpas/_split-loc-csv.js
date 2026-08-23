const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'loc', 'csc-case-study-strings.csv');
const outDir = path.join(__dirname, 'loc', 'lovable');
const maxRowsPerFile = 40;

const text = fs.readFileSync(src, 'utf8').replace(/^\uFEFF/, '');
const lines = text.split(/\r?\n/).filter(Boolean);
const header = lines[0];
const rows = lines.slice(1);

function parseSectionId(row) {
  const m = row.match(/^"csc-\d+","([^"]+)"/);
  return m ? m[1] : 'unknown';
}

function parseSectionLabel(row) {
  const m = row.match(/^"csc-\d+","[^"]+","([^"]+)"/);
  return m ? m[1] : 'unknown';
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

fs.mkdirSync(outDir, { recursive: true });

const groups = [];
let current = null;

for (const row of rows) {
  const sectionId = parseSectionId(row);
  const sectionLabel = parseSectionLabel(row);
  if (!current || current.sectionId !== sectionId) {
    current = { sectionId, sectionLabel, rows: [] };
    groups.push(current);
  }
  current.rows.push(row);
}

const manifest = [];
let fileIndex = 0;

for (const group of groups) {
  const base = `${String(++fileIndex).padStart(2, '0')}-${slugify(group.sectionId || group.sectionLabel)}`;
  const chunks = [];
  for (let i = 0; i < group.rows.length; i += maxRowsPerFile) {
    chunks.push(group.rows.slice(i, i + maxRowsPerFile));
  }

  chunks.forEach((chunk, chunkIndex) => {
    const suffix = chunks.length > 1 ? `-part${chunkIndex + 1}` : '';
    const filename = `${base}${suffix}.csv`;
    const body = [header, ...chunk].join('\n');
    fs.writeFileSync(path.join(outDir, filename), '\uFEFF' + body, 'utf8');
    manifest.push({
      file: filename,
      section_id: group.sectionId,
      section: group.sectionLabel,
      rows: chunk.length,
      part: chunks.length > 1 ? `${chunkIndex + 1}/${chunks.length}` : '1/1',
    });
  });
}

const manifestMd = `# CSC localization chunks (Lovable)

Source: \`../csc-case-study-strings.csv\`
Generated: ${new Date().toISOString().slice(0, 10)}
Max rows per file: ${maxRowsPerFile}

| File | Section ID | Section | Rows | Part |
|------|------------|---------|------|------|
${manifest.map((m) => `| \`${m.file}\` | \`${m.section_id}\` | ${m.section} | ${m.rows} | ${m.part} |`).join('\n')}

## Notes

- Each file includes the same CSV header row.
- Edit the **es** column only unless flagging an English source issue.
- Return completed files in the same naming format.
`;

fs.writeFileSync(path.join(outDir, 'MANIFEST.md'), manifestMd, 'utf8');
console.log(`Wrote ${manifest.length} CSV files to ${outDir}`);
