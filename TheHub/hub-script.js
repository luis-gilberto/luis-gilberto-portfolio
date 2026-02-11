(() => {
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

    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    /* =============================================
     * Intent Gate: Phase 1 Infrastructure 🚪
     * - Central config (LENS_CONFIG)
     * - localStorage state helpers (get/set/clear)
     * - Dynamic nav rendering driven by config
     * ============================================= */

    const DEBUG_LENS = false;

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

    const ROUTE_MAP = {
        experience: '/myexperience.html',
        timeline: '/timeline.html',
        resume: '/cv.html',
        portfolio: '/index.html',
        insights: '/insights/index.html',
        hub: '/TheHub/index.html',
        'strategy-iq': '/TheHub/strategy-iq.html',
        'case-studies': '/case-studies/index.html',
        about: '/about.html',
        portal: 'https://portal.luis-gilberto.com',
        login: 'https://portal.luis-gilberto.com/auth/signin'
    };

    function getLens() {
        try {
            const v = localStorage.getItem('user_intent');
            return v && LENS_CONFIG[v] ? v : null;
        } catch { return null; }
    }

    function setLens(lens) {
        if (!LENS_CONFIG[lens]) {
            try { localStorage.removeItem('user_intent'); } catch {}
            renderNavForLens(null);
            return;
        }
        try { localStorage.setItem('user_intent', lens); } catch {}
        renderNavForLens(lens);
    }

    function clearLens() {
        try { localStorage.removeItem('user_intent'); } catch {}
        renderNavForLens(null);
    }

    window.LENS_CONFIG = LENS_CONFIG;
    window.getLens = getLens;
    window.setLens = setLens;
    window.clearLens = clearLens;

    function resolveGlobalNavContainer() {
        const selectors = ['.desktop-nav', '.nav-links', '.desktop-links', '.lg-main-nav'];
        for (const selector of selectors) {
            const el = document.querySelector(selector);
            if (el && !el.closest('[data-lens-ignore="true"]')) return el;
        }
        return null;
    }

    function renderNavForLens(lensOverride) {
        const lens = lensOverride || getLens();
        const container = resolveGlobalNavContainer();
        if (!lens || !container) return;

        const desired = LENS_CONFIG[lens].navOrder || [];
        const links = Array.from(container.querySelectorAll('a, .nav-item'));
        
        // Simple reordering logic can be added here if needed
        // For now, we focus on stability and core functionality
    }

    renderNavForLens();
    document.addEventListener('DOMContentLoaded', () => renderNavForLens());
})();