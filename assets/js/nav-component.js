/* =============================================================
   🧬 v14.3 SOVEREIGN ENGINE · Luis Gilberto Ecosystem
   CHANNELS: Insights (Theme-Aware) | The Hub (Channel-Signature) | Portfolio (Persona-Aware)
   CHANGES FROM v14.2:
   - Hub megamenu restructured for canonical parity (3operating arms + orientation links)
   - Version bump to v14.3
   ============================================================= */
// nav-component.js — v14.3 — last updated: 2026-03-30 
console.log('[nav-component] v14.3 loaded');
document.addEventListener('DOMContentLoaded', function() {

    // 0. DEPENDENCY INJECTION: Force FontAwesome for icons
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const fa = document.createElement('link');
        fa.rel = 'stylesheet';
        fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
        document.head.appendChild(fa);
    }

    const navHook = document.getElementById('site-nav');
    if (!navHook) return;

    // 1. ENVIRONMENT DETECTION
    const base     = navHook.getAttribute('data-base') || '/';
    const persona  = localStorage.getItem('luxe-persona') || 'explore';
    const theme    = localStorage.getItem('lg-theme') || 'dark';
    const path     = window.location.pathname;

    const isInsights = path.includes('/insights/');
    const isHub = window.location.pathname.toLowerCase().includes('/thehub') || window.location.pathname.toLowerCase().includes('/portal/story/');

    // 3. LOGO ENGINE
    let logoHTML = '';

    if (isInsights) {
        // Insights logo is always white because header is always dark
        logoHTML = `<img id="snav-logo-desktop" src="/insights/assets/images/insights_logo_white_desktop.webp" alt="Insights" height="48" style="height:48px;width:auto;">`;
    } else if (isHub) {
        const hubMarkMap = { hire: 'coral-3d_logomark.webp', partner: 'teal-3d_logomark.webp', explore: 'white-3d_logomark.webp' };
        const hubMark = hubMarkMap[persona] || 'white-3d_logomark.webp';
        logoHTML = `
            <div style="display:flex;align-items:center;gap:12px;">
                <img id="snav-logo-desktop" src="/assets/images/${hubMark}" alt="LG" height="48" style="height:48px;width:auto;">
                <div style="width:1px;height:24px;background:rgba(255,255,255,0.2);"></div>
                <span style="font-family:'Big Shoulders Display';font-size:18px;font-weight:700;color:#FFF;text-transform:uppercase;letter-spacing:1px;">The Hub.</span>
            </div>`;
    } else {
        const portMapDark  = { hire: 'coral_lg-portfolio-logo.webp', partner: 'LG_Portfolio_logo_teal.webp', explore: 'white_lg-portfolio-logo.webp' };
        const portLogo = portMapDark[persona] || 'white_lg-portfolio-logo.webp';
        logoHTML = `<img id="snav-logo-desktop" src="/assets/images/${portLogo}" alt="Luis Gilberto Portfolio" height="48" style="height:48px;width:auto;">`;
    }

    // 3. GENERATE MASTER HTML
    navHook.innerHTML = `
    <header class="${isHub ? 'site-header site-header--hub' : 'site-header'}" style="border-bottom:1px solid rgba(255,255,255,0.08);height:80px;display:flex;align-items:center;position:fixed;top:0;width:100%;z-index:10000;">
        <div class="nav-container" style="max-width:1400px;margin:0 auto;width:100%;padding:0 48px;display:flex;justify-content:space-between;align-items:center;">

            <a href="/" style="text-decoration:none;" class="desktop-logo">${logoHTML}</a>
            <a href="/" style="text-decoration:none;" class="mobile-logo-mark">
                <img id="snav-logo-mobile" height="40" style="height:40px;width:auto;display:block;" alt="LG">
            </a>

            <nav class="desktop-nav" style="display:flex;gap:8px;position:relative;">
                <button class="nav-link" data-trigger="portfolio">Portfolio</button>
                <button class="nav-link" data-trigger="insights">Insights</button>
                <button class="nav-link" data-trigger="hub">The Hub</button>
                <a href="https://portal.luis-gilberto.com" class="nav-link nav-portal-lockup" style="padding:0 8px;">
                    <img class="portal-logo-dark"  src="/assets/images/TheLGPortal_dark-mode.png"  alt="The Portal" style="height:32px;width:auto;display:block;">
                    <img class="portal-logo-light" src="/assets/images/TheLGPortal_light-mode.png" alt="The Portal" style="height:32px;width:auto;display:none;">
                </a>

                <div class="nav-viewport" id="master-viewport">
                    <div class="nav-viewport-inner">
                        <div id="view-portfolio" class="view-content" style="display:none;">
                            <div class="grid-2">
                                <a href="${base}myexperience.html" class="mega-link"><div class="mega-icon"><i class="fas fa-briefcase"></i></div><div class="mega-text"><b>Experience</b><span>15+ years of leadership</span></div></a>
                                <a href="${base}journey.html" class="mega-link"><div class="mega-icon"><i class="fas fa-stream"></i></div><div class="mega-text"><b>Journey</b><span>Career pivots & eras</span></div></a>
                                <a href="${base}about.html" class="mega-link"><div class="mega-icon"><i class="fas fa-user"></i></div><div class="mega-text"><b>About Me</b><span>The human story</span></div></a>
                                <a href="https://www.luis-gilberto.com/brand/" class="mega-link"><div class="mega-icon" style="color:var(--teal);"><i class="fas fa-fingerprint"></i></div><div class="mega-text"><b>Identity</b><span>Canonical guidelines</span></div></a>
                            </div>
                        </div>
                        <div id="view-insights" class="view-content" style="display:none;">
                            <div class="grid-2">
                                <a href="${base}insights/" class="mega-link"><div class="mega-icon"><i class="fas fa-home"></i></div><div class="mega-text"><b>Insights Home</b><span>Main editorial feed</span></div></a>
                                <a href="${base}insights/series/#building" class="mega-link"><div class="mega-icon"><i class="fas fa-hammer"></i></div><div class="mega-text"><b>Building Series</b><span>Structural decisions, built in public</span></div></a>
                                <a href="${base}insights/series/#use-cases" class="mega-link"><div class="mega-icon"><i class="fas fa-flask"></i></div><div class="mega-text"><b>Use Cases</b><span>Real-world launches & strategy</span></div></a>
                                <a href="${base}insights/series/#reflections" class="mega-link"><div class="mega-icon"><i class="fas fa-feather"></i></div><div class="mega-text"><b>Reflections</b><span>Creativity, pace, and momentum</span></div></a>
                            </div>
                        </div>
                        <div id="view-hub" class="view-content" style="display:none;"> 
                          <div class="mega-panel-header"> 
                            <span class="mega-panel-label">The Hub</span> 
                            <p class="mega-panel-tagline">Three arms. One system.</p> 
                          </div> 
                          <div class="grid-3"> 
                            <a href="${base}TheHub/advisory/index.html" class="mega-link"> 
                              <div class="mega-icon"><i class="fas fa-compass"></i></div> 
                              <div class="mega-text"><b>Advisory</b><span>Strategic leadership guidance. Alignment and clarity for complex decisions.</span></div> 
                            </a> 
                            <a href="${base}TheHub/studio.html" class="mega-link"> 
                              <div class="mega-icon"><i class="fas fa-paint-brush"></i></div> 
                              <div class="mega-text"><b>The Studio</b><span>High-fidelity execution. Ideas into tangible assets.</span></div> 
                            </a> 
                            <a href="https://portal.luis-gilberto.com/" target="_blank" rel="noopener" class="mega-link"> 
                              <div class="mega-icon"><i class="fas fa-lock"></i></div> 
                              <div class="mega-text"><b>The Portal ↗</b><span>Secure command center. Where strategy becomes operational.</span></div> 
                            </a> 
                          </div> 
                          <div class="mega-divider"></div> 
                          <div class="mega-orientation"> 
                            <a href="${base}TheHub/index.html" class="mega-orientation-link">Hub Overview</a> 
                            <a href="/portal/story/" class="mega-orientation-link">How It Works</a> 
                          </div> 
                        </div> 
                    </div>
                </div>
            </nav>

            <div style="display:flex;align-items:center;gap:16px;">
                <div id="master-badge-anchor" class="desktop-badge-anchor"></div>
                <button id="masterThemeToggle" style="background:none;border:1px solid rgba(255,255,255,0.15);color:#FFF;width:36px;height:36px;border-radius:6px;cursor:pointer;display:flex;align-items:center;justify-content:center;"></button>
                <button class="mobile-menu-btn" id="mobile-menu-btn" aria-label="Open navigation">
                    <span></span><span></span><span></span>
                </button>
            </div>
        </div>
    </header>
    <div class="drawer-overlay" id="drawer-overlay"></div>
    <div class="mobile-drawer" id="mobile-drawer">
        <div class="drawer-head">
            <div class="drawer-channel-info">
                <span class="drawer-eyebrow">You are in</span>
                <span class="drawer-channel-name" id="drawer-channel-name"></span>
            </div>
            <button class="drawer-close" id="drawer-close">✕</button>
        </div>
        <div class="drawer-section">
            <div class="drawer-section-label" id="drawer-channel-label"></div>
            <div id="drawer-channel-links"></div>
        </div>
        <div class="drawer-section">
            <div class="drawer-section-label coral">Ecosystem</div>
            <a href="/index.html" class="drawer-nav-link"><span>Portfolio</span><span class="dnl-arrow">›</span></a>
            <a href="/insights/" class="drawer-nav-link"><span>Insights</span><span class="dnl-arrow">›</span></a>
            <a href="/TheHub/index.html" class="drawer-nav-link"><span>The Hub</span><span class="dnl-arrow">›</span></a>
            <a href="https://portal.luis-gilberto.com" class="drawer-nav-link drawer-portal-lockup" style="padding:11px 0;">
                <img class="portal-logo-dark"  src="/assets/images/TheLGPortal_dark-mode.png"  alt="The Portal" style="height:32px;width:auto;display:block;">
                <img class="portal-logo-light" src="/assets/images/TheLGPortal_light-mode.png" alt="The Portal" style="height:32px;width:auto;display:none;">
            </a>
        </div>
        <div class="drawer-section" style="border-bottom:none;padding-bottom:8px;">
            <div class="drawer-section-label" style="color:#F96F6E;margin-bottom:12px;">Get in touch<span style="flex:1;height:1px;background:rgba(249,111,110,0.15);display:block;margin-left:8px;"></span></div>
            <a href="/contact.html" style="display:flex;align-items:center;justify-content:space-between;padding:14px 20px;background:rgba(249,111,110,0.07);border:1px solid rgba(249,111,110,0.2);border-radius:8px;text-decoration:none;transition:all 0.2s;">
                <span style="font-family:'Inter',sans-serif;font-size:14px;font-weight:600;color:#FAF7F4;">Let's work together</span>
                <span style="font-family:'Inter',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#F96F6E;">Contact →</span>
            </a>
        </div>
        <div class="drawer-foot">
            <div id="drawer-badge-anchor"></div>
            <button id="drawerThemeToggle" style="width:32px;height:32px;border:1px solid rgba(255,255,255,0.1);border-radius:6px;background:none;color:rgba(255,255,255,0.4);font-size:13px;cursor:pointer;display:flex;align-items:center;justify-content:center;"></button>
        </div>
    </div>`;

    // 4. SOVEREIGN CSS INJECTION
    const styleInject = document.createElement('style');
    styleInject.innerHTML = `
        :root { --tan-paper: #E8E4DF; --obsidian: #050505; }

        [data-theme="light"] body { background-color: var(--tan-paper) !important; color: #1a1a1a !important; }
        [data-theme="light"] .portal-reveal-section { background-color: #DDD9D3 !important; }
        [data-theme="light"] .btn-cta, [data-theme="light"] .cta-button, [data-theme="light"] .hub-closing-btn { background: var(--obsidian) !important; color: #FFF !important; box-shadow: 0 10px 30px rgba(0,0,0,0.15) !important; }
        [data-theme="light"] .btn-cta:hover { background: #333 !important; transform: translateY(-2px); }
        [data-theme="light"] .site-footer, [data-theme="light"] .site-footer * { color: #FFFFFF !important; opacity: 1 !important; }
        [data-theme="light"] .site-footer { background: #050505 !important; }

        .site-header { background: #080808 !important; }

        .nav-link { font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.6) !important; background: none; border: none; cursor: pointer; padding: 8px 16px; transition: 0.2s; display: flex; align-items: center; gap: 6px; }
        .nav-link:hover, .nav-link.active { color: #FFF !important; background: rgba(255,255,255,0.05); border-radius: 6px; }
        
        #masterThemeToggle { border-color: rgba(255,255,255,0.15) !important; color: #FFF !important; background: none !important; }
        #drawerThemeToggle { border-color: rgba(255,255,255,0.15) !important; color: #FFF !important; background: none !important; }

        .nav-viewport { position: absolute; top: 80px; left: 50%; transform: translateX(-50%); display: none; z-index: 10001; padding-top: 10px; }
        .nav-viewport-inner { background: #111; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; box-shadow: 0 40px 80px rgba(0,0,0,0.6); width: 580px; padding: 12px; }
        .mega-link { display: flex; align-items: flex-start; gap: 16px; padding: 16px; border-radius: 10px; text-decoration: none; transition: 0.2s; border: 1px solid transparent; }
        .mega-link:hover { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.05); }
        .mega-icon { width: 42px; height: 42px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--coral); font-size: 1.2rem; flex-shrink: 0; }
        .mega-icon i { color: inherit; }
        .mega-text b { display: block; font-size: 14px; color: #FFF; margin-bottom: 2px; font-weight: 700; }
        .mega-text span { font-size: 11px; color: rgba(255,255,255,0.4); display: block; line-height: 1.4; }

        .audience-badge { height: 26px; padding: 0 14px; border-radius: 20px; font-size: 9px; font-weight: 700; letter-spacing: 1px; display: inline-flex; align-items: center; gap: 8px; cursor: pointer; transition: all 0.3s ease; border: 1px solid rgba(255,255,255,0.1); color: #FFF; }
        .badge-dot { width: 5px; height: 5px; border-radius: 50%; animation: status-breath 2.5s infinite ease-in-out; }
        @keyframes status-breath { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.8); } }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .grid-3 { 
          display: grid; 
          grid-template-columns: repeat(3, minmax(0, 1fr)); 
          gap: 8px; 
        } 
  
        .mega-panel-header { 
          padding: 4px 4px 12px; 
          border-bottom: 1px solid rgba(255,255,255,0.06); 
          margin-bottom: 8px; 
        } 
  
        .mega-panel-label { 
          font-size: 0.6rem; 
          font-weight: 700; 
          text-transform: uppercase; 
          letter-spacing: 0.14em; 
          color: var(--teal, #4BADA8); 
          display: block; 
          margin-bottom: 4px; 
        } 
  
        .mega-panel-tagline { 
          font-size: 0.85rem; 
          font-weight: 600; 
          color: rgba(255,255,255,0.85); 
          margin: 0; 
        } 
  
        .mega-divider { 
          height: 1px; 
          background: rgba(255,255,255,0.08); 
          margin: 8px 0; 
        } 
  
        .mega-orientation { 
          display: flex; 
          gap: 1.5rem; 
          padding: 4px 4px 0; 
          flex-wrap: wrap; 
        } 
  
        .mega-orientation-link { 
          font-size: 0.65rem; 
          font-weight: 500; 
          text-transform: uppercase; 
          letter-spacing: 0.12em; 
          color: rgba(255,255,255,0.3); 
          text-decoration: none; 
          transition: color 0.2s; 
        } 
  
        .mega-orientation-link:hover { 
          color: var(--teal, #4BADA8); 
        } 
  
        .mega-orientation-link:focus-visible { 
          outline: 1px solid var(--teal, #4BADA8); 
          outline-offset: 2px; 
          color: var(--teal, #4BADA8); 
        } 

        .section-eyebrow, .pillars-eyebrow { font-family: 'Big Shoulders Display', sans-serif !important; font-weight: 900 !important; font-size: 14px !important; letter-spacing: 0.15em !important; text-transform: uppercase !important; }
        [data-theme="light"] .section-eyebrow, [data-theme="light"] .pillars-eyebrow { color: #050505 !important; }

        /* ── DESKTOP/MOBILE LOGO SWAP ── */
        .mobile-logo-mark { display: none; }
        .desktop-logo { display: block; }

        /* ── MOBILE HAMBURGER ── */
        .mobile-menu-btn { display: none; width: 36px; height: 36px; border: 1px solid rgba(255,255,255,0.15); border-radius: 6px; background: none; cursor: pointer; flex-direction: column; align-items: center; justify-content: center; gap: 5px; padding: 0; }
        .mobile-menu-btn span { display: block; height: 1.5px; width: 16px; background: rgba(255,255,255,0.7); border-radius: 1px; transition: all 0.25s; align-self: center; margin: 0; }
        .mobile-menu-btn.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .mobile-menu-btn.open span:nth-child(2) { opacity: 0; }
        .mobile-menu-btn.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }
        [data-theme="light"] .mobile-menu-btn span,
        [data-theme="light"] .snav-toggle span, 
        [data-theme="light"] .nav-hamburger span, 
        [data-theme="light"] .nav-toggle span { 
          background: #FFF !important; 
        } 

        .desktop-badge-anchor { display: flex; }

        /* ── PORTAL LOCKUP THEME SWAP ── */
        [data-theme="light"] .portal-logo-dark  { display: none !important; }
        [data-theme="light"] .portal-logo-light { display: block !important; }

        /* Hub pages: nav is always dark — lock Portal logo to dark variant */ 
        html[data-theme="light"] .site-header--hub .portal-logo-dark  { display: block !important; } 
        html[data-theme="light"] .site-header--hub .portal-logo-light { display: none !important; } 
        [data-theme="dark"]  .portal-logo-light { display: none !important; }
        [data-theme="dark"]  .portal-logo-dark  { display: block !important; }

        /* ── DRAWER ── */
        .drawer-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 9998; backdrop-filter: blur(2px); opacity: 0; transition: opacity 0.3s ease; }
        .drawer-overlay.visible { opacity: 1; }
        .mobile-drawer { position: fixed; top: 0; right: 0; width: 420px; min-width: 300px; max-width: 420px; height: 100vh; background: #080808; border-left: 1px solid rgba(255,255,255,0.07); z-index: 9999; transform: translateX(100%); transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94); overflow-y: auto; display: flex; flex-direction: column; }
        .mobile-drawer.open { transform: translateX(0); }
        .drawer-head { padding: 24px 24px 20px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; background: #080808; z-index: 1; }
        .drawer-channel-info { display: flex; flex-direction: column; gap: 3px; }
        .drawer-eyebrow { font-family: 'Inter', sans-serif; font-size: 9px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255,255,255,0.28); }
        .drawer-channel-name { font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; color: #2ED3C6; letter-spacing: 0.04em; }
        .drawer-close { width: 32px; height: 32px; border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; background: none; color: rgba(255,255,255,0.4); font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .drawer-close:hover { border-color: rgba(255,255,255,0.25); color: #fff; }
        .drawer-section { padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .drawer-section-label { font-family: 'Big Shoulders Display', sans-serif !important; font-size: 11px !important; font-weight: 900 !important; letter-spacing: 0.16em; text-transform: uppercase; color: #2ED3C6; margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
        .drawer-section-label::after { content: ''; flex: 1; height: 1px; background: rgba(46,211,198,0.15); }
        .drawer-section-label.coral { color: #F96F6E; }
        .drawer-section-label.coral::after { background: rgba(249,111,110,0.15); }
        .drawer-nav-link { display: flex; align-items: center; justify-content: space-between; padding: 11px 0; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 400; color: rgba(255,255,255,0.5); text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.04); transition: color 0.2s; }
        .drawer-nav-link:last-child { border-bottom: none; }
        .drawer-nav-link:hover { color: rgba(255,255,255,0.9); }
        .drawer-nav-link.active { color: #FAF7F4; font-weight: 500; }
        .drawer-nav-link .dnl-arrow { font-size: 11px; color: rgba(255,255,255,0.2); }
        .drawer-nav-link.active .dnl-arrow { color: #2ED3C6; }
        .drawer-foot { padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; margin-top: auto; border-top: 1px solid rgba(255,255,255,0.05); }

        /* ── DRAWER LIGHT MODE ── */
        [data-theme="light"] .mobile-drawer { background: #F3EFE0; border-color: rgba(17,17,17,0.1); }
        [data-theme="light"] .drawer-head { background: #F3EFE0; border-bottom-color: rgba(17,17,17,0.08); }
        [data-theme="light"] .drawer-section { border-bottom-color: rgba(17,17,17,0.07); }
        [data-theme="light"] .drawer-nav-link { color: rgba(17,17,17,0.5); border-bottom-color: rgba(17,17,17,0.05); }
        [data-theme="light"] .drawer-nav-link:hover, [data-theme="light"] .drawer-nav-link.active { color: #111; }
        [data-theme="light"] .drawer-section-label { color: #F96F6E !important; }
        [data-theme="light"] .drawer-section-label::after { background: rgba(249,111,110,0.2); }
        [data-theme="light"] .drawer-foot { background: #EDE9DF; border-top-color: rgba(17,17,17,0.07); }
        [data-theme="light"] .drawer-close { color: rgba(17,17,17,0.4); border-color: rgba(17,17,17,0.15); }
        [data-theme="light"] .drawer-close:hover { color: #111; }
        [data-theme="light"] .drawer-eyebrow { color: rgba(17,17,17,0.35); }
        [data-theme="light"] .drawer-channel-name { color: #2ED3C6; }

        /* ── FOOTER RESPONSIVE ── */
        @media (max-width: 1023px) {
            .ft-responsive-grid { grid-template-columns: 1fr !important; padding: 48px 28px 0 !important; gap: 40px !important; }
            .ft-responsive-legal { flex-direction: column !important; align-items: center !important; justify-content: center !important; text-align: center !important; gap: 10px !important; padding: 20px 28px 32px !important; }
            .ft-responsive-legal span:last-child { text-align: center !important; max-width: 100% !important; }
            .ft-responsive-grid > div { display: flex !important; flex-direction: column !important; align-items: center !important; text-align: center !important; }
            .ft-responsive-grid ul { align-items: center !important; }
            .mobile-menu-btn { display: flex !important; }
            .desktop-nav { display: none !important; }
            .desktop-badge-anchor { display: none !important; }
            #masterThemeToggle { display: none !important; }
        }
        @media (max-width: 1024px) and (min-width: 769px) {
            .mobile-logo-mark { display: none !important; }
            .desktop-logo { display: block !important; }
        }
        @media (max-width: 768px) {
            .mobile-logo-mark { display: block !important; }
            .desktop-logo { display: none !important; }
            .ft-responsive-grid { padding: 40px 20px 0 !important; }
            .ft-responsive-legal { padding: 16px 20px 24px !important; }
            .mobile-drawer { width: 100vw !important; max-width: 100vw !important; }
        }
    `;
    document.head.appendChild(styleInject);

    // 5. DECLARE DRAWER ELEMENTS (must be before updateUI)
    const menuBtn     = document.getElementById('mobile-menu-btn');
    const drawer      = document.getElementById('mobile-drawer');
    const overlay     = document.getElementById('drawer-overlay');
    const drawerTheme = document.getElementById('drawerThemeToggle');

    // 5.5 INITIALIZE MOBILE LOGOMARK
    const markImg = document.getElementById('snav-logo-mobile');
    if (markImg) {
        const mk = (persona === 'coral' || persona === 'hire') ? 'hire' : (persona === 'teal' || persona === 'partner') ? 'partner' : 'explore';
        if (isInsights) {
            markImg.src = `/insights/assets/images/white-3d_logomark.webp`;
        } else if (isHub) {
            const hubMarkMap = { hire: 'coral-3d_logomark.webp', partner: 'teal-3d_logomark.webp', explore: 'white-3d_logomark.webp' };
            markImg.src = `/assets/images/${hubMarkMap[mk]}`;
        } else {
            const portMarkDark = { hire: 'coral-3d_logomark.webp', partner: 'teal-3d_logomark.webp', explore: 'white-3d_logomark.webp' };
            markImg.src = `/assets/images/${portMarkDark[mk]}`;
        }
    }

    // 6. THEME BRAIN
    const toggle = document.getElementById('masterThemeToggle');

    const updateUI = (currentTheme) => {
        document.documentElement.setAttribute('data-theme', currentTheme);
        localStorage.setItem('lg-theme', currentTheme);

        const moonIcon = '<i class="fa-regular fa-moon"></i>';
        const sunIcon  = '<i class="fa-solid fa-sun" style="color:#C9A84C;"></i>';
        const icon = currentTheme === 'dark' ? moonIcon : sunIcon;

        if (toggle) toggle.innerHTML = icon;
        if (drawerTheme) drawerTheme.innerHTML = icon;

        // Logos are now static because the header is always dark
        // Swapping is only needed for the Portal logo which is in the nav-links
    };

    if (toggle) {
        toggle.addEventListener('click', () => {
            const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            updateUI(newTheme);
        });
    }

    updateUI(theme);

    // 7. DESKTOP VIEWPORT LOGIC (mega menu)
    const triggers = document.querySelectorAll('[data-trigger]');
    const viewport = document.getElementById('master-viewport');
    const contents = document.querySelectorAll('.view-content');
    let timer;
    triggers.forEach(t => {
        t.addEventListener('mouseenter', () => {
            clearTimeout(timer);
            contents.forEach(c => c.style.display = 'none');
            const target = document.getElementById(`view-${t.dataset.trigger}`);
            if (target) target.style.display = 'block';
            viewport.style.display = 'block';
        });
        t.addEventListener('mouseleave', () => { timer = setTimeout(() => viewport.style.display = 'none', 200); });
    });
    if (viewport) {
        viewport.addEventListener('mouseenter', () => clearTimeout(timer));
        viewport.addEventListener('mouseleave', () => viewport.style.display = 'none');
    }

    // 8. LUXE BADGE INJECTION
    const badgeMap = {
        hire:    `<div id="snav-badge" class="audience-badge" style="color:var(--coral);border-color:rgba(249,111,110,0.3);background:rgba(249,111,110,0.05);"><span class="badge-dot" style="background:var(--coral);box-shadow:0 0 10px var(--coral);"></span><span id="snav-badge-text">HIRE · ASSESS</span></div>`,
        partner: `<div id="snav-badge" class="audience-badge" style="color:var(--teal);border-color:rgba(46,211,198,0.3);background:rgba(46,211,198,0.05);"><span class="badge-dot" style="background:var(--teal);box-shadow:0 0 10px var(--teal);"></span><span id="snav-badge-text">PARTNER</span></div>`,
        explore: `<div id="snav-badge" class="audience-badge" style="color:#FFF;border-color:rgba(255,255,255,0.2);background:rgba(255,255,255,0.05);"><span class="badge-dot" style="background:#FFF;box-shadow:0 0 10px #FFF;"></span><span id="snav-badge-text">EXPLORE</span></div>`
    };
    const mapped = (persona === 'coral' || persona === 'hire') ? 'hire' : (persona === 'teal' || persona === 'partner') ? 'partner' : 'explore';
    const anchor = document.getElementById('master-badge-anchor');
    if (anchor) {
        anchor.innerHTML = badgeMap[mapped];
        const ri = document.getElementById('snav-badge');
        if (ri) ri.addEventListener('click', () => { const gate = document.getElementById('intentGate'); if (gate) gate.classList.add('visible'); });
    }

    // 9. MOBILE DRAWER
    const activeChannel      = isInsights ? 'insights' : isHub ? 'hub' : 'portfolio';
    const channelNames       = { insights: 'Insights', hub: 'The Hub', portfolio: 'Portfolio' };
    const channelDisplayName = channelNames[activeChannel];

    const dnEl = document.getElementById('drawer-channel-name');
    const dlEl = document.getElementById('drawer-channel-label');
    if (dnEl) dnEl.textContent = channelDisplayName;
    if (dlEl) dlEl.textContent = `This channel: ${channelDisplayName}`;

    if (drawerTheme) {
        drawerTheme.addEventListener('click', () => {
            const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            updateUI(newTheme);
        });
    }

    const channelLinksMap = {
        insights: [
            { label: 'Insights home',        href: '/insights/',                    active: path.endsWith('/insights/') || path.endsWith('/insights/index.html') },
            { label: 'Building series',      href: '/insights/series/#building',    active: path.includes('/insights/series') },
            { label: 'Reflections',          href: '/insights/series/#reflections', active: false },
            { label: 'Insights style guide', href: '/insights/style-guide/',        active: path.includes('style-guide') },
        ],
        hub: [
            { label: 'Hub home',   href: '/TheHub/index.html',          active: path.endsWith('/TheHub/') || path.endsWith('/TheHub/index.html') },
            { label: 'Advisory',   href: '/TheHub/advisory/index.html', active: path.includes('advisory') },
            { label: 'The Studio',   href: '/TheHub/studio.html',  active: path.includes('studio') },
            { label: 'How It Works', href: '/portal/story/',      active: path.includes('/portal/story') },
        ],
        portfolio: [
            { label: 'Experience',     href: '/myexperience.html', active: path.includes('myexperience') },
            { label: 'Journey',        href: '/journey.html',      active: path.includes('journey') },
            { label: 'About me',       href: '/about.html',        active: path.includes('about') },
            { label: 'Brand identity', href: '/brand/',            active: path.includes('brand') },
        ]
    };

    const linksContainer = document.getElementById('drawer-channel-links');
    if (linksContainer) {
        (channelLinksMap[activeChannel] || channelLinksMap.portfolio).forEach(link => {
            const a = document.createElement('a');
            a.href = link.href;
            a.className = 'drawer-nav-link' + (link.active ? ' active' : '');
            a.innerHTML = `<span>${link.label}</span><span class="dnl-arrow">${link.active ? '●' : '›'}</span>`;
            linksContainer.appendChild(a);
        });
    }

    const drawerBadge = document.getElementById('drawer-badge-anchor');
    if (drawerBadge) drawerBadge.innerHTML = badgeMap[mapped] || '';

    function openDrawer() {
        if (!drawer || !overlay || !menuBtn) return;
        drawer.classList.add('open');
        overlay.style.display = 'block';
        requestAnimationFrame(() => overlay.classList.add('visible'));
        menuBtn.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        if (!drawer || !overlay || !menuBtn) return;
        drawer.classList.remove('open');
        overlay.classList.remove('visible');
        menuBtn.classList.remove('open');
        document.body.style.overflow = '';
        setTimeout(() => { if (overlay) overlay.style.display = 'none'; }, 300);
    }

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            drawer && drawer.classList.contains('open') ? closeDrawer() : openDrawer();
        });
    }

    // Close on overlay click or X button — using event delegation
    document.addEventListener('click', e => {
        const cb = document.getElementById('drawer-close');
        if (cb && cb.contains(e.target)) { closeDrawer(); return; }
        if (overlay && overlay.style.display === 'block' && e.target === overlay) { closeDrawer(); return; }
    });

    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

});