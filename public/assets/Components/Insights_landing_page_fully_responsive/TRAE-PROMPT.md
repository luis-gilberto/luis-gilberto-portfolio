# COMPREHENSIVE PROMPT FOR TRAE: Insights Page Responsive Fix

## CONTEXT
The Insights page at `/insights/index.html` has broken tablet navigation (768px-1024px). The desktop nav is hidden, mobile toggle shows but mobile drawer is also hidden, resulting in NO navigation at tablet sizes. This affects ~25% of users.

## OBJECTIVE
Implement a complete responsive fix with clear three-tier breakpoint system:
- Desktop (>1024px): Horizontal nav
- Tablet (768-1024px): Horizontal nav (compact) ← CURRENTLY BROKEN
- Mobile (≤768px): Slide-in drawer

## IMPLEMENTATION PLAN

### STEP 1: Create CSS File
**File**: `/insights/assets/css/insights-responsive-fixes.css`
**Action**: Create new file with the following content:

```css
/* ============================================
   INSIGHTS RESPONSIVE FIXES
   Complete tablet and mobile navigation overhaul
   ============================================ */

/* ============================================
   TABLET BREAKPOINT (768px - 1024px)
   ============================================ */

@media (min-width: 769px) and (max-width: 1024px) {
    /* Show desktop nav, hide mobile toggle on tablet */
    .lg-main-nav {
        display: inline-flex !important;
        position: static !important;
        flex-direction: row !important;
        gap: 20px !important;
        padding: 0 !important;
        background: transparent !important;
        opacity: 1 !important;
        transform: none !important;
    }

    .lg-nav-link {
        color: var(--black) !important;
        font-family: var(--font-base) !important;
        font-size: 13px !important;
        font-weight: 500 !important;
        letter-spacing: 0.08em !important;
        text-transform: uppercase !important;
        min-height: auto !important;
        padding: 0 !important;
    }

    .lg-nav-toggle,
    .lg-nav-close {
        display: none !important;
    }

    .mobile-menu-overlay {
        display: none !important;
    }

    /* Tablet-specific hero adjustments */
    .hero-section {
        min-height: 80vh;
        padding: 3rem 0;
    }

    .insights-video-title {
        max-width: 450px;
    }

    .signature-animation {
        max-width: 300px;
    }

    /* Tab navigation */
    .tab-navigation {
        gap: 0.75rem;
    }

    .tab-button {
        padding: 0.875rem 1.75rem;
        font-size: 1.1rem;
    }

    /* Story carousel */
    .stories-swiper .swiper-slide {
        width: 300px;
    }

    /* Work carousel */
    .work-swiper .swiper-slide {
        width: 380px;
    }

    /* Grid adjustments */
    .find-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
    }

    .archive-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 2rem;
    }
}

/* ============================================
   MOBILE BREAKPOINT (max-width: 768px)
   ============================================ */

@media (max-width: 768px) {
    /* Force hide desktop nav on mobile */
    .lg-main-nav {
        display: none !important;
    }

    .lg-site-header.is-open .lg-main-nav {
        display: none !important;
    }

    /* Show mobile toggle */
    .lg-nav-toggle {
        display: inline-flex !important;
    }

    /* Mobile drawer should be used */
    .mobile-menu-overlay {
        position: fixed !important;
        inset: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        background-color: var(--bg-primary) !important;
        z-index: 11000 !important;
        transform: translateX(100%) !important;
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
        display: none !important;
        flex-direction: column !important;
        overflow: hidden !important;
    }

    .mobile-menu-overlay.active {
        display: flex !important;
        transform: translateX(0) !important;
    }

    /* Show drawer contents only when active */
    .mobile-drawer-header,
    .mobile-drawer-content {
        display: none !important;
    }

    .mobile-menu-overlay.active .mobile-drawer-header,
    .mobile-menu-overlay.active .mobile-drawer-content {
        display: flex !important;
    }

    .mobile-menu-overlay.active .mobile-link,
    .mobile-menu-overlay.active .mobile-group-label,
    .mobile-menu-overlay.active .mobile-divider {
        display: block !important;
    }

    /* Header adjustments */
    .lg-site-header-inner {
        padding: 0 1rem !important;
        height: 56px !important;
    }

    .lg-site-header {
        height: 56px !important;
    }

    .lg-logo-img {
        width: 100px !important;
    }

    /* Hero section */
    .hero-section {
        min-height: auto;
        padding: 1.5rem 0 2rem 0;
    }

    .editorial-label {
        font-size: 0.625rem;
        margin-bottom: 1rem;
    }

    .insights-video-title {
        max-width: 100%;
        padding: 1.5rem;
    }

    .hero-subtitle {
        font-size: 1rem;
        padding: 0 1rem;
    }

    .signature-animation {
        max-width: 200px;
    }

    /* Tab navigation mobile */
    .tab-navigation {
        gap: 0.5rem;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        -ms-overflow-style: none;
        border-bottom: 1px solid var(--border-gray);
    }

    .tab-navigation::-webkit-scrollbar {
        display: none;
    }

    .tab-button {
        padding: 0.75rem 1.25rem;
        font-size: 1rem;
        white-space: nowrap;
        flex-shrink: 0;
    }

    /* Story carousel mobile */
    .stories-swiper .swiper-slide {
        width: 280px !important;
    }

    .story-image {
        height: 200px;
    }

    .story-content {
        padding: 1.5rem;
    }

    .story-title {
        font-size: 1.25rem;
    }

    /* Work carousel mobile */
    .work-swiper .swiper-slide {
        width: 300px !important;
    }

    .work-hero-image {
        height: 380px;
    }

    .work-hero-content {
        padding: 2rem;
    }

    .work-hero-title {
        font-size: 1.5rem;
    }

    /* Spotlight article mobile */
    .spotlight-article {
        grid-template-columns: 1fr;
        gap: 1.5rem;
        padding: 1.5rem;
    }

    .spotlight-image {
        height: 250px;
        border-radius: 12px;
    }

    .spotlight-content {
        padding: 0;
    }

    .spotlight-title {
        font-size: 2rem;
        margin-bottom: 1rem;
    }

    .spotlight-description {
        font-size: 1rem;
        margin-bottom: 1.5rem;
    }

    /* Grid layouts mobile */
    .find-grid,
    .archive-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }

    .find-card,
    .archive-card {
        padding: 2rem;
    }

    /* Numbers grid mobile */
    .numbers-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }

    .number-value {
        font-size: 3rem;
    }

    /* Ahead section mobile */
    .ahead-section {
        padding: 2rem;
    }

    .ahead-section h2 {
        font-size: 1.75rem;
    }

    /* Section headers mobile */
    .section-title {
        font-size: 2rem;
    }

    .section-subtitle {
        font-size: 1rem;
    }

    /* Latest header mobile */
    .latest-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
        margin-bottom: 1.5rem;
    }

    /* Swiper navigation mobile - make larger */
    .swiper-button-prev,
    .swiper-button-next {
        width: 40px;
        height: 40px;
    }

    .swiper-button-prev:after,
    .swiper-button-next:after {
        font-size: 18px;
    }

    /* Padding adjustments */
    .container {
        padding: 0 1rem;
    }

    .find-section,
    .latest-section,
    .archive-section,
    .connect-section {
        padding: 3rem 0;
    }

    footer {
        padding: 2rem 0;
    }

    .footer-links {
        flex-direction: column;
        gap: 1rem;
    }
}

/* ============================================
   SMALL MOBILE (max-width: 480px)
   ============================================ */

@media (max-width: 480px) {
    .lg-logo-img {
        width: 90px !important;
    }

    .hero-section {
        padding: 1rem 0 1.5rem 0;
    }

    .insights-video-title {
        padding: 1rem;
    }

    .signature-animation {
        max-width: 180px;
    }

    .tab-button {
        padding: 0.625rem 1rem;
        font-size: 0.9rem;
    }

    .stories-swiper .swiper-slide {
        width: 260px !important;
    }

    .story-image {
        height: 180px;
    }

    .work-swiper .swiper-slide {
        width: 280px !important;
    }

    .work-hero-image {
        height: 340px;
    }

    .work-hero-title {
        font-size: 1.35rem;
    }

    .spotlight-title {
        font-size: 1.75rem;
    }

    .section-title {
        font-size: 1.75rem;
    }

    .number-value {
        font-size: 2.5rem;
    }

    .cta-button {
        padding: 0.875rem 1.75rem;
        font-size: 0.95rem;
    }
}

/* ============================================
   NAVIGATION BEHAVIOR CONSISTENCY
   ============================================ */

/* Prevent body scroll when mobile menu is open */
body.menu-open {
    overflow: hidden;
    position: fixed;
    width: 100%;
}

/* Ensure theme toggle stays on top */
.theme-toggle {
    z-index: 9999 !important;
}

/* Fix any z-index conflicts */
.lg-site-header {
    z-index: 300;
}

.mobile-menu-overlay {
    z-index: 11000 !important;
}

/* Smooth transitions for responsive changes */
.lg-main-nav,
.lg-nav-link,
.mobile-menu-overlay {
    transition: all 0.3s ease;
}

/* ============================================
   ACCESSIBILITY IMPROVEMENTS
   ============================================ */

/* Focus states for keyboard navigation */
.lg-nav-link:focus-visible,
.mobile-link:focus-visible,
.tab-button:focus-visible {
    outline: 3px solid var(--coral-accent);
    outline-offset: 2px;
    border-radius: 4px;
}

.lg-nav-toggle:focus-visible,
.drawer-close-btn:focus-visible {
    outline: 3px solid var(--coral-accent);
    outline-offset: 2px;
}

/* Improve touch targets on mobile */
@media (max-width: 768px) {
    .mobile-link {
        min-height: 48px;
        display: flex;
        align-items: center;
    }

    .tab-button {
        min-height: 44px;
    }

    .lg-nav-toggle {
        min-width: 48px;
        min-height: 48px;
    }
}

/* ============================================
   PERFORMANCE OPTIMIZATIONS
   ============================================ */

/* Reduce animations on low-end devices */
@media (prefers-reduced-motion: reduce) {
    .mobile-menu-overlay,
    .lg-main-nav,
    .lg-nav-link,
    .swiper-slide {
        transition: none !important;
        animation: none !important;
    }
}

/* GPU acceleration for smooth animations */
.mobile-menu-overlay,
.lg-main-nav,
.swiper-slide {
    will-change: transform;
    transform: translateZ(0);
}
```

