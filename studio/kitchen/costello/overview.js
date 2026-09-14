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

  function isWorkspaceHref(href) {
    if (!href || href === "#") return true;
    if (href.charAt(0) === "#") return true;
    try {
      var path = href;
      if (/^https?:/i.test(href) && window.location) {
        var u = new URL(href, window.location.href);
        if (u.origin !== window.location.origin) return false;
        path = u.pathname + u.search + u.hash;
      }
      path = String(path).replace(/\\/g, "/");
      return /\/kitchen\/costello\/?$|\/kitchen\/costello\/index\.html|\/kitchen\/costello\/files\.html|\/kitchen\/costello\/reference\.html|\/kitchen\/costello\/brand\.html|\/kitchen\/costello\/mailing\.html|\/kitchen\/costello-review(\/|$)|\/Costello_Control\.html/i.test(path)
        || /(^|\/)(files|reference|mailing|brand)\.html/i.test(path)
        || /(^|\/)costello-review(\/|$)/i.test(path);
    } catch (err) {
      return false;
    }
  }

  function renderAttention(state, items) {
    var list = document.getElementById("next-input-list");
    if (!list || !items || !items.length) return;
    list.innerHTML = items.slice(0, 5).map(function (item, i) {
      var id = item.id ? " id=\"" + esc(item.id) + "\"" : "";
      var href = hrefFor(state, item);
      var label = item.ctaLabel || item.title;
      var openSep = item.openSeparately === true || (href && href !== "#" && !isWorkspaceHref(href) && !item.hrefKey);
      var title;
      if (href && href !== "#") {
        if (openSep) {
          title = "<a class=\"lg-doc-link\" href=\"" + esc(href) + "\" target=\"_blank\" rel=\"noopener noreferrer\" aria-label=\"Open " + esc(item.title) + " in a new tab\"><strong>" + esc(label) + "</strong></a>";
        } else {
          title = "<a class=\"lg-doc-link\" data-lg-nav=\"workspace\" href=\"" + esc(href) + "\"><strong>" + esc(item.title) + "</strong></a>";
        }
      } else {
        title = "<strong>" + esc(item.title) + "</strong>";
      }
      return "<li" + id + ">" +
        "<b class=\"lg-brief-num\" aria-hidden=\"true\">" + pad(i + 1) + "</b>" +
        "<div>" + title +
        (item.attention ? "<em class=\"lg-brief-attn\">" + esc(item.attention) + "</em>" : "") +
        "<span>" + esc(item.why) + "</span>" +
        (item.timing ? "<em>" + esc(item.timing) + "</em>" : "") +
        "</div></li>";
    }).join("");
  }

  function renderStreams(items) {
    var row = document.getElementById("workstream-list");
    if (!row || !items || !items.length) return;
    row.innerHTML = items.map(function (item) {
      var quiet = /working direction|exploration|for reference/i.test(item.state || "") ? " is-quiet" : "";
      return "<article id=\"" + esc(item.id) + "\">" +
        "<p>" + esc(item.label) + "</p>" +
        "<h3>" + esc(item.phase) + "</h3>" +
        "<p class=\"lg-brief-status" + quiet + "\"><i aria-hidden=\"true\"></i>" + esc(item.state) + "</p>" +
        "<p>" + esc(item.change) + "</p>" +
        (item.next ? "<p class=\"lg-brief-ops\">" + esc(item.next) + "</p>" : "") +
        "</article>";
    }).join("");
  }

  function renderMovement(items) {
    var list = document.getElementById("verified-list");
    if (!list || !items || !items.length) return;
    list.innerHTML = items.map(function (item) {
      if (typeof item === "string") return "<li>" + esc(item) + "</li>";
      return "<li><time>" + esc(item.date) + "</time><span>" + esc(item.title) +
        (item.note ? ". " + esc(item.note) : "") + "</span></li>";
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
