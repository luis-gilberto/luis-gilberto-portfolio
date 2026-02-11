(function() {
  function init() {
    var overlay = document.getElementById('drawerOverlay');
    var drawer = document.getElementById('insightsDrawer');
    var closeBtn = document.getElementById('drawerClose');
    var toggle = document.getElementById('mobileToggle') || document.querySelector('.lg-nav-toggle');
    var latest = document.getElementById('nav-latest-content');
    var series = document.getElementById('nav-series-content');
    var topics = document.getElementById('nav-topics-content');
    var jsonPath = '/insights/data/articles-metadata.json';

    function isTablet() { return window.innerWidth <= 1200; }

    function openDrawer() {
      if (!isTablet() || !overlay || !drawer) return;
      overlay.style.display = 'block';
      overlay.classList.add('active');
      drawer.classList.add('active');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (toggle) toggle.setAttribute('aria-expanded', 'true');
      trapFocus(drawer);
    }

    function closeDrawer() {
      if (!overlay || !drawer) return;
      drawer.classList.remove('active');
      overlay.classList.remove('active');
      setTimeout(function() {
        overlay.style.display = 'none';
        drawer.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      }, 300);
    }

    function trapFocus(el) {
      var focusables = el.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      function onKey(e) {
        if (e.key !== 'Tab') return;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
      el.addEventListener('keydown', onKey);
      first.focus();
    }

    if (overlay) overlay.addEventListener('click', function(e) { if (e.target === overlay) closeDrawer(); });
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeDrawer(); });

    if (toggle) {
      toggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var visible = window.getComputedStyle(toggle).display !== 'none';
        if (!visible) return;
        var isOpen = drawer && drawer.classList.contains('active');
        if (isOpen) closeDrawer();
        else openDrawer();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        closeDrawer();
      });
    }

    fetch(jsonPath)
      .then(function(r) { return r.json(); })
      .then(function(data) {
        render(data);
        injectQuickLinks(closeDrawer);
        setupDesktopSubmenu();
      })
      .catch(function() {
        injectQuickLinks(closeDrawer);
        setupDesktopSubmenu();
      });

    function parseDate(s) { var d = new Date(s); return isNaN(d) ? null : d; }
    function within90(d) { if (!d) return false; var now = new Date(); var days = (now - d) / 86400000; return days <= 90; }

    function render(list) {
      var items = Array.isArray(list) ? list : [];
      var latestItems = items.filter(function(a) { return within90(parseDate(a.publishDate)); })
                            .sort(function(a, b) { return new Date(b.publishDate) - new Date(a.publishDate); });
      if (latest) latest.innerHTML = latestItems.map(linkItem).join('');
      var grouped = groupSeries(items);
      if (series) series.innerHTML = buildSeries(grouped);
      var tagList = buildTopics(items);
      if (topics) topics.innerHTML = tagList.map(function(t) {
        return '<a class="nav-topic" href="/insights/topics/' + slugify(t) + '">' + t + '</a>';
      }).join('');
      setupAccordions();
    }

    function linkItem(a) { return '<a class="nav-article" href="' + a.url + '">' + escapeHtml(a.title) + '</a>'; }

    function groupSeries(items) {
      var g = { Building: { Hub: [], Insights: [], Portfolio: [] }, UseCases: [], Reflections: [] };
      items.forEach(function(a) {
        if (a.series === 'Building Series') {
          var key = a.seriesSlug === 'building-the-hub' ? 'Hub' : 
                    a.seriesSlug === 'building-insights' ? 'Insights' : 
                    a.seriesSlug === 'building-portfolio' ? 'Portfolio' : null;
          if (key) g.Building[key].push(a);
        } else if (a.series === 'Use Cases') {
          g.UseCases.push(a);
        } else if (a.series === 'Reflections') {
          g.Reflections.push(a);
        }
      });
      Object.keys(g.Building).forEach(function(k) {
        g.Building[k].sort(function(a, b) { return new Date(b.publishDate) - new Date(a.publishDate); });
      });
      g.UseCases.sort(function(a, b) { return new Date(b.publishDate) - new Date(a.publishDate); });
      g.Reflections.sort(function(a, b) { return new Date(b.publishDate) - new Date(a.publishDate); });
      return g;
    }

    function buildSeries(g) {
      return '<div class="accordion"><button class="accordion-toggle" data-target="building">Building Series</button><div class="accordion-panel" data-id="building">' + 
             sub('The Hub', g.Building.Hub) + sub('Insights', g.Building.Insights) + sub('Portfolio', g.Building.Portfolio) + 
             '</div></div>' +
             '<div class="accordion"><button class="accordion-toggle" data-target="usecases">Use Cases</button><div class="accordion-panel" data-id="usecases">' + 
             g.UseCases.map(linkItem).join('') + 
             '</div></div>' +
             '<div class="accordion"><button class="accordion-toggle" data-target="reflections">Reflections</button><div class="accordion-panel" data-id="reflections">' + 
             g.Reflections.map(linkItem).join('') + 
             '</div></div>';
    }

    function sub(label, arr) {
      if (!arr.length) return '';
      return '<div class="series-sub"><div class="series-label">' + label + '</div>' + arr.map(linkItem).join('') + '</div>';
    }

    function buildTopics(items) {
      var set = new Set();
      items.forEach(function(a) { if (Array.isArray(a.topics)) a.topics.forEach(function(t) { set.add(t); }); });
      return Array.from(set).sort();
    }

    function slugify(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }
    function escapeHtml(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

    function setupAccordions() {
      var toggles = drawer ? drawer.querySelectorAll('.accordion-toggle') : [];
      toggles.forEach(function(btn) {
        btn.addEventListener('click', function() {
          var target = btn.getAttribute('data-target');
          var panel = drawer ? drawer.querySelector('.accordion-panel[data-id="' + target + '"]') : null;
          if (!panel) return;
          var open = panel.getAttribute('data-open') === 'true';
          panel.setAttribute('data-open', open ? 'false' : 'true');
        });
      });
    }

    function injectQuickLinks(closeCb) {
      var dc = document.querySelector('.drawer-content');
      if (!dc || dc.querySelector('.drawer-quick')) return;
      var q = document.createElement('nav');
      q.className = 'drawer-section drawer-quick';
      q.setAttribute('role', 'navigation');
      q.setAttribute('aria-label', 'Insights submenu');
      q.innerHTML = '<div class="section-label">Quick Links</div>' +
                    '<a class="nav-link" role="menuitem" href="/insights/">Latest</a>' +
                    '<a class="nav-link" role="menuitem" href="/insights/series/">Series</a>' +
                    '<a class="nav-link" role="menuitem" href="/insights/topics/">Topics</a>';
      dc.insertBefore(q, dc.firstChild);
      applyQuickLinkActive(q);
      attachQuickLinkAnalytics(q, closeCb);
    }

    function applyQuickLinkActive(q) {
      var p = location.pathname || '';
      var links = q.querySelectorAll('a.nav-link');
      links.forEach(function(a) {
        var href = a.getAttribute('href');
        a.classList.remove('is-active');
        if (p === href || (href !== '/insights/' && p.indexOf(href) === 0)) {
          a.classList.add('is-active');
        }
      });
    }

    function attachQuickLinkAnalytics(q, closeCb) {
      var key = 'nav_quick_metrics';
      var links = q.querySelectorAll('a.nav-link');
      links.forEach(function(a) {
        a.style.cursor = 'pointer';
        a.style.touchAction = 'manipulation';
        function record() {
          var name = a.textContent.trim().toLowerCase();
          var data = {};
          try { data = JSON.parse(localStorage.getItem(key) || '{}'); } catch (e) {}
          data[name] = (data[name] || 0) + 1;
          try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) {}
        }
        function go() {
          var href = a.getAttribute('href');
          record();
          if (closeCb) closeCb();
          setTimeout(function() { window.location.assign(href); }, 10);
        }
        a.addEventListener('click', function(e) { e.preventDefault(); go(); });
        a.addEventListener('keydown', function(e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
      });
    }

    function setupDesktopSubmenu() {
      var nav = document.getElementById('lgMainNav') || document.querySelector('.lg-main-nav');
      if (!nav) return;
      var insightsLink = nav.querySelector('a[href="/insights"]') || nav.querySelector('a[href="/insights/"]') || nav.querySelector('.lg-nav-link.is-active');
      if (!insightsLink) return;

      var wrapper = document.createElement('div');
      wrapper.className = 'nav-sub-wrapper';
      insightsLink.parentNode.insertBefore(wrapper, insightsLink);
      wrapper.appendChild(insightsLink);

      var submenu = document.createElement('div');
      submenu.className = 'nav-submenu';
      submenu.setAttribute('role', 'menu');
      submenu.setAttribute('aria-label', 'Insights submenu');
      submenu.innerHTML = '<a role="menuitem" href="/insights/">Latest</a>' +
                          '<a role="menuitem" href="/insights/series/">Series</a>' +
                          '<a role="menuitem" href="/insights/topics/">Topics</a>';
      wrapper.appendChild(submenu);

      insightsLink.setAttribute('aria-haspopup', 'true');
      insightsLink.setAttribute('aria-expanded', 'false');

      function openSub() { submenu.classList.add('open'); insightsLink.setAttribute('aria-expanded', 'true'); }
      function closeSub() { submenu.classList.remove('open'); insightsLink.setAttribute('aria-expanded', 'false'); }

      var mq = window.matchMedia('(min-width:1025px)');

      function handleDesktopEvents() {
        if (!mq.matches) {
          closeSub();
          wrapper.removeEventListener('mouseenter', openSub);
          wrapper.removeEventListener('mouseleave', closeSub);
          return;
        }
        wrapper.addEventListener('mouseenter', openSub);
        wrapper.addEventListener('mouseleave', closeSub);
        
        insightsLink.addEventListener('click', function(e) {
          if (mq.matches) {
            e.preventDefault();
            e.stopPropagation();
            if (submenu.classList.contains('open')) closeSub();
            else openSub();
          }
        });
      }

      handleDesktopEvents();
      if (mq.addEventListener) mq.addEventListener('change', handleDesktopEvents);
      else mq.addListener(handleDesktopEvents);

      document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeSub(); });
    }
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
