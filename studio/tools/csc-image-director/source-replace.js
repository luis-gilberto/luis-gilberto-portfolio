/* CSC Image Director — Source Replacement */
(() => {
  const INDEX_URL = "/studio/case-studies/criar-sin-culpas/csc-asset-index.json";
  const LIST_URL = "/__csc_director/list-dir";
  const REGISTER_URL = "/__csc_director/register-asset";
  const ALLOWED_ROOTS = [
    "studio/lg-studio-portfolio/assets/criar-sin-culpas",
    "studio/case-studies/criar-sin-culpas/evidence",
    "nari-method-prod/assets",
  ];

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  let assetIndex = [];
  let candidate = null;
  let compareBp = "desktop";
  let browsePath = ALLOWED_ROOTS[0];

  function D() {
    return window.CscDirector;
  }

  function toast(msg) {
    D()?.toast?.(msg);
  }

  function assetPreviewUrl(a) {
    if (!a) return "";
    if (a.remoteUrl) return a.remoteUrl;
    if (a.path) return "/" + String(a.path).replace(/^\/+/, "");
    return "";
  }

  function refFromAsset(a) {
    return {
      path: a.path || null,
      remoteUrl: a.remoteUrl || null,
      originalPath: a.originalPath || null,
      document: a.document || null,
      url: a.url || a.remoteUrl || null,
      family: a.family || null,
      type: a.type || (a.remoteUrl ? "remote" : "local"),
      filename: a.filename,
    };
  }

  function refFromUrl(url) {
    return {
      path: null,
      remoteUrl: url,
      originalPath: null,
      document: "Remote / Cloudinary project asset",
      url,
      family: null,
      type: url.includes("cloudinary") ? "cloudinary" : "remote",
      filename: url.split("/").pop().split("?")[0],
    };
  }

  async function loadIndex() {
    const res = await fetch(INDEX_URL + "?t=" + Date.now(), { cache: "no-store" });
    if (!res.ok) throw new Error("asset index missing");
    const data = await res.json();
    assetIndex = data.assets || [];
  }

  function filteredAssets(inst) {
    const filter = $("#picker-filter").value;
    const q = ($("#picker-search").value || "").trim().toLowerCase();
    return assetIndex.filter((a) => {
      if (filter !== "ALL") {
        const bucket = a.pickerBucket || a.classification || "";
        if (filter === "CURRENT CANONICAL") {
          if (!["CURRENT CANONICAL", "PHOTOGRAPHY", "ILLUSTRATION", "SCREENSHOTS", "DOCUMENTS"].includes(bucket) &&
              a.classification !== "CURRENT CANONICAL") return false;
          if (["HISTORICAL", "STRATEGYIQ / LG", "UNKNOWN"].includes(bucket) && a.classification !== "CURRENT CANONICAL") {
            // allow CURRENT CANONICAL classification
          }
        } else if (bucket !== filter && a.classification !== filter) {
          return false;
        }
      }
      if (!q) return true;
      const hay = [a.filename, a.path, a.remoteUrl, a.document, a.family, a.originalPath, a.classification, a.kind]
        .filter(Boolean).join(" ").toLowerCase();
      return hay.includes(q);
    });
  }

  function renderPickerList(inst) {
    const list = $("#picker-list");
    list.innerHTML = "";
    const items = filteredAssets(inst);
    // Promote original of current derivative
    const cur = inst.workingSource || inst.approvedSource || {};
    if (cur.originalPath) {
      const orig = assetIndex.find((a) => a.path === cur.originalPath);
      if (orig) {
        items.sort((a, b) => (a.path === cur.originalPath ? -1 : b.path === cur.originalPath ? 1 : 0));
      }
    }
    for (const a of items.slice(0, 400)) {
      const li = document.createElement("li");
      const used = (a.usedBy || []).length;
      li.innerHTML = `
        <img src="${assetPreviewUrl(a)}" alt="" loading="lazy" />
        <div>
          <div class="rail__name">${a.filename}</div>
          <div class="rail__sub">
            ${a.kind || "—"} · ${a.pickerBucket || a.classification || "—"}
            ${used ? ` · used ×${used}` : ""}
            ${a.width ? `<br/>${a.width}×${a.height}` : ""}
            <br/>${a.path || a.remoteUrl || ""}
            ${a.originalPath ? `<br/>ORIGINAL: ${a.originalPath}` : ""}
          </div>
        </div>`;
      li.addEventListener("click", () => selectCandidate(inst, refFromAsset(a), a));
      list.appendChild(li);
    }
  }

  function renderOriginalBanner(inst) {
    const el = $("#picker-original");
    const cur = inst.approvedSource || inst.source || {};
    const deriv = cur.path || cur.remoteUrl || "";
    const orig = cur.originalPath;
    if (!orig) {
      el.hidden = true;
      return;
    }
    el.hidden = false;
    el.innerHTML = `<strong>CURRENT may be a derivative</strong><br/>CURRENT: ${deriv}<br/>ORIGINAL SOURCE: ${orig}
      <div style="margin-top:0.45rem"><button type="button" class="btn btn--accent" id="picker-use-original">Use Original Source</button></div>`;
    $("#picker-use-original")?.addEventListener("click", () => {
      const a = assetIndex.find((x) => x.path === orig) || {
        path: orig,
        filename: orig.split("/").pop(),
        type: "local",
        kind: "ORIGINAL",
      };
      selectCandidate(inst, refFromAsset(a), a);
    });
  }

  function selectCandidate(inst, ref, meta) {
    candidate = { ref, meta };
    const key = D().sourceKey(ref);
    D().ensureSourceModel(inst);
    if (!inst.cropsBySource[key]) {
      inst.cropsBySource[key] = {
        desktop: D().cropDefaults(inst),
        tablet: D().cropDefaults(inst),
        mobile: D().cropDefaults(inst),
      };
      // composition-sensitive default contain
      if (inst.renderMode === "directed-contain" || inst.renderMode === "circular" && false) {
        // keep cropDefaults
      }
      if (inst.renderMode === "directed-contain") {
        for (const bp of D().BREAKPOINTS) inst.cropsBySource[key][bp].fit = "contain";
      }
    }
    $("#picker-preview-empty").hidden = true;
    $("#picker-preview-meta").hidden = false;
    $("#picker-frames").hidden = false;
    $("#picker-actions").hidden = false;
    const m = meta || {};
    $("#picker-preview-meta").innerHTML = [
      ["Filename", ref.filename],
      ["Kind", m.kind || ref.type],
      ["Path", ref.path || ref.remoteUrl || "—"],
      ["Original", ref.originalPath || "—"],
      ["Document", ref.document || "—"],
      ["Dims", m.width ? `${m.width}×${m.height}` : "—"],
      ["Classification", m.classification || m.pickerBucket || "—"],
    ].map(([k, v]) => `<dt>${k}</dt><dd>${String(v)}</dd>`).join("");
    renderCandidateFrames(inst, ref, inst.cropsBySource[key]);
  }

  function renderCandidateFrames(inst, ref, crops) {
    const grid = $("#picker-frames");
    grid.innerHTML = "";
    const url = ref.remoteUrl || (ref.path ? "/" + ref.path.replace(/^\/+/, "") : "");
    const ratios = inst.render?.aspectRatios || {};
    const mask = inst.render?.mask || (inst.renderMode === "circular" ? "circle" : null);
    for (const bp of D().BREAKPOINTS) {
      const ratio = D().parseRatio(ratios[bp]);
      const w = D().FRAME_WIDTHS[bp];
      const card = document.createElement("div");
      card.className = "frame-card";
      card.innerHTML = `
        <div class="frame-card__label"><span>${bp.toUpperCase()}</span><span>${ratios[bp] || "—"}</span></div>
        <div class="frame-stage${mask === "circle" ? " is-circle" : ""}" style="aspect-ratio:${ratio};max-width:${w}px;margin:0 auto">
          <img alt="" draggable="false" />
        </div>`;
      const img = $("img", card);
      img.src = url;
      D().applyTransform(img, crops[bp]);
      D().applyFrameMatteToStage($(".frame-stage", card), D().getFrameMatte(inst));
      grid.appendChild(card);
    }
  }

  function openPicker() {
    const inst = D().getInst(D().getSelectedId());
    if (!inst) return;
    $("#source-picker").hidden = false;
    $("#picker-instance-label").textContent = inst.id;
    $("#picker-browse-panel").hidden = true;
    $("#picker-url-panel").hidden = true;
    candidate = null;
    $("#picker-preview-empty").hidden = false;
    $("#picker-preview-meta").hidden = true;
    $("#picker-frames").hidden = true;
    $("#picker-actions").hidden = true;
    renderOriginalBanner(inst);
    renderPickerList(inst);
  }

  function closePicker() {
    $("#source-picker").hidden = true;
    candidate = null;
  }

  function useCandidate() {
    const inst = D().getInst(D().getSelectedId());
    if (!inst || !candidate) return;
    D().ensureSourceModel(inst);
    const ref = candidate.ref;
    const key = D().sourceKey(ref);
    inst.workingSource = { ...ref };
    if (!inst.cropsBySource[key]) {
      inst.cropsBySource[key] = {
        desktop: D().cropDefaults(inst),
        tablet: D().cropDefaults(inst),
        mobile: D().cropDefaults(inst),
      };
    }
    inst.crops = inst.cropsBySource[key];
    inst.sourceHistory = inst.sourceHistory || [];
    inst.sourceHistory.push({
      at: new Date().toISOString(),
      role: "workingCandidate",
      source: { ...ref },
    });
    D().markDirty();
    D().persistLocal();
    D().renderDetail(inst);
    D().renderRail();
    closePicker();
    toast("Candidate set as working source — Approve Source before it goes live");
  }

  function approveSource() {
    const inst = D().getInst(D().getSelectedId());
    if (!inst) return;
    D().ensureSourceModel(inst);
    if (!D().isWorkingDifferent(inst)) {
      toast("Working source already matches approved source");
      return;
    }
    const prev = { ...inst.approvedSource };
    inst.sourceHistory = inst.sourceHistory || [];
    inst.sourceHistory.push({
      at: new Date().toISOString(),
      role: "approvedSource",
      from: prev,
      source: { ...inst.workingSource },
    });
    inst.approvedSource = { ...inst.workingSource };
    D().syncLegacySourceMirror(inst);
    const key = D().sourceKey(inst.workingSource);
    inst.crops = inst.cropsBySource[key];
    D().markDirty();
    D().persistLocal();
    D().renderDetail(inst);
    D().flushLiveSync(inst, false);
    toast("Source is now live on the case study");
  }

  function restoreOriginal() {
    const inst = D().getInst(D().getSelectedId());
    if (!inst) return;
    D().ensureSourceModel(inst);
    const orig = { ...inst.originalSelection };
    const key = D().sourceKey(orig);
    if (!inst.cropsBySource[key]) {
      inst.cropsBySource[key] = {
        desktop: D().cropDefaults(inst),
        tablet: D().cropDefaults(inst),
        mobile: D().cropDefaults(inst),
      };
    }
    inst.workingSource = orig;
    inst.crops = inst.cropsBySource[key];
    inst.sourceHistory.push({
      at: new Date().toISOString(),
      role: "restoreOriginalWorking",
      source: orig,
    });
    D().markDirty();
    D().persistLocal();
    D().renderDetail(inst);
    toast("Original selection restored as working source — Approve Source to make live");
  }

  function openCompare() {
    const inst = D().getInst(D().getSelectedId());
    if (!inst) return;
    D().ensureSourceModel(inst);
    $("#compare-panel").hidden = false;
    compareBp = "desktop";
    $$("#compare-bp button").forEach((b) => b.classList.toggle("is-active", b.dataset.bp === compareBp));
    renderCompare(inst);
  }

  function renderCompare(inst) {
    const ratios = inst.render?.aspectRatios || {};
    const ratio = D().parseRatio(ratios[compareBp] || "16/11");
    const mask = inst.render?.mask || (inst.renderMode === "circular" ? "circle" : null);
    const aKey = D().sourceKey(inst.approvedSource);
    const wKey = D().sourceKey(inst.workingSource);
    const aCrops = inst.cropsBySource?.[aKey]?.[compareBp] || inst.crops[compareBp];
    const wCrops = inst.cropsBySource?.[wKey]?.[compareBp] || inst.crops[compareBp];

    $("#compare-cur-label").textContent = inst.approvedSource?.filename || "";
    $("#compare-cand-label").textContent = inst.workingSource?.filename || "";

    for (const [stageId, url, crops] of [
      ["compare-cur-stage", D().approvedUrl(inst), aCrops],
      ["compare-cand-stage", D().workingUrl(inst), wCrops],
    ]) {
      const stage = $("#" + stageId);
      stage.classList.toggle("is-circle", mask === "circle");
      stage.style.aspectRatio = String(ratio);
      const img = $("img", stage);
      img.src = url;
      D().applyTransform(img, crops);
    }
  }

  async function listDir(path) {
    const res = await fetch(LIST_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    });
    if (!res.ok) throw new Error("list-dir failed");
    return res.json();
  }

  async function openBrowse() {
    $("#picker-browse-panel").hidden = false;
    $("#picker-url-panel").hidden = true;
    browsePath = ALLOWED_ROOTS[0];
    await renderBrowse();
  }

  async function renderBrowse() {
    $("#browse-path").textContent = browsePath;
    const data = await listDir(browsePath);
    const list = $("#browse-list");
    list.innerHTML = "";
    for (const entry of data.entries || []) {
      const li = document.createElement("li");
      if (entry.type === "dir") {
        li.innerHTML = `<div style="grid-column:1/-1"><strong>📁 ${entry.name}</strong></div>`;
        li.addEventListener("click", async () => {
          browsePath = entry.path;
          await renderBrowse();
        });
      } else {
        li.innerHTML = `
          <img src="/${entry.path}" alt="" loading="lazy" />
          <div>
            <div class="rail__name">${entry.name}</div>
            <div class="rail__sub">${entry.path}${entry.width ? `<br/>${entry.width}×${entry.height}` : ""}</div>
          </div>`;
        li.addEventListener("click", async () => {
          const inst = D().getInst(D().getSelectedId());
          // register into index (no file copy unless outside evidence — path stays original)
          const ref = {
            path: entry.path,
            remoteUrl: null,
            originalPath: null,
            document: "Manual project file selection",
            url: null,
            family: null,
            type: "local",
            filename: entry.name,
          };
          selectCandidate(inst, ref, {
            filename: entry.name,
            path: entry.path,
            width: entry.width,
            height: entry.height,
            kind: "ORIGINAL",
            type: "local",
          });
        });
      }
      list.appendChild(li);
    }
  }

  function bind() {
    const launchPicker = () =>
      loadIndex()
        .then(openPicker)
        .catch((err) => toast("Asset index failed: " + err.message));

    $("#btn-replace-source")?.addEventListener("click", launchPicker);
    $("#picker-close")?.addEventListener("click", closePicker);
    $("#picker-filter")?.addEventListener("change", () => {
      const inst = D().getInst(D().getSelectedId());
      if (inst) renderPickerList(inst);
    });
    $("#picker-search")?.addEventListener("input", () => {
      const inst = D().getInst(D().getSelectedId());
      if (inst) renderPickerList(inst);
    });
    $("#picker-use")?.addEventListener("click", useCandidate);
    $("#picker-cancel-cand")?.addEventListener("click", () => {
      candidate = null;
      $("#picker-preview-empty").hidden = false;
      $("#picker-preview-meta").hidden = true;
      $("#picker-frames").hidden = true;
      $("#picker-actions").hidden = true;
    });
    $("#btn-approve-source")?.addEventListener("click", async () => {
      approveSource();
      await D().saveManifest(false);
    });
    $("#btn-restore-original")?.addEventListener("click", restoreOriginal);
    $("#btn-compare")?.addEventListener("click", openCompare);
    $("#compare-close")?.addEventListener("click", () => { $("#compare-panel").hidden = true; });
    $$("#compare-bp button").forEach((b) => {
      b.addEventListener("click", () => {
        compareBp = b.dataset.bp;
        $$("#compare-bp button").forEach((x) => x.classList.toggle("is-active", x.dataset.bp === compareBp));
        const inst = D().getInst(D().getSelectedId());
        if (inst) renderCompare(inst);
      });
    });
    $("#picker-browse")?.addEventListener("click", () => {
      openBrowse().catch((e) => toast(e.message));
    });
    $("#browse-close")?.addEventListener("click", () => {
      $("#picker-browse-panel").hidden = true;
    });
    $("#browse-up")?.addEventListener("click", async () => {
      const parts = browsePath.split("/").filter(Boolean);
      if (parts.length <= 2) {
        browsePath = ALLOWED_ROOTS[0];
      } else {
        parts.pop();
        browsePath = parts.join("/");
      }
      // keep within allowed
      if (!ALLOWED_ROOTS.some((r) => browsePath === r || browsePath.startsWith(r + "/"))) {
        browsePath = ALLOWED_ROOTS[0];
      }
      await renderBrowse();
    });
    $("#picker-url")?.addEventListener("click", () => {
      $("#picker-url-panel").hidden = false;
      $("#picker-browse-panel").hidden = true;
    });
    $("#picker-url-cancel")?.addEventListener("click", () => {
      $("#picker-url-panel").hidden = true;
    });
    $("#picker-url-preview")?.addEventListener("click", () => {
      const url = ($("#picker-url-input").value || "").trim();
      if (!/^https?:\/\//i.test(url)) {
        toast("Enter a full http(s) image URL");
        return;
      }
      const inst = D().getInst(D().getSelectedId());
      selectCandidate(inst, refFromUrl(url), {
        filename: url.split("/").pop(),
        remoteUrl: url,
        kind: "ORIGINAL",
        type: url.includes("cloudinary") ? "cloudinary" : "remote",
        classification: "CURRENT CANONICAL",
        pickerBucket: "PHOTOGRAPHY",
      });
    });
  }

  // Wait for CscDirector
  function waitBoot() {
    if (window.CscDirector?.getManifest) {
      bind();
      window.CscSourceReplace = { openPicker: launchPicker };
      return;
    }
    setTimeout(waitBoot, 50);
  }
  waitBoot();
})();
