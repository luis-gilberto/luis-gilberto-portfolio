/**
 * work-nav.js — Canonical nav component for /work/ case study pages
 * Luis Gilberto ecosystem · v1.0
 *
 * USAGE: Add one script tag before </body>:
 *   <script src="/assets/js/work-nav.js" defer></script>
 *
 * ACTIVE STATE: Add data-active="portfolio|insights|hub|portal" to <body>
 *   to highlight the correct nav trigger. Portfolio is default.
 *
 * READING PROGRESS: Add <div id="progress"></div> anywhere in <body>
 *   and the component will drive it automatically.
 *
 * THEME: Reads/writes localStorage key 'lg-theme'. Dark is default for
 *   work pages. Logo swaps: AUg_logo_White.png / Logomark_White_a.png
 *   (these are single-asset — no light/dark swap needed for portfolio surface).
 */

(function () {
  'use strict';

  // ─────────────────────────────────────────────
  // 1. CSS
  // ─────────────────────────────────────────────
  const css = `
    :root {
      --wn-coral:  #F96F6E;
      --wn-teal:   #4BADA8;
      --wn-h:      64px;
    }

    #work-nav-header {
      position: sticky;
      top: 0;
      z-index: 500;
      width: 100%;
      background: rgba(8,8,8,0.0);
      backdrop-filter: blur(0px);
      -webkit-backdrop-filter: blur(0px);
      border-bottom: 1px solid transparent;
      transition: background 0.3s, border-color 0.3s, box-shadow 0.3s, backdrop-filter 0.3s;
    }
    #work-nav-header.wn-scrolled {
      background: rgba(8,8,8,0.95);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom-color: rgba(255,255,255,0.07);
      box-shadow: 0 1px 0 rgba(255,255,255,0.04);
    }
    [data-theme="light"] #work-nav-header.wn-scrolled {
      background: rgba(250,250,248,0.96);
      border-bottom-color: rgba(0,0,0,0.08);
      box-shadow: 0 1px 0 rgba(0,0,0,0.05);
    }
    .wn-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: var(--wn-h);
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 48px;
    }
    .wn-logo-link { text-decoration: none; display: flex; align-items: center; }
    #wn-logo-desktop { display: block; height: 28px; width: auto; }
    #wn-logo-mark    { display: none;  height: 28px; width: auto; }

    /* Desktop nav */
    .wn-desktop-nav {
      display: flex; align-items: center; gap: 2px; position: relative;
    }
    .wn-nav-link {
      font-family: 'Inter', sans-serif;
      font-size: 13px; font-weight: 500; letter-spacing: 0.04em;
      color: rgba(250,247,244,0.55);
      text-decoration: none; padding: 8px 14px; border-radius: 6px;
      transition: color 0.15s, background 0.15s;
      display: inline-flex; align-items: center; gap: 4px;
      background: none; border: none; cursor: pointer; white-space: nowrap;
    }
    [data-theme="light"] .wn-nav-link { color: rgba(26,23,20,0.55); }
    .wn-nav-link:hover { color: rgba(250,247,244,0.9); background: rgba(250,247,244,0.06); }
    [data-theme="light"] .wn-nav-link:hover { color: rgba(26,23,20,0.9); background: rgba(26,23,20,0.05); }
    .wn-nav-link.wn-active { color: var(--wn-coral); }
    .wn-nav-link .wn-chevron { width: 12px; height: 12px; transition: transform 300ms ease; flex-shrink: 0; }
    .wn-nav-link[aria-expanded="true"] { color: rgba(250,247,244,0.9); background: rgba(250,247,244,0.06); }
    [data-theme="light"] .wn-nav-link[aria-expanded="true"] { color: rgba(26,23,20,0.9); background: rgba(26,23,20,0.05); }
    .wn-nav-link[aria-expanded="true"] .wn-chevron { transform: rotate(180deg); }

    /* Dropdown viewport */
    .wn-viewport {
      position: absolute; left: 50%; top: calc(100% + 8px);
      transform: translateX(-50%); pointer-events: none; z-index: 600;
    }
    .wn-viewport-inner {
      background: #1A1714;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px;
      box-shadow: 0 16px 48px rgba(0,0,0,0.6), 0 4px 12px rgba(0,0,0,0.3);
      transform-origin: top center;
      opacity: 0; transform: scale(0.96) translateY(-6px);
      pointer-events: none;
      transition: opacity 180ms ease, transform 180ms ease;
      overflow: hidden;
    }
    [data-theme="light"] .wn-viewport-inner {
      background: #FFFFFF;
      border-color: rgba(0,0,0,0.1);
      box-shadow: 0 16px 48px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.08);
    }
    .wn-viewport-inner.wn-open { opacity: 1; transform: scale(1) translateY(0); pointer-events: auto; }
    .wn-panel { display: none; }
    .wn-panel.wn-active { display: block; }

    /* Panel shared styles */
    .wn-panel-wrap { padding: 6px; width: 520px; }
    .wn-panel-wrap.wn-wide { width: 560px; }
    .wn-panel-wrap.wn-narrow { width: 400px; }
    .wn-panel-header {
      padding: 16px 16px 10px; border-bottom: 1px solid rgba(255,255,255,0.07); margin-bottom: 6px;
    }
    [data-theme="light"] .wn-panel-header { border-bottom-color: rgba(0,0,0,0.07); }
    .wn-panel-label {
      font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 600;
      letter-spacing: 0.15em; text-transform: uppercase; color: var(--wn-coral);
      display: flex; align-items: center; gap: 8px; margin-bottom: 4px;
    }
    .wn-panel-label::before { content: ''; display: block; width: 20px; height: 1px; background: var(--wn-coral); }
    .wn-panel-title {
      font-family: 'Playfair Display', 'Cormorant Garamond', Georgia, serif;
      font-size: 22px; font-weight: 500; line-height: 1.2;
      color: rgba(250,247,244,0.95);
    }
    [data-theme="light"] .wn-panel-title { color: rgba(26,23,20,0.95); }
    .wn-panel-grid { display: grid; grid-template-columns: 1fr; gap: 4px; padding: 4px; }
    .wn-panel-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; padding: 4px; }
    .wn-panel-item {
      display: flex; align-items: flex-start; gap: 12px;
      padding: 12px; border-radius: 8px; text-decoration: none;
      transition: background 0.15s;
    }
    .wn-panel-item:hover { background: rgba(250,247,244,0.06); }
    [data-theme="light"] .wn-panel-item:hover { background: rgba(26,23,20,0.05); }
    .wn-panel-item:hover .wn-item-icon { border-color: var(--wn-coral); color: var(--wn-coral); }
    .wn-item-icon {
      flex-shrink: 0; width: 40px; height: 40px;
      display: flex; align-items: center; justify-content: center;
      border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;
      background: rgba(255,255,255,0.04); color: rgba(250,247,244,0.4);
      transition: border-color 0.15s, color 0.15s, background 0.15s;
    }
    [data-theme="light"] .wn-item-icon {
      border-color: rgba(0,0,0,0.1); background: rgba(0,0,0,0.03); color: rgba(26,23,20,0.4);
    }
    .wn-item-icon svg { width: 18px; height: 18px; }
    .wn-item-icon.wn-teal:hover,
    .wn-panel-item:hover .wn-item-icon.wn-teal { border-color: var(--wn-teal) !important; color: var(--wn-teal) !important; }
    .wn-item-text { flex: 1; min-width: 0; }
    .wn-item-title {
      font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600;
      color: rgba(250,247,244,0.9); margin-bottom: 2px;
    }
    [data-theme="light"] .wn-item-title { color: rgba(26,23,20,0.9); }
    .wn-item-desc {
      font-family: 'Inter', sans-serif; font-size: 11px;
      color: rgba(250,247,244,0.4); line-height: 1.5;
    }
    [data-theme="light"] .wn-item-desc { color: rgba(26,23,20,0.45); }
    .wn-item-role {
      display: inline-block; margin-top: 4px;
      font-family: 'Inter', sans-serif; font-size: 9px; font-weight: 700;
      letter-spacing: 0.12em; text-transform: uppercase; color: var(--wn-coral); opacity: 0.8;
    }
    .wn-panel-footer {
      border-top: 1px solid rgba(255,255,255,0.07); padding: 12px 16px;
      display: flex; align-items: center; justify-content: space-between;
    }
    [data-theme="light"] .wn-panel-footer { border-top-color: rgba(0,0,0,0.07); }
    .wn-panel-footer-text {
      font-family: 'Inter', sans-serif; font-size: 12px; color: rgba(250,247,244,0.35);
    }
    [data-theme="light"] .wn-panel-footer-text { color: rgba(26,23,20,0.4); }
    .wn-panel-footer-link {
      font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600;
      color: var(--wn-coral); text-decoration: none;
      display: flex; align-items: center; gap: 4px; transition: gap 0.15s;
    }
    .wn-panel-footer-link:hover { gap: 8px; }

    /* Portal panel */
    .wn-portal-features { padding: 12px 16px 8px; display: flex; flex-direction: column; gap: 2px; }
    .wn-portal-feature {
      display: flex; align-items: center; gap: 10px; padding: 9px 6px; border-radius: 6px;
      font-family: 'Inter', sans-serif; font-size: 12px; color: rgba(250,247,244,0.45);
      transition: background 0.15s;
    }
    [data-theme="light"] .wn-portal-feature { color: rgba(26,23,20,0.5); }
    .wn-portal-feature:hover { background: rgba(250,247,244,0.05); color: rgba(250,247,244,0.8); }
    .wn-portal-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--wn-teal); flex-shrink: 0; }
    .wn-portal-cta {
      margin: 8px 10px 10px;
      background: rgba(250,247,244,0.06);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 6px; padding: 14px 16px;
      display: flex; align-items: center; justify-content: space-between; gap: 12px;
    }
    [data-theme="light"] .wn-portal-cta {
      background: rgba(26,23,20,0.9); border-color: transparent;
    }
    .wn-portal-cta-label {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 16px; font-style: italic;
      color: rgba(250,247,244,0.9); line-height: 1.2;
    }
    .wn-portal-cta-btn {
      font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 700;
      letter-spacing: 0.08em; text-transform: uppercase;
      color: #080808; background: var(--wn-teal);
      padding: 8px 14px; border-radius: 4px; text-decoration: none;
      white-space: nowrap; transition: background 0.15s;
    }
    .wn-portal-cta-btn:hover { background: #3d9e9a; }

    /* Header CTAs */
    .wn-ctas { display: flex; align-items: center; gap: 8px; }
    .wn-theme-btn {
      background: none; border: 1px solid rgba(255,255,255,0.15); border-radius: 6px;
      width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: rgba(250,247,244,0.5); transition: all 0.15s; flex-shrink: 0;
    }
    [data-theme="light"] .wn-theme-btn { border-color: rgba(0,0,0,0.12); color: rgba(26,23,20,0.5); }
    .wn-theme-btn:hover { border-color: rgba(250,247,244,0.4); color: rgba(250,247,244,0.9); }
    [data-theme="light"] .wn-theme-btn:hover { border-color: rgba(0,0,0,0.25); color: rgba(26,23,20,0.9); }
    .wn-mobile-toggle {
      display: none; background: none; border: 1px solid rgba(255,255,255,0.15);
      border-radius: 6px; width: 36px; height: 36px;
      align-items: center; justify-content: center;
      cursor: pointer; color: rgba(250,247,244,0.5);
    }
    [data-theme="light"] .wn-mobile-toggle { border-color: rgba(0,0,0,0.12); color: rgba(26,23,20,0.5); }

    /* ── MOBILE DRAWER ── */
    #wn-mobile-menu {
      display: none; position: fixed;
      inset: 0; top: var(--wn-h); z-index: 490;
      background: rgba(8,8,8,0.97);
      backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
      flex-direction: column;
      border-top: 1px solid rgba(255,255,255,0.07);
      overflow-y: auto;
    }
    [data-theme="light"] #wn-mobile-menu { background: rgba(245,240,235,0.97); }
    #wn-mobile-menu.wn-open { display: flex; }

    /* Series grid section */
    .wn-drawer-series {
      padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.07);
      position: relative;
    }
    [data-theme="light"] .wn-drawer-series { border-bottom-color: rgba(0,0,0,0.07); }
    .wn-drawer-series::before {
      content: ''; position: absolute; top: 0; left: 0;
      width: 2px; height: 100%; background: var(--wn-coral);
      border-radius: 0 2px 2px 0;
    }
    .wn-drawer-section-label {
      font-family: 'Inter', sans-serif;
      font-size: 9px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;
      color: var(--wn-coral); margin-bottom: 14px;
      display: flex; align-items: center; gap: 8px;
    }
    .wn-drawer-section-label::before { content: ''; display: block; width: 14px; height: 1px; background: var(--wn-coral); }
    .wn-drawer-series-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .wn-drawer-series-card {
      background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px; padding: 14px 12px;
      text-decoration: none; display: flex; flex-direction: column; gap: 10px;
      transition: all 0.2s; position: relative; overflow: hidden;
    }
    [data-theme="light"] .wn-drawer-series-card {
      background: #FFFFFF; border-color: rgba(0,0,0,0.08);
      box-shadow: 0 1px 4px rgba(0,0,0,0.04);
    }
    .wn-drawer-series-card::after {
      content: ''; position: absolute; bottom: 0; left: 0; right: 0;
      height: 2px; background: var(--wn-coral);
      transform: scaleX(0); transform-origin: left; transition: transform 0.2s ease;
    }
    .wn-drawer-series-card:hover {
      border-color: rgba(249,111,110,0.4);
      box-shadow: 0 4px 16px rgba(249,111,110,0.12);
      transform: translateY(-2px);
    }
    .wn-drawer-series-card:hover::after { transform: scaleX(1); }
    .wn-drawer-series-icon {
      width: 32px; height: 32px; border-radius: 8px;
      background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
      display: flex; align-items: center; justify-content: center; transition: all 0.2s;
    }
    [data-theme="light"] .wn-drawer-series-icon { background: rgba(0,0,0,0.04); border-color: rgba(0,0,0,0.08); }
    .wn-drawer-series-icon svg {
      width: 15px; height: 15px; stroke: rgba(250,247,244,0.45); fill: none;
      stroke-width: 1.75; stroke-linecap: round; stroke-linejoin: round; transition: stroke 0.2s;
    }
    [data-theme="light"] .wn-drawer-series-icon svg { stroke: rgba(26,23,20,0.45); }
    .wn-drawer-series-card:hover .wn-drawer-series-icon { background: var(--wn-coral); border-color: var(--wn-coral); }
    .wn-drawer-series-card:hover .wn-drawer-series-icon svg { stroke: #fff; }
    .wn-drawer-series-title { font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600; color: rgba(250,247,244,0.9); line-height: 1.3; }
    [data-theme="light"] .wn-drawer-series-title { color: rgba(26,23,20,0.9); }
    .wn-drawer-series-desc  { font-family: 'Inter', sans-serif; font-size: 10px; color: rgba(250,247,244,0.4); line-height: 1.4; margin-top: -4px; }
    [data-theme="light"] .wn-drawer-series-desc { color: rgba(26,23,20,0.45); }

    /* Global ecosystem links */
    .wn-drawer-global { padding: 16px 24px; }
    .wn-drawer-global-label {
      font-family: 'Inter', sans-serif; font-size: 9px; font-weight: 700;
      letter-spacing: 0.18em; text-transform: uppercase;
      color: rgba(250,247,244,0.3); margin-bottom: 8px;
    }
    [data-theme="light"] .wn-drawer-global-label { color: rgba(26,23,20,0.35); }
    .wn-drawer-global-link {
      display: flex; align-items: center; gap: 12px;
      padding: 11px 0; border-bottom: 1px solid rgba(255,255,255,0.06);
      text-decoration: none; transition: all 0.15s;
    }
    [data-theme="light"] .wn-drawer-global-link { border-bottom-color: rgba(0,0,0,0.06); }
    .wn-drawer-global-link:last-child { border-bottom: none; }
    .wn-drawer-global-icon {
      width: 34px; height: 34px; border-radius: 8px;
      background: rgba(255,255,255,0.04);
      display: flex; align-items: center; justify-content: center; transition: all 0.15s;
    }
    [data-theme="light"] .wn-drawer-global-icon { background: rgba(0,0,0,0.04); }
    .wn-drawer-global-icon svg {
      width: 15px; height: 15px; stroke: rgba(250,247,244,0.4); fill: none;
      stroke-width: 1.75; stroke-linecap: round; stroke-linejoin: round; transition: stroke 0.15s;
    }
    [data-theme="light"] .wn-drawer-global-icon svg { stroke: rgba(26,23,20,0.4); }
    .wn-drawer-global-link:hover .wn-drawer-global-icon svg { stroke: var(--wn-teal); }
    .wn-drawer-global-link.wn-drawer-active .wn-drawer-global-icon svg { stroke: var(--wn-coral); }
    .wn-drawer-global-text {
      font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
      color: rgba(250,247,244,0.5); transition: color 0.15s;
    }
    [data-theme="light"] .wn-drawer-global-text { color: rgba(26,23,20,0.55); }
    .wn-drawer-global-link:hover .wn-drawer-global-text { color: rgba(250,247,244,0.9); }
    [data-theme="light"] .wn-drawer-global-link:hover .wn-drawer-global-text { color: rgba(26,23,20,0.9); }
    .wn-drawer-global-link.wn-drawer-active .wn-drawer-global-text { color: var(--wn-coral); font-weight: 600; }

    /* Drawer footer */
    .wn-drawer-footer {
      padding: 14px 24px; border-top: 1px solid rgba(255,255,255,0.07);
      display: flex; align-items: center; justify-content: space-between;
      flex-shrink: 0; margin-top: auto;
    }
    [data-theme="light"] .wn-drawer-footer { border-top-color: rgba(0,0,0,0.07); }
    .wn-drawer-status { display: flex; align-items: center; gap: 8px; }
    .wn-drawer-status-dot {
      width: 6px; height: 6px; background: var(--wn-teal); border-radius: 50%;
      box-shadow: 0 0 6px rgba(75,173,168,0.5);
      animation: wn-pulse 2s infinite;
    }
    .wn-drawer-status-label {
      font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 600;
      letter-spacing: 0.06em; text-transform: uppercase; color: rgba(250,247,244,0.35);
    }
    [data-theme="light"] .wn-drawer-status-label { color: rgba(26,23,20,0.4); }
    @keyframes wn-pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

    /* Responsive */
    @media (max-width: 1024px) {
      .wn-desktop-nav { display: none; }
      .wn-mobile-toggle { display: flex; }
      #wn-logo-desktop { display: none; }
      #wn-logo-mark    { display: block; }
    }
    @media (max-width: 768px) {
      .wn-inner { padding: 0 24px; }
    }
  `;

  // ─────────────────────────────────────────────
  // 2. HTML
  // ─────────────────────────────────────────────
  const CHEVRON = `<svg class="wn-chevron" viewBox="0 0 15 15" fill="none" aria-hidden="true"><path d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"/></svg>`;

  const html = `
<header id="work-nav-header">
  <div class="wn-inner">

    <a href="/" class="wn-logo-link">
      <img id="wn-logo-desktop" src="/assets/images/AUg_logo_White.png" alt="Luis Gilberto">
      <img id="wn-logo-mark"    src="/assets/images/Logomark_White_a.png" alt="Luis Gilberto">
    </a>

    <nav class="wn-desktop-nav" id="wn-desktop-nav" aria-label="Main navigation">

      <button id="wn-trigger-portfolio" class="wn-nav-link" aria-haspopup="true" aria-expanded="false" aria-controls="wn-panel-portfolio" data-wn-trigger>
        Portfolio ${CHEVRON}
      </button>
      <button id="wn-trigger-insights" class="wn-nav-link" aria-haspopup="true" aria-expanded="false" aria-controls="wn-panel-insights" data-wn-trigger>
        Insights ${CHEVRON}
      </button>
      <button id="wn-trigger-hub" class="wn-nav-link" aria-haspopup="true" aria-expanded="false" aria-controls="wn-panel-hub" data-wn-trigger>
        The Hub ${CHEVRON}
      </button>
      <button id="wn-trigger-portal" class="wn-nav-link" aria-haspopup="true" aria-expanded="false" aria-controls="wn-panel-portal" data-wn-trigger style="padding:4px 8px;">
        <img id="wn-portal-logo" src="/assets/images/TheLGPortal_dark-mode.png" alt="The Portal" style="height:20px;width:auto;display:block;">
        ${CHEVRON}
      </button>

      <div class="wn-viewport" id="wn-viewport">
        <div class="wn-viewport-inner" id="wn-viewport-inner">

          <!-- PORTFOLIO -->
          <div id="wn-panel-portfolio" class="wn-panel">
            <div class="wn-panel-wrap">
              <div class="wn-panel-header">
                <p class="wn-panel-label">Portfolio</p>
                <p class="wn-panel-title">Work, story &amp; process</p>
              </div>
              <div class="wn-panel-grid">
                <a href="/myexperience.html" class="wn-panel-item">
                  <div class="wn-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg></div>
                  <div class="wn-item-text"><p class="wn-item-title">Work &amp; Experience</p><p class="wn-item-desc">15+ years across Microsoft, startups, and beyond</p></div>
                </a>
                <a href="/timeline.html" class="wn-panel-item">
                  <div class="wn-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="4"/><polyline points="6 10 12 4 18 10"/></svg></div>
                  <div class="wn-item-text"><p class="wn-item-title">Career Timeline</p><p class="wn-item-desc">The eras, pivots, and moments that shaped the work</p></div>
                </a>
                <a href="/about.html" class="wn-panel-item">
                  <div class="wn-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg></div>
                  <div class="wn-item-text"><p class="wn-item-title">About Luis</p><p class="wn-item-desc">From Caracas to Cascadia. the full story</p></div>
                </a>
                <a href="/contact.html" class="wn-panel-item">
                  <div class="wn-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
                  <div class="wn-item-text"><p class="wn-item-title">Contact</p><p class="wn-item-desc">Start a conversation or collaboration</p></div>
                </a>
              </div>
              <div class="wn-panel-footer">
                <span class="wn-panel-footer-text">Caracas meets Cascadia</span>
                <a href="/" class="wn-panel-footer-link">Visit portfolio <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px;"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></a>
              </div>
            </div>
          </div>

          <!-- INSIGHTS -->
          <div id="wn-panel-insights" class="wn-panel">
            <div class="wn-panel-wrap">
              <div class="wn-panel-header">
                <p class="wn-panel-label">Insights</p>
                <p class="wn-panel-title">Browse by Series</p>
              </div>
              <div class="wn-panel-grid">
                <a href="/insights/series/#building" class="wn-panel-item">
                  <div class="wn-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg></div>
                  <div class="wn-item-text"><p class="wn-item-title">The Building Series</p><p class="wn-item-desc">Architecture, systems, and editorial decisions</p></div>
                </a>
                <a href="/insights/series/#strategic" class="wn-panel-item">
                  <div class="wn-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
                  <div class="wn-item-text"><p class="wn-item-title">Strategic Lens</p><p class="wn-item-desc">IMC blueprints and real product launch strategies</p></div>
                </a>
                <a href="/insights/series/#directors" class="wn-panel-item">
                  <div class="wn-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg></div>
                  <div class="wn-item-text"><p class="wn-item-title">Director's Commentary</p><p class="wn-item-desc">What I was actually thinking behind the decisions</p></div>
                </a>
                <a href="/insights/series/#reflections" class="wn-panel-item">
                  <div class="wn-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></div>
                  <div class="wn-item-text"><p class="wn-item-title">Reflections</p><p class="wn-item-desc">Creativity, pace, and the quiet decisions</p></div>
                </a>
              </div>
              <div class="wn-panel-footer">
                <span class="wn-panel-footer-text">4 series · 13 articles</span>
                <a href="/insights/series/" class="wn-panel-footer-link">Browse all series <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px;"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></a>
              </div>
            </div>
          </div>

          <!-- HUB -->
          <div id="wn-panel-hub" class="wn-panel">
            <div class="wn-panel-wrap wn-wide">
              <div class="wn-panel-header">
                <p class="wn-panel-label">The Hub</p>
                <p class="wn-panel-title">Three arms. One system.</p>
              </div>
              <div class="wn-panel-grid-2">
                <a href="/TheHub/strategy-iq/" class="wn-panel-item">
                  <div class="wn-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg></div>
                  <div class="wn-item-text"><p class="wn-item-title">StrategyIQ™</p><p class="wn-item-desc">Diagnostic engine and maturity benchmarking</p><span class="wn-item-role">Strategic Intelligence</span></div>
                </a>
                <a href="/TheHub/advisory/" class="wn-panel-item">
                  <div class="wn-item-icon wn-teal"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
                  <div class="wn-item-text"><p class="wn-item-title">Advisory</p><p class="wn-item-desc">Direct access to Luis. leadership alignment and clarity</p><span class="wn-item-role">Partnership</span></div>
                </a>
                <a href="/TheHub/studio.html" class="wn-panel-item">
                  <div class="wn-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
                  <div class="wn-item-text"><p class="wn-item-title">The Studio</p><p class="wn-item-desc">High-fidelity execution. ideas into tangible assets</p><span class="wn-item-role">Creative Production</span></div>
                </a>
                <a href="https://portal.luis-gilberto.com/" target="_blank" rel="noopener" class="wn-panel-item">
                  <div class="wn-item-icon wn-teal"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
                  <div class="wn-item-text"><p class="wn-item-title">The Portal ↗</p><p class="wn-item-desc">Secure command center. where client work lives</p><span class="wn-item-role">Client Access</span></div>
                </a>
              </div>
              <div class="wn-panel-footer">
                <span class="wn-panel-footer-text">Intelligence over intuition</span>
                <a href="/TheHub/" class="wn-panel-footer-link">Explore The Hub <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px;"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></a>
              </div>
            </div>
          </div>

          <!-- PORTAL -->
          <div id="wn-panel-portal" class="wn-panel">
            <div class="wn-panel-wrap wn-narrow">
              <div class="wn-panel-header">
                <p class="wn-panel-label">The Portal</p>
                <p class="wn-panel-title">Your command center</p>
              </div>
              <div class="wn-portal-features">
                <div class="wn-portal-feature"><div class="wn-portal-dot"></div>Strategy tools &amp; StrategyIQ engine</div>
                <div class="wn-portal-feature"><div class="wn-portal-dot"></div>Shared project workspaces</div>
                <div class="wn-portal-feature"><div class="wn-portal-dot"></div>Direct access to Luis &amp; Advisory</div>
                <div class="wn-portal-feature"><div class="wn-portal-dot"></div>Progress tracking &amp; deliverables</div>
              </div>
              <div class="wn-portal-cta">
                <p class="wn-portal-cta-label">Ready to enter<br>the ecosystem?</p>
                <a href="https://portal.luis-gilberto.com/auth/signup" target="_blank" rel="noopener" class="wn-portal-cta-btn">Request Access</a>
              </div>
              <div class="wn-panel-footer">
                <span class="wn-panel-footer-text">Existing client?</span>
                <a href="https://portal.luis-gilberto.com/auth/signin" target="_blank" rel="noopener" class="wn-panel-footer-link">Sign in <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px;"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </nav>

    <div class="wn-ctas">
      <button class="wn-theme-btn" id="wn-theme-btn" aria-label="Toggle light/dark mode">
        <svg id="wn-icon-sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        <svg id="wn-icon-moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      </button>
      <button class="wn-mobile-toggle" id="wn-mobile-toggle" aria-label="Toggle menu" aria-expanded="false">
        <svg id="wn-menu-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
    </div>
  </div>
</header>

<!-- MOBILE DRAWER -->
<div id="wn-mobile-menu">
  <div class="wn-drawer-series">
    <div class="wn-drawer-section-label">Browse Insights</div>
    <div class="wn-drawer-series-grid">
      <a href="/insights/series/#building" class="wn-drawer-series-card">
        <div class="wn-drawer-series-icon"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg></div>
        <div><div class="wn-drawer-series-title">Building Series</div><div class="wn-drawer-series-desc">Structural decisions</div></div>
      </a>
      <a href="/insights/series/#strategic" class="wn-drawer-series-card">
        <div class="wn-drawer-series-icon"><svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
        <div><div class="wn-drawer-series-title">Strategic Lens</div><div class="wn-drawer-series-desc">IMC blueprints</div></div>
      </a>
      <a href="/insights/series/#directors" class="wn-drawer-series-card">
        <div class="wn-drawer-series-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg></div>
        <div><div class="wn-drawer-series-title">Director's Cut</div><div class="wn-drawer-series-desc">Behind the decisions</div></div>
      </a>
      <a href="/insights/series/#reflections" class="wn-drawer-series-card">
        <div class="wn-drawer-series-icon"><svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></div>
        <div><div class="wn-drawer-series-title">Reflections</div><div class="wn-drawer-series-desc">Creativity &amp; pace</div></div>
      </a>
    </div>
  </div>
  <div class="wn-drawer-global">
    <div class="wn-drawer-global-label">Ecosystem</div>
    <a href="/" class="wn-drawer-global-link" id="wn-drawer-portfolio">
      <div class="wn-drawer-global-icon"><svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
      <span class="wn-drawer-global-text">Portfolio</span>
    </a>
    <a href="/insights/" class="wn-drawer-global-link" id="wn-drawer-insights">
      <div class="wn-drawer-global-icon"><svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></div>
      <span class="wn-drawer-global-text">Insights</span>
    </a>
    <a href="/TheHub/" class="wn-drawer-global-link" id="wn-drawer-hub">
      <div class="wn-drawer-global-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg></div>
      <span class="wn-drawer-global-text">The Hub</span>
    </a>
    <a href="https://portal.luis-gilberto.com/" target="_blank" rel="noopener" class="wn-drawer-global-link">
      <div class="wn-drawer-global-icon"><svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></div>
      <span class="wn-drawer-global-text">The Portal ↗</span>
    </a>
  </div>
  <div class="wn-drawer-footer">
    <div class="wn-drawer-status">
      <div class="wn-drawer-status-dot"></div>
      <span class="wn-drawer-status-label">Accepting Projects</span>
    </div>
  </div>
</div>
  `;

  // ─────────────────────────────────────────────
  // 3. INJECT CSS
  // ─────────────────────────────────────────────
  const style = document.createElement('style');
  style.id = 'work-nav-styles';
  style.textContent = css;
  document.head.appendChild(style);

  // ─────────────────────────────────────────────
  // 4. INJECT HTML before first child of body
  // ─────────────────────────────────────────────
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  document.body.insertBefore(wrapper.firstElementChild, document.body.firstChild); // header
  document.body.insertBefore(wrapper.firstElementChild, document.body.children[1]); // drawer

  // ─────────────────────────────────────────────
  // 5. THEME
  // ─────────────────────────────────────────────
  const iconSun  = document.getElementById('wn-icon-sun');
  const iconMoon = document.getElementById('wn-icon-moon');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('lg-theme', theme);
    iconSun.style.display  = theme === 'dark' ? 'none'  : 'block';
    iconMoon.style.display = theme === 'dark' ? 'block' : 'none';
    // Portal logo swap
    const pl = document.getElementById('wn-portal-logo');
    if (pl) pl.src = theme === 'dark'
      ? '/assets/images/TheLGPortal_dark-mode.png'
      : '/assets/images/TheLGPortal_light-mode.png';
  }

  const savedTheme = localStorage.getItem('lg-theme') || 'dark';
  applyTheme(savedTheme);

  document.getElementById('wn-theme-btn').addEventListener('click', () => {
    applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  // ─────────────────────────────────────────────
  // 6. ACTIVE STATE from body data-active attribute
  // ─────────────────────────────────────────────
  const activeChannel = document.body.dataset.active || 'portfolio';
  const activeTrigger = document.getElementById('wn-trigger-' + activeChannel);
  if (activeTrigger) activeTrigger.classList.add('wn-active');
  const activeDrawerLink = document.getElementById('wn-drawer-' + activeChannel);
  if (activeDrawerLink) activeDrawerLink.classList.add('wn-drawer-active');

  // ─────────────────────────────────────────────
  // 7. MEGA MENU LOGIC
  // ─────────────────────────────────────────────
  const viewportEl    = document.getElementById('wn-viewport');
  const viewportInner = document.getElementById('wn-viewport-inner');
  const desktopNav    = document.getElementById('wn-desktop-nav');
  const triggers      = document.querySelectorAll('[data-wn-trigger]');
  let   activeId = null, closeTimer = null;

  function openDropdown(trigger) {
    clearTimeout(closeTimer);
    const panelId = trigger.id.replace('wn-trigger-', 'wn-panel-');
    const panel   = document.getElementById(panelId);
    if (!panel) return;

    document.querySelectorAll('.wn-panel').forEach(p => p.classList.remove('wn-active'));
    panel.classList.add('wn-active');

    // Position viewport under trigger
    const tRect  = trigger.getBoundingClientRect();
    const nRect  = desktopNav.getBoundingClientRect();
    const mid    = tRect.left + tRect.width / 2 - nRect.left;
    viewportEl.style.left = mid + 'px';

    viewportInner.classList.add('wn-open');
    triggers.forEach(t => t.setAttribute('aria-expanded', 'false'));
    trigger.setAttribute('aria-expanded', 'true');
    activeId = trigger.id;
  }

  function closeDropdown() {
    closeTimer = setTimeout(() => {
      viewportInner.classList.remove('wn-open');
      document.querySelectorAll('.wn-panel').forEach(p => p.classList.remove('wn-active'));
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
  desktopNav.addEventListener('mouseleave', closeDropdown);
  viewportInner.addEventListener('mouseenter', () => clearTimeout(closeTimer));
  viewportInner.addEventListener('mouseleave', closeDropdown);
  document.addEventListener('click', e => { if (!desktopNav.contains(e.target)) closeDropdown(); });
  desktopNav.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeDropdown(); document.getElementById(activeId)?.focus(); }
  });

  // ─────────────────────────────────────────────
  // 8. MOBILE MENU
  // ─────────────────────────────────────────────
  const mobileToggle = document.getElementById('wn-mobile-toggle');
  const mobileMenu   = document.getElementById('wn-mobile-menu');
  const menuIcon     = document.getElementById('wn-menu-icon');
  let menuOpen = false;

  mobileToggle.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('wn-open', menuOpen);
    mobileToggle.setAttribute('aria-expanded', String(menuOpen));
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    menuIcon.innerHTML = menuOpen
      ? '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'
      : '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>';
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024 && menuOpen) {
      menuOpen = false;
      mobileMenu.classList.remove('wn-open');
      document.body.style.overflow = '';
    }
  });

  // ─────────────────────────────────────────────
  // 9. SCROLL: header state + reading progress
  // ─────────────────────────────────────────────
  const header      = document.getElementById('work-nav-header');
  const progressBar = document.getElementById('progress');

  function onScroll() {
    header.classList.toggle('wn-scrolled', window.scrollY > 10);
    if (progressBar) {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (total > 0 ? (window.scrollY / total) * 100 : 0) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ─────────────────────────────────────────────
  // 10. BODY PADDING: account for sticky header
  // ─────────────────────────────────────────────
  // Work pages use padding-top on body for the old nav-component.
  // We override it to match our 64px header height.
  document.body.style.paddingTop = 'var(--wn-h, 64px)';

})();
