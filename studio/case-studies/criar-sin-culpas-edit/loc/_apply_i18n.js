/**
 * Apply merged CSC edit localization strings as data-i18n-en / data-i18n-es.
 * Source: loc/ES-delta/csc-master-strings-MERGED.json
 * Usage: node loc/_apply_i18n.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const htmlPath = path.join(ROOT, "index.html");
const stringsPath = path.join(__dirname, "ES-delta", "csc-master-strings-MERGED.json");

const rows = JSON.parse(fs.readFileSync(stringsPath, "utf8"));
let html = fs.readFileSync(htmlPath, "utf8");

function norm(s) {
  return String(s || "")
    .replace(/<br\s*\/?>/gi, " / ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&middot;/g, "·")
    .replace(/&#183;/g, "·")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function toHtmlBreaks(s) {
  return String(s || "").replace(/ \/ /g, "<br />");
}

function escAttr(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;");
}

/** Map normalized EN → row (prefer longer / more specific first) */
const byEn = new Map();
for (const r of rows) {
  if (!r.translation_es || !r.source_en) continue;
  const k = norm(r.source_en);
  if (!k) continue;
  if (!byEn.has(k)) byEn.set(k, r);
}

const used = new Set();
let applied = 0;
let skipped = 0;

function lookup(text) {
  const k = norm(text);
  if (!k || k.length < 2) return null;
  return byEn.get(k) || null;
}

function injectAttrs(openTag, enVal, esVal, extraAttrs) {
  // Strip existing i18n attrs then re-add
  let tag = openTag
    .replace(/\s+data-i18n-en="[^"]*"/gi, "")
    .replace(/\s+data-i18n-es="[^"]*"/gi, "")
    .replace(/\s+data-i18n-attr="[^"]*"/gi, "");
  const insert =
    ` data-i18n-en="${escAttr(enVal)}" data-i18n-es="${escAttr(esVal)}"` +
    (extraAttrs || "");
  if (/\s*\/?>$/.test(tag)) {
    return tag.replace(/\s*(\/?)>$/, `${insert}$1>`);
  }
  return tag.replace(/>$/, `${insert}>`);
}

// --- title ---
html = html.replace(/<title>([^<]*)<\/title>/i, (full, text) => {
  const row = lookup(text);
  if (!row) return full;
  used.add(row.id);
  applied++;
  const en = text.trim();
  const es = row.translation_es;
  return `<title data-i18n-en="${escAttr(en)}" data-i18n-es="${escAttr(es)}">${en}</title>`;
});

// --- meta description ---
html = html.replace(
  /<meta\s+name="description"\s+content="([^"]*)"\s*\/?>/i,
  (full, content) => {
    const row = lookup(content);
    if (!row) return full;
    used.add(row.id);
    applied++;
    return `<meta name="description" content="${escAttr(content)}" data-i18n-en="${escAttr(content)}" data-i18n-es="${escAttr(row.translation_es)}" data-i18n-attr="content" />`;
  }
);

// --- img alt ---
html = html.replace(/<img\b([^>]*)>/gi, (full, attrs) => {
  const altM = attrs.match(/\salt="([^"]*)"/i);
  if (!altM) return full;
  const alt = altM[1];
  const row = lookup(alt);
  if (!row) return full;
  used.add(row.id);
  applied++;
  let cleaned = attrs
    .replace(/\s+data-i18n-en="[^"]*"/gi, "")
    .replace(/\s+data-i18n-es="[^"]*"/gi, "")
    .replace(/\s+data-i18n-attr="[^"]*"/gi, "");
  cleaned += ` data-i18n-en="${escAttr(alt)}" data-i18n-es="${escAttr(row.translation_es)}" data-i18n-attr="alt"`;
  return `<img${cleaned}>`;
});

// --- aria-label ---
html = html.replace(
  /(\s)(aria-label)="([^"]*)"/gi,
  (full, sp, name, val) => {
    const row = lookup(val);
    if (!row) return full;
    // Skip if already processed as part of a later element inject —
    // mark via a data flag on nearby tags is hard; allow duplicate attrs on same node via element pass
    used.add(row.id);
    applied++;
    return `${sp}${name}="${val}" data-i18n-en="${escAttr(val)}" data-i18n-es="${escAttr(row.translation_es)}" data-i18n-attr="aria-label"`;
  }
);

// --- text elements (same set as extractor) ---
const tagRe =
  /<(h[1-6]|p|span|li|figcaption|label|button|a|td|th|dt|dd|strong|em)(\s[^>]*)?>([\s\S]*?)<\/\1>/gi;

function hasStructuredChildren(inner) {
  // Any real element child (not bare text / <br>) must be localized on leaves,
  // never on the parent — otherwise flat ES wipes badge/caption markup.
  return /<(?!br\b)[a-z][\w-]*\b/i.test(inner);
}

html = html.replace(tagRe, (full, tag, attrs, inner) => {
  attrs = attrs || "";
  const textOnly = inner
    .replace(/<br\s*\/?>/gi, " / ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!textOnly || textOnly.length < 2) return full;
  if (textOnly === "→" || textOnly === "·") return full;
  if (/^\d{2}$/.test(textOnly)) return full;

  // Structured wrappers (ev + cap, gallery name/meta, etc.): skip parent
  if (hasStructuredChildren(inner)) {
    skipped++;
    return full;
  }

  const row = lookup(inner) || lookup(textOnly);
  if (!row) {
    skipped++;
    return full;
  }

  return applyElement(tag, attrs, inner, row);
});

function applyElement(tag, attrs, inner, row) {
  used.add(row.id);
  applied++;
  const enHtml = inner.trim(); // keep existing markup as EN source of truth
  let esHtml = toHtmlBreaks(row.translation_es);
  // If EN keeps markup, ES must keep equivalent markup (never flatten)
  if (/<[a-z]/i.test(enHtml) && !/<[a-z]/i.test(esHtml)) {
    skipped++;
    return `<${tag}${attrs || ""}>${inner}</${tag}>`;
  }
  const open = injectAttrs(`<${tag}${attrs}>`, enHtml, esHtml);
  return `${open}${inner}</${tag}>`;
}

// Deduplicate accidental double data-i18n-attr on same tag from aria + element
html = html.replace(
  /(\sdata-i18n-attr="[^"]*")(\s[^>]*)\1/gi,
  "$1$2"
);

fs.writeFileSync(htmlPath, html, "utf8");

const unused = rows.filter((r) => r.translation_es && !used.has(r.id));
const report = {
  total_strings: rows.length,
  applied_ops: applied,
  unique_ids_used: used.size,
  unused_with_es: unused.length,
  unused_sample: unused.slice(0, 25).map((r) => ({
    id: r.id,
    type: r.type,
    en: r.source_en.slice(0, 100),
  })),
};
fs.writeFileSync(
  path.join(__dirname, "ES-delta", "_apply-report.json"),
  JSON.stringify(report, null, 2)
);
console.log(JSON.stringify(report, null, 2));
