#!/usr/bin/env node
/**
 * sync-csc-es.mjs
 *
 * Generates the Spanish locale shell for the Criar Sin Culpas case study from
 * the English source. One editorial source → two locale shells.
 *
 * Usage:
 *   node scripts/sync-csc-es.mjs
 *   npm run sync:csc-es
 *
 * Never overwrites the English source.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const EN_SRC = path.join(
  ROOT,
  "studio/case-studies/criar-sin-culpas/index.html"
);
const ES_DIR = path.join(ROOT, "studio/case-studies/criar-sin-culpas/es");
const ES_OUT = path.join(ES_DIR, "index.html");

const EN_URL =
  "https://www.luis-gilberto.com/studio/case-studies/criar-sin-culpas/";
const ES_URL =
  "https://www.luis-gilberto.com/studio/case-studies/criar-sin-culpas/es/";
const OG_EN =
  "https://res.cloudinary.com/dogtoagya/image/upload/v1787546075/csc-case-study-og-1200x630_wj5zyl.png";
const OG_ES =
  "https://res.cloudinary.com/dogtoagya/image/upload/v1787548229/csc-case-study-og-1200x630_ES_uhncs1.png";

const ES_TITLE = "Criar Sin Culpas · Caso de estudio | LG Studio";
const ES_DESCRIPTION =
  "Cómo una práctica de crianza basada en la confianza se convirtió en una experiencia bilingüe, un sistema de producto y una capa operativa diseñada para seguir aprendiendo después del lanzamiento.";
const ES_OG_ALT = "Caso de estudio de Criar Sin Culpas por LG Studio";

const VOID_TAGS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

const GENERATED_NOTICE = `<!--
  GENERATED FILE — do not edit by hand.
  Source of truth: ../index.html
  Regenerate: npm run sync:csc-es
  Generator: scripts/sync-csc-es.mjs
-->`;

function fail(message) {
  console.error(`[sync-csc-es] FATAL: ${message}`);
  process.exit(1);
}

function decodeAttr(value) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function encodeAttr(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

function parseAttributes(attrStr) {
  const attrs = [];
  const re =
    /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let m;
  while ((m = re.exec(attrStr))) {
    attrs.push({
      name: m[1],
      value: m[2] !== undefined ? m[2] : m[3] !== undefined ? m[3] : m[4],
      quoted: m[2] !== undefined ? '"' : m[3] !== undefined ? "'" : null,
      raw: m[0],
    });
  }
  return attrs;
}

function getAttr(attrs, name) {
  const found = attrs.find((a) => a.name === name);
  return found && found.value !== undefined ? found.value : null;
}

function setAttr(attrs, name, value) {
  const found = attrs.find((a) => a.name === name);
  const quoted = (found && found.quoted) || '"';
  const raw =
    value === undefined || value === null
      ? name
      : `${name}=${quoted}${value}${quoted}`;
  if (found) {
    found.value = value;
    found.raw = raw;
    found.quoted = quoted;
  } else {
    attrs.push({ name, value, quoted, raw });
  }
}

function serializeAttrs(attrs) {
  if (!attrs.length) return "";
  return " " + attrs.map((a) => a.raw).join(" ");
}

function findMatchingClose(html, startIdx, tagName) {
  const openRe = new RegExp(`<${tagName}\\b`, "gi");
  const closeRe = new RegExp(`</${tagName}\\s*>`, "gi");
  let depth = 1;
  let i = startIdx;
  while (i < html.length && depth > 0) {
    openRe.lastIndex = i;
    closeRe.lastIndex = i;
    const openM = openRe.exec(html);
    const closeM = closeRe.exec(html);
    if (!closeM) return -1;
    if (openM && openM.index < closeM.index) {
      // Check self-closing
      const after = html.slice(openM.index, openM.index + 256);
      const tagEnd = after.indexOf(">");
      if (tagEnd !== -1 && after.slice(0, tagEnd + 1).endsWith("/>")) {
        i = openM.index + tagEnd + 1;
        continue;
      }
      depth += 1;
      i = openM.index + openM[0].length;
    } else {
      depth -= 1;
      if (depth === 0) return closeM.index;
      i = closeM.index + closeM[0].length;
    }
  }
  return -1;
}

function cloudinaryLocalized(baseUrl, widths, defaultW) {
  if (!baseUrl || !baseUrl.includes("/upload/")) {
    return { src: baseUrl, srcset: "" };
  }
  const withTx = (w) =>
    baseUrl.replace("/upload/", `/upload/f_auto,q_auto,w_${w}/`);
  const src = withTx(defaultW);
  const srcset = widths.map((w) => `${withTx(w)} ${w}w`).join(",\n                  ");
  return { src, srcset };
}

/**
 * Walk HTML and apply Spanish visible content from data-i18n-es.
 * Preserves both language attributes. Safe for nested HTML in attribute values.
 */
