/**
 * Build a human-readable localization handoff markdown from extracted strings.
 */
const fs = require("fs");
const path = require("path");
const rows = require("./csc-edit-strings.json");

const DO_NOT_TRANSLATE = [
  "Criar Sin Culpas",
  "LG Studio",
  "StrategyIQ",
  "Nari",
  "Nari Gilberto",
  "El Estudio",
  "Pantallas",
  "Desbordes",
  "Sueño",
  "Hermanos",
  "Emociones",
  "Agresión",
  "Ansiedad",
  "Límites",
  "Aprende",
  "Warm Earth",
  "criarsinculpas.com",
  "criarsinculpas.com/brand",
  "Access Pass",
  "Meltdowns",
  "Cine",
  "Foto",
  "Pin",
  "Símbolo",
  "Prohibido",
];

const KEEP_AS_IS_ES = [
  "Un solo dibujo, cuatro distancias.",
  "El sistema no decora. Sostiene.",
];

const PRIMARY = new Set([
  "heading",
  "lede",
  "body",
  "label",
  "list",
  "caption",
  "SEO",
]);

function isNoise(r) {
  if (/^Indigo$|^Lavender$|^Coral$|^Teal$|^Seafoam$|^Charcoal$|^Cream$|^Editorial navy$|^Terra$|^Peach$|^Paper$|^Navy$|^Cool grey$/i.test(r.source_en))
    return true;
  if (r.type === "alt" || r.type === "aria") return false; // keep in appendix
  return false;
}

const lines = [];
lines.push("# Criar Sin Culpas · Case Study — Localization Handoff");
lines.push("");
lines.push("**Source:** `/studio/case-studies/criar-sin-culpas/` (working edit · EN)");
lines.push("**Target locale:** Spanish (es) — LATAM / Mexico preferred unless otherwise noted");
lines.push("**Format companions:** `csc-edit-strings.csv` (import to Sheets/Phrase/Lokalise) · `csc-edit-strings.json`");
lines.push("**Generated from:** live HTML narrative copy");
lines.push("");
lines.push("---");
lines.push("");
lines.push("## How to use this pack");
lines.push("");
lines.push("1. Import **`csc-edit-strings.csv`** into Google Sheets or your CAT tool (columns: `id`, `type`, `section`, `source_en`, `translation_es`, `notes`).");
lines.push("2. Fill **`translation_es`** only. Do not change `id` or `source_en`.");
lines.push("3. Return the completed CSV (or this markdown with ES filled) plus any open questions.");
lines.push("4. Prefer natural Mexican / LATAM Spanish for parent-facing tone; keep studio/case-study voice professional and calm.");
lines.push("");
lines.push("## Voice & style");
lines.push("");
lines.push("| Rule | Guidance |");
lines.push("|------|----------|");
lines.push("| Middot | Keep `·` as the separator (do not replace with em dash or hyphen stacks). |");
lines.push("| Line breaks | Where EN uses two lines in a headline (` / ` in the table), preserve a natural ES line break. |");
lines.push("| Tone | Supportive, precise, non-hype. No unverified metrics. |");
lines.push("| Maturity language | Preserve distinctions like shipped / architected / implementing / not yet validated. |");
lines.push("| Parent voice | Quotes in discovery material stay first-person parent urgency. |");
lines.push("| Formality | Prefer *tú* for parent-facing fragments only if the source is already intimate; case-study narration can stay neutral / *usted*-free third person. |");
lines.push("");
lines.push("## Do not translate (brand / product proper nouns)");
lines.push("");
for (const term of DO_NOT_TRANSLATE) {
  lines.push(`- \`${term}\``);
}
lines.push("");
lines.push("## Already Spanish — keep unless copy deck changes");
lines.push("");
for (const term of KEEP_AS_IS_ES) {
  lines.push(`- “${term}”`);
}
lines.push("");
lines.push("## Peak lines (protect hierarchy)");
lines.push("");
lines.push("These are narrative peaks. Keep impact; do not soften:");
lines.push("");
lines.push("1. **The trust was already there. / The system wasn't**");
lines.push("2. **Parents were not arriving to browse. / They were arriving in need.**");
lines.push("3. **Nari's trust now has infrastructure.** *(confirm exact EN in chapter 10 before locking ES)*");
lines.push("");
lines.push("---");
lines.push("");
lines.push("## String tables by chapter");
lines.push("");
lines.push("Fill the **ES** column. Rows are primary on-page copy (headings, labels, body, lists, captions).");
lines.push("");

const bySection = {};
for (const r of rows) {
  if (!PRIMARY.has(r.type)) continue;
  if (isNoise(r)) continue;
  (bySection[r.section] = bySection[r.section] || []).push(r);
}

for (const [section, items] of Object.entries(bySection)) {
  lines.push(`### ${section}`);
  lines.push("");
  lines.push("| ID | Type | EN (source) | ES (target) | Notes |");
  lines.push("|----|------|-------------|-------------|-------|");
  for (const r of items) {
    const en = r.source_en.replace(/\|/g, "\\|");
    const notes = (r.notes || "").replace(/\|/g, "\\|");
    lines.push(`| \`${r.id}\` | ${r.type} | ${en} |  | ${notes} |`);
  }
  lines.push("");
}

lines.push("---");
lines.push("");
lines.push("## Appendix · Image alt & aria labels");
lines.push("");
lines.push("Translate for screen readers. Do not invent product claims.");
lines.push("");
lines.push("| ID | Type | EN (source) | ES (target) |");
lines.push("|----|------|-------------|-------------|");
for (const r of rows) {
  if (r.type !== "alt" && r.type !== "aria") continue;
  lines.push(
    `| \`${r.id}\` | ${r.type} | ${r.source_en.replace(/\|/g, "\\|")} |  |`
  );
}
lines.push("");
lines.push("---");
lines.push("");
lines.push("## Delivery checklist");
lines.push("");
lines.push("- [ ] All primary chapter strings translated");
lines.push("- [ ] Peak lines reviewed for force / cadence");
lines.push("- [ ] Proper nouns left intact");
lines.push("- [ ] Middot `·` preserved");
lines.push("- [ ] Alt/aria strings completed");
lines.push("- [ ] Open questions listed below");
lines.push("");
lines.push("## Open questions");
lines.push("");
lines.push("1. ");
lines.push("2. ");
lines.push("");

fs.writeFileSync(path.join(__dirname, "CSC-EDIT-LOC-HANDOFF.md"), lines.join("\n"), "utf8");
console.log("Wrote CSC-EDIT-LOC-HANDOFF.md");
