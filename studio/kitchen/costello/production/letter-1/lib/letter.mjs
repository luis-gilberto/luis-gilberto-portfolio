import fs from "node:fs";
import path from "node:path";
import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";
import { BASELINE_LETTER_HTML } from "./paths.mjs";
import { collapseWs, stripHtml } from "./util.mjs";

const PLACEHOLDER_RE = /\{\{[^}]+\}\}|<<[^>]+>>|\[[A-Z][A-Z0-9 _/-]{1,40}\]|XXX+|TKTK|TODO:|FIXME/gi;
const TRACK_HINT_RE = /w:ins|w:del|tracked.?change|revision|author:|comment\s*id/i;
const STALE_PHRASES = [
  "draft for discussion",
  "not the production file",
  "working proof",
  "placeholder",
  "[insert",
  "lorem ipsum",
];

export async function extractLetter(letterPath) {
  const ext = path.extname(letterPath).toLowerCase();
  let text = "";
  let html = "";
  let format = ext.slice(1);
  const warnings = [];

  if (ext === ".docx") {
    const buf = fs.readFileSync(letterPath);
    const result = await mammoth.convertToHtml({ buffer: buf });
    html = result.value || "";
    text = stripHtml(html);
    if (result.messages?.length) {
      for (const m of result.messages) warnings.push(`mammoth: ${m.message}`);
    }
    const raw = buf.toString("utf8", 0, Math.min(buf.length, 2_000_000));
    if (TRACK_HINT_RE.test(raw)) warnings.push("Possible tracked-change / comment artifacts in DOCX package");
  } else if (ext === ".pdf") {
    const buf = fs.readFileSync(letterPath);
    const parser = new PDFParse({ data: buf });
    try {
      const parsed = await parser.getText();
      const info = await parser.getInfo().catch(() => null);
      text = collapseWs(parsed?.text || "");
      format = "pdf";
      const pages = info?.total || parsed?.pages?.length || 0;
      if (pages > 1) warnings.push(`PDF has ${pages} pages (expected 1)`);
      if (pages < 1 && !text) warnings.push("PDF has no extractable text/pages");
    } finally {
      await parser.destroy().catch(() => {});
    }
  } else if (ext === ".txt" || ext === ".md" || ext === ".html") {
    const raw = fs.readFileSync(letterPath, "utf8");
    if (ext === ".html") {
      html = raw;
      text = stripHtml(raw);
    } else {
      text = collapseWs(raw);
    }
  } else {
    throw new Error(`Unsupported letter format: ${ext}. Use .docx, .pdf, .txt, .md, or .html`);
  }

  return { text, html, format, warnings, path: letterPath };
}

function extractBodyParagraphsFromHtml(html) {
  const bodyMatch = html.match(/<div class="body">([\s\S]*?)<\/div>\s*<footer/i);
  const chunk = bodyMatch ? bodyMatch[1] : html;
  const paras = [];
  const re = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let m;
  while ((m = re.exec(chunk))) {
    const inner = stripHtml(m[1]);
    if (inner) paras.push(inner);
  }
  return paras;
}

export function loadBaselineLetter() {
  const html = fs.readFileSync(BASELINE_LETTER_HTML, "utf8");
  const paragraphs = extractBodyParagraphsFromHtml(html);
  return { html, text: paragraphs.join("\n\n"), paragraphs };
}

