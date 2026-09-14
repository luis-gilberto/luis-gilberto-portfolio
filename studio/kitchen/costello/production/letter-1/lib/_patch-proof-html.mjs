import fs from "node:fs";

const BODY_INNER_PROOF = `      <p>Dear <span class="field"><span class="mk">04</span>[Name]</span>,</p>
      <p class="para">Costello Law Firm is proud to announce the expansion of its boutique defense litigation practice and the addition of Attorney Wendy Harper and Chief of Staff Nari Weaver. These additions complement Costello Law Firm’s decades of trial, white-collar, regulatory, and complex litigation experience, including parallel proceedings. We defend clients facing serious federal charges and Washington State Attorney General investigations.</p>
      <p class="para">We welcome the opportunity to assist when a business owner or professional faces a government investigation, regulatory or professional discipline matter, or when civil litigation develops alongside enforcement proceedings. In these matters, we can serve as lead counsel or work alongside existing civil counsel to address government investigations, white-collar defense, regulatory matters, or professional licensing issues while helping coordinate the broader strategy.</p>
      <p class="para">Wendy Harper clerked for the Honorable D. Duff McKee in Boise, Idaho, served as a prosecutor in the Seattle City Attorney’s Criminal Office, and has extensive trial experience and many years defending individuals in criminal matters. She also practiced at national law firms and worked at the Federal Civil Rights Clinic for thirteen years.</p>
      <p class="para">Nari Weaver serves as Chief of Staff, leading firm operations, strategic initiatives, communications, and organizational development. With more than 15 years of experience spanning communications, marketing, program management, nonprofit leadership, and operations, Nari works closely with firm leadership to translate strategy into execution and strengthen the systems and infrastructure supporting the firm’s attorneys, clients, and continued growth.</p>
      <p class="para">Together, Wendy and Nari strengthen Costello Law Firm’s ability to provide strategic representation while preserving the personal attention and senior-level advocacy that define our practice.</p>
      <p class="signoff">Respectfully,</p>
`;

const BODY_INNER_CLEAN = BODY_INNER_PROOF.replace(
  /Dear <span class="field"><span class="mk">04<\/span>\[Name\]<\/span>,/,
  "Dear [Name],"
);

const TAG =
  '<p class="copy-tag"><span class="mk">01</span> LG Studio editorial proof · awaiting client approval</p>';

function patch(file, bodyInner) {
  let html = fs.readFileSync(file, "utf8");
  html = html.replace(/<p class="copy-tag">[\s\S]*?<\/p>/, TAG);
  html = html.replace(
    /(<div class="body">)[\s\S]*?(<div class="sigspace)/,
    `$1\n${bodyInner}      $2`
  );
  html = html.replace(
    /aria-label="Working letter proof"|aria-label="Costello referral letter"/,
    'aria-label="Letter 1 LG Studio editorial proof"'
  );
  if (/we.?re the call/i.test(html)) throw new Error("stale CTA remains in " + file);
  if (!html.includes("boutique defense litigation")) {
    throw new Error("new copy missing in " + file);
  }
  fs.writeFileSync(file, html);
  console.log("ok", file);
}

patch("studio/kitchen/costello-review/letter-proof.html", BODY_INNER_PROOF);
patch("studio/kitchen/costello-review/letter-clean.html", BODY_INNER_CLEAN);
