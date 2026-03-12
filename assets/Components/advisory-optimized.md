# Surgical Fix: Advisory Page Mobile Optimization

## File to Edit
`/TheHub/advisory/index.html`

---

## Fix 1: Add Portal to Global Navigation

**Location:** Inside the desktop-links div in the main header

**Find this block:**
```html
<div class="desktop-links" style="display: flex; gap: 20px; font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;">
    <a href="/index.html">Portfolio</a>
    <a href="/insights/index.html">Insights</a>
    <a href="/TheHub/index.html" class="active-link">The Hub</a>
</div>
```

**Replace with:**
```html
<div class="desktop-links" style="display: flex; gap: 20px; font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;">
    <a href="/index.html">Portfolio</a>
    <a href="/insights/index.html">Insights</a>
    <a href="/TheHub/index.html" class="active-link">The Hub</a>
    <a href="https://portal.luis-gilberto.com">Portal</a>
</div>
```

---

## Fix 2: Add Mobile Drawer Styling

**Location:** In the `<style>` section, add this NEW section right BEFORE the existing mobile optimizations section

**Insert this block:**
```css
        /* ==========================================
           MOBILE DRAWER STYLING
           ========================================== */
        #mobileMenuOverlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(8px);
            z-index: 10001;
            display: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        #mobileMenuOverlay.active {
            display: block;
            opacity: 1;
        }

        #mobileMenuOverlay > div {
            position: absolute;
            top: 0;
            right: 0;
            width: 85%;
            max-width: 400px;
            height: 100%;
            background: #050505;
            border-left: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            flex-direction: column;
            transform: translateX(100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        #mobileMenuOverlay.active > div {
            transform: translateX(0);
        }

        /* Drawer Typography */
        #mobileMenuOverlay .drawer-section-label {
            font-family: 'Inter', sans-serif;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #666;
            margin-bottom: 16px;
            font-weight: 600;
        }

        #mobileMenuOverlay .drawer-main-link {
            display: block;
            font-family: 'Big Shoulders Display', sans-serif;
            font-size: 32px;
            font-weight: 700;
            color: #fff;
            text-decoration: none;
            margin-bottom: 8px;
            transition: color 0.2s ease, transform 0.2s ease;
        }

        #mobileMenuOverlay .drawer-main-link:hover {
            color: #F96F6E;
            transform: translateX(4px);
        }

        #mobileMenuOverlay .drawer-main-link.active {
            color: #F96F6E;
        }

        #mobileMenuOverlay .drawer-sub-link {
            display: block;
            font-family: 'Inter', sans-serif;
            font-size: 16px;
            color: #888;
            text-decoration: none;
            margin-bottom: 16px;
            transition: color 0.2s ease, padding-left 0.2s ease;
        }

        #mobileMenuOverlay .drawer-sub-link:hover {
            color: #fff;
            padding-left: 4px;
        }

        #mobileMenuOverlay .drawer-sub-link.active {
            font-weight: 700;
            color: #F96F6E;
            border-left: 2px solid #F96F6E;
            padding-left: 12px;
        }

        #mobileMenuOverlay .drawer-divider {
            height: 1px;
            background: rgba(255, 255, 255, 0.1);
            margin: 40px 0;
        }

        #mobileMenuOverlay .drawer-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 0;
            transition: transform 0.2s ease, opacity 0.2s ease;
        }

        #mobileMenuOverlay .drawer-close:hover {
            transform: rotate(90deg);
            opacity: 0.7;
        }

        /* Portal special styling */
        #mobileMenuOverlay .drawer-main-link.portal-link {
            color: #2ED3C6;
        }

        #mobileMenuOverlay .drawer-main-link.portal-link:hover {
            color: #26b8ab;
        }
```

---

## Fix 3: Update Mobile Drawer HTML

**Location:** Find the mobile menu overlay div (search for `id="mobileMenuOverlay"`)

