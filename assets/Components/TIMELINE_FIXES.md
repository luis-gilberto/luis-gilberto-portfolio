# Timeline Page Fixes

## Issues Found:
1. **Theme toggle not working properly** - Icons not switching correctly
2. **Mobile menu not showing/functioning** - Hamburger menu not appearing on mobile/tablet
3. **Cloud Dancer color (#F7F5F2) not showing in light mode**

---

## Fixes Applied:

### 1. Cloud Dancer Background (Light Mode)
**Change in `:root` CSS variables:**
```css
:root {
    /* Pantone Cloud Dancer - Light Mode Primary Background */
    --cloud-dancer: #F7F5F2;
    
    /* Light Mode Backgrounds */
    --bg-primary: #F7F5F2;  /* Changed from #FFFFFF */
    --bg-secondary: #FFFFFF;  /* Swapped with primary */
    /* ... rest unchanged */
}
```

---

### 2. Theme Toggle JavaScript Fix

**Replace the existing theme toggle code with:**

```javascript
// ========================================
// THEME TOGGLE - FIXED VERSION
// ========================================
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const mobileThemeToggle = document.getElementById('mobileThemeToggle');
    const htmlElement = document.documentElement;
    
    // Get initial theme from localStorage or default to 'light'
    const currentTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', currentTheme);
    
    // Function to toggle theme
    function toggleTheme() {
        const theme = htmlElement.getAttribute('data-theme');
        const newTheme = theme === 'light' ? 'dark' : 'light';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update particles
        if (newTheme === 'dark') {
            initParticleCanvas();
        } else {
            destroyParticles();
        }
    }
    
    // Add click listeners to both toggles
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', toggleTheme);
    }
    
    // Initialize particles if already in dark mode
    if (currentTheme === 'dark') {
        initParticleCanvas();
    }
}
```

**Then update the DOMContentLoaded listener at the bottom:**

```javascript
// Initialize everything on page load
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initMobileMenu();
    setMobileNavActive();
});
```

**Remove the old theme toggle code** (lines starting with `const themeToggle = document.getElementById('themeToggle');`)

---

### 3. Mobile Menu Hamburger Fix

**Update the CSS for `.mobile-menu-toggle`:**

```css
.mobile-menu-toggle { 
    background: transparent; 
    border: none; 
    cursor: pointer; 
    padding: 0.5rem;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
}

.mobile-menu-toggle svg {
    width: 24px;
    height: 24px;
}
```

**Update the mobile menu overlay CSS:**

```css
.mobile-menu-overlay { 
    position: fixed; 
    inset: 0; 
    background: rgba(0,0,0,0.35); 
    z-index: 2000; 
    opacity: 0; 
    transition: opacity 0.3s ease; 
    pointer-events: none; 
    visibility: hidden;  /* ADD THIS */
}
.mobile-menu-overlay.active { 
    opacity: 1; 
    pointer-events: auto; 
    visibility: visible;  /* ADD THIS */
}
```

**Wrap mobile menu JavaScript in a function:**

```javascript
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileMenuClose = document.getElementById('mobileMenuClose');

    if (mobileMenuToggle && mobileMenuOverlay) {
        mobileMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            if (mobileMenuClose) mobileMenuClose.focus();
            setMobileNavActive();
        });

        function closeDrawer() {
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = '';
            mobileMenuToggle.focus();
        }

        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', (e) => {
                e.stopPropagation();
                closeDrawer();
            });
        }

        mobileMenuOverlay.addEventListener('click', (e) => {
            if (e.target === mobileMenuOverlay) {
                closeDrawer();
            }
        });

        const menuContent = mobileMenuOverlay.querySelector('.mobile-menu-content');
        if (menuContent) {
            menuContent.addEventListener('click', (e) => {
                e.stopPropagation();
            });
            const mobileLinks = mobileMenuOverlay.querySelectorAll('.mobile-nav-link-primary, .mobile-nav-link-secondary');
            mobileLinks.forEach(link => {
                link.addEventListener('click', () => closeDrawer());
            });
        }

        document.addEventListener('keydown', (e) => {
            if (mobileMenuOverlay.classList.contains('active') && e.key === 'Escape') {
                closeDrawer();
            }
        });
    }
}
```

---

## Summary of Changes:

1. **Background Color**: Changed `--bg-primary` to Cloud Dancer (#F7F5F2) for light mode
2. **Theme Toggle**: Consolidated into `initThemeToggle()` function with proper initialization
3. **Mobile Menu**: Added `visibility` CSS property and wrapped in `initMobileMenu()` function
4. **Initialization**: All features now initialize via `DOMContentLoaded` event

These fixes will:
- Show the Cloud Dancer background in light mode ✓
- Make the theme toggle work on both desktop and mobile ✓
- Display and properly function the mobile hamburger menu ✓
