import fs from "node:fs";

const srcPath =
  "studio/kitchen/costello/documents/referral/production-prep/letter-approved-clean.html";
const outPath =
  "studio/kitchen/costello/production/letter-1/templates/letter-print.html";

const src = fs.readFileSync(srcPath, "utf8");
const out = src
  .replace(
    "<title>Costello Letter 1 · Approved Clean</title>",
    "<title>Costello Letter 1 · Print Ready</title>"
  )
  .replace(
    /<div class="body">[\s\S]*?<\/div>\s*<footer/,
    '<div class="body">\n      <!--LETTER_BODY-->\n    </div>\n    <footer'
  );

fs.writeFileSync(outPath, out);
console.log("wrote", outPath, "marker=", out.includes("<!--LETTER_BODY-->"));
