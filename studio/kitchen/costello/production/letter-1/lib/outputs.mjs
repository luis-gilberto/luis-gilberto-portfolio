import fs from "node:fs";
import path from "node:path";
import ExcelJS from "exceljs";
import AdmZip from "adm-zip";
import {
  CONNECT_COLUMNS,
  MAILING_READY_NAME,
  PRINT_READY_NAME,
  QA_DIR,
  QA_REPORT_NAME,
  QA_WORKBOOK_NAME,
  READY_DIR,
  VENDOR_DIR,
  VENDOR_ZIP_NAME,
} from "./paths.mjs";
import { toConnectRow } from "./list.mjs";
import { ensureDir, nowIso, writeJson } from "./util.mjs";

function setZipTextColumn(sheet, colIndex, rowCount) {
  for (let r = 2; r <= rowCount + 1; r++) {
    const cell = sheet.getCell(r, colIndex);
    cell.numFmt = "@";
    if (cell.value != null) cell.value = String(cell.value);
  }
}

export async function writeConnectMailingList(records, outDir = READY_DIR) {
  ensureDir(outDir);
  const filePath = path.join(outDir, MAILING_READY_NAME);
  const wb = new ExcelJS.Workbook();
  wb.creator = "LG Studio Letter 1 Pipeline";
  const ws = wb.addWorksheet("Mailing List");
  ws.columns = CONNECT_COLUMNS.map((h) => ({ header: h, key: h, width: Math.max(14, h.length + 2) }));

  const productionRows = records.filter(
    (r) => r.status === "READY" || r.status === "FORMAT FIXED"
  );

  for (const r of productionRows) {
    ws.addRow(toConnectRow(r));
  }

  const zipCol = CONNECT_COLUMNS.indexOf("ZIP") + 1;
  setZipTextColumn(ws, zipCol, productionRows.length);

  await wb.xlsx.writeFile(filePath);
  return { path: filePath, recordCount: productionRows.length };
}

export async function writeQaWorkbook({ listResult, mergePreviews, letterQa, overallStatus }, outDir = QA_DIR) {
  ensureDir(outDir);
  const filePath = path.join(outDir, QA_WORKBOOK_NAME);
  const wb = new ExcelJS.Workbook();
  const { records, counts, sourceRows } = listResult;

  const summary = wb.addWorksheet("SUMMARY");
  summary.addRows([
    ["Metric", "Value"],
    ["Total records", counts.total],
    ["Ready", counts.ready],
    ["Format-fixed", counts.formatFixed],
    ["Address-needed", counts.needsAddress],
    ["Review-needed", counts.needsReview],
    ["Possible duplicates", counts.duplicates],
    ["Production-ready count", counts.productionReady],
    ["Overall status", overallStatus],
    ["Generated", nowIso()],
  ]);

  function addRecordSheet(name, filterFn) {
    const ws = wb.addWorksheet(name);
    const cols = [
      "Status",
      "Source Sheet",
      "Source Row",
      ...CONNECT_COLUMNS,
      "Flags",
      "Merge Flags",
    ];
    ws.addRow(cols);
    for (const r of records.filter(filterFn)) {
      const cr = toConnectRow(r);
      ws.addRow([
        r.status,
        r.sourceSheet,
        r.sourceRow,
        ...CONNECT_COLUMNS.map((c) => cr[c] ?? ""),
        (r.flags || []).join("; "),
        (r.mergeFlags || []).join("; "),
      ]);
    }
    setZipTextColumn(ws, cols.indexOf("ZIP") + 1, records.filter(filterFn).length);
  }

  addRecordSheet("READY", (r) => r.status === "READY");
  addRecordSheet("FORMAT FIXED", (r) => r.status === "FORMAT FIXED");
  addRecordSheet("NEEDS ADDRESS", (r) => r.status === "NEEDS ADDRESS");
  addRecordSheet("NEEDS REVIEW", (r) => r.status === "NEEDS REVIEW");
  addRecordSheet("DUPLICATES", (r) => r.status === "DUPLICATE / POSSIBLE DUPLICATE");

  const merge = wb.addWorksheet("MERGE PREVIEW");
  merge.addRow(["Bucket", "Source Row", "Business Name", "Addressee Name", "Salutation", "Preview", "Flags"]);
  for (const s of mergePreviews) {
    merge.addRow([
      s.bucket,
      s.sourceRow,
      s.businessName,
      s.addresseeName,
      s.salutation,
      s.preview,
      (s.mergeFlags || []).join("; "),
    ]);
  }

  const source = wb.addWorksheet("SOURCE");
  if (sourceRows.length) {
    const headers = Object.keys(sourceRows[0]).filter((k) => !k.startsWith("__") || k === "__sheet" || k === "__sourceRow");
    // Prefer original keys plus meta
    const keys = ["__sheet", "__sourceRow", ...Object.keys(sourceRows[0]).filter((k) => !k.startsWith("__"))];
    source.addRow(keys);
    for (const row of sourceRows) {
      source.addRow(keys.map((k) => row[k] ?? ""));
    }
  }

  const letterSheet = wb.addWorksheet("LETTER QA");
  letterSheet.addRow(["Severity", "Code", "Message"]);
  for (const issue of letterQa.issues || []) {
    letterSheet.addRow([issue.severity, issue.code, issue.message]);
  }
  letterSheet.addRow([]);
  letterSheet.addRow(["CHANGE SUMMARY"]);
  letterSheet.addRow(["ADDED"]);
  for (const a of letterQa.changeSummary?.ADDED || []) letterSheet.addRow([a]);
  letterSheet.addRow(["REMOVED"]);
  for (const a of letterQa.changeSummary?.REMOVED || []) letterSheet.addRow([a]);
  letterSheet.addRow(["CHANGED"]);
  for (const c of letterQa.changeSummary?.CHANGED || []) letterSheet.addRow([`FROM: ${c.from}`, `TO: ${c.to}`]);
  letterSheet.addRow(["UNCHANGED count", (letterQa.changeSummary?.UNCHANGED || []).length]);

  await wb.xlsx.writeFile(filePath);
  return { path: filePath };
}

