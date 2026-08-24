#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const SOURCE = path.resolve("studio/case-studies/criar-sin-culpas/index.html");

function stripHeadlinePeriods(text) {
  if (!text) return text;
  return text
    .replace(/\.\s*<br\s*\/?>/gi, "<br />")
    .replace(/\.\s*$/g, "")
    .replace(/\.\s+(?=[A-ZÁÉÍÓÚÑ¿])/g, "<br />")
    .replace(/\.(?=<)/g, "");
}

function processHtml(html) {
  const headlineTag =
    /<(h[1-3]|p)(\s[^>]*class="[^"]*(?:start-card__v|editorial-peak|product-close__title|csc-close-cta__title|behavior-ledger__title|h-lead|h-mid|hero__h1)[^"]*"[^>]*)>([\s\S]*?)<\/\1>/gi;

  return html.replace(headlineTag, (full, tag, attrs, inner) => {
    const nextAttrs = attrs.replace(
      /\s(data-i18n-(?:en|es))="([^"]*)"/gi,
      (_m, attr, val) => ` ${attr}="${stripHeadlinePeriods(val)}"`
    );

    const trimmed = inner.trim();
    const stripped = stripHeadlinePeriods(trimmed);
    const nextInner = stripped === trimmed ? inner : inner.replace(trimmed, stripped);

    return `<${tag}${nextAttrs}>${nextInner}</${tag}>`;
  });
}

const html = fs.readFileSync(SOURCE, "utf8");
const next = processHtml(html);
fs.writeFileSync(SOURCE, next);
console.log("[strip-csc-headline-periods] Updated", SOURCE);
