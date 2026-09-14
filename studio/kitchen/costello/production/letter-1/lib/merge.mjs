import { softCapitalizeName, normCell } from "./util.mjs";

const SUFFIX_RE = /\b(jr\.?|sr\.?|ii|iii|iv|esq\.?|phd|md)\b/i;
const MULTI_RE = /\s+(?:&|and|\/|,)\s+/i;

/**
 * Derive First Name / Salutation without inventing names.
 */
export function applySalutationQa(records) {
  const flagged = [];

  for (const r of records) {
    const mergeFlags = [];
    let first = softCapitalizeName(r.firstName);

    if (!first && r.addresseeName) {
      const parts = normCell(r.addresseeName).split(/\s+/);
      // Only take first token if it looks like a given name (not ALLCAPS firm token alone)
      if (parts.length >= 2 && !/^(the|law|office)$/i.test(parts[0])) {
        first = softCapitalizeName(parts[0]);
        mergeFlags.push("FIRST_FROM_ADDRESSEE");
      }
    }

    if (!r.addresseeName && r.businessName) {
      mergeFlags.push("ORG_NO_INDIVIDUAL");
      first = ""; // do not invent
    }
    if (!r.addresseeName && !first) mergeFlags.push("BLANK_ADDRESSEE");
    if (r.addresseeName && MULTI_RE.test(r.addresseeName)) mergeFlags.push("MULTIPLE_RECIPIENTS");
    if (r.addresseeName && SUFFIX_RE.test(r.addresseeName)) mergeFlags.push("SUFFIX");
    if (first && first.length <= 1) mergeFlags.push("AMBIGUOUS_NAME");
    if (first && /[^A-Za-z'’.\- ]/.test(first)) mergeFlags.push("MALFORMED_NAME");
    if (!first) mergeFlags.push("NO_SALUTATION");

    r.firstName = first;
    r.salutationPreview = first; // printer column: First Name / Salutation
    r.mergeFlags = mergeFlags;
    r.mergeOk = !mergeFlags.some((f) =>
      ["ORG_NO_INDIVIDUAL", "BLANK_ADDRESSEE", "MULTIPLE_RECIPIENTS", "MALFORMED_NAME", "NO_SALUTATION", "AMBIGUOUS_NAME"].includes(f)
    );

    // Escalate status for merge blockers without inventing
    if (!r.mergeOk) {
      if (r.status === "READY" || r.status === "FORMAT FIXED") r.status = "NEEDS REVIEW";
      flagged.push(r);
    } else if (mergeFlags.length) {
      flagged.push(r);
    }
  }

  return { records, flagged };
}

export function buildMergePreviews(records) {
  const flagged = records.filter((r) => (r.mergeFlags && r.mergeFlags.length) || !r.mergeOk);
  const first10 = records.slice(0, 10);
  const last10 = records.slice(-10);
  const seen = new Set();
  const samples = [];
  for (const r of [...first10, ...last10, ...flagged]) {
    const key = `${r.sourceSheet}:${r.sourceRow}`;
    if (seen.has(key)) continue;
    seen.add(key);
    samples.push({
      sourceRow: r.sourceRow,
      sourceSheet: r.sourceSheet,
      status: r.status,
      businessName: r.businessName,
      addresseeName: r.addresseeName,
      salutation: r.salutationPreview || "",
      preview: r.salutationPreview ? `Dear ${r.salutationPreview},` : "(no salutation — do not invent)",
      mergeFlags: r.mergeFlags || [],
      bucket: flagged.includes(r) ? "flagged" : first10.includes(r) ? "first10" : "last10",
    });
  }
  return samples;
}
