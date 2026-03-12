# Case Study Nav — Glass Refactor & Mobile Menu (Trae: read this and ship)

**Owner:** Luis Gilberto • **Implementer:** Trae**  
Apply to **Family Safety** first, then replicate to all case studies.

## Summary
Neutral “glass” chrome replaces coral UI. Add article hamburger like the main site. Keep: mini‑TOC (desktop) / mobile bar (mobile), top progress, desktop “Next →” pill. Remove legacy nav (scroll‑for‑more, inline back‑to‑top, old dots/bars).

## How to integrate
1) Add HTML blocks (mini‑TOC, progress div, mobile bar, article header + hamburger) per snippet below.
2) Include `case-nav.css` in the bundle; include `case-nav.js` before `</body>`.
3) Ensure section IDs exactly match: `story, highlights, my-role, results, gallery, credits`.
4) Delete old nav elements from article bodies.
5) QA on iOS Safari + Android Chrome + desktop.

### HTML — mini‑TOC (under hero)
<nav class="case-toc" aria-label="Article sections">
  <button data-target="#story">Story</button>
  <button data-target="#highlights">Highlights</button>
  <button data-target="#my-role">My Role</button>
  <button data-target="#results">Results</button>
  <button data-target="#gallery">Gallery</button>
  <button data-target="#credits">Credits</button>
</nav>

### HTML — progress (first child in <body>)
<div class="read-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"></div>

### HTML — mobile bottom bar (before </body>)
<nav class="case-mobilebar" aria-label="Quick actions">
  <button class="toc-open" aria-label="Table of contents">TOC</button>
  <button class="jump-up" aria-label="Back to top">Up</button>
  <div class="progress-read" aria-live="polite">0%</div>
  <button class="share" aria-label="Share link">Share</button>
  <button class="jump-end" aria-label="Skip to results">End</button>
</nav>

### HTML — article header + hamburger (top of template)
<header class="article-header">
  <button class="hamburger" aria-label="Open menu" aria-expanded="false" aria-controls="mobileMenu">
    <span></span><span></span><span></span>
  </button>
  <a class="brandmark" href="/" aria-label="Go to homepage">
    <img src="/path/to/your/logo-mark.svg" alt="" height="22">
  </a>
</header>
<nav id="mobileMenu" class="mobile-menu" aria-hidden="true">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about-integrated-marketing-expert/">About Me</a></li>
    <li><a href="/my-experience/">CV</a></li>
    <li><a href="/portfolio/">Timeline</a></li>
    <li><a href="/myexperience/">Experience</a></li>
    <li><a href="/contact/">Contact</a></li>
  </ul>
</nav>

### Include assets
<link rel="stylesheet" href="/assets/css/case-nav.css">
<script src="/assets/js/case-nav.js" defer></script>

### Cleanup checklist
- Remove “scroll for more,” inline “back to top,” old progress dots/bars, redundant floaters.
- Verify: smooth offset scroll; Next pill on desktop only; bottom bar shows after hero on mobile; lightbox returns to same scroll; hamburger ESC/backdrop close.

### Commit message
Refactor case‑study nav: neutral glass chrome, add article hamburger, standardize section IDs, remove legacy nav. Family Safety first; replicate site‑wide.