---

### STEP 2: Create JavaScript File
**File**: `/insights/assets/js/insights-responsive-navigation.js`
**Action**: Create new file with the following content:

```javascript
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
```

---

### STEP 3: Modify HTML File
**File**: `/insights/index.html`

#### 3A: Add CSS Link
**Location**: In the `<head>` section, AFTER the existing inline `<style id="mobile-drawer-hard-hide">` block and BEFORE `</head>`

**Action**: Insert this line:
```html
<!-- Responsive Fixes - MUST be loaded last to override existing styles -->
<link rel="stylesheet" href="/insights/assets/css/insights-responsive-fixes.css">
```

#### 3B: Remove Conflicting Styles
**Location**: In the `<head>` section

**Action**: Delete the entire `<style id="mobile-drawer-hard-hide">` block that looks like:
```html
<style id="mobile-drawer-hard-hide">
@media (max-width: 768px) {
    .mobile-menu-overlay { position: fixed !important; ... }
    ...
}
</style>
```

#### 3C: Replace Navigation JavaScript
**Location**: Near the bottom of the file, before `</body>`

**Action**: Find and COMPLETELY REPLACE the script that starts with:
```javascript
<script>
    document.addEventListener("DOMContentLoaded", function () {
        const header = document.querySelector(".lg-site-header");
        ...
    });
</script>
```

