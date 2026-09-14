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
    list.textContent = lines.join(" · ");
  }

  function reviewCta(item, i) {
    if (item.ctaLabel) return item.ctaLabel;
    if (i !== 0) return "";
    if (/letter 1/i.test(item.title || "")) return "Review Letter 1";
    return "Review";
  }

  function isComplete(item) {
    return /complete|completed|done|received/i.test(item && item.status || "");
  }

  function renderInputs(items) {
    var list = document.getElementById("kitchen-input-list");
    if (!list || !items || !items.length) return;
    list.innerHTML = items.slice(0, 3).map(function (item, i) {
      var reserved = { "current-input": true, "questions": true };
      var id = item.id && !reserved[item.id] ? " id=\"" + esc(item.id) + "\"" : "";
      var mail = "mailto:luis@lgpractice.com?subject=" + encodeURIComponent(item.mailtoSubject || "Costello Kitchen");
      var why = item.why || "";
      if (item.attachmentNote && !/attach/i.test(why)) {
        why = (why ? why + " " : "") + "Send attachments by email or Teams.";
      }
      var time = item.timing || "";
      if (item.owner) time = time ? time + " · " + item.owner : item.owner;
      var done = isComplete(item);
      var primary = i === 0 && !done;
      var cta = !done && reviewCta(item, i);
      var action = "";
      if (!done) {
        action = cta
          ? "<a class=\"lg-go k-input-go\" href=\"#working-proof\">" + esc(cta) + "</a>"
          : "<a class=\"k-input-mail\" href=\"" + mail + "\">Reply by email</a>";
      }
      var cls = done ? "is-done" : (primary ? "is-primary" : "is-secondary");
      return "<li" + id + " class=\"" + cls + "\">" +
        "<strong>" + esc(item.title) + "</strong>" +
        (why ? "<span class=\"k-input-why\">" + esc(why) + "</span>" : "") +
        (time ? "<span class=\"k-input-time\">" + esc(time) + "</span>" : "") +
        action +
        "</li>";
    }).join("");
  }

  function groupProduction(items) {
    if (!items || items.length < 4) return items || [];
    var production = items.filter(function (item) { return /^production$/i.test(item.label); })[0];
    var printer = items.filter(function (item) { return /^printer$/i.test(item.label); })[0];
    var timing = items.filter(function (item) { return /^timing$/i.test(item.label); })[0];
    var record = items.filter(function (item) { return /^record$/i.test(item.label); })[0];
    if (!production || !printer || !timing || !record) return items;
    return [
      production,
      {
        label: "Printer + timing",
        value: printer.value,
        quote: printer.note,
        lead: timing.value,
        note: timing.note,
        linkLabel: printer.linkLabel,
        hrefKey: printer.hrefKey,
        href: printer.href
      },
      record
    ];
  }

  function renderProduction(state, items, sourceChanges) {
    var row = document.getElementById("production-list");
    if (!row || !items || !items.length) return;
    row.innerHTML = groupProduction(items).map(function (item) {
      var printer = /printer/i.test(item.label || "");
      var quote = "";
      if (item.quote) {
        var qlink = item.linkLabel && (item.hrefKey || item.href)
          ? " <a class=\"lg-doc-link\" href=\"" + esc(hrefFor(state, item)) + "\">" + esc(item.linkLabel) + "</a>"
          : "";
        quote = "<p class=\"k-prod-quote\">" + esc(item.quote) + qlink + "</p>";
      }
      var more = "";
      if (printer && (item.lead || item.note)) {
        more = "<div class=\"k-prod-more\">" +
          (item.lead ? "<p>" + esc(item.lead) + "</p>" : "") +
          (item.note ? "<p>" + esc(item.note) + "</p>" : "") +
          "</div>";
      }
      var note = !printer && item.note ? "<p>" + esc(item.note) + "</p>" : "";
      var link = !item.quote && item.linkLabel && (item.hrefKey || item.href)
        ? "<a class=\"lg-doc-link\" href=\"" + esc(hrefFor(state, item)) + "\">" + esc(item.linkLabel) + "</a>"
        : "";
      var source = "";
      if (/^record$/i.test(item.label) && sourceChanges) {
        source = "<p class=\"k-source-note\" id=\"source-changes\">" +
          esc(sourceChanges.label + " updated: " + sourceChanges.note) + "</p>";
      }
      return "<article>" +
        "<h3>" + esc(item.label) + "</h3>" +
        "<p class=\"k-prod-value\">" + esc(item.value) + "</p>" +
        quote +
        more +
        note +
        link +
        source +
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
    text("input-title", review.inputLabel);
    if (review.orientation) {
      text("orient-prompt", review.orientation.prompt);
      text("orient-label", review.orientation.label);
    }
    renderStatus(review.statusLines);
    renderInputs(review.inputs || []);
    renderProof(state, review.proof);
    renderProduction(state, review.production || [], review.sourceChanges);
    renderShaping(review.shaping);
    renderExplorations((state.kitchen && state.kitchen.explorations) || []);
    showArtifact((review.proof && review.proof.kind) || review.kind || "letter");
    document.body.setAttribute("data-kitchen-review", (state.kitchen && state.kitchen.activeReview) || "letter-1");
  }

  function renderShaping(shaping) {
    var list = document.getElementById("shaping-list");
    var title = document.getElementById("shape-title");
    if (!list || !shaping) return;
    if (title && shaping.label) title.textContent = shaping.label;
    list.innerHTML = (shaping.stages || []).map(function (step) {
      var open = /input|decision|pending|requested|not yet/i.test(
        [step.label, step.value, step.state].join(" ")
      );
      return "<li" + (open ? " class=\"is-open\"" : "") + "><b>" + esc(step.label) + "</b><span>" + esc(step.value) + "</span></li>";
    }).join("");
  }

  function renderExplorations(items) {
    var host = document.getElementById("explore-list");
    var first = items && items[0];
    if (!first) return;
    var heading = document.getElementById("anchor-heading") || document.getElementById("explore-heading");
    if (heading && first.headline) heading.textContent = first.headline;
    else if (heading && first.title) heading.textContent = first.title;
    var status = document.getElementById("anchor-status") || document.querySelector(".k-explore-status");
    if (status) {
      var statusText = first.statusLabel || first.note || "FOR REVIEW";
      status.innerHTML = "<i aria-hidden=\"true\"></i>" + esc(statusText);
    }
    var copy = document.getElementById("anchor-copy");
    if (copy && first.summary) copy.textContent = first.summary;
    var open = document.getElementById("anchor-open");
    if (open) {
      if (first.openHref && window.CostelloState) open.href = CostelloState.href(first.openHref);
      else if (first.openHref) open.href = first.openHref;
      open.setAttribute("target", "_blank");
      open.setAttribute("rel", "noopener noreferrer");
      if (first.openLabel) open.textContent = first.openLabel;
      open.setAttribute("aria-label", "Open Positioning Anchor in a new tab");
    }
    if (!host) return;
    host.innerHTML =
      "<div><dt>Source</dt><dd>" + esc(first.source) + "</dd></div>" +
      "<div><dt>Observation</dt><dd>" + esc(first.observation) + "</dd></div>" +
      "<div><dt>Working direction</dt><dd>" + esc(first.direction) + "</dd></div>" +
      "<div><dt>Implication</dt><dd>" + esc(first.implication) + "</dd></div>";
  }

  if (!window.CostelloState) return;
  CostelloState.load().then(render).catch(function () {});
})();
