import path from "node:path";
import { runPipeline } from "./run.mjs";
import { REPO_ROOT } from "./paths.mjs";

function parseArgs(argv) {
  const out = {
    letter: null,
    list: null,
    dryRun: false,
    apply: false,
    force: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--letter") out.letter = argv[++i];
    else if (a === "--list") out.list = argv[++i];
    else if (a === "--dry-run") out.dryRun = true;
    else if (a === "--apply") out.apply = true;
    else if (a === "--force") out.force = true;
    else if (a === "--help" || a === "-h") out.help = true;
    else throw new Error(`Unknown argument: ${a}`);
  }
  return out;
}

function resolveMaybe(p) {
  if (!p) return p;
  return path.isAbsolute(p) ? p : path.resolve(process.cwd(), p);
}

export async function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (args.help) {
    printHelp();
    return 0;
  }

  const result = await runPipeline({
    letterPath: resolveMaybe(args.letter),
    listPath: resolveMaybe(args.list),
    dryRun: args.dryRun,
    apply: args.apply,
    force: args.force,
  });

  if (result.noChanges) {
    console.log(result.message);
    return 0;
  }

  console.log("");
  console.log("=== DONE ===");
  console.log(result.overallStatus);
  console.log(`Records: ${result.counts.total} (production-ready ${result.counts.productionReady})`);
  console.log(`QA report: ${path.relative(REPO_ROOT, result.outputs.qaReport)}`);
  console.log(result.humanApprovalGate);
  console.log("Email is NOT sent automatically.");
  return result.overallStatus === "BLOCKED" ? 2 : 0;
}

function printHelp() {
  console.log(`Costello Letter 1 · Production Assembly Line

Usage:
  npm run costello:letter1 -- --letter <file> --list <file> [--dry-run] [--apply] [--force]

Inputs:
  --letter   Final letter (.docx | .pdf | .txt | .md | .html)
  --list     Final mailing list (.xlsx | .csv)

Flags:
  --dry-run  Prove pipeline; do not change client-facing status/HTML
  --apply    Publish LG STUDIO EDITORIAL PROOF to workspace (NOT Kris approval, NOT READY TO SEND)
  --force    Re-run even if input hashes match last run

Status model:
  Successful editorial QA  = EDITORIAL PROOF READY FOR CLIENT REVIEW
  --apply                  = LG STUDIO EDITORIAL PROOF · Awaiting Kris Costello final approval
  READY TO SEND            = only after explicit Kris approval + Luis vendor authorization
  Vendor package           = may STAGED / NOT AUTHORIZED; never auto-sent

Never auto-emails. Never marks SENT_TO_CONNECT from QA or --apply.
`);
}

if (import.meta.url === `file://${process.argv[1].replace(/\\/g, "/")}` ||
    process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/").split("/").pop())) {
  // fallback entry via wrapper
}
