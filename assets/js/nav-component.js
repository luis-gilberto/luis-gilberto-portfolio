/**
 * nav-component.js — Luis Gilberto site-wide navigation
 * ──────────────────────────────────────────────────────
 * Usage on any page:
 *
 *   <div id="site-nav" data-active="timeline"></div>
 *   <script src="/assets/js/nav-component.js"></script>
 *
 * data-active values:
 *   portfolio | experience | timeline | about | brand | contact
 *   insights  | hub        | portal
 *
 * For pages in subdirectories (e.g. /insights/):
 *   <div id="site-nav" data-active="insights" data-base="https://www.luis-gilberto.com"></div>
 *
 * The component injects:
 *   - <header class="site-header"> with canonical megamenu
 *   - <div class="mobile-menu"> canonical drawer
 *   - All required CSS (scoped to avoid conflicts)
 *   - All JS behavior (megamenu, theme, mobile drawer, scroll)
 */

(function () {
  'use strict';

  const mount = document.getElementById('site-nav');
  if (!mount) return;

  const active = (mount.dataset.active || '').toLowerCase();
  const base   = (mount.dataset.base  || '').replace(/\/$/, ''); // e.g. "" or "https://www.luis-gilberto.com"

  // ─── helpers ──────────────────────────────────────────────────
  function u(path) { return base + path; }

  function isActive(keys) {
    const list = Array.isArray(keys) ? keys : [keys];
    return list.includes(active);
  }

  function navLinkClass(keys) {
    return 'nav-link' + (isActive(keys) ? ' nav-link-active' : '');
  }

  function activeStyle(keys, color) {
    if (!isActive(keys)) return '';
    return ` style="background:rgba(249,111,110,0.06);"`;
  }

  function activeIconStyle(keys) {
    if (!isActive(keys)) return '';
    return ` style="border-color:var(--nav-coral);color:var(--nav-coral);"`;
  }

  function activeTitleStyle(keys) {
    if (!isActive(keys)) return '';
    return ` style="color:var(--nav-coral);"`;
  }

  function hereLabel(keys) {
    if (!isActive(keys)) return '';
    return ` <span style="font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;opacity:0.6;margin-left:4px;">← here</span>`;
  }

  // ─── SVG icons ────────────────────────────────────────────────
  const CHEVRON = `<svg class="nav-chevron" viewBox="0 0 15 15" fill="none" aria-hidden="true"><path d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"/></svg>`;

  const ICONS = {
    briefcase: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>`,
    timeline:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="4"/><polyline points="6 10 12 4 18 10"/></svg>`,
    user:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`,
    brand:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>`,
    mail:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
    book:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
    grid:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
    pulse:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
    pencil:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
    sun:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
    moon:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
    menu:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
    close:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    arrow:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px;"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
    hub:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>`,
    lock:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    star:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    people:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    external:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
    home:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  };

  function icon(name) {
    return `<div class="snav-item-icon">${ICONS[name] || ''}</div>`;
  }

  function drawerIcon(name) {
    return `<div class="snav-drawer-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${(ICONS[name] || '').replace(/<svg[^>]*>/,'').replace(/<\/svg>/,'')}</svg></div>`;
  }

  // ─── CSS ──────────────────────────────────────────────────────
  const css = `
    :root {
      --nav-coral: #F96F6E;
      --nav-teal:  #2ED3C6;
      --nav-h:     64px;
    }
    body { padding-top: var(--nav-h); }

    /* ── header ── */
    .snav-header {
      position: fixed; top: 0; left: 0; right: 0; z-index: 500;
      height: var(--nav-h); background: #0E0C0A;
      border-bottom: 1px solid transparent;
      transition: border-color 0.3s, backdrop-filter 0.3s;
    }
    .snav-header.scrolled {
      background: rgba(14,12,10,0.92); backdrop-filter: blur(12px);
      border-bottom-color: rgba(250,247,244,0.08);
    }
    .snav-inner {
      display: flex; align-items: center; justify-content: space-between;
      height: 100%; max-width: 1280px; margin: 0 auto; padding: 0 48px;
    }
    .snav-logo { display: flex; align-items: center; height: 36px; }
    .snav-logo img { height: 100%; width: auto; }
    #snav-logo-mark { display: none; }
    @media (max-width: 1024px) {
      #snav-logo-desktop { display: none; }
      #snav-logo-mark    { display: block; }
    }
    @media (max-width: 768px) { .snav-inner { padding: 0 24px; } }

    /* ── desktop nav ── */
    .snav-desktop {
      display: flex; align-items: center; gap: 2px; position: relative;
    }
    @media (max-width: 1024px) { .snav-desktop { display: none; } }

    .nav-link {
      font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
      letter-spacing: 0.04em; color: rgba(250,247,244,0.45);
      padding: 8px 14px; border-radius: 6px;
      display: inline-flex; align-items: center; gap: 4px;
      background: none; border: none; cursor: pointer;
      transition: color 0.15s, background 0.15s; white-space: nowrap;
    }
    .nav-link:hover { color: #FAF7F4; background: rgba(250,247,244,0.08); }
    .nav-link-active { color: var(--nav-coral) !important; }
    .nav-link[aria-expanded="true"] { color: #FAF7F4; background: rgba(250,247,244,0.08); }
    .nav-chevron { width: 12px; height: 12px; transition: transform 300ms; flex-shrink: 0; }
    .nav-link[aria-expanded="true"] .nav-chevron { transform: rotate(180deg); }

    /* ── viewport / panels ── */
    .snav-viewport {
      position: absolute; left: 50%; top: calc(100% + 8px);
      transform: translateX(-50%); pointer-events: none; z-index: 300;
    }
    .snav-viewport-inner {
      background: #161310; border: 1px solid rgba(250,247,244,0.12);
      border-radius: 10px; box-shadow: 0 12px 40px rgba(0,0,0,0.4);
      opacity: 0; transform: scale(0.96) translateY(-6px); pointer-events: none;
      transition: opacity 180ms ease, transform 180ms ease; overflow: hidden;
    }
    .snav-viewport-inner.open {
      opacity: 1; transform: scale(1) translateY(0); pointer-events: auto;
    }
    .snav-panel { display: none; }
    .snav-panel.active { display: block; }

    .snav-panel-wrap { padding: 6px; }
    .snav-panel-wrap[data-ch="portfolio"] { --ch: var(--nav-coral); width: 480px; }
    .snav-panel-wrap[data-ch="insights"]  { --ch: var(--nav-coral); width: 520px; }
    .snav-panel-wrap[data-ch="hub"]       { --ch: var(--nav-teal);  width: 560px; }
    .snav-panel-wrap[data-ch="portal"]    { --ch: var(--nav-teal);  width: 400px; }

    .snav-panel-header {
      padding: 16px 16px 10px;
      border-bottom: 1px solid rgba(250,247,244,0.08);
      margin-bottom: 6px;
    }
    .snav-panel-label {
      font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 600;
      letter-spacing: 0.15em; text-transform: uppercase; color: var(--ch);
      display: flex; align-items: center; gap: 8px; margin-bottom: 4px;
    }
    .snav-panel-label::before { content: ''; display: block; width: 20px; height: 1px; background: var(--ch); }
    .snav-panel-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 22px; font-weight: 500; color: #FAF7F4; line-height: 1.2;
    }
    .snav-grid      { display: grid; grid-template-columns: 1fr;     gap: 4px; padding: 4px; }
    .snav-grid-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; padding: 4px; }

    .snav-item {
      display: flex; align-items: flex-start; gap: 12px; padding: 12px;
      border-radius: 8px; text-decoration: none; transition: background 0.15s;
    }
    .snav-item:hover { background: rgba(250,247,244,0.05); }
    .snav-item:hover .snav-item-icon { border-color: var(--ch); color: var(--ch); }
    .snav-item-icon {
      flex-shrink: 0; width: 40px; height: 40px;
      display: flex; align-items: center; justify-content: center;
      border: 1px solid rgba(250,247,244,0.08); border-radius: 8px;
      background: #0E0C0A; color: rgba(250,247,244,0.45);
      transition: border-color 0.15s, color 0.15s;
    }
    .snav-item-icon svg { width: 18px; height: 18px; }
    .snav-item-text { flex: 1; min-width: 0; }
    .snav-item-title {
      font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600;
      color: #FAF7F4; margin-bottom: 2px;
    }
    .snav-item-desc  {
      font-family: 'Inter', sans-serif; font-size: 11px;
      color: rgba(250,247,244,0.5); line-height: 1.5;
    }
    .snav-item-role {
      display: inline-block; margin-top: 4px;
      font-family: 'Inter', sans-serif; font-size: 9px; font-weight: 700;
      letter-spacing: 0.12em; text-transform: uppercase;
      color: var(--ch); opacity: 0.8;
    }

    .snav-panel-footer {
      border-top: 1px solid rgba(250,247,244,0.08); padding: 12px 16px;
      display: flex; align-items: center; justify-content: space-between;
    }
    .snav-panel-footer-text {
      font-family: 'Inter', sans-serif; font-size: 12px; color: rgba(250,247,244,0.4);
    }
    .snav-panel-footer-link {
      font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600;
      color: var(--ch); display: flex; align-items: center; gap: 4px;
      text-decoration: none; transition: gap 0.15s;
    }
    .snav-panel-footer-link:hover { gap: 8px; }

    /* portal specifics */
    .snav-portal-features { padding: 12px 16px 8px; display: flex; flex-direction: column; gap: 2px; }
    .snav-portal-feature {
      display: flex; align-items: center; gap: 10px; padding: 9px 6px;
      border-radius: 6px; font-family: 'Inter', sans-serif; font-size: 12px;
      color: rgba(250,247,244,0.55); transition: background 0.15s;
    }
    .snav-portal-feature:hover { background: rgba(250,247,244,0.04); }
    .snav-portal-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--nav-teal); flex-shrink: 0; }
    .snav-portal-cta {
      margin: 8px 10px 10px; background: #FAF7F4; border-radius: 6px;
      padding: 14px 16px; display: flex; align-items: center;
      justify-content: space-between; gap: 12px;
    }
    .snav-portal-cta-label {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 16px; font-style: italic; color: #1A1714; line-height: 1.2;
    }
    .snav-portal-cta-btn {
      font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 700;
      letter-spacing: 0.08em; text-transform: uppercase;
      color: #1A1714; background: var(--nav-teal); padding: 8px 14px;
      border-radius: 4px; white-space: nowrap; text-decoration: none;
      transition: background 0.15s;
    }
    .snav-portal-cta-btn:hover { background: #3dc9bc; }

    /* ── header CTAs ── */
    .snav-ctas { display: flex; align-items: center; gap: 8px; }
    .snav-theme-btn {
      background: none; border: 1px solid rgba(250,247,244,0.12); border-radius: 6px;
      width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: rgba(250,247,244,0.5); transition: all 0.15s; flex-shrink: 0;
    }
    .snav-theme-btn:hover { border-color: rgba(250,247,244,0.4); color: #FAF7F4; }
    .snav-mobile-toggle {
      display: none; background: none; border: 1px solid rgba(250,247,244,0.12);
      border-radius: 6px; width: 36px; height: 36px;
      align-items: center; justify-content: center;
      cursor: pointer; color: rgba(250,247,244,0.5);
    }
    @media (max-width: 1024px) { .snav-mobile-toggle { display: flex; } }

    /* ── mobile drawer ── */
    .snav-drawer {
      display: none; position: fixed; inset: 0; top: var(--nav-h);
      z-index: 99; background: rgba(14,12,10,0.97); backdrop-filter: blur(12px);
      flex-direction: column; border-top: 1px solid rgba(250,247,244,0.08);
      overflow-y: auto;
    }
    .snav-drawer.open { display: flex; }

    .snav-drawer-series { padding: 20px 24px; border-bottom: 1px solid rgba(250,247,244,0.08); position: relative; }
    .snav-drawer-series::before {
      content: ''; position: absolute; top: 0; left: 0; width: 2px; height: 100%;
      background: var(--nav-coral); border-radius: 0 2px 2px 0;
    }
    .snav-drawer-series-label {
      font-family: 'Inter', sans-serif; font-size: 9px; font-weight: 700;
      letter-spacing: 0.18em; text-transform: uppercase; color: var(--nav-coral);
      margin-bottom: 14px; display: flex; align-items: center; gap: 8px;
    }
    .snav-drawer-series-label::before { content: ''; display: block; width: 14px; height: 1px; background: var(--nav-coral); }
    .snav-drawer-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

    .snav-drawer-card {
      background: #1C1916; border: 1px solid rgba(250,247,244,0.08); border-radius: 10px;
      padding: 14px 12px; text-decoration: none; display: flex; flex-direction: column;
      gap: 10px; transition: all 0.2s; position: relative; overflow: hidden;
    }
    .snav-drawer-card::after {
      content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
      background: var(--nav-coral); transform: scaleX(0); transform-origin: left;
      transition: transform 0.2s;
    }
    .snav-drawer-card:hover    { border-color: rgba(249,111,110,0.4); transform: translateY(-2px); }
    .snav-drawer-card:hover::after { transform: scaleX(1); }
    .snav-drawer-card.snav-here { border-color: rgba(249,111,110,0.3); }
    .snav-drawer-card.snav-here::after { transform: scaleX(1); }

    .snav-drawer-icon {
      width: 32px; height: 32px; border-radius: 8px; background: #0E0C0A;
      border: 1px solid rgba(250,247,244,0.08); display: flex; align-items: center;
      justify-content: center; transition: all 0.2s;
    }
    .snav-drawer-icon svg {
      width: 15px; height: 15px; stroke: rgba(250,247,244,0.5); fill: none;
      stroke-width: 1.75; stroke-linecap: round; stroke-linejoin: round;
      transition: stroke 0.2s;
    }
    .snav-drawer-card:hover .snav-drawer-icon,
    .snav-drawer-card.snav-here .snav-drawer-icon { background: var(--nav-coral); border-color: var(--nav-coral); }
    .snav-drawer-card:hover .snav-drawer-icon svg,
    .snav-drawer-card.snav-here .snav-drawer-icon svg { stroke: #fff; }

    .snav-drawer-card-title {
      font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600;
      color: #FAF7F4; line-height: 1.3;
    }
    .snav-drawer-card.snav-here .snav-drawer-card-title { color: var(--nav-coral); }
    .snav-drawer-card-desc {
      font-family: 'Inter', sans-serif; font-size: 10px;
      color: rgba(250,247,244,0.5); line-height: 1.4; margin-top: -4px;
    }

    .snav-drawer-global { padding: 16px 24px; }
    .snav-drawer-global-label {
      font-family: 'Inter', sans-serif; font-size: 9px; font-weight: 700;
      letter-spacing: 0.18em; text-transform: uppercase;
      color: rgba(250,247,244,0.5); opacity: 0.6; margin-bottom: 8px;
    }
    .snav-drawer-link {
      display: flex; align-items: center; gap: 12px; padding: 11px 0;
      border-bottom: 1px solid rgba(250,247,244,0.06); text-decoration: none;
      transition: all 0.15s;
    }
    .snav-drawer-link:last-child { border-bottom: none; }
    .snav-drawer-link-icon {
      width: 34px; height: 34px; border-radius: 8px;
      background: rgba(250,247,244,0.04); display: flex; align-items: center;
      justify-content: center; transition: all 0.15s;
    }
    .snav-drawer-link-icon svg {
      width: 15px; height: 15px; stroke: rgba(250,247,244,0.5); fill: none;
      stroke-width: 1.75; stroke-linecap: round; stroke-linejoin: round;
      transition: stroke 0.15s;
    }
    .snav-drawer-link:hover .snav-drawer-link-icon svg { stroke: var(--nav-teal); }
    .snav-drawer-link.snav-here .snav-drawer-link-icon svg { stroke: var(--nav-coral); }
    .snav-drawer-link-text {
      font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
      color: rgba(250,247,244,0.5); transition: color 0.15s;
    }
    .snav-drawer-link:hover .snav-drawer-link-text { color: #FAF7F4; }
    .snav-drawer-link.snav-here .snav-drawer-link-text { color: var(--nav-coral); font-weight: 600; }

    .snav-drawer-footer {
      padding: 14px 24px; border-top: 1px solid rgba(250,247,244,0.08);
      display: flex; align-items: center; justify-content: space-between;
      flex-shrink: 0; margin-top: auto;
    }
    .snav-status { display: flex; align-items: center; gap: 8px; }
    .snav-status-dot {
      width: 6px; height: 6px; background: var(--nav-teal); border-radius: 50%;
      box-shadow: 0 0 6px rgba(46,211,198,0.5); animation: snavPulse 2s infinite;
    }
    .snav-status-label {
      font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 600;
      letter-spacing: 0.06em; text-transform: uppercase; color: rgba(250,247,244,0.5);
    }
    @keyframes snavPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
  `;

  // ─── HTML builder ──────────────────────────────────────────────
  function panelItem(href, iconName, title, desc, activeKeys, role) {
    const isHere = isActive(activeKeys);
    return `
      <a href="${u(href)}" class="snav-item"${isHere ? ' style="background:rgba(249,111,110,0.06);"' : ''}>
        <div class="snav-item-icon"${isHere ? ' style="border-color:var(--nav-coral);color:var(--nav-coral);"' : ''}>${ICONS[iconName] || ''}</div>
        <div class="snav-item-text">
          <p class="snav-item-title"${isHere ? ' style="color:var(--nav-coral);"' : ''}>${title}${hereLabel(activeKeys)}</p>
          <p class="snav-item-desc">${desc}</p>
          ${role ? `<span class="snav-item-role">${role}</span>` : ''}
        </div>
      </a>`;
  }

  const html = `
  <style>${css}</style>

  <!-- ── HEADER ── -->
  <header class="snav-header" id="snav-header">
    <div class="snav-inner">
      <a href="${u('/')}" class="snav-logo">
        <img id="snav-logo-desktop" src="${u('/assets/images/AUg_logo_White.png')}" alt="Luis Gilberto">
        <img id="snav-logo-mark"    src="${u('/assets/images/Logomark_White_a.png')}" alt="Luis Gilberto">
      </a>

      <nav class="snav-desktop" id="snav-desktop" aria-label="Main navigation">

        <button id="snav-trigger-portfolio" class="${navLinkClass(['portfolio','experience','timeline','about','brand','contact'])}"
          aria-haspopup="true" aria-expanded="false" aria-controls="snav-panel-portfolio" data-snav-trigger>
          Portfolio ${CHEVRON}
        </button>
        <button id="snav-trigger-insights" class="${navLinkClass('insights')}"
          aria-haspopup="true" aria-expanded="false" aria-controls="snav-panel-insights" data-snav-trigger>
          Insights ${CHEVRON}
        </button>
        <button id="snav-trigger-hub" class="${navLinkClass('hub')}"
          aria-haspopup="true" aria-expanded="false" aria-controls="snav-panel-hub" data-snav-trigger>
          The Hub ${CHEVRON}
        </button>
        <button id="snav-trigger-portal" class="${navLinkClass('portal')}"
          aria-haspopup="true" aria-expanded="false" aria-controls="snav-panel-portal" data-snav-trigger>
          Portal ${CHEVRON}
        </button>

        <div class="snav-viewport" id="snav-viewport">
          <div class="snav-viewport-inner" id="snav-viewport-inner">

            <!-- PORTFOLIO -->
            <div id="snav-panel-portfolio" class="snav-panel">
              <div class="snav-panel-wrap" data-ch="portfolio">
                <div class="snav-panel-header">
                  <p class="snav-panel-label">Portfolio</p>
                  <p class="snav-panel-title">Work, story &amp; process</p>
                </div>
                <div class="snav-grid">
                  ${panelItem('/myexperience.html','briefcase','Work &amp; Experience','15+ years across Microsoft, startups, and beyond','experience')}
                  ${panelItem('/timeline.html','timeline','Career Timeline','The eras, pivots, and moments that shaped the work','timeline')}
                  ${panelItem('/about.html','user','About Luis','From Caracas to Cascadia — the full story','about')}
                  ${panelItem('/brand/','brand','Brand Identity','The canonical system behind the ecosystem','brand')}
                  ${panelItem('/contact.html','mail','Contact','Start a project or ask a question','contact')}
                </div>
                <div class="snav-panel-footer">
                  <span class="snav-panel-footer-text">Caracas meets Cascadia</span>
                  <a href="${u('/')}" class="snav-panel-footer-link">Visit portfolio ${ICONS.arrow}</a>
                </div>
              </div>
            </div>

            <!-- INSIGHTS -->
            <div id="snav-panel-insights" class="snav-panel">
              <div class="snav-panel-wrap" data-ch="insights">
                <div class="snav-panel-header">
                  <p class="snav-panel-label">Insights</p>
                  <p class="snav-panel-title">Browse by Series</p>
                </div>
                <div class="snav-grid">
                  ${panelItem('/insights/','pencil','All Stories','Insights homepage — browse everything','insights')}
                  ${panelItem('/insights/series/#building','grid','The Building Series','Structural decisions, built in public','')}
                  ${panelItem('/insights/series/#use-cases','pulse','Use Cases','Real-world launches and product strategies','')}
                  ${panelItem('/insights/series/#reflections','book','Reflections','Personal thoughts on creativity, pace, and momentum','')}
                </div>
                <div class="snav-panel-footer">
                  <span class="snav-panel-footer-text">3 series · 12 articles</span>
                  <a href="${u('/insights/')}" class="snav-panel-footer-link">Visit Insights ${ICONS.arrow}</a>
                </div>
              </div>
            </div>

            <!-- THE HUB -->
            <div id="snav-panel-hub" class="snav-panel">
              <div class="snav-panel-wrap" data-ch="hub">
                <div class="snav-panel-header">
                  <p class="snav-panel-label">The Hub</p>
                  <p class="snav-panel-title">Four arms. One system.</p>
                </div>
                <div class="snav-grid-2col">
                  ${panelItem('/TheHub/strategy-iq.html','hub','StrategyIQ™','Diagnostic engine — maturity benchmarking','','Strategic Intelligence')}
                  ${panelItem('/TheHub/advisory/','people','Advisory','Direct access — leadership alignment','','Partnership')}
                  ${panelItem('/TheHub/studio.html','star','The Studio','High-fidelity execution — ideas into assets','','Creative Production')}
                  <a href="https://portal.luis-gilberto.com/" target="_blank" rel="noopener" class="snav-item">
                    <div class="snav-item-icon">${ICONS.lock}</div>
                    <div class="snav-item-text">
                      <p class="snav-item-title">The Portal ↗</p>
                      <p class="snav-item-desc">Secure command center — client work lives here</p>
                      <span class="snav-item-role">Client Access</span>
                    </div>
                  </a>
                </div>
                <div class="snav-panel-footer">
                  <span class="snav-panel-footer-text">Intelligence over intuition</span>
                  <a href="${u('/TheHub/')}" class="snav-panel-footer-link">Explore The Hub ${ICONS.arrow}</a>
                </div>
              </div>
            </div>

            <!-- PORTAL -->
            <div id="snav-panel-portal" class="snav-panel">
              <div class="snav-panel-wrap" data-ch="portal">
                <div class="snav-panel-header">
                  <p class="snav-panel-label">The Portal</p>
                  <p class="snav-panel-title">Your command center</p>
                </div>
                <div class="snav-portal-features">
                  <div class="snav-portal-feature"><div class="snav-portal-dot"></div>Strategy tools &amp; StrategyIQ engine</div>
                  <div class="snav-portal-feature"><div class="snav-portal-dot"></div>Shared project workspaces</div>
                  <div class="snav-portal-feature"><div class="snav-portal-dot"></div>Direct access to Luis &amp; Advisory</div>
                  <div class="snav-portal-feature"><div class="snav-portal-dot"></div>Progress tracking &amp; deliverables</div>
                </div>
                <div class="snav-portal-cta">
                  <p class="snav-portal-cta-label">Ready to enter<br>the ecosystem?</p>
                  <a href="https://portal.luis-gilberto.com/auth/signup" target="_blank" rel="noopener" class="snav-portal-cta-btn">Request Access</a>
                </div>
                <div class="snav-panel-footer">
                  <span class="snav-panel-footer-text">Existing client?</span>
                  <a href="https://portal.luis-gilberto.com/auth/signin" target="_blank" rel="noopener" class="snav-panel-footer-link">Sign in ${ICONS.arrow}</a>
                </div>
              </div>
            </div>

          </div><!-- /viewport-inner -->
        </div><!-- /viewport -->
      </nav>

      <div class="snav-ctas">
        <button class="snav-theme-btn" id="snav-theme-btn" aria-label="Toggle theme">
          <span id="snav-icon-sun">${ICONS.sun}</span>
          <span id="snav-icon-moon" style="display:none;">${ICONS.moon}</span>
        </button>
        <button class="snav-mobile-toggle" id="snav-mobile-toggle" aria-label="Toggle menu" aria-expanded="false">
          <span id="snav-menu-icon">${ICONS.menu}</span>
        </button>
      </div>
    </div>
  </header>

  <!-- ── MOBILE DRAWER ── -->
  <div class="snav-drawer" id="snav-drawer">
    <div class="snav-drawer-series">
      <div class="snav-drawer-series-label">Portfolio</div>
      <div class="snav-drawer-grid">
        <a href="${u('/myexperience.html')}" class="snav-drawer-card${isActive('experience') ? ' snav-here' : ''}">
          <div class="snav-drawer-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg></div>
          <div><div class="snav-drawer-card-title">Experience</div><div class="snav-drawer-card-desc">Work &amp; case studies</div></div>
        </a>
        <a href="${u('/timeline.html')}" class="snav-drawer-card${isActive('timeline') ? ' snav-here' : ''}">
          <div class="snav-drawer-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="4"/><polyline points="6 10 12 4 18 10"/></svg></div>
          <div><div class="snav-drawer-card-title">Timeline</div><div class="snav-drawer-card-desc">Career eras</div></div>
        </a>
        <a href="${u('/about.html')}" class="snav-drawer-card${isActive('about') ? ' snav-here' : ''}">
          <div class="snav-drawer-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg></div>
          <div><div class="snav-drawer-card-title">About Luis</div><div class="snav-drawer-card-desc">Caracas to Cascadia</div></div>
        </a>
        <a href="${u('/contact.html')}" class="snav-drawer-card${isActive('contact') ? ' snav-here' : ''}">
          <div class="snav-drawer-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
          <div><div class="snav-drawer-card-title">Contact</div><div class="snav-drawer-card-desc">Start a conversation</div></div>
        </a>
      </div>
    </div>
    <div class="snav-drawer-global">
      <div class="snav-drawer-global-label">Ecosystem</div>
      <a href="${u('/')}" class="snav-drawer-link">
        <div class="snav-drawer-link-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
        <span class="snav-drawer-link-text">Portfolio</span>
      </a>
      <a href="${u('/insights/')}" class="snav-drawer-link${isActive('insights') ? ' snav-here' : ''}">
        <div class="snav-drawer-link-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></div>
        <span class="snav-drawer-link-text">Insights</span>
      </a>
      <a href="${u('/TheHub/')}" class="snav-drawer-link${isActive('hub') ? ' snav-here' : ''}">
        <div class="snav-drawer-link-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg></div>
        <span class="snav-drawer-link-text">The Hub</span>
      </a>
      <a href="https://portal.luis-gilberto.com/" class="snav-drawer-link${isActive('portal') ? ' snav-here' : ''}" target="_blank" rel="noopener">
        <div class="snav-drawer-link-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></div>
        <span class="snav-drawer-link-text">The Portal ↗</span>
      </a>
    </div>
    <div class="snav-drawer-footer">
      <div class="snav-status">
        <div class="snav-status-dot"></div>
        <span class="snav-status-label">Accepting Projects</span>
      </div>
    </div>
  </div>
  `;

  // ─── Inject ────────────────────────────────────────────────────
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  mount.outerHTML = html.replace(/<style>[\s\S]*?<\/style>/, ''); // CSS already injected above

  // ─── Behavior (runs after DOM is ready) ───────────────────────
  function init() {
    const header      = document.getElementById('snav-header');
    const viewportInner = document.getElementById('snav-viewport-inner');
    const viewport    = document.getElementById('snav-viewport');
    const desktopNav  = document.getElementById('snav-desktop');
    const triggers    = document.querySelectorAll('[data-snav-trigger]');
    const themeBtn    = document.getElementById('snav-theme-btn');
    const iconSun     = document.getElementById('snav-icon-sun');
    const iconMoon    = document.getElementById('snav-icon-moon');
    const mobileToggle = document.getElementById('snav-mobile-toggle');
    const drawer      = document.getElementById('snav-drawer');
    const menuIcon    = document.getElementById('snav-menu-icon');

    if (!header) return;

    // scroll
    window.addEventListener('scroll', () =>
      header.classList.toggle('scrolled', window.scrollY > 10), { passive: true }
    );

    // megamenu
    let activeTriggerId = null, closeTimer = null;

    function openPanel(trigger) {
      clearTimeout(closeTimer);
      const panelId = trigger.id.replace('snav-trigger-', 'snav-panel-');
      const panel   = document.getElementById(panelId);
      if (!panel) return;
      document.querySelectorAll('.snav-panel').forEach(p => p.classList.remove('active'));
      panel.classList.add('active');
      const tRect = trigger.getBoundingClientRect();
      const nRect = desktopNav.getBoundingClientRect();
      viewport.style.left = (tRect.left + tRect.width / 2 - nRect.left) + 'px';
      viewportInner.classList.add('open');
      triggers.forEach(t => t.setAttribute('aria-expanded', 'false'));
      trigger.setAttribute('aria-expanded', 'true');
      activeTriggerId = trigger.id;
    }

    function closePanel() {
      closeTimer = setTimeout(() => {
        viewportInner.classList.remove('open');
        document.querySelectorAll('.snav-panel').forEach(p => p.classList.remove('active'));
        triggers.forEach(t => t.setAttribute('aria-expanded', 'false'));
        activeTriggerId = null;
      }, 120);
    }

    triggers.forEach(t => {
      t.addEventListener('mouseenter', () => openPanel(t));
      t.addEventListener('click', e => {
        e.stopPropagation();
        activeTriggerId === t.id ? closePanel() : openPanel(t);
      });
    });
    desktopNav.addEventListener('mouseleave', closePanel);
    viewportInner.addEventListener('mouseenter', () => clearTimeout(closeTimer));
    viewportInner.addEventListener('mouseleave', closePanel);
    document.addEventListener('click', e => { if (!desktopNav.contains(e.target)) closePanel(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closePanel(); });

    // theme
    function applyTheme(t) {
      document.documentElement.setAttribute('data-theme', t);
      localStorage.setItem('portfolio-theme', t);
      iconSun.style.display  = t === 'dark' ? 'none'  : 'block';
      iconMoon.style.display = t === 'dark' ? 'block' : 'none';
    }
    applyTheme(localStorage.getItem('portfolio-theme') || 'dark');
    themeBtn?.addEventListener('click', () =>
      applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark')
    );

    // mobile drawer
    let drawerOpen = false;
    mobileToggle?.addEventListener('click', () => {
      drawerOpen = !drawerOpen;
      drawer.classList.toggle('open', drawerOpen);
      mobileToggle.setAttribute('aria-expanded', drawerOpen);
      document.body.style.overflow = drawerOpen ? 'hidden' : '';
      menuIcon.innerHTML = drawerOpen
        ? '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'
        : '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>';
    });
  }

  // run after current script execution
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
