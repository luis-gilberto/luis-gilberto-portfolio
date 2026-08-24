(function () {
  'use strict';

  var STORAGE_KEY = 'studio-lang';
  var DEFAULT_LANG = 'en';
  var boundDelegation = false;

  function applyLangUI(lang) {
    document.querySelectorAll('.ed-nav-lang-toggle button').forEach(function (button) {
      button.classList.toggle('is-active', button.dataset.lang === lang);
      button.setAttribute('aria-pressed', button.dataset.lang === lang ? 'true' : 'false');
    });

    document.querySelectorAll('[data-i18n-en]').forEach(function (el) {
      var val = el.getAttribute('data-i18n-' + lang);
      if (val === null) return;

      var attr = el.getAttribute('data-i18n-attr');
      if (attr) {
        el.setAttribute(attr, val);
        return;
      }

      if (el.tagName === 'IMG') {
        el.setAttribute('alt', val);
        return;
      }

      if (el.tagName === 'META') {
        el.setAttribute('content', val);
        return;
      }

      if (val.indexOf('<') !== -1) {
        el.innerHTML = val;
      } else {
        el.textContent = val;
      }
    });
  }

  function getCscLocaleRoot() {
    return document.querySelector('[data-csc-locale-routes]');
  }

  function getCscLocaleUrls(root) {
    return {
      en: root.getAttribute('data-csc-locale-en') || '/studio/case-studies/criar-sin-culpas/',
      es: root.getAttribute('data-csc-locale-es') || '/studio/case-studies/criar-sin-culpas/es/'
    };
  }

  function getCscRouteLang() {
    var path = (location.pathname || '').replace(/\/index\.html$/i, '/');
    if (/\/criar-sin-culpas\/es\/?$/.test(path) || path.indexOf('/criar-sin-culpas/es/') !== -1) {
      return 'es';
    }
    if (path.indexOf('/criar-sin-culpas') !== -1) {
      return 'en';
    }
    return null;
  }

  function persistLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (err) {
      /* ignore storage failures */
    }
  }

  function setLang(lang) {
    if (lang !== 'en' && lang !== 'es') lang = DEFAULT_LANG;
    document.documentElement.lang = lang;
    applyLangUI(lang);
    persistLang(lang);
    document.dispatchEvent(new CustomEvent('studio:langchange', { detail: { lang: lang } }));
  }

  function navigateCscLocale(lang, urls) {
    var target = urls[lang];
    if (!target) return;
    var hash = location.hash || '';
    var next = target + hash;
    var current = location.pathname.replace(/\/index\.html$/i, '/');
    var normalizedTarget = target.replace(/\/index\.html$/i, '/');
    if (current === normalizedTarget || current + '/' === normalizedTarget) {
      setLang(lang);
      return;
    }
    persistLang(lang);
    location.assign(next);
  }

  function getSavedLang() {
    var saved = DEFAULT_LANG;
    try {
      saved = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
    } catch (err) {
      saved = DEFAULT_LANG;
    }
    if (saved !== 'en' && saved !== 'es') saved = DEFAULT_LANG;
    return saved;
  }

  function bindDelegation() {
    if (boundDelegation) return;
    boundDelegation = true;
    document.addEventListener('click', function (event) {
      var button = event.target.closest && event.target.closest('.ed-nav-lang-toggle button');
      if (!button || !button.dataset.lang) return;
      var root = getCscLocaleRoot();
      if (root) {
        event.preventDefault();
        navigateCscLocale(button.dataset.lang, getCscLocaleUrls(root));
        return;
      }
      setLang(button.dataset.lang);
    });
  }

  function initLangToggle() {
    bindDelegation();
    var root = getCscLocaleRoot();
    var routeLang = root ? getCscRouteLang() : null;
    if (routeLang) {
      // Route is authoritative on CSC locale pages — never let localStorage override.
      // Body copy is already correct in initial HTML; sync injected shell chrome too.
      document.documentElement.lang = routeLang;
      applyLangUI(routeLang);
      document.querySelectorAll('.ed-nav-lang-toggle button').forEach(function (button) {
        button.classList.toggle('is-active', button.dataset.lang === routeLang);
        button.setAttribute('aria-pressed', button.dataset.lang === routeLang ? 'true' : 'false');
      });
      persistLang(routeLang);
      document.dispatchEvent(new CustomEvent('studio:langchange', { detail: { lang: routeLang } }));
      return;
    }
    setLang(getSavedLang());
  }

  function refresh() {
    var root = getCscLocaleRoot();
    var routeLang = root ? getCscRouteLang() : null;
    applyLangUI(routeLang || document.documentElement.lang || getSavedLang());
  }

  window.StudioI18n = {
    setLang: setLang,
    getLang: function () {
      return document.documentElement.lang || DEFAULT_LANG;
    },
    refresh: refresh
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLangToggle);
  } else {
    initLangToggle();
  }
})();