**Find this entire block:**
```html
<div id="mobileMenuOverlay" style="position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(6px); z-index: 10001; display: none;">
    <div style="position: absolute; top: 0; right: 0; width: 85%; max-width: 400px; height: 100%; background: #050505; border-left: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column;">
        <!-- Close Button -->
        <div style="padding: 24px; display: flex; justify-content: flex-end;">
            <button id="drawerCloseBtn" style="background: none; border: none; color: white; cursor: pointer;">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
        <!-- Links -->
        <div style="padding: 0 32px; overflow-y: auto;">
            <!-- Global -->
            <div style="margin-bottom: 40px;">
                <div style="font-family: 'Inter'; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #666; margin-bottom: 16px;">Ecosystem</div>
                <a href="/index.html" style="display: block; font-family: 'Big Shoulders Display'; font-size: 32px; font-weight: 700; color: #fff; text-decoration: none; margin-bottom: 8px;">Portfolio</a>
                <a href="/insights/index.html" style="display: block; font-family: 'Big Shoulders Display'; font-size: 32px; font-weight: 700; color: #fff; text-decoration: none; margin-bottom: 8px;">Insights</a>
                <a href="/TheHub/index.html" style="display: block; font-family: 'Big Shoulders Display'; font-size: 32px; font-weight: 700; color: #F96F6E; text-decoration: none; margin-bottom: 8px;">The Hub</a>
            </div>
            <div style="height: 1px; background: rgba(255,255,255,0.1); margin-bottom: 40px;"></div>
            <!-- Hub Context -->
            <div>
                <div style="font-family: 'Inter'; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #666; margin-bottom: 16px;">Hub Sections</div>
                <a href="/TheHub/index.html" style="display: block; font-family: 'Inter'; font-size: 16px; color: #888; text-decoration: none; margin-bottom: 16px;">Home</a>
                <a href="/TheHub/strategy-iq.html" style="display: block; font-family: 'Inter'; font-size: 16px; color: #888; text-decoration: none; margin-bottom: 16px;">StrategyIQ</a>
                <a href="/TheHub/advisory/index.html" style="display: block; font-family: 'Inter'; font-size: 16px; font-weight: 700; color: #F96F6E; text-decoration: none; margin-bottom: 16px; border-left: 2px solid #F96F6E; padding-left: 12px;">Advisory</a>
                <a href="/TheHub/studio.html" style="display: block; font-family: 'Inter'; font-size: 16px; color: #888; text-decoration: none; margin-bottom: 16px;">The Studio</a>
            </div>
        </div>
    </div>
</div>
```

**Replace with:**
```html
<!-- STANDARDIZED HUB DRAWER -->
<div id="mobileMenuOverlay">
    <div>
        <!-- Close Button -->
        <div style="padding: 24px; display: flex; justify-content: flex-end;">
            <button id="drawerCloseBtn" class="drawer-close" aria-label="Close menu">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
        
        <!-- Links -->
        <div style="padding: 0 32px; overflow-y: auto; flex: 1;">
            <!-- Global Ecosystem -->
            <div style="margin-bottom: 40px;">
                <div class="drawer-section-label">Ecosystem</div>
                <a href="/index.html" class="drawer-main-link">Portfolio</a>
                <a href="/insights/index.html" class="drawer-main-link">Insights</a>
                <a href="/TheHub/index.html" class="drawer-main-link active">The Hub</a>
                <a href="https://portal.luis-gilberto.com" class="drawer-main-link portal-link">Portal</a>
            </div>
            
            <div class="drawer-divider"></div>
            
            <!-- Hub Context -->
            <div>
                <div class="drawer-section-label">Hub Sections</div>
                <a href="/TheHub/index.html" class="drawer-sub-link">Home</a>
                <a href="/TheHub/strategy-iq.html" class="drawer-sub-link">StrategyIQ</a>
                <a href="/TheHub/advisory/index.html" class="drawer-sub-link active">Advisory</a>
                <a href="/TheHub/studio.html" class="drawer-sub-link">The Studio</a>
            </div>
        </div>
    </div>
</div>
```

