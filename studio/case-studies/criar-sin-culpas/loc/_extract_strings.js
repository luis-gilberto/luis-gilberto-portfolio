/**
 * Extract localizable strings from the CSC edit case study HTML.
 * Usage: node loc/_extract_strings.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const outDir = __dirname;

const rows = [];
function push(id, type, section, en, notes) {
  const text = String(en || "")
    .replace(/\s+/g, " ")
    .trim();
  if (!text || text.length < 2) return;
  if (text === "→" || text === "·") return;
  rows.push({
    id,
    type,
    section: section || "General",
    source_en: text,
    translation_es: "",
    notes: notes || "",
  });
}

function escCsv(s) {
  return `"${String(s).replace(/"/g, '""')}"`;
}

const title = (html.match(/<title>([^<]+)<\/title>/) || [])[1] || "";
const desc =
  (html.match(/name="description"\s+content="([^"]+)"/) || [])[1] || "";
push(
  "meta.title",
  "SEO",
  "Meta",
  title,
  "Browser tab. Working-edit label may stay English-only until publish."
);
push("meta.description", "SEO", "Meta", desc, "Meta description · page is noindex");

const main = (html.match(/<main[\s\S]*?<\/main>/) || [html])[0];
let body = main
  .replace(/<script[\s\S]*?<\/script>/gi, "")
  .replace(/<style[\s\S]*?<\/style>/gi, "");

const parts = body.split(/<!--\s*=+\s*([\s\S]*?)\s*=+\s*-->/);
for (let i = 1; i < parts.length; i += 2) {
  const section = (parts[i] || "").replace(/\s+/g, " ").trim().slice(0, 90);
  const chunk = parts[i + 1] || "";
  const slug =
    section
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "")
      .slice(0, 28) || "section";
  let n = 0;

  const re =
    /<(h[1-6]|p|span|li|figcaption|label|button|a|td|th|dt|dd)([^>]*)>([\s\S]*?)<\/\1>/gi;
  let m;
  while ((m = re.exec(chunk))) {
    let text = m[3]
      .replace(/<br\s*\/?>/gi, " / ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&middot;/g, "·")
      .replace(/&#183;/g, "·")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, " ")
      .trim();
    if (!text || text.length < 2) continue;
    if (/^\d{2}$/.test(text)) continue;
    if (text === "→" || text === "·") continue;

    const cls = ((m[2].match(/class="([^"]+)"/) || [])[1] || "").toLowerCase();
    const tag = m[1].toLowerCase();
    let type = "body";
    if (/^h[1-6]$/.test(tag)) type = "heading";
    else if (
      cls.includes("eyebrow") ||
      cls.includes("__k") ||
      cls.includes("__label") ||
      cls.includes("ev") ||
      cls === "num"
    )
      type = "label";
    else if (tag === "li") type = "list";
    else if (tag === "figcaption" || cls.includes("cap")) type = "caption";
    else if (cls.includes("lede") || cls.includes("support")) type = "lede";

    n += 1;
    push(`${slug}_${String(n).padStart(3, "0")}`, type, section, text);
  }

  const altRe = /alt="([^"]+)"/g;
  let a;
  while ((a = altRe.exec(chunk))) {
    n += 1;
    push(
      `${slug}_alt_${String(n).padStart(3, "0")}`,
      "alt",
      section,
      a[1],
      "Image alt text · translate for accessibility"
    );
  }

  const ariaRe = /aria-label="([^"]+)"/g;
  let ar;
  while ((ar = ariaRe.exec(chunk))) {
    n += 1;
    push(
      `${slug}_aria_${String(n).padStart(3, "0")}`,
      "aria",
      section,
      ar[1],
      "Screen-reader label"
    );
  }
}

// Deduplicate identical EN within same section+type keeping first id
const seen = new Set();
const deduped = [];
for (const r of rows) {
  const key = `${r.section}||${r.type}||${r.source_en}`;
  if (seen.has(key)) continue;
  seen.add(key);
  deduped.push(r);
}

const csv = [
  "id,type,section,source_en,translation_es,notes",
  ...deduped.map((r) =>
    [r.id, r.type, escCsv(r.section), escCsv(r.source_en), "", escCsv(r.notes)].join(
      ","
    )
  ),
].join("\n");

fs.writeFileSync(path.join(outDir, "csc-edit-strings.csv"), csv, "utf8");
fs.writeFileSync(
  path.join(outDir, "csc-edit-strings.json"),
  JSON.stringify(deduped, null, 2),
  "utf8"
);

console.log(`Extracted ${deduped.length} strings → loc/csc-edit-strings.csv`);