export function writeQaReport({ overallStatus, listResult, letterQa, mergePreviews, blockers, warnings }, outDir = QA_DIR) {
  ensureDir(outDir);
  const filePath = path.join(outDir, QA_REPORT_NAME);
  const c = listResult.counts;
  const lines = [];
  lines.push(`# Costello Letter 1 - QA Report`);
  lines.push("");
  lines.push(overallStatus);
  lines.push("");

  if (overallStatus === "TECHNICALLY CLEAR") {
    lines.push(`${c.productionReady} technically production-ready records`);
    lines.push(`${c.needsAddress} missing required postal fields`);
    lines.push(`${blockers.length} unresolved merge / letter blockers`);
    lines.push("");
    lines.push("EDITORIAL PROOF READY FOR CLIENT REVIEW");
    lines.push("Client approval: PENDING (Kris Costello)");
    lines.push("Vendor package: STAGED / NOT AUTHORIZED TO SEND");
  } else {
    for (const b of blockers) lines.push(`- ${b}`);
    if (!blockers.length) {
      for (const w of warnings.slice(0, 12)) lines.push(`- ${w}`);
    }
  }

  lines.push("");
  lines.push("## Counts");
  lines.push(`- Total: ${c.total}`);
  lines.push(`- Ready: ${c.ready}`);
  lines.push(`- Format-fixed: ${c.formatFixed}`);
  lines.push(`- Address-needed: ${c.needsAddress}`);
  lines.push(`- Review-needed: ${c.needsReview}`);
  lines.push(`- Possible duplicates: ${c.duplicates}`);
  lines.push(`- Production-ready: ${c.productionReady}`);
  lines.push("");
  lines.push("## Letter issues");
  for (const i of letterQa.issues || []) {
    lines.push(`- [${i.severity}] ${i.code}: ${i.message}`);
  }
  lines.push("");
  lines.push("## Change summary vs previous workspace Letter 1");
  lines.push(`- ADDED: ${(letterQa.changeSummary?.ADDED || []).length}`);
  lines.push(`- REMOVED: ${(letterQa.changeSummary?.REMOVED || []).length}`);
  lines.push(`- CHANGED: ${(letterQa.changeSummary?.CHANGED || []).length}`);
  lines.push(`- UNCHANGED: ${(letterQa.changeSummary?.UNCHANGED || []).length}`);
  lines.push("");
  lines.push("## Merge preview samples");
  lines.push(`- ${mergePreviews.length} sample rows (first/last/flagged) - details in QA workbook (PII).`);
  lines.push("");
  lines.push(`Generated: ${nowIso()}`);
  lines.push("");

  fs.writeFileSync(filePath, lines.join("\n"), "utf8");
  return { path: filePath };
}

