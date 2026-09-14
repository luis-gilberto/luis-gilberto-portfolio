import fs from "node:fs";
import path from "node:path";
import {
  PROJECT_STATE_PATH,
  QA_DIR,
  WORKSPACE_LETTER_HTML,
} from "./paths.mjs";
import { buildLetterBodyHtml } from "./letter.mjs";
import { EDITORIAL_STATUS } from "./state.mjs";
import { ensureDir, nowIso, writeJson } from "./util.mjs";

/**
 * Workspace patch for Letter 01.
 *
 * --apply means: publish LG Studio editorial proof to the workspace.
 * It does NOT mean client approval, printer approval, or READY TO SEND.
 */
export function buildWorkspacePatch({
  extracted,
  overallStatus,
  listResult,
  dryRun,
  clientApproved = false,
}) {
  const bodyHtml = buildLetterBodyHtml(extracted, { mergeToken: "[Name]" });
  const proofBody = buildLetterBodyHtml(extracted, { mergeToken: "«FirstName»" });

  const letter1 = {
    stage: "LG_STUDIO_EDITORIAL_PROOF",
    statusLabel: EDITORIAL_STATUS.label,
    substatus: EDITORIAL_STATUS.substatus,
    title: EDITORIAL_STATUS.title,
    lastUpdated: EDITORIAL_STATUS.lastUpdated,
    editorialNote: EDITORIAL_STATUS.editorialNote,
    productionState: EDITORIAL_STATUS.productionState,
    nextStep: EDITORIAL_STATUS.nextStep,
    vendorPackage: EDITORIAL_STATUS.vendorPackage,
    vendorBlocker: EDITORIAL_STATUS.vendorBlocker,
    qaMeaning: EDITORIAL_STATUS.qaMeaning,
    qaDisposition: overallStatus,
    clientApproved: !!clientApproved,
    vendorAuthorized: false,
    productionReleased: false,
    productionPackageReady: false,
    finalReceived: false,
    recordCount: listResult.counts.total,
    productionReadyCount: listResult.counts.productionReady,
    lastProcessedAt: nowIso(),
    workspaceStatus: `${EDITORIAL_STATUS.label} · ${EDITORIAL_STATUS.substatus}`,
  };

  const patch = {
    dryRun: !!dryRun,
    generatedAt: nowIso(),
    letter1,
    htmlTargets: WORKSPACE_LETTER_HTML.map((p) => path.relative(process.cwd(), p)),
    bodyPreviewChars: bodyHtml.length,
    applyNotes: [
      "Replaces <div class=\"body\">…</div> contents only — does not redesign pages.",
      "letter-proof.html uses «FirstName» merge token; clean/print use [Name].",
      "--apply publishes LG STUDIO EDITORIAL PROOF only. It does not record Kris approval.",
      "Vendor release remains blocked until explicit client approval is recorded separately.",
      dryRun
        ? "DRY RUN: patch written only; client-facing HTML and project state NOT modified."
        : "LIVE apply will update letter HTML body + letter1/referralMailing status to editorial-proof framing.",
    ],
    bodies: {
      clean: bodyHtml,
      proof: proofBody,
    },
  };

  ensureDir(QA_DIR);
  const patchPath = path.join(QA_DIR, "workspace-patch.json");
  writeJson(patchPath, patch);
  return { patch, patchPath };
}

function replaceBody(html, bodyInner) {
  const re = /(<div class="body">)([\s\S]*?)(<\/div>\s*<footer)/i;
  if (!re.test(html)) {
    throw new Error("Could not locate <div class=\"body\"> in workspace HTML");
  }
  return html.replace(re, `$1\n      ${bodyInner}\n    $3`);
}

export function applyWorkspaceHtml(patch, { applyProof = true } = {}) {
  const results = [];
  for (const abs of WORKSPACE_LETTER_HTML) {
    if (!fs.existsSync(abs)) {
      results.push({ path: abs, ok: false, error: "missing" });
      continue;
    }
    const isProof = /letter-proof\.html$/i.test(abs);
    const body = isProof && applyProof ? patch.bodies.proof : patch.bodies.clean;
    let bodyAdj = body;
    if (/costello-review/i.test(abs)) {
      bodyAdj = bodyAdj.replace(
        /src="KC%20Signature\.png"/g,
        'src="../../assets/KC%20Signature.png"'
      );
      if (/letter-clean\.html$/i.test(abs)) {
        bodyAdj = bodyAdj.replace(
          /<div class="sigspace"><img[\s\S]*?<\/div>/,
          '<div class="sigspace" aria-hidden="true"></div>'
        );
      }
    }
    const prev = fs.readFileSync(abs, "utf8");
    const next = replaceBody(prev, bodyAdj);
    fs.writeFileSync(abs, next, "utf8");
    results.push({ path: abs, ok: true });
  }
  return results;
}

