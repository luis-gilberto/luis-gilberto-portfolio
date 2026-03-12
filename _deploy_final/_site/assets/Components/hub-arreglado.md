# Hub Index Page - Complete Surgical Fixes (HTML + CSS)

Hey Trae, the current page has structural issues that need fixing. I need you to make both HTML structure changes AND CSS updates. Please follow this exactly.

---

## PART 1: HTML STRUCTURE FIXES

### 1. Fix the Sub-Navigation HTML

**FIND THIS:**
```html
<!-- Sub Navigation -->
<nav class="sub-nav">
    <div class="container sub-nav-container">
        <a href="#" class="sub-nav-link active">Home</a>
        <a href="#" class="sub-nav-link">Services</a>
        <a href="#" class="sub-nav-link">Advisory</a>
        <a href="#" class="sub-nav-link">ScopeIQ</a>
        <a href="#" class="sub-nav-link">StrategyIQ</a>
    </div>
</nav>
```

**REPLACE WITH:**
```html
<!-- Sub Navigation -->
<div class="sub-nav">
    <div class="sub-nav-container">
        <a href="hub.html" class="sub-link active">Home</a>
        <a href="imc-services.html" class="sub-link">Services</a>
        <a href="advisory.html" class="sub-link">Advisory</a>
        <a href="scopeiq.html" class="sub-link">ScopeIQ</a>
        <a href="strategyiq.html" class="sub-link">StrategyIQ</a>
    </div>
</div>
```

