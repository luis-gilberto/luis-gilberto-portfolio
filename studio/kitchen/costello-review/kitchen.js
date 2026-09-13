(function () {
  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch];
    });
  }

  function text(id, value) {
    var el = document.getElementById(id);
    if (el && value != null && value !== "") el.textContent = value;
  }

  function hrefFor(state, item) {
    if (!item) return "#";
    if (item.hrefKey && window.CostelloState) return CostelloState.url(state, item.hrefKey);
    if (item.href && window.CostelloState) return CostelloState.href(item.href);
    if (item.openHref && window.CostelloState) return CostelloState.href(item.openHref);
    if (item.downloadHref && window.CostelloState) return CostelloState.href(item.downloadHref);
    return item.href || item.openHref || item.downloadHref || "#";
  }

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function reviewFrom(state) {
    var kitchen = (state && state.kitchen) || {};
    var reviews = kitchen.reviews || {};
    var id = kitchen.activeReview || "letter-1";
    return reviews[id] || reviews["letter-1"] || null;
  }

  function setContext(review) {
    if (!review || !review.contextMode) return;
    document.body.setAttribute("data-lg-mode", review.contextMode);
    var mode = document.querySelector(".context-mode");
    if (mode) mode.innerHTML = "<i></i>" + esc(review.contextMode);
  }

  function showArtifact(kind) {
    document.querySelectorAll("[data-kitchen-artifact]").forEach(function (el) {
      el.hidden = el.getAttribute("data-kitchen-artifact") !== kind;
    });
  }

  function renderStatus(lines) {
    var list = document.getElementById("current-status-list");
    if (!list || !lines || !lines.length) return;
    list.innerHTML = lines.map(function (line) {
      return "<li>" + esc(line) + "</li>";
    }).join("");
  }

  function renderInputs(items) {
    var list = document.getElementById("kitchen-input-list");
    if (!list || !items || !items.length) return;
    list.innerHTML = items.slice(0, 3).map(function (item, i) {
      var reserved = { "current-input": true, "questions": true };
      var id = item.id && !reserved[item.id] ? " id=\"" + esc(item.id) + "\"" : "";
      var mail = "mailto:luis@lgpractice.com?subject=" + encodeURIComponent(item.mailtoSubject || "Costello Kitchen");
      var copyId = item.id || "current-input";
      var attach = item.attachmentNote
        ? "<p class=\"k-attach\">" + esc(item.attachmentNote) + "</p>"
        : "";
      var owner = item.owner
        ? "<p class=\"k-owner\">Owner · " + esc(item.owner) + "</p>"
        : "";
      return "<li" + id + ">" +
        "<b class=\"k-num\" aria-hidden=\"true\">" + pad(i + 1) + "</b>" +
        "<div>" +
          "<div class=\"k-input-head\">" +
            "<strong>" + esc(item.title) + "</strong>" +
            (item.status ? "<em>" + esc(item.status) + "</em>" : "") +
          "</div>" +
          "<span>" + esc(item.why) + "</span>" +
          "<p class=\"k-timing\">" + esc(item.timing) + "</p>" +
          owner +
          "<div class=\"lg-respond\">" +
            "<a href=\"" + mail + "\">Reply by email</a>" +
            "<button type=\"button\" class=\"lg-copy\" data-copy=\"" + esc(copyId) + "\" data-copy-quiet aria-label=\"Copy section link\">" +
              "<svg viewBox=\"0 0 16 16\" aria-hidden=\"true\" focusable=\"false\"><path fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.4\" d=\"M6.2 9.8 4.4 11.6a2.1 2.1 0 1 1-3-3l2.2-2.2a2.1 2.1 0 0 1 3 0M9.8 6.2l1.8-1.8a2.1 2.1 0 1 1 3 3L12.4 9.6a2.1 2.1 0 0 1-3 0M6.4 9.6l3.2-3.2\"/></svg>" +
            "</button>" +
          "</div>" +
          attach +
        "</div></li>";
    }).join("");
  }

  function renderProduction(state, items) {
    var row = document.getElementById("production-list");
    if (!row || !items || !items.length) return;
    row.innerHTML = items.map(function (item, i) {
      var link = item.linkLabel && (item.hrefKey || item.href)
        ? "<a href=\"" + esc(hrefFor(state, item)) + "\">" + esc(item.linkLabel) + "</a>"
        : "";
      return "<article>" +
        "<b class=\"k-num\" aria-hidden=\"true\">" + pad(i + 1) + "</b>" +
        "<h3>" + esc(item.label) + "</h3>" +
        "<p class=\"k-prod-value\">" + esc(item.value) + "</p>" +
        (item.note ? "<p>" + esc(item.note) + "</p>" : "") +
        link +
        "</article>";
    }).join("");
  }

  function renderProof(state, proof) {
    if (!proof) return;
    text("proof-status", proof.statusLabel);
    text("proof-caption", proof.caption);
    text("proof-meta", proof.meta);
    text("proof-note", proof.note);
    text("artifact-fallback-title", proof.statusLabel);
    text("artifact-fallback-meta", proof.meta);
    var open = document.getElementById("proof-open");
    if (open) {
      open.textContent = proof.openLabel || "Open full proof";
      open.href = hrefFor(state, proof);
    }
    var download = document.getElementById("proof-download");
    if (download) {
      if (proof.downloadHref) {
        download.hidden = false;
        download.textContent = proof.downloadLabel || "Download PDF";
        download.href = CostelloState.href(proof.downloadHref);
      } else {
        download.hidden = true;
      }
    }
    var fallback = document.getElementById("artifact-fallback-cta");
    if (fallback) {
      fallback.textContent = proof.openLabel || "Open";
      fallback.href = hrefFor(state, proof);
    }
  }

  function render(state) {
    var review = reviewFrom(state);
    if (!review) return;
    setContext(review);
    text("review-eyebrow", review.eyebrow);
    text("review-title", review.title);
    text("review-lede", review.lede);
    text("status-label", review.statusLabel);
    text("input-title", review.inputLabel);
    if (review.orientation) {
      text("orient-prompt", review.orientation.prompt);
      text("orient-label", review.orientation.label);
    }
    renderStatus(review.statusLines);
    renderInputs(review.inputs || []);
    renderProof(state, review.proof);
    renderProduction(state, review.production || []);
    showArtifact((review.proof && review.proof.kind) || review.kind || "letter");
    document.body.setAttribute("data-kitchen-review", (state.kitchen && state.kitchen.activeReview) || "letter-1");
  }

  if (!window.CostelloState) return;
  CostelloState.load().then(render).catch(function () {});
})();
