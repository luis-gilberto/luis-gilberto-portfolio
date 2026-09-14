import fs from "node:fs";
import { STATE_PATH } from "./paths.mjs";
import { nowIso, readJson, writeJson } from "./util.mjs";

/**
 * Production sequence (Letter 01):
 * CLIENT_SOURCE_COPY
 * → LG_STUDIO_EDITORIAL_PROOF   ← current until Luis records Kris approval
 * → KRIS_COSTELLO_FINAL_APPROVAL
 * → PRINTER_PROOF
 * → READY_TO_SEND
 * → SENT_TO_CONNECT / IN_PRODUCTION / …
 *
 * Technical QA clarity is NOT client approval and NOT READY_TO_SEND.
 */
export const STATES = [
  "WAITING_FOR_FINAL",
  "CLIENT_SOURCE_COPY",
  "LG_STUDIO_EDITORIAL_PROOF",
  "KRIS_COSTELLO_FINAL_APPROVAL",
  "QA_RUNNING",
  "BLOCKED",
  "TECHNICALLY_CLEAR",
  "TECHNICALLY_CLEAR_WITH_WARNINGS",
  "PRINTER_PROOF",
  "READY_TO_SEND",
  "SENT_TO_CONNECT",
  "INVOICE_RECEIVED",
  "INITIAL_PAYMENT_COMPLETE",
  "PROOF_RECEIVED",
  "PROOF_APPROVED",
  "IN_PRODUCTION",
  "USPS_HANDOFF",
];

export const EDITORIAL_STATUS = {
  label: "LG STUDIO EDITORIAL PROOF",
  substatus: "Awaiting Kris Costello final approval",
  title: "Referral Letter 01 · Expansion",
  lastUpdated: "September 14, 2026",
  editorialNote:
    "Light editorial corrections from the September 14 working session have been incorporated. Structure and substance remain Costello Law Firm's. Final client approval is still required before production.",
  productionState: "NOT RELEASED TO PRINTER",
  nextStep: "Kris final approval → printer proof → production",
  vendorPackage: "STAGED / NOT AUTHORIZED TO SEND",
  vendorBlocker: "Kris Costello final approval",
  qaMeaning: "EDITORIAL PROOF READY FOR CLIENT REVIEW",
};

export function loadProductionState() {
  return (
    readJson(STATE_PATH) || {
      current: "WAITING_FOR_FINAL",
      clientApproved: false,
      vendorAuthorized: false,
      history: [
        {
          state: "WAITING_FOR_FINAL",
          timestamp: null,
          source: "bootstrap",
          notes: "Awaiting Letter 1 source materials",
        },
      ],
      lastInputHash: null,
      lastRunId: null,
    }
  );
}

export function saveProductionState(state) {
  writeJson(STATE_PATH, state);
}

/**
 * Advance state machine. Never fabricates future event timestamps.
 * dryRun: records a dry-run note without claiming live client-facing state.
 */
export function transition(state, next, { source, notes, dryRun = false } = {}) {
  if (!STATES.includes(next)) throw new Error(`Unknown state ${next}`);
  const entry = {
    state: next,
    timestamp: nowIso(),
    source: source || "pipeline",
    notes: notes || "",
    dryRun: !!dryRun,
  };
  state.history = state.history || [];
  state.history.push(entry);
  if (!dryRun) state.current = next;
  else state.lastDryRun = entry;
  return state;
}

export function archivePriorRun(archiveDir, readyDir, qaDir, vendorDir) {
  if (!fs.existsSync(readyDir) && !fs.existsSync(qaDir)) return null;
  const stamp = nowIso().replace(/[:.]/g, "-");
  const dest = `${archiveDir}/run-${stamp}`;
  fs.mkdirSync(dest, { recursive: true });
  for (const [label, dir] of [
    ["ready", readyDir],
    ["qa", qaDir],
    ["vendor", vendorDir],
  ]) {
    if (!fs.existsSync(dir)) continue;
    const target = `${dest}/${label}`;
    fs.mkdirSync(target, { recursive: true });
    for (const name of fs.readdirSync(dir)) {
      const from = `${dir}/${name}`;
      const to = `${target}/${name}`;
      const stat = fs.statSync(from);
      if (stat.isDirectory()) {
        fs.cpSync(from, to, { recursive: true });
      } else {
        fs.copyFileSync(from, to);
      }
    }
  }
  return dest;
}