**Replace it with**:
```html
<!-- Responsive Navigation System -->
<script src="/insights/assets/js/insights-responsive-navigation.js"></script>
```

**Important**: Keep the Swiper initialization script and hero video script. Only replace the navigation-specific script.

---

## VERIFICATION CHECKLIST

After implementation, verify the following:

### Desktop (>1024px)
- [ ] Horizontal navigation visible
- [ ] No hamburger menu icon
- [ ] All nav links clickable
- [ ] Theme toggle works

### Tablet (768px-1024px) ← CRITICAL
- [ ] Desktop navigation visible (NOT mobile drawer)
- [ ] No hamburger menu icon
- [ ] Nav links smaller (13px) but readable
- [ ] 2-column grids display correctly
- [ ] Carousels show 2-3 slides

### Mobile (≤768px)
- [ ] Hamburger icon visible
- [ ] Clicking hamburger opens drawer from right
- [ ] Smooth slide-in animation (400ms)
- [ ] Drawer contains all navigation links
- [ ] Close button (X) works
- [ ] Clicking overlay closes drawer
- [ ] ESC key closes drawer
- [ ] Body scroll locked when drawer open
- [ ] 1-column grids display correctly

### All Sizes
- [ ] No console errors
- [ ] Theme toggle always accessible (top right)
- [ ] Smooth transitions when resizing browser
- [ ] No layout jumps or shifts
- [ ] All images load correctly
- [ ] Carousels function properly

