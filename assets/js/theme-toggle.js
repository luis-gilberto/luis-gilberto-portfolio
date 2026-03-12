/**
 * Theme Toggle — Luis Gilberto Ecosystem
 * Wires to nav's #snav-theme-toggle button.
 * Storage key: 'lg_theme'
 */
(function () {
  const STORAGE_KEY = 'lg_theme'; // 🧬 Standardized Key
  const html = document.documentElement;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  function getStoredTheme() {
    const t = localStorage.getItem(STORAGE_KEY);
    return t === 'dark' || t === 'light' ? t : null;
  }

  function resolveInitialTheme() {
    return getStoredTheme() || (prefersDark.matches ? 'dark' : 'light');
  }

  function setTheme(theme, persist) {
    const next = theme === 'light' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    if (persist) localStorage.setItem(STORAGE_KEY, next);
    const btn = document.getElementById('snav-theme-toggle');
    if (btn) btn.setAttribute('aria-label', next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');

    // Dispatch event to sync other components
    window.dispatchEvent(new CustomEvent('theme-engine-sync', { detail: { theme: next } }));
  }

  function toggleTheme() {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(next, true);
  }

  function bindButton() {
    const btn = document.getElementById('snav-theme-toggle');
    if (!btn || btn._lgBound) return false;
    btn.addEventListener('click', toggleTheme);
    btn._lgBound = true;
    return true;
  }

  function init() {
    setTheme(resolveInitialTheme(), false);
    if (!bindButton()) {
      const iv = setInterval(function () {
        if (bindButton()) clearInterval(iv);
      }, 100);
      setTimeout(function () { clearInterval(iv); }, 4000);
    }
    document.addEventListener('keydown', function (e) {
      if ((e.key === 'd' || e.key === 'D') && !document.activeElement.matches('input,textarea'))
        toggleTheme();
    });
    prefersDark.addEventListener('change', function (e) {
      if (!getStoredTheme()) setTheme(e.matches ? 'dark' : 'light', false);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.ThemeToggle = { setTheme, toggleTheme };
})();