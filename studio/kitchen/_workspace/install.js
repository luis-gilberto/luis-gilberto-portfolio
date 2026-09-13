(function () {
  var deferred = null;
  var installed = (window.matchMedia && (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: minimal-ui)").matches
  )) || window.navigator.standalone === true;

  function buttons() {
    return Array.prototype.slice.call(document.querySelectorAll("[data-lg-install]"));
  }

  function hint() {
    var el = document.getElementById("shortcut-hint");
    if (el) return el;
    el = document.createElement("p");
    el.id = "shortcut-hint";
    el.className = "lg-hint lg-install-hint";
    el.hidden = true;
    el.textContent = "Chrome or Edge can install this workspace as an app from the address bar, or use Menu → Apps → Install this site as an app. Safari: File → Add to Dock. The shortcut opens the workspace home. Copied section links still take you to the exact place.";
    var header = document.querySelector(".workspace-header");
    if (header && header.parentNode) header.insertAdjacentElement("afterend", el);
    else document.body.appendChild(el);
    return el;
  }

  function hide() {
    buttons().forEach(function (btn) { btn.hidden = true; });
    var el = document.getElementById("shortcut-hint");
    if (el) el.hidden = true;
  }

  function offer() {
    if (deferred && deferred.prompt) {
      deferred.prompt();
      return;
    }
    var el = hint();
    el.hidden = !el.hidden;
    if (!el.hidden) {
      el.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }

  function bind(btn) {
    if (!btn || btn.getAttribute("data-lg-bound") === "1") return;
    btn.setAttribute("data-lg-bound", "1");
    if (installed) {
      btn.hidden = true;
      return;
    }
    btn.addEventListener("click", offer);
  }

  function init() {
    buttons().forEach(bind);
  }

  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferred = e;
    buttons().forEach(function (btn) { btn.hidden = false; });
  });

  window.addEventListener("appinstalled", function () {
    deferred = null;
    installed = true;
    hide();
  });

  init();
  var n = 0;
  var t = setInterval(function () {
    n += 1;
    init();
    if (document.querySelector("[data-lg-install]") || n > 40) clearInterval(t);
  }, 50);
})();
