(function (root) {
  function studioRoot() {
    var path = (location.pathname || "/").replace(/\\/g, "/");
    var idx = path.indexOf("/studio/");
    if (idx >= 0) return path.slice(0, idx + 8);
    return "/";
  }

  function href(rel) {
    if (!rel) return "#";
    return studioRoot() + String(rel).replace(/^\//, "");
  }

  function jsonUrl() {
    var script = document.currentScript;
    if (script && script.src) {
      return script.src.replace(/costello-project-state\.js(?:\?.*)?$/, "costello-project-state.json");
    }
    return href("capabilities/costello/data/costello-project-state.json");
  }

  function load() {
    return fetch(jsonUrl(), { cache: "no-store" }).then(function (res) {
      if (!res.ok) throw new Error("Costello project state could not be loaded.");
      return res.json();
    });
  }

  root.CostelloState = {
    load: load,
    href: href,
    studioRoot: studioRoot,
    url: function (state, key) {
      var urls = (state && state.urls) || {};
      if (key === "kitchen" && state && state.referralMailing && state.referralMailing.kitchenUrl) {
        return href(state.referralMailing.kitchenUrl);
      }
      if (key === "overview") return href(urls.overview || urls.status);
      if (key === "brand") return href(urls.brand || urls.brandSystem);
      return href(urls[key]);
    }
  };
})(window);
