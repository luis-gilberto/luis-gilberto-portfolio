## 2026-01-13

- **Edge-ucational Case Study Refactor (Cinematic Dark Mode)**
  - **Standardization**: Updated `case-study-edge-ucational.html` to match the global portfolio shell (Header, Subnav, Footer).
  - **Dark Mode Enforced**: Locked header and navigation to black (#050505) regardless of user theme preference, creating an immersive cinematic environment.
  - **Navigation**: Restored Sticky Table of Contents with active state tracking (ScrollSpy) and smooth scrolling.
  - **Visuals**: Updated logo to `AUg_logo_White.png` (48px, no filters) and enhanced Hero readability with deeper gradients.
  - **Cleanup**: Removed obsolete `insights/edge-ucational-series/index-1.html` and redundant CSS.
  - **Homepage**: Updated Teams Consumer Launch tile link to point to `/insights/teams-consumer-launch/`.

## 2026-01-12

- **Insights Landing Page Update (ULTIMO Version)**
  - Replaced `insights/index.html` with improved ULTIMO version.
  - **Mobile Fixes**: Solved menu "ghosting" issue and header transparency collisions on mobile devices.
  - **Accessibility**: Implemented semantic anchor tags for story cards.
  - **UX**: Enhanced Swiper.js navigation and responsive breakpoints.
  - **Deployment**: Deployed to Cloudflare with clean build process.

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

## 2025-12-06
- Promote Cloud Dancer to homepage (index.html) and keep index-legacy.html
- Universal theme toggle across breakpoints
- About Craftsman image preview page (about-preview.html)
- Cloudflare redirects and headers verified


## Deployment 2025-12-06 2025-12-06 03:52:26
- Implement feature updates and bug fixes
- Homepage promotion and theme toggle responsive fix
- Family Safety 'From Story to Screen' optimized video section
- About craftsman preview added

