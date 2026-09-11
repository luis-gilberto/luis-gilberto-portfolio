(function () {
  var script = document.currentScript;
  var planId = script && script.getAttribute("data-plan");
  if (!planId) return;

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function fact(label, value) {
    if (!value) return "";
    return "<div><dt>" + escapeHtml(label) + "</dt><dd>" + escapeHtml(value) + "</dd></div>";
  }

  function spec(planId, state) {
    var website = (state && state.website) || {};
    var referral = (state && state.referralMailing) || {};
    var briefing = (state && state.briefing) || {};

    if (planId === "website") {
      return {
        title: "Website Launch Plan",
        facts: [
          fact("Contract", "SOW-01"),
          fact("Current state", website.contractStatus || website.overallStatus),
          fact("Clock begins", "Access Complete Date"),
          fact("Next client action", website.nextMove)
        ].join("")
      };
    }

    if (planId === "referral") {
      var dependency = (referral.openInputs && referral.openInputs.length)
        ? referral.openInputs.join(", ")
        : referral.mailingListStatus;
      return {
        title: "Referral Letter Campaign Plan",
        facts: [
          fact("Contract", "SOW-02"),
          fact("Current state", referral.reviewRound || referral.overallStatus),
          fact("Current dependency", dependency),
          fact("Next client action", briefing.nextOwner)
        ].join("")
      };
    }

    return null;
  }

  function filesHref() {
    return window.CostelloState
      ? CostelloState.href("kitchen/costello/files.html")
      : "/studio/kitchen/costello/files.html";
  }

  function ensureFonts() {
    if (document.querySelector("link[data-lg-plan-fonts]")) return;
    var fonts = document.createElement("link");
    fonts.rel = "stylesheet";
    fonts.setAttribute("data-lg-plan-fonts", "true");
    fonts.href = "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500&family=Libre+Baskerville:wght@400&display=swap";
    document.head.appendChild(fonts);
  }

  function render(state) {
    var model = spec(planId, state);
    if (!model) return;
    ensureFonts();

    var band = document.querySelector(".lg-plan-context");
    if (!band) {
      band = document.createElement("aside");
      band.className = "lg-plan-context";
      band.setAttribute("aria-label", "Workspace context");
      document.body.insertBefore(band, document.body.firstChild);
    }

    band.innerHTML =
      '<div class="lg-plan-context-inner">' +
        "<div>" +
          '<p class="lg-plan-context-kicker">LG Studio · Workspace</p>' +
          '<p class="lg-plan-context-title">' + escapeHtml(model.title) + "</p>" +
          '<a class="lg-plan-context-back" href="' + filesHref() + '">Return to Files</a>' +
        "</div>" +
        '<dl class="lg-plan-context-facts">' + model.facts + "</dl>" +
      "</div>";
  }

  render(null);
  if (window.CostelloState) {
    CostelloState.load().then(render).catch(function () { render(null); });
  }
})();
