const fs = require("fs");
const path = require("path");

const filesJson = path.resolve(
  __dirname,
  "../../../capabilities/costello/data/costello-files.json"
);
const studioRoot = path.resolve(__dirname, "../../..");
const data = JSON.parse(fs.readFileSync(filesJson, "utf8"));

data.meta = {
  lastUpdated: "2026-09-14",
  lastUpdatedLabel: "14 September 2026",
  note: "Recovered source materials filed under documents/sources. Files shelf holds openable artifacts only. Status-only stubs and workspace pages removed."
};

data.currentIds = [
  "website-sow-revised-clean",
  "coi-general-liability",
  "coi-professional-liability",
  "coi-cyber",
  "referral-proof",
  "connect-quote-014564",
  "practice-areas-source",
  "mailing-list-corrected"
];

const byId = {};
data.categories.forEach((cat) => {
  (cat.items || []).forEach((item) => {
    byId[item.id] = item;
  });
});

if (byId["website-sow-revised-clean"]) {
  byId["website-sow-revised-clean"].note =
    "Agreement document in the DocuSign package. Prepared for electronic signature. Not executed. Confirm against current project language before treating as locked.";
}
if (byId["website-sow-itemized-signed-lg"]) {
  byId["website-sow-itemized-signed-lg"].status = "PRIOR WORKING";
  byId["website-sow-itemized-signed-lg"].note =
    "Signed by LG Studio only. Prior working copy. Not the DocuSign package. Not executed.";
}

const agreements = (data.categories.find((c) => c.id === "agreements").items || []).filter(
  (i) => i.id !== "website-sow-itemized-redline"
);
const redline = byId["website-sow-itemized-redline"];
if (redline) {
  redline.note =
    "SUPERSEDED itemized redline. Retained for record. Not the file to sign.";
}

const referral = (data.categories.find((c) => c.id === "review").items || []).filter(
  (i) => i.id !== "kitchen-review"
);

