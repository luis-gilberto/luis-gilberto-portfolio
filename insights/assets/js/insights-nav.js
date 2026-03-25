/**
 * insights-nav.js
 * Canonical navigation component for the Insights channel.
 * Drop one <script> tag into any Insights page to inject the full nav.
 *
 * Usage:
 *   1. Remove all inline header/nav/mobile-drawer HTML from the page.
 *   2. Add before </body>:
 *        <script src="/insights/assets/js/insights-nav.js"></script>
 *   3. Pass optional config via data attributes on the script tag:
 *        data-active="insights"      — highlights the active nav item (insights|portfolio|hub|portal)
 *        data-series="strategic"     — highlights the active series card in mobile drawer
 *                                      (building|strategic|directors|reflections)
 *        data-breadcrumb             — JSON array: [["label","url"],["label","url"],"Current Page"]
 *
 * Tokens injected automatically:
 *   - Theme (light/dark) via localStorage key "lg-theme"
 *   - Logo swap on theme change
 *   - Mega-menu open/close, keyboard nav, outside-click close
 *   - Mobile drawer open/close
 *   - Header scroll shadow
 */

(() => {
  /* ─────────────────────────────────────────────────────────────────────────
     0. CONFIG — read from script tag data attributes
  ───────────────────────────────────────────────────────────────────────── */
  const $script       = document.currentScript;
  const activeChannel = $script?.dataset.active   || 'insights';   // insights|portfolio|hub|portal
  const activeSeries  = $script?.dataset.series   || '';           // building|use-cases|reflections
  const breadcrumbRaw = $script?.dataset.breadcrumb || '';

  /* ─────────────────────────────────────────────────────────────────────────
     1. STYLES
  ───────────────────────────────────────────────────────────────────────── */
  const CSS = `
    .ins-header *, .ins-header *::before, .ins-header *::after { box-sizing: border-box; margin: 0; padding: 0; }

    /* Tokens — light defaults */
    :root {
      --ins-bg:         #F5F0EB;
      --ins-ink:        #1A1714;
      --ins-ink-soft:   #6B6560;
      --ins-coral:      #F96F6E;
      --ins-teal:       #4BADA8;
      --ins-cream:      #FAF7F4;
      --ins-rule:       #D9D2CB;
      --ins-card-bg:    #FFFFFF;
      --ins-accent-bg:  rgba(26,23,20,0.06);
      --ins-header-h:   64px;
      /* Mega-menu surface — warm dark glass, never pure white */
      --ins-popover-bg:     rgba(28,24,20,0.96);
      --ins-popover-border: rgba(255,255,255,0.10);
      --ins-popover-shadow: 0 12px 48px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.25);
    }
    [data-theme="dark"] {
      --ins-bg:         #1A1714;
      --ins-ink:        #FAF7F4;
      --ins-ink-soft:   #A09890;
      --ins-cream:      #221E1B;
      --ins-card-bg:    #2A2420;
      --ins-rule:       #3A3430;
      --ins-accent-bg:  rgba(250,247,244,0.06);
      /* Dark mode: same dark-glass surface, slightly lighter */
      --ins-popover-bg:     rgba(36,30,26,0.97);
      --ins-popover-border: rgba(255,255,255,0.08);
    }

    /* ── Header ── */
    .ins-header {
      position: sticky; top: 0; z-index: 200;
      width: 100%;
      transition: background 0.3s, border-color 0.3s, box-shadow 0.3s;
      border-bottom: 1px solid transparent;
    }
    .ins-header.scrolled {
      background: rgba(245,240,235,0.95);
      backdrop-filter: blur(12px);
      border-bottom-color: var(--ins-rule);
      box-shadow: 0 1px 0 var(--ins-rule);
    }
    [data-theme="dark"] .ins-header.scrolled {
      background: rgba(26,23,20,0.95);
    }
    .ins-header-inner {
      display: flex; align-items: center; justify-content: space-between;
      height: var(--ins-header-h);
      max-width: 1280px; margin: 0 auto; padding: 0 48px;
    }
    .ins-logo-link { text-decoration: none; display: flex; align-items: center; }
    .ins-logo-desktop { display: block; height: 32px; width: auto; }
    .ins-logo-mark    { display: none;  height: 32px; width: auto; }

    /* ── Desktop nav ── */
    .ins-desktop-nav {
      display: flex; align-items: center; gap: 2px; position: relative;
    }
    .ins-nav-link {
      font-family: 'Inter', sans-serif;
      font-size: 13px; font-weight: 500; letter-spacing: 0.04em;
      color: var(--ins-ink-soft); text-decoration: none;
      padding: 8px 14px; border-radius: 6px;
      transition: color 0.15s, background 0.15s;
      display: inline-flex; align-items: center; gap: 4px;
      background: none; border: none; cursor: pointer; white-space: nowrap;
    }
    .ins-nav-link:hover { color: var(--ins-ink); background: var(--ins-accent-bg); }
    .ins-nav-link.active { color: var(--ins-coral); }
    .ins-nav-link .ins-chevron {
      width: 12px; height: 12px;
      transition: transform 300ms ease; flex-shrink: 0;
    }
    .ins-nav-link[aria-expanded="true"] { color: var(--ins-ink); background: var(--ins-accent-bg); }
    .ins-nav-link[aria-expanded="true"] .ins-chevron { transform: rotate(180deg); }

    /* ── Dropdown viewport ── */
    .ins-nav-viewport {
      position: absolute; left: 50%; top: calc(100% + 8px);
      transform: translateX(-50%);
      pointer-events: none; z-index: 300;
    }
    .ins-nav-viewport-inner {
      background: var(--ins-popover-bg);
      border: 1px solid var(--ins-popover-border);
      border-radius: 12px;
      box-shadow: var(--ins-popover-shadow);
      transform-origin: top center;
      opacity: 0; transform: scale(0.96) translateY(-6px);
      pointer-events: none;
      transition: opacity 180ms ease, transform 180ms ease;
      overflow: hidden;
    }
    .ins-nav-viewport-inner.open {
      opacity: 1; transform: scale(1) translateY(0);
      pointer-events: auto;
    }
    .ins-nav-content { display: none; }
    .ins-nav-content.active { display: block; }

    /* Panel sizing */
    .ins-panel-wrap { padding: 6px; }
    .ins-panel-wrap[data-channel="insights"]  { --ch: var(--ins-coral); width: 560px; }
    .ins-panel-wrap[data-channel="hub"]       { --ch: var(--ins-teal);  width: 600px; }
    .ins-panel-wrap[data-channel="portfolio"] { --ch: var(--ins-coral); width: 480px; }
    .ins-panel-wrap[data-channel="portal"]    { --ch: var(--ins-teal);  width: 400px; }

    /* Panel header */
    .ins-panel-header {
      padding: 16px 16px 10px;
      border-bottom: 1px solid rgba(255,255,255,0.08); margin-bottom: 6px;
    }
    .ins-panel-header-label {
      font-family: 'Inter', sans-serif;
      font-size: 10px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase;
      color: var(--ch);
      display: flex; align-items: center; gap: 8px; margin-bottom: 4px;
    }
    .ins-panel-header-label::before {
      content: ''; display: block; width: 20px; height: 1px; background: var(--ch);
    }
    .ins-panel-header-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 22px; font-weight: 500;
      color: rgba(250,247,244,0.92); line-height: 1.2;
    }

    /* Panel grids */
    .ins-panel-grid      { display: grid; grid-template-columns: 1fr;     gap: 4px; padding: 4px; }
    .ins-panel-grid-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; padding: 4px; }

    /* Panel item */
    .ins-panel-item {
      display: flex; align-items: flex-start;
      gap: 12px; padding: 12px; border-radius: 8px;
      text-decoration: none; transition: background 0.15s;
    }
    .ins-panel-item:hover { background: rgba(255,255,255,0.06); }
    .ins-item-icon {
      flex-shrink: 0; width: 40px; height: 40px;
      display: flex; align-items: center; justify-content: center;
      border: 1px solid rgba(255,255,255,0.12); border-radius: 8px;
      background: rgba(255,255,255,0.04); color: rgba(250,247,244,0.5);
      transition: border-color 0.15s, color 0.15s, background 0.15s;
    }
    .ins-item-icon svg { width: 18px; height: 18px; }
    .ins-panel-item:hover .ins-item-icon { border-color: var(--ch); color: var(--ch); background: rgba(249,111,110,0.08); }
    .ins-panel-item:hover .ins-item-icon.hub-advisory { background: rgba(75,173,168,0.08); border-color: var(--ins-teal); color: var(--ins-teal); }
    .ins-panel-item:hover .ins-item-icon.hub-studio   { background: rgba(249,111,110,0.08); border-color: var(--ins-coral); color: var(--ins-coral); }
    .ins-panel-item:hover .ins-item-icon.hub-portal   { background: rgba(75,173,168,0.08); border-color: var(--ins-teal); color: var(--ins-teal); }
    .ins-panel-item:hover .ins-item-icon.hub-home     { background: rgba(250,247,244,0.08); border-color: rgba(250,247,244,0.3); color: rgba(250,247,244,0.9); }
    .ins-item-text { flex: 1; min-width: 0; }
    .ins-item-title {
      font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600;
      color: rgba(250,247,244,0.88); margin-bottom: 2px;
    }
    .ins-item-desc {
      font-family: 'Inter', sans-serif; font-size: 11px;
      color: rgba(250,247,244,0.45); line-height: 1.5;
    }
    .ins-item-role {
      display: inline-block; margin-top: 4px;
      font-family: 'Inter', sans-serif; font-size: 9px; font-weight: 700;
      letter-spacing: 0.12em; text-transform: uppercase;
      color: var(--ch); opacity: 0.8;
    }

    /* Panel footer */
    .ins-panel-footer {
      border-top: 1px solid rgba(255,255,255,0.08); padding: 12px 16px;
      display: flex; align-items: center; justify-content: space-between;
    }
    .ins-panel-footer-text {
      font-family: 'Inter', sans-serif; font-size: 12px;
      color: rgba(250,247,244,0.35);
    }
    .ins-panel-footer-link {
      font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600;
      color: var(--ch); text-decoration: none;
      display: flex; align-items: center; gap: 4px; transition: gap 0.15s;
    }
    .ins-panel-footer-link:hover { gap: 8px; }

    /* Portal panel */
    .ins-portal-features { padding: 12px 16px 8px; display: flex; flex-direction: column; gap: 2px; }
    .ins-portal-feature {
      display: flex; align-items: center; gap: 10px; padding: 9px 6px; border-radius: 6px;
      font-family: 'Inter', sans-serif; font-size: 12px;
      color: rgba(250,247,244,0.5);
      transition: background 0.15s;
    }
    .ins-portal-feature:hover { background: rgba(255,255,255,0.05); color: rgba(250,247,244,0.85); }
    .ins-portal-feature-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--ins-teal); flex-shrink: 0; }
    .ins-portal-cta-strip {
      margin: 8px 10px 10px;
      background: rgba(75,173,168,0.12);
      border: 1px solid rgba(75,173,168,0.2);
      border-radius: 8px;
      padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px;
    }
    .ins-portal-cta-label {
      font-family: 'Cormorant Garamond', serif;
      font-size: 16px; font-style: italic;
      color: rgba(250,247,244,0.85); line-height: 1.2;
    }
    .ins-portal-cta-btn {
      font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 700;
      letter-spacing: 0.08em; text-transform: uppercase;
      color: #1A1714; background: var(--ins-teal);
      padding: 8px 14px; border-radius: 4px; text-decoration: none;
      white-space: nowrap; transition: background 0.15s;
    }
    .ins-portal-cta-btn:hover { background: #3d9e9a; }

    /* Header CTAs */
    .ins-header-ctas { display: flex; align-items: center; gap: 8px; }
    .ins-theme-btn {
      background: none; border: 1px solid var(--ins-rule); border-radius: 6px;
      width: 36px; height: 36px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: var(--ins-ink-soft); transition: all 0.15s; flex-shrink: 0;
    }
    .ins-theme-btn:hover { border-color: var(--ins-ink-soft); color: var(--ins-ink); }
    .ins-mobile-toggle {
      display: none; background: none; border: 1px solid var(--ins-rule);
      border-radius: 6px; width: 36px; height: 36px;
      align-items: center; justify-content: center;
      cursor: pointer; color: var(--ins-ink-soft);
    }

    @media (max-width: 1024px) {
      .ins-desktop-nav  { display: none; }
      .ins-header-ctas .ins-mobile-toggle { display: flex; }
      .ins-logo-desktop { display: none; }
      .ins-logo-mark    { display: block; }
    }
    @media (max-width: 768px) { .ins-header-inner { padding: 0 24px; } }

    /* ── Mobile drawer ── */
    .ins-mobile-menu {
      display: none; position: fixed;
      inset: 0; top: var(--ins-header-h); z-index: 199;
      background: rgba(245,240,235,0.97);
      backdrop-filter: blur(12px);
      flex-direction: column;
      border-top: 1px solid var(--ins-rule);
      overflow-y: auto;
    }
    [data-theme="dark"] .ins-mobile-menu { background: rgba(26,23,20,0.97); }
    .ins-mobile-menu.open { display: flex; }

    .ins-drawer-series-section {
      padding: 20px 24px; border-bottom: 1px solid var(--ins-rule); position: relative;
    }
    .ins-drawer-series-section::before {
      content: ''; position: absolute; top: 0; left: 0;
      width: 2px; height: 100%; background: var(--ins-coral);
      border-radius: 0 2px 2px 0;
    }
    .ins-drawer-section-label {
      font-family: 'Inter', sans-serif;
      font-size: 9px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;
      color: var(--ins-coral); margin-bottom: 14px;
      display: flex; align-items: center; gap: 8px;
    }
    .ins-drawer-section-label::before {
      content: ''; display: block; width: 14px; height: 1px; background: var(--ins-coral);
    }
    .ins-drawer-series-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .ins-drawer-series-card {
      background: var(--ins-card-bg); border: 1px solid var(--ins-rule);
      border-radius: 10px; padding: 14px 12px;
      text-decoration: none; display: flex; flex-direction: column; gap: 10px;
      transition: all 0.2s; position: relative; overflow: hidden;
    }
    .ins-drawer-series-card::after {
      content: ''; position: absolute; bottom: 0; left: 0; right: 0;
      height: 2px; background: var(--ins-coral);
      transform: scaleX(0); transform-origin: left; transition: transform 0.2s ease;
    }
    .ins-drawer-series-card:hover, .ins-drawer-series-card.active {
      border-color: rgba(249,111,110,0.4);
      box-shadow: 0 4px 16px rgba(249,111,110,0.1);
      transform: translateY(-2px);
    }
    .ins-drawer-series-card:hover::after, .ins-drawer-series-card.active::after { transform: scaleX(1); }
    .ins-drawer-series-icon {
      width: 32px; height: 32px; border-radius: 8px;
      background: var(--ins-bg); border: 1px solid var(--ins-rule);
      display: flex; align-items: center; justify-content: center; transition: all 0.2s;
    }
    .ins-drawer-series-icon svg {
      width: 15px; height: 15px; stroke: var(--ins-ink-soft); fill: none;
      stroke-width: 1.75; stroke-linecap: round; stroke-linejoin: round; transition: stroke 0.2s;
    }
    .ins-drawer-series-card:hover .ins-drawer-series-icon,
    .ins-drawer-series-card.active .ins-drawer-series-icon { background: var(--ins-coral); border-color: var(--ins-coral); }
    .ins-drawer-series-card:hover .ins-drawer-series-icon svg,
    .ins-drawer-series-card.active .ins-drawer-series-icon svg { stroke: #fff; }
    .ins-drawer-series-title { font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600; color: var(--ins-ink); line-height: 1.3; }
    .ins-drawer-series-desc  { font-family: 'Inter', sans-serif; font-size: 10px; color: var(--ins-ink-soft); line-height: 1.4; margin-top: -4px; }

    .ins-drawer-global-section { padding: 16px 24px; }
    .ins-drawer-global-label {
      font-family: 'Inter', sans-serif; font-size: 9px; font-weight: 700;
      letter-spacing: 0.18em; text-transform: uppercase;
      color: var(--ins-ink-soft); opacity: 0.6; margin-bottom: 8px;
    }
    .ins-drawer-global-link {
      display: flex; align-items: center; gap: 12px;
      padding: 11px 0; border-bottom: 1px solid rgba(217,210,203,0.5);
      text-decoration: none; transition: all 0.15s;
    }
    .ins-drawer-global-link:last-child { border-bottom: none; }
    .ins-drawer-global-icon {
      width: 34px; height: 34px; border-radius: 8px;
      background: rgba(26,23,20,0.04);
      display: flex; align-items: center; justify-content: center; transition: all 0.15s;
    }
    .ins-drawer-global-icon svg {
      width: 15px; height: 15px; stroke: var(--ins-ink-soft); fill: none;
      stroke-width: 1.75; stroke-linecap: round; stroke-linejoin: round; transition: stroke 0.15s;
    }
    .ins-drawer-global-link:hover .ins-drawer-global-icon svg { stroke: var(--ins-teal); }
    .ins-drawer-global-link.drawer-active .ins-drawer-global-icon svg { stroke: var(--ins-coral); }
    .ins-drawer-global-text {
      font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
      color: var(--ins-ink-soft); transition: color 0.15s;
    }
    .ins-drawer-global-link:hover .ins-drawer-global-text { color: var(--ins-ink); }
    .ins-drawer-global-link.drawer-active .ins-drawer-global-text { color: var(--ins-coral); font-weight: 600; }

    .ins-drawer-footer-strip {
      padding: 14px 24px; border-top: 1px solid var(--ins-rule);
      display: flex; align-items: center; justify-content: space-between;
      flex-shrink: 0; margin-top: auto;
    }
    .ins-drawer-status { display: flex; align-items: center; gap: 8px; }
    .ins-drawer-status-dot {
      width: 6px; height: 6px; background: var(--ins-teal); border-radius: 50%;
      box-shadow: 0 0 6px rgba(75,173,168,0.5); animation: ins-pulse 2s infinite;
    }
    .ins-drawer-status-label {
      font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 600;
      letter-spacing: 0.06em; text-transform: uppercase; color: var(--ins-ink-soft);
    }
    @keyframes ins-pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
  `;

  /* ─────────────────────────────────────────────────────────────────────────
     2. HTML
  ───────────────────────────────────────────────────────────────────────── */

  // Chevron SVG helper
  const chevron = `<svg class="ins-chevron" viewBox="0 0 15 15" fill="none" aria-hidden="true"><path d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"/></svg>`;

  // Arrow SVG for footer links
  const arrow = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px;"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`;

  const HTML = `
  <!-- ── Header ── -->
  <header class="ins-header" id="ins-site-header">
    <div class="ins-header-inner">

      <a href="/insights/" class="ins-logo-link">
        <img class="ins-logo-desktop" id="ins-logo-desktop"
             src="/insights/assets/images/Insights_logo_black.png"
             alt="Insights by Luis Gilberto">
        <img class="ins-logo-mark" id="ins-logo-mark"
             src="/insights/assets/images/LG-logomark-BlackCoral.png"
             alt="Insights">
      </a>

      <nav class="ins-desktop-nav" id="ins-desktop-nav" aria-label="Main navigation">

        <button id="ins-trigger-portfolio"
          class="ins-nav-link${activeChannel === 'portfolio' ? ' active' : ''}"
          aria-haspopup="true" aria-expanded="false"
          aria-controls="ins-content-portfolio" data-ins-trigger>
          Portfolio ${chevron}
        </button>

        <button id="ins-trigger-insights"
          class="ins-nav-link${activeChannel === 'insights' ? ' active' : ''}"
          aria-haspopup="true" aria-expanded="false"
          aria-controls="ins-content-insights" data-ins-trigger>
          Insights ${chevron}
        </button>

        <button id="ins-trigger-hub"
          class="ins-nav-link${activeChannel === 'hub' ? ' active' : ''}"
          aria-haspopup="true" aria-expanded="false"
          aria-controls="ins-content-hub" data-ins-trigger>
          The Hub ${chevron}
        </button>

        <button id="ins-trigger-portal"
          class="ins-nav-link${activeChannel === 'portal' ? ' active' : ''}"
          aria-haspopup="true" aria-expanded="false"
          aria-controls="ins-content-portal" data-ins-trigger
          style="padding:4px 8px;">
          <img id="ins-portal-logo-nav"
               src="/assets/images/TheLGPortal_dark-mode.png"
               alt="The Portal"
               style="height:32px;width:auto;display:block;">
          ${chevron}
        </button>

        <!-- Dropdown viewport -->
        <div class="ins-nav-viewport" id="ins-nav-viewport">
          <div class="ins-nav-viewport-inner" id="ins-nav-viewport-inner">

            <!-- PORTFOLIO panel -->
            <div id="ins-content-portfolio" class="ins-nav-content">
              <div class="ins-panel-wrap" data-channel="portfolio">
                <div class="ins-panel-header">
                  <p class="ins-panel-header-label">Portfolio</p>
                  <p class="ins-panel-header-title">Work, story &amp; process</p>
                </div>
                <div class="ins-panel-grid">
                  <a href="/myexperience.html" class="ins-panel-item">
                    <div class="ins-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg></div>
                    <div class="ins-item-text"><p class="ins-item-title">Work &amp; Experience</p><p class="ins-item-desc">15+ years across Microsoft, startups, and beyond</p></div>
                  </a>
                  <a href="/timeline.html" class="ins-panel-item">
                    <div class="ins-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="4"/><polyline points="6 10 12 4 18 10"/></svg></div>
                    <div class="ins-item-text"><p class="ins-item-title">Career Timeline</p><p class="ins-item-desc">The eras, pivots, and moments that shaped the work</p></div>
                  </a>
                  <a href="/about.html" class="ins-panel-item">
                    <div class="ins-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg></div>
                    <div class="ins-item-text"><p class="ins-item-title">About Luis</p><p class="ins-item-desc">From Caracas to Cascadia. the full story</p></div>
                  </a>
                  <a href="/contact.html" class="ins-panel-item">
                    <div class="ins-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
                    <div class="ins-item-text"><p class="ins-item-title">Contact</p><p class="ins-item-desc">Start a conversation or collaboration</p></div>
                  </a>
                </div>
                <div class="ins-panel-footer">
                  <span class="ins-panel-footer-text">Caracas meets Cascadia</span>
                  <a href="/" class="ins-panel-footer-link">Visit portfolio ${arrow}</a>
                </div>
              </div>
            </div>

            <!-- INSIGHTS panel -->
            <div id="ins-content-insights" class="ins-nav-content">
              <div class="ins-panel-wrap" data-channel="insights">
                <div class="ins-panel-header">
                  <p class="ins-panel-header-label">Insights</p>
                  <p class="ins-panel-header-title">Browse by Series</p>
                </div>
                <div class="ins-panel-grid">
                  <a href="/insights/series/#building" class="ins-panel-item">
                    <div class="ins-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg></div>
                    <div class="ins-item-text"><p class="ins-item-title">The Building Series</p><p class="ins-item-desc">Building in public. Structural decisions behind the work</p></div>
                  </a>
                  <a href="/insights/series/#strategic" class="ins-panel-item">
                    <div class="ins-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
                    <div class="ins-item-text"><p class="ins-item-title">Strategic Lens</p><p class="ins-item-desc">IMC blueprints and real product launch strategies</p></div>
                  </a>
                  <a href="/insights/series/#directors" class="ins-panel-item">
                    <div class="ins-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg></div>
                    <div class="ins-item-text"><p class="ins-item-title">Director's Commentary</p><p class="ins-item-desc">What I was actually thinking behind the decisions</p></div>
                  </a>
                  <a href="/insights/series/#reflections" class="ins-panel-item">
                    <div class="ins-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></div>
                    <div class="ins-item-text"><p class="ins-item-title">Reflections</p><p class="ins-item-desc">Creativity, pace, and the quiet decisions</p></div>
                  </a>
                </div>
                <div class="ins-panel-footer">
                  <a href="/insights/" class="ins-panel-footer-text" style="text-decoration:none; transition:color 0.15s;" onmouseover="this.style.color='var(--ins-coral)'" onmouseout="this.style.color=''">Insights Home</a>
                  <a href="/insights/series/" class="ins-panel-footer-link">Browse all series ${arrow}</a>
                </div>
              </div>
            </div>

            <!-- THE HUB panel -->
            <div id="ins-content-hub" class="ins-nav-content">
              <div class="ins-panel-wrap" data-channel="hub">
                <div class="ins-panel-header">
                  <p class="ins-panel-header-label">The Hub</p>
                  <p class="ins-panel-header-title">Three arms. One system.</p>
                </div>
                <div class="ins-panel-grid-2col">

                  <a href="/TheHub/" class="ins-panel-item">
                    <div class="ins-item-icon hub-home"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
                    <div class="ins-item-text"><p class="ins-item-title">Hub Home</p><p class="ins-item-desc">Overview of the full system</p><span class="ins-item-role">The Hub</span></div>
                  </a>

                  <a href="/TheHub/advisory/" class="ins-panel-item">
                    <div class="ins-item-icon hub-advisory"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
                    <div class="ins-item-text"><p class="ins-item-title">Advisory</p><p class="ins-item-desc">Direct access to Luis. leadership alignment and clarity</p><span class="ins-item-role">Partnership</span></div>
                  </a>

                  <a href="/TheHub/studio.html" class="ins-panel-item">
                    <div class="ins-item-icon hub-studio"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
                    <div class="ins-item-text"><p class="ins-item-title">The Studio</p><p class="ins-item-desc">High-fidelity execution. ideas into tangible assets</p><span class="ins-item-role">Production</span></div>
                  </a>

                  <a href="/portal/" class="ins-panel-item">
                    <div class="ins-item-icon hub-portal"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
                    <div class="ins-item-text"><p class="ins-item-title">The Portal</p><p class="ins-item-desc">A guided look inside the strategic command center behind the ecosystem.</p><span class="ins-item-role">System</span></div>
                  </a>

                </div>
                <div class="ins-panel-footer">
                  <span class="ins-panel-footer-text">Intelligence over intuition</span>
                  <a href="/TheHub/" class="ins-panel-footer-link">Explore The Hub ${arrow}</a>
                </div>
              </div>
            </div>

            <!-- PORTAL panel -->
            <div id="ins-content-portal" class="ins-nav-content">
              <div class="ins-panel-wrap" data-channel="portal">
                <div class="ins-panel-header">
                  <p class="ins-panel-header-label">The Portal</p>
                  <p class="ins-panel-header-title">Your command center</p>
                </div>
                <div class="ins-portal-features">
                  <div class="ins-portal-feature"><div class="ins-portal-feature-dot"></div>Shared project workspaces</div>
                  <div class="ins-portal-feature"><div class="ins-portal-feature-dot"></div>Direct access to Luis &amp; Advisory</div>
                  <div class="ins-portal-feature"><div class="ins-portal-feature-dot"></div>Progress tracking &amp; deliverables</div>
                </div>
                <div class="ins-portal-cta-strip">
                  <p class="ins-portal-cta-label">Ready to enter<br>the ecosystem?</p>
                  <a href="/portal/story/" class="ins-portal-cta-btn">See how this operates</a>
                </div>
                <div class="ins-panel-footer">
                  <span class="ins-panel-footer-text">Existing client?</span>
                  <a href="https://portal.luis-gilberto.com/auth/signin" target="_blank" rel="noopener" class="ins-panel-footer-link">Sign in ${arrow}</a>
                </div>
              </div>
            </div>

          </div><!-- /ins-nav-viewport-inner -->
        </div><!-- /ins-nav-viewport -->

      </nav>

      <div class="ins-header-ctas">
        <button class="ins-theme-btn" id="ins-theme-toggle" aria-label="Toggle light/dark mode">
          <svg id="ins-icon-sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          <svg id="ins-icon-moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        </button>
        <button class="ins-mobile-toggle" id="ins-mobile-toggle" aria-label="Toggle menu" aria-expanded="false">
          <svg id="ins-menu-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </div>

    </div><!-- /ins-header-inner -->
  </header>

  <!-- ── Mobile Drawer ── -->
  <div class="ins-mobile-menu" id="ins-mobile-menu">
    <div class="ins-drawer-series-section">
      <div class="ins-drawer-section-label">Browse Series</div>
      <div class="ins-drawer-series-grid">
        <a href="/insights/series/#building" class="ins-drawer-series-card${activeSeries === 'building' ? ' active' : ''}">
          <div class="ins-drawer-series-icon"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg></div>
          <div><div class="ins-drawer-series-title">The Building Series</div><div class="ins-drawer-series-desc">Structural decisions</div></div>
        </a>
        <a href="/insights/series/#strategic" class="ins-drawer-series-card${activeSeries === 'strategic' ? ' active' : ''}">
          <div class="ins-drawer-series-icon"><svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
          <div><div class="ins-drawer-series-title">Strategic Lens</div><div class="ins-drawer-series-desc">Launches &amp; strategy</div></div>
        </a>
        <a href="/insights/series/#directors" class="ins-drawer-series-card${activeSeries === 'directors' ? ' active' : ''}">
          <div class="ins-drawer-series-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg></div>
          <div><div class="ins-drawer-series-title">Director's Commentary</div><div class="ins-drawer-series-desc">Behind the decisions</div></div>
        </a>
        <a href="/insights/series/#reflections" class="ins-drawer-series-card${activeSeries === 'reflections' ? ' active' : ''}">
          <div class="ins-drawer-series-icon"><svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></div>
          <div><div class="ins-drawer-series-title">Reflections</div><div class="ins-drawer-series-desc">Creativity &amp; pace</div></div>
        </a>
        <a href="/insights/" class="ins-drawer-series-card">
          <div class="ins-drawer-series-icon"><svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></div>
          <div><div class="ins-drawer-series-title">All Stories</div><div class="ins-drawer-series-desc">Browse everything</div></div>
        </a>
      </div>
    </div>
    <div class="ins-drawer-global-section">
      <div class="ins-drawer-global-label">Ecosystem</div>
      <a href="/" class="ins-drawer-global-link${activeChannel === 'portfolio' ? ' drawer-active' : ''}">
        <div class="ins-drawer-global-icon"><svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
        <span class="ins-drawer-global-text">Portfolio</span>
      </a>
      <a href="/insights/" class="ins-drawer-global-link${activeChannel === 'insights' ? ' drawer-active' : ''}">
        <div class="ins-drawer-global-icon"><svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></div>
        <span class="ins-drawer-global-text">Insights</span>
      </a>
      <a href="/TheHub/" class="ins-drawer-global-link${activeChannel === 'hub' ? ' drawer-active' : ''}">
        <div class="ins-drawer-global-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg></div>
        <span class="ins-drawer-global-text">The Hub</span>
      </a>
      <a href="/portal/story/" class="ins-drawer-global-link${activeChannel === 'portal' ? ' drawer-active' : ''}">
        <div class="ins-drawer-global-icon"><svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
        <span class="ins-drawer-global-text">The Portal</span>
      </a>
    </div>
    <div class="ins-drawer-footer-strip">
      <div class="ins-drawer-status">
        <div class="ins-drawer-status-dot"></div>
        <span class="ins-drawer-status-label">Accepting Projects</span>
      </div>
    </div>
  </div>
  `;

  /* ─────────────────────────────────────────────────────────────────────────
     3. INJECT
  ───────────────────────────────────────────────────────────────────────── */

  // Inject styles
  const styleEl = document.createElement('style');
  styleEl.textContent = CSS;
  document.head.appendChild(styleEl);

  // Inject HTML at top of body
  const wrapper = document.createElement('div');
  wrapper.innerHTML = HTML;
  document.body.insertBefore(wrapper, document.body.firstChild);

  /* ─────────────────────────────────────────────────────────────────────────
     4. BEHAVIOUR
  ───────────────────────────────────────────────────────────────────────── */

  // ── Header scroll shadow ─────────────────────────────────────────────────
  const header = document.getElementById('ins-site-header');
  const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Theme toggle ─────────────────────────────────────────────────────────
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('lg-theme', theme);   // canonical key — hyphen not underscore

    const iconSun  = document.getElementById('ins-icon-sun');
    const iconMoon = document.getElementById('ins-icon-moon');
    if (iconSun)  iconSun.style.display  = theme === 'dark' ? 'none'  : 'block';
    if (iconMoon) iconMoon.style.display = theme === 'dark' ? 'block' : 'none';

    const ld = document.getElementById('ins-logo-desktop');
    if (ld) ld.src = theme === 'dark'
      ? '/insights/assets/images/Insights_logo_white.png'
      : '/insights/assets/images/Insights_logo_black.png';

    const lm = document.getElementById('ins-logo-mark');
    if (lm) lm.src = theme === 'dark'
      ? '/insights/assets/images/Symbol_mobile.png'
      : '/insights/assets/images/LG-logomark-BlackCoral.png';

    const pn = document.getElementById('ins-portal-logo-nav');
    if (pn) pn.src = theme === 'dark'
      ? '/assets/images/TheLGPortal_dark-mode.png'
      : '/assets/images/TheLGPortal_light-mode.png';
  }

  // Initialise from stored pref — default dark for Insights
  applyTheme(localStorage.getItem('lg-theme') || 'dark');

  document.getElementById('ins-theme-toggle')?.addEventListener('click', () => {
    applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  // ── Mega-menu ────────────────────────────────────────────────────────────
  const viewportWrap  = document.getElementById('ins-nav-viewport');
  const viewportInner = document.getElementById('ins-nav-viewport-inner');
  const triggers      = document.querySelectorAll('[data-ins-trigger]');
  const desktopNav    = document.getElementById('ins-desktop-nav');
  let activeId = null, closeTimer = null;

  function openDropdown(trigger) {
    clearTimeout(closeTimer);
    const panelId = trigger.id.replace('ins-trigger-', 'ins-content-');
    const panel   = document.getElementById(panelId);
    if (!panel) return;
    document.querySelectorAll('.ins-nav-content').forEach(p => p.classList.remove('active'));
    panel.classList.add('active');
    const triggerRect = trigger.getBoundingClientRect();
    const navRect     = desktopNav.getBoundingClientRect();
    const triggerMid  = triggerRect.left + triggerRect.width / 2 - navRect.left;
    if (viewportWrap) viewportWrap.style.left = triggerMid + 'px';
    viewportInner?.classList.add('open');
    triggers.forEach(t => t.setAttribute('aria-expanded', 'false'));
    trigger.setAttribute('aria-expanded', 'true');
    activeId = trigger.id;
  }

  function closeDropdown() {
    closeTimer = setTimeout(() => {
      viewportInner?.classList.remove('open');
      document.querySelectorAll('.ins-nav-content').forEach(p => p.classList.remove('active'));
      triggers.forEach(t => t.setAttribute('aria-expanded', 'false'));
      activeId = null;
    }, 120);
  }

  triggers.forEach(t => {
    t.addEventListener('mouseenter', () => openDropdown(t));
    t.addEventListener('click', e => {
      e.stopPropagation();
      activeId === t.id ? closeDropdown() : openDropdown(t);
    });
  });
  desktopNav?.addEventListener('mouseleave', closeDropdown);
  viewportInner?.addEventListener('mouseenter', () => clearTimeout(closeTimer));
  viewportInner?.addEventListener('mouseleave', closeDropdown);
  document.addEventListener('click', e => {
    if (desktopNav && !desktopNav.contains(e.target)) closeDropdown();
  });
  desktopNav?.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeDropdown(); document.getElementById(activeId)?.focus(); }
  });

  // ── Mobile drawer ────────────────────────────────────────────────────────
  let menuOpen = false;
  const mobileToggle = document.getElementById('ins-mobile-toggle');
  const mobileMenu   = document.getElementById('ins-mobile-menu');
  const menuIcon     = document.getElementById('ins-menu-icon');

  mobileToggle?.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu?.classList.toggle('open', menuOpen);
    mobileToggle.setAttribute('aria-expanded', String(menuOpen));
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    if (menuIcon) menuIcon.innerHTML = menuOpen
      ? `<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>`
      : `<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>`;
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024 && menuOpen) {
      menuOpen = false;
      mobileMenu?.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

})();
