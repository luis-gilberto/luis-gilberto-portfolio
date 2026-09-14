import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const LETTER1_ROOT = path.resolve(__dirname, "..");
export const REPO_ROOT = path.resolve(LETTER1_ROOT, "../../../../../");
export const READY_DIR = path.join(LETTER1_ROOT, "ready");
export const QA_DIR = path.join(LETTER1_ROOT, "qa");
export const VENDOR_DIR = path.join(LETTER1_ROOT, "vendor");
export const ARCHIVE_DIR = path.join(LETTER1_ROOT, "archive");
export const RUNS_DIR = path.join(LETTER1_ROOT, "runs");
export const SOURCE_DIR = path.join(LETTER1_ROOT, "source");
export const TEMPLATES_DIR = path.join(LETTER1_ROOT, "templates");
export const STATE_PATH = path.join(LETTER1_ROOT, "production-state.json");

export const PROJECT_STATE_PATH = path.join(
  REPO_ROOT,
  "studio/capabilities/costello/data/costello-project-state.json"
);

export const WORKSPACE_LETTER_HTML = [
  path.join(REPO_ROOT, "studio/kitchen/costello-review/letter-clean.html"),
  path.join(REPO_ROOT, "studio/kitchen/costello-review/letter-proof.html"),
  path.join(
    REPO_ROOT,
    "studio/kitchen/costello/documents/referral/production-prep/letter-approved-clean.html"
  ),
];

export const BASELINE_LETTER_HTML = path.join(
  REPO_ROOT,
  "studio/kitchen/costello/documents/referral/production-prep/letter-approved-clean.html"
);

export const SIGNATURE_ASSET = path.join(
  REPO_ROOT,
  "studio/kitchen/costello/documents/referral/production-prep/KC Signature.png"
);

export const CONNECT_COLUMNS = [
  "Business Name",
  "Addressee Name",
  "Street Address",
  "Suite or Apartment",
  "City",
  "State",
  "ZIP",
  "First Name / Salutation",
];

export const PRINT_READY_NAME = "Costello_Letter_1_PRINT_READY.pdf";
export const MAILING_READY_NAME = "Costello_Letter_1_MAILING_LIST_CONNECT.xlsx";
export const QA_WORKBOOK_NAME = "Costello_Letter_1_QA.xlsx";
export const QA_REPORT_NAME = "QA-REPORT.md";
export const VENDOR_ZIP_NAME = "Costello_Letter_1_CONNECT_PACKAGE.zip";
