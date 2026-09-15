(function () {
  function kitchenBase() {
    var path = (location.pathname || "/").replace(/\\/g, "/");
    var marker = "/kitchen/";
    var idx = path.indexOf(marker);
    if (idx >= 0) return path.slice(0, idx + marker.length);
    return "/studio/kitchen/";
  }

  var KITCHEN = kitchenBase();
  var SW_URL = KITCHEN + "sw.js";
  var SW_SCOPE = KITCHEN;
  var deferred = null;
  var prompting = false;
  var phase = "checking";
  var fallbackTimer = null;
  var installed = (window.matchMedia && (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: minimal-ui)").matches
  )) || window.navigator.standalone === true;
  var swReady = false;

  function buttons() {
    return Array.prototype.slice.call(document.querySelectorAll("[data-lg-install]"));
  }

  function browserName() {
    var ua = navigator.userAgent || "";
    if (/Edg\//i.test(ua)) return "Edge";
    if (/Chrome\//i.test(ua) && !/Edg\//i.test(ua)) return "Chrome";
    if (/Safari/i.test(ua) && !/Chrome|CriOS|Edg/i.test(ua)) return "Safari";
    if (/Firefox\//i.test(ua)) return "Firefox";
    return "this browser";
  }

  function manualLabel() {
    var name = browserName();
    if (name === "Edge") return "Install from Edge";
    if (name === "Chrome") return "Install from Chrome";
    if (name === "Safari") return "Add to Dock";
    return "Desktop install help";
  }

  function bind(btn) {
    if (!btn || btn.getAttribute("data-lg-bound") === "1") return;
    btn.setAttribute("data-lg-bound", "1");
    btn.type = "button";
    btn.addEventListener("click", offer);
  }

  function setButton(btn, label, state, hidden, disabled) {
    bind(btn);
    btn.textContent = label;
    btn.setAttribute("aria-label", label);
    btn.setAttribute("aria-controls", "lg-install-feedback");
    btn.setAttribute("data-install-state", state);
    btn.hidden = !!hidden;
    btn.disabled = !!disabled;
  }

  function renderButtons() {
    buttons().forEach(function (btn) {
      if (installed) {
        setButton(btn, "Installed", "installed", false, true);
      } else if (prompting) {
        setButton(btn, "Opening install…", "prompting", false, true);
      } else if (deferred) {
        setButton(btn, "Install to Desktop", "ready", false, false);
      } else if (phase === "manual") {
        setButton(btn, manualLabel(), "manual", false, false);
      } else {
        setButton(btn, "Checking desktop install…", "checking", true, true);
      }
    });
  }

  function feedback() {
    var el = document.getElementById("lg-install-feedback");
    if (el) return el;

    el = document.createElement("div");
    el.id = "lg-install-feedback";
    el.className = "lg-install-feedback";
    el.hidden = true;
    el.tabIndex = -1;
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");

    var header = document.querySelector(".workspace-header");
    if (header && header.parentNode) {
      header.insertAdjacentElement("afterend", el);
    } else {
      document.body.insertBefore(el, document.body.firstChild);
    }
    return el;
  }

  function setFeedback(text, tone) {
    var el = feedback();
    el.textContent = text;
    el.hidden = false;
    el.setAttribute("data-tone", tone || "info");
    el.scrollIntoView({ block: "nearest", behavior: "smooth" });
    try { el.focus({ preventScroll: true }); } catch (err) { /* ignore */ }
  }

  function hideManualFeedback() {
    var el = document.getElementById("lg-install-feedback");
    if (el && el.getAttribute("data-install-message") === "manual") {
      el.hidden = true;
      el.removeAttribute("data-install-message");
    }
  }

  function guidanceText() {
    if (installed) {
      return "Costello workspace is installed. Open it from your desktop, Start menu, or dock.";
    }

    var name = browserName();
    if (name === "Edge") {
      return "Edge has not made the one-click prompt available on this tab. Use the app-install icon at the right side of the address bar. If it is not visible, choose … → Apps → Install Costello Law Firm workspace.";
    }
    if (name === "Chrome") {
      return "Chrome has not made the one-click prompt available on this tab. Use the install icon in the address bar, or choose Menu → Cast, save and share → Install page as app.";
    }
    if (name === "Safari") {
      return "On Mac, choose File → Add to Dock. On iPhone or iPad, choose Share → Add to Home Screen.";
    }
    if (name === "Firefox") {
      return "Firefox desktop does not provide this install prompt. Open the same workspace URL in Edge or Chrome to install it as a desktop app.";
    }
    return "Use your browser’s address-bar install control or app-install menu to add this workspace to your desktop.";
  }

  function showManualGuidance() {
    var el = feedback();
    el.setAttribute("data-install-message", "manual");
    setFeedback(guidanceText(), "info");
  }

  function finishChoice(choice) {
    prompting = false;
    var outcome = choice && choice.outcome;
    if (outcome === "accepted") {
      installed = true;
      phase = "installed";
      setFeedback("Installed. Open Costello workspace from your desktop, Start menu, or dock.", "ok");
    } else {
      phase = "manual";
      setFeedback("Installation was dismissed. Use the Edge install icon whenever you are ready, or select Install from Edge for the exact menu path.", "info");
    }
    renderButtons();
  }

  function offer(ev) {
    if (ev) {
      ev.preventDefault();
      ev.stopPropagation();
    }

    if (installed) {
      setFeedback(guidanceText(), "ok");
      return;
    }

    if (!deferred || typeof deferred.prompt !== "function") {
      phase = "manual";
      renderButtons();
      showManualGuidance();
      return;
    }

    var promptEvent = deferred;
    var choicePromise = null;
    deferred = null;
    prompting = true;
    renderButtons();
    setFeedback("Opening Edge’s install dialog…", "info");

    try {
      var promptResult = promptEvent.prompt();
      choicePromise = promptEvent.userChoice || promptResult;
    } catch (err) {
      prompting = false;
      phase = "manual";
      renderButtons();
      showManualGuidance();
      return;
    }

    if (choicePromise && typeof choicePromise.then === "function") {
      choicePromise.then(finishChoice).catch(function () {
        prompting = false;
        phase = "manual";
        renderButtons();
        showManualGuidance();
      });
    } else {
      prompting = false;
      phase = "manual";
      renderButtons();
    }
  }

  function settleToManual() {
    if (installed || deferred || prompting) return;
    phase = "manual";
    renderButtons();
  }

  function scheduleFallback() {
    if (fallbackTimer || phase !== "checking") return;
    fallbackTimer = window.setTimeout(settleToManual, swReady ? 900 : 1800);
  }

  function registerWorker() {
    if (!("serviceWorker" in navigator)) {
      phase = "manual";
      renderButtons();
      return;
    }

    navigator.serviceWorker.register(SW_URL, { scope: SW_SCOPE, updateViaCache: "none" })
      .then(function (reg) {
        swReady = !!(reg && (reg.active || reg.installing || reg.waiting));
        renderButtons();
        scheduleFallback();
        return navigator.serviceWorker.ready;
      })
      .then(function () {
        swReady = true;
        renderButtons();
        scheduleFallback();
      })
      .catch(function () {
        swReady = false;
        phase = "manual";
        renderButtons();
      });

    navigator.serviceWorker.addEventListener("controllerchange", function () {
      swReady = true;
      renderButtons();
    });
  }

  function init() {
    feedback();
    renderButtons();
    scheduleFallback();
  }

  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferred = e;
    installed = false;
    prompting = false;
    phase = "ready";
    if (fallbackTimer) {
      window.clearTimeout(fallbackTimer);
      fallbackTimer = null;
    }
    hideManualFeedback();
    renderButtons();
  });

  window.addEventListener("appinstalled", function () {
    deferred = null;
    prompting = false;
    installed = true;
    phase = "installed";
    renderButtons();
    setFeedback("Installed. Open Costello workspace from your desktop, Start menu, or dock.", "ok");
  });

  registerWorker();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  var n = 0;
  var t = window.setInterval(function () {
    n += 1;
    init();
    if ((document.querySelector(".workspace-header") && document.querySelector("[data-lg-install]")) || n > 60) {
      window.clearInterval(t);
    }
  }, 50);
})();
