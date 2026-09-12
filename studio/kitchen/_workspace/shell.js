(function () {
  var page = document.body.getAttribute("data-lg-page") || "overview";
  var mode = document.body.getAttribute("data-lg-mode") || "";

  function logoSrc() {
    if (window.CostelloState) return CostelloState.href("brand-system/assets/lockup-full.png");
    return "/studio/brand-system/assets/lockup-full.png";
  }

  function links(state) {
    var url = window.CostelloState && state
      ? function (key) { return CostelloState.url(state, key); }
      : function (key) {
        var map = {
          overview: "kitchen/costello/",
          kitchen: "kitchen/costello-review/",
          brand: "kitchen/costello/brand.html",
          brandSystem: "capabilities/costello/Costello_Brand_Portal_Elevated.html",
          files: "kitchen/costello/files.html"
        };
        return window.CostelloState ? CostelloState.href(map[key]) : "/" + map[key];
      };
    return [
      { id: "overview", label: "Overview", href: url("overview") },
      { id: "kitchen", label: "Kitchen", href: url("kitchen") },
      { id: "brand", label: "Brand", href: url("brand") },
      { id: "files", label: "Files", href: url("files") }
    ];
  }

  function navHtml(items) {
    return items.map(function (item) {
      var current = item.id === page ? ' aria-current="page"' : "";
      return "<a href=\"" + item.href + "\"" + current + ">" + item.label + "</a>";
    }).join("");
  }

  function mount(state) {
    var items = links(state);
    var updated = state && state.meta && state.meta.lastUpdatedLabel
      ? "Last updated · " + state.meta.lastUpdatedLabel
      : "";
    var header = document.createElement("header");
    header.className = "workspace-header lg-shell";
    header.innerHTML =
      '<div class="brand-band">' +
        '<div class="content-width brand-band-inner">' +
          '<span class="logo-crop"><img src="' + logoSrc() + '" alt="LG Studio" width="156" height="112" decoding="async"></span>' +
          '<span class="product-pipe" aria-hidden="true"></span>' +
          '<span class="product-name">workspace</span>' +
        "</div>" +
      "</div>" +
      '<div class="client-band">' +
        '<div class="content-width client-band-inner">' +
          '<p class="client-label">Costello Law Firm workspace</p>' +
          '<nav class="workspace-nav" aria-label="Workspace">' + navHtml(items) + "</nav>" +
        "</div>" +
      "</div>" +
      '<div class="context-band">' +
        '<div class="content-width context-band-inner">' +
          (mode ? '<p class="context-mode"><i></i>' + mode + "</p>" : '<p class="context-mode"></p>') +
          (updated ? '<p class="context-updated">' + updated + "</p>" : "") +
        "</div>" +
      "</div>";

    var first = document.body.firstElementChild;
    if (first && (first.classList.contains("grain") || first.classList.contains("lg-grain"))) {
      first.insertAdjacentElement("afterend", header);
    } else {
      document.body.insertBefore(header, document.body.firstChild);
    }

    if (!document.querySelector(".lg-foot")) {
      var foot = document.createElement("footer");
      foot.className = "lg-foot";
      foot.innerHTML =
        "<p>Prepared by LG Studio for Costello Law Firm</p>" +
        "<p>LG Studio workspace · Costello artifacts remain their own</p>";
      document.body.appendChild(foot);
    }
  }

  if (window.CostelloState) {
    CostelloState.load().then(mount).catch(function () { mount(null); });
  } else {
    mount(null);
  }
})();
