(function () {
  var SW_URL = "/studio/kitchen/sw.js";
  var SW_SCOPE = "/studio/kitchen/";
  var deferred = null;
  var installed = (window.matchMedia && (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: minimal-ui)").matches
  )) || window.navigator.standalone === true;

  function registerWorker() {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register(SW_URL, { scope: SW_SCOPE, updateViaCache: "none" }).catch(function () {});
  }

  function buttons() {
    return Array.prototype.slice.call(document.querySelectorAll("[data-lg-install]"));
  }

  function labelButtons() {
    buttons().forEach(function (btn) {
      if ((btn.textContent || "").trim()) btn.textContent = "Install to Desktop";
      if (!btn.getAttribute("aria-label")) btn.setAttribute("aria-label", "Install to Desktop");
    });
  }

  function hint() {
    var el = document.getElementById("shortcut-hint");
    if (el) return el;
    el = document.createElement("p");
    el.id = "shortcut-hint";
    el.className = "lg-hint lg-install-hint";
    el.hidden = true;
    var header = document.querySelector(".workspace-header");
    if (header && header.parentNode) header.insertAdjacentElement("afterend", el);
    else document.body.appendChild(el);
    return el;
  }

  function setHint(text, show) {
    var el = hint();
    el.textContent = text;
    el.hidden = !show;
    if (show) el.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  function guidanceText() {
    if (installed) {
      return "This workspace is already installed as an app on this device. Open it from your desktop, Start menu, or dock.";
    }
    if (!("BeforeInstallPromptEvent" in window) && !deferred) {
      var ua = navigator.userAgent || "";
      if (/Safari/i.test(ua) && !/Chrome|CriOS|Edg/i.test(ua)) {
        return "Safari does not support one-click install here. Use File → Add to Dock (or Share → Add to Home Screen on iOS). The shortcut opens the workspace home.";
      }
      return "Chrome or Edge can install this workspace when the site qualifies. Use the address-bar install icon, or Menu → Apps → Install this site as an app. If that option is missing, the browser has not offered installation yet.";
    }
    return "Chrome or Edge can install this workspace as an app from the address bar, or use Menu → Apps → Install this site as an app. Safari: File → Add to Dock.";
  }

  function offer() {
    if (installed) {
      setHint(guidanceText(), true);
      return;
    }
    if (deferred && typeof deferred.prompt === "function") {
      deferred.prompt();
      if (deferred.userChoice) {
        deferred.userChoice.then(function (choice) {
          if (!choice || choice.outcome !== "accepted") {
            setHint("Installation was not completed. You can try again from this control or from the browser’s install menu.", true);
          }
        }).catch(function () {});
      }
      return;
    }
    setHint(guidanceText(), true);
  }

  function bind(btn) {
    if (!btn || btn.getAttribute("data-lg-bound") === "1") return;
    btn.setAttribute("data-lg-bound", "1");
    btn.hidden = false;
    btn.addEventListener("click", offer);
  }

  function init() {
    labelButtons();
    buttons().forEach(bind);
  }

  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferred = e;
    installed = false;
    buttons().forEach(function (btn) { btn.hidden = false; });
    var el = document.getElementById("shortcut-hint");
    if (el) el.hidden = true;
  });

  window.addEventListener("appinstalled", function () {
    deferred = null;
    installed = true;
    setHint("Installed. Open Costello workspace from your desktop, Start menu, or dock.", true);
  });

  registerWorker();
  init();
  var n = 0;
  var t = setInterval(function () {
    n += 1;
    init();
    if (document.querySelector("[data-lg-install]") || n > 40) clearInterval(t);
  }, 50);
})();
