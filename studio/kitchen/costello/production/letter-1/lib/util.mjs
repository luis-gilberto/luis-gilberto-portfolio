import fs from "node:fs";
import path from "node:path";

export function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

export function cleanDir(dir) {
  ensureDir(dir);
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    fs.rmSync(p, { recursive: true, force: true });
  }
}

export function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

export function writeJson(filePath, data) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

export function readJson(filePath, fallback = null) {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

export function nowIso() {
  return new Date().toISOString();
}

export function escHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function collapseWs(s) {
  return String(s ?? "")
    .replace(/\u00a0/g, " ")
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function normCell(s) {
  return String(s ?? "")
    .replace(/\u00a0/g, " ")
    .replace(/[\r\n]+/g, " ")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

/** Safe title-case for person/business names only when ALL CAPS or all lower. */
export function softCapitalizeName(s) {
  const t = normCell(s);
  if (!t) return "";
  if (/[a-z]/.test(t) && /[A-Z]/.test(t)) return t; // already mixed
  return t
    .toLowerCase()
    .split(/\s+/)
    .map((w) => {
      if (/^(llc|pllc|pc|llp|lp|pa|and|&)$/i.test(w)) return w.toUpperCase() === "AND" ? "and" : w.toUpperCase();
      if (w.includes("-")) {
        return w
          .split("-")
          .map((p) => (p ? p[0].toUpperCase() + p.slice(1) : p))
          .join("-");
      }
      return w ? w[0].toUpperCase() + w.slice(1) : w;
    })
    .join(" ");
}

export function zipAsText(raw) {
  let t = normCell(raw).replace(/\.0$/, "");
  t = t.replace(/[^0-9A-Za-z-]/g, "");
  if (/^\d{9}$/.test(t)) return t.slice(0, 5) + "-" + t.slice(5);
  if (/^\d{8}$/.test(t)) return t.padStart(9, "0").replace(/^(\d{5})(\d{4})$/, "$1-$2");
  if (/^\d{1,4}$/.test(t)) return t.padStart(5, "0");
  if (/^\d{5}$/.test(t) || /^\d{5}-\d{4}$/.test(t)) return t;
  return t;
}

const STATE_MAP = {
  alabama: "AL", alaska: "AK", arizona: "AZ", arkansas: "AR", california: "CA",
  colorado: "CO", connecticut: "CT", delaware: "DE", florida: "FL", georgia: "GA",
  hawaii: "HI", idaho: "ID", illinois: "IL", indiana: "IN", iowa: "IA", kansas: "KS",
  kentucky: "KY", louisiana: "LA", maine: "ME", maryland: "MD", massachusetts: "MA",
  michigan: "MI", minnesota: "MN", mississippi: "MS", missouri: "MO", montana: "MT",
  nebraska: "NE", nevada: "NV", "new hampshire": "NH", "new jersey": "NJ",
  "new mexico": "NM", "new york": "NY", "north carolina": "NC", "north dakota": "ND",
  ohio: "OH", oklahoma: "OK", oregon: "OR", pennsylvania: "PA", "rhode island": "RI",
  "south carolina": "SC", "south dakota": "SD", tennessee: "TN", texas: "TX",
  utah: "UT", vermont: "VT", virginia: "VA", washington: "WA", "west virginia": "WV",
  wisconsin: "WI", wyoming: "WY", "district of columbia": "DC",
};

export function normalizeState(raw) {
  const t = normCell(raw);
  if (!t) return "";
  if (/^[A-Za-z]{2}$/.test(t)) return t.toUpperCase();
  const key = t.toLowerCase();
  return STATE_MAP[key] || t.toUpperCase();
}

export function stripHtml(html) {
  return collapseWs(
    String(html)
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
  );
}
