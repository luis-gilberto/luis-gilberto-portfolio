# Nari Portal — Responsive Patch v2.0
## Integration Guide for Trae

---

### OVERVIEW

Two files to apply:
1. `nari-portal-responsive-patch.css` — paste before `</head>`
2. `nari-portal-js-patch.js` — patch 3 functions inside the `<script>` block

---

## STEP 1 — CSS INJECTION

In `hub.luis-gilberto.com/clients/nari/index.html`, find:

```
  </style>
</head>
```

Insert the full content of `nari-portal-responsive-patch.css` as a `<style>` block immediately before `</head>`:

```html
  <!-- RESPONSIVE PATCH v2.0 -->
  <style>
    [paste entire contents of nari-portal-responsive-patch.css here]
  </style>
</head>
```

---

## STEP 2 — JS FUNCTION PATCHES

Inside the `<script>` block at the bottom of `<body>`, make these 3 targeted replacements:

---

### 2A. Replace `showMain()` function

**FIND** (the entire existing function):
```javascript
function showMain() {
  const content = document.getElementById('main-content');
  if (!content) {
    console.error('CRITICAL: #main-content not found');
    return;
  }
  
  console.log('Revealing main content cockpit...');
  
  // Remove aria-hidden and add visible class
  content.removeAttribute('aria-hidden');
  content.classList.add('visible');
  
  // Force the cockpit display properties
  content.style.display = window.innerWidth <= 1024 ? 'block' : 'grid'; 
  content.style.gridTemplateColumns = window.innerWidth <= 1024 ? '' : '280px 1fr'; 
  content.style.width = '100vw'; 
  content.style.height = window.innerWidth <= 1024 ? 'auto' : '100vh'; 
  content.style.opacity = '1';
  content.style.visibility = 'visible';
  
  document.documentElement.style.overflow = ''; // restore scroll
  document.body.style.overflow = '';
  
  // Initialize the tab system
  requestAnimationFrame(() => {
    switchTab('overview');
  });
}
```

**REPLACE WITH:**
```javascript
function showMain() {
  const content = document.getElementById('main-content');
  if (!content) {
    console.error('CRITICAL: #main-content not found');
    return;
  }
  content.removeAttribute('aria-hidden');
  content.classList.add('visible');
  const isDesktop = window.innerWidth >= 1025;
  if (isDesktop) {
    content.style.display = 'grid';
    content.style.gridTemplateColumns = '280px 1fr';
    content.style.width = '100vw';
    content.style.height = '100vh';
    content.style.position = 'fixed';
    content.style.top = '0';
    content.style.left = '0';
  } else {
    content.style.display = 'block';
    content.style.width = '100%';
    content.style.height = 'auto';
    content.style.position = 'static';
  }
  content.style.opacity = '1';
  content.style.visibility = 'visible';
  // Restore scroll — critical on mobile
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
  document.body.style.overflowX = 'hidden';
  requestAnimationFrame(() => {
    switchTab('overview');
  });
}
```

---

### 2B. Replace `switchTab()` function

**FIND** (the entire existing function):
```javascript
function switchTab(tabId) {
  console.log('Switching to tab:', tabId);
  
  // Update Nav
  document.querySelectorAll('.nav-item').forEach(item => {
    const itemTabId = item.getAttribute('data-tab');
    item.classList.toggle('active', itemTabId === tabId);
  });

  // Update Content
  const targetTabId = `${tabId}-tab`;
  document.querySelectorAll('.tab-content').forEach(tab => {
    const isActive = tab.id === targetTabId;
    tab.classList.toggle('active', isActive);
    
    // Explicitly handle display and visibility
    if (isActive) {
      tab.style.display = 'block';
      tab.style.width = '100%';
      tab.style.opacity = '1';
      tab.style.visibility = 'visible';
    } else {
      tab.style.display = 'none';
      tab.style.opacity = '0';
      tab.style.visibility = 'hidden';
    }
  });

  // Reset Scroll
  const workspace = document.querySelector('.main-workspace');
  if (workspace) workspace.scrollTop = 0;

  // Sync Mobile Tab Bar
  document.querySelectorAll('.mobile-tab-bar a').forEach(a => { 
      const mobileTabId = a.getAttribute('data-tab'); 
      a.classList.toggle('active', mobileTabId === tabId); 
  });
}
```

