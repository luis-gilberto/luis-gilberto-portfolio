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
 *   - <footer class="site-footer"> with standardized 4-column layout
 *   - <div class="mobile-menu"> canonical drawer
 *   - All required CSS (scoped to avoid conflicts)
 *   - All JS behavior (megamenu, theme, mobile drawer, scroll)
 */

(function () {
  'use strict';

  const mount = document.getElementById('site-nav');
  if (!mount) return;

  const active = (mount.dataset.active || '').toLowerCase();
  const rawBase = mount.dataset.base || '';
  // Ensure base ends with a slash if it exists, but don't strip it if it's already there
  const base = rawBase ? (rawBase.endsWith('/') ? rawBase : rawBase + '/') : '';

  // ─── helpers ──────────────────────────────────────────────────
  function u(path) { 
    if (!path) return '';
    // If path is absolute (starts with http or https), return as is
    if (path.startsWith('http')) return path;
    
    // 🧬 FIXED: Homepage redirect logic
    // If we are already on the homepage (root or index.html), 
    // we want links to the homepage to trigger the Diagnostic Modal instead of reloading.
    const isRootHome = window.location.pathname === '/' || window.location.pathname === '/index.html' || (window.location.pathname.endsWith('/index.html') && !window.location.pathname.includes('/TheHub/') && !window.location.pathname.includes('/insights/') && !window.location.pathname.includes('/system/'));
    if (isRootHome && (path === '/' || path === '/index.html')) {
      return 'javascript:if(window.intentGate)window.intentGate.open();';
    }

    // Ensure we don't have double slashes if base is provided
    // 🧬 FORCE ROOT RELATIVE: If path starts with /, ignore base for navigation links
    // This ensures /index.html always goes to root, regardless of subdirectory
    if (path.startsWith('/')) {
        return path; 
    }

    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    const finalPath = base + cleanPath;
    
    // 🧬 Ensure root path returns at least "/" if base is empty
    return (finalPath === '' && path === '/') ? '/' : finalPath;
  }
  
  // 🧬 ASSET HELPER: Use this for images/scripts/css to respect data-base
  function asset(path) {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return base + cleanPath;
  }

  function isActive(keys) {
    const list = Array.isArray(keys) ? keys : [keys];
    return list.includes(active);
  }

  function navLinkClass(keys) {
    return 'nav-link' + (isActive(keys) ? ' nav-link-active' : '');
  }

  function activeStyle(keys, color) {
    if (!isActive(keys)) return '';
    return ` style="background:color-mix(in srgb, var(--accent-lens) 6%, transparent);"`;
  }

  function activeIconStyle(keys) {
    if (!isActive(keys)) return '';
    return ` style="border-color:var(--accent-lens);color:var(--accent-lens);"`;
  }

  function activeTitleStyle(keys) {
    if (!isActive(keys)) return '';
    return ` style="color:var(--accent-lens);"`;
  }

  function hereLabel(keys) {
    if (!isActive(keys)) return '';
    return ` <span style="font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;opacity:0.6;margin-left:4px;color:var(--accent-lens);">← here</span>`;
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
      --nav-mustard: #FFB800;
      --nav-h:     64px;
      --accent-lens: var(--nav-coral); /* Default */
    }

    /* ── Persona Engine Overrides ── */
    body.path-coral   { --accent-lens: var(--nav-coral); }
    body.path-teal    { --accent-lens: var(--nav-teal); }
    body.path-neutral { --accent-lens: rgba(250,247,244,0.4); }

    body.lens-partner { --accent-lens: var(--nav-teal); }
    body.lens-assess  { --accent-lens: var(--nav-coral); }
    body.lens-explore { --accent-lens: rgba(250,247,244,0.4); }

    body { padding-top: var(--nav-h); }

    /* ── header ── */
    .snav-header {
      position: fixed; top: 0; left: 0; right: 0; z-index: 500;
      height: var(--nav-h); background: #050505;
      border-bottom: 1px solid transparent;
      transition: border-color 0.3s, backdrop-filter 0.3s;
    }
    .snav-header.scrolled {
      background: rgba(5,5,5,0.92); backdrop-filter: blur(12px);
      border-bottom-color: rgba(250,247,244,0.08);
    }
    .snav-inner {
      display: flex; align-items: center; justify-content: space-between;
      height: 100%; max-width: 1280px; margin: 0 auto; padding: 0 48px;
    }
    .snav-logo { display: flex; align-items: center; height: 48px; }
    .snav-logo img { height: 48px !important; width: auto; transition: opacity 0.3s ease, transform 0.3s ease; }
    #snav-logo-mark { display: none; }
    @media (max-width: 1024px) {
      #snav-logo-desktop { display: none; }
      #snav-logo-mark    { display: block; }
    }
    @media (max-width: 768px) { .snav-inner { padding: 0 24px; } }

    /* ── lens badge ── */
    .snav-lens-badge {
      display: flex; align-items: center; gap: 8px; padding: 4px 12px;
      background: rgba(250,247,244,0.05); border: 1px solid rgba(250,247,244,0.1);
      border-radius: 99px; cursor: pointer; transition: all 0.2s;
      font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 700;
      letter-spacing: 0.05em; text-transform: uppercase; color: rgba(250,247,244,0.6);
    }
    .snav-lens-badge:hover { background: rgba(250,247,244,0.08); border-color: var(--accent-lens); color: #fff; }
    .snav-lens-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent-lens); box-shadow: 0 0 8px var(--accent-lens); }

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
    .nav-link-active { color: var(--accent-lens) !important; }
    .nav-link[aria-expanded="true"] { color: #FAF7F4; background: rgba(250,247,244,0.08); }
    .nav-chevron { width: 12px; height: 12px; transition: transform 300ms; flex-shrink: 0; }
    .nav-link[aria-expanded="true"] .nav-chevron { transform: rotate(180deg); }

    /* ── viewport / panels ── */
    .snav-viewport {
      position: absolute; left: 50%; top: calc(100% + 8px);
      transform: translateX(-50%); pointer-events: none; z-index: 300;
    }
    .snav-viewport-inner {
      background: #050505; border: 1px solid rgba(250,247,244,0.12);
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
    .snav-panel-wrap[data-ch="portfolio"] { --ch: var(--accent-lens); width: 480px; }
    .snav-panel-wrap[data-ch="insights"]  { --ch: var(--accent-lens); width: 520px; }
    .snav-panel-wrap[data-ch="hub"]       { --ch: var(--accent-lens); width: 560px; }
    .snav-panel-wrap[data-ch="portal"]    { --ch: var(--accent-lens); width: 400px; }

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

    /* 🧬 LENS BADGE STYLES */
    .lens-badge { 
        display: flex; align-items: center; gap: 8px; 
        background: rgba(255, 255, 255, 0.05); 
        border: 1px solid rgba(255, 255, 255, 0.1); 
        padding: 6px 14px; border-radius: 99px; 
        cursor: pointer; transition: all 0.3s ease; 
        height: 36px; /* Match other buttons */
    } 
    .lens-badge:hover { background: rgba(255, 255, 255, 0.12); border-color: var(--badge-accent, #fff); } 
    .lens-dot { width: 6px; height: 6px; background: var(--badge-accent, #fff); border-radius: 50%; box-shadow: 0 0 10px var(--badge-accent, #fff); } 
    #lens-label { font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; color: var(--badge-accent, #fff); } 

    @media (max-width: 768px) {
        #lens-badge-container { display: none; }
    }

    .snav-theme-btn {
      background: none; border: 1px solid rgba(250,247,244,0.12); border-radius: 6px;
      width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: rgba(250,247,244,0.5); transition: all 0.15s; flex-shrink: 0;
    }
    .snav-theme-btn:hover { border-color: rgba(250,247,244,0.4); color: #FAF7F4; }
    .snav-theme-btn span { display: flex; align-items: center; justify-content: center; width: 16px; height: 16px; }
    .snav-theme-btn span svg, .snav-mobile-toggle span svg { width: 16px; height: 16px; display: block; }
    .snav-mobile-toggle {
      display: none; background: none; border: 1px solid rgba(250,247,244,0.12);
      border-radius: 6px; width: 36px; height: 36px;
      align-items: center; justify-content: center;
      cursor: pointer; color: rgba(250,247,244,0.5); transition: all 0.15s;
    }
    .snav-mobile-toggle:hover { border-color: rgba(250,247,244,0.4); color: #FAF7F4; }
    .snav-mobile-toggle span { display: flex; align-items: center; justify-content: center; width: 16px; height: 16px; }
    @media (max-width: 1024px) { .snav-mobile-toggle { display: flex; } }

    /* ── mobile drawer ── */
    .snav-drawer {
      display: none; position: fixed; inset: 0; top: var(--nav-h);
      z-index: 10001; background: #050505; backdrop-filter: blur(12px);
      flex-direction: column; border-top: 1px solid rgba(250,247,244,0.08);
      overflow-y: auto;
    }
    .snav-drawer.open { display: flex; }
    
    /* 🧬 Mobile Drawer Luxe Styles */
    .snav-drawer-group {
        border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .snav-drawer-header {
        padding: 1.25rem 1.5rem;
        display: flex; align-items: center; justify-content: space-between;
        cursor: pointer; background: transparent; border: none; width: 100%;
        color: #fff; text-align: left;
    }
    .snav-drawer-header:hover { background: rgba(255,255,255,0.03); }
    .snav-drawer-title {
        font-family: 'Big Shoulders Display', sans-serif;
        font-size: 1.5rem; font-weight: 800; text-transform: uppercase;
        letter-spacing: 0.02em; color: #fff;
    }
    .snav-drawer-chevron { transition: transform 0.3s ease; opacity: 0.5; }
    .snav-drawer-header[aria-expanded="true"] .snav-drawer-chevron { transform: rotate(180deg); opacity: 1; color: var(--badge-accent, #fff); }
    .snav-drawer-header[aria-expanded="true"] .snav-drawer-title { color: var(--badge-accent, #fff); }

    .snav-drawer-content {
        max-height: 0; overflow: hidden; transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        background: rgba(255,255,255,0.02);
    }
    .snav-drawer-header[aria-expanded="true"] + .snav-drawer-content { max-height: 500px; }

    .snav-drawer-sublink {
        display: flex; align-items: center; gap: 1rem;
        padding: 0.875rem 1.5rem 0.875rem 2rem;
        text-decoration: none; color: rgba(255,255,255,0.6);
        font-family: 'Inter', sans-serif; font-size: 0.95rem;
        border-left: 2px solid transparent; transition: all 0.2s;
    }
    .snav-drawer-sublink:hover {
        background: rgba(255,255,255,0.05);
        color: #fff; padding-left: 2.25rem;
    }
    .snav-drawer-sublink.active {
        color: #fff; border-left-color: var(--badge-accent, #fff);
        background: linear-gradient(to right, rgba(255,255,255,0.05), transparent);
    }
    .snav-drawer-icon { width: 18px; height: 18px; opacity: 0.7; }
    
    .snav-drawer-footer { margin-top: auto; padding: 2rem 1.5rem; border-top: 1px solid rgba(255,255,255,0.1); }
    .snav-status { display: flex; align-items: center; gap: 0.75rem; }
    .snav-status-dot { width: 8px; height: 8px; border-radius: 50%; background: #2ED3C6; box-shadow: 0 0 8px rgba(46,211,198,0.5); }
    .snav-status-label { font-family: 'Inter', sans-serif; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.8); }

    .snav-drawer-reset { 
        display: flex; align-items: center; justify-content: center; gap: 0.75rem;
        padding: 1rem; margin: 1rem 1.5rem; 
        border: 1px solid rgba(255,255,255,0.15); border-radius: 8px;
        color: rgba(255,255,255,0.7); font-family: 'Inter', sans-serif; font-size: 0.9rem;
        cursor: pointer; transition: all 0.2s;
    }
    .snav-drawer-reset:hover { background: rgba(255,255,255,0.1); color: #fff; border-color: #fff; }

    .snav-drawer-series { padding: 20px 24px; border-bottom: 1px solid rgba(250,247,244,0.08); position: relative; }
    .snav-drawer-series::before {
      content: ''; position: absolute; top: 0; left: 0; width: 2px; height: 100%;
      background: var(--accent-lens); border-radius: 0 2px 2px 0;
    }
    .snav-drawer-series-label {
      font-family: 'Inter', sans-serif; font-size: 9px; font-weight: 700;
      letter-spacing: 0.18em; text-transform: uppercase; color: var(--accent-lens);
      margin-bottom: 14px; display: flex; align-items: center; gap: 8px;
    }
    .snav-drawer-series-label::before { content: ''; display: block; width: 14px; height: 1px; background: var(--accent-lens); }
    .snav-drawer-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

    .snav-drawer-card {
      background: #0E0C0A; border: 1px solid rgba(250,247,244,0.08); border-radius: 10px;
      padding: 14px 12px; text-decoration: none; display: flex; flex-direction: column;
      gap: 10px; transition: all 0.2s; position: relative; overflow: hidden;
    }
    .snav-drawer-card::after {
      content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
      background: var(--accent-lens); transform: scaleX(0); transform-origin: left;
      transition: transform 0.2s;
    }
    .snav-drawer-card:hover    { border-color: color-mix(in srgb, var(--accent-lens) 40%, transparent); transform: translateY(-2px); }
    .snav-drawer-card:hover::after { transform: scaleX(1); }
    .snav-drawer-card.snav-here { border-color: color-mix(in srgb, var(--accent-lens) 30%, transparent); }
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
    .snav-drawer-card.snav-here .snav-drawer-icon { background: var(--accent-lens); border-color: var(--accent-lens); }
    .snav-drawer-card:hover .snav-drawer-icon svg,
    .snav-drawer-card.snav-here .snav-drawer-icon svg { stroke: #fff; }

    .snav-drawer-card-title {
      font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600;
      color: #FAF7F4; line-height: 1.3;
    }
    .snav-drawer-card.snav-here .snav-drawer-card-title { color: var(--accent-lens); }
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
    
    .snav-drawer-reset {
      margin: 16px 24px; padding: 14px;
      border: 1px solid rgba(250,247,244,0.1); border-radius: 8px;
      display: flex; align-items: center; justify-content: center; gap: 10px;
      color: var(--accent-lens); font-family: 'Inter', sans-serif;
      font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
      text-transform: uppercase; cursor: pointer; transition: all 0.2s;
      background: rgba(250,247,244,0.03);
    }
    .snav-drawer-reset:hover { background: rgba(250,247,244,0.06); border-color: var(--accent-lens); }
    .snav-drawer-reset svg { width: 14px; height: 14px; }

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

    /* ── Global Footer (site-footer) — Luxe v4.7 */
    .site-footer { background-color: #050505 !important; color: #FFFFFF !important; padding: 64px 0 0; border-top: 1px solid rgba(255,255,255,0.05); scroll-snap-align: end; font-family: 'Inter', sans-serif; }
    .footer-container { max-width: 1400px; margin: 0 auto; padding: 0 60px 80px; display: flex; justify-content: space-between; align-items: flex-start; gap: 80px; }
    .footer-brand { display: flex; flex-direction: column; gap: 16px; }
    .footer-signature { flex: 1.5; display: flex; flex-direction: column; align-items: flex-start; text-align: left; }
    .footer-logo-svg { width: 100%; max-width: 280px; height: auto; opacity: 1; transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
    .footer-logo-svg:hover { transform: translateY(-2px); }
    .footer-logo-link { display: inline-block; width: fit-content; margin-bottom: 8px; }
    .footer-logo-img { height: 32px; width: auto; opacity: 0.9; transition: opacity 0.3s ease; }
    .footer-logo-link:hover .footer-logo-img { opacity: 1; }
    .footer-tagline { font-size: 14px; line-height: 1.6; color: rgba(255,255,255,0.4) !important; margin: 0; max-width: 320px; }
    .footer-copyright { font-size: 11px; color: rgba(255,255,255,0.2) !important; margin-top: 16px; }
    .footer-column { display: flex; flex-direction: column; }
    .footer-heading { font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.3) !important; margin: 0 0 20px 0; }
    .footer-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; }
    .footer-list a { font-size: 14px; color: rgba(255,255,255,0.4) !important; transition: color 0.2s ease; text-decoration: none; }
    .footer-list a:hover { color: #FFFFFF !important; }
    .footer-status { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 20px; display: flex; flex-direction: column; gap: 12px; }
    .status-indicator { display: flex; align-items: center; gap: 10px; }
    .status-dot { width: 8px; height: 8px; background: #2ED3C6; border-radius: 50%; box-shadow: 0 0 8px rgba(46,211,198,0.5); }
    .status-label { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #FFFFFF !important; }
    .status-desc { font-size: 13px; line-height: 1.5; color: rgba(255,255,255,0.4) !important; margin: 0; }
    .footer-legal { background: #000000 !important; border-top: 1px solid rgba(255,255,255,0.04); padding: 24px 48px; }
    .footer-legal p { max-width: 1400px; margin: 0 auto; font-size: 9px; letter-spacing: 0.05em; text-transform: uppercase; color: rgba(255,255,255,0.2) !important; text-align: center; }
    @media (max-width: 1200px) { .footer-container { flex-direction: column; align-items: center; gap: 40px; padding: 0 48px 48px; } }
    @media (max-width: 1024px)  { .footer-signature { align-items: center; text-align: center; margin-bottom: 3rem; width: 100%; } .footer-logo-svg { max-width: 240px; margin: 0 auto; } .footer-column, .footer-status { align-items: center; text-align: center; } }
  `;

  // ─── HTML builder ──────────────────────────────────────────────
  function panelItem(href, iconName, title, desc, activeKeys, role) {
    const isHere = isActive(activeKeys);
    return `
      <a href="${u(href)}" class="snav-item"${isHere ? ' style="background:color-mix(in srgb, var(--ch) 6%, transparent);"' : ''}>
        <div class="snav-item-icon"${isHere ? ' style="border-color:var(--ch);color:var(--ch);"' : ''}>${ICONS[iconName] || ''}</div>
        <div class="snav-item-text">
          <p class="snav-item-title"${isHere ? ' style="color:var(--ch);"' : ''}>${title}${hereLabel(activeKeys)}</p>
          <p class="snav-item-desc">${desc}</p>
          ${role ? `<span class="snav-item-role" style="color:var(--ch);">${role}</span>` : ''}
        </div>
      </a>`;
  }

  /* ── Footer Logic ── */
  const footerHtml = `
    <footer class="site-footer">
      <div class="footer-container">
        <div class="footer-signature">
          <a href="/index.html" class="footer-logo-link"><img src="${asset('/assets/images/LG-ecosystem-logo-lockup.svg')}" alt="Luis Gilberto Ecosystem" class="footer-logo-svg"></a>
          <div class="footer-copyright">© <span id="currentYear"></span> Luis Gilberto Sanchez. All rights reserved.</div>
        </div>
        <div class="footer-column">
          <h4 class="footer-heading">ECOSYSTEM</h4>
          <ul class="footer-list">
            <li><a href="/timeline.html">Portfolio</a></li>
            <li><a href="/insights/">Insights</a></li>
            <li><a href="/TheHub/index.html">The Hub</a></li>
            <li><a href="/portal/story/">The Portal</a></li>
          </ul>
        </div>
        <div class="footer-column">
          <h4 class="footer-heading">CONNECT</h4>
          <ul class="footer-list">
            <li><a href="https://www.linkedin.com/in/luisgilberto00" target="_blank" rel="noopener">LinkedIn</a></li>
            <li><a href="/contact.html">Contact</a></li>
            <li><a href="/about.html">About Me</a></li>
            <li><a href="/brand/">Identity</a></li>
          </ul>
        </div>
        <div class="footer-status">
          <div class="status-indicator"><div class="status-dot"></div><span class="status-label">ACCEPTING PROJECTS</span></div>
          <p class="status-desc">Currently available for strategic consulting and creative direction.</p>
        </div>
      </div>
      <div class="footer-legal">
        <p>INTELLECTUAL PROPERTY NOTICE: STRATEGYIQ™, THE HUB™, AND THE ASSOCIATED DIAGNOSTIC METHODOLOGIES ARE PROPRIETARY INTELLECTUAL PROPERTY OF LUIS GILBERTO.</p>
      </div>
    </footer>`;

  const html = `
    <style>${css}</style>
    <!-- ── HEADER ── -->
    <header class="snav-header" id="snav-header">
      <div class="snav-inner">
        <a href="/index.html" class="snav-logo">
          <img id="snav-logo-desktop" src="${asset('/assets/images/AUg_logo_White.png')}" alt="Luis Gilberto">
          <img id="snav-logo-mark"    src="${asset('/assets/images/Logomark_White_a.png')}" alt="Luis Gilberto">
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
                    ${panelItem('/index.html','grid','Portfolio Homepage','The complete overview of my work and methodology',['portfolio','home'])}
                    ${panelItem('/myexperience.html','briefcase','Work &amp; Experience','15+ years across Microsoft, startups, and beyond',['experience'])}
                    ${panelItem('/timeline.html','timeline','Career Timeline','The eras, pivots, and moments that shaped the work',['timeline'])}
                    ${panelItem('/about.html','user','About Luis','From Caracas to Cascadia — the full story',['about'])}
                    ${panelItem('/brand/','brand','Brand Identity','The canonical system behind the ecosystem',['brand'])}
                    ${panelItem('/contact.html','mail','Contact','Start a project or ask a question',['contact'])}
                  </div>
                  <div class="snav-panel-footer">
                    <a href="/system/index.html" class="snav-panel-footer-link">How it all connects →</a>
                    <a href="/index.html" class="snav-panel-footer-link">Visit portfolio →</a>
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
                    ${panelItem('/insights/index.html','pencil','All Stories','Insights homepage — browse everything',['insights'])}
                    ${panelItem('/insights/series/#building','grid','The Building Series','Structural decisions, built in public','')}
                    ${panelItem('/insights/series/#use-cases','pulse','Use Cases','Real-world launches and product strategies','')}
                    ${panelItem('/insights/series/#reflections','book','Reflections','Personal thoughts on creativity, pace, and momentum','')}
                  </div>
                  <div class="snav-panel-footer">
                    <a href="/system/index.html" class="snav-panel-footer-link">How it all connects →</a>
                    <a href="/insights/index.html" class="snav-panel-footer-link">Visit Insights →</a>
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
                    ${panelItem('/TheHub/index.html','grid','The Hub Overview','How I productize strategy',['hub'])}
                    ${panelItem('/TheHub/strategy-iq/index.html','pulse','StrategyIQ','Diagnostic &amp; roadmap calibration',['strategy-iq'])}
                    ${panelItem('/system/index.html','book','The System','The owner\'s manual for my methodology',['system'])}
                    ${panelItem('/contact.html','mail','Advisory','Fractional leadership &amp; consulting',['contact'])}
                  </div>
                  <div class="snav-panel-footer">
                    <a href="/system/index.html" class="snav-panel-footer-link">How it all connects →</a>
                    <a href="/TheHub/index.html" class="snav-panel-footer-link">Explore The Hub →</a>
                  </div>
                </div>
              </div>
              <!-- PORTAL -->
              <div id="snav-panel-portal" class="snav-panel">
                <div class="snav-panel-wrap" data-ch="portal">
                  <div class="snav-panel-header">
                    <p class="snav-panel-label">Client Access</p>
                    <p class="snav-panel-title">Project Command</p>
                  </div>
                  <div class="snav-portal-features">
                    <div class="snav-portal-feature"><div class="snav-portal-dot"></div>Real-time Status</div>
                    <div class="snav-portal-feature"><div class="snav-portal-dot"></div>Asset Library</div>
                    <div class="snav-portal-feature"><div class="snav-portal-dot"></div>Strategy Docs</div>
                  </div>
                  <div class="snav-portal-cta">
                    <span class="snav-portal-cta-label">Active Client?</span>
                    <a href="https://portal.luis-gilberto.com" target="_blank" class="snav-portal-cta-btn">Login</a>
                  </div>
                </div>
              </div>
            </div><!-- /viewport-inner -->
          </div><!-- /viewport -->
        </nav>
        <div class="snav-ctas">
          <!-- 🧬 LENS BADGE INJECTED HERE -->
          <div id="lens-badge-container">
            <button id="lens-reset-trigger" class="lens-badge">
              <span class="lens-dot"></span>
              <span id="lens-label">EXPLORING</span>
            </button>
          </div>

          <button class="snav-theme-btn" id="snav-theme-toggle" aria-label="Toggle theme">
            <span>${ICONS.moon}</span>
          </button>
          <button class="snav-mobile-toggle" id="snav-mobile-toggle" aria-label="Menu">
            <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg></span>
          </button>
        </div>
      </div>
    </header>
    <!-- ── MOBILE DRAWER ── -->
    <div class="snav-drawer" id="snav-drawer">
      <div class="snav-drawer-series" style="border-bottom:none; padding-bottom:0;">
        <div style="display:flex; justify-content:center; padding: 20px 0;">
          <img id="snav-drawer-mark" src="${asset('/assets/images/Logomark_White_a.png')}" alt="LG" style="height:40px; width:auto;">
        </div>
      </div>

      <div class="snav-drawer-global">
        <!-- 🧬 PORTFOLIO GROUP -->
        <div class="snav-drawer-group">
          <button class="snav-drawer-header" aria-expanded="false" onclick="toggleDrawerGroup(this)">
            <span class="snav-drawer-title">Portfolio</span>
            <span class="snav-drawer-chevron">${CHEVRON}</span>
          </button>
          <div class="snav-drawer-content">
            <a href="/index.html" class="snav-drawer-sublink${isActive(['portfolio','home'])?' active':''}">
               <span class="snav-drawer-icon">${ICONS.home}</span> Homepage
            </a>
            <a href="/myexperience.html" class="snav-drawer-sublink${isActive('experience')?' active':''}">
               <span class="snav-drawer-icon">${ICONS.briefcase}</span> Experience
            </a>
            <a href="/timeline.html" class="snav-drawer-sublink${isActive('timeline')?' active':''}">
               <span class="snav-drawer-icon">${ICONS.timeline}</span> Timeline
            </a>
            <a href="/about.html" class="snav-drawer-sublink${isActive('about')?' active':''}">
               <span class="snav-drawer-icon">${ICONS.user}</span> About Me
            </a>
            <a href="/brand/" class="snav-drawer-sublink${isActive('brand')?' active':''}">
               <span class="snav-drawer-icon">${ICONS.brand}</span> Identity
            </a>
          </div>
        </div>

        <!-- 🧬 HUB GROUP -->
        <div class="snav-drawer-group">
          <button class="snav-drawer-header" aria-expanded="false" onclick="toggleDrawerGroup(this)">
            <span class="snav-drawer-title">The Hub</span>
            <span class="snav-drawer-chevron">${CHEVRON}</span>
          </button>
          <div class="snav-drawer-content">
            <a href="/TheHub/index.html" class="snav-drawer-sublink${isActive('hub')?' active':''}">
               <span class="snav-drawer-icon">${ICONS.hub}</span> Hub Overview
            </a>
            <a href="/TheHub/strategy-iq/index.html" class="snav-drawer-sublink${isActive('strategy-iq')?' active':''}">
               <span class="snav-drawer-icon">${ICONS.pulse}</span> StrategyIQ™
            </a>
            <a href="/system/index.html" class="snav-drawer-sublink${isActive('system')?' active':''}">
               <span class="snav-drawer-icon">${ICONS.book}</span> The System
            </a>
            <a href="/contact.html" class="snav-drawer-sublink${isActive('contact')?' active':''}">
               <span class="snav-drawer-icon">${ICONS.mail}</span> Advisory
            </a>
            <a href="https://portal.luis-gilberto.com/" target="_blank" class="snav-drawer-sublink${isActive('portal')?' active':''}">
               <span class="snav-drawer-icon">${ICONS.lock}</span> Client Portal ↗
            </a>
          </div>
        </div>

        <!-- 🧬 INSIGHTS GROUP -->
        <div class="snav-drawer-group">
          <button class="snav-drawer-header" aria-expanded="false" onclick="toggleDrawerGroup(this)">
            <span class="snav-drawer-title">Insights</span>
            <span class="snav-drawer-chevron">${CHEVRON}</span>
          </button>
          <div class="snav-drawer-content">
            <a href="/insights/index.html" class="snav-drawer-sublink${isActive('insights')?' active':''}">
               <span class="snav-drawer-icon">${ICONS.pencil}</span> All Stories
            </a>
            <a href="/insights/series/#building" class="snav-drawer-sublink">
               <span class="snav-drawer-icon">${ICONS.grid}</span> Building Series
            </a>
            <a href="/insights/series/#use-cases" class="snav-drawer-sublink">
               <span class="snav-drawer-icon">${ICONS.pulse}</span> Use Cases
            </a>
          </div>
        </div>
        
        <!-- 🧬 DIRECT LINKS -->
        <div class="snav-drawer-group">
            <a href="/contact.html" class="snav-drawer-header" style="text-decoration:none;">
                <span class="snav-drawer-title">Contact</span>
                <span class="snav-drawer-icon" style="color:rgba(255,255,255,0.5);">${ICONS.mail}</span>
            </a>
        </div>
      </div>

      <div class="snav-drawer-reset" id="snav-drawer-reset">
        ${ICONS.pulse}
        <span>Reset Persona Lens</span>
      </div>

      <div class="snav-drawer-footer">
        <div class="snav-status">
          <div class="snav-status-dot"></div>
          <span class="snav-status-label">Accepting Projects</span>
        </div>
      </div>
    </div>
    ${footerHtml}
  `;

  // ─── Inject ────────────────────────────────────────────────────
  // 1. Inject CSS
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // 2. Parse HTML into components
  const fragment = document.createRange().createContextualFragment(html);

  const header = fragment.querySelector(".snav-header");
  const drawer = fragment.querySelector(".snav-drawer");
  const footer = fragment.querySelector(".snav-footer");

  // 3. Perform placements
  const mountParent = mount.parentNode;
  const mountNextSibling = mount.nextSibling;

  // Header goes exactly where the hook was (usually top of body)
  if (header && mountParent) {
    mountParent.insertBefore(header, mountNextSibling);
  }

  // ── Placement Helper for Drawer and Footer ──
  // These MUST go to the end of the body to ensure correct document flow.
  function placeBodyEndElements() {
    if (drawer) document.body.appendChild(drawer);
    // 🧬 DUPLICATE FOOTER FIX: Only append if a site-footer doesn't already exist in the static HTML
    if (footer && !document.querySelector('.site-footer')) {
      document.body.appendChild(footer);
      var yr = document.getElementById('currentYear'); if (yr) yr.textContent = new Date().getFullYear();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', placeBodyEndElements);
  } else {
    placeBodyEndElements();
  }

  // Clean up the hook
  mount.remove();

  // ─── Behavior (runs after DOM is ready) ───────────────────────
  function init() {
    const header      = document.getElementById('snav-header');
    const viewportInner = document.getElementById('snav-viewport-inner');
    const viewport    = document.getElementById('snav-viewport');
    const desktopNav  = document.getElementById('snav-desktop');
    const triggers    = document.querySelectorAll('[data-snav-trigger]');
    const themeBtn    = document.getElementById('snav-theme-toggle');
    const iconSun     = document.getElementById('snav-icon-sun');
    const iconMoon    = document.getElementById('snav-icon-moon');
    const flDark      = document.getElementById('snav-footer-logo-dark');
    const flLight     = document.getElementById('snav-footer-logo-light');
    const mobileToggle = document.getElementById('snav-mobile-toggle');
    const drawer      = document.getElementById('snav-drawer');
    const iconMenu     = document.getElementById('snav-icon-menu');
    const iconClose    = document.getElementById('snav-icon-close');
    const yearEl      = document.getElementById('snav-year');

    if (!header) return;

    // year
    if (yearEl) yearEl.textContent = new Date().getFullYear();

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
      if (window.setTheme) {
        window.setTheme(t);
        return;
      }
      
      if (!t) {
        t = localStorage.getItem('lg_theme') || 'dark';
      }
      
      document.documentElement.setAttribute('data-theme', t);
      localStorage.setItem('lg_theme', t);
      
      window.dispatchEvent(new Event('themeChanged'));
      
      const themeBtn = document.getElementById('snav-theme-btn');
      if (themeBtn) {
          themeBtn.innerHTML = `<span>${t === 'dark' ? ICONS.sun : ICONS.moon}</span>`;
          themeBtn.setAttribute('aria-label', t === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
      }

      const flDark = document.getElementById('snav-footer-logo-dark');
      const flLight = document.getElementById('snav-footer-logo-light');
      if (flDark) flDark.style.display = t === 'dark' ? 'block' : 'none';
      if (flLight) flLight.style.display = t === 'dark' ? 'none' : 'block';
    }
    
    // Initial Theme Load
    const savedTheme = localStorage.getItem('lg_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    applyTheme(savedTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
          const current = document.documentElement.getAttribute('data-theme') || 'dark';
          const newTheme = current === 'dark' ? 'light' : 'dark';
          document.documentElement.setAttribute('data-theme', newTheme);
          localStorage.setItem('lg_theme', newTheme);
          applyTheme(newTheme);
        });
    }

    // mobile drawer
    let drawerOpen = false;
    if (mobileToggle) {
      mobileToggle.addEventListener('click', () => {
        drawerOpen = !drawerOpen;
        if (drawer) drawer.classList.toggle('open', drawerOpen);
        mobileToggle.setAttribute('aria-expanded', drawerOpen);
        document.body.style.overflow = drawerOpen ? 'hidden' : '';
        if (iconMenu) iconMenu.style.display  = drawerOpen ? 'none'  : 'flex';
        if (iconClose) iconClose.style.display = drawerOpen ? 'flex' : 'none';
      });
    }

    // ── persona management ──
    const lensBadge = document.getElementById('snav-lens-badge');
    const lensLabel = document.getElementById('snav-lens-label');

    function updateHeaderLogo(choice){
      const map = {
        teal:    u('/assets/hp/LG_Logomark_teal.png'),
        coral:   u('/assets/hp/LG_Logomark_coral.png'),
        neutral: u('/assets/images/Logomark_White_a.png')
      };
      const src = map[choice] || map.neutral;
      const desktopLogo = document.getElementById('snav-logo-desktop');
      const markLogo    = document.getElementById('snav-logo-mark');
      if (desktopLogo) desktopLogo.src = src;
      if (markLogo)    markLogo.src    = src;
    }

    function applyPersona(choice) {
      const LABELS = { 
        coral:   'ASSESSING', 
        teal:    'PARTNERING', 
        neutral: 'EXPLORING' 
      };
      
      const LOGOMARKS = {
        teal:    u('/assets/hp/LG_Logomark_teal.png'),
        coral:   u('/assets/hp/LG_Logomark_coral.png'),
        neutral: u('/assets/images/Logomark_White_a.png')
      };

      document.body.classList.remove('path-teal', 'path-coral', 'path-neutral');
      document.body.classList.add(`path-${choice}`);
      
      const badge = document.getElementById('snav-lens-badge');
      if (badge) {
        if (choice === 'teal') {
          badge.style.background = 'var(--nav-teal)';
          badge.style.borderColor = 'var(--nav-teal)';
          badge.style.color = '#050505';
        } else {
          badge.style.background = '';
          badge.style.borderColor = '';
          badge.style.color = '';
        }
      }
      
      if (lensLabel) lensLabel.textContent = LABELS[choice] || 'EXPLORING';

      // 🧬 Handle body[data-journey] for index.html token sync
      const journeyMap = { teal: 'partner', coral: 'hire', neutral: 'explore' };
      document.body.setAttribute('data-journey', journeyMap[choice] || 'explore');

      // 🧬 Update Header Badge
      const headerLabel = document.getElementById('lens-label');
      const headerBadge = document.querySelector('.lens-badge');
      const headerDot = document.querySelector('.lens-dot');
      
      if (headerLabel) {
         headerLabel.textContent = LABELS[choice] || 'EXPLORING';
         if (choice === 'teal') headerLabel.textContent = 'PARTNERING'; // Override for Partner Journey
         
         let accentColor = '#FFFFFF';
         if (choice === 'teal') accentColor = '#2ED3C6';
         if (choice === 'coral') accentColor = '#F96F6E';
         
         document.documentElement.style.setProperty('--badge-accent', accentColor);
      }

      // Dynamic Header Logo Swap
      updateHeaderLogo(choice);

      // Dynamic Drawer Mark Swap
      const drawerMark = document.getElementById('snav-drawer-mark');
      if (drawerMark) {
        drawerMark.src = LOGOMARKS[choice] || LOGOMARKS.neutral;
      }
      
      // 🧬 Hire Journey Footer Logic
      const footerStatus = document.querySelector('.snav-footer-status-label'); // Footer
      const drawerStatus = document.querySelector('.snav-status-label'); // Drawer
      
      const statusText = (choice === 'coral') ? 'Open to senior marketing roles' : 'Accepting Projects';
      
      if (footerStatus) footerStatus.textContent = statusText;
      if (drawerStatus) drawerStatus.textContent = statusText;
    }

    const currentPersona = localStorage.getItem('luxe-persona') || 'neutral';
    applyPersona(currentPersona);

    // 🧬 LENS RESET HANDLER
    const headerReset = document.getElementById('lens-reset-trigger');
    const drawerReset = document.getElementById('snav-drawer-reset');

    const handleReset = (e) => {
        e.preventDefault();
        const isRootHome = window.location.pathname === '/' || window.location.pathname === '/index.html' || (window.location.pathname.endsWith('/index.html') && !window.location.pathname.includes('/TheHub/') && !window.location.pathname.includes('/insights/'));

        if (isRootHome && window.intentGate) {
          if (drawer) drawer.classList.remove('open');
          window.intentGate.open();
        } else {
          window.location.href = u('/index.html?open=diagnostic');
        }
    };

    if (headerReset) headerReset.addEventListener('click', handleReset);
    if (drawerReset) drawerReset.addEventListener('click', handleReset);
    if (lensBadge)   lensBadge.addEventListener('click', handleReset);

    // Sync changes from other tabs
    window.addEventListener('storage', (e) => {
      if (e.key === 'luxe-persona') {
        applyPersona(e.newValue);
      }
    });
  }

  // run after current script// ─── Initialize ───
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

// 🧬 Global Helper for Mobile Accordion
window.toggleDrawerGroup = function(btn) {
    const isExpanded = btn.getAttribute('aria-expanded') === 'true';
    
    // Optional: Close others (Accordion behavior)
    // document.querySelectorAll('.snav-drawer-header').forEach(h => h.setAttribute('aria-expanded', 'false'));
    
    btn.setAttribute('aria-expanded', !isExpanded);
};
