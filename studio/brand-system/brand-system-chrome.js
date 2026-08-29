/* LG Studio Brand System · return chrome
   Prefer static markup in each surface (no FOUC).
   This script is a no-op fallback if a page is missing the return link. */
(function () {
  'use strict';

  function makeLink() {
    var a = document.createElement('a');
    a.className = 'bs-studio-return';
    a.href = '/studio/';
    a.setAttribute('data-i18n-en', '\u2190 Studio');
    a.setAttribute('data-i18n-es', '\u2190 Studio');
    a.innerHTML = '&larr;&nbsp;Studio';
    return a;
  }

  function alreadyMounted(root) {
    return !!(root && root.querySelector('.bs-studio-return'));
  }

  function mount() {
    if (document.querySelector('.bs-studio-return')) return;

    function place(parent, before) {
      parent.insertBefore(makeLink(), before || parent.firstChild);
      parent.classList.add('has-bs-return');
    }

    var explicit = document.querySelector('[data-bs-return-mount]');
    if (explicit && !alreadyMounted(explicit)) {
      place(explicit);
      return;
    }

    var top = document.querySelector('.top');
    if (top && !alreadyMounted(top)) {
      place(top);
      return;
    }

    var mastheadBrand = document.querySelector('.masthead-brand');
    if (mastheadBrand && !alreadyMounted(mastheadBrand)) {
      place(mastheadBrand);
      return;
    }

    var railBrand = document.querySelector('.rail-brand');
    if (railBrand && !alreadyMounted(railBrand)) {
      place(railBrand);
      return;
    }

    var topRow = document.querySelector('.masthead .top-row');
    if (topRow && !alreadyMounted(topRow)) {
      var first = topRow.firstElementChild;
      if (first && !first.classList.contains('lang')) {
        var stack = document.createElement('div');
        stack.className = 'bs-return-stack has-bs-return';
        topRow.insertBefore(stack, first);
        stack.appendChild(makeLink());
        stack.appendChild(first);
      } else {
        place(topRow);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
