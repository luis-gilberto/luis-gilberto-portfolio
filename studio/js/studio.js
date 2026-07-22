(function () {
  'use strict';

  document.documentElement.classList.add('js-enabled');

  var EXPLORER_DATA = {
    website: {
      conditions: [
        'High-polish design',
        'Zero-signal conversion',
        'Architecture misalignment'
      ],
      interpretation:
        'The website isn\'t the problem. The problem is you\'re trying to solve a positioning failure with a graphics upgrade. Your "Premium" brand is currently speaking to the wrong audience in the wrong tone.'
    },
    leads: {
      conditions: [
        'Burned-out ad spend',
        'Friction-heavy intake',
        'Lead-quality decay'
      ],
      interpretation:
        'You don\'t need more leads; you need a filter. You are currently inviting everyone to the table, which means you\'re spending 80% of your time on 20% leads. We need to build a diagnostic gate, not a louder megaphone.'
    },
    stalled: {
      conditions: [
        'Project-drift',
        'Decision-fatigue',
        'Reopened operational loops'
      ],
      interpretation:
        'This isn\'t a "motion" problem; it\'s a "decision" problem. You\'ve reopened the same three strategic choices for six months. Until we lock the floor, you can\'t build the next story.'
    },
    'in-head': {
      conditions: [
        'Founder-bottleneck',
        'Institutional amnesia',
        'Zero-map operations'
      ],
      interpretation:
        'You are the OS, but you\'re running on a version that hasn\'t been updated since you were a team of one. Your strategy exists in your intuition, which means it cannot be used by anyone else. We need to codify the "Read" so the "Build" can happen without you.'
    }
  };

  function initExplorer() {
    var root = document.querySelector('[data-explorer-root]');
    if (!root) return;

    var tabs = root.querySelectorAll('[data-explorer-tab]');
    var conditionsList = root.querySelector('[data-explorer-conditions]');
    var interpretation = root.querySelector('[data-explorer-interpretation]');
    if (!tabs.length || !conditionsList || !interpretation) return;

    function render(id) {
      var data = EXPLORER_DATA[id];
      if (!data) return;

      conditionsList.innerHTML = '';
      data.conditions.forEach(function (item) {
        var li = document.createElement('li');
        li.textContent = item;
        conditionsList.appendChild(li);
      });

      interpretation.textContent = data.interpretation;

      tabs.forEach(function (tab) {
        var isActive = tab.getAttribute('data-explorer-tab') === id;
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        tab.classList.toggle('is-active', isActive);
        tab.tabIndex = isActive ? 0 : -1;
        if (isActive) {
          var panel = root.querySelector('[role="tabpanel"]');
          if (panel) panel.setAttribute('aria-labelledby', tab.id);
        }
      });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        render(tab.getAttribute('data-explorer-tab'));
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

        var nextTab = list[next];
        render(nextTab.getAttribute('data-explorer-tab'));
        nextTab.focus();
      });
    });

    var initial = root.querySelector('[data-explorer-tab].is-active') || tabs[0];
    if (initial) render(initial.getAttribute('data-explorer-tab'));
  }

  function initStrategyIQRail() {
    var rail = document.querySelector('[data-strategyiq-rail]');
    if (!rail) return;

    var links = rail.querySelectorAll('[data-strategyiq-rail-link]');
    var sections = document.querySelectorAll('[data-strategyiq-section]');
    if (!links.length || !sections.length) return;

    var sectionMap = {};
    var scrollLock = false;
    var scrollLockTimer;

    sections.forEach(function (section) {
      sectionMap[section.getAttribute('data-strategyiq-section')] = section;
    });

    function clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    }

    function setActive(id) {
      links.forEach(function (link) {
        var li = link.closest('li');
        var isActive = link.getAttribute('data-strategyiq-rail-link') === id;
        if (li) li.classList.toggle('is-active', isActive);
        link.setAttribute('aria-current', isActive ? 'true' : 'false');
      });
    }

    function smoothScrollTo(target) {
      if (!target) return;

      var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reducedMotion) {
        target.scrollIntoView({ block: 'start' });
        return;
      }

      var offset = clamp(parseInt(getComputedStyle(document.documentElement).fontSize, 10) * 5, 80, 120);
      var startY = window.pageYOffset;
      var targetY = target.getBoundingClientRect().top + startY - offset;
      var distance = targetY - startY;
      var duration = 700;
      var startTime = null;

      scrollLock = true;
      clearTimeout(scrollLockTimer);

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        window.scrollTo(0, startY + distance * eased);
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          scrollLockTimer = window.setTimeout(function () {
            scrollLock = false;
          }, 120);
        }
      }

      window.requestAnimationFrame(step);
    }

    links.forEach(function (link) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        var id = link.getAttribute('data-strategyiq-rail-link');
        var section = sectionMap[id];
        if (!section) return;
        setActive(id);
        smoothScrollTo(section);
      });
    });

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        if (scrollLock) return;

        var visible = entries.filter(function (entry) {
          return entry.isIntersecting;
        });

        if (!visible.length) return;

        visible.sort(function (a, b) {
          return b.intersectionRatio - a.intersectionRatio;
        });

        setActive(visible[0].target.getAttribute('data-strategyiq-section'));
      }, {
        root: null,
        rootMargin: '-18% 0px -52% 0px',
        threshold: [0, 0.15, 0.35, 0.55, 0.75, 1]
      });

      sections.forEach(function (section) {
        observer.observe(section);
      });
    }
  }

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

  function initWorkIndex() {
    var root = document.querySelector('[data-work-index-root]');
    if (!root) return;

    var items = root.querySelectorAll('[data-work-index-item]');
    items.forEach(function (item) {
      var trigger = item.querySelector('[data-work-index-trigger]');
      var panelId = trigger.getAttribute('aria-controls');
      var panel = panelId ? document.getElementById(panelId) : null;
      if (!trigger || !panel) return;

      trigger.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');

        items.forEach(function (other) {
          if (other === item) return;
          other.classList.remove('is-open');
          var otherTrigger = other.querySelector('[data-work-index-trigger]');
          var otherPanelId = otherTrigger.getAttribute('aria-controls');
          var otherPanel = otherPanelId ? document.getElementById(otherPanelId) : null;
          otherTrigger.setAttribute('aria-expanded', 'false');
          if (otherPanel) otherPanel.hidden = true;
        });

        if (isOpen) {
          item.classList.remove('is-open');
          trigger.setAttribute('aria-expanded', 'false');
          panel.hidden = true;
        } else {
          item.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
          panel.hidden = false;
        }
      });
    });
  }

  function init() {
    initExplorer();
    initStrategyIQRail();
    initEngagement();
    initAccordion();
    initWorkIndex();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
