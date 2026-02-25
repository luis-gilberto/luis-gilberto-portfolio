Implementation Overview

- Theme toggle preserves accessibility with `role="switch"`, `aria-pressed`, and dynamic `aria-label` updates.
- Navigation bar stays dark in both themes via `[data-theme="light"] #primaryNav { background: rgba(10,10,10,0.96) !important; }` to prevent logo washout.
- Logo assets swap atomically with preloading and cross-fade:
  - Light theme → use dark-mode assets: `assets/Brand/Core/logo-lockup-dark_3.png` (wordmark) and `assets/Brand/Core/icon-coral-white.png` (logomark srcset)
  - Dark theme → use existing light assets
- Hero headline/subhead colors are fixed to white ensuring readability regardless of theme.
- Error handling: asset preload promises catch failures and retain previous assets.
- Cross-browser: uses standard DOM APIs, CSS transitions, and no experimental features.

Testing

- Added `_deploy_v2/tests/timeline-theme.html` to automate checks for:
  - Logo visibility in both themes
  - Nav background not white in light mode
  - Hero text readability
  - Rapid toggling stability
  - No script errors during swapping
