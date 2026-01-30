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

document.addEventListener('DOMContentLoaded', () => {
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
            return v && LENS_CONFIG[v] ? v : null;
        } catch { return null; }
    }
    function setLens(lens) {
        if (LENS_CONFIG[lens]) {
            try { localStorage.setItem('lg_intent', lens); } catch {}
        }
    }
    function clearLens() { try { localStorage.removeItem('lg_intent'); } catch {} }

    // Expose helpers globally for future Gate UI integration
    window.LENS_CONFIG = LENS_CONFIG;
    window.getLens = getLens;
    window.setLens = setLens;
    window.clearLens = clearLens;

    // Dynamic, data-driven nav rendering (only when an intent lens is set) 🧩
    (function reorderNavFromLens(){
        const lens = getLens();
        if (!lens) return; // default order when no lens is set

        const container = document.querySelector('.desktop-links');
        if (!container) return;

        const links = Array.from(container.querySelectorAll('a'));
        if (!links.length) return;

        // Build a lookup of existing anchors by normalized href
        const normalizeHref = (h) => {
            try {
                const u = new URL(h, window.location.origin);
                return u.pathname;
            } catch { return h; }
        };
        const byHref = new Map();
        links.forEach(a => byHref.set(normalizeHref(a.getAttribute('href')||''), a));

        const desired = LENS_CONFIG[lens].navOrder;
        const ordered = [];
        desired.forEach(key => {
            const targetHref = ROUTE_MAP[key];
            if (!targetHref) return;
            const node = byHref.get(targetHref);
            if (node) {
                ordered.push(node);
                byHref.delete(targetHref);
            }
        });

        // Append any remaining existing links to preserve deep links and extras
        const leftovers = Array.from(byHref.values());

        // Rebuild container in the new order (no duplication)
        const fragment = document.createDocumentFragment();
        [...ordered, ...leftovers].forEach(a => fragment.appendChild(a));
        container.innerHTML = '';
        container.appendChild(fragment);
    })();
});