---

## TESTING INSTRUCTIONS

### Manual Testing
1. Open `/insights/index.html` in browser
2. Open DevTools (F12)
3. Test each breakpoint:
   - 1920px (desktop)
   - 1024px (desktop/tablet boundary)
   - 800px (tablet) ← CRITICAL TEST
   - 768px (tablet/mobile boundary)
   - 390px (mobile)

### Specific Test Cases
1. **Tablet Navigation Test**:
   - Set browser width to exactly 800px
   - Verify desktop nav shows (not hamburger)
   - Click each nav link to ensure they work

2. **Mobile Drawer Test**:
   - Set browser width to 390px
   - Click hamburger icon
   - Verify drawer slides in from right
   - Click a link, verify it navigates
   - Try ESC key, verify drawer closes

3. **Resize Test**:
   - Start at 1200px wide
   - Slowly drag window smaller
   - Watch for smooth transitions
   - Ensure no layout breaks

---

## EXPECTED CONSOLE LOGS

When page loads successfully, you should see:
```
✅ Navigation system initialized
✅ Theme system initialized
✅ Tab system initialized
✅ Scroll animations initialized
✅ Smooth scroll initialized
✅ All responsive navigation systems ready
```

---

## FILE STRUCTURE AFTER IMPLEMENTATION

```
/insights/
├── index.html (modified)
├── assets/
│   ├── css/
│   │   └── insights-responsive-fixes.css (NEW)
│   └── js/
│       └── insights-responsive-navigation.js (NEW)
```

---

## ROLLBACK INSTRUCTIONS (IF NEEDED)

If implementation causes issues:

1. Remove line from HTML `<head>`:
```html
<link rel="stylesheet" href="/insights/assets/css/insights-responsive-fixes.css">
```

2. Remove line from before `</body>`:
```html
<script src="/insights/assets/js/insights-responsive-navigation.js"></script>
```

3. Restore the original navigation script that was replaced

4. Restore the `<style id="mobile-drawer-hard-hide">` block if it was removed

---

## SUCCESS CRITERIA

Implementation is successful when:
1. ✅ Tablet users (768-1024px) can see and use navigation
2. ✅ Mobile users (<768px) get smooth drawer experience
3. ✅ Desktop users (>1024px) maintain current experience
4. ✅ No console errors
5. ✅ All carousels and layouts scale properly
6. ✅ Theme toggle works at all sizes
7. ✅ Page loads in <2 seconds

---

## NOTES FOR TRAE

- **Preserve**: All existing functionality (hero video, carousels, theme toggle, tabs)
- **Fix**: Only the navigation breakpoint issue
- **Approach**: Surgical fix, not a full rewrite
- **CSS Load Order**: Critical that new CSS loads AFTER inline styles
- **JavaScript**: Completely replace old nav script with new one
- **Testing**: Focus on 768-1024px range (this was broken)

This is a production-critical fix affecting ~25% of users. The tablet breakpoint was completely non-functional before this fix.