const sources = [
  {
    id: "practice-areas-source",
    title: "Practice-area content",
    href: "kitchen/costello/documents/sources/website/PRACTICE-AREAS_2026-09-13.docx",
    status: "CURRENT SOURCE",
    documentState: "SOURCE",
    role: "source",
    updatedAt: "2026-09-13",
    authorship: "Costello / Nari",
    provenance: "Recovered from Outlook · Nari · 13 September 2026",
    relatedWorkstream: "website",
    note: "Client-supplied practice-area source. Current website source of record."
  },
  {
    id: "faq-baseline",
    title: "FAQ baseline · Kris edits",
    href: "kitchen/costello/documents/sources/website/FAQ-BASELINE-KC-EDITS_2026-09-12.docx",
    status: "CURRENT SOURCE",
    documentState: "SOURCE",
    role: "source",
    updatedAt: "2026-09-12",
    authorship: "Costello / Kris edits",
    provenance: "Recovered from Outlook · 12 September 2026",
    relatedWorkstream: "website",
    note: "Filed FAQ baseline. Later amended by the 13 September website-page-changes email record. Duplicate DOH clarification still open.",
    actions: [
      {
        label: "Open email amendment",
        href: "kitchen/costello/documents/sources/email-records/WEBSITE-PAGE-CHANGES_2026-09-13.md"
      }
    ]
  },
  {
    id: "faq-email-amendment",
    title: "FAQ + website edits · email record",
    href: "kitchen/costello/documents/sources/email-records/WEBSITE-PAGE-CHANGES_2026-09-13.md",
    status: "EMAIL RECORD",
    documentState: "SOURCE",
    role: "source",
    updatedAt: "2026-09-13",
    authorship: "Costello correspondence",
    provenance: "Preserved email record · 13 September 2026",
    relatedWorkstream: "website",
    note: "Email record amending FAQ order, quote language, and Resolution → Results. Companion to the FAQ baseline. Not a Word source file."
  },
  {
    id: "bios-baseline",
    title: "Bios · reference baseline",
    href: "kitchen/costello/documents/sources/website/BIOS-REFERENCE-BASELINE_2026-08-28.docx",
    status: "BASELINE SOURCE",
    documentState: "SOURCE",
    role: "source",
    updatedAt: "2026-08-28",
    authorship: "Costello / Kris",
    provenance: "Recovered from Outlook · 28 August 2026",
    relatedWorkstream: "website",
    note: "Approved/reference baseline. Not the forthcoming updated bios package. Do not treat as final."
  },
  {
    id: "home-about-copy",
    title: "Home + About website copy",
    href: "kitchen/costello/documents/sources/website/HOME-ABOUT-COPY_2026-08-18.docx",
    status: "HISTORICAL SOURCE",
    documentState: "SOURCE",
    role: "source",
    updatedAt: "2026-08-18",
    authorship: "Costello / Nari",
    provenance: "Recovered from Marketing Assets email · 18 August 2026",
    relatedWorkstream: "website",
    note: "Prior website/marketing source. Useful reference; confirm against current direction before reuse."
  },
  {
    id: "chambers-clf",
    title: "Chambers · firm submission",
    href: "kitchen/costello/documents/sources/reference/CHAMBERS-CLF-2027-FINAL.docx",
    status: "FINAL SOURCE",
    documentState: "SOURCE",
    role: "source",
    updatedAt: "2026-09-14",
    authorship: "Costello / Kris",
    provenance: "Recovered from Outlook · described as approved and final",
    relatedWorkstream: "brand",
    note: "Firm Chambers submission. Source/reference artifact. Handle as confidential firm material."
  },
  {
    id: "chambers-kris",
    title: "Chambers · Kris submission",
    href: "kitchen/costello/documents/sources/reference/CHAMBERS-KRIS-2027-FINAL.docx",
    status: "FINAL SOURCE",
    documentState: "SOURCE",
    role: "source",
    updatedAt: "2026-09-14",
    authorship: "Kris Costello",
    provenance: "Recovered from Outlook · described as approved and final",
    relatedWorkstream: "brand",
    note: "Kris Chambers submission. Source/reference artifact. Handle as confidential firm material."
  },
  {
    id: "taglines-philosophies",
    title: "Taglines / philosophies",
    href: "kitchen/costello/documents/sources/reference/TAGLINE-PHILOSOPHIES_v1.pdf",
    status: "REFERENCE SOURCE",
    documentState: "SOURCE",
    role: "source",
    updatedAt: "2026-09-14",
    authorship: "Prior writer input",
    provenance: "Recovered from Outlook",
    relatedWorkstream: "brand",
    note: "Historical writer input. Useful reference. Not automatically approved positioning."
  },
  {
    id: "representative-matters",
    title: "Representative matters",
    href: "kitchen/costello/documents/sources/reference/REPRESENTATIVE-MATTERS_2026-09-05.pdf",
    status: "REFERENCE SOURCE",
    documentState: "SOURCE",
    role: "source",
    updatedAt: "2026-09-05",
    authorship: "Costello",
    provenance: "Recovered from Outlook · 5 September 2026",
    relatedWorkstream: "brand",
    note: "Reference matters list. Chambers described as the more refined/current authority list."
  },
  {
    id: "clio-support-record",
    title: "Clio support instructions · email record",
    href: "kitchen/costello/documents/sources/email-records/CLIO-SUPPORT-INSTRUCTIONS_2026-07-27.md",
    status: "SOURCE RECEIVED · IMPLEMENTATION PATH OPEN",
    documentState: "SOURCE",
    role: "source",
    updatedAt: "2026-07-27",
    authorship: "Clio support / forwarded by Noelle",
    provenance: "Preserved email record · 27 July 2026",
    relatedWorkstream: "website",
    note: "Email/source record for Clio Grow domain mapping / hosting. Not a completed Clio intake integration plan. Implementation path remains open."
  },
  {
    id: "mailing-list-corrected",
    title: "Mailing list · corrected filed copy",
    href: "kitchen/costello/documents/sources/mailing/CLF-MAILING-LIST-CORRECTED_2026-09-11.xlsx",
    status: "FILED COPY · VERIFY PRODUCTION FINAL",
    documentState: "WORKING",
    role: "source",
    updatedAt: "2026-09-11",
    authorship: "Costello / Nari",
    provenance: "Recovered from Outlook · 11 September 2026",
    relatedWorkstream: "referralMailing",
    note: "Latest filed mailing spreadsheet. Filename is not treated as production-final confirmation. Verify before printer handoff."
  },
  {
    id: "external-reference-links",
    title: "External reference links · recovery record",
    href: "kitchen/costello/documents/sources/external/EXTERNAL-REFERENCE-LINKS.md",
    status: "EXTERNAL INDEX",
    documentState: "SOURCE",
    role: "source",
    updatedAt: "2026-09-14",
    authorship: "LG Studio recovery",
    note: "Index of recovered external SharePoint and prior-agency URLs. Open individual destinations from Reference."
  }
];

