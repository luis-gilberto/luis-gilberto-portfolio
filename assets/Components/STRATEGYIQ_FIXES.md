# StrategyIQ Page - Fix for Header Icons, Chess Piece Size, and Admin Icon

## ISSUES IDENTIFIED:

1. **Header navigation icons are broken** (showing broken image placeholders)
2. **Chess piece background icon is too small**
3. **Admin icon not showing up**

---

## FIX #1: HEADER NAVIGATION ICONS

### Problem:
The header is using `<img>` tags for navigation icons, but the image paths are broken or don't exist.

### Solution:
Replace image-based icons with SVG icons (more reliable, scalable, brand-compliant).

### Find this section in your HTML (around line 580-650):

```html
<!-- Current broken structure -->
<nav class="header-nav" id="headerNav">
    <a href="/" class="nav-item">
        <img src="/path/to/broken/icon.png" class="nav-icon-img" alt="">
        <span class="nav-label">Home</span>
    </a>
    <!-- ... more broken icon links ... -->
</nav>
```

### Replace with this SVG-based structure:

```html
<nav class="header-nav" id="headerNav">
    <!-- Home -->
    <a href="/" class="nav-item">
        <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        <span class="nav-label">Home</span>
    </a>
    
    <!-- Services -->
    <a href="/TheHub/IMCServices/" class="nav-item">
        <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
        </svg>
        <span class="nav-label">Services</span>
    </a>
    
    <!-- Advisory -->
    <a href="/advisory/" class="nav-item">
        <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        <span class="nav-label">Advisory</span>
    </a>
    
    <!-- ScopeIQ -->
    <a href="/TheHub/scopeiq/" class="nav-item">
        <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
            <path d="M11 8v6"/>
            <path d="M8 11h6"/>
        </svg>
        <span class="nav-label">ScopeIQ</span>
    </a>
    
    <!-- StrategyIQ (Active) -->
    <a href="/TheHub/strategyiq/" class="nav-item active">
        <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        <span class="nav-label">StrategyIQ</span>
    </a>
</nav>
```

### Update the CSS for SVG icons:

```css
.nav-icon {
    width: 20px;
    height: 20px;
    stroke: currentColor;
    transition: transform 0.3s ease;
}

.nav-item:hover .nav-icon {
    transform: scale(1.15);
}

/* Remove old img-based rules */
.nav-icon-img {
    /* DELETE THIS ENTIRE RULE */
}
```

---

## FIX #2: CHESS PIECE ICON SIZE

### Problem:
The chess piece icon is too small in the hero background.

### Find this CSS (should be around line 400-500):

```css
/* Current broken code - TOO SMALL */
.hero-icon-wrapper {
    position: absolute;  /* WRONG */
    width: 200px;        /* TOO SMALL */
    height: 200px;       /* TOO SMALL */
    opacity: 0.3;        /* TOO VISIBLE */
}
```

### Replace with this EXACT code (same as Services page):

```css
/* Chess Queen Icon - Fixed Position & Size */
.hero-icon-wrapper {
    position: fixed !important;        /* FIXED, not absolute */
    right: 100px !important;           /* 100px from right edge */
    top: 50% !important;
    margin-top: -300px !important;     /* Vertically centered */
    width: 600px !important;           /* FULL SIZE */
    height: 600px !important;          /* FULL SIZE */
    opacity: 0.08 !important;          /* SUBTLE (not 0.3!) */
    transform: none !important;
    z-index: 1 !important;             /* Behind content */
    pointer-events: none;
}

.hero-icon {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: brightness(1.1) saturate(1.0) drop-shadow(0 0 40px rgba(249, 111, 110, 0.25));
    mix-blend-mode: screen;
    animation: float-hero-icon 15s ease-in-out infinite;
}

@keyframes float-hero-icon {
    0%, 100% {
        transform: translateY(0px) rotate(0deg);
    }
    50% {
        transform: translateY(-15px) rotate(2deg);
    }
}

/* Responsive sizing */
@media (max-width: 1024px) {
    .hero-icon-wrapper {
        right: 50px !important;
        width: 400px !important;
        height: 400px !important;
        opacity: 0.06 !important;
    }
}

@media (max-width: 767px) {
    .hero-icon-wrapper {
        display: none; /* Hidden on mobile */
    }
}
```

