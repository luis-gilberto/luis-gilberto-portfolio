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

  function renderState(block) {
    if (!block) return;
    text("primary-eyebrow-label", block.eyebrow);
    text("primary-headline", block.headline);
    text("primary-context", block.lede);
  }

  function renderAttention(state, items) {
    var list = document.getElementById("next-input-list");
    if (!list || !items || !items.length) return;
    list.innerHTML = items.slice(0, 3).map(function (item, i) {
      var id = item.id === "website-source-materials" ? " id=\"website-source-materials\"" : "";
      var href = hrefFor(state, item);
      var title = href && href !== "#"
        ? "<a href=\"" + esc(href) + "\"><strong>" + esc(item.title) + "</strong></a>"
        : "<strong>" + esc(item.title) + "</strong>";
      return "<li" + id + ">" +
        "<b class=\"lg-brief-num\" aria-hidden=\"true\">" + pad(i + 1) + "</b>" +
        "<div>" + title +
        "<span>" + esc(item.why) + "</span>" +
        "<em>" + esc(item.attention ? item.attention + " · " + item.timing : item.timing) + "</em></div></li>";
    }).join("");
  }

  function renderStreams(items) {
    var row = document.getElementById("workstream-list");
    if (!row || !items || !items.length) return;
    row.innerHTML = items.map(function (item) {
      var quiet = /working direction|exploration|for reference/i.test(item.state || "") ? " is-quiet" : "";
      return "<article id=\"" + esc(item.id) + "\">" +
        "<p>" + esc(item.label) + "</p>" +
        "<p class=\"lg-brief-status" + quiet + "\"><i aria-hidden=\"true\"></i>" + esc(item.state) + "</p>" +
        "<h3>" + esc(item.phase) + "</h3>" +
        "<p>" + esc(item.change) + "</p>" +
        "<p>" + esc(item.next) + "</p></article>";
    }).join("");
  }

  function renderMovement(items) {
    var list = document.getElementById("verified-list");
    if (!list || !items || !items.length) return;
    list.innerHTML = items.map(function (item) {
      if (typeof item === "string") return "<li>" + esc(item) + "</li>";
      return "<li><strong>" + esc(item.date) + "</strong> " + esc(item.title) +
        (item.note ? " " + esc(item.note) : "") + "</li>";
    }).join("");
  }

  function renderUpcoming(items) {
    var list = document.getElementById("upcoming-list");
    if (!list || !items || !items.length) return;
    list.innerHTML = items.map(function (item) {
      return "<li><strong>" + esc(item.title) + "</strong><span>" + esc(item.note) + "</span></li>";
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
    if (overview.programLine) {
      document.body.setAttribute("data-lg-mode", overview.programLine);
      var mode = document.querySelector(".context-mode");
      if (mode) mode.innerHTML = "<i></i>" + overview.programLine;
    }
    renderState(overview.currentState);
    renderAttention(state, overview.needsAttention);
    renderStreams(overview.workstreams);
    renderMovement(overview.recentMovement);
    renderUpcoming(overview.upcoming);
    renderDeeper(state, overview.goDeeper);
    if (state && state.operatingModel && state.operatingModel.note) {
      text("how-we-work", state.operatingModel.note);
    }
  }

  if (!window.CostelloState) return;
  CostelloState.load().then(apply).catch(function () {});
})();
