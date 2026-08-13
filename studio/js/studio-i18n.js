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
      if (val.indexOf('<') !== -1) {
        el.innerHTML = val;
      } else {
        el.textContent = val;
      }
    });
  }

  function setLang(lang) {
    if (lang !== 'en' && lang !== 'es') lang = DEFAULT_LANG;
    document.documentElement.lang = lang;
    applyLangUI(lang);

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (err) {
      /* ignore storage failures */
    }

    document.dispatchEvent(new CustomEvent('studio:langchange', { detail: { lang: lang } }));
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
      setLang(button.dataset.lang);
    });
  }

  function initLangToggle() {
    bindDelegation();
    setLang(getSavedLang());
  }

  function refresh() {
    applyLangUI(document.documentElement.lang || getSavedLang());
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
