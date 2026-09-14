import fs from "node:fs";
import path from "node:path";
import ExcelJS from "exceljs";
import {
  normCell,
  softCapitalizeName,
  zipAsText,
  normalizeState,
} from "./util.mjs";
import { CONNECT_COLUMNS } from "./paths.mjs";

const HEADER_ALIASES = {
  "business name": "businessName",
  "company/ firm": "businessName",
  "company/firm": "businessName",
  "company / firm": "businessName",
  "firm / company": "businessName",
  "firm/company": "businessName",
  company: "businessName",
  firm: "businessName",
  "addressee name": "addresseeName",
  addressee: "addresseeName",
  "full name": "addresseeName",
  name: "firstName",
  "first name": "firstName",
  "last name": "lastName",
  "street address": "street",
  "address 1": "street",
  address1: "street",
  address: "street",
  "suite or apartment": "suite",
  "suite / apartment": "suite",
  "address 2/ suite": "suite",
  "address 2 / suite": "suite",
  "address 2": "suite",
  suite: "suite",
  apartment: "suite",
  city: "city",
  state: "state",
  zip: "zip",
  "zip code": "zip",
  zipcode: "zip",
  postal: "zip",
  "first name / salutation": "salutation",
  salutation: "salutation",
  email: "email",
  "internal note": "note",
};

function mapHeader(h) {
  const key = normCell(h).toLowerCase();
  return HEADER_ALIASES[key] || null;
}

function cellToString(value) {
  if (value == null) return "";
  if (typeof value === "object") {
    if (value.text != null) return String(value.text);
    if (value.result != null) return String(value.result);
    if (value.richText) return value.richText.map((r) => r.text).join("");
    if (value instanceof Date) return ""; // dates shouldn't be addresses
  }
  // Preserve ZIP leading zeros: ExcelJS may give number
  if (typeof value === "number") {
    if (Number.isInteger(value) && value >= 0 && value <= 99999) {
      return String(Math.trunc(value)).padStart(5, "0");
    }
    if (Number.isInteger(value) && value >= 100000 && value <= 999999999) {
      return String(Math.trunc(value));
    }
    return String(value);
  }
  return String(value);
}

export async function loadMailingList(listPath) {
  const ext = path.extname(listPath).toLowerCase();
  if (ext === ".csv") return loadCsv(listPath);
  if (ext === ".xlsx" || ext === ".xls") return loadXlsx(listPath);
  throw new Error(`Unsupported mailing list format: ${ext}. Use .xlsx or .csv`);
}

async function loadXlsx(listPath) {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(listPath);
  const sheets = [];
  for (const ws of wb.worksheets) {
    const rows = [];
    let headers = [];
    ws.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      const values = [];
      row.eachCell({ includeEmpty: true }, (cell, col) => {
        values[col - 1] = cellToString(cell.value);
      });
      if (rowNumber === 1) {
        headers = values.map((h) => normCell(h));
        return;
      }
      const obj = { __sheet: ws.name, __sourceRow: rowNumber };
      headers.forEach((h, i) => {
        obj[h] = values[i] ?? "";
      });
      // skip fully empty
      if (Object.values(obj).every((v) => v === "" || v === ws.name || typeof v === "number")) return;
      const hasData = headers.some((h) => normCell(obj[h]));
      if (hasData) rows.push(obj);
    });
    sheets.push({ name: ws.name, headers, rows });
  }
  // Prefer sheet with most rows / named Mailing List
  sheets.sort((a, b) => {
    const score = (s) =>
      (/mailing/i.test(s.name) ? 1000 : 0) +
      (/missing/i.test(s.name) ? -500 : 0) +
      s.rows.length;
    return score(b) - score(a);
  });
  const primary = sheets[0];
  if (!primary || !primary.rows.length) throw new Error("Mailing list has no data rows");
  return {
    path: listPath,
    sheets,
    primarySheet: primary.name,
    headers: primary.headers,
    rows: primary.rows,
  };
}

