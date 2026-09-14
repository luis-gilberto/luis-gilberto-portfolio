import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer";
import { PRINT_READY_NAME, READY_DIR, SIGNATURE_ASSET, TEMPLATES_DIR } from "./paths.mjs";
import { buildLetterBodyHtml } from "./letter.mjs";
import { copyFile, ensureDir, escHtml } from "./util.mjs";

/**
 * If source is already PDF: preserve original + copy as print-ready (no retypeset).
 * If DOCX/text: render via approved letter HTML template + Puppeteer.
 */
export async function producePrintReadyPdf({ letterPath, extracted, letterQa, outDir = READY_DIR }) {
  ensureDir(outDir);
  const dest = path.join(outDir, PRINT_READY_NAME);
  const sourceCopyDir = path.join(path.dirname(outDir), "source");
  ensureDir(sourceCopyDir);
  const sourceDest = path.join(sourceCopyDir, "ORIGINAL_LETTER" + path.extname(letterPath));
  copyFile(letterPath, sourceDest);

  const ext = path.extname(letterPath).toLowerCase();
  const notes = [];

  if (ext === ".pdf") {
    copyFile(letterPath, dest);
    notes.push("Source PDF preserved as print-ready without re-typesetting");
    // Light structural check via file size / existence
    const size = fs.statSync(dest).size;
    if (size < 5_000) {
      letterQa.issues.push({ severity: "block", code: "PDF_TINY", message: "Print-ready PDF is unexpectedly small" });
    }
    return { path: dest, method: "copy-pdf", notes, sourceDest };
  }

  // DOCX / text / html → HTML template → PDF
  const templatePath = path.join(TEMPLATES_DIR, "letter-print.html");
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Missing print template: ${templatePath}`);
  }
  let html = fs.readFileSync(templatePath, "utf8");
  const body = buildLetterBodyHtml(extracted, { mergeToken: "[Name]" });
  if (!html.includes("<!--LETTER_BODY-->")) {
    throw new Error("letter-print.html missing <!--LETTER_BODY--> marker");
  }
  html = html.replace("<!--LETTER_BODY-->", body);

  // Ensure signature resolves via file:// — copy beside rendered html
  const renderDir = path.join(path.dirname(outDir), "runs", "_render");
  ensureDir(renderDir);
  const htmlOut = path.join(renderDir, "letter-print-render.html");
  fs.writeFileSync(htmlOut, html, "utf8");
  if (fs.existsSync(SIGNATURE_ASSET)) {
    copyFile(SIGNATURE_ASSET, path.join(renderDir, "KC Signature.png"));
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--font-render-hinting=none"],
  });
  try {
    const page = await browser.newPage();
    await page.goto("file:///" + htmlOut.replace(/\\/g, "/"), { waitUntil: "networkidle0" });
    try {
      await page.evaluateHandle("document.fonts.ready");
    } catch {
      /* ignore */
    }
    await page.pdf({
      path: dest,
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
      width: "8.5in",
      height: "11in",
    });
  } finally {
    await browser.close();
  }

  notes.push("Generated PDF from approved letter HTML template via Puppeteer (RGB). Connect may require CMYK conversion.");
  notes.push("Client original preserved separately under source/");

  // Page count check: puppeteer doesn't easily give pages; warn if letterQa flagged multi-page from source
  void escHtml;
  return { path: dest, method: "html-puppeteer", notes, sourceDest, renderHtml: htmlOut };
}
