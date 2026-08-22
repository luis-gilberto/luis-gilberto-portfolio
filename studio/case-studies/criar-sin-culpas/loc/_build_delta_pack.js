/**
 * Build a delta localization pack: strings new or changed since loc/ES/.
 * Usage: node loc/_build_delta_pack.js
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const LOC = __dirname;
const OUT = path.join(LOC, "ES-delta");

// Refresh live extract
execSync("node loc/_extract_strings.js", {
  cwd: path.resolve(LOC, ".."),
  stdio: "inherit",
});

const live = JSON.parse(
  fs.readFileSync(path.join(LOC, "csc-edit-strings.json"), "utf8")
);
const es = JSON.parse(
  fs.readFileSync(path.join(LOC, "ES", "csc-edit-strings.json"), "utf8")
);

function norm(s) {
  return String(s || "")
    .replace(/\s+/g, " ")
    .trim();
}

function escCsv(s) {
  return `"${String(s).replace(/"/g, '""')}"`;
}

const esByEn = new Map();
const esById = new Map();
for (const r of es) {
  esById.set(r.id, r);
  const k = norm(r.source_en).toLowerCase();
  if (k) esByEn.set(k, r);
}

const liveEns = new Set(live.map((r) => norm(r.source_en).toLowerCase()));

const delta = [];
const orphans = [];

for (const r of live) {
  const k = norm(r.source_en).toLowerCase();
  const byEn = esByEn.get(k);
  const byId = esById.get(r.id);

  if (byEn && norm(byEn.translation_es)) {
    continue; // already translated with matching EN
  }

  if (byId && norm(byId.source_en).toLowerCase() !== k) {
    delta.push({
      id: r.id,
      type: r.type,
      section: r.section,
      source_en: r.source_en,
      translation_es: "",
      change: "revised",
      notes: `REVISED since ES pack. Prior EN: ${norm(byId.source_en).slice(0, 160)}${
        byId.translation_es
          ? ` · Prior ES (do not reuse blindly): ${norm(byId.translation_es).slice(0, 120)}`
          : ""
      }`,
    });
    continue;
  }

  if (!byEn) {
    delta.push({
      id: r.id,
      type: r.type,
      section: r.section,
      source_en: r.source_en,
      translation_es: "",
      change: "new",
      notes: r.notes || "NEW since ES pack · translate fresh",
    });
  }
}

for (const r of es) {
  const k = norm(r.source_en).toLowerCase();
  if (k && !liveEns.has(k)) {
    orphans.push({
      id: r.id,
      type: r.type,
      section: r.section,
      source_en: r.source_en,
      translation_es: r.translation_es || "",
      notes: "RETIRE — EN no longer on live page",
    });
  }
}

fs.mkdirSync(OUT, { recursive: true });

const csvHeader =
  "id,type,section,change,source_en,translation_es,notes";
const csvLines = [
  csvHeader,
  ...delta.map(
    (r) =>
      [
        escCsv(r.id),
        escCsv(r.type),
        escCsv(r.section),
        escCsv(r.change),
        escCsv(r.source_en),
        escCsv(r.translation_es),
        escCsv(r.notes),
      ].join(",")
  ),
];
fs.writeFileSync(path.join(OUT, "csc-edit-delta-strings.csv"), csvLines.join("\n"), "utf8");
fs.writeFileSync(
  path.join(OUT, "csc-edit-delta-strings.json"),
  JSON.stringify(delta, null, 2),
  "utf8"
);
fs.writeFileSync(
  path.join(OUT, "csc-edit-retire-orphans.csv"),
  [
    "id,type,section,source_en,translation_es,notes",
    ...orphans.map(
      (r) =>
        [
          escCsv(r.id),
          escCsv(r.type),
          escCsv(r.section),
          escCsv(r.source_en),
          escCsv(r.translation_es),
          escCsv(r.notes),
        ].join(",")
    ),
  ].join("\n"),
  "utf8"
);

const bySec = {};
for (const r of delta) {
  (bySec[r.section] = bySec[r.section] || []).push(r);
}

const md = [];
md.push("# Criar Sin Culpas · Case Study — Localization DELTA");
md.push("");
md.push("**Source:** `/studio/case-studies/criar-sin-culpas/` (working edit · EN)");
md.push("**Baseline ES pack:** `loc/ES/` (prior complete handoff)");
md.push("**Target locale:** Spanish (es) — LATAM / Mexico preferred");
md.push(
  `**Scope:** ${delta.length} strings new or revised since the ES pack · ${orphans.length} prior ES strings to retire`
);
md.push("**Companions:** `csc-edit-delta-strings.csv` · `csc-edit-retire-orphans.csv`");
md.push("");
md.push("---");
md.push("");
md.push("## How to use");
md.push("");
md.push("1. Import **`csc-edit-delta-strings.csv`** only (not the full prior pack).");
md.push("2. Fill **`translation_es`**. Do not change `id` or `source_en`.");
md.push("3. `change=new` → translate fresh. `change=revised` → re-translate; prior ES is in Notes for reference only.");
md.push("4. Use the same voice rules as the original handoff (middot `·`, no unverified metrics, keep proper nouns).");
md.push("5. Return the completed CSV. Dev will merge into the master ES pack.");
md.push("");
md.push("## Do not translate (brand / product)");
md.push("");
md.push(
  "Criar Sin Culpas · LG Studio · StrategyIQ · Nari · Pantallas · Desbordes · Sueño · Hermanos · Emociones · Cine · Foto · Pin · Símbolo · Access Pass · Plausible Analytics (product name) · portal_entered · language_changed (event names — keep English)"
);
md.push("");
md.push("## Metrics / evidence note");
md.push("");
md.push(
  "Chapter 06 and 10 include Plausible figures (91-day window · May 22–August 20, 2026 · 223 visitors). Keep numbers exactly; localize surrounding prose only."
);
md.push("");
md.push("---");
md.push("");
md.push("## Strings to translate");
md.push("");

for (const [sec, rows] of Object.entries(bySec)) {
  md.push(`### ${sec}`);
  md.push("");
  md.push("| ID | Change | Type | EN (source) | ES (target) | Notes |");
  md.push("|----|--------|------|-------------|-------------|-------|");
  for (const r of rows) {
    const en = r.source_en.replace(/\|/g, "\\|").replace(/\n/g, " ");
    const notes = (r.notes || "").replace(/\|/g, "\\|").slice(0, 220);
    md.push(
      `| \`${r.id}\` | ${r.change} | ${r.type} | ${en} |  | ${notes} |`
    );
  }
  md.push("");
}

md.push("---");
md.push("");
md.push("## Retire list (informational)");
md.push("");
md.push(
  `These ${orphans.length} EN strings left the live page. Do not translate further. See \`csc-edit-retire-orphans.csv\`.`
);
md.push("");
const orphanSecs = {};
for (const r of orphans) {
  (orphanSecs[r.section] = orphanSecs[r.section] || []).push(r);
}
for (const [sec, rows] of Object.entries(orphanSecs)) {
  md.push(`- **${sec}** — ${rows.length} retired`);
}
md.push("");

fs.writeFileSync(path.join(OUT, "CSC-EDIT-LOC-DELTA.md"), md.join("\n"), "utf8");

fs.writeFileSync(
  path.join(OUT, "README.md"),
  `# Localization DELTA · Criar Sin Culpas edit

Send **this folder** to translators for the second pass.

| File | Use |
|------|-----|
| **[CSC-EDIT-LOC-DELTA.md](./CSC-EDIT-LOC-DELTA.md)** | Brief + tables (EN → empty ES) |
| **[csc-edit-delta-strings.csv](./csc-edit-delta-strings.csv)** | Import to Sheets / Phrase / Lokalise |
| \`csc-edit-delta-strings.json\` | Machine-readable (optional) |
| \`csc-edit-retire-orphans.csv\` | Prior ES strings no longer on the page (do not translate) |

Baseline already translated: \`../ES/\`

Regenerate anytime: \`node loc/_build_delta_pack.js\`
`,
  "utf8"
);

const summary = {
  live_count: live.length,
  es_pack_count: es.length,
  delta_count: delta.length,
  new_count: delta.filter((r) => r.change === "new").length,
  revised_count: delta.filter((r) => r.change === "revised").length,
  orphan_count: orphans.length,
  by_section: Object.fromEntries(
    Object.entries(bySec).map(([k, v]) => [k, v.length])
  ),
};
fs.writeFileSync(
  path.join(OUT, "delta-summary.json"),
  JSON.stringify(summary, null, 2),
  "utf8"
);

console.log(JSON.stringify(summary, null, 2));
console.log("Wrote", OUT);