---

## Fix 4: Enhance Mobile Menu JavaScript

**Location:** Find the mobile menu JavaScript block at the bottom of the file

**Find this:**
```javascript
    // Mobile Menu Logic
    const menuToggle = document.getElementById('mobileMenuToggle');
    const menuOverlay = document.getElementById('mobileMenuOverlay');
    const menuClose = document.getElementById('drawerCloseBtn');

    if (menuToggle && menuOverlay) {
        menuToggle.addEventListener('click', () => {
            menuOverlay.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });

        const closeMenu = () => {
            menuOverlay.style.display = 'none';
            document.body.style.overflow = '';
        };

        if (menuClose) menuClose.addEventListener('click', closeMenu);

        menuOverlay.addEventListener('click', (e) => {
            if (e.target === menuOverlay) closeMenu();
        });
    }
```

**Replace with:**
```javascript
    // Mobile Menu Logic with Smooth Transitions
    const menuToggle = document.getElementById('mobileMenuToggle');
    const menuOverlay = document.getElementById('mobileMenuOverlay');
    const menuClose = document.getElementById('drawerCloseBtn');

    if (menuToggle && menuOverlay) {
        menuToggle.addEventListener('click', () => {
            menuOverlay.style.display = 'block';
            // Trigger reflow for smooth transition
            menuOverlay.offsetHeight;
            menuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        const closeMenu = () => {
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
            // Wait for transition to complete before hiding
            setTimeout(() => {
                if (!menuOverlay.classList.contains('active')) {
                    menuOverlay.style.display = 'none';
                }
            }, 300);
        };

        if (menuClose) menuClose.addEventListener('click', closeMenu);

        menuOverlay.addEventListener('click', (e) => {
            if (e.target === menuOverlay) closeMenu();
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menuOverlay.classList.contains('active')) {
                closeMenu();
            }
        });
    }
```

---

## Fix 5: Add Mobile Responsive Adjustments to CSS

**Location:** In the mobile optimizations section, add these additional rules at the end of the `@media (max-width: 640px)` block

**Find:**
```css
        @media (max-width: 640px) {
            h1 { font-size: 1.875rem !important; }
            h2 { font-size: 1.75rem !important; }
            
            .stat-val { font-size: 1.75rem; }
            .stat-lbl { font-size: 0.7rem; }
        }
```

**Replace with:**
```css
        @media (max-width: 640px) {
            h1 { font-size: 1.875rem !important; }
            h2 { font-size: 1.75rem !important; }
            
            .stat-val { font-size: 1.75rem; }
            .stat-lbl { font-size: 0.7rem; }
            
            /* Adjust drawer for small phones */
            #mobileMenuOverlay > div {
                width: 90%;
            }
            
            #mobileMenuOverlay .drawer-main-link {
                font-size: 28px;
            }
        }
```

---

## Summary of Changes

✅ **Added Portal link** to global navigation  
✅ **Enhanced mobile drawer** with smooth animations  
✅ **Polished drawer styling** with hover effects  
✅ **Added keyboard support** (Escape to close)  
✅ **Improved responsive behavior** for phones and tablets  
✅ **Maintained brand consistency** with StrategyIQ page  

---

## Testing Checklist

After applying fixes, test:
- [ ] Desktop navigation shows Portal link
- [ ] Mobile burger menu opens smoothly
- [ ] Drawer slides in from right with fade
- [ ] Links have hover effects
- [ ] Active page shows coral indicator
- [ ] Portal appears in teal
- [ ] Escape key closes drawer
- [ ] Click outside closes drawer
- [ ] No body scroll when drawer is open
- [ ] Works on phone (< 640px)
- [ ] Works on tablet (640px - 1024px)