**KEY CHANGES:**
- Changed `<nav>` to `<div>` (sub-nav doesn't need nav tag)
- Removed `container` class from sub-nav-container
- Changed all `sub-nav-link` to `sub-link`
- Added proper hrefs

### 2. Replace the Mobile Menu Overlay Completely

**FIND THIS:**
```html
<!-- Mobile Menu Overlay -->
<div class="mobile-menu-overlay" id="mobileMenuOverlay">
    <div class="mobile-menu-content">
        <a href="index.html" class="mobile-nav-link">Portfolio</a>
        <a href="insights.html" class="mobile-nav-link">Insights</a>
        <a href="hub.html" class="mobile-nav-link active">The Hub</a>
        <a href="portal.html" class="mobile-nav-link">The Portal</a>
    </div>
</div>
```

**REPLACE WITH:**
```html
<!-- Mobile Menu Overlay -->
<div class="mobile-menu-overlay" id="mobileMenuOverlay">
    <div class="mobile-drawer-header">
        <div class="mobile-brand">
            <img src="https://c.animaapp.com/miw6zgdna5SIGT/img/3d-icon-transparent.png" alt="The Hub" class="mobile-drawer-logo">
        </div>
        <div class="mobile-controls">
            <button class="theme-toggle" id="drawerThemeToggle" aria-label="Toggle theme">
                <svg class="sun-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
                <svg class="moon-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
            </button>
            <button class="drawer-close-btn" id="drawerCloseBtn" aria-label="Close Menu">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    </div>

    <div class="mobile-drawer-content">
        <nav class="mobile-nav-group">
            <div class="mobile-group-label">Global</div>
            <a href="index.html" class="mobile-link main">Portfolio</a>
            <a href="insights.html" class="mobile-link main">Insights</a>
            <a href="hub.html" class="mobile-link main active-parent">The Hub</a>
            <a href="portal.html" class="mobile-link main">The Portal</a>
        </nav>

        <div class="mobile-divider"></div>

        <nav class="mobile-nav-group">
            <div class="mobile-group-label">The Hub Ecosystem</div>
            <a href="hub.html" class="mobile-link sub active">Hub Home</a>
            <a href="imc-services.html" class="mobile-link sub">Services</a>
            <a href="advisory.html" class="mobile-link sub">Advisory</a>
            <a href="scopeiq.html" class="mobile-link sub">ScopeIQ</a>
            <a href="strategyiq.html" class="mobile-link sub">StrategyIQ</a>
        </nav>
    </div>
</div>
```

---

## PART 2: CSS IN hub-styles.css

Now add/update these CSS rules in your `hub-styles.css` file:

### 1. Hero Section - Better Contrast

```css
.hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(15,15,16,0.75) 0%, rgba(15,15,16,0.85) 100%);
}

[data-theme="dark"] .hero-overlay {
    background: linear-gradient(135deg, rgba(15,15,16,0.85) 0%, rgba(15,15,16,0.92) 100%);
}

.hero-gradient {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, rgba(249,111,110,0.12) 0%, transparent 70%);
}

.hero-vignette {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%);
}

.hero-title {
    text-shadow: 0 4px 20px rgba(0,0,0,0.5);
}

.gradient-text {
    background: linear-gradient(90deg, #F96F6E, #2ED3C6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 2px 10px rgba(249,111,110,0.3));
}

.hero-description {
    color: rgba(255,255,255,0.95);
    text-shadow: 0 2px 10px rgba(0,0,0,0.5);
}
```

### 2. Container Padding - Match Ecosystem

```css
.container {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 0 clamp(1.5rem, 3vw, 3rem);
}

.nav-container {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 0 clamp(1.5rem, 3vw, 3rem);
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
```

### 3. Sub-Navigation - Dark Gray with Coral Active

```css
.sub-nav {
    position: fixed;
    top: 64px;
    left: 0;
    width: 100%;
    height: 48px;
    background: #1a1a1a;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    z-index: 999;
    backdrop-filter: blur(10px);
}

[data-theme="dark"] .sub-nav {
    background: #1a1a1a;
    border-bottom: 1px solid rgba(255,255,255,0.1);
}

.sub-nav-container {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 0 clamp(1.5rem, 3vw, 3rem);
    height: 100%;
    display: flex;
    gap: 30px;
    align-items: center;
}

.sub-link {
    text-decoration: none;
    color: rgba(255,255,255,0.6);
    font-size: 13px;
    font-weight: 500;
    transition: color 0.2s;
}

.sub-link:hover { 
    color: rgba(255,255,255,0.9);
}

.sub-link.active {
    color: var(--coral);
    font-weight: 700;
}
```

### 4. Expertise Grid - 2×2 Only

```css
.expertise-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: clamp(1.5rem, 3vw, 2.5rem);
}

@media (max-width: 768px) {
    .expertise-grid {
        grid-template-columns: 1fr;
    }
}
```

### 5. Dark Mode Backgrounds

```css
[data-theme="dark"] body {
    background: #0F0F10;
}

[data-theme="dark"] .hub-expertise {
    background: #1a1a1a;
}

[data-theme="dark"] .hub-roadmap {
    background: #0F0F10;
}
```

### 6. Theme Toggle Icons

```css
.sun-icon, 
.sun-icon svg { 
    display: none; 
}

.moon-icon, 
.moon-icon svg { 
    display: block; 
}

[data-theme="dark"] .sun-icon,
[data-theme="dark"] .sun-icon svg { 
    display: block; 
}

[data-theme="dark"] .moon-icon,
[data-theme="dark"] .moon-icon svg { 
    display: none; 
}
```

### 7. Mobile Drawer Styles

Add these if they don't exist:

```css
.mobile-drawer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
    height: 80px;
    border-bottom: 1px solid var(--gray-border);
}

.mobile-drawer-logo {
    height: 32px;
    width: auto;
}

[data-theme="light"] .mobile-drawer-logo {
    filter: invert(1);
}

.drawer-close-btn {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,0.05);
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 50%;
    color: var(--black);
    cursor: pointer;
    transition: all 0.2s;
}

[data-theme="dark"] .drawer-close-btn {
    background: rgba(255,255,255,0.1);
    border-color: rgba(255,255,255,0.2);
    color: #fff;
}

.mobile-drawer-content {
    padding: 40px 32px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 32px;
}

.mobile-group-label {
    font-size: 0.75rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--text-body);
    margin-bottom: 16px;
    opacity: 0.7;
}

.mobile-link {
    display: block;
    text-decoration: none;
    color: var(--black);
    transition: color 0.2s;
}

.mobile-link.main {
    font-family: 'Big Shoulders Display', sans-serif;
    font-size: 2.5rem;
    font-weight: 700;
    line-height: 1.1;
    margin-bottom: 8px;
}

.mobile-link.sub {
    font-size: 1.1rem;
    font-weight: 500;
    margin-bottom: 12px;
    color: var(--text-body);
    transition: all 0.2s;
}

.mobile-link:hover { 
    color: var(--coral); 
}

.mobile-link.active-parent { 
    color: var(--coral); 
}

.mobile-link.sub.active {
    color: var(--coral);
    font-weight: 700;
    padding-left: 12px;
    border-left: 3px solid var(--coral);
}

.mobile-divider {
    height: 1px;
    width: 100%;
    background: var(--gray-border);
}

@media (max-width: 768px) {
    .mobile-link.main {
        font-size: 2rem;
    }
}
```

---

## PART 3: JAVASCRIPT FIX in hub-script.js

Update your theme toggle and mobile menu JavaScript:

```javascript
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
```

---

## SUMMARY

**HTML Changes:**
1. ✅ Sub-nav structure simplified (removed extra classes, fixed link classes)
2. ✅ Mobile drawer completely replaced with sophisticated version
3. ✅ Added drawer header with close button and theme toggle
4. ✅ Added hierarchical navigation (Global + Hub Ecosystem)

**CSS Changes:**
1. ✅ Hero overlays reduced for better image visibility
2. ✅ Text shadows added for readability
3. ✅ Container padding increased to 3rem max
4. ✅ Sub-nav dark gray background (#1a1a1a)
5. ✅ Sub-nav active state = coral
6. ✅ Expertise grid forced to 2×2
7. ✅ Dark mode backgrounds added
8. ✅ Theme toggle icons fixed
9. ✅ Mobile drawer styles complete

**JavaScript Changes:**
1. ✅ Enhanced theme toggle with error handling
2. ✅ Null checking for mobile menu
3. ✅ Console logging for debugging

Apply these changes in order: HTML first, then CSS, then JavaScript.