const briefings = [
  {
    id: "positioning-anchor-session",
    title: "Positioning Anchor · working session",
    href: "kitchen/costello/documents/briefings/CLF-Positioning-Anchor.html",
    status: "FOR REVIEW",
    documentState: "WORKING",
    role: "working",
    updatedAt: "2026-09-14",
    authorship: "LG Studio / Costello",
    relatedWorkstream: "brand",
    note: "Interactive working-session / presentation artifact. Not the forthcoming static one-page brief. Not approved."
  }
];

const strategyItems = [
  Object.assign({}, byId["launch-path"], {
    note: "Strategic HTML readout for the website launch path. Decision/strategy artifact, not a source document."
  })
].filter((item) => item && item.id);

const brandItems = [
  Object.assign({}, byId["brand-portal"], {
    note: "Canonical Costello brand HTML artifact. Reference explains it; Files holds it once. Working review. Not immutable doctrine."
  })
];

const assets = [
  {
    id: "social-nari-welcome",
    title: "Social welcome · Nari",
    href: "kitchen/costello/documents/sources/social/NARI-WELCOME.png",
    status: "SUPPORT ASSET",
    documentState: "SOURCE",
    role: "source",
    updatedAt: "2026-09-13",
    authorship: "Costello / Nari",
    note: "Supporting social asset. Not a substitute for the social-media deck."
  },
  {
    id: "social-wendy-welcome",
    title: "Social welcome · Wendy",
    href: "kitchen/costello/documents/sources/social/WENDY-WELCOME.png",
    status: "SUPPORT ASSET",
    documentState: "SOURCE",
    role: "source",
    updatedAt: "2026-09-13",
    authorship: "Costello / Nari",
    note: "Supporting social asset. Not a substitute for the social-media deck."
  }
];

const vendor = data.categories.find((c) => c.id === "vendor").items;
const archive = (data.categories.find((c) => c.id === "archive").items || []).slice();
if (redline) archive.unshift(redline);
archive.forEach((item) => {
  if (item.id === "prior-status") {
    delete item.supersededBy;
    item.note =
      "LG Studio · superseded. Inherited address. Historical programme status.";
  }
  if (item.id === "prior-mailing-timeline") {
    delete item.supersededBy;
    item.note =
      "LG Studio · superseded mailing timeline. Historical only. Not the current operating record.";
  }
});

data.categories = [
  { id: "agreements", label: "Agreement + Legal", items: agreements },
  { id: "review", label: "Referral Campaign", items: referral },
  { id: "sources", label: "Source + Reference Material", items: sources },
  { id: "briefings", label: "Briefings + Presentations", items: briefings },
  { id: "strategy", label: "Strategy + Decision Documents", items: strategyItems },
  { id: "brand", label: "Brand System", items: brandItems },
  { id: "assets", label: "Assets", items: assets },
  { id: "vendor", label: "Production / Vendors", items: vendor },
  { id: "archive", label: "Archive", items: archive }
];

data.expected = [
  {
    id: "updated-bios",
    label: "Updated bios package",
    status: "NOT FILED YET",
    note: "Baseline bios are filed. Updated package still outstanding."
  },
  {
    id: "mailing-list-production-final",
    label: "Mailing list · production-final confirmation",
    status: "TO CONFIRM",
    note: "Sep 11 corrected copy is filed. Confirm whether a later production-final list supersedes it before printer handoff."
  },
  {
    id: "social-deck-local",
    label: "Social-media deck · local PPTX",
    status: "EXTERNAL ONLY",
    note: "SharePoint source is linked from Reference. Local canonical PPTX not yet filed."
  },
  {
    id: "clio-implementation",
    label: "Clio intake · implementation path",
    status: "PATH OPEN",
    note: "Source instructions filed. Domain-mapping instructions are not a completed intake integration plan."
  },
  {
    id: "positioning-one-pager",
    label: "Positioning Anchor · static one-pager",
    status: "FORTHCOMING",
    note: "Working-session HTML is filed under Briefings. Static one-pager will become the canonical strategy artifact when ready."
  }
];

fs.writeFileSync(filesJson, JSON.stringify(data, null, 2) + "\n");

const missing = [];
data.categories.forEach((cat) => {
  (cat.items || []).forEach((item) => {
    if (!item.href || /\/$/.test(item.href)) return;
    const check = path.join(studioRoot, item.href);
    if (!fs.existsSync(check)) missing.push(item.id + " -> " + item.href);
  });
});

console.log(
  "categories",
  data.categories.map((c) => c.id + ":" + c.items.length).join(", ")
);
console.log("missing", missing.length ? missing.join("\n") : "none");
