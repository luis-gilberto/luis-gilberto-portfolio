/* ==========================================================================
   LG Studio · Shared shell (v1.0)
   Injects canonical header, drawer, optional chapter bar, and site footer.
   Visual north star: studio/index.html (monogram + LG Studio text).
   Mount:
     <div id="studio-chrome-root"
          data-studio-page="home|practice|retrato|revelado|encuadre"
          data-studio-chapters="retrato|revelado|encuadre|">
     </div>
     <div id="studio-footer-root" data-studio-footer="site|none"></div>
   ========================================================================== */
(function () {
  'use strict';

  var BOOKINGS =
    'https://bookings.cloud.microsoft/bookwithme/user/4d31ec5d7644431e97d8689b003682b3%40strategyIQ.com?anonymous&ismsaljsauthenabled';
  var MONOGRAM = '/studio/brand-system/assets/monogram.png';
  var LOCKUP_FULL = '/studio/brand-system/assets/lockup-full.png';

  function pageFromPath() {
    var p = (window.location.pathname || '').toLowerCase();
    if (p.indexOf('/studio/practice/el-retrato') !== -1) return 'retrato';
    if (p.indexOf('/studio/practice/el-revelado') !== -1) return 'revelado';
    if (p.indexOf('/studio/practice/el-encuadre') !== -1) return 'encuadre';
    if (p.indexOf('/studio/practice') !== -1) return 'practice';
    if (p === '/studio' || p === '/studio/' || p.indexOf('/studio/index') !== -1) return 'home';
    return 'studio';
  }

  function linksFor(page) {
    var onHome = page === 'home';
    return {
      brandHref: onHome ? '#top' : '/studio/',
      brandCurrent: onHome,
      practiceHref: '/studio/practice/',
      practiceCurrent: page === 'practice' || page === 'retrato' || page === 'revelado' || page === 'encuadre',
      strategyHref: onHome ? '#strategyiq' : '/studio/#strategyiq',
      workHref: onHome ? '#work' : '/studio/#work',
      contactHref: onHome ? '#contact' : '/studio/#contact',
      bookHref: onHome ? '#contact' : BOOKINGS,
      bookExternal: !onHome
    };
  }

  function headerHTML(page) {
    var L = linksFor(page);
    var bookAttrs = L.bookExternal
      ? ' target="_blank" rel="noopener noreferrer"'
      : '';
    var brandCurrent = L.brandCurrent ? ' aria-current="page"' : '';
    var practiceCurrent = L.practiceCurrent ? ' aria-current="page"' : '';

    return (
      '<nav class="nav" data-surface="ink" aria-label="LG Studio navigation">' +
        '<div class="nav-in">' +
          '<a class="nav-brand" href="' + L.brandHref + '"' + brandCurrent + '>' +
            '<img src="' + MONOGRAM + '" alt="" width="32" height="32" decoding="async">' +
            '<span class="nav-name">LG Studio</span>' +
          '</a>' +
          '<div class="nav-links" aria-label="Primary">' +
            '<a href="' + L.practiceHref + '"' + practiceCurrent + ' data-i18n-en="Practice" data-i18n-es="Práctica">Practice</a>' +
            '<span class="nav-sep" aria-hidden="true">|</span>' +
            '<a href="' + L.strategyHref + '">StrategyIQ</a>' +
            '<span class="nav-sep" aria-hidden="true">|</span>' +
            '<a href="' + L.workHref + '" data-i18n-en="Work" data-i18n-es="Trabajo">Work</a>' +
          '</div>' +
          '<div class="nav-right">' +
            '<div class="ed-nav-lang-toggle ed-nav-lang-toggle-header" role="group" aria-label="Language">' +
              '<button type="button" data-lang="en" class="is-active" aria-pressed="true">EN</button>' +
              '<button type="button" data-lang="es" aria-pressed="false">ES</button>' +
            '</div>' +
            '<a class="nav-cta" href="' + L.bookHref + '"' + bookAttrs +
              ' data-i18n-en="Book a conversation" data-i18n-es="Agendar una conversación">Book a conversation</a>' +
            '<div class="ed-nav-mobile">' +
              '<button type="button" class="ed-menu-toggle" aria-expanded="false" aria-controls="ed-nav-drawer" aria-label="Open menu" data-aria-en="Open menu" data-aria-es="Abrir menú">' +
                '<span class="ed-menu-toggle-icon" aria-hidden="true">' +
                  '<svg width="22" height="14" viewBox="0 0 22 14" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                    '<path d="M1 1h20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
                    '<path d="M1 7h20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
                    '<path d="M1 13h20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
                  '</svg>' +
                '</span>' +
              '</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</nav>'
    );
  }

  function drawerHTML(page) {
    var L = linksFor(page);
    return (
      '<div class="ed-nav-drawer" id="ed-nav-drawer" aria-hidden="true" hidden>' +
        '<div class="ed-nav-drawer-backdrop" data-nav-drawer-close tabindex="-1"></div>' +
        '<div class="ed-nav-drawer-panel" role="dialog" aria-modal="true" aria-label="Site navigation">' +
          '<button type="button" class="ed-nav-drawer-close" data-nav-drawer-close aria-label="Close menu" data-aria-en="Close menu" data-aria-es="Cerrar menú">' +
            '<span class="ed-nav-drawer-close-text" data-i18n-en="Close" data-i18n-es="Cerrar">Close</span>' +
          '</button>' +
          '<nav class="ed-nav-drawer-nav" aria-label="Mobile primary">' +
            '<a href="' + L.practiceHref + '" class="ed-nav-drawer-link" data-nav-drawer-link' +
              (L.practiceCurrent ? ' aria-current="page"' : '') + '>' +
              '<span class="ed-nav-drawer-num">01</span>' +
              '<span class="ed-nav-drawer-sep" aria-hidden="true">·</span>' +
              '<span class="ed-nav-drawer-label" data-i18n-en="Practice" data-i18n-es="Práctica">Practice</span>' +
            '</a>' +
            '<a href="' + L.strategyHref + '" class="ed-nav-drawer-link" data-nav-drawer-link>' +
              '<span class="ed-nav-drawer-num">02</span>' +
              '<span class="ed-nav-drawer-sep" aria-hidden="true">·</span>' +
              '<span class="ed-nav-drawer-label">StrategyIQ</span>' +
            '</a>' +
            '<a href="' + L.workHref + '" class="ed-nav-drawer-link" data-nav-drawer-link>' +
              '<span class="ed-nav-drawer-num">03</span>' +
              '<span class="ed-nav-drawer-sep" aria-hidden="true">·</span>' +
              '<span class="ed-nav-drawer-label" data-i18n-en="Work" data-i18n-es="Trabajo">Work</span>' +
            '</a>' +
            '<a href="' + L.contactHref + '" class="ed-nav-drawer-link" data-nav-drawer-link>' +
              '<span class="ed-nav-drawer-num">04</span>' +
              '<span class="ed-nav-drawer-sep" aria-hidden="true">·</span>' +
              '<span class="ed-nav-drawer-label" data-i18n-en="Contact" data-i18n-es="Contacto">Contact</span>' +
            '</a>' +
          '</nav>' +
          '<nav class="ed-nav-drawer-ecosystem" aria-label="Identity">' +
            '<a href="/" data-nav-drawer-link>Luis Gilberto</a>' +
            '<span class="ed-nav-drawer-ecosystem__sep" aria-hidden="true">|</span>' +
            '<a href="/studio/" data-nav-drawer-link aria-current="page">LG Studio</a>' +
          '</nav>' +
          '<div class="ed-nav-drawer-foot">' +
            '<div class="ed-nav-lang-toggle ed-nav-lang-toggle-drawer" role="group" aria-label="Language">' +
              '<button type="button" data-lang="en" class="is-active" aria-pressed="true">EN</button>' +
              '<button type="button" data-lang="es" aria-pressed="false">ES</button>' +
            '</div>' +
            '<a href="' + BOOKINGS + '" class="ed-btn ed-btn-primary ed-nav-drawer-book" target="_blank" rel="noopener noreferrer" data-i18n-en="Book a conversation" data-i18n-es="Agendar una conversación">Book a conversation</a>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function chapterItem(active, num, full, short, href) {
    var label =
      '<span class="lg-practice-chapters__num">' + num + '</span> ' +
      '<span class="lg-practice-chapters__full">' + full + '</span>' +
      '<span class="lg-practice-chapters__short">' + short + '</span>';
    if (active) {
      return '<span aria-current="page">' + label + '</span>';
    }
    return '<a href="' + href + '">' + label + '</a>';
  }

  function chaptersHTML(active) {
    if (!active) return '';
    var sep = '<span class="lg-practice-chapters__sep" aria-hidden="true">|</span>';
    return (
      '<nav class="lg-practice-chapters" aria-label="Read the Practice chapters">' +
        '<div class="lg-practice-chapters__inner">' +
          '<span class="lg-practice-chapters__label" data-i18n-en="Read the Practice" data-i18n-es="Leer la práctica">Read the Practice</span>' +
          sep +
          chapterItem(active === 'retrato', '01', 'El Retrato', 'Retrato', '/studio/practice/el-retrato/') +
          sep +
          chapterItem(active === 'revelado', '02', 'El Revelado', 'Revelado', '/studio/practice/el-revelado/') +
          sep +
          chapterItem(active === 'encuadre', '03', 'El Encuadre', 'Encuadre', '/studio/practice/el-encuadre/') +
        '</div>' +
      '</nav>'
    );
  }

  function footerHTML(page) {
    var L = linksFor(page);
    var brandSystem = page === 'home' ? 'brand-system/index.html' : '/studio/brand-system/';
    return (
      '<footer class="foot" data-surface="ink">' +
        '<div class="foot-shell shell">' +
          '<div class="foot-in">' +
            '<div>' +
              '<img src="' + LOCKUP_FULL + '" alt="LG Studio" width="180" height="54" decoding="async">' +
              '<p class="body-s" style="color: var(--text-on-ink-muted, rgba(247,242,233,.62)); max-width: 26ch;">' +
                '<span data-i18n-en="We read what&rsquo;s there. We direct what follows. We build what lasts." data-i18n-es="Leemos lo que ya está. Dirigimos lo que sigue. Construimos lo que perdura.">We read what&rsquo;s there. We direct what follows. We build what lasts.</span>' +
              '</p>' +
            '</div>' +
            '<div>' +
              '<h5 data-i18n-en="Practice" data-i18n-es="Práctica">Practice</h5>' +
              '<ul>' +
                '<li><a href="/studio/practice/#architecture"><span data-i18n-en="Our Architecture" data-i18n-es="Nuestra arquitectura">Our Architecture</span></a></li>' +
                '<li><a href="/studio/practice/#two-reads"><span data-i18n-en="Read the Situation" data-i18n-es="Leer la situación">Read the Situation</span></a></li>' +
                '<li><a href="/studio/practice/#two-reads"><span data-i18n-en="Read the Practice" data-i18n-es="Leer la práctica">Read the Practice</span></a></li>' +
                '<li><a href="' + L.strategyHref + '">StrategyIQ</a></li>' +
              '</ul>' +
            '</div>' +
            '<div>' +
              '<h5 data-i18n-en="Work" data-i18n-es="Trabajo">Work</h5>' +
              '<ul>' +
                '<li><a href="/work/"><span data-i18n-en="Case Studies" data-i18n-es="Casos">Case Studies</span></a></li>' +
                '<li><a href="/work/"><span data-i18n-en="Industries" data-i18n-es="Industrias">Industries</span></a></li>' +
                '<li><a href="' + (page === 'home' ? '#engage' : '/studio/#engage') + '"><span data-i18n-en="Approach" data-i18n-es="Enfoque">Approach</span></a></li>' +
              '</ul>' +
            '</div>' +
            '<div>' +
              '<h5 data-i18n-en="Insights" data-i18n-es="Perspectivas">Insights</h5>' +
              '<ul>' +
                '<li><a href="/insights/"><span data-i18n-en="Articles" data-i18n-es="Artículos">Articles</span></a></li>' +
                '<li><a href="/insights/"><span data-i18n-en="Resources" data-i18n-es="Recursos">Resources</span></a></li>' +
                '<li><a href="' + brandSystem + '"><span data-i18n-en="Brand System" data-i18n-es="Sistema de marca">Brand System</span></a></li>' +
              '</ul>' +
            '</div>' +
            '<div>' +
              '<h5 data-i18n-en="Company" data-i18n-es="Empresa">Company</h5>' +
              '<ul>' +
                '<li><a href="/about.html"><span data-i18n-en="About" data-i18n-es="Acerca de">About</span></a></li>' +
                '<li><a href="/contact.html"><span data-i18n-en="Contact" data-i18n-es="Contacto">Contact</span></a></li>' +
                '<li><a href="https://www.linkedin.com/in/luisgilberto00">LinkedIn</a></li>' +
              '</ul>' +
            '</div>' +
          '</div>' +
          '<div class="foot-base">' +
            '<span>&copy; 2026 LG Studio &middot; Luis Gilberto</span>' +
            '<span style="display:flex;gap:22px;flex-wrap:wrap">' +
              '<a href="/legal/privacy.html"><span data-i18n-en="Privacy" data-i18n-es="Privacidad">Privacy</span></a>' +
              '<a href="/legal/terms.html"><span data-i18n-en="Terms" data-i18n-es="Términos">Terms</span></a>' +
              '<a href="/legal/accessibility.html"><span data-i18n-en="Accessibility" data-i18n-es="Accesibilidad">Accessibility</span></a>' +
            '</span>' +
          '</div>' +
        '</div>' +
      '</footer>'
    );
  }

  function measureNavHeight() {
    var nav = document.querySelector('body.studio-shell .nav');
    if (!nav) return;
    var h = Math.round(nav.getBoundingClientRect().height);
    if (h > 0) {
      document.documentElement.style.setProperty('--lg-studio-nav-h', h + 'px');
    }
  }

  function mountChrome(root) {
    if (!root || root.getAttribute('data-studio-mounted') === '1') return;
    var page = root.getAttribute('data-studio-page') || pageFromPath();
    var chapters = root.getAttribute('data-studio-chapters');
    if (chapters === null || chapters === undefined) {
      chapters = (page === 'retrato' || page === 'revelado' || page === 'encuadre') ? page : '';
    }

    document.body.classList.add('studio-shell');
    if (chapters) document.body.classList.add('has-studio-chapters');

    root.outerHTML = headerHTML(page) + drawerHTML(page) + chaptersHTML(chapters);
    /* root is gone; mark via body */
    document.body.setAttribute('data-studio-page', page);
    measureNavHeight();
    window.addEventListener('resize', measureNavHeight);
  }

  function mountFooter(root, page) {
    if (!root || root.getAttribute('data-studio-mounted') === '1') return;
    var variant = root.getAttribute('data-studio-footer') || 'site';
    if (variant === 'none') {
      root.remove();
      return;
    }
    page = page || document.body.getAttribute('data-studio-page') || pageFromPath();
    root.outerHTML = footerHTML(page);
  }

  function boot() {
    var chrome = document.getElementById('studio-chrome-root');
    if (chrome) mountChrome(chrome);

    var footer = document.getElementById('studio-footer-root');
    if (footer) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
          mountFooter(document.getElementById('studio-footer-root'));
          if (window.StudioI18n && typeof window.StudioI18n.refresh === 'function') {
            window.StudioI18n.refresh();
          }
        });
      } else {
        mountFooter(footer);
      }
    }
  }

  window.StudioShell = {
    mount: boot,
    mountChrome: mountChrome,
    mountFooter: mountFooter,
    pageFromPath: pageFromPath
  };

  boot();
})();
