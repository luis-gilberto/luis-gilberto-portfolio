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
            label: 'Evaluating Talent',
            navOrder: ['experience','timeline','resume','portfolio','insights','hub'],
            hideElements: ['pricing-tables','consulting-cta'],
            heroHeadline: 'Building Systems & Leading Teams at Scale.'
        },
        partner: {
            label: 'Seeking Expertise',
            navOrder: ['hub','strategy-iq','portfolio','case-studies','about','insights'],
            hideElements: ['resume-download'],
            heroHeadline: 'Strategic Intelligence & Operating Models.'
        },
        explore: {
            label: 'Just Browsing',
            navOrder: ['about','timeline','portfolio','insights','hub'],
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
        about: '/about.html'
    };

    // State helpers 🎛️
    function getLens() {
        try {
            const v = localStorage.getItem('lg_intent');
            const valid = v && LENS_CONFIG[v] ? v : null;
            if (DEBUG_LENS) console.log('[Lens] load →', valid ?? 'null');
            return valid;
        } catch { return null; }
    }
    function setLens(lens) {
        if (!LENS_CONFIG[lens]) {
            // invalid lens → clear and use default
            try { localStorage.removeItem('lg_intent'); } catch {}
            if (DEBUG_LENS) console.log('[Lens] set invalid, cleared');
            renderNavForLens(null);
            return;
        }
        try { localStorage.setItem('lg_intent', lens); } catch {}
        if (DEBUG_LENS) console.log('[Lens] set →', lens);
        if (DEBUG_LENS) console.log('[Lens] navOrder applied →', LENS_CONFIG[lens].navOrder);
        renderNavForLens(lens);
    }
    function clearLens() {
        try { localStorage.removeItem('lg_intent'); } catch {}
        if (DEBUG_LENS) console.log('[Lens] cleared');
        renderNavForLens(null);
    }

    // Expose helpers globally for future Gate UI integration
    window.LENS_CONFIG = LENS_CONFIG;
    window.getLens = getLens;
    window.setLens = setLens;
    window.clearLens = clearLens;

    // Dynamic, data-driven nav rendering (applies immediately on lens change) 🧩
    function renderNavForLens(lensOverride){
        const lens = lensOverride || getLens();
        if (!lens) return;

        const desired = LENS_CONFIG[lens].navOrder || [];

        const normalizeHref = (h) => {
            try {
                const u = new URL(h, window.location.origin);
                return u.pathname;
            } catch { return h; }
        };

        function reorderContainer(container){
            if (!container) return;
            const links = Array.from(container.querySelectorAll('a'));
            if (!links.length) return;
            const byHref = new Map();
            links.forEach(a => byHref.set(normalizeHref(a.getAttribute('href')||''), a));
            const ordered = [];
            desired.forEach(key => {
                const targetHref = ROUTE_MAP[key];
                if (!targetHref) return;
                const node = byHref.get(targetHref);
                if (node) { ordered.push(node); byHref.delete(targetHref); }
            });
            const leftovers = Array.from(byHref.values());
            const fragment = document.createDocumentFragment();
            [...ordered, ...leftovers].forEach(a => fragment.appendChild(a));
            container.innerHTML = '';
            container.appendChild(fragment);
        }

        // Apply to top global nav
        reorderContainer(document.querySelector('.nav-links'));
        // Apply to portfolio subnav (secondary)
        reorderContainer(document.querySelector('.portfolio-subnav .portfolio-subnav-container'));
    }

    // Backward-compatible alias
    function rerenderNavFromLens(){ renderNavForLens(null); }

    // Initial render + debug
    const lensOnLoad = getLens();
    if (DEBUG_LENS) console.log('[Lens] on load →', lensOnLoad ?? 'null');
    rerenderNavFromLens();

    // Lens control in header/footer (optional UI hook) 🎛️
    (function mountLensControl(){
        const labelEl = document.querySelector('#lensControl');
        const current = getLens();
        if (!labelEl) return;
        const text = current ? `Viewing as: ${LENS_CONFIG[current].label}` : 'Viewing as: Default';
        labelEl.textContent = text;
        labelEl.addEventListener('click', () => {
            clearLens();
            const onHome = window.location.pathname === '/';
            if (onHome) {
                // reopen gate if present
                const gate = document.getElementById('intentGateOverlay');
                if (gate) gate.classList.add('is-open');
            }
        });
    })();

    // Expose explicit renderer
    window.renderNavForLens = renderNavForLens;
// End initialization
