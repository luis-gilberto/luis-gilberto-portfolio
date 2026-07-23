(function () {
  'use strict';

  var STORAGE_KEY = 'studio-lang';
  var DEFAULT_LANG = 'en';

  function setLang(lang) {
    var html = document.documentElement;
    html.lang = lang;

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

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (err) {
      /* ignore storage failures */
    }

    document.dispatchEvent(new CustomEvent('studio:langchange', { detail: { lang: lang } }));
  }

  function initLangToggle() {
    var buttons = document.querySelectorAll('.ed-nav-lang-toggle button');
    if (!buttons.length) return;

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        setLang(button.dataset.lang);
      });
    });

    var saved = DEFAULT_LANG;
    try {
      saved = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
    } catch (err) {
      saved = DEFAULT_LANG;
    }

    if (saved !== 'en' && saved !== 'es') saved = DEFAULT_LANG;
    setLang(saved);
  }

  window.StudioI18n = {
    setLang: setLang,
    getLang: function () {
      return document.documentElement.lang || DEFAULT_LANG;
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLangToggle);
  } else {
    initLangToggle();
  }
})();
