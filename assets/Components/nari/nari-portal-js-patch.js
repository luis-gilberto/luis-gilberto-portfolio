/**
 * NARI PORTAL — JS PATCH v2.0
 * Replace the existing <script> block's `showMain()` function
 * and scroll-lock section with this fixed version.
 *
 * KEY FIXES:
 * 1. body overflow restored correctly on mobile after gate unlock
 * 2. #main-content display uses correct value per viewport
 * 3. switchTab correctly handles overflow-x hidden on workspace
 * 4. Mobile tab bar sync works with switchTab
 */

// ─── PATCHED showMain() ───────────────────────────────────────
function showMain() {
  const content = document.getElementById('main-content');
  if (!content) {
    console.error('CRITICAL: #main-content not found');
    return;
  }

  // Remove aria-hidden
  content.removeAttribute('aria-hidden');
  content.classList.add('visible');

  const isDesktop = window.innerWidth >= 1025;

  if (isDesktop) {
    content.style.cssText = `
      display: grid !important;
      grid-template-columns: 280px 1fr;
      width: 100vw;
      height: 100vh;
      position: fixed;
      top: 0;
      left: 0;
      opacity: 1;
      visibility: visible;
    `;
  } else {
    content.style.cssText = `
      display: block !important;
      width: 100%;
      height: auto;
      position: static;
      opacity: 1;
      visibility: visible;
    `;
  }

  // CRITICAL: Restore scroll
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
  document.body.style.overflowX = 'hidden';
  document.documentElement.style.overflowX = 'hidden';

  requestAnimationFrame(() => {
    switchTab('overview');
  });
}

// ─── PATCHED switchTab() ──────────────────────────────────────
function switchTab(tabId) {
  // Update sidebar nav
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.getAttribute('data-tab') === tabId);
  });

  // Update tab content
  const targetId = `${tabId}-tab`;
  document.querySelectorAll('.tab-content').forEach(tab => {
    const isActive = tab.id === targetId;
    tab.classList.toggle('active', isActive);
    tab.style.display = isActive ? 'block' : 'none';
    tab.style.opacity = isActive ? '1' : '0';
    tab.style.visibility = isActive ? 'visible' : 'hidden';
    if (isActive) {
      tab.style.width = '100%';
      tab.style.overflowX = 'hidden';
    }
  });

  // Scroll workspace to top
  const workspace = document.querySelector('.main-workspace');
  if (workspace) workspace.scrollTop = 0;

  // Sync mobile tab bar
  document.querySelectorAll('.mobile-tab-bar a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('data-tab') === tabId);
  });
}

// ─── PATCHED GATE UNLOCK ─────────────────────────────────────
// Replace the tryUnlock's revealContent call timing.
// After gate hides, ensure scroll is fully restored.
function revealContent(animated) {
  const gate = document.getElementById('gate');
  if (!gate) return;

  if (animated) {
    gate.classList.add('unlocking');
    setTimeout(() => {
      gate.setAttribute('hidden', '');
      gate.style.display = 'none';
      showMain();
    }, 520);
  } else {
    gate.setAttribute('hidden', '');
    gate.style.display = 'none';
    showMain();
  }
}

// ─── HANDLE RESIZE ───────────────────────────────────────────
// Re-apply layout on resize (desktop <-> mobile transitions)
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const content = document.getElementById('main-content');
    if (!content || content.hasAttribute('aria-hidden')) return;
    const isDesktop = window.innerWidth >= 1025;
    if (isDesktop) {
      content.style.display = 'grid';
      content.style.position = 'fixed';
    } else {
      content.style.display = 'block';
      content.style.position = 'static';
    }
  }, 150);
});
