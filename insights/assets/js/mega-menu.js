/**
 * MEGA MENU & NAVIGATION SYSTEM
 * Source: insights/unlocking-the-blank-page/index.html
 */

(() => {
  // ── Header scroll ─────────────────────────────────────────────
  const header  = document.getElementById('site-header');
  const onScroll = () => {
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 10);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Theme toggle ──────────────────────────────────────────────
  const themeToggle = document.getElementById('theme-toggle');
  const iconSun     = document.getElementById('icon-sun');
  const iconMoon    = document.getElementById('icon-moon');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('insights-theme', theme);
    
    if (iconSun) iconSun.style.display  = theme === 'dark' ? 'none'  : 'block';
    if (iconMoon) iconMoon.style.display = theme === 'dark' ? 'block' : 'none';
    
    const ld = document.getElementById('logo-desktop');
    if (ld) {
      ld.src = theme === 'dark' 
        ? '/insights/assets/images/Insights_logo_white.png' 
        : '/insights/assets/images/Insights_logo_black.png';
    }
    
    const lm = document.getElementById('logo-mark');
    if (lm) {
      lm.src = theme === 'dark' 
        ? '/insights/assets/images/Symbol_mobile.png' 
        : '/insights/assets/images/LG-logomark-BlackCoral.png';
    }
  }

  // Initialize theme from local storage or default to light
  const savedTheme = localStorage.getItem('insights-theme') || 'light';
  applyTheme(savedTheme);

  themeToggle?.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });

  // ── Mega menu — four channels ─────────────────────────────────
  const viewportWrap  = document.getElementById('nav-viewport');
  const viewportInner = document.getElementById('nav-viewport-inner');
  const triggers      = document.querySelectorAll('[data-trigger]');
  const desktopNav    = document.getElementById('desktop-nav');
  let   activeId = null, closeTimer = null;

  function openDropdown(trigger) {
    clearTimeout(closeTimer);
    const panelId = trigger.id.replace('trigger-', 'content-');
    const panel   = document.getElementById(panelId);
    if (!panel || !viewportInner || !viewportWrap || !desktopNav) return;

    // Swap panel content
    document.querySelectorAll('.nav-content').forEach(p => p.classList.remove('active'));
    panel.classList.add('active');

    // Re-centre viewport under the trigger that opened it
    const triggerRect = trigger.getBoundingClientRect();
    const navRect     = desktopNav.getBoundingClientRect();
    const triggerMid  = triggerRect.left + triggerRect.width / 2 - navRect.left;
    viewportWrap.style.left = triggerMid + 'px';

    viewportInner.classList.add('open');
    triggers.forEach(t => t.setAttribute('aria-expanded', 'false'));
    trigger.setAttribute('aria-expanded', 'true');
    activeId = trigger.id;
  }

  function closeDropdown() {
    closeTimer = setTimeout(() => {
      if (viewportInner) viewportInner.classList.remove('open');
      document.querySelectorAll('.nav-content').forEach(p => p.classList.remove('active'));
      triggers.forEach(t => t.setAttribute('aria-expanded', 'false'));
      activeId = null;
    }, 120);
  }

  triggers.forEach(t => {
    t.addEventListener('mouseenter', () => openDropdown(t));
    t.addEventListener('click', e => {
      e.stopPropagation();
      activeId === t.id ? closeDropdown() : openDropdown(t);
    });
  });

  if (desktopNav) {
    desktopNav.addEventListener('mouseleave', closeDropdown);
    desktopNav.addEventListener('keydown', e => {
      if (e.key === 'Escape') { 
        closeDropdown(); 
        if (activeId) document.getElementById(activeId)?.focus(); 
      }
    });
  }

  if (viewportInner) {
    viewportInner.addEventListener('mouseenter', () => clearTimeout(closeTimer));
    viewportInner.addEventListener('mouseleave', closeDropdown);
  }

  document.addEventListener('click', e => { 
    if (desktopNav && !desktopNav.contains(e.target)) closeDropdown(); 
  });

  // ── Mobile menu ───────────────────────────────────────────────
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu   = document.getElementById('mobile-menu');
  const menuIcon     = document.getElementById('menu-icon');
  let menuOpen = false;

  mobileToggle?.addEventListener('click', () => {
    if (!mobileMenu || !menuIcon) return;
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    mobileToggle.setAttribute('aria-expanded', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    menuIcon.innerHTML = menuOpen
      ? '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'
      : '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>';
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024 && menuOpen && mobileMenu) { 
      menuOpen = false; 
      mobileMenu.classList.remove('open'); 
      document.body.style.overflow = ''; 
    }
  });

})();
