(function () {
  var SW_URL = "/studio/kitchen/sw.js";
  var SW_SCOPE = "/studio/kitchen/";
  var deferred = null;
  var installed = (window.matchMedia && (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: minimal-ui)").matches
  )) || window.navigator.standalone === true;
  var swReady = false;

  function registerWorker() {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register(SW_URL, { scope: SW_SCOPE, updateViaCache: "none" })
      .then(function (reg) {
        swReady = !!(reg && (reg.active || reg.installing || reg.waiting));
        return navigator.serviceWorker.ready;
      })
      .then(function () { swReady = true; })
      .catch(function () { swReady = false; });
  }

  function buttons() {
    return Array.prototype.slice.call(document.querySelectorAll("[data-lg-install]"));
  }

  function labelButtons() {
    buttons().forEach(function (btn) {
      btn.textContent = "Install to Desktop";
      btn.setAttribute("aria-label", "Install to Desktop");
      btn.setAttribute("aria-controls", "lg-install-feedback");
      btn.hidden = false;
    });
  }

  function feedback() {
    var el = document.getElementById("lg-install-feedback");
    if (el) return el;

    el = document.createElement("div");
    el.id = "lg-install-feedback";
    el.className = "lg-install-feedback";
    el.hidden = true;
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

  function browserName() {
    var ua = navigator.userAgent || "";
    if (/Edg\//i.test(ua)) return "Edge";
    if (/Chrome\//i.test(ua) && !/Edg\//i.test(ua)) return "Chrome";
    if (/Safari/i.test(ua) && !/Chrome|CriOS|Edg/i.test(ua)) return "Safari";
    if (/Firefox\//i.test(ua)) return "Firefox";
    return "this browser";
  }

  function guidanceText() {
    if (installed) {
      return "Already installed on this device. Open Costello workspace from your desktop, Start menu, or dock — this button cannot install it twice.";
    }
    var name = browserName();
    if (name === "Safari") {
      return "Safari does not support one-click install here. Use File → Add to Dock (Mac) or Share → Add to Home Screen (iOS).";
    }
    if (name === "Firefox") {
      return "Firefox does not provide a native install prompt for this workspace. Use Chrome or Edge on this same URL to Install to Desktop.";
    }
    if (!swReady && "serviceWorker" in navigator) {
      return "Install is not ready yet — the workspace service worker is still registering. Wait a second and click Install to Desktop again. If nothing appears, use " + name + " Menu → Apps → Install this site as an app (or the install icon in the address bar).";
    }
    return "Your browser has not offered a native install dialog yet. In " + name + ", open the address-bar install icon, or Menu → Apps / Cast / Save and share → Install this site as an app. Stay on this unlocked kitchen URL when you install.";
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

    if (deferred && typeof deferred.prompt === "function") {
      setFeedback("Opening the browser install dialog…", "info");
      try {
        var result = deferred.prompt();
        if (result && typeof result.then === "function") {
          result.catch(function () {
            setFeedback("The browser blocked the install dialog. " + guidanceText(), "warn");
          });
        }
      } catch (err) {
        setFeedback("The browser blocked the install dialog. " + guidanceText(), "warn");
        return;
      }
      if (deferred.userChoice && typeof deferred.userChoice.then === "function") {
        deferred.userChoice.then(function (choice) {
          deferred = null;
          if (choice && choice.outcome === "accepted") {
            setFeedback("Install accepted. Finish any browser confirmation, then open Costello workspace from your desktop, Start menu, or dock.", "ok");
          } else {
            setFeedback("Install was dismissed. Click Install to Desktop again when you are ready, or use the browser’s install menu.", "warn");
          }
        }).catch(function () {
          setFeedback(guidanceText(), "warn");
        });
      }
      return;
    }

    setFeedback(guidanceText(), "warn");
  }

  function bind(btn) {
    if (!btn || btn.getAttribute("data-lg-bound") === "1") return;
    btn.setAttribute("data-lg-bound", "1");
    btn.hidden = false;
    btn.type = "button";
    btn.addEventListener("click", offer);
  }

  function init() {
    feedback();
    labelButtons();
    buttons().forEach(bind);
  }

  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferred = e;
    installed = false;
    buttons().forEach(function (btn) { btn.hidden = false; });
    var el = document.getElementById("lg-install-feedback");
    if (el && /Opening the browser install dialog/i.test(el.textContent || "")) {
      /* keep current message */
    }
  });

  window.addEventListener("appinstalled", function () {
    deferred = null;
    installed = true;
    setFeedback("Installed. Open Costello workspace from your desktop, Start menu, or dock.", "ok");
  });

  registerWorker();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  var n = 0;
  var t = setInterval(function () {
    n += 1;
    init();
    if ((document.querySelector(".workspace-header") && document.querySelector("[data-lg-install]")) || n > 60) {
      clearInterval(t);
    }
  }, 50);
})();