/**
 * Apply editorial-proof status to project state.
 * Never marks client approved, READY TO SEND, or printer release.
 */
export function applyProjectState(letter1) {
  const state = JSON.parse(fs.readFileSync(PROJECT_STATE_PATH, "utf8"));
  state.letter1 = { ...(state.letter1 || {}), ...letter1 };

  if (state.referralMailing) {
    state.referralMailing.copyStatus = EDITORIAL_STATUS.label;
    state.referralMailing.reviewRound = `${EDITORIAL_STATUS.label} · ${EDITORIAL_STATUS.substatus}`;
    state.referralMailing.reviewStatus = EDITORIAL_STATUS.substatus;
    state.referralMailing.copySummary = EDITORIAL_STATUS.editorialNote;
    state.referralMailing.printerSubmission = "Not submitted";
    state.referralMailing.mailingListStatus = `${letter1.recordCount} records on file · ${letter1.productionReadyCount} technically production-ready · client approval pending`;
    // Keep Final Letter 1 open until Kris approves
    const open = new Set(state.referralMailing.openInputs || []);
    open.add("Kris Costello final approval of Letter 1 editorial proof");
    state.referralMailing.openInputs = [...open];
    state.referralMailing.remainingProductionInputs = state.referralMailing.openInputs.length;
  }

  if (state.kitchen?.reviews?.["letter-1"]) {
    const r = state.kitchen.reviews["letter-1"];
    r.title = EDITORIAL_STATUS.title;
    r.contextMode = `Kitchen / expansion letter / ${EDITORIAL_STATUS.label}`;
    r.statusLines = [
      EDITORIAL_STATUS.label,
      EDITORIAL_STATUS.substatus,
      EDITORIAL_STATUS.productionState,
    ];
    r.lede = EDITORIAL_STATUS.editorialNote;
    r.proof = {
      ...(r.proof || {}),
      statusLabel: EDITORIAL_STATUS.label,
      caption: "LG Studio editorial proof · awaiting Kris Costello final approval",
      meta: `${EDITORIAL_STATUS.lastUpdated} · not client-approved · not released to printer`,
      note: EDITORIAL_STATUS.editorialNote,
    };
    if (Array.isArray(r.production)) {
      r.production = r.production.map((row) => {
        if (row.label === "Production") {
          return {
            ...row,
            value: EDITORIAL_STATUS.productionState,
            note: `${EDITORIAL_STATUS.nextStep}. Vendor package: ${EDITORIAL_STATUS.vendorPackage}. Blocker: ${EDITORIAL_STATUS.vendorBlocker}.`,
          };
        }
        return row;
      });
    }
    if (r.inputs?.length) {
      r.inputLabel = "Next gate";
      r.inputs = [
        {
          id: "kris-final-approval",
          title: "Kris Costello final approval",
          status: "Pending",
          why: "LG Studio editorial proof is ready for Kris’s final blessing before printer proof / production.",
          timing: EDITORIAL_STATUS.lastUpdated,
          owner: "Kris",
          mailtoSubject: "Costello Letter 1 · Editorial proof for final approval",
        },
        ...(r.inputs || []).filter((i) => i.id !== "kris-final-approval" && i.id !== "current-input"),
      ];
    }
    if (r.shaping?.stages) {
      r.shaping.stages = [
        {
          label: "Source",
          value: "Costello Law Firm source copy + light LG Studio editorial polish",
          state: "WORKING",
        },
        {
          label: "Working expression",
          value: EDITORIAL_STATUS.label,
          state: "WORKING",
        },
        {
          label: "Client input",
          value: EDITORIAL_STATUS.substatus,
          state: "CLIENT INPUT REQUESTED",
        },
        {
          label: "Decision",
          value: "Not yet approved by Kris",
          state: "WORKING",
        },
      ];
    }
  }

  fs.writeFileSync(PROJECT_STATE_PATH, JSON.stringify(state, null, 2) + "\n", "utf8");
  return PROJECT_STATE_PATH;
}