export function writeVendorPackage({
  recordCount,
  dryRun,
  authorized = false,
  clientApproved = false,
}, outDir = VENDOR_DIR) {
  ensureDir(outDir);
  const packageDir = path.join(outDir, "CONNECT-PACKAGE");
  ensureDir(packageDir);

  for (const name of fs.readdirSync(packageDir)) {
    fs.rmSync(path.join(packageDir, name), { force: true, recursive: true });
  }

  const letterSrc = path.join(READY_DIR, PRINT_READY_NAME);
  const listSrc = path.join(READY_DIR, MAILING_READY_NAME);
  if (!fs.existsSync(letterSrc) || !fs.existsSync(listSrc)) {
    throw new Error("Vendor package requires print-ready PDF and mailing list in ready/");
  }

  fs.copyFileSync(letterSrc, path.join(packageDir, PRINT_READY_NAME));
  fs.copyFileSync(listSrc, path.join(packageDir, MAILING_READY_NAME));

  const authorizedSend = !!(authorized && clientApproved);
  const manifest = [
    "Costello Law Firm",
    "Letter 1 production package",
    "",
    "Authorization:",
    authorizedSend ? "AUTHORIZED TO SEND" : "STAGED / NOT AUTHORIZED TO SEND",
    "",
    "Blocker:",
    authorizedSend ? "None" : "Kris Costello final approval",
    "",
    "Letter:",
    PRINT_READY_NAME,
    "",
    "Mailing list:",
    MAILING_READY_NAME,
    "",
    "Records:",
    String(recordCount),
    "",
    "Prepared:",
    nowIso(),
    "",
    "Do NOT treat this package as client-approved or printer-released unless Authorization is AUTHORIZED TO SEND.",
    dryRun ? "\nNOTE: DRY RUN — not a live send package." : "",
    "",
  ].join("\n");
  fs.writeFileSync(path.join(packageDir, "MANIFEST.txt"), manifest, "utf8");

  const zipPath = path.join(outDir, VENDOR_ZIP_NAME);
  const zip = new AdmZip();
  zip.addLocalFolder(packageDir, "CONNECT-PACKAGE");
  zip.writeZip(zipPath);

  const emailPath = path.join(outDir, "email-to-steven.txt");
  const email = authorizedSend
    ? [
        "Hi Steven,",
        "",
        "We have the final Costello Letter 1 production package ready.",
        "",
        "Attached:",
        "- print-ready letter PDF",
        "- final Excel mailing list",
        "",
        `The mailing list contains ${recordCount} production records.`,
        "",
        "Please open the production number and send me the invoice/payment link when ready. Once you have reviewed the files, please let me know if you see anything that needs adjustment before proofing.",
        "",
        "Thanks for standing by.",
        "",
        "Luis",
        "",
      ].join("\n")
    : [
        "DRAFT ONLY — DO NOT SEND",
        "",
        "This draft must not be sent until Kris Costello has given final approval",
        "and Luis has explicitly authorized vendor release.",
        "",
        "Hi Steven,",
        "",
        "[HOLD — package is staged / not authorized to send]",
        "",
        `Staged mailing list currently contains ${recordCount} production records.`,
        "",
        "Luis",
        "",
      ].join("\n");
  fs.writeFileSync(emailPath, email, "utf8");

  return {
    packageDir,
    zipPath,
    emailPath,
    manifestPath: path.join(packageDir, "MANIFEST.txt"),
    authorized: authorizedSend,
  };
}

export function writeRunMeta(meta, outPath) {
  writeJson(outPath, meta);
}
