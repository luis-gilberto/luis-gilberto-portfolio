(function () {
  var STORAGE_KEY = "lg_costello_pa_entrance_dismissed";
  var ROOT_ID = "lg-pa-root";
  var reduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var markSvg =
    '<svg class="lg-pa-mark" viewBox="0 0 14 46" aria-hidden="true" focusable="false">' +
    '<rect x="1" y="1" width="12" height="12" />' +
    '<rect x="1" y="17" width="12" height="12" />' +
    '<rect x="1" y="33" width="12" height="12" />' +
    "</svg>";

  var state = {
    open: false,
    scrollY: 0,
    lastFocus: null,
    openedByRecall: false,
  };

  function dismissed() {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch (err) {
      return false;
    }
  }

  function setDismissed() {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch (err) {
      /* private mode — still allow dismiss for this page life */
    }
  }

  function ensureRoot() {
    var existing = document.getElementById(ROOT_ID);
    if (existing) return existing;

    var root = document.createElement("div");
    root.id = ROOT_ID;
    root.className = "lg-pa-root";
    root.innerHTML =
      '<div class="lg-pa-scrim" id="lg-pa-scrim" hidden role="dialog" aria-modal="true" aria-labelledby="lg-pa-title" aria-describedby="lg-pa-copy">' +
      '  <div class="lg-pa-panel">' +
      '    <header class="lg-pa-head">' +
      '      <div class="lg-pa-brand">' +
      markSvg +
      '        <div class="lg-pa-brand-text">' +
      '          <p class="lg-pa-firm">Costello Law Firm, PLLC</p>' +
      '          <p class="lg-pa-workspace">Strategic Workspace</p>' +
      "        </div>" +
      "      </div>" +
      '      <div class="lg-pa-status">' +
      '        <p class="lg-pa-review">For Review</p>' +
      '        <span class="lg-pa-status-rule" aria-hidden="true"></span>' +
      '        <p class="lg-pa-internal">Internal Governing Reference</p>' +
      "      </div>" +
      "    </header>" +
      '    <div class="lg-pa-body">' +
      '      <div class="lg-pa-hero">' +
      '        <p class="lg-pa-scope">Boutique White-Collar Defense and Litigation</p>' +
      '        <h1 class="lg-pa-title" id="lg-pa-title">Built for the Problem That Won\u2019t Stay in One Forum</h1>' +
      "      </div>" +
      '      <div class="lg-pa-copy" id="lg-pa-copy">' +
      "        <p>Costello Law Firm represents individuals, professionals, and businesses when a single matter moves across criminal, civil, administrative, regulatory, and licensing proceedings\u2014at once or in sequence.</p>" +
      "        <p>The firm\u2019s distinction is coordination: treating those proceedings as one strategy, so each decision in one forum is made with the others in view.</p>" +
      "        <p>That work is grounded in judgment, significant trial experience, and advocacy that tells the client\u2019s story with precision.</p>" +
      "      </div>" +
      "    </div>" +
      '    <footer class="lg-pa-foot">' +
      '      <p class="lg-pa-governs">Governs \u00b7 Website \u00b7 Bios \u00b7 Referral Strategy \u00b7 Campaigns</p>' +
      '      <div class="lg-pa-actions">' +
      '        <button type="button" class="lg-pa-skip" id="lg-pa-skip">Skip</button>' +
      '        <button type="button" class="lg-pa-enter" id="lg-pa-enter">Enter Workspace <span aria-hidden="true">\u2192</span></button>' +
      "      </div>" +
      "    </footer>" +
      "  </div>" +
      "</div>" +
      '<button type="button" class="lg-pa-recall" id="lg-pa-recall" hidden aria-label="Open Positioning Anchor">' +
      markSvg +
      "<span>Positioning Anchor</span>" +
      "</button>";

    document.body.appendChild(root);
    return root;
  }

  function els() {
    return {
      scrim: document.getElementById("lg-pa-scrim"),
      enter: document.getElementById("lg-pa-enter"),
      skip: document.getElementById("lg-pa-skip"),
      recall: document.getElementById("lg-pa-recall"),
    };
  }

  function focusables(container) {
    return Array.prototype.slice.call(
      container.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter(function (el) {
      return el.offsetParent !== null || el === document.activeElement;
    });
  }

  function lockScroll() {
    state.scrollY = window.scrollY || window.pageYOffset || 0;
    document.documentElement.classList.add("lg-pa-lock");
    document.body.style.top = "-" + state.scrollY + "px";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
  }

  function unlockScroll() {
    document.documentElement.classList.remove("lg-pa-lock");
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    window.scrollTo(0, state.scrollY || 0);
  }

  function showRecall() {
    var recall = els().recall;
    if (recall) recall.hidden = false;
  }

  function hideRecall() {
    var recall = els().recall;
    if (recall) recall.hidden = true;
  }

  function openEntrance(fromRecall) {
    var nodes = els();
    if (!nodes.scrim || state.open) return;

    state.open = true;
    state.openedByRecall = !!fromRecall;
    state.lastFocus = document.activeElement;
    hideRecall();
    lockScroll();

    nodes.scrim.hidden = false;
    if (reduced) {
      nodes.scrim.classList.add("is-open");
    } else {
      nodes.scrim.offsetWidth;
      nodes.scrim.classList.add("is-open");
    }

    window.setTimeout(
      function () {
        if (nodes.enter) nodes.enter.focus();
      },
      reduced ? 0 : 40
    );
  }

  function closeEntrance(recordSession) {
    var nodes = els();
    if (!nodes.scrim || !state.open) return;

    state.open = false;
    nodes.scrim.classList.remove("is-open");

    function finish() {
      nodes.scrim.hidden = true;
      unlockScroll();
      if (recordSession) setDismissed();
      showRecall();

      var returnTo =
        state.openedByRecall && state.lastFocus && document.contains(state.lastFocus)
          ? state.lastFocus
          : nodes.recall;
      if (returnTo && typeof returnTo.focus === "function") {
        try {
          returnTo.focus();
        } catch (err) {
          /* ignore */
        }
      }
      state.openedByRecall = false;
    }

    if (reduced) finish();
    else window.setTimeout(finish, 220);
  }

  function onKeydown(e) {
    if (!state.open) return;
    var nodes = els();

    if (e.key === "Escape") {
      e.preventDefault();
      closeEntrance(true);
      return;
    }

    if (e.key !== "Tab" || !nodes.scrim) return;
    var list = focusables(nodes.scrim);
    if (!list.length) return;
    var first = list[0];
    var last = list[list.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function bind() {
    ensureRoot();
    var nodes = els();
    if (!nodes.scrim) return;

    nodes.enter.addEventListener("click", function () {
      closeEntrance(true);
    });
    nodes.skip.addEventListener("click", function () {
      closeEntrance(true);
    });
    nodes.recall.addEventListener("click", function () {
      openEntrance(true);
    });
    document.addEventListener("keydown", onKeydown);

    if (dismissed()) {
      showRecall();
    } else {
      openEntrance(false);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind);
  } else {
    bind();
  }
})();
