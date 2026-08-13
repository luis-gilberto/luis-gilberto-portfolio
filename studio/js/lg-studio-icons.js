/**
 * LG Studio proprietary icon renderer
 * Hydrates [data-lg-icon="slug"] with canonical SVG from /studio/assets/icons/lg-studio/
 * Preserves authored geometry — no optimization, no path rewriting.
 */
(function () {
  'use strict';

  var BASE = '/studio/assets/icons/lg-studio/';
  var cache = Object.create(null);
  var pending = Object.create(null);

  function fetchIcon(slug) {
    if (cache[slug]) return Promise.resolve(cache[slug]);
    if (pending[slug]) return pending[slug];
    pending[slug] = fetch(BASE + encodeURIComponent(slug) + '.svg', { credentials: 'same-origin' })
      .then(function (res) {
        if (!res.ok) throw new Error('LG icon missing: ' + slug);
        return res.text();
      })
      .then(function (text) {
        cache[slug] = text;
        delete pending[slug];
        return text;
      })
      .catch(function (err) {
        delete pending[slug];
        console.warn(err);
        return null;
      });
    return pending[slug];
  }

  function mount(el) {
    var slug = el.getAttribute('data-lg-icon');
    if (!slug || el.getAttribute('data-lg-icon-ready') === '1') return;
    fetchIcon(slug).then(function (svgText) {
      if (!svgText || !el.isConnected) return;
      el.innerHTML = svgText;
      var svg = el.querySelector('svg');
      if (svg) {
        svg.setAttribute('focusable', 'false');
        if (!svg.hasAttribute('aria-hidden')) {
          svg.setAttribute('aria-hidden', 'true');
        }
      }
      el.setAttribute('data-lg-icon-ready', '1');
    });
  }

  function hydrate(root) {
    var scope = root && root.querySelectorAll ? root : document;
    var nodes = scope.querySelectorAll
      ? scope.querySelectorAll('[data-lg-icon]:not([data-lg-icon-ready="1"])')
      : [];
    Array.prototype.forEach.call(nodes, mount);
  }

  window.LGStudioIcons = {
    hydrate: hydrate,
    base: BASE
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { hydrate(document); });
  } else {
    hydrate(document);
  }
})();