**REPLACE WITH:**
```javascript
function switchTab(tabId) {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.getAttribute('data-tab') === tabId);
  });
  const targetTabId = `${tabId}-tab`;
  document.querySelectorAll('.tab-content').forEach(tab => {
    const isActive = tab.id === targetTabId;
    tab.classList.toggle('active', isActive);
    tab.style.display = isActive ? 'block' : 'none';
    tab.style.opacity = isActive ? '1' : '0';
    tab.style.visibility = isActive ? 'visible' : 'hidden';
    if (isActive) {
      tab.style.width = '100%';
      tab.style.overflowX = 'hidden';
    }
  });
  const workspace = document.querySelector('.main-workspace');
  if (workspace) workspace.scrollTop = 0;
  document.querySelectorAll('.mobile-tab-bar a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('data-tab') === tabId);
  });
}
```

---

### 2C. Add resize handler

**FIND** (somewhere after the switchTab function, before the closing `})();`):
```javascript
      /* ─── MOBILE DRAWER LOGIC (v18.2) ─── */ 
```

**INSERT BEFORE IT:**
```javascript
      /* ─── RESIZE HANDLER ─── */
      let _resizeTimer;
      window.addEventListener('resize', function() {
        clearTimeout(_resizeTimer);
        _resizeTimer = setTimeout(function() {
          const content = document.getElementById('main-content');
          if (!content || content.hasAttribute('aria-hidden')) return;
          if (window.innerWidth >= 1025) {
            content.style.display = 'grid';
            content.style.position = 'fixed';
            content.style.height = '100vh';
          } else {
            content.style.display = 'block';
            content.style.position = 'static';
            content.style.height = 'auto';
          }
        }, 150);
      });

```

---

## STEP 3 — REMOVE scroll lock on gate init

**FIND** at the very end of the IIFE (before the closing `})();`):
```javascript
      /* 
         SECURITY NOTE: 
```

**FIND a few lines ABOVE that:**
```javascript
      /* Prevent page scroll while gate is visible */
      if (!localStorage.getItem('lg_intake_unlocked')) {
        document.documentElement.style.overflow = 'hidden';
      }
```

**REPLACE WITH:**
```javascript
      /* Prevent page scroll while gate is visible (mobile-safe) */
      if (localStorage.getItem('lg-portal-session') !== 'active') {
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
      }
```

*(Note: uses the correct session key `lg-portal-session` not the old `lg_intake_unlocked`)*

---

## WHAT EACH FIX ADDRESSES

| Fix | Issue | Impact |
|-----|-------|--------|
| CSS: Focus card flex | Readiness panel `min-width:400px` caused overlap on tablets | High |
| CSS: Production zone | Grid collapsed too late (980px vs 900px threshold) | Medium |
| CSS: Blueprint flow | 7-col grid crushed on mid screens without arrows hiding | High |
| CSS: Mobile workspace padding | Content clipped under 64px tab bar | High |
| CSS: Avatar overflow | `overflow:hidden` on sidebar clipped zoom | Low |
| CSS: body min-width:0 | Flex/grid children blowing out container widths | High |
| CSS: Ticker overflow | Ticker causing horizontal scroll on mobile | Medium |
| CSS: SR chain scrollbar | Chain rail was clipping on small screens | Low |
| JS: showMain scroll restore | `body overflow:hidden` not cleared on mobile | Critical |
| JS: Resize handler | No re-layout on viewport change | Medium |
| JS: Session key mismatch | Gate used `lg_intake_unlocked` but set `lg-portal-session` | High |

---

*Patch authored: April 2026 · Luis Gilberto Design System · StrategyIQ Portal*
