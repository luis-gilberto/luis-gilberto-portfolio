(function () {
  var STORAGE_KEY = "lg_costello_pa_entrance_dismissed";
  var ROOT_ID = "lg-pa-root";
  var reduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var state = {
    open: false,
    scrollY: 0,
    lastFocus: null,
    openedByRecall: false,
    statusKind: "draft",
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

  function onOverview() {
    return (document.body.getAttribute("data-lg-page") || "") === "overview";
  }

  function overviewHref(project) {
    if (window.CostelloState && project) {
      return CostelloState.url(project, "overview");
    }
    if (window.CostelloState) {
      return CostelloState.href("kitchen/costello/");
    }
    return "/studio/kitchen/costello/";
  }

  function normalizeStatus(positioning) {
    var raw = "";
    if (positioning) {
      raw = positioning.attention || positioning.status || positioning.statusLabel || "";
    }
    var key = String(raw || "FOR REVIEW")
      .toUpperCase()
      .replace(/[·.]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (/\bSUPERSEDED\b/.test(key)) {
      var newer =
        (positioning && (positioning.supersededBy || positioning.newerVersionLabel)) ||
        "the current Positioning Anchor";
      return {
        kind: "superseded",
        eyebrow: "POSITIONING ANCHOR · SUPERSEDED",
        review: "Superseded",
        internal: "Replaced by " + newer,
        application: "SUPERSEDED · SEE CURRENT POSITIONING ANCHOR",
      };
    }

    if (/\bAPPROVED\b/.test(key) && !/\bNOT APPROVED\b/.test(key)) {
      return {
        kind: "approved",
        eyebrow: "POSITIONING ANCHOR · APPROVED",
        review: "Approved",
        internal: "Internal Governing Reference",
        application: "GOVERNS · WEBSITE · BIOS · REFERRAL STRATEGY · CAMPAIGNS",
      };
    }

    if (/\bCHANGES REQUESTED\b|\bREVISION REQUESTED\b/.test(key)) {
      return {
        kind: "changes",
        eyebrow: "POSITIONING ANCHOR · CHANGES REQUESTED",
        review: "Changes Requested",
        internal: "Internal Positioning Draft",
        application: "PROPOSED APPLICATION · WEBSITE · BIOS · REFERRAL STRATEGY · CAMPAIGNS",
      };
    }

    var reviewLabel = /\bIN REVIEW\b/.test(key) ? "In Review" : "For Review";
    return {
      kind: "draft",
      eyebrow: "POSITIONING ANCHOR · WORKING DRAFT",
      review: reviewLabel,
      internal: "Internal Positioning Draft",
      application: "PROPOSED APPLICATION · WEBSITE · BIOS · REFERRAL STRATEGY · CAMPAIGNS",
    };
  }

  function applyStatusLabels(labels) {
    state.statusKind = labels.kind;
    var root = document.getElementById(ROOT_ID);
    if (!root) return;

    var eyebrow = root.querySelector(".lg-pa-eyebrow");
    var review = root.querySelector(".lg-pa-review");
    var internal = root.querySelector(".lg-pa-internal");
    var application = root.querySelector(".lg-pa-governs");
    var scrim = root.querySelector(".lg-pa-scrim");

    if (eyebrow) eyebrow.textContent = labels.eyebrow;
    if (review) review.textContent = labels.review;
    if (internal) internal.textContent = labels.internal;
    if (application) application.textContent = labels.application;
    if (scrim) scrim.setAttribute("data-status", labels.kind);
  }

  function markup() {
    var hideSkip = onOverview();
    return (
      '<div class="lg-pa-scrim" id="lg-pa-scrim" hidden role="dialog" aria-modal="true" aria-labelledby="lg-pa-title" aria-describedby="lg-pa-copy" data-status="draft">' +
      '  <div class="lg-pa-panel">' +
      '    <header class="lg-pa-head">' +
      '      <div class="lg-pa-brand">' +
      '        <p class="lg-pa-firm">Costello Law Firm workspace</p>' +
      '        <p class="lg-pa-workspace">Strategic Workspace</p>' +
      "      </div>" +
      '      <div class="lg-pa-status">' +
      '        <p class="lg-pa-review">For Review</p>' +
      '        <span class="lg-pa-status-rule" aria-hidden="true"></span>' +
      '        <p class="lg-pa-internal">Internal Positioning Draft</p>' +
      "      </div>" +
      "    </header>" +
      '    <div class="lg-pa-body">' +
      '      <div class="lg-pa-established">' +
      '        <div class="lg-pa-anchor">' +
      '          <p class="lg-pa-eyebrow">POSITIONING ANCHOR · WORKING DRAFT</p>' +
      '          <h1 class="lg-pa-title" id="lg-pa-title">Prepared for Trial,<br />Positioned for Resolution</h1>' +
      "        </div>" +
      '        <div class="lg-pa-copy" id="lg-pa-copy">' +
      "          <p>Costello Law Firm represents individuals, professionals, and businesses when a single matter moves across criminal, civil, administrative, regulatory, and licensing proceedings.</p>" +
      "          <p class=\"lg-pa-ground\">That work is grounded in significant trial experience and advocacy that tells the client\u2019s story with precision.</p>" +
      "        </div>" +
      "      </div>" +
      "    </div>" +
      '    <footer class="lg-pa-foot">' +
      '      <p class="lg-pa-governs">PROPOSED APPLICATION · WEBSITE · BIOS · REFERRAL STRATEGY · CAMPAIGNS</p>' +
      '      <div class="lg-pa-actions">' +
      (hideSkip
        ? ""
        : '        <button type="button" class="lg-pa-skip" id="lg-pa-skip">Go directly to overview</button>') +
      '        <button type="button" class="lg-pa-enter" id="lg-pa-enter">Enter Workspace <span aria-hidden="true">\u2192</span></button>' +
      "      </div>" +
      "    </footer>" +
      "  </div>" +
      "</div>" +
      '<button type="button" class="lg-pa-recall" id="lg-pa-recall" hidden aria-label="Open Positioning Anchor">' +
      "<span>Positioning Anchor</span>" +
      "</button>"
    );
  }

  function ensureRoot() {
    var existing = document.getElementById(ROOT_ID);
    if (existing) return existing;

    var root = document.createElement("div");
    root.id = ROOT_ID;
    root.className = "lg-pa-root";
    root.innerHTML = markup();
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
    return Array.prototype.slice
      .call(
        container.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      )
      .filter(function (el) {
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

  function bindActions(project) {
    var nodes = els();
    if (!nodes.scrim) return;

    nodes.enter.addEventListener("click", function () {
      closeEntrance(true);
    });

    if (nodes.skip) {
      nodes.skip.addEventListener("click", function () {
        setDismissed();
        window.location.href = overviewHref(project);
      });
    }

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

  function boot(project) {
    ensureRoot();
    applyStatusLabels(normalizeStatus(project && project.positioning));
    bindActions(project);
  }

  function start() {
    if (window.CostelloState && typeof CostelloState.load === "function") {
      CostelloState.load()
        .then(boot)
        .catch(function () {
          boot(null);
        });
    } else {
      boot(null);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
