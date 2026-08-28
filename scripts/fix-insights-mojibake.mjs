#!/usr/bin/env node
import fs from "node:fs";

const files = [
  "insights/index.html",
  "insights/series/index.html",
  "insights/the-pattern-i-couldnt-ignore/index.html",
  "insights/building-the-ecosystem/index.html",
  "insights/translation-problem/index.html",
  "insights/again/index.html",
  "insights/teams-consumer-launch/index.html",
];

// These are the literal mojibake sequences present in the files (UTF-8 bytes of
// mis-decoded characters), mapped to safe HTML entities.
const pairs = [
  ["\u00E2\u0080\u00A6", "&hellip;"], // should not match if already wrong glyphs
];

function fix(text) {
  // Replace by Unicode code points of the visible mojibake glyphs as stored.
  // File stores: U+00E2 U+20AC U+00A6 for â€¦ etc when Latin-1 of UTF-8 ellipsis
  // was re-saved as UTF-8. Grep showed: â€¦ â€” Â· Â© â†’ etc.
  return text
    .replaceAll("â€¦", "&hellip;")
    .replaceAll("â€”", "&mdash;")
    .replaceAll("â€“", "&ndash;")
    .replaceAll("â€™", "&rsquo;")
    .replaceAll("â€˜", "&lsquo;")
    .replaceAll("â€œ", "&ldquo;")
    .replaceAll("â€\u009D", "&rdquo;")
    .replaceAll("â€", "&rdquo;")
    .replaceAll("â€‘", "&#8209;")
    .replaceAll("Â·", "&middot;")
    .replaceAll("Â©", "&copy;")
    .replaceAll("â†’", "&rarr;")
    .replaceAll("â†—", "&nearr;")
    .replaceAll("â€º", "&rsaquo;");
}

for (const f of files) {
  const before = fs.readFileSync(f, "utf8");
  const after = fix(before);
  if (after !== before) {
    fs.writeFileSync(f, after, "utf8");
    console.log("updated", f);
  } else {
    console.log("no change", f);
  }
}
