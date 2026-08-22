#!/usr/bin/env python3
import re
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent
html = (ROOT / "index.html").read_text(encoding="utf-8")
ops = html.split('id="operations"')[1].split("</section>")[0]

expected = [
    ("Rhythm (hero left)", "operations__ops-tile__41", "rhythm", "https://res.cloudinary.com/dogtoagya/image/upload/v1787144089/Rhyth_landscape_gbxcnk.png"),
    ("Governance (top right)", "operations__ops-tile__44", "governance", "https://res.cloudinary.com/dogtoagya/image/upload/v1787141054/governance_pm2qti.png"),
    ("Workspace (mid right)", "operations__ops-tile__46", "workspace", "https://res.cloudinary.com/dogtoagya/image/upload/v1787141053/CSC_workspace_evi1vq.png"),
    ("Production (lower left)", "operations__ops-tile__43", "production", "https://res.cloudinary.com/dogtoagya/image/upload/v1787141056/Roadmap_mberfg.png"),
    ("Protected access (lower right)", "operations__ops-tile__45", "protected", "https://res.cloudinary.com/dogtoagya/image/upload/v1787141055/protected_access_ziohwh.png"),
    ("Measurement (bottom wide)", "operations__ops-tile__42", "measurement", "https://res.cloudinary.com/dogtoagya/image/upload/v1787141058/CSC_Report_sizlxo.png"),
]

print("BEHIND THE SCREEN verification")
print("-" * 60)
all_ok = True
for label, iid, slot, url in expected:
    slot_ok = f'data-ops-slot="{slot}"' in ops and f'data-csc-img="{iid}"' in ops and url in ops
    try:
        req = urllib.request.Request(url, method="HEAD")
        with urllib.request.urlopen(req, timeout=15) as r:
            http = r.status
    except Exception as e:
        http = getattr(e, "code", "ERR")
    ok = slot_ok and http == 200
    all_ok = all_ok and ok
    print(f"{'OK' if ok else '!!'} {label}")
    print(f"   id={iid} slot={slot} html={slot_ok} http={http}")

local = re.findall(r"evidence/[^\"']+", ops)
print("-" * 60)
print("local evidence refs:", local or "none")
print("all checks pass:", all_ok)
