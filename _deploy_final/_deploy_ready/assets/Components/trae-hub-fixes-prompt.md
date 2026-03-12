# Hub Index Page - Surgical Fixes

Hey Trae, I need you to make precise surgical changes to the Hub's main index page. These are targeted fixes to improve brand coherence, accessibility, and functionality. Please apply these changes exactly as specified.

---

## 1. HERO SECTION - Improve Background Contrast & Readability

### Update these CSS rules:

**Hero Overlay** - Reduce opacity to show more of the background image:
```css
.hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(15,15,16,0.75) 0%, rgba(15,15,16,0.85) 100%);
}

[data-theme="dark"] .hero-overlay {
    background: linear-gradient(135deg, rgba(15,15,16,0.85) 0%, rgba(15,15,16,0.92) 100%);
}
```

**Hero Gradient** - Increase coral intensity:
```css
.hero-gradient {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, rgba(249,111,110,0.12) 0%, transparent 70%);
}
```

**Hero Vignette** - Strengthen edge darkening:
```css
.hero-vignette {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%);
}
```

**Hero Title** - Add text shadow for better readability:
```css
.hero-title {
    font-family: 'Big Shoulders Display', sans-serif;
    font-size: var(--hero-headline);
    font-weight: 800;
    line-height: 0.95;
    text-transform: uppercase;
    margin-bottom: clamp(1.5rem, 4vh, 2rem);
    text-shadow: 0 4px 20px rgba(0,0,0,0.5);
}
```

**Gradient Text** - Add drop shadow:
```css
.gradient-text {
    background: linear-gradient(90deg, #F96F6E, #2ED3C6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 2px 10px rgba(249,111,110,0.3));
}
```

**Hero Description** - Improve contrast and add shadow:
```css
.hero-description {
    font-size: var(--body-large);
    color: rgba(255,255,255,0.95);
    max-width: 700px;
    margin: 0 auto clamp(2rem, 5vh, 3rem);
    line-height: 1.7;
    text-shadow: 0 2px 10px rgba(0,0,0,0.5);
}
```

---

## 2. EXPERTISE CARDS - Force 2×2 Grid (No Orphans!)

### Change the grid from auto-fit to explicit 2-column:

**Desktop Grid:**
```css
.expertise-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: clamp(1.5rem, 3vw, 2.5rem);
}
```

**Mobile stays 1 column** - Keep this as is:
```css
@media (max-width: 768px) {
    .expertise-grid {
        grid-template-columns: 1fr;
    }
}
```

---

## 3. MARGINS & SPACING - Match Hub Ecosystem Standards

### Update all container padding from 1.5rem to 3rem max:

**Main Container:**
```css
.container {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 0 clamp(1.5rem, 3vw, 3rem);
}
```

**Nav Container:**
```css
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

**Sub-Nav Container:**
```css
.sub-nav-container {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 0 clamp(1.5rem, 3vw, 3rem);
    height: 100%;
    display: flex;
    gap: 30px;
    align-items: center;
}
```

---

## 4. SUB-NAVIGATION - Dark Gray Background & Coral Active State

### Replace the entire sub-nav section CSS:

```css
/* =========================
   SUB NAVIGATION (48px)
   ========================= */
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

---

## 5. DARK MODE TOGGLE - Fix Icon Display

### Update the icon visibility rules:

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

### Add dark mode body background:

```css
[data-theme="dark"] body {
    background: #0F0F10;
}
```

### Add dark mode section backgrounds:

```css
[data-theme="dark"] .hub-expertise {
    background: #1a1a1a;
}

[data-theme="dark"] .hub-roadmap {
    background: #0F0F10;
}
```

---

## 6. JAVASCRIPT - Enhanced Theme Toggle

### Replace the theme toggle JavaScript with this improved version:

```javascript
// Theme Toggle - Enhanced with debugging
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
```

### Also add null checking to mobile menu functions:

```javascript
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
```

---

## SUMMARY OF CHANGES:

1. ✅ **Hero Background**: Reduced overlay opacity, increased gradient intensity, strengthened vignette, added text shadows
2. ✅ **2×2 Grid Rule**: Changed expertise cards from auto-fit to explicit `repeat(2, 1fr)`
3. ✅ **Margins Fixed**: All containers now use `clamp(1.5rem, 3vw, 3rem)` for consistency
4. ✅ **Sub-Nav**: Dark gray background (#1a1a1a), coral active state, proper text contrast
5. ✅ **Dark Mode Toggle**: Fixed icon display logic, added dark mode backgrounds
6. ✅ **JavaScript**: Enhanced error handling, null checking, console logging

These changes maintain brand coherence with the Hub ecosystem while improving readability, accessibility, and user experience.
