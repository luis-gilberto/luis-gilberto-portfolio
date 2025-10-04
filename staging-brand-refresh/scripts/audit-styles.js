/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const REPO_ROOT = process.cwd();
const IGNORE_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.next', '.output', '.vercel', '.cache', '.DS_Store']);

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (IGNORE_DIRS.has(entry.name)) continue;
    if (entry.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

function isHtml(fp) { return /\.(html?)$/i.test(fp); }

function readSafe(fp) {
  try { return fs.readFileSync(fp, 'utf8'); }
  catch { return ''; }
}

function extractStyles(html) {
  const out = [];
  const re = /<link\b[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi;
  let m;
  while ((m = re.exec(html))) {
    out.push(m[1]);
  }
  return out;
}

function scoreContactCandidate(fp, html) {
  let score = 0;
  if (/(^|\/)contact(\/|\\|\.|$)/i.test(fp)) score += 3;
  if (/<form\b/i.test(html)) score += 2;
  if (/name=["']email["']/i.test(html)) score += 1;
  if (/data-contact-headline|Start the conversation/i.test(html)) score += 1;
  return score;
}

function scoreImcCandidate(fp, html) {
  let score = 0;
  if (/(^|\/)IMCServices(\/|\\|\.|$)/i.test(fp)) score += 3;
  if (/Start the conversation/i.test(html)) score += 1;
  if (/IMC Services/i.test(html)) score += 1;
  return score;
}

function pickBest(cands, scorer) {
  let best = null, bestScore = -1;
  for (const fp of cands) {
    const html = readSafe(fp);
    const s = scorer(fp, html);
    if (s > bestScore) { best = { fp, html, score: s }; bestScore = s; }
  }
  return best;
}

function uniq(arr) { return Array.from(new Set(arr)); }
function basenameNoQuery(p) { return p.split('?')[0]; }

(function main(){
  const all = walk(REPO_ROOT);
  const htmls = all.filter(isHtml);

  const contactCands = htmls.filter(fp => /contact/i.test(fp));
  const imcCands = htmls.filter(fp => /IMCServices/i.test(fp));

  const bestContact = pickBest(contactCands, scoreContactCandidate);
  const bestImc = pickBest(imcCands, scoreImcCandidate);

  const contactFile = bestContact ? path.relative(REPO_ROOT, bestContact.fp) : null;
  const imcFile = bestImc ? path.relative(REPO_ROOT, bestImc.fp) : null;

  const contactStyles = bestContact ? extractStyles(bestContact.html).map(basenameNoQuery) : [];
  const imcStyles = bestImc ? extractStyles(bestImc.html).map(basenameNoQuery) : [];

  const setContact = new Set(contactStyles);
  const setImc = new Set(imcStyles);
  const shared = contactStyles.filter(s => setImc.has(s));
  const contactOnly = contactStyles.filter(s => !setImc.has(s));
  const imcOnly = imcStyles.filter(s => !setContact.has(s));

  const result = {
    contact: { file: contactFile, styles: contactStyles },
    imc: { file: imcFile, styles: imcStyles },
    shared: uniq(shared),
    unique: { contactOnly: uniq(contactOnly), imcOnly: uniq(imcOnly) }
  };

  // Human-readable
  console.log('=== Stylesheet Audit Summary ===');
  console.log('Contact page file:', contactFile || '(not found)');
  console.log('Contact styles (load order):', contactStyles.length ? contactStyles.join('  ->  ') : '(none)');
  console.log('IMC Services file:', imcFile || '(not found)');
  console.log('IMC Services styles (load order):', imcStyles.length ? imcStyles.join('  ->  ') : '(none)');
  console.log('Shared styles:', result.shared.length ? result.shared.join(', ') : '(none)');
  console.log('Contact-only:', result.unique.contactOnly.length ? result.unique.contactOnly.join(', ') : '(none)');
  console.log('IMC-only:', result.unique.imcOnly.length ? result.unique.imcOnly.join(', ') : '(none)');
  console.log('\nJSON:\n' + JSON.stringify(result, null, 2));
})();