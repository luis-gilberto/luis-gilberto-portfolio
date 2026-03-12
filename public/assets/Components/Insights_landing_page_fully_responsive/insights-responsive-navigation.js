// ============================================
// INSIGHTS RESPONSIVE NAVIGATION FIX
// Unified navigation behavior for all screen sizes
// ============================================

(function() {
    'use strict';

    // ============================================
    // NAVIGATION SYSTEM
    // ============================================
    
    const header = document.querySelector('.lg-site-header');
    const toggle = document.querySelector('.lg-nav-toggle');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const drawerCloseBtn = document.getElementById('drawerCloseBtn');
    
    // Check if we're in mobile view
    function isMobileView() {
        return window.innerWidth <= 768;
    }

    // Open mobile drawer
    function openDrawer() {
        if (!isMobileView() || !mobileOverlay) return;
        
        console.log('📱 Opening mobile drawer');
        mobileOverlay.hidden = false;
        mobileOverlay.style.display = 'flex';
        mobileOverlay.setAttribute('aria-hidden', 'false');
        
        // Use requestAnimationFrame for smooth animation
        requestAnimationFrame(() => {
            mobileOverlay.classList.add('active');
        });
        
        document.body.classList.add('menu-open');
        document.body.style.overflow = 'hidden';
        
        if (toggle) {
            toggle.setAttribute('aria-expanded', 'true');
            toggle.classList.add('active');
        }
        
        // Focus trap
        focusTrap(mobileOverlay);
    }

    // Close mobile drawer
    function closeDrawer() {
        if (!mobileOverlay) return;
        
        console.log('📱 Closing mobile drawer');
        mobileOverlay.classList.remove('active');
        
        // Wait for animation to complete
        setTimeout(() => {
            mobileOverlay.style.display = 'none';
            mobileOverlay.hidden = true;
            mobileOverlay.setAttribute('aria-hidden', 'true');
        }, 400);
        
        document.body.classList.remove('menu-open');
        document.body.style.overflow = '';
        
        if (toggle) {
            toggle.setAttribute('aria-expanded', 'false');
            toggle.classList.remove('active');
            toggle.focus();
        }
    }

    // Focus trap for accessibility
    function focusTrap(container) {
        const focusable = container.querySelectorAll(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        
        function handleTabKey(e) {
            if (e.key !== 'Tab') return;
            
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
        
        container.addEventListener('keydown', handleTabKey);
        
        // Focus first element
        if (first) first.focus();
    }

    // Event listeners
    if (toggle) {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (isMobileView()) {
                const isOpen = mobileOverlay && mobileOverlay.classList.contains('active');
                if (isOpen) {
                    closeDrawer();
                } else {
                    openDrawer();
                }
            }
        });
    }

    if (drawerCloseBtn) {
        drawerCloseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            closeDrawer();
        });
    }

    // Close on overlay click
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', function(e) {
            if (e.target === mobileOverlay) {
                closeDrawer();
            }
        });
    }

    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeDrawer();
        }
    });

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Close drawer if switching to desktop
            if (!isMobileView() && mobileOverlay && mobileOverlay.classList.contains('active')) {
                closeDrawer();
            }
        }, 250);
    });

    // ============================================
    // HEADER SCROLL EFFECT
    // ============================================
    
    function updateHeaderShadow() {
        if (!header) return;
        
        if (window.scrollY > 4) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }
    }

    updateHeaderShadow();
    
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateHeaderShadow, 10);
    }, { passive: true });

    console.log('✅ Navigation system initialized');

})();

// ============================================
// THEME SYSTEM
// ============================================

(function() {
    'use strict';

    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    // Get saved theme or default to light
    const currentTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', currentTheme);
    
    if (themeToggle) {
        themeToggle.setAttribute('aria-pressed', currentTheme === 'dark' ? 'true' : 'false');
    }

    // Update theme-aware images
    function updateThemeImages(theme) {
        const pictures = document.querySelectorAll('picture.theme-picture');
        
        pictures.forEach(picture => {
            const lightSource = picture.querySelector('source[data-role="light"]');
            const darkSource = picture.querySelector('source[data-role="dark"]');
            const img = picture.querySelector('img');
            
            if (theme === 'light') {
                if (lightSource) lightSource.setAttribute('media', 'all');
                if (darkSource) darkSource.setAttribute('media', 'not all');
            } else {
                if (lightSource) lightSource.setAttribute('media', 'not all');
                if (darkSource) darkSource.setAttribute('media', 'all');
            }
            
            // Update img src if data attributes exist
            if (img) {
                const targetSrc = theme === 'light' ? img.dataset.lightSrc : img.dataset.darkSrc;
                if (targetSrc) {
                    img.src = targetSrc;
                }
            }
        });
    }

    // Initial image update
    updateThemeImages(currentTheme);

    // Theme toggle handler
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const newTheme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            themeToggle.setAttribute('aria-pressed', newTheme === 'dark' ? 'true' : 'false');
            
            updateThemeImages(newTheme);
            
            console.log(`🎨 Theme changed to: ${newTheme}`);
        });
    }

    console.log('✅ Theme system initialized');

})();

// ============================================
// TAB SYSTEM
// ============================================

(function() {
    'use strict';

    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding content
            const targetTab = document.getElementById(`${tabId}-tab`);
            if (targetTab) {
                targetTab.classList.add('active');
            }
            
            console.log(`📑 Switched to tab: ${tabId}`);
        });
    });

    console.log('✅ Tab system initialized');

})();

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================

(function() {
    'use strict';

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    console.log('✅ Scroll animations initialized');

})();

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================

(function() {
    'use strict';

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    console.log('✅ Smooth scroll initialized');

})();

console.log('✅ All responsive navigation systems ready');
