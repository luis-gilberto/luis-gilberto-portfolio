(function () {
  var page = document.body.getAttribute("data-lg-page") || "overview";
  var mode = document.body.getAttribute("data-lg-mode") || "";

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
      return '<a class="' + (item.id === page ? "is-here" : "") + '" href="' + item.href + '">' + item.label + "</a>";
    }).join("");
  }

  function mount(state) {
    var items = links(state);
    var updated = state && state.meta && state.meta.lastUpdatedLabel
      ? "Last updated · " + state.meta.lastUpdatedLabel
      : "";
    var header = document.createElement("header");
    header.className = "lg-shell";
    header.innerHTML =
      '<div class="lg-shell-wrap">' +
        '<div class="lg-shell-top">' +
          '<p class="lg-id">LG Studio<em>Client Workspace</em></p>' +
          '<p class="lg-conf">Confidential</p>' +
        "</div>" +
        '<div class="lg-shell-mid">' +
          '<p class="lg-account"><strong>Costello Law Firm</strong><span>Client account</span></p>' +
          '<nav class="lg-nav" aria-label="Workspace">' + navHtml(items) + "</nav>" +
          '<button class="lg-menu" type="button" aria-expanded="false">Menu</button>' +
        "</div>" +
        '<div class="lg-modebar">' +
          (mode ? '<p class="lg-mode">' + mode + "</p>" : "<p class=\"lg-mode\"></p>") +
          (updated ? '<p class="lg-updated">' + updated + "</p>" : "") +
        "</div>" +
        '<div class="lg-drawer" hidden>' + navHtml(items) + "</div>" +
      "</div>";

    var first = document.body.firstElementChild;
    if (first && (first.classList.contains("grain") || first.classList.contains("lg-grain"))) {
      first.insertAdjacentElement("afterend", header);
    } else {
      document.body.insertBefore(header, document.body.firstChild);
    }

    var btn = header.querySelector(".lg-menu");
    var drawer = header.querySelector(".lg-drawer");
    btn.addEventListener("click", function () {
      var open = header.classList.toggle("is-open");
      drawer.hidden = !open;
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.textContent = open ? "Close" : "Menu";
    });

    if (!document.querySelector(".lg-foot")) {
      var foot = document.createElement("footer");
      foot.className = "lg-foot lg-wrap";
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
