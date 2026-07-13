(function () {
  'use strict';

  document.documentElement.classList.add('js-enabled');

  var BOOKING =
    'https://outlook.office.com/bookwithme/user/4d31ec5d7644431e97d8689b003682b3@strategyIQ.com/meetingtype/dN7G55ENNUuiyJOdMAiHgA2?bookingcode=9c322bac-99f0-428e-8876-bc3b4bbf4ce2&anonymous&ismsaljsauthenabled&ep=mlink';

  function initEngagement() {
    var root = document.querySelector('[data-engagement-root]');
    if (!root) return;

    var tabs = root.querySelectorAll('[data-engagement-tab]');
    var panels = root.querySelectorAll('[data-engagement-panel]');
    if (!tabs.length || !panels.length) return;

    function activate(id, focusTab) {
      tabs.forEach(function (tab) {
        var isActive = tab.getAttribute('data-engagement-tab') === id;
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        tab.classList.toggle('is-active', isActive);
        if (isActive && focusTab) tab.focus();
      });

      panels.forEach(function (panel) {
        var isActive = panel.getAttribute('data-engagement-panel') === id;
        panel.classList.toggle('is-active', isActive);
        panel.hidden = !isActive;
      });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        activate(tab.getAttribute('data-engagement-tab'), false);
      });

      tab.addEventListener('keydown', function (event) {
        var keys = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
        if (keys.indexOf(event.key) === -1) return;

        event.preventDefault();
        var list = Array.prototype.slice.call(tabs);
        var index = list.indexOf(tab);
        var next = index;

        if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % list.length;
        if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index - 1 + list.length) % list.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = list.length - 1;

        activate(list[next].getAttribute('data-engagement-tab'), true);
      });
    });

    var initial = root.querySelector('[data-engagement-tab].is-active');
    if (initial) activate(initial.getAttribute('data-engagement-tab'), false);
  }

  function initAccordion() {
    var items = document.querySelectorAll('[data-accordion-trigger]');
    items.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var expanded = trigger.getAttribute('aria-expanded') === 'true';
        var panelId = trigger.getAttribute('aria-controls');
        var panel = panelId ? document.getElementById(panelId) : null;
        trigger.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        if (panel) panel.hidden = expanded;
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initEngagement();
      initAccordion();
    });
  } else {
    initEngagement();
    initAccordion();
  }
})();
