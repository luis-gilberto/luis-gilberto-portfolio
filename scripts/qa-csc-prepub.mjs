#!/usr/bin/env node
/**
 * Permanent CSC prepublication metadata / sitemap / generator assertions.
 * Usage: node scripts/qa-csc-prepub.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const cscDir = path.join(root, "studio/case-studies/criar-sin-culpas");
const enPath = path.join(cscDir, "index.html");
const esPath = path.join(cscDir, "es/index.html");
const enHtml = fs.readFileSync(enPath, "utf8");
const esHtml = fs.readFileSync(esPath, "utf8");
const sm = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
const edit = fs.readFileSync(
  path.join(root, "studio/case-studies/criar-sin-culpas-edit/index.html"),
  "utf8"
);
const handoffProd = fs.readFileSync(
  path.join(cscDir, "csc-handoff/page/index.production.html"),
  "utf8"
);

const EN_URL =
  "https://www.luis-gilberto.com/studio/case-studies/criar-sin-culpas/";
const ES_URL =
  "https://www.luis-gilberto.com/studio/case-studies/criar-sin-culpas/es/";
const OG_EN =
  "https://res.cloudinary.com/dogtoagya/image/upload/v1787546075/csc-case-study-og-1200x630_wj5zyl.png";
const OG_ES =
  "https://res.cloudinary.com/dogtoagya/image/upload/v1787548229/csc-case-study-og-1200x630_ES_uhncs1.png";

function countExact(html, re) {
  return (html.match(re) || []).length;
}

function hreflangOk(html) {
  return (
    html.includes(`hreflang="en" href="${EN_URL}"`) &&
    html.includes(`hreflang="es" href="${ES_URL}"`) &&
    html.includes(`hreflang="x-default" href="${EN_URL}"`)
  );
}

const checks = [
  ["EN html lang", /<html\b[^>]*\blang="en"/i.test(enHtml)],
  ["EN canonical", enHtml.includes(`rel="canonical" href="${EN_URL}"`)],
  ["EN robots index", enHtml.includes('content="index, follow"')],
  ["EN og:url", enHtml.includes(`og:url" content="${EN_URL}"`)],
  ["EN og:locale", enHtml.includes('og:locale" content="en_US"')],
  ["EN og:locale:alternate", enHtml.includes('og:locale:alternate" content="es_ES"')],
  ["EN og:image", enHtml.includes(`property="og:image" content="${OG_EN}"`)],
  ["EN twitter:image", enHtml.includes(`name="twitter:image" content="${OG_EN}"`)],
  ["EN single og:image", countExact(enHtml, /property="og:image"\s/g) === 1],
  ["EN single twitter:image", countExact(enHtml, /name="twitter:image"\s/g) === 1],
  ["EN no Spanish OG", !enHtml.includes(OG_ES)],
  ["EN hreflang reciprocal", hreflangOk(enHtml)],
  ["EN visible English hero", enHtml.includes("The trust was already there<br />The system wasn't")],
  ["EN locale routes flag", enHtml.includes("data-csc-locale-routes")],
  [
    "EN Caso terminology in data-i18n-es title",
    enHtml.includes(
      'data-i18n-es="Criar Sin Culpas · Caso de estudio | LG Studio"'
    ),
  ],

  ["ES generated notice", esHtml.includes("GENERATED FILE")],
  ["ES html lang", /<html\b[^>]*\blang="es"/i.test(esHtml)],
  ["ES canonical", esHtml.includes(`rel="canonical" href="${ES_URL}"`)],
  ["ES robots index", esHtml.includes('content="index, follow"')],
  ["ES og:url", esHtml.includes(`og:url" content="${ES_URL}"`)],
  ["ES og:locale", esHtml.includes('og:locale" content="es_ES"')],
  ["ES og:locale:alternate", esHtml.includes('og:locale:alternate" content="en_US"')],
  [
    "ES title",
    esHtml.includes(">Criar Sin Culpas · Caso de estudio | LG Studio</title>") &&
      esHtml.includes(
        'data-i18n-es="Criar Sin Culpas · Caso de estudio | LG Studio"'
      ),
  ],
  ["ES description", esHtml.includes("basada en la confianza")],
  ["ES og:image", esHtml.includes(`property="og:image" content="${OG_ES}"`)],
  ["ES twitter:image", esHtml.includes(`name="twitter:image" content="${OG_ES}"`)],
  ["ES single og:image", countExact(esHtml, /property="og:image"\s/g) === 1],
  ["ES single twitter:image", countExact(esHtml, /name="twitter:image"\s/g) === 1],
  ["ES no English OG", !esHtml.includes(OG_EN)],
  ["ES hreflang reciprocal", hreflangOk(esHtml)],
  ["ES visible Spanish hero", esHtml.includes("La confianza ya existía")],
  [
    "ES retains data-i18n-en",
    esHtml.includes('data-i18n-en="The trust was already there<br />The system wasn\'t"'),
  ],
  [
    "ES headlines without terminal periods",
    !esHtml.includes("Faltaba estructura.") &&
      !esHtml.includes("El sistema, no.") &&
      !esHtml.includes("todavía no.</p>"),
  ],
  ["ES CTA SIGUIENTE", esHtml.includes(">SIGUIENTE</p>")],
  [
    "ES Caso de estudio terminology",
    esHtml.includes("Caso de estudio") && !esHtml.includes("Estudio de Caso"),
  ],

  ["EN single fetchpriority=high", countExact(enHtml, /fetchpriority="high"/g) === 1],
  ["sitemap EN CSC", sm.includes(`<loc>${EN_URL}</loc>`)],
  ["sitemap ES CSC", sm.includes(`<loc>${ES_URL}</loc>`)],
  ["sitemap xmlns:xhtml", sm.includes('xmlns:xhtml="http://www.w3.org/1999/xhtml"')],
  ["sitemap hreflang en", sm.includes(`hreflang="en" href="${EN_URL}"`)],
  ["sitemap hreflang es", sm.includes(`hreflang="es" href="${ES_URL}"`)],
  ["sitemap hreflang x-default", sm.includes(`hreflang="x-default" href="${EN_URL}"`)],
  ["sitemap excludes edit", !sm.includes("criar-sin-culpas-edit")],
  ["sitemap excludes archive", !sm.includes("criar-sin-culpas-archive")],
  ["edit noindex", edit.includes("noindex, nofollow")],
  ["handoff production noindex", handoffProd.includes("noindex, nofollow")],
  ["no placeholders", !enHtml.includes("[RESOLVED") && !esHtml.includes("[RESOLVED")],
];

let fail = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? "PASS" : "FAIL"}: ${name}`);
  if (!ok) fail += 1;
}

const before = fs.readFileSync(esPath, "utf8");
execFileSync("node", ["scripts/sync-csc-es.mjs"], {
  cwd: root,
  stdio: "inherit",
});
const after = fs.readFileSync(esPath, "utf8");
const idempotent = before === after;
console.log(`${idempotent ? "PASS" : "FAIL"}: generator idempotent (no diff)`);
if (!idempotent) fail += 1;

process.exit(fail ? 1 : 0);
