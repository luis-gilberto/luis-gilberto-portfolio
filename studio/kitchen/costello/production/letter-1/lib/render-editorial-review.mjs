/**
 * Build Letter 01 client-review HTML + PDF from the canonical inbox proof.
 * Does NOT write ready/Costello_Letter_1_PRINT_READY.pdf.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";
import { LETTER1_ROOT, SIGNATURE_ASSET, TEMPLATES_DIR } from "./paths.mjs";
import { ensureDir, copyFile, escHtml } from "./util.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INBOX = path.join(
  LETTER1_ROOT,
  "inbox/Costello_Letter_1_FINAL_EDITORIAL_PROOF_2026-09-14.txt"
);
const REVIEW_DIR = path.join(LETTER1_ROOT, "review");
const REVIEW_HTML = path.join(REVIEW_DIR, "editorial-proof-2026-09-14.html");
const REVIEW_PDF = path.join(
  REVIEW_DIR,
  "Costello_Letter_1_EDITORIAL_PROOF_2026-09-14.pdf"
);
const WORKSPACE_PDF = path.resolve(
  LETTER1_ROOT,
  "../../../costello-review/Costello_Letter_1_EDITORIAL_PROOF_2026-09-14.pdf"
);

const BODY_PARAS = [
  "Costello Law Firm is proud to announce the expansion of its boutique defense litigation practice and the addition of Attorney Wendy Harper and Chief of Staff Nari Weaver. These additions complement Costello Law Firm’s decades of trial, white-collar, regulatory, and complex litigation experience, including parallel proceedings. We defend clients facing serious federal charges and Washington State Attorney General investigations.",
  "We welcome the opportunity to assist when a business owner or professional faces a government investigation, regulatory or professional discipline matter, or when civil litigation develops alongside enforcement proceedings. In these matters, we can serve as lead counsel or work alongside existing civil counsel to address government investigations, white-collar defense, regulatory matters, or professional licensing issues while helping coordinate the broader strategy.",
  "Wendy Harper clerked for the Honorable D. Duff McKee in Boise, Idaho, served as a prosecutor in the Seattle City Attorney’s Criminal Office, and has extensive trial experience and many years defending individuals in criminal matters. She also practiced at national law firms and worked at the Federal Civil Rights Clinic for thirteen years.",
  "Nari Weaver serves as Chief of Staff, leading firm operations, strategic initiatives, communications, and organizational development. With more than 15 years of experience spanning communications, marketing, program management, nonprofit leadership, and operations, Nari works closely with firm leadership to translate strategy into execution and strengthen the systems and infrastructure supporting the firm’s attorneys, clients, and continued growth.",
  "Together, Wendy and Nari strengthen Costello Law Firm’s ability to provide strategic representation while preserving the personal attention and senior-level advocacy that define our practice.",
];

function loadCanonical() {
  const raw = fs.readFileSync(INBOX, "utf8").replace(/^\uFEFF/, "").trim();
  // Normalize curly apostrophe variants for comparison
  return raw;
}

function buildBodyHtml() {
  const parts = [];
  parts.push(`<p>Dear [Name],</p>`);
  for (const p of BODY_PARAS) {
    parts.push(`<p class="para">${escHtml(p)}</p>`);
  }
  parts.push(`<p class="signoff">Respectfully,</p>`);
  parts.push(
    `<div class="sigspace"><img class="sigmark" src="KC%20Signature.png" alt="" width="168" height="36" /></div>`
  );
  parts.push(`<p class="signer">Kris Costello</p>`);
  parts.push(`<p class="signerfirm">Costello Law Firm, PLLC</p>`);
  parts.push(`<div class="siglines">`);
  parts.push(`<p>kcostello@costellofirm.com</p>`);
  parts.push(`<p>Cell: 206-331-5562</p>`);
  parts.push(`<p>Client contact:</p>`);
  parts.push(`<p>contact@costellolawfirm.com</p>`);
  parts.push(`<p>206-775-4381</p>`);
  parts.push(`</div>`);
  return parts.join("\n      ");
}

function assertCanonicalMatch(inboxText) {
  const expected = [
    "Dear [Name],",
    ...BODY_PARAS,
    "Respectfully,",
    "Kris Costello",
    "Costello Law Firm, PLLC",
  ].join("\n\n");
  const norm = (s) =>
    s
      .replace(/\r\n/g, "\n")
      .replace(/['']/g, "'")
      .replace(/[""]/g, '"')
      .replace(/\s+\n/g, "\n")
      .trim();
  if (norm(inboxText) !== norm(expected)) {
    // Soft check: ensure each body para present and no stale CTA
    for (const p of BODY_PARAS) {
      if (!inboxText.includes(p.replace(/'/g, "'")) && !norm(inboxText).includes(norm(p))) {
        throw new Error("Canonical inbox proof missing expected paragraph");
      }
    }
    if (/we'?re the call|I would welcome the call|please reach out/i.test(inboxText)) {
      throw new Error("Stale CTA detected in canonical proof");
    }
  }
  if (/we'?re the call|I would welcome the call/i.test(inboxText)) {
    throw new Error("Stale CTA in inbox proof");
  }
}

export async function renderEditorialReviewPdf() {
  ensureDir(REVIEW_DIR);
  const inboxText = loadCanonical();
  assertCanonicalMatch(inboxText);

  let html = fs.readFileSync(path.join(TEMPLATES_DIR, "letter-print.html"), "utf8");
  html = html
    .replace(
      "<title>Costello Letter 1 · Print Ready</title>",
      "<title>Costello Letter 1 · Editorial Proof · 14 September 2026</title>"
    )
    .replace(
      'aria-label="Costello Letter 1 editorial proof"',
      'aria-label="Costello Letter 1 LG Studio editorial proof"'
    );

  // Subtle review banner only — do not override body typography (template owns rhythm).
  // Check for the element, not the CSS class name (template stylesheet already mentions it).
  if (!html.includes('class="review-banner"')) {
    html = html.replace(
      '<header class="letterhead">',
      `<div class="review-banner">LG STUDIO EDITORIAL PROOF · 14 SEPTEMBER 2026 · AWAITING CLIENT APPROVAL</div>
    <header class="letterhead">`
    );
  }

  if (!html.includes("<!--LETTER_BODY-->")) {
    throw new Error("letter-print.html missing <!--LETTER_BODY-->");
  }
  html = html.replace("<!--LETTER_BODY-->", buildBodyHtml());
  fs.writeFileSync(REVIEW_HTML, html, "utf8");

  if (fs.existsSync(SIGNATURE_ASSET)) {
    copyFile(SIGNATURE_ASSET, path.join(REVIEW_DIR, "KC Signature.png"));
  }

  // Guard: never touch print-ready
  const printReady = path.join(LETTER1_ROOT, "ready/Costello_Letter_1_PRINT_READY.pdf");
  const hadPrintReady = fs.existsSync(printReady);

  const browser = await puppeteer.launch({
    headless: true,
    channel: "chrome",
    args: ["--no-sandbox", "--font-render-hinting=none"],
  });
  let pageCount = 1;
  try {
    const page = await browser.newPage();
    await page.goto("file:///" + REVIEW_HTML.replace(/\\/g, "/"), {
      waitUntil: "networkidle0",
    });
    try {
      await page.evaluateHandle("document.fonts.ready");
    } catch {
      /* ignore */
    }
    await page.pdf({
      path: REVIEW_PDF,
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
      width: "8.5in",
      height: "11in",
    });

    // Visual QA: screenshot the rendered HTML at letter size
    const shotPath = path.join(REVIEW_DIR, "Costello_Letter_1_EDITORIAL_PROOF_2026-09-14.png");
    await page.setViewport({ width: 816, height: 1056, deviceScaleFactor: 2 });
    await page.screenshot({ path: shotPath, fullPage: false, type: "png" });
    console.log("screenshot:", shotPath);

    const pdfLatin = fs.readFileSync(REVIEW_PDF).toString("latin1");
    const countMatch = pdfLatin.match(/\/Type\s*\/Pages\b[^]*?\/Count\s+(\d+)/);
    if (countMatch) {
      pageCount = Number(countMatch[1]);
    } else {
      pageCount = (pdfLatin.match(/\/Type\s*\/Page\b/g) || []).length || 1;
    }
  } finally {
    await browser.close();
  }

  copyFile(REVIEW_PDF, WORKSPACE_PDF);

  if (!hadPrintReady && fs.existsSync(printReady)) {
    fs.unlinkSync(printReady);
    throw new Error("Refusing to leave a newly created PRINT_READY.pdf from review render");
  }

  return {
    reviewPdf: REVIEW_PDF,
    workspacePdf: WORKSPACE_PDF,
    reviewHtml: REVIEW_HTML,
    pageCount,
  };
}

const isMain =
  process.argv[1] &&
  path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1]);

if (isMain) {
  renderEditorialReviewPdf()
    .then((r) => {
      console.log("review PDF:", r.reviewPdf);
      console.log("workspace PDF:", r.workspacePdf);
      console.log("pages:", r.pageCount);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