function applySpanishBody(html) {
  const openTagRe =
    /<([a-zA-Z][\w:-]*)((?:\s+[^\s=/>]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*)\s*(\/?)>/g;

  const replacements = [];
  let match;
  let translated = 0;

  while ((match = openTagRe.exec(html))) {
    const [full, tagName, attrStr, selfClose] = match;
    const attrs = parseAttributes(attrStr || "");
    const en = getAttr(attrs, "data-i18n-en");
    const es = getAttr(attrs, "data-i18n-es");
    const i18nAttr = getAttr(attrs, "data-i18n-attr");
    const srcEn = getAttr(attrs, "data-i18n-src-en");
    const srcEs = getAttr(attrs, "data-i18n-src-es");

    if (en === null && es === null && !(srcEn && srcEs)) continue;
    if ((en !== null && es === null) || (es !== null && en === null)) {
      fail(
        `Element <${tagName}> is missing a paired data-i18n-en/es near offset ${match.index}`
      );
    }

    const start = match.index;
    const openEnd = start + full.length;
    const isVoid = VOID_TAGS.has(tagName.toLowerCase()) || selfClose === "/";

    let newOpen = full;
    let newInner = null;
    let closeStart = -1;
    let closeEnd = -1;

    if (srcEn && srcEs) {
      const widths = [900, 1240, 1600, 2000];
      const { src, srcset } = cloudinaryLocalized(srcEs, widths, 1600);
      setAttr(attrs, "src", src);
      if (getAttr(attrs, "srcset") !== null) {
        setAttr(attrs, "srcset", `\n                  ${srcset}\n                `);
      }
      newOpen = `<${tagName}${serializeAttrs(attrs)}${selfClose === "/" ? " /" : ""}>`;
    }

    if (es !== null) {
      const decoded = decodeAttr(es);
      if (i18nAttr) {
        setAttr(attrs, i18nAttr, encodeAttr(decoded) === decoded ? decoded : es);
        // Keep attribute encoding consistent with source style (use raw es value)
        setAttr(attrs, i18nAttr, es);
        newOpen = `<${tagName}${serializeAttrs(attrs)}${selfClose === "/" ? " /" : ""}>`;
      } else if (tagName.toLowerCase() === "img") {
        setAttr(attrs, "alt", es);
        newOpen = `<${tagName}${serializeAttrs(attrs)}${selfClose === "/" ? " /" : ""}>`;
      } else if (tagName.toLowerCase() === "meta") {
        setAttr(attrs, "content", es);
        newOpen = `<${tagName}${serializeAttrs(attrs)}${selfClose === "/" ? " /" : ""}>`;
      } else if (tagName.toLowerCase() === "title") {
        // title content replaced below
        newOpen = `<${tagName}${serializeAttrs(attrs)}>`;
        newInner = decoded;
      } else if (!isVoid) {
        closeStart = findMatchingClose(html, openEnd, tagName);
        if (closeStart < 0) {
          fail(`Could not find closing </${tagName}> for i18n element at ${start}`);
        }
        closeEnd = html.indexOf(">", closeStart) + 1;
        newOpen = `<${tagName}${serializeAttrs(attrs)}>`;
        newInner = decoded;
      } else {
        newOpen = `<${tagName}${serializeAttrs(attrs)}${selfClose === "/" ? " /" : ""}>`;
      }
      translated += 1;
    }

    if (newOpen !== full || newInner !== null) {
      if (newInner !== null && closeStart >= 0) {
        replacements.push({
          start,
          end: closeEnd,
          text: newOpen + newInner + html.slice(closeStart, closeEnd),
        });
      } else if (newInner !== null && tagName.toLowerCase() === "title") {
        const titleClose = html.indexOf("</title>", openEnd);
        if (titleClose < 0) fail("Missing </title>");
        replacements.push({
          start,
          end: titleClose + "</title>".length,
          text: newOpen + newInner + "</title>",
        });
      } else {
        replacements.push({ start, end: openEnd, text: newOpen });
      }
    }
  }

  if (translated < 50) {
    fail(
      `Expected many translated elements; only processed ${translated}. Source may be malformed.`
    );
  }

  // Apply from end to start
  replacements.sort((a, b) => b.start - a.start);
  let out = html;
  for (const r of replacements) {
    out = out.slice(0, r.start) + r.text + out.slice(r.end);
  }
  return { html: out, translated };
}

function extractHeadInner(html) {
  const open = html.match(/<head\b[^>]*>/i);
  const close = html.search(/<\/head>/i);
  if (!open || close < 0) fail("Could not locate <head> in English source");
  return {
    openTag: open[0],
    openEnd: open.index + open[0].length,
    closeStart: close,
    inner: html.slice(open.index + open[0].length, close),
  };
}

function buildSpanishHead() {
  return `
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title data-i18n-en="Criar Sin Culpas · Case Study | LG Studio" data-i18n-es="${ES_TITLE}">${ES_TITLE}</title>
  <meta name="description" content="${ES_DESCRIPTION}" data-i18n-en="How a trusted parenting practice became a bilingual experience, product system, and operating layer built to keep learning after launch." data-i18n-es="${ES_DESCRIPTION}" data-i18n-attr="content" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${ES_URL}" />
  <link rel="alternate" hreflang="en" href="${EN_URL}" />
  <link rel="alternate" hreflang="es" href="${ES_URL}" />
  <link rel="alternate" hreflang="x-default" href="${EN_URL}" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${ES_TITLE}" />
  <meta property="og:description" content="${ES_DESCRIPTION}" />
  <meta property="og:url" content="${ES_URL}" />
  <meta property="og:locale" content="es_ES" />
  <meta property="og:locale:alternate" content="en_US" />
  <meta property="og:image" content="${OG_ES}" />
  <meta property="og:image:secure_url" content="${OG_ES}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:alt" content="${ES_OG_ALT}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${ES_TITLE}" />
  <meta name="twitter:description" content="${ES_DESCRIPTION}" />
  <meta name="twitter:image" content="${OG_ES}" />
  <meta name="twitter:image:alt" content="${ES_OG_ALT}" />
  <link rel="icon" type="image/png" href="/studio/brand-system/assets/monogram.png" />
  <link rel="stylesheet" href="/studio/brand-system/tokens.css" />
<link rel="stylesheet" href="/assets/css/lg-ecosystem-strip.css?v=4" />
  <link rel="stylesheet" href="/studio/css/lg-studio-shell.css?v=4" />
  <link rel="stylesheet" href="/studio/case-studies/criar-sin-culpas/csc-case-v0.css" />
  <link rel="stylesheet" href="/studio/case-studies/criar-sin-culpas/csc-crops.css" />
  <link rel="stylesheet" href="/studio/case-studies/criar-sin-culpas/csc-crops-applied.css" />
  <link rel="stylesheet" href="/studio/case-studies/criar-sin-culpas/csc-mobile-editorial.css" />
  <script src="/studio/case-studies/criar-sin-culpas/csc-image-crops.js" defer></script>
  <script src="/studio/case-studies/criar-sin-culpas/csc-director-bridge.js" defer></script>
  <script defer data-domain="luis-gilberto.com" src="https://plausible.io/js/script.js"></script>
  <style>body { margin: 0; background: var(--csc-page-background, #fffaf7); }</style>
`;
}

function assertEnglishSource(html) {
  const required = [
    ['rel="canonical" href="' + EN_URL + '"', "English canonical"],
    ["csc-case-study-og-1200x630_wj5zyl.png", "English OG image"],
    ['data-csc-locale-routes', "CSC locale routes flag"],
    ['data-i18n-es="Criar Sin Culpas · Caso de estudio | LG Studio"', "Spanish title attribute"],
    ["data-i18n-en=", "English i18n attributes"],
    ["data-i18n-es=", "Spanish i18n attributes"],
  ];
  for (const [needle, label] of required) {
    if (!html.includes(needle)) fail(`English source missing required ${label}: ${needle}`);
  }
  if (html.includes(OG_ES) && html.includes('property="og:image"')) {
    // Ensure EN og:image is not Spanish
    const ogMatch = html.match(/property="og:image"\s+content="([^"]+)"/);
    if (ogMatch && ogMatch[1] === OG_ES) {
      fail("English source og:image incorrectly points at Spanish OG asset");
    }
  }
}

