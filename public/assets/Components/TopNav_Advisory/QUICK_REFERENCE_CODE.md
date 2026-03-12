# QUICK REFERENCE: Code to Copy/Paste
## Navigation Fix for Advisory Page

---

## 📄 NEW NAVIGATION CSS
**Replace lines 2003-2142 with this:**

```css
<style>
/* ==========================================
   HUB HEADER NAVIGATION (GOLDEN STANDARD)
   ========================================== */
:root {
  --text-primary:   rgba(255, 255, 255, 0.95);
  --text-secondary: rgba(255, 255, 255, 0.6);
  --teal: #2ED3C6;
}

.hub-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: rgba(8, 8, 10, 0.6);
    -webkit-backdrop-filter: blur(12px);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.header-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0.5rem 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
}

.header-logo img { 
    height: 36px; 
    width: auto; 
}

.header-nav { 
    display: flex; 
    align-items: center; 
    gap: 0.5rem; 
}

.nav-item {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-radius: 12px;
    color: var(--text-secondary);
    text-decoration: none;
    border: 1px solid transparent;
    transition: all 0.2s ease;
}

.nav-item:hover { 
    color: var(--teal); 
    background: rgba(255,255,255,0.06); 
    border-color: rgba(255,255,255,0.12); 
}

.nav-item.active { 
    color: var(--text-primary); 
    border-color: rgba(46,211,198,0.5); 
    background: rgba(46,211,198,0.10); 
}

.nav-icon { 
    width: 20px; 
    height: 20px; 
    display: inline-block; 
}

.nav-label { 
    font-weight: 600; 
    font-size: 0.95rem; 
}

.mobile-toggle {
    display: none;
    width: 36px;
    height: 36px;
    border: 1px solid rgba(255,255,255,0.14);
    border-radius: 8px;
    background: rgba(255,255,255,0.04);
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 6px;
    cursor: pointer;
}

.mobile-toggle span { 
    display: block; 
    width: 20px; 
    height: 3px; 
    background: var(--text-secondary); 
    border-radius: 2px; 
}

.hero { 
    padding-top: 5rem; 
}

@media (max-width: 1024px) {
    .header-nav { display: none; }
    .mobile-toggle { display: inline-flex; }
    .header-nav.open {
        display: flex;
        flex-direction: column;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(8,8,10,0.92);
        backdrop-filter: blur(10px) saturate(120%);
        z-index: 9999;
        padding: 1rem;
        gap: 0.75rem;
        align-items: center;
        justify-content: flex-start;
        overflow-y: auto;
    }
    .header-nav.open .nav-icon {
        width: 48px;
        height: 48px;
        image-rendering: -webkit-optimize-contrast;
        image-rendering: crisp-edges;
        -ms-interpolation-mode: nearest-neighbor;
    }
    .header-nav.open .nav-item {
        font-size: 1.05rem;
        border-color: rgba(255,255,255,0.12);
        background: rgba(255,255,255,0.04);
    }
}
</style>
```

---

## 🔧 NEW NAVIGATION JAVASCRIPT
**Replace lines 2873-2914 with this:**

```javascript
<script>
    // Mobile nav toggle (Golden Standard)
    (function(){
        const mobileToggle = document.getElementById('mobileToggle');
        const headerNav = document.getElementById('headerNav');
        let placeholder = null;
        if (headerNav) {
            placeholder = document.createElement('div');
            placeholder.style.display = 'none';
            headerNav.parentNode.insertBefore(placeholder, headerNav);
        }
        if (mobileToggle && headerNav) {
            mobileToggle.addEventListener('click', function(){
                const isOpen = !headerNav.classList.contains('open');
                if (isOpen) {
                    headerNav.classList.add('open');
                    document.body.appendChild(headerNav);
                    document.body.style.overflow = 'hidden';
                    document.body.style.touchAction = 'none';
                } else {
                    headerNav.classList.remove('open');
                    if (placeholder && placeholder.parentNode) {
                        placeholder.parentNode.insertBefore(headerNav, placeholder);
                    }
                    document.body.style.overflow = '';
                    document.body.style.touchAction = '';
                }
            });
        }
    })();
</script>
```

---

## 🗑️ DON'T FORGET!
**Delete lines 93-182** (the first duplicate navigation CSS block)

---

## ✅ 3-STEP CHECKLIST
1. Delete lines 93-182
2. Replace CSS (lines 2003-2142)
3. Replace JavaScript (lines 2873-2914)

Done! 🎉
