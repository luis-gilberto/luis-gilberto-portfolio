export type ClaimStatus = "public-safe" | "with_care" | "internal" | "excluded";

export type ImplementationRow = {
  reactSection: string;
  dossierSection: string;
  sourceIds: string[];
  assets: string[];
  publicClaimStatus: ClaimStatus;
  notes?: string;
};

export const implementationMap: ImplementationRow[] = [
  {
    reactSection: "Hero",
    dossierSection: "06 Opening / Case frame + 09 storyboard 01 hero",
    sourceIds: ["SH-006", "SH-002", "SH-020", "SH-037", "SH-040", "SH-055"],
    assets: ["SP_Editorial_LGStudio_00 (SH-020)"],
    publicClaimStatus: "public-safe",
    notes: "Approved thesis + standfirst. Practice card 02 excluded.",
  },
  {
    reactSection: "60-second read",
    dossierSection: "07-60-SECOND-READ.md",
    sourceIds: ["SH-006", "SH-008", "SH-040", "SH-055"],
    assets: [],
    publicClaimStatus: "public-safe",
  },
  {
    reactSection: "Chapter 01 · The Practice",
    dossierSection: "06 §01 + 09 §01 + 04 map B",
    sourceIds: ["SH-005", "SH-006", "SH-020", "SH-021", "SH-022", "SH-023", "SH-039"],
    assets: ["SH-020 hero", "SH-021 beauty", "SH-022 styling", "SH-023 golden hour"],
    publicClaimStatus: "with_care",
    notes: "Photography published on Practice; Work-case crop clearance still open. Focal positions audited per frame.",
  },
  {
    reactSection: "Chapter 02 · The Read",
    dossierSection: "06 §02 + 09 §02",
    sourceIds: ["SH-006", "SH-007", "SH-008", "SH-024", "SH-038"],
    assets: ["SH-024 Erika working portrait"],
    publicClaimStatus: "with_care",
    notes: "Standalone Revelado packet missing. Quote published on Studio. Spanish quote untranslated.",
  },
  {
    reactSection: "Chapter 03 · The Direction",
    dossierSection: "06 §03 + 09 §03",
    sourceIds: ["SH-008", "SH-036"],
    assets: ["Typographic journey (no invented diagram)"],
    publicClaimStatus: "public-safe",
    notes: "Album mentioned as experience investment, not Folio Live.",
  },
  {
    reactSection: "Chapter 04 · The Language",
    dossierSection: "06 §04 + 09 §04 + VLS SH-040",
    sourceIds: ["SH-006", "SH-025", "SH-040", "SH-014", "SH-015"],
    assets: ["SH-025 application plate", "SH-014 logotype", "SH-015 mark"],
    publicClaimStatus: "with_care",
    notes: "Six-word lines harvested from VLS contents page. Brand Live = identity only. Internal SH-055 governor sentence omitted from public copy.",
  },
  {
    reactSection: "Chapter 05 · The Artifact",
    dossierSection: "06 §05 + 09 §05",
    sourceIds: ["SH-002", "SH-016", "SH-017", "SH-019", "SH-037", "SH-040"],
    assets: ["SH-016 album hero", "SH-017 encuadre crop", "SH-019 mobile crop"],
    publicClaimStatus: "public-safe",
    notes: "10×10 and fifteen-spread labeled as specs. No physical book photo. SH-018 unused alternate.",
  },
  {
    reactSection: "Chapter 06 · Folio",
    dossierSection: "06 §06 + SH-055",
    sourceIds: ["SH-016", "SH-040", "SH-055", "SH-003", "SH-004"],
    assets: ["SH-003/004 homepage composite"],
    publicClaimStatus: "with_care",
    notes: "Public names anonymized. Print stills / invoices missing. CL-009 quarantined.",
  },
  {
    reactSection: "Chapter 07 · Where it is now",
    dossierSection: "06 §07",
    sourceIds: ["SH-001", "SH-002", "SH-006", "SH-008", "SH-037", "SH-040", "SH-055"],
    assets: [],
    publicClaimStatus: "public-safe",
    notes: "Internal structural note and Practice card 02 omitted. Closing line from dossier.",
  },
  {
    reactSection: "Closing CTA",
    dossierSection: "LG Studio case-study close (CSC)",
    sourceIds: [],
    assets: [],
    publicClaimStatus: "public-safe",
    notes: "Existing Studio close CTA. Not new Sharnay copy.",
  },
  {
    reactSection: "ES route /es",
    dossierSection: "11-SPANISH-SOURCE-MAP.md + folio-es.ts",
    sourceIds: ["SH-055"],
    assets: [],
    publicClaimStatus: "internal",
    notes: "Architecture only. Folio ES harvested, not published.",
  },
  {
    reactSection: "Homepage Selected Work card",
    dossierSection: "08-HOMEPAGE-WORK-CARD.md",
    sourceIds: ["SH-002", "SH-003", "SH-004"],
    assets: ["sharnay-homepage-composite"],
    publicClaimStatus: "public-safe",
  },
];