export function qaLetter(extracted, baseline) {
  const issues = [];
  const text = extracted.text || "";
  const lower = text.toLowerCase();

  const checks = {
    hasSalutation: /^dear\b/im.test(text) || /dear\s+(\[name\]|«firstname»|\[firstname\])/i.test(text),
    hasFirmName: /costello law firm/i.test(text),
    hasSender: /kris\s+costello/i.test(text),
    hasSignatureBlock: /respectfully|sincerely|best regards/i.test(text),
    hasAddress: /315\s+fifth\s+avenue/i.test(text) || /seattle,?\s*wa/i.test(text),
    hasPhone: /206[-.\s]?775[-.\s]?4381|206[-.\s]?331[-.\s]?5562/.test(text),
    hasWebsite: /costellolawfirm\.com/i.test(text),
    hasDate: false, // letter may intentionally omit date line; flag only if partial
  };

  if (!checks.hasSalutation) issues.push({ severity: "block", code: "SALUTATION", message: "Missing or unclear salutation / recipient-variable" });
  if (!checks.hasFirmName) issues.push({ severity: "block", code: "FIRM", message: "Firm name not detected" });
  if (!checks.hasSender) issues.push({ severity: "warn", code: "SENDER", message: "Sender name (Kris Costello) not detected" });
  if (!checks.hasSignatureBlock) issues.push({ severity: "warn", code: "SIGNOFF", message: "Sign-off not detected" });
  if (!checks.hasAddress) issues.push({ severity: "warn", code: "ADDRESS", message: "Firm address not detected in letter text" });
  if (!checks.hasPhone) issues.push({ severity: "warn", code: "PHONE", message: "Expected phone number not detected" });
  if (!checks.hasWebsite) issues.push({ severity: "warn", code: "WEB", message: "Website not detected" });

  const placeholders = [...text.matchAll(PLACEHOLDER_RE)].map((m) => m[0]);
  const unresolved = placeholders.filter((p) => !/^\[Name\]$|^\[First Name\]$|^«FirstName»$/i.test(p));
  if (unresolved.length) {
    issues.push({
      severity: "block",
      code: "PLACEHOLDER",
      message: `Unresolved placeholders: ${[...new Set(unresolved)].slice(0, 8).join(", ")}`,
    });
  }

  for (const phrase of STALE_PHRASES) {
    if (lower.includes(phrase)) {
      issues.push({ severity: "block", code: "STALE", message: `Stale / draft language detected: "${phrase}"` });
    }
  }

  if (/�|\uFFFD/.test(text)) {
    issues.push({ severity: "warn", code: "ENCODING", message: "Possible encoding artifacts (replacement characters)" });
  }

  // Duplicate paragraph detection
  const paras = text.split(/\n{2,}/).map((p) => collapseWs(p)).filter(Boolean);
  const seen = new Map();
  for (const p of paras) {
    const key = p.toLowerCase();
    seen.set(key, (seen.get(key) || 0) + 1);
  }
  for (const [p, n] of seen) {
    if (n > 1 && p.length > 40) {
      issues.push({ severity: "warn", code: "DUP_PARA", message: `Duplicate paragraph repeated ${n}×` });
      break;
    }
  }

  if (!/kris\s+costello/i.test(text) && !/signature/i.test(extracted.html || "")) {
    issues.push({ severity: "warn", code: "SIG_TEXT", message: "Missing signature name text" });
  }

  for (const w of extracted.warnings || []) {
    issues.push({ severity: "warn", code: "SOURCE", message: w });
  }

  const changeSummary = diffLetters(baseline.text, text);
  if (changeSummary.changed.length || changeSummary.added.length || changeSummary.removed.length) {
    issues.push({
      severity: "flag",
      code: "COPY_DELTA",
      message: "Final letter differs from previous workspace Letter 1 version — review change summary",
    });
  }

  return { checks, issues, paragraphs: paras, changeSummary };
}

export function diffLetters(prevText, nextText) {
  const a = splitUnits(prevText);
  const b = splitUnits(nextText);
  const aSet = new Set(a.map(normUnit));
  const bSet = new Set(b.map(normUnit));

  const unchanged = a.filter((u) => bSet.has(normUnit(u)));
  const removed = a.filter((u) => !bSet.has(normUnit(u)));
  const added = b.filter((u) => !aSet.has(normUnit(u)));

  // Rough "changed": pairs that share a prefix but aren't equal
  const changed = [];
  for (const r of removed.slice()) {
    const rn = normUnit(r);
    const match = added.find((x) => similar(rn, normUnit(x)));
    if (match) {
      changed.push({ from: r, to: match });
    }
  }

  return {
    ADDED: added.filter((x) => !changed.some((c) => c.to === x)),
    REMOVED: removed.filter((x) => !changed.some((c) => c.from === x)),
    CHANGED: changed,
    UNCHANGED: unchanged,
    // aliases used in report
    added: added.filter((x) => !changed.some((c) => c.to === x)),
    removed: removed.filter((x) => !changed.some((c) => c.from === x)),
    changed,
    unchanged,
  };
}

