## 2025-12-05

- Updated "Work That Mattered" insights articles:
  - Modified hero title color to white (#FFFFFF) for Microsoft case study pages to improve visibility and contrast (WCAG AA compliant).
  - Affected pages: `family-safety-launch`, `free-to-be-free`, `teams-consumer-launch`, `transforming-browsing-ai`, `edge-ucational-series`, `edge-mobile-rebrand`.
  - Verified changes locally and updated `TheHub/STYLE_GUIDE.md` with new specific guidelines.

## 2025-12-03

- Hub Architecture: corrected dead links on main pages to
  `https://luis-gilberto.com/TheHub/*` destinations (IMC Services, Advisory,
  StrategyIQ, ScopeIQ) and ensured same-tab navigation.
- Updated `TheHub/hub-integration-component.js` navigation URLs to absolute
  HTTPS paths for consistency and reliability.
- Verified all target pages return HTTP 200 responses.
- Confirmed all updated links use HTTPS to avoid mixed content warnings.
- Previewed locally at `http://localhost:5520/TheHub/index.html` for sanity checks.
