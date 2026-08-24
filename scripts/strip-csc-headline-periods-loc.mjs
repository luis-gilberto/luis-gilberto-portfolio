#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const files = [
  "studio/case-studies/criar-sin-culpas/loc/csc-case-study-strings.csv",
  "studio/case-studies/criar-sin-culpas/loc/lovable/csc-case-study-strings.csv",
  "studio/case-studies/criar-sin-culpas/loc/lovable/criar-sin-culpas-transcreation-es.csv",
  "studio/case-studies/criar-sin-culpas/loc/lovable/02-open.csv",
  "studio/case-studies/criar-sin-culpas/loc/lovable/04-starting-point-part1.csv",
];

const headlineElements = new Set(["h1", "h2", "h3", "start-card__v"]);

function stripHeadlinePeriods(text) {
  return text
    .replace(/\.\s*\[line break\]/gi, " [line break]")
    .replace(/\.\s*$/g, "")
    .replace(/\.\s+(?=[A-ZÁÉÍÓÚÑ¿])/g, " [line break] ");
}

for (const rel of files) {
  const file = path.resolve(rel);
  if (!fs.existsSync(file)) continue;
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  const out = lines.map((line, i) => {
    if (i === 0 || !line.trim()) return line;
    const cols = line.match(/("(?:[^"]|"")*"|[^,]*)(?:,|$)/g);
    if (!cols || cols.length < 7) return line;
    const element = cols[3]?.replace(/^"|"$/g, "");
    if (!headlineElements.has(element)) return line;
    const en = cols[5]?.slice(1, -1).replace(/""/g, '"');
    const es = cols[6]?.slice(1, -1).replace(/""/g, '"');
    const nextEn = stripHeadlinePeriods(en);
    const nextEs = stripHeadlinePeriods(es);
    if (nextEn === en && nextEs === es) return line;
    const esc = (v) => `"${v.replace(/"/g, '""')}"`;
    cols[5] = esc(nextEn) + ",";
    cols[6] = esc(nextEs) + ",";
    return cols.join("").replace(/,$/, "");
  });
  fs.writeFileSync(file, out.join("\n"));
  console.log("[strip-csc-headline-periods] Updated", rel);
}
