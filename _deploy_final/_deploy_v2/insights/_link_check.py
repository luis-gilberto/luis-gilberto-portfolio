import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import sys
import os

BASE = "http://localhost:8000/"
INSIGHTS_DIR = r"C:\\Users\\luisg\\OneDrive\\Documents\\Luis Gilberto\\insights"
INDEX_PATH = os.path.join(INSIGHTS_DIR, "index.html")
INDEX2_PATH = os.path.join(INSIGHTS_DIR, "index-2.html")
REPORT_PATH = os.path.join(INSIGHTS_DIR, "link-validation-report.txt")

# Helper to classify links
def is_external(url):
    parsed = urlparse(url)
    if not parsed.scheme:
        return False
    # Treat fully-qualified URLs not pointing to localhost as external
    return parsed.netloc not in ("localhost", "[::]", "127.0.0.1")

# Fetch page content from server and from files
resp = requests.get(urljoin(BASE, "index.html"), timeout=15)
resp.raise_for_status()
html_live = resp.text

with open(INDEX_PATH, "r", encoding="utf-8", errors="ignore") as f:
    html_src = f.read()

with open(INDEX2_PATH, "r", encoding="utf-8", errors="ignore") as f:
    html_prev = f.read()

soup_live = BeautifulSoup(html_live, "html.parser")
soup_src = BeautifulSoup(html_src, "html.parser")
soup_prev = BeautifulSoup(html_prev, "html.parser")

links_live = [(a.get_text(strip=True), a.get("href"), a) for a in soup_live.find_all("a")]
links_src = [(a.get_text(strip=True), a.get("href"), a) for a in soup_src.find_all("a")]
links_prev = [(a.get_text(strip=True), a.get("href"), a) for a in soup_prev.find_all("a")]

# Build sets for comparison
set_src = {href for _, href, _ in links_src if href}
set_prev = {href for _, href, _ in links_prev if href}

added = sorted(set_src - set_prev)
removed = sorted(set_prev - set_src)

results = []
errors = []
redirects = []
https_warnings = []
attr_warnings = []

for text, href, tag in links_live:
    if not href:
        continue
    test_url = href
    # Resolve relative URLs against BASE for live validation
    if not urlparse(href).scheme:
        test_url = urljoin(BASE, href)
    # Determine link type
    external = is_external(test_url)
    # Validate attributes
    target = tag.get("target")
    rel = tag.get("rel")
    if external:
        if target != "_blank":
            attr_warnings.append(f"External link missing target=_blank: {href} (text='{text}')")
        rel_str = "" if rel is None else " ".join(rel)
        if "noopener" not in rel_str or "noreferrer" not in rel_str:
            attr_warnings.append(f"External link missing rel noopener noreferrer: {href} (text='{text}')")
    else:
        if target and target != "_self":
            attr_warnings.append(f"Internal link should not use target='{target}': {href} (text='{text}')")

    # Request HEAD then GET if needed
    try:
        head = requests.head(test_url, allow_redirects=True, timeout=15)
        status = head.status_code
        chain = [r.url for r in head.history] + [head.url]
        if len(chain) > 1:
            redirects.append((href, len(chain)-1, chain))
        final_url = head.url
        # HTTPS compliance for external links
        if external:
            if urlparse(final_url).scheme != "https":
                https_warnings.append(f"External link not HTTPS (final): {href} -> {final_url}")
        # If HEAD not OK, try GET
        if status >= 400:
            get = requests.get(test_url, allow_redirects=True, timeout=20)
            status = get.status_code
            final_url = get.url
        results.append((text, href, status, final_url))
        if status >= 400:
            errors.append(f"Broken link {href} (text='{text}') status={status} final={final_url}")
    except Exception as e:
        errors.append(f"Error requesting {href} (text='{text}'): {e}")

# Build report
lines = []
lines.append("Link Validation Report for insights/index.html")
lines.append("")
lines.append("Summary:")
lines.append(f"- Total links (live parsed): {len(links_live)}")
lines.append(f"- Errors: {len(errors)}")
lines.append(f"- Redirect chains: {len(redirects)}")
lines.append(f"- HTTPS warnings: {len(https_warnings)}")
lines.append(f"- Attribute warnings: {len(attr_warnings)}")
lines.append("")
lines.append("Changes vs index-2.html:")
lines.append(f"- Added: {added}")
lines.append(f"- Removed: {removed}")
lines.append("")

lines.append("Detailed Results:")
for text, href, status, final in results:
    lines.append(f"* '{text}' -> {href} | status={status} | final={final}")

if redirects:
    lines.append("")
    lines.append("Redirect Chains:")
    for href, count, chain in redirects:
        lines.append(f"- {href} ({count} redirects): {' -> '.join(chain)}")

if https_warnings:
    lines.append("")
    lines.append("HTTPS Compliance Warnings:")
    for w in https_warnings:
        lines.append(f"- {w}")

if attr_warnings:
    lines.append("")
    lines.append("Attribute Warnings:")
    for w in attr_warnings:
        lines.append(f"- {w}")

if errors:
    lines.append("")
    lines.append("Errors:")
    for e in errors:
        lines.append(f"- {e}")

with open(REPORT_PATH, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

print("Report written to:", REPORT_PATH)
