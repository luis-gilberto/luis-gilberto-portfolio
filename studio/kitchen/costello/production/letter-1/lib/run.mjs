import fs from "node:fs";
import path from "node:path";
import { runFingerprint } from "./hash.mjs";
import { extractLetter, loadBaselineLetter, qaLetter } from "./letter.mjs";
import { loadMailingList, normalizeAndClassify } from "./list.mjs";
import { applySalutationQa, buildMergePreviews } from "./merge.mjs";
import {
  writeConnectMailingList,
  writeQaReport,
  writeQaWorkbook,
  writeRunMeta,
  writeVendorPackage,
} from "./outputs.mjs";
import { producePrintReadyPdf } from "./pdf.mjs";
import {
  ARCHIVE_DIR,
  LETTER1_ROOT,
  QA_DIR,
  READY_DIR,
  RUNS_DIR,
  VENDOR_DIR,
} from "./paths.mjs";
import {
  archivePriorRun,
  EDITORIAL_STATUS,
  loadProductionState,
  saveProductionState,
  transition,
} from "./state.mjs";
import { cleanDir, ensureDir, nowIso } from "./util.mjs";
import {
  applyProjectState,
  applyWorkspaceHtml,
  buildWorkspacePatch,
} from "./workspace.mjs";

function decideOverallStatus({ letterQa, listResult, mergeFlagged }) {
  const blockers = [];
  const warnings = [];

  for (const i of letterQa.issues) {
    if (i.severity === "block") blockers.push(`Letter: ${i.message}`);
    else if (i.severity === "warn" || i.severity === "flag") warnings.push(`Letter: ${i.message}`);
  }

  const c = listResult.counts;
  if (c.needsAddress) blockers.push(`${c.needsAddress} recipients missing required postal fields`);
  if (c.duplicates) blockers.push(`${c.duplicates} duplicate / possible-duplicate rows`);
  if (c.needsReview) blockers.push(`${c.needsReview} rows need review`);

  const mergeBlockers = mergeFlagged.filter((r) => !r.mergeOk).length;
  if (mergeBlockers) blockers.push(`${mergeBlockers} unresolved salutation / merge issues`);

  // Technical disposition only — never implies Kris approval or READY TO SEND
  if (blockers.length) return { overallStatus: "BLOCKED", blockers, warnings };
  if (warnings.length) {
    return { overallStatus: "TECHNICALLY CLEAR WITH WARNINGS", blockers, warnings };
  }
  return { overallStatus: "TECHNICALLY CLEAR", blockers, warnings };
}

/**
 * Main pipeline. Console logs never include recipient addresses.
 */
