/**
 * Theme Toggle Component
 * - Reusable across pages
 * - Persists user preference via localStorage
 * - Detects system preference and follows it unless user overrides
 * - Accessible (ARIA, keyboard shortcut)
 */
(function () {
  const STORAGE_KEY = 'theme';
  const html = document.documentElement;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  // Create the toggle button if one is not present
  function ensureToggleButton() {
    let btn = document.getElementById('themeToggle');
    if (btn) return btn;

    btn = document.createElement('button');
    btn.id = 'themeToggle';
    btn.className = 'theme-toggle';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Toggle dark mode');
    btn.setAttribute('aria-live', 'polite');
    btn.setAttribute('aria-pressed', 'false');
    btn.innerHTML = `
      <svg class="sun-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false">
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
      <svg class="moon-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    `;

    document.body.appendChild(btn);
    return btn;
  }

  function getStoredTheme() {
    const t = localStorage.getItem(STORAGE_KEY);
    return t === 'dark' || t === 'light' ? t : null;
  }

  function resolveInitialTheme() {
    const stored = getStoredTheme();
    if (stored) return stored;
    return prefersDark.matches ? 'dark' : 'light';
  }

  function setTheme(theme, { persist = false } = {}) {
    const next = theme === 'dark' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    if (persist) localStorage.setItem(STORAGE_KEY, next);

    // Accessible state and label
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
      const isDark = next === 'dark';
      toggle.setAttribute('aria-pressed', String(isDark));
      toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }

    // Smooth transition
    document.body.style.transition = 'background-color 250ms ease, color 250ms ease';

    // Update theme-color meta for mobile browsers
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', next === 'dark' ? '#0F0F0F' : '#ffffff');
    }
  }

  function toggleTheme() {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next, { persist: true });
  }

  function init() {
    // Ensure button exists and bind events
    const button = ensureToggleButton();
    const initial = resolveInitialTheme();
    setTheme(initial, { persist: false });

    // Bind click
    if (button && !button._bound) {
      button.addEventListener('click', toggleTheme);
      button._bound = true;
    }

    // Keyboard shortcut: D
    document.addEventListener('keydown', (e) => {
      if ((e.key === 'd' || e.key === 'D') && !document.activeElement.matches('input, textarea')) {
        toggleTheme();
      }
    });

    // Follow system preference when user hasn't set a preference
    prefersDark.addEventListener('change', (e) => {
      if (!getStoredTheme()) {
        setTheme(e.matches ? 'dark' : 'light', { persist: false });
      }
    });
  }

  // Initialize on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for testing
  window.ThemeToggle = { init, setTheme, toggleTheme };
})();

