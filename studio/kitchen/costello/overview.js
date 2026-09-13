(function () {
  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch];
    });
  }

  function text(id, value) {
    var el = document.getElementById(id);
    if (el && value) el.textContent = value;
  }

  function hrefFor(state, item) {
    if (!item) return "#";
    if (item.hrefKey && window.CostelloState) return CostelloState.url(state, item.hrefKey);
    if (item.ctaKey && window.CostelloState) return CostelloState.url(state, item.ctaKey);
    if (item.ctaHref && window.CostelloState) return CostelloState.href(item.ctaHref);
    if (item.href && item.href.charAt(0) === "#") return item.href;
    if (item.href && window.CostelloState && /^(kitchen\/|capabilities\/)/.test(item.href)) {
      return CostelloState.href(item.href);
    }
    return item.href || "#";
  }

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function renderPrimary(state, action) {
    if (!action) return;
    text("primary-eyebrow-label", action.eyebrow);
    text("primary-headline", action.headline);
    text("primary-context", action.context);
    text("primary-meta", action.meta);
    var cta = document.getElementById("mail-cta");
    if (cta) {
      cta.textContent = action.ctaLabel || "Open";
      cta.href = hrefFor(state, action);
    }
  }

  function renderInputs(items) {
    var list = document.getElementById("next-input-list");
    if (!list || !items || !items.length) return;
    list.innerHTML = items.slice(0, 4).map(function (item, i) {
      var id = i === 3 ? ' id="website-source-materials"' : "";
      return "<li" + id + ">" +
        "<b class=\"lg-brief-num\" aria-hidden=\"true\">" + pad(i + 1) + "</b>" +
        "<div><strong>" + esc(item.title) + "</strong>" +
        "<span>" + esc(item.why) + "</span>" +
        "<em>" + esc(item.timing) + "</em></div></li>";
    }).join("");
  }

  function renderNow(state, items) {
    var row = document.getElementById("right-now-row");
    if (!row || !items || !items.length) return;
    row.innerHTML = items.map(function (item, i) {
      return "<article id=\"" + esc(item.id) + "\">" +
        "<b class=\"lg-brief-num\" aria-hidden=\"true\">" + pad(i + 1) + "</b>" +
        "<h3>" + esc(item.label) + "</h3>" +
        "<p class=\"lg-brief-status\"><i aria-hidden=\"true\"></i>" + esc(item.status) + "</p>" +
        "<p>" + esc(item.note) + "</p></article>";
    }).join("");
  }

  function renderEngagements(items) {
    var grid = document.getElementById("engagement-grid");
    if (!grid || !items || !items.length) return;
    grid.innerHTML = items.map(function (item) {
      return "<article" + (item.id ? " id=\"" + esc(item.id) + "\"" : "") + ">" +
        "<div class=\"lg-brief-engage-top\">" +
        "<p>" + esc(item.kicker) + "</p>" +
        "<p class=\"lg-brief-status\"><i aria-hidden=\"true\"></i>" + esc(item.status) + "</p>" +
        "</div>" +
        "<h3>" + esc(item.title) + "</h3>" +
        "<p>" + esc(item.scope) + "</p>" +
        "<p>" + esc(item.next) + "</p>" +
        "<a href=\"" + esc(item.href) + "\">" + esc(item.link) + "</a></article>";
    }).join("");
  }

  function renderVerified(items) {
    var list = document.getElementById("verified-list");
    if (!list || !items || !items.length) return;
    list.innerHTML = items.slice(0, 3).map(function (item) {
      return "<li>" + esc(item) + "</li>";
    }).join("");
  }

  function renderDeeper(state, items) {
    var list = document.getElementById("deeper-list");
    if (!list || !items || !items.length) return;
    list.innerHTML = items.map(function (item) {
      return "<li><a href=\"" + esc(hrefFor(state, item)) + "\">" +
        "<div><strong>" + esc(item.title) + "</strong><span>" + esc(item.note) + "</span></div>" +
        "<i aria-hidden=\"true\">→</i></a></li>";
    }).join("");
  }

  function apply(state) {
    var overview = (state && state.overview) || {};
    var action = (overview.actions || {})[overview.activePrimaryAction] || null;
    if (state && state.meta && state.meta.lastUpdatedLabel) {
      document.body.setAttribute(
        "data-lg-mode",
        overview.programLine || document.body.getAttribute("data-lg-mode") || ""
      );
    }
    renderPrimary(state, action);
    renderInputs(overview.nextInputs);
    renderNow(state, overview.rightNow);
    renderEngagements(overview.engagements);
    renderVerified(overview.recentlyVerified);
    renderDeeper(state, overview.goDeeper);

    var quote = window.CostelloState ? CostelloState.url(state, "connectQuote") : null;
    document.querySelectorAll("[data-quote]").forEach(function (el) {
      if (quote) el.href = quote;
    });
    var webPlan = document.getElementById("plans-web");
    var refPlan = document.getElementById("plans-ref");
    if (webPlan) webPlan.href = "files.html#plans";
    if (refPlan && window.CostelloState) refPlan.href = CostelloState.href("kitchen/costello/plans/costello-referral-letter-campaign-plan.html");
  }

  if (!window.CostelloState) return;
  CostelloState.load().then(apply).catch(function () {});
})();
