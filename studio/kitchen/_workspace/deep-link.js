(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function headerOffset() {
    var header = document.querySelector(".workspace-header");
    return (header ? header.offsetHeight : 0) + 18;
  }

  function section(id) {
    if (!id) return null;
    return document.getElementById(id);
  }

  function focusTarget(el) {
    if (!el) return;
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  }

  function openAncestors(el) {
    var node = el;
    while (node && node !== document.body) {
      if (node.tagName === "DETAILS") node.open = true;
      node = node.parentElement;
    }
  }

  function scrollToId(id, update) {
    var el = section(id);
    if (!el) return false;
    if (el.hasAttribute("hidden") && el.parentElement) el = el.parentElement;
    openAncestors(el);
    el.style.scrollMarginTop = headerOffset() + "px";
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    focusTarget(el);
    if (update) {
      var next = "#" + id;
      if (location.hash !== next) history.pushState({ lgHash: id }, "", next);
    }
    return true;
  }

  function currentUrl(id) {
    return location.origin + location.pathname + location.search + (id ? "#" + id : "");
  }

  function flash(btn) {
    if (!btn) return;
    var prev = btn.textContent;
    btn.classList.add("is-done");
    btn.textContent = "Link copied";
    setTimeout(function () {
      btn.classList.remove("is-done");
      btn.textContent = prev;
    }, 1600);
  }

  function copyId(id, btn) {
    var url = currentUrl(id);
    var done = function () { flash(btn); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done).catch(function () {
        window.prompt("Copy link", url);
      });
    } else {
      window.prompt("Copy link", url);
    }
  }

  function fromHash(retries) {
    var id = (location.hash || "").replace(/^#/, "");
    if (!id) return;
    if (scrollToId(id, false)) return;
    if (retries == null) retries = 24;
    if (retries > 0) setTimeout(function () { fromHash(retries - 1); }, 80);
  }

  function bind() {
    document.addEventListener("click", function (e) {
      var copy = e.target.closest("[data-copy]");
      if (copy) {
        e.preventDefault();
        copyId(copy.getAttribute("data-copy"), copy);
        return;
      }
      var jump = e.target.closest('a[href^="#"]');
      if (!jump || jump.getAttribute("href") === "#") return;
      var id = jump.getAttribute("href").slice(1);
      if (!section(id)) return;
      e.preventDefault();
      scrollToId(id, true);
    });

    window.addEventListener("hashchange", fromHash);
    window.addEventListener("popstate", fromHash);

    document.querySelectorAll("details.lg-more").forEach(function (box) {
      var sum = box.querySelector("summary");
      if (sum && !sum.hasAttribute("aria-expanded")) sum.setAttribute("aria-expanded", box.open ? "true" : "false");
      box.addEventListener("toggle", function () {
        if (sum) sum.setAttribute("aria-expanded", box.open ? "true" : "false");
      });
    });
  }

  function waitForHeader(fn) {
    if (document.querySelector(".workspace-header")) {
      fn();
      return;
    }
    var n = 0;
    var t = setInterval(function () {
      n += 1;
      if (document.querySelector(".workspace-header") || n > 40) {
        clearInterval(t);
        fn();
      }
    }, 50);
  }

  bind();
  waitForHeader(function () {
    if (location.hash) setTimeout(fromHash, 40);
  });

  window.LGDeepLink = {
    scrollToId: scrollToId,
    copyId: copyId,
    currentUrl: currentUrl
  };
})();