function loadCsv(listPath) {
  const raw = fs.readFileSync(listPath, "utf8").replace(/^\uFEFF/, "");
  const lines = raw.split(/\r?\n/).filter((l) => l.trim());
  if (!lines.length) throw new Error("CSV is empty");
  const headers = splitCsvLine(lines[0]).map((h) => normCell(h));
  const rows = lines.slice(1).map((line, i) => {
    const cols = splitCsvLine(line);
    const obj = { __sheet: "csv", __sourceRow: i + 2 };
    headers.forEach((h, idx) => {
      obj[h] = cols[idx] ?? "";
    });
    return obj;
  }).filter((r) => headers.some((h) => normCell(r[h])));
  return {
    path: listPath,
    sheets: [{ name: "csv", headers, rows }],
    primarySheet: "csv",
    headers,
    rows,
  };
}

function splitCsvLine(line) {
  const out = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (q && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else q = !q;
    } else if (c === "," && !q) {
      out.push(cur);
      cur = "";
    } else cur += c;
  }
  out.push(cur);
  return out;
}

function pick(row, field) {
  for (const [h, v] of Object.entries(row)) {
    if (h.startsWith("__")) continue;
    if (mapHeader(h) === field) return cellToString(v);
  }
  return "";
}

function splitSuiteFromStreet(street, suite) {
  let s = normCell(street);
  let u = normCell(suite);
  if (u) return { street: s, suite: u, fixed: false };
  const m = s.match(/^(.*?)(?:,?\s+)((?:suite|ste\.?|apt\.?|unit|#)\s*[\w-]+)\s*$/i);
  if (m) {
    return { street: normCell(m[1]), suite: normCell(m[2]), fixed: true };
  }
  return { street: s, suite: "", fixed: false };
}

function buildAddressee(first, last, existing) {
  if (normCell(existing)) return softCapitalizeName(existing);
  const f = softCapitalizeName(first);
  const l = softCapitalizeName(last);
  return [f, l].filter(Boolean).join(" ");
}

function fingerprint(rec) {
  return [
    rec.street,
    rec.suite,
    rec.city,
    rec.state,
    rec.zip,
    rec.addresseeName,
    rec.businessName,
  ]
    .map((x) => normCell(x).toLowerCase())
    .join("|");
}

export function normalizeAndClassify(loaded) {
  const records = [];
  const sourceRows = [];

  for (const row of loaded.rows) {
    const source = { ...row };
    sourceRows.push(source);

    const firstName = softCapitalizeName(pick(row, "firstName"));
    const lastName = softCapitalizeName(pick(row, "lastName"));
    const businessRaw = pick(row, "businessName");
    const businessName = softCapitalizeName(businessRaw);
    const addresseeName = buildAddressee(firstName, lastName, pick(row, "addresseeName"));
    const streetRaw = pick(row, "street");
    const suiteRaw = pick(row, "suite");
    const split = splitSuiteFromStreet(streetRaw, suiteRaw);
    const city = softCapitalizeName(pick(row, "city"));
    const state = normalizeState(pick(row, "state"));
    const zipRaw = pick(row, "zip");
    const zip = zipAsText(zipRaw);
    const email = normCell(pick(row, "email"));
    const note = normCell(pick(row, "note"));

    let formatFixed = false;
    if (split.fixed) formatFixed = true;
    if (zipRaw && zip !== normCell(zipRaw) && zipAsText(zipRaw) === zip) {
      if (String(zipRaw).trim() !== zip) formatFixed = true;
    }
    if (normalizeState(pick(row, "state")) !== normCell(pick(row, "state")) && state.length === 2) {
      if (normCell(pick(row, "state")).length !== 2) formatFixed = true;
    }
    if (
      (businessRaw && businessName !== normCell(businessRaw)) ||
      (firstName && firstName !== normCell(pick(row, "firstName"))) ||
      (lastName && lastName !== normCell(pick(row, "lastName")))
    ) {
      // capitalization soft-fix counts as format fixed only for ALL CAPS / all lower
      const rawName = [pick(row, "firstName"), pick(row, "lastName")].join(" ");
      if (rawName && (rawName === rawName.toUpperCase() || rawName === rawName.toLowerCase())) {
        formatFixed = true;
      }
    }

    const flags = [];
    if (!split.street) flags.push("MISSING_STREET");
    if (!city) flags.push("MISSING_CITY");
    if (!state) flags.push("MISSING_STATE");
    if (!zip) flags.push("MISSING_ZIP");
    if (!addresseeName && !businessName) flags.push("MISSING_IDENTITY");
    if (!addresseeName && businessName) flags.push("ORG_NO_ADDRESSEE");

    let status = "READY";
    if (flags.some((f) => f.startsWith("MISSING_") && f !== "MISSING_IDENTITY")) {
      status = "NEEDS ADDRESS";
    } else if (flags.includes("MISSING_IDENTITY") || flags.includes("ORG_NO_ADDRESSEE")) {
      status = "NEEDS REVIEW";
    } else if (formatFixed) {
      status = "FORMAT FIXED";
    }

    records.push({
      sourceRow: row.__sourceRow,
      sourceSheet: row.__sheet,
      businessName,
      addresseeName,
      street: split.street,
      suite: split.suite,
      city,
      state,
      zip,
      firstName,
      lastName,
      email,
      note,
      status,
      flags,
      formatFixed,
      fingerprint: "", // filled after
    });
  }

  // Duplicate detection (only when a usable postal fingerprint exists)
  const byFp = new Map();
  for (const r of records) {
    r.fingerprint = fingerprint(r);
    const usable = !!(r.street && r.zip);
    if (!usable) continue;
    const list = byFp.get(r.fingerprint) || [];
    list.push(r);
    byFp.set(r.fingerprint, list);
  }
  for (const group of byFp.values()) {
    if (group.length > 1 && group[0].fingerprint.replace(/\|/g, "")) {
      for (const r of group) {
        if (!r.flags.includes("DUPLICATE")) r.flags.push("DUPLICATE");
        if (r.status === "READY" || r.status === "FORMAT FIXED") r.status = "DUPLICATE / POSSIBLE DUPLICATE";
        else if (r.status !== "DUPLICATE / POSSIBLE DUPLICATE") {
          // keep stronger status but still flag
        }
      }
    }
  }

  // Near-duplicate: same street+zip different name
  const byAddr = new Map();
  for (const r of records) {
    const key = [r.street, r.zip].map((x) => x.toLowerCase()).join("|");
    if (!r.street || !r.zip) continue;
    const list = byAddr.get(key) || [];
    list.push(r);
    byAddr.set(key, list);
  }
  for (const group of byAddr.values()) {
    if (group.length < 2) continue;
    const names = new Set(group.map((g) => g.addresseeName.toLowerCase()));
    if (names.size > 1) {
      for (const r of group) {
        if (!r.flags.includes("POSSIBLE_DUP_ADDR")) r.flags.push("POSSIBLE_DUP_ADDR");
        if (r.status === "READY") r.status = "DUPLICATE / POSSIBLE DUPLICATE";
      }
    }
  }

  const counts = {
    total: records.length,
    ready: records.filter((r) => r.status === "READY").length,
    formatFixed: records.filter((r) => r.status === "FORMAT FIXED").length,
    needsAddress: records.filter((r) => r.status === "NEEDS ADDRESS").length,
    needsReview: records.filter((r) => r.status === "NEEDS REVIEW").length,
    duplicates: records.filter((r) => r.status === "DUPLICATE / POSSIBLE DUPLICATE").length,
  };
  counts.productionReady = counts.ready + counts.formatFixed;

  return { records, sourceRows, counts, connectColumns: CONNECT_COLUMNS };
}

export function toConnectRow(r) {
  return {
    "Business Name": r.businessName,
    "Addressee Name": r.addresseeName,
    "Street Address": r.street,
    "Suite or Apartment": r.suite,
    City: r.city,
    State: r.state,
    ZIP: r.zip,
    "First Name / Salutation": r.salutationPreview || r.firstName || "",
  };
}