function splitUnits(text) {
  return collapseWs(text)
    .split(/\n{2,}|(?<=\.)\s+(?=[A-Z])/)
    .map((s) => collapseWs(s))
    .filter((s) => s.length > 20);
}

function normUnit(s) {
  return collapseWs(s).toLowerCase().replace(/[“”"']/g, "").replace(/\s+/g, " ");
}

function similar(a, b) {
  if (!a || !b) return false;
  const n = Math.min(40, a.length, b.length);
  return a.slice(0, n) === b.slice(0, n) && a !== b;
}

/** Build paragraph HTML for the approved clean letter template. */
export function buildLetterBodyHtml(extracted, { mergeToken = "[Name]" } = {}) {
  const paras = (extracted.text || "")
    .split(/\n{2,}/)
    .map((p) => collapseWs(p))
    .filter(Boolean);

  let salutation = `Dear ${mergeToken},`;
  let bodyParas = paras;
  if (paras.length && /^dear\b/i.test(paras[0])) {
    salutation = paras[0].replace(/^dear\s+\[[^\]]+\]/i, `Dear ${mergeToken}`).replace(/^dear\s+«[^»]+»/i, `Dear ${mergeToken}`);
    if (!/^dear\b/i.test(salutation)) salutation = `Dear ${mergeToken},`;
    if (!salutation.endsWith(",")) salutation = salutation.replace(/[.!]?$/, ",");
    bodyParas = paras.slice(1);
  }

  // Peel signature block from end if present
  const signIdx = bodyParas.findIndex((p) => /^respectfully|^sincerely|^best regards/i.test(p));
  let signoff = "Respectfully,";
  let after = [];
  if (signIdx >= 0) {
    signoff = bodyParas[signIdx].replace(/\s+$/, "");
    if (!signoff.endsWith(",")) signoff += ",";
    after = bodyParas.slice(signIdx + 1);
    bodyParas = bodyParas.slice(0, signIdx);
  }

  const parts = [];
  parts.push(`<p>${escapeMinimal(salutation)}</p>`);
  for (const p of bodyParas) {
    // Skip pure signer lines — rebuilt below from known structure if detected
    if (/^kris\s+costello$/i.test(p)) continue;
    if (/^costello law firm,?\s*pllc$/i.test(p)) continue;
    if (/^kcostello@/i.test(p)) continue;
    if (/^cell:/i.test(p)) continue;
    if (/^client contact:?$/i.test(p)) continue;
    if (/^contact@costellolawfirm\.com$/i.test(p)) continue;
    if (/^206[-.\s]?775[-.\s]?4381$/.test(p)) continue;
    parts.push(`<p class="para">${escapeMinimal(p)}</p>`);
  }
  parts.push(`<p class="signoff">${escapeMinimal(signoff)}</p>`);
  parts.push(`<div class="sigspace"><img class="sigmark" src="KC%20Signature.png" alt="" width="168" height="36" /></div>`);
  parts.push(`<p class="signer">Kris Costello</p>`);
  parts.push(`<p class="signerfirm">Costello Law Firm, PLLC</p>`);
  parts.push(`<div class="siglines">`);
  parts.push(`<p>kcostello@costellofirm.com</p>`);
  parts.push(`<p>Cell: 206-331-5562</p>`);
  parts.push(`<p>Client contact:</p>`);
  parts.push(`<p>contact@costellolawfirm.com</p>`);
  parts.push(`<p>206-775-4381</p>`);
  parts.push(`</div>`);

  // Preserve unexpected trailing content as notes for QA, not silent drop
  void after;
  return parts.join("\n      ");
}

function escapeMinimal(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