### Make sure the HTML has this structure:

```html
<section class="hero">
    <!-- Chess Queen Icon - MUST BE FIRST -->
    <div class="hero-icon-wrapper" aria-hidden="true">
        <img src="/assets/images/icons/strategyiq-icon-3d.png" 
             alt="" 
             class="hero-icon"
             loading="eager" />
    </div>
    
    <!-- Hero Content - MUST HAVE HIGH Z-INDEX -->
    <div class="hero-content" style="position: relative; z-index: 100;">
        <div class="hero-eyebrow">Professional Strategy Engine</div>
        <h1 class="hero-title">StrategyIQ™ <span style="color: var(--teal)">Engine</span></h1>
        <!-- ... rest of hero content ... -->
    </div>
</section>
```

---

## FIX #3: ADMIN ICON

### Problem:
The admin button icon is not showing (broken image path).

### Find this code (around line 2900-3000):

```html
<!-- Current broken admin button -->
<button id="adminEngineBtn" class="admin-fab">
    <img src="/broken/path/to/admin-icon.png" alt="Admin" class="admin-icon-img">
</button>
```

### Replace with SVG icon:

```html
<!-- Fixed admin button with SVG -->
<button id="adminEngineBtn" class="admin-fab" aria-label="Open Admin Panel">
    <svg class="admin-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 1v6m0 6v6"/>
        <path d="m4.93 4.93 4.24 4.24m5.66 5.66 4.24 4.24"/>
        <path d="M1 12h6m6 0h6"/>
        <path d="m4.93 19.07 4.24-4.24m5.66-5.66 4.24-4.24"/>
    </svg>
</button>
```

### Update admin button CSS:

```css
.admin-fab {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--coral), var(--teal));
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(249, 111, 110, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    transition: all 0.3s ease;
}

.admin-fab:hover {
    transform: scale(1.1) rotate(90deg);
    box-shadow: 0 8px 24px rgba(249, 111, 110, 0.6);
}

.admin-icon {
    width: 24px;
    height: 24px;
    stroke: white;
}

/* Remove old img-based rules */
.admin-icon-img {
    /* DELETE THIS ENTIRE RULE */
}
```

---

## QUICK SUMMARY OF CHANGES:

### 1. Header Navigation:
✅ Replace `<img>` tags with inline SVG icons  
✅ Update CSS to use `.nav-icon` class  
✅ Remove `.nav-icon-img` CSS rules  

### 2. Chess Piece Icon:
✅ Change `position: absolute` → `position: fixed !important`  
✅ Change size from ~200px → `600px !important`  
✅ Change opacity from 0.3 → `0.08 !important`  
✅ Add `right: 100px !important` positioning  
✅ Add floating animation  
✅ Ensure hero content has `z-index: 100`  

### 3. Admin Button:
✅ Replace `<img>` with SVG icon  
✅ Update CSS for `.admin-icon` class  
✅ Remove `.admin-icon-img` CSS rules  

---

## TESTING AFTER FIX:

### Desktop:
- [ ] All 5 header nav icons visible (Home, Services, Advisory, ScopeIQ, StrategyIQ)
- [ ] Chess piece large and subtle on right side of hero (600px size, 0.08 opacity)
- [ ] Chess piece floating gently
- [ ] Admin button bottom-right with gear icon visible
- [ ] All text readable over chess piece

### Tablet:
- [ ] Chess piece scaled to 400px
- [ ] Nav icons still visible

### Mobile:
- [ ] Chess piece hidden
- [ ] Mobile menu works
- [ ] Admin button still visible

---

## IF ICONS STILL DON'T SHOW:

### Verify image path exists:
```
/assets/images/icons/strategyiq-icon-3d.png
```

If the chess queen image is in a different location, update the path in the HTML:
```html
<img src="/YOUR/ACTUAL/PATH/chess-queen.png" 
     alt="" 
     class="hero-icon" />
```

---

## COMPLETE CORRECTED SECTIONS TO COPY/PASTE:

I'll create a file with all the corrected code sections you can directly replace.
