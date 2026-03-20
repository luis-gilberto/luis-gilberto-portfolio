/* =============================================================
   🧬 portal-nav.js v1.0 · Luis Gilberto Portal Channel
   SCOPE: /portal/, /portal/recruiters/, /portal/partners/ only
   PURPOSE: Dedicated Portal header and mobile drawer
   DOES NOT: inherit Hub logic, inject footers, expose ecosystem
   architecture, reference StrategyIQ, Advisory, or The Studio
   ============================================================= */
document.addEventListener('DOMContentLoaded', function () {

    // 0. DEPENDENCY: FontAwesome
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const fa = document.createElement('link');
        fa.rel = 'stylesheet';
        fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
        document.head.appendChild(fa);
    }

    const navHook = document.getElementById('portal-nav');
    if (!navHook) return;

    // 1. THEME
    const theme = localStorage.getItem('lg-theme') || 'dark';
    const path  = window.location.pathname;

    // 2. ACTIVE STATE DETECTION
    const isRecruiters = path.includes('/portal/recruiters');
    const isPartners   = path.includes('/portal/partners');
    const isOverview   = !isRecruiters && !isPartners;

    function activeStyle(condition) {
        return condition
            ? 'color:#FFFFFF !important; font-weight:700;'
            : 'color:rgba(255,255,255,0.55);';
    }

    // 3. INJECT HTML
    navHook.innerHTML = `
    <header class="portal-header" id="portal-header-el">
        <div class="portal-nav-inner">

            <!-- LOCKUP -->
            <a href="/portal/" class="portal-logo-link">
                <img class="portal-nav-logo portal-nav-logo--dark"  src="/assets/images/TheLGPortal_dark-mode.png"  alt="The Portal" />
                <img class="portal-nav-logo portal-nav-logo--light" src="/assets/images/TheLGPortal_light-mode.png" alt="The Portal" />
            </a>

            <!-- DESKTOP NAV -->
            <nav class="portal-desktop-nav">
                <a href="/portal/"              class="portal-nav-link" style="${activeStyle(isOverview)}">Overview</a>
                <a href="/portal/recruiters/"   class="portal-nav-link" style="${activeStyle(isRecruiters)}">Recruiters</a>
                <a href="/portal/partners/"     class="portal-nav-link" style="${activeStyle(isPartners)}">Partners</a>
            </nav>

            <!-- ACTIONS -->
            <div class="portal-nav-actions">
                <a href="/contact.html" class="portal-cta-btn">Start a Conversation</a>
                <button id="portalThemeToggle" class="portal-theme-btn" aria-label="Toggle theme"></button>
                <button id="portalMenuBtn" class="portal-hamburger" aria-label="Open menu">
                    <span></span><span></span><span></span>
                </button>
            </div>

        </div>
    </header>

    <!-- OVERLAY -->
    <div id="portal-drawer-overlay" class="portal-overlay"></div>

    <!-- MOBILE DRAWER -->
    <div id="portal-drawer" class="portal-drawer">
        <div class="portal-drawer-head">
            <img class="portal-nav-logo portal-nav-logo--dark  portal-drawer-logo" src="/assets/images/TheLGPortal_dark-mode.png"  alt="The Portal" />
            <img class="portal-nav-logo portal-nav-logo--light portal-drawer-logo" src="/assets/images/TheLGPortal_light-mode.png" alt="The Portal" />
            <button id="portalDrawerClose" class="portal-drawer-close" aria-label="Close menu">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="1" y1="1" x2="11" y2="11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    <line x1="11" y1="1" x2="1" y2="11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
            </button>
        </div>

        <div class="portal-drawer-section">
            <div class="portal-drawer-label">The Portal</div>
            <a href="/portal/"            class="portal-drawer-link${isOverview   ? ' is-active' : ''}"><span>Overview</span><span class="pdl-arrow">${isOverview   ? '●' : '›'}</span></a>
            <a href="/portal/recruiters/" class="portal-drawer-link${isRecruiters ? ' is-active' : ''}"><span>Recruiters</span><span class="pdl-arrow">${isRecruiters ? '●' : '›'}</span></a>
            <a href="/portal/partners/"   class="portal-drawer-link${isPartners   ? ' is-active' : ''}"><span>Partners</span><span class="pdl-arrow">${isPartners   ? '●' : '›'}</span></a>
            <a href="/contact.html"       class="portal-drawer-link"><span>Contact</span><span class="pdl-arrow">›</span></a>
        </div>

        <div class="portal-drawer-section portal-drawer-section--secondary">
            <div class="portal-drawer-label portal-drawer-label--dim">More</div>
            <a href="/TheHub/index.html" class="portal-drawer-link portal-drawer-link--dim"><span>The Hub</span><span class="pdl-arrow">›</span></a>
            <a href="/about.html"        class="portal-drawer-link portal-drawer-link--dim"><span>About Luis</span><span class="pdl-arrow">›</span></a>
        </div>

        <div class="portal-drawer-foot">
            <button id="portalDrawerTheme" class="portal-theme-btn" aria-label="Toggle theme"></button>
        </div>
    </div>`;

    // 4. CSS INJECTION
    const css = document.createElement('style');
    css.innerHTML = `
        /* ── PORTAL HEADER BASE ── */
        .portal-header {
            position: fixed;
            top: 0; left: 0; width: 100%;
            height: 72px;
            background: #080808;
            border-bottom: 1px solid rgba(255,255,255,0.08);
            z-index: 10000;
            display: flex;
            align-items: center;
        }
        [data-theme="light"] .portal-header {
            background: #F4F1ED;
            border-bottom-color: rgba(0,0,0,0.08);
        }
        body { padding-top: 72px; }
        /* Note: Portal pages use --header-height variable on hero sections.
           This rule ensures pages without that pattern still clear the header. */

        .portal-nav-inner {
            max-width: 1400px;
            margin: 0 auto;
            width: 100%;
            padding: 0 48px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 2rem;
        }

        /* ── LOCKUP ── */
        .portal-logo-link { display: flex; align-items: center; flex-shrink: 0; }
        .portal-header .portal-nav-logo  { height: 34px !important; width: auto !important; max-height: none !important; }
        .portal-nav-logo--light { display: none !important; }
        .portal-nav-logo--dark  { display: block !important; }
        [data-theme="light"] .portal-nav-logo--dark  { display: none !important; }
        [data-theme="light"] .portal-nav-logo--light { display: block !important; }

        /* ── DESKTOP NAV ── */
        .portal-desktop-nav {
            display: flex;
            align-items: center;
            gap: 4px;
        }
        .portal-nav-link {
            font-family: 'Inter', sans-serif;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            text-decoration: none;
            padding: 8px 16px;
            border-radius: 6px;
            transition: color 0.2s, background 0.2s;
            color: rgba(255,255,255,0.55);
        }
        .portal-nav-link:hover {
            color: #FFF !important;
            background: rgba(255,255,255,0.05);
        }
        [data-theme="light"] .portal-nav-link { color: rgba(17,17,17,0.55); }
        [data-theme="light"] .portal-nav-link:hover { color: #111 !important; background: rgba(0,0,0,0.05); }

        /* ── ACTIONS ── */
        .portal-nav-actions {
            display: flex;
            align-items: center;
            gap: 12px;
            flex-shrink: 0;
        }
        .portal-cta-btn {
            font-family: 'Inter', sans-serif;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            text-decoration: none;
            padding: 9px 20px;
            border-radius: 50px;
            background: #F96F6E;
            color: #050505 !important;
            transition: all 0.25s;
            white-space: nowrap;
        }
        .portal-cta-btn:hover {
            background: #FFFFFF;
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(249,111,110,0.35);
        }
        .portal-theme-btn {
            width: 36px; height: 36px;
            border: 1px solid rgba(255,255,255,0.15);
            border-radius: 6px;
            background: none;
            color: rgba(255,255,255,0.7);
            font-size: 13px;
            cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            transition: all 0.2s;
            flex-shrink: 0;
        }
        .portal-theme-btn:hover { background: rgba(255,255,255,0.06); color: #FFF; }
        [data-theme="light"] .portal-theme-btn { border-color: rgba(0,0,0,0.15); color: rgba(17,17,17,0.6); }
        [data-theme="light"] .portal-theme-btn:hover { background: rgba(0,0,0,0.05); color: #111; }

        /* ── HAMBURGER ── */
        .portal-hamburger {
            display: none;
            width: 36px; height: 36px;
            border: 1px solid rgba(255,255,255,0.15);
            border-radius: 6px;
            background: none;
            cursor: pointer;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 5px;
            padding: 0;
        }
        .portal-hamburger span {
            display: block;
            height: 1.5px;
            width: 16px;
            background: rgba(255,255,255,0.7);
            border-radius: 1px;
            transition: all 0.25s;
            align-self: center;
            margin: 0;
        }
        .portal-hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .portal-hamburger.open span:nth-child(2) { opacity: 0; }
        .portal-hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }
        [data-theme="light"] .portal-hamburger { border-color: rgba(0,0,0,0.15); }
        [data-theme="light"] .portal-hamburger span { background: rgba(17,17,17,0.7); }

        /* ── OVERLAY ── */
        .portal-overlay {
            display: none;
            position: fixed; inset: 0;
            background: rgba(0,0,0,0.6);
            backdrop-filter: blur(2px);
            z-index: 9998;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .portal-overlay.visible { opacity: 1; }

        /* ── DRAWER ── */
        .portal-drawer {
            position: fixed;
            top: 0; right: 0;
            width: 400px; max-width: 100vw;
            height: 100vh;
            background: #080808;
            border-left: 1px solid rgba(255,255,255,0.07);
            z-index: 9999;
            transform: translateX(100%);
            transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            display: flex;
            flex-direction: column;
            overflow-y: auto;
        }
        .portal-drawer.open { transform: translateX(0); }
        [data-theme="light"] .portal-drawer { background: #F3EFE0; border-color: rgba(17,17,17,0.1); }

        .portal-drawer-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 24px;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            position: sticky; top: 0;
            background: #080808;
            z-index: 1;
        }
        /* Drawer logo — CSS controlled, not inline */
        .portal-drawer-logo { height: 29px; width: auto; }
        [data-theme="light"] .portal-drawer-head { background: #F3EFE0; border-bottom-color: rgba(17,17,17,0.08); }

        .portal-drawer-close {
            width: 32px; height: 32px;
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 6px;
            background: none;
            color: rgba(255,255,255,0.4);
            font-size: 14px;
            cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            transition: all 0.2s;
        }
        .portal-drawer-close:hover { border-color: rgba(255,255,255,0.25); color: #FFF; }
        [data-theme="light"] .portal-drawer-close { border-color: rgba(17,17,17,0.15); color: rgba(17,17,17,0.4); }
        [data-theme="light"] .portal-drawer-close:hover { color: #111; }

        .portal-drawer-section {
            padding: 20px 24px;
            border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        [data-theme="light"] .portal-drawer-section { border-bottom-color: rgba(17,17,17,0.07); }

        .portal-drawer-section--secondary { border-bottom: none; }

        .portal-drawer-label {
            font-family: 'Inter', sans-serif;
            font-size: 9px;
            font-weight: 700;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: #F96F6E;
            margin-bottom: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .portal-drawer-label::after {
            content: '';
            flex: 1;
            height: 1px;
            background: rgba(249,111,110,0.15);
        }
        .portal-drawer-label--dim {
            color: rgba(255,255,255,0.25);
        }
        .portal-drawer-label--dim::after {
            background: rgba(255,255,255,0.06);
        }
        [data-theme="light"] .portal-drawer-label--dim { color: rgba(17,17,17,0.3); }

        .portal-drawer-link {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 11px 0;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            font-weight: 400;
            color: rgba(255,255,255,0.55);
            text-decoration: none;
            border-bottom: 1px solid rgba(255,255,255,0.04);
            transition: color 0.2s;
        }
        .portal-drawer-link:last-child { border-bottom: none; }
        .portal-drawer-link:hover { color: #FFF; }
        .portal-drawer-link.is-active { color: #FAF7F4; font-weight: 600; }
        .portal-drawer-link--dim { color: rgba(255,255,255,0.28); font-size: 13px; }
        .portal-drawer-link--dim:hover { color: rgba(255,255,255,0.6); }
        [data-theme="light"] .portal-drawer-link { color: rgba(17,17,17,0.5); border-bottom-color: rgba(17,17,17,0.05); }
        [data-theme="light"] .portal-drawer-link:hover { color: #111; }
        [data-theme="light"] .portal-drawer-link.is-active { color: #111; }
        [data-theme="light"] .portal-drawer-link--dim { color: rgba(17,17,17,0.3); }

        .pdl-arrow { font-size: 11px; color: rgba(255,255,255,0.2); }
        .portal-drawer-link.is-active .pdl-arrow { color: #F96F6E; }
        [data-theme="light"] .pdl-arrow { color: rgba(17,17,17,0.2); }

        .portal-drawer-foot {
            margin-top: auto;
            padding: 16px 24px;
            border-top: 1px solid rgba(255,255,255,0.05);
            display: flex;
            justify-content: flex-end;
        }
        [data-theme="light"] .portal-drawer-foot { border-top-color: rgba(17,17,17,0.07); background: #EDE9DF; }

        /* ── RESPONSIVE ── */
        @media (max-width: 1023px) {
            .portal-nav-inner { padding: 0 24px; }
            .portal-desktop-nav { display: none; }
            .portal-cta-btn { display: none; }
            .portal-hamburger { display: flex !important; }
        }
        @media (max-width: 767px) {
            .portal-nav-inner { padding: 0 16px; }
            .portal-drawer { width: 100vw; }
        }
    `;
    document.head.appendChild(css);

    // 5. THEME ENGINE
    const applyTheme = (t) => {
        document.documentElement.setAttribute('data-theme', t);
        localStorage.setItem('lg-theme', t);
        const moon = '<i class="fa-regular fa-moon"></i>';
        const sun  = '<i class="fa-solid fa-sun" style="color:#C9A84C;"></i>';
        const icon = t === 'dark' ? moon : sun;
        const tb = document.getElementById('portalThemeToggle');
        const td = document.getElementById('portalDrawerTheme');
        if (tb) tb.innerHTML = icon;
        if (td) td.innerHTML = icon;
    };

    applyTheme(theme);

    const tb = document.getElementById('portalThemeToggle');
    const td = document.getElementById('portalDrawerTheme');
    if (tb) tb.addEventListener('click', () => applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));
    if (td) td.addEventListener('click', () => applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));

    // 6. DRAWER LOGIC
    const menuBtn  = document.getElementById('portalMenuBtn');
    const drawer   = document.getElementById('portal-drawer');
    const overlay  = document.getElementById('portal-drawer-overlay');
    const closeBtn = document.getElementById('portalDrawerClose');

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

    if (menuBtn) menuBtn.addEventListener('click', () => drawer.classList.contains('open') ? closeDrawer() : openDrawer());
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    document.addEventListener('click', e => {
        if (overlay && overlay.style.display === 'block' && e.target === overlay) closeDrawer();
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

});
