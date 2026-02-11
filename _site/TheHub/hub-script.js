// Theme Toggle - Enhanced
const html = document.documentElement;
const themeToggleButtons = document.querySelectorAll('.theme-toggle');

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);
console.log('Initial theme loaded:', savedTheme);

// Handle all theme toggle buttons
themeToggleButtons.forEach((button, index) => {
    console.log('Theme button found:', index);
    button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        console.log('Toggling theme from', currentTheme, 'to', newTheme);
        
        html.setAttribute('data-theme', newTheme);
        
        try {
            localStorage.setItem('theme', newTheme);
            console.log('Theme saved successfully');
        } catch (error) {
            console.error('Failed to save theme:', error);
        }
    });
});

// Mobile Menu
const mobileToggle = document.getElementById('mobileMenuToggle');
const mobileOverlay = document.getElementById('mobileMenuOverlay');
const drawerCloseBtn = document.getElementById('drawerCloseBtn');

function openDrawer() {
    if (mobileOverlay) {
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeDrawer() {
    if (mobileOverlay) {
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);

// Close on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
});

// Scroll Animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, observerOptions);

// Initialize immediately (script is loaded at end of body, DOM is ready)
    const animatedElements = document.querySelectorAll('[data-animate]');
    console.log('Found animated elements:', animatedElements.length);
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Active State Logic for Mobile Menu
    const currentPath = window.location.pathname;
    const mobileLinks = document.querySelectorAll('.mobile-link');

    mobileLinks.forEach(link => {
        // Get the raw href
        const linkHref = link.getAttribute('href');
        if (!linkHref) return;

        // Resolve relative paths to absolute for comparison if needed, 
        // but simple string matching usually works if hrefs are root-relative (start with /)
        
        // Check for exact match
        if (currentPath === linkHref) {
            link.classList.add('active');
        } 
        // Handle /index.html vs /
        else if (linkHref.endsWith('/index.html') && currentPath === linkHref.replace('/index.html', '/')) {
            link.classList.add('active');
        }
        else if (currentPath.endsWith('/index.html') && linkHref === currentPath.replace('/index.html', '/')) {
            link.classList.add('active');
        }
        // Handle specific case for root
        else if (currentPath === '/' && linkHref === '/index.html') {
            link.classList.add('active');
        }
    });

    /* =============================================
     * Intent Gate: Phase 1 Infrastructure 🚪
     * - Central config (LENS_CONFIG)
     * - localStorage state helpers (get/set/clear)
     * - Dynamic nav rendering driven by config
     * NOTE: Gate UI and homepage overlay will be added later.
     * ============================================= */

    // Debug toggle (developer-only) 🛠️
    const DEBUG_LENS = true;

    // Central, data-driven configuration (no hard-coding in DOM)
    const LENS_CONFIG = {
        hire: {
            label: 'Hire',
            navOrder: ['experience', 'portfolio', 'timeline', 'resume', 'insights', 'hub', 'login'],
            hideElements: [],
            heroHeadline: 'Luis Gilberto: Strategy & Execution.'
        },
        partner: {
            label: 'Partner',
            navOrder: ['hub', 'strategy-iq', 'insights', 'portfolio', 'case-studies', 'login'],
            hideElements: [],
            heroHeadline: 'Strategic Partnership & Systems.'
        },
        explore: {
            label: 'Explore',
            navOrder: ['portfolio', 'insights', 'hub', 'about', 'login'],
            hideElements: [],
            heroHeadline: 'Welcome to the Ecosystem.'
        }
    };

    // Route mapping for nav keys → actual hrefs (only keys that exist will be used) 🧭
    const ROUTE_MAP = {
        experience: '/experience.html', // placeholder; used if present
        timeline: '/timeline.html',     // placeholder; used if present
        resume: '/resume.html',         // placeholder; used if present
        portfolio: '/index.html',
        insights: '/insights/index.html',
        hub: '/TheHub/index.html',
        'strategy-iq': '/TheHub/strategy-iq.html',
        'case-studies': '/case-studies/index.html', // placeholder; used if present
        about: '/about.html',
        portal: 'https://portal.luis-gilberto.com',
        login: 'https://portal.luis-gilberto.com/auth/signin'
    };

    // State helpers 🎛️
    function getLens() {
        try {
            const v = localStorage.getItem('user_intent');
            const valid = v && LENS_CONFIG[v] ? v : null;
            if (DEBUG_LENS) console.log('[Lens] load →', valid ?? 'null');
            return valid;
        } catch { return null; }
    }
    function setLens(lens) {
        if (!LENS_CONFIG[lens]) {
            // invalid lens → clear and use default
            try { localStorage.removeItem('user_intent'); } catch {}
            if (DEBUG_LENS) console.log('[Lens] set invalid, cleared');
            renderNavForLens(null);
            return;
        }
        try { localStorage.setItem('user_intent', lens); } catch {}
        if (DEBUG_LENS) console.log('[Lens] set →', lens);
        if (DEBUG_LENS) console.log('[Lens] navOrder applied →', LENS_CONFIG[lens].navOrder);
        renderNavForLens(lens);

        // Update Smart Hero if available
        if (typeof window.switchHeroLens === 'function') {
            window.switchHeroLens(lens);
        }
    }
    function clearLens() {
        try { localStorage.removeItem('user_intent'); } catch {}
        if (DEBUG_LENS) console.log('[Lens] cleared');
        renderNavForLens(null);

        // Reset Smart Hero if available
        if (typeof window.switchHeroLens === 'function') {
            window.switchHeroLens('explore');
        }
    }

    // Expose helpers globally for future Gate UI integration
    window.LENS_CONFIG = LENS_CONFIG;
    window.getLens = getLens;
    window.setLens = setLens;
    window.clearLens = clearLens;

    // Dynamic, data-driven nav rendering (applies immediately on lens change) 🧩
    function resolveGlobalNavContainer() {
        const selectors = ['.nav-links', '.desktop-links', '.lg-main-nav', 'nav .links'];
        const rejectSelectors = ['.portfolio-subnav', '.subnav', '.tabs', '.portfolio-subnav-container', '[data-lens-ignore="true"]'];
        
        for (const selector of selectors) {
            const elements = document.querySelectorAll(selector);
            for (const el of elements) {
                // Check if element or any parent has data-lens-ignore
                if (el.closest('[data-lens-ignore="true"]')) continue;
                
                // Check if element is inside a rejected subnav/tabs area
                const isRejected = rejectSelectors.some(reject => el.closest(reject));
                if (isRejected) continue;

                // Ensure it's inside a header-like element
                const isInsideHeader = !!el.closest('header, .primary-nav, .lg-header, .site-header, .lg-site-header, nav.fixed-dark');
                if (isInsideHeader) return el;
            }
        }
        if (DEBUG_LENS) console.warn('[Lens] No global nav container found matching criteria.');
        return null;
    }

    function renderNavForLens(lensOverride){
        const lens = lensOverride || getLens();
        const container = resolveGlobalNavContainer();

        if (!lens) {
            updateLensIndicator(null);
            return;
        }

        const desired = LENS_CONFIG[lens].navOrder || [];

        const normalizeHref = (h) => {
            try {
                // Handle relative paths and root-relative
                const origin = window.location.origin;
                const u = new URL(h, origin);
                let path = u.pathname;
                if (path === '/') path = '/index.html';
                if (path.endsWith('/')) path += 'index.html';
                return path;
            } catch { return h; }
        };

        function reorderContainer(container){
            if (!container) return;
            
            // Get all current links
            const links = Array.from(container.querySelectorAll('a'));
            if (!links.length) return;

            // Map links by normalized href
            const byHref = new Map();
            links.forEach(a => {
                const href = a.getAttribute('href') || '';
                byHref.set(normalizeHref(href), a);
            });

            const ordered = [];
            desired.forEach(key => {
                const targetHref = ROUTE_MAP[key];
                if (!targetHref) return;
                
                const normalizedTarget = normalizeHref(targetHref);
                const node = byHref.get(normalizedTarget);
                
                if (node) {
                    ordered.push(node);
                    byHref.delete(normalizedTarget);
                }
            });

            // Append any remaining links that weren't in the desired order
            const leftovers = Array.from(byHref.values());
            const finalOrder = [...ordered, ...leftovers];

            // Only update if order actually changed to preserve focus/state
            const currentHrefs = links.map(a => normalizeHref(a.getAttribute('href')||''));
            const newHrefs = finalOrder.map(a => normalizeHref(a.getAttribute('href')||''));
            
            if (JSON.stringify(currentHrefs) !== JSON.stringify(newHrefs)) {
                if (DEBUG_LENS) console.log('[Lens] Reordering global container:', container);
                const fragment = document.createDocumentFragment();
                finalOrder.forEach(a => fragment.appendChild(a));
                container.innerHTML = '';
                container.appendChild(fragment);
            }
        }

        // Apply ONLY to resolved global nav
        reorderContainer(container);
        
        // Update indicator
        updateLensIndicator(lens);
    }

    function updateLensIndicator(lens) {
        // 1. Check for hardcoded badge (new system)
        const viewBadge = document.getElementById('viewBadge');
        if (viewBadge && lens) {
            viewBadge.innerText = `VIEW: ${lens.toUpperCase()}`;
        }

        // 2. Check for dynamic indicator (legacy/fallback for other pages)
        let indicator = document.querySelector('#lensIndicator');
        const container = resolveGlobalNavContainer();
        
        if (!container) return;

        if (!lens) {
            if (indicator) indicator.remove();
            return;
        }

        if (!indicator && !viewBadge) {
            indicator = document.createElement('div');
            indicator.id = 'lensIndicator';
            indicator.style.cssText = `
                font-size: 10px;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                color: var(--coral, #F96F6E);
                padding: 4px 8px;
                border: 1px solid rgba(249, 111, 110, 0.2);
                border-radius: 4px;
                margin-left: 12px;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                opacity: 0.8;
                transition: all 0.2s;
                font-family: var(--font-orchestrator, 'Inter', sans-serif);
            `;
            indicator.title = 'Click to switch lens';
            indicator.addEventListener('mouseenter', () => {
                indicator.style.opacity = '1';
                indicator.style.background = 'rgba(249, 111, 110, 0.05)';
            });
            indicator.addEventListener('mouseleave', () => {
                indicator.style.opacity = '0.8';
                indicator.style.background = 'transparent';
            });
            indicator.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('[Lens] Re-opening Intent Gate');
                
                if (typeof window.showIntentGate === 'function') {
                    window.showIntentGate();
                } else if (typeof intentGate !== 'undefined' && intentGate.open) {
                    intentGate.open();
                } else {
                    // Fallback: Clear lens and redirect home to trigger gate
                    clearLens();
                    window.location.href = '/index.html';
                }
            });
            
            // Try to find a good spot in the nav
            container.appendChild(indicator);
        }

        if (indicator) {
            indicator.innerText = 'VIEW: ' + (lens.toUpperCase());
        }
    }

    // Backward-compatible alias
    function rerenderNavFromLens(){ renderNavForLens(null); }

    // Initial render + debug
    const lensOnLoad = getLens();
    if (DEBUG_LENS) console.log('[Lens] on load →', lensOnLoad ?? 'null');
    
    // Run immediately and also on DOMContentLoaded to catch slow-loading navs
    renderNavForLens();
    document.addEventListener('DOMContentLoaded', () => renderNavForLens());

    // Expose explicit renderer
    window.renderNavForLens = renderNavForLens;
    window.resolveGlobalNavContainer = resolveGlobalNavContainer;
// End initialization