function generate() {
  if (!fs.existsSync(EN_SRC)) fail(`Missing English source: ${EN_SRC}`);
  const enHtml = fs.readFileSync(EN_SRC, "utf8");
  assertEnglishSource(enHtml);

  let html = enHtml;

  // Strip any prior generated notice if regenerating from a mistaken source
  html = html.replace(/^<!--\s*\n\s*GENERATED FILE[\s\S]*?-->\n?/m, "");

  // lang=es
  if (!/^[\s\S]*?<html\b[^>]*>/i.test(html)) fail("Missing <html> root");
  html = html.replace(/<html\b[^>]*>/i, '<html lang="es">');

  // Apply Spanish body/attribute content while preserving dual attributes
  const { html: localized, translated } = applySpanishBody(html);
  html = localized;

  // Replace head with approved Spanish metadata (keeps asset links absolute)
  const head = extractHeadInner(html);
  const spanishHead = buildSpanishHead();
  html =
    html.slice(0, head.openEnd) + spanishHead + html.slice(head.closeStart);

  // Prepend generated notice after doctype
  if (html.startsWith("<!DOCTYPE html>") || html.startsWith("<!doctype html>")) {
    html = html.replace(
      /<!DOCTYPE html>\s*/i,
      `<!DOCTYPE html>\n${GENERATED_NOTICE}\n`
    );
  } else {
    html = `${GENERATED_NOTICE}\n${html}`;
  }

  // Guardrails on output
  if (!html.includes(`rel="canonical" href="${ES_URL}"`)) {
    fail("Generated Spanish shell missing self-referencing canonical");
  }
  if (!html.includes(`property="og:image" content="${OG_ES}"`)) {
    fail("Generated Spanish shell missing Spanish OG image");
  }
  if (html.includes(`property="og:image" content="${OG_EN}"`)) {
    fail("Generated Spanish shell still references English OG image");
  }
  if ((html.match(/property="og:image"\s/g) || []).length !== 1) {
    fail("Generated Spanish shell must have exactly one og:image");
  }
  if ((html.match(/name="twitter:image"\s/g) || []).length !== 1) {
    fail("Generated Spanish shell must have exactly one twitter:image");
  }
  if (!html.includes('lang="es"')) fail('Generated shell missing lang="es"');
  if (!html.includes("GENERATED FILE")) {
    fail("Generated shell missing generation notice");
  }
  if (!html.includes("Caso de estudio")) {
    fail('Generated shell missing "Caso de estudio" terminology');
  }
  // Visible Spanish sample from body (not only head)
  if (!html.includes("La confianza ya existía")) {
    fail(
      "Generated shell body does not appear to contain Spanish visible content"
    );
  }

  fs.mkdirSync(ES_DIR, { recursive: true });
  fs.writeFileSync(ES_OUT, html, "utf8");
  console.log(
    `[sync-csc-es] Wrote ${path.relative(ROOT, ES_OUT)} (${translated} i18n elements localized)`
  );
  return html;
}

function main() {
  const check = process.argv.includes("--check");
  const first = generate();
  if (check) {
    const second = generate();
    if (first !== second) {
      fail("Generator is not idempotent — second run produced a diff");
    }
    console.log("[sync-csc-es] Idempotency check passed");
  }
}

main();