export async function runPipeline(opts) {
  const {
    letterPath,
    listPath,
    dryRun = false,
    apply = false,
    force = false,
    clientApproved = false,
  } = opts;

  if (!letterPath || !listPath) throw new Error("Both --letter and --list are required");
  if (!fs.existsSync(letterPath)) throw new Error(`Letter not found: ${letterPath}`);
  if (!fs.existsSync(listPath)) throw new Error(`List not found: ${listPath}`);

  ensureDir(READY_DIR);
  ensureDir(QA_DIR);
  ensureDir(VENDOR_DIR);
  ensureDir(ARCHIVE_DIR);
  ensureDir(RUNS_DIR);

  const fp = runFingerprint(letterPath, listPath);
  const prodState = loadProductionState();

  if (prodState.lastInputHash === fp.combined && !force) {
    return {
      noChanges: true,
      message: "NO CHANGES — identical letter + list hashes already processed",
      fingerprint: fp,
      lastRunId: prodState.lastRunId,
    };
  }

  // Archive prior outputs when inputs changed
  if (prodState.lastInputHash && prodState.lastInputHash !== fp.combined) {
    const archived = archivePriorRun(ARCHIVE_DIR, READY_DIR, QA_DIR, VENDOR_DIR);
    console.log(archived ? `Archived prior run → ${path.relative(LETTER1_ROOT, archived)}` : "No prior run to archive");
  }

  // Fresh output dirs (keep archive)
  cleanDir(READY_DIR);
  cleanDir(QA_DIR);
  // vendor cleared inside writeVendorPackage when READY

  const runId = nowIso().replace(/[:.]/g, "-");
  console.log(`Letter 1 pipeline · run ${runId}${dryRun ? " · DRY RUN" : ""}`);
  console.log(`Letter: ${path.basename(letterPath)}`);
  console.log(`List:   ${path.basename(listPath)}`);
  // Do not log paths that might embed user home with sensitive folder names beyond basename — basename only is fine

  transition(prodState, "CLIENT_SOURCE_COPY", {
    source: path.basename(letterPath) + " + " + path.basename(listPath),
    notes: dryRun ? "Dry-run receipt of source materials" : "Source materials received for editorial processing",
    dryRun,
  });
  transition(prodState, "QA_RUNNING", { source: "pipeline", notes: "QA started", dryRun });

  // --- Letter ---
  const baseline = loadBaselineLetter();
  const extracted = await extractLetter(letterPath);
  const letterQa = qaLetter(extracted, baseline);
  console.log(`Letter QA: ${letterQa.issues.length} issue(s) · format=${extracted.format}`);

  // --- List ---
  const loaded = await loadMailingList(listPath);
  const listResult = normalizeAndClassify(loaded);
  const { records, flagged: mergeFlagged } = applySalutationQa(listResult.records);
  listResult.records = records;
  // recount after merge escalation
  listResult.counts.needsReview = records.filter((r) => r.status === "NEEDS REVIEW").length;
  listResult.counts.ready = records.filter((r) => r.status === "READY").length;
  listResult.counts.formatFixed = records.filter((r) => r.status === "FORMAT FIXED").length;
  listResult.counts.needsAddress = records.filter((r) => r.status === "NEEDS ADDRESS").length;
  listResult.counts.duplicates = records.filter((r) => r.status === "DUPLICATE / POSSIBLE DUPLICATE").length;
  listResult.counts.productionReady = listResult.counts.ready + listResult.counts.formatFixed;

  const mergePreviews = buildMergePreviews(records);
  console.log(
    `List QA: ${listResult.counts.total} records · ready=${listResult.counts.ready} fixed=${listResult.counts.formatFixed} address=${listResult.counts.needsAddress} review=${listResult.counts.needsReview} dup=${listResult.counts.duplicates}`
  );

  const { overallStatus, blockers, warnings } = decideOverallStatus({
    letterQa,
    listResult,
    mergeFlagged,
  });
  console.log(`Status: ${overallStatus}`);

  // --- PDF ---
  const pdfResult = await producePrintReadyPdf({ letterPath, extracted, letterQa });
  console.log(`Print PDF: ${pdfResult.method} → ready/${path.basename(pdfResult.path)}`);

  // --- Connect list ---
  const mailingOut = await writeConnectMailingList(records);
  console.log(`Connect list: ${mailingOut.recordCount} production rows`);

  // --- QA artifacts ---
  await writeQaWorkbook({ listResult, mergePreviews, letterQa, overallStatus });
  writeQaReport({ overallStatus, listResult, letterQa, mergePreviews, blockers, warnings });

  // --- Workspace patch (always); apply only when !dryRun && apply ---
  const { patch, patchPath } = buildWorkspacePatch({
    extracted,
    overallStatus,
    listResult,
    dryRun,
    clientApproved: false, // never infer from QA / apply / meeting
  });
  console.log(`Workspace patch: ${path.relative(process.cwd(), patchPath)}`);
  console.log(`Status framing: ${EDITORIAL_STATUS.label} · ${EDITORIAL_STATUS.substatus}`);

  // Vendor: may stage files when technically workable, but NEVER authorize send
  // without explicit --client-approved (separate future gate).
  let vendor = null;
  const canStage =
    overallStatus === "TECHNICALLY CLEAR" ||
    overallStatus === "TECHNICALLY CLEAR WITH WARNINGS";
  if (canStage) {
    vendor = writeVendorPackage({
      recordCount: mailingOut.recordCount,
      dryRun,
      authorized: false,
      clientApproved: !!clientApproved,
    });
    console.log(`Vendor package STAGED / NOT AUTHORIZED: ${path.relative(process.cwd(), vendor.packageDir)}`);
    console.log(`Blocker: ${EDITORIAL_STATUS.vendorBlocker}`);
    console.log(`Email draft: ${path.relative(process.cwd(), vendor.emailPath)} (NOT sent; not an approval claim)`);
  } else {
    console.log("Vendor package skipped — technical QA blocked");
  }

  if (!dryRun) {
    if (overallStatus === "BLOCKED") {
      transition(prodState, "BLOCKED", {
        source: "qa",
        notes: blockers.slice(0, 5).join("; "),
      });
    } else if (overallStatus === "TECHNICALLY CLEAR WITH WARNINGS") {
      transition(prodState, "TECHNICALLY_CLEAR_WITH_WARNINGS", {
        source: "qa",
        notes: "Technical QA clear with warnings — not client approval",
      });
    } else {
      transition(prodState, "TECHNICALLY_CLEAR", {
        source: "qa",
        notes: "Technical QA clear — not client approval",
      });
    }

    // --apply publishes editorial proof only
    transition(prodState, "LG_STUDIO_EDITORIAL_PROOF", {
      source: apply ? "apply" : "pipeline",
      notes: apply
        ? "Workspace updated to LG STUDIO EDITORIAL PROOF; awaiting Kris Costello final approval"
        : "Editorial proof stage recorded; workspace not applied (pass --apply)",
    });

    prodState.clientApproved = false;
    prodState.vendorAuthorized = false;
    prodState.editorialStatus = EDITORIAL_STATUS;

    if (apply) {
      applyWorkspaceHtml(patch);
      applyProjectState(patch.letter1);
      console.log("Workspace HTML + project state updated → LG STUDIO EDITORIAL PROOF");
      console.log("Vendor release remains BLOCKED BY CLIENT APPROVAL");
    } else {
      console.log("Workspace NOT applied (pass --apply to publish editorial proof to workspace)");
    }
  } else {
    transition(prodState, "LG_STUDIO_EDITORIAL_PROOF", {
      source: "dry-run",
      notes: "Dry-run only — client-facing status unchanged; would be LG STUDIO EDITORIAL PROOF",
      dryRun: true,
    });
    console.log("Dry-run: client-facing workspace/status NOT modified");
  }

  prodState.lastInputHash = fp.combined;
  prodState.lastRunId = runId;
  prodState.lastOverallStatus = overallStatus;
  prodState.lastRecordCount = listResult.counts.total;
  prodState.clientApproved = false;
  prodState.vendorAuthorized = false;
  saveProductionState(prodState);

  const meta = {
    runId,
    dryRun,
    apply: !!apply && !dryRun,
    overallStatus,
    editorialStatus: EDITORIAL_STATUS.label,
    substatus: EDITORIAL_STATUS.substatus,
    clientApproved: false,
    vendorAuthorized: false,
    fingerprint: fp,
    letter: path.basename(letterPath),
    list: path.basename(listPath),
    counts: listResult.counts,
    blockers,
    warnings,
    outputs: {
      pdf: pdfResult.path,
      mailing: mailingOut.path,
      qaReport: path.join(QA_DIR, "QA-REPORT.md"),
      qaWorkbook: path.join(QA_DIR, "Costello_Letter_1_QA.xlsx"),
      workspacePatch: patchPath,
      vendor: vendor?.packageDir || null,
      emailDraft: vendor?.emailPath || null,
    },
    privacy: {
      mailingPiiInGit: false,
      consoleLogsAddresses: false,
      autoEmail: false,
    },
    humanApprovalGate:
      "Kris Costello must approve the LG Studio editorial proof before printer proof / READY TO SEND. Luis must then explicitly authorize vendor send. Pipeline never emails Steven and never marks SENT_TO_CONNECT from QA or --apply.",
  };
  writeRunMeta(meta, path.join(RUNS_DIR, `run-${runId}.json`));

  return meta;
}
