# Cursor handoff — source reconciliation

Paste the following into Cursor after copying this recovery folder into the Costello repo:

```text
We have completed an Outlook source-recovery pass for the Costello project.

A recovery package has been added to the repo. Locate the folder containing:
- SOURCE-RECOVERY-LEDGER.md
- README.md
- website/
- reference/
- mailing/
- social/
- email-records/
- external/

The prior audit remains canonical:
studio/kitchen/costello/_audit/REFERENCE-FILES-RECONCILIATION.md

Do NOT redesign the portal yet.
Do NOT immediately move or rename source files.
Do NOT duplicate artifacts between Reference and Files.

First reconcile the recovery package against the audit.

CANONICAL MODEL

REFERENCE
“What we know, where it came from, and how it should be used.”

Reference is the provenance/context layer. It may point to a canonical file in Files, an external source, or a truthful status when no artifact exists.

FILES
“The actual documents, deliverables, and records behind the work.”

Files is the canonical artifact repository and should contain actual openable/downloadable records only.

RULE
FILES HOLDS THE THING.
REFERENCE EXPLAINS THE THING.
ONE ARTIFACT → ONE CANONICAL FILE.

TASK

1. Read SOURCE-RECOVERY-LEDGER.md completely.
2. Compare every recovered artifact with the existing repo inventory and the reconciliation audit.
3. Hash/compare files where useful before deciding something is a duplicate.
4. Identify which recovered files already exist in the repo under another name/path.
5. Do not create duplicate canonical copies.
6. For each recovered source, recommend its final canonical repo path.
7. For each Reference row, recommend exactly one state:
   - OPEN FILE
   - OPEN EXTERNAL
   - NOT FILED YET
   - UNAVAILABLE FROM PRIOR AGENCY
   - NEEDS REVIEW
8. Preserve these known nuances:
   - FAQ has a later 13 Sep email amendment and a duplicate DOH question still unresolved.
   - Bios file is a recovered approved/reference baseline, but an updated bios package remains outstanding. Do not call it final.
   - Chambers CLF and Kris submissions were described by Kris as approved and final.
   - Representative matters are reference material; Chambers is described as the more refined/current source.
   - The Clio record is recovered, but it describes domain mapping to a Clio Grow-hosted site. The firm later clarified it wants Clio intake and is not committed to Clio site hosting. Integration path remains open.
   - The Sep 11 mailing spreadsheet is the latest recovered filed copy, but later correspondence anticipated a Monday production-final list. Do not silently mark it production-final.
   - The social PowerPoint is currently an external SharePoint source, not a local PPTX.
   - Prior-agency Framer/project source is confirmed unavailable from the prior agency. Do not label it as if Luis simply failed to file it.
9. Identify workspace pages currently masquerading as files and recommend removal from Files.
10. Identify status-only stubs that should leave Files.

OUTPUT ONLY A RECONCILIATION REPORT FIRST:

A. RECOVERED SOURCES NOW SATISFYING AUDIT GAPS
B. RECOVERED SOURCES THAT DUPLICATE EXISTING REPO FILES
C. FINAL CANONICAL PATH RECOMMENDATIONS
D. REFERENCE ROW → FILE / EXTERNAL / STATUS MAPPING
E. FILES STUBS TO REMOVE
F. WORKSPACE PAGES TO REMOVE FROM FILES
G. SOURCES STILL GENUINELY OUTSTANDING
H. HUMAN DECISIONS STILL REQUIRED
I. EXACT FILES YOU WOULD MODIFY IN THE LATER WIRING PASS

Do not implement the wiring until I review this report.
```
