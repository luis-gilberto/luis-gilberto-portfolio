/* CSC Image Director — local editorial tool */
(() => {
  const MANIFEST_URL = "/studio/case-studies/criar-sin-culpas/csc-case-study-image-manifest.json";
  const SAVE_URL = "/__csc_director/save-manifest";
  const APPLY_URL = "/__csc_director/apply-crops";
  const DELETE_URL = "/__csc_director/delete-instance";
  const PING_URL = "/__csc_director/ping";
  const DEV_SERVER_HINT = "Start: python studio/tools/csc-image-director/dev-server.py · open http://localhost:4173/studio/tools/csc-image-director/";
  const LS_KEY = "csc-image-director-working";
  const CASE_URL = "/studio/case-studies/criar-sin-culpas/";

  const BREAKPOINTS = ["desktop", "tablet", "mobile"];
  const FRAME_WIDTHS = { desktop: 320, tablet: 280, mobile: 220 };

  let manifest = null;
  let selectedId = null;
  let activeBp = "desktop";
  let distort = false;
  let dirty = false;
  let domBoundCache = new Set();
  let serverReady = false;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  function toast(msg) {
    const el = $("#toast");
    el.hidden = false;
    el.textContent = msg;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { el.hidden = true; }, 2800);
  }

  function sourceKey(ref) {
    if (!ref) return "";
    return ref.remoteUrl || ref.path || ref.url || "";
  }

  function sourceRefFromLegacy(src) {
    const remote = src?.remoteUrl || (src?.url && String(src.url).startsWith("http") ? src.url : null);
    return {
      path: src?.path || null,
      remoteUrl: remote || null,
      originalPath: src?.originalPath || null,
      document: src?.document || null,
      url: src?.url || remote || null,
      family: src?.family || null,
      type: remote && String(remote).includes("cloudinary") ? "cloudinary" : (remote ? "remote" : "local"),
      filename: ((src?.path || remote || "unknown").split("?")[0].split("/").pop()),
    };
  }

  function ensureSourceModel(inst) {
    if (!inst.source) inst.source = {};
    const legacy = sourceRefFromLegacy(inst.source);
    if (!inst.originalSelection) inst.originalSelection = { ...legacy };
    if (!inst.approvedSource) inst.approvedSource = { ...legacy };
    if (!inst.workingSource) inst.workingSource = { ...inst.approvedSource };
    if (!inst.sourceHistory) {
      inst.sourceHistory = [{ at: "bootstrap", role: "originalSelection", source: { ...inst.originalSelection } }];
    }
    if (!inst.cropsBySource) inst.cropsBySource = {};
    const ak = sourceKey(inst.approvedSource);
    const wk = sourceKey(inst.workingSource);
    if (ak && !inst.cropsBySource[ak]) {
      ensureCrops(inst);
      inst.cropsBySource[ak] = JSON.parse(JSON.stringify(inst.crops));
    }
    if (wk && !inst.cropsBySource[wk]) {
      inst.cropsBySource[wk] = {
        desktop: cropDefaults(inst),
        tablet: cropDefaults(inst),
        mobile: cropDefaults(inst),
      };
    }
    // Director edits the working source crops
    if (wk && inst.cropsBySource[wk]) {
      inst.crops = inst.cropsBySource[wk];
    }
  }

  function syncLegacySourceMirror(inst) {
    const a = inst.approvedSource || {};
    inst.source = {
      path: a.path || null,
      remoteUrl: a.remoteUrl || null,
      originalPath: a.originalPath || null,
      document: a.document || null,
      url: a.url || a.remoteUrl || null,
      family: a.family || null,
    };
    inst.asset = a.filename || inst.asset;
    const ak = sourceKey(a);
    if (ak && inst.cropsBySource?.[ak]) {
      // live crops mirror approved
      // keep working crops separate; inst.crops stays as working for director
    }
  }

  function workingUrl(inst) {
    const w = inst.workingSource || inst.approvedSource || inst.source || {};
    if (w.remoteUrl) return w.remoteUrl;
    if (w.path) return "/" + String(w.path).replace(/^\/+/, "");
    return assetUrl(inst);
  }

  function approvedUrl(inst) {
    const a = inst.approvedSource || inst.source || {};
    if (a.remoteUrl) return a.remoteUrl;
    if (a.path) return "/" + String(a.path).replace(/^\/+/, "");
    return assetUrl(inst);
  }

  function assetUrl(inst) {
    // Prefer working source in the Director UI
    if (inst.workingSource) return workingUrl(inst);
    if (inst.source?.remoteUrl) return inst.source.remoteUrl;
    if (inst.source?.path) return "/" + inst.source.path.replace(/^\/+/, "");
    return "";
  }

  function isWorkingDifferent(inst) {
    return sourceKey(inst.workingSource) !== sourceKey(inst.approvedSource);
  }

  function parseRatio(str) {
    if (!str || str === "contain" || str === "auto") return 1;
    if (String(str).includes("/")) {
      const [a, b] = String(str).split("/").map(Number);
      return a && b ? a / b : 1;
    }
    const n = Number(str);
    return n || 1;
  }

  function sectionNum(section) {
    const map = {
      open: "00",
      "starting-point": "01",
      method: "02",
      "the-read": "02b",
      evolution: "04",
      "brand-system": "05",
      "reader-state": "06",
      "visual-languages": "07",
      infrastructure: "08",
      purpose: "09",
      operations: "10",
      measure: "11",
      product: "12",
      status: "13",
      close: "14",
    };
    return map[section] || section;
  }

  function sourceStatus(inst) {
    const s = inst.source || {};
    if (s.originalPath || s.document || s.url || s.family) return "traced";
    if (s.path || s.remoteUrl) return "path-only";
    return "unknown";
  }

  function getInst(id) {
    return manifest.instances.find((i) => i.id === id);
  }

  function cropDefaults(inst) {
    const fit = inst.render?.objectFit || "cover";
    const y = String(inst.render?.objectPosition || "").includes("18") ? 18 : 50;
    return { fit, x: 50, y, zoom: 1, scaleX: 1, scaleY: 1 };
  }

  function ensureCrops(inst) {
    if (!inst.crops) inst.crops = {};
    for (const bp of BREAKPOINTS) {
      if (!inst.crops[bp]) inst.crops[bp] = cropDefaults(inst);
    }
  }

  const ILLUSTRATION_MODULES = new Set(["illustration-ladder", "named-set"]);

  function inferFrameMatte(inst) {
    const asset = (inst.asset || "").toLowerCase();
    const module = inst.usage?.module || "";
    const src = inst.approvedSource || inst.workingSource || inst.source || {};
    const path = (src.path || src.remoteUrl || "").toLowerCase();
    const render = inst.render || {};

    if (asset.endsWith(".svg")) return "paper";
    if (asset.includes("doodle") || asset.includes("symbol")) return "paper";
    if (ILLUSTRATION_MODULES.has(module)) return "paper";
    if (path.includes("visual-system") && render.compositionSensitive) return "paper";
    return "match-section";
  }

  function ensureRender(inst) {
    if (!inst.render) inst.render = {};
    if (!inst.render.frameMatte) inst.render.frameMatte = inferFrameMatte(inst);
  }

  function getFrameMatte(inst) {
    ensureRender(inst);
    return inst.render.frameMatte || "match-section";
  }

  function applyFrameMatteToStage(stage, matte) {
    if (!stage) return;
    if (!matte || matte === "match-section") {
      delete stage.dataset.frameMatte;
    } else {
      stage.dataset.frameMatte = matte;
    }
  }

  function applyMatteToDetail(inst) {
    const matte = getFrameMatte(inst);
    applyFrameMatteToStage($(".source-full"), matte);
    $$(".frame-stage", $("#frames-grid")).forEach((stage) => applyFrameMatteToStage(stage, matte));
  }

  async function loadManifest() {
    const res = await fetch(MANIFEST_URL + "?t=" + Date.now(), { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load manifest");
    const file = await res.json();
    let working = null;
    try {
      working = JSON.parse(localStorage.getItem(LS_KEY) || "null");
    } catch (_) {}
    if (working?.instances?.length && working.version === file.version) {
      const byId = Object.fromEntries(working.instances.map((i) => [i.id, i]));
      file.instances = file.instances.map((inst) => {
        const w = byId[inst.id];
        if (!w) return inst;
        // Locked instances (ops mockups): manifest file is source of truth — stale
        // localStorage must not resurrect old evidence paths or cover crops.
        if (inst.sourceLocked) return inst;
        return {
          ...inst,
          crops: w.crops || inst.crops,
          cropsBySource: w.cropsBySource || inst.cropsBySource,
          workingSource: w.workingSource || inst.workingSource,
          approvedSource: inst.approvedSource || w.approvedSource,
          originalSelection: w.originalSelection || inst.originalSelection,
          sourceHistory: w.sourceHistory || inst.sourceHistory,
          source: w.source || inst.source,
          render: { ...(inst.render || {}), ...(w.render || {}) },
          status: w.status || inst.status,
          approved: !!w.approved,
        };
      });
      toast("Restored working edits from localStorage");
    }
    manifest = file;
    manifest.instances.forEach((inst) => {
      ensureSourceModel(inst);
      ensureRender(inst);
    });
    dirty = false;
    renderRail();
  }

  let syncTimer = null;
  const LIVE_REV_KEY = "csc-director-live-rev";

  function updateSyncStatus(state) {
    const el = $("#sync-status");
    if (!el) return;
    el.className = "sync-status is-" + state;
    const labels = {
      synced: "Live · synced",
      pending: "Saving…",
      saving: "Saving…",
      offline: "Offline · local only",
      error: "Sync failed",
    };
    el.textContent = labels[state] || state;
  }

  function promoteWorkingToLive(inst) {
    ensureSourceModel(inst);
    if (inst.sourceLocked && isWorkingDifferent(inst)) {
      inst.workingSource = { ...inst.approvedSource };
      syncLegacySourceMirror(inst);
    } else if (isWorkingDifferent(inst)) {
      inst.sourceHistory = inst.sourceHistory || [];
      inst.sourceHistory.push({
        at: new Date().toISOString(),
        role: "approvedSource",
        from: { ...inst.approvedSource },
        source: { ...inst.workingSource },
        via: "live-sync",
      });
      inst.approvedSource = { ...inst.workingSource };
    }
    const liveKey = sourceKey(inst.approvedSource);
    if (liveKey) {
      inst.cropsBySource[liveKey] = JSON.parse(JSON.stringify(inst.crops));
      inst.crops = inst.cropsBySource[liveKey];
    }
    inst.approved = true;
    inst.status = "APPROVED";
    syncLegacySourceMirror(inst);
  }

  async function flushLiveSync(inst, quiet = true) {
    if (!inst) return false;
    updateSyncStatus("saving");
    promoteWorkingToLive(inst);
    persistLocal();
    const saved = await saveManifest(false, quiet);
    if (!saved) {
      updateSyncStatus("offline");
      return false;
    }
    const ok = await syncAppliedCrops();
    if (!ok) {
      updateSyncStatus("error");
      if (!quiet) toast("Could not write crop CSS");
      return false;
    }
    try {
      localStorage.setItem(LIVE_REV_KEY, String(Date.now()));
      window.dispatchEvent(new CustomEvent("csc-director-live-sync"));
    } catch (_) {}
    window.CscModulePreview?.refresh?.(inst);
    updateSyncStatus("synced");
    renderRail();
    return true;
  }

  function scheduleLiveSync(inst) {
    if (!inst) return;
    updateSyncStatus("pending");
    clearTimeout(syncTimer);
    syncTimer = setTimeout(() => flushLiveSync(inst, true), 550);
  }

  function isOnPage(id) {
    return domBoundCache.has(id);
  }

  function persistLocal() {
    localStorage.setItem(LS_KEY, JSON.stringify(manifest));
  }

  function updateServerBanner() {
    const banner = $("#server-banner");
    if (banner) banner.hidden = serverReady;
  }

  async function probeServer() {
    try {
      const res = await fetch(PING_URL + "?t=" + Date.now(), { cache: "no-store" });
      serverReady = res.ok;
    } catch (_) {
      serverReady = false;
    }
    updateServerBanner();
    return serverReady;
  }

  function downloadManifestFile() {
    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "csc-case-study-image-manifest.json";
    a.click();
    URL.revokeObjectURL(a.href);
    toast("Exported manifest JSON");
  }

  function downloadAppliedCssFile(css, count) {
    const blob = new Blob([css], { type: "text/css" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "csc-crops-applied.css";
    a.click();
    URL.revokeObjectURL(a.href);
    toast(`Exported crop CSS (${count} directed)`);
  }

  async function saveManifest(exportFallback = false, quiet = false) {
    persistLocal();
    try {
      const res = await fetch(SAVE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(manifest),
      });
      if (res.ok) {
        dirty = false;
        serverReady = true;
        updateServerBanner();
        if (!quiet) toast("Manifest saved to disk");
        return true;
      }
    } catch (_) {}
    serverReady = false;
    updateServerBanner();
    if (exportFallback) {
      downloadManifestFile();
      dirty = false;
      return true;
    }
    if (!quiet) toast("Could not save manifest to disk. " + DEV_SERVER_HINT);
    return false;
  }

  function buildAppliedCss(instances) {
    const lines = [
      "/* Auto-generated by CSC Image Director */",
      "/* Fallback for no-JS. Runtime binder reads the manifest. */",
      "",
    ];
    for (const inst of instances) {
      if (inst.directed === false || inst.renderMode === "non-directed") continue;
      ensureCrops(inst);
      const sel = `[data-csc-img="${inst.id}"]`;
      const d = inst.crops.desktop;
      const t = inst.crops.tablet;
      const m = inst.crops.mobile;
      lines.push(`${sel} {`);
      lines.push(`  --crop-fit-desktop: ${d.fit};`);
      lines.push(`  --crop-x-desktop: ${Number(d.x).toFixed(2)}%;`);
      lines.push(`  --crop-y-desktop: ${Number(d.y).toFixed(2)}%;`);
      lines.push(`  --crop-zoom-desktop: ${Number(d.zoom).toFixed(4)};`);
      lines.push(`  --crop-sx-desktop: ${Number(d.scaleX).toFixed(4)};`);
      lines.push(`  --crop-sy-desktop: ${Number(d.scaleY).toFixed(4)};`);
      lines.push(`  --crop-fit-tablet: ${t.fit};`);
      lines.push(`  --crop-x-tablet: ${Number(t.x).toFixed(2)}%;`);
      lines.push(`  --crop-y-tablet: ${Number(t.y).toFixed(2)}%;`);
      lines.push(`  --crop-zoom-tablet: ${Number(t.zoom).toFixed(4)};`);
      lines.push(`  --crop-sx-tablet: ${Number(t.scaleX).toFixed(4)};`);
      lines.push(`  --crop-sy-tablet: ${Number(t.scaleY).toFixed(4)};`);
      lines.push(`  --crop-fit-mobile: ${m.fit};`);
      lines.push(`  --crop-x-mobile: ${Number(m.x).toFixed(2)}%;`);
      lines.push(`  --crop-y-mobile: ${Number(m.y).toFixed(2)}%;`);
      lines.push(`  --crop-zoom-mobile: ${Number(m.zoom).toFixed(4)};`);
      lines.push(`  --crop-sx-mobile: ${Number(m.scaleX).toFixed(4)};`);
      lines.push(`  --crop-sy-mobile: ${Number(m.scaleY).toFixed(4)};`);
      lines.push(`}`);
      lines.push(`${sel} {`);
      lines.push(`  object-fit: var(--crop-fit-desktop, cover) !important;`);
      lines.push(`  object-position: var(--crop-x-desktop, 50%) var(--crop-y-desktop, 50%) !important;`);
      lines.push(`  transform: scale(calc(var(--crop-zoom-desktop, 1) * var(--crop-sx-desktop, 1)), calc(var(--crop-zoom-desktop, 1) * var(--crop-sy-desktop, 1))) !important;`);
      lines.push(`  transform-origin: var(--crop-x-desktop, 50%) var(--crop-y-desktop, 50%) !important;`);
      lines.push(`}`);
      lines.push(`@media (max-width: 1100px) {`);
      lines.push(`  ${sel} {`);
      lines.push(`    object-fit: var(--crop-fit-tablet, var(--crop-fit-desktop, cover)) !important;`);
      lines.push(`    object-position: var(--crop-x-tablet, 50%) var(--crop-y-tablet, 50%) !important;`);
      lines.push(`    transform: scale(calc(var(--crop-zoom-tablet, 1) * var(--crop-sx-tablet, 1)), calc(var(--crop-zoom-tablet, 1) * var(--crop-sy-tablet, 1))) !important;`);
      lines.push(`    transform-origin: var(--crop-x-tablet, 50%) var(--crop-y-tablet, 50%) !important;`);
      lines.push(`  }`);
      lines.push(`}`);
      lines.push(`@media (max-width: 820px) {`);
      lines.push(`  ${sel} {`);
      lines.push(`    object-fit: var(--crop-fit-mobile, var(--crop-fit-desktop, cover)) !important;`);
      lines.push(`    object-position: var(--crop-x-mobile, 50%) var(--crop-y-mobile, 50%) !important;`);
      lines.push(`    transform: scale(calc(var(--crop-zoom-mobile, 1) * var(--crop-sx-mobile, 1)), calc(var(--crop-zoom-mobile, 1) * var(--crop-sy-mobile, 1))) !important;`);
      lines.push(`    transform-origin: var(--crop-x-mobile, 50%) var(--crop-y-mobile, 50%) !important;`);
      lines.push(`  }`);
      lines.push(`}`);
      lines.push("");
    }
    return lines.join("\n");
  }

  async function syncAppliedCrops() {
    const directed = manifest.instances.filter(
      (i) => i.directed !== false && i.renderMode !== "non-directed"
    );
    for (const inst of directed) ensureCrops(inst);
    const css = buildAppliedCss(manifest.instances);
    try {
      const res = await fetch(APPLY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ css, count: directed.length }),
      });
      return res.ok;
    } catch (_) {
      return false;
    }
  }

  async function refreshDomBound() {
    try {
      const res = await fetch(CASE_URL + "?t=" + Date.now(), { cache: "no-store" });
      const html = await res.text();
      domBoundCache = new Set([...html.matchAll(/data-csc-img="([^"]+)"/g)].map((m) => m[1]));
    } catch (_) {
      domBoundCache = new Set();
    }
    return domBoundCache;
  }

  function isDirected(inst) {
    return inst.directed !== false && inst.renderMode !== "non-directed";
  }

  async function deleteInstance(id) {
    const inst = getInst(id);
    if (!inst) {
      toast("Instance not found");
      return false;
    }
    await refreshDomBound();
    const onPage = domBoundCache.has(id);
    let removeFromHtml = false;
    if (onPage) {
      removeFromHtml = confirm(
        `"${inst.asset}" is still on the live case study page.\n\n` +
          "Remove from manifest AND delete its <img> tag from index.html?\n\n" +
          "Cancel to keep everything as-is."
      );
      if (!removeFromHtml) return false;
    } else if (
      !confirm(
        `Remove "${inst.asset}" from the manifest?\n\nIt is not on the live page (safe cleanup).`
      )
    ) {
      return false;
    }

    try {
      const res = await fetch(DELETE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, removeFromHtml }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      localStorage.removeItem(LS_KEY);
      if (selectedId === id) {
        selectedId = null;
        $("#detail").classList.add("hidden");
        $("#empty-state").classList.remove("hidden");
      }
      await loadManifest();
      await syncAppliedCrops();
      toast(
        data.removedHtml
          ? `Removed ${inst.asset} from manifest and case study HTML`
          : `Removed ${inst.asset} from manifest`
      );
      return true;
    } catch (err) {
      toast("Delete failed: " + err.message);
      return false;
    }
  }

  async function applyApproved() {
    const directed = manifest.instances.filter(
      (i) => i.directed !== false && i.renderMode !== "non-directed"
    );
    for (const inst of directed) ensureCrops(inst);
    persistLocal();

    const saved = await saveManifest(false);
    if (!saved) {
      toast("Apply blocked: could not persist manifest");
      return;
    }

    const css = buildAppliedCss(manifest.instances);
    const approved = directed.filter((i) => i.approved);
    try {
      const res = await fetch(APPLY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          css,
          count: directed.length,
          approvedIds: approved.map((i) => i.id),
        }),
      });
      if (res.ok) {
        serverReady = true;
        updateServerBanner();
        toast(`Synced ${directed.length} directed crop(s) · ${approved.length} approved`);
        return;
      }
    } catch (_) {}
    serverReady = false;
    updateServerBanner();
    toast("Could not write crop CSS to disk. " + DEV_SERVER_HINT);
  }

  function filteredInstances() {
    const filter = $("#filter").value;
    const q = ($("#search").value || "").trim().toLowerCase();
    return manifest.instances.filter((inst) => {
      if (filter === "APPROVED" && !inst.approved) return false;
      if (filter === "NEEDS REVIEW" && (inst.approved || inst.status === "APPROVED")) return false;
      if (filter === "PILOT" && !inst.pilot && !(manifest.pilots || []).includes(inst.id)) return false;
      if (filter === "MISSING FROM PAGE") {
        if (!isDirected(inst) || domBoundCache.has(inst.id)) return false;
      }
      if (["CURRENT CANONICAL", "HISTORICAL", "LG STUDIO / STRATEGYIQ EVIDENCE", "UNKNOWN"].includes(filter)) {
        if (inst.classification !== filter) return false;
      }
      if (!q) return true;
      const hay = [inst.asset, inst.id, inst.usage.section, inst.usage.module, inst.source.path, inst.source.document]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }

  function renderRail() {
    const list = $("#rail-list");
    const items = filteredInstances();
    const directed = manifest.instances.filter((i) => i.directed !== false && i.renderMode !== "non-directed");
    $("#rail-meta").textContent = `${items.length} shown · ${directed.length} directed · ${manifest.stats.instances} total`;
    list.innerHTML = "";
    for (const inst of items) {
      const li = document.createElement("li");
      li.className = "rail__item" + (inst.id === selectedId ? " is-active" : "");
      li.dataset.id = inst.id;
      const url = assetUrl(inst);
      const sens = inst.render?.compositionSensitive || inst.renderMode === "directed-contain";
      const st = inst.approved ? "APPROVED" : (inst.status || "UNREVIEWED");
      const srcSt = sourceStatus(inst);
      const mode = (inst.renderMode || "").replace("directed-", "");
      const missing = isDirected(inst) && !domBoundCache.has(inst.id);
      li.innerHTML = `
        <img class="rail__thumb${inst.render?.objectFit === "contain" || inst.renderMode === "directed-contain" ? " is-contain" : ""}" src="${url}" alt="" loading="lazy" />
        <div>
          <div class="rail__name" title="${inst.asset}">${inst.asset}${missing ? ' <span class="badge badge--warn">OFF PAGE</span>' : ""}</div>
          <div class="rail__sub">
            §${sectionNum(inst.usage.section)} · ${inst.usage.module}${mode ? ` · ${mode}` : ""}<br/>
            <span class="badge">${inst.classification.replace("LG STUDIO / STRATEGYIQ EVIDENCE", "SIQ/LG").replace("CURRENT CANONICAL", "CURRENT")}</span>
            <span class="badge ${inst.approved ? "badge--ok" : "badge--warn"}">${st}</span>
            ${sens ? '<span class="badge badge--sens">SENSITIVE</span>' : ""}
            <span class="badge">${srcSt}</span>
          </div>
        </div>`;
      li.addEventListener("click", () => selectInstance(inst.id));
      list.appendChild(li);
    }
    runIntegrityAudit();
  }

  async function runIntegrityAudit() {
    const panel = $("#rail-audit");
    if (!panel || !manifest) return;
    try {
      const res = await fetch(CASE_URL + "?t=" + Date.now(), { cache: "no-store" });
      const html = await res.text();
      const domIds = [...html.matchAll(/data-csc-img="([^"]+)"/g)].map((m) => m[1]);
      domBoundCache = new Set(domIds);
      const domSet = domBoundCache;
      const manifestDirected = manifest.instances.filter(
        (i) => i.directed !== false && i.renderMode !== "non-directed"
      );
      const missingDom = manifestDirected.filter((i) => !domSet.has(i.id)).map((i) => i.id);
      const manifestSet = new Set(manifest.instances.map((i) => i.id));
      const orphanDom = domIds.filter((id) => !manifestSet.has(id));
      const dupDom = domIds.filter((id, idx) => domIds.indexOf(id) !== idx);
      const approvedBad = manifest.instances.filter((i) => i.approved && (!i.crops || !i.crops.desktop));
      const ok = missingDom.length === 0 && orphanDom.length === 0 && dupDom.length === 0;
      panel.hidden = false;
      panel.className = "rail__audit " + (ok ? "is-ok" : "is-bad");
      panel.innerHTML =
        `<strong>Integrity</strong><br/>` +
        `DOM bound ${domIds.length} · manifest directed ${manifestDirected.length}<br/>` +
        `missing DOM ${missingDom.length} · orphan DOM ${orphanDom.length} · dup ${new Set(dupDom).size}<br/>` +
        `approved w/o crops ${approvedBad.length}` +
        (ok ? "" : `<br/><a href="/studio/case-studies/criar-sin-culpas/unused-manifest-preview.html" target="_blank" rel="noopener">View unused gallery</a>`) +
        (ok ? "" : `<br/>${[...missingDom.slice(0, 3), ...orphanDom.slice(0, 3)].join(", ")}`);
    } catch (err) {
      panel.hidden = false;
      panel.className = "rail__audit is-bad";
      panel.textContent = "Integrity audit failed: " + err.message;
    }
  }

  async function selectInstance(id) {
    selectedId = id;
    activeBp = "desktop";
    const inst = getInst(id);
    ensureSourceModel(inst);
    ensureCrops(inst);
    await refreshDomBound();
    $("#empty-state").classList.add("hidden");
    $("#detail").classList.remove("hidden");
    renderDetail(inst);
    renderRail();
    try {
      sessionStorage.setItem("csc-director-selected", id);
    } catch (_) {}
  }

  function renderDetail(inst) {
    ensureSourceModel(inst);
    const url = workingUrl(inst);
    const img = $("#source-img");
    img.src = url;
    img.alt = inst.usage.alt || inst.asset;

    const approved = inst.approvedSource || {};
    const working = inst.workingSource || {};
    const path = working.path || working.remoteUrl || "—";
    const rows = [
      ["Filename", working.filename || inst.asset],
      ["Intrinsic", inst.intrinsic?.width ? `${inst.intrinsic.width} × ${inst.intrinsic.height}` : "unknown"],
      ["Working path", path],
      ["Approved path", approved.path || approved.remoteUrl || "—"],
      ["Original selection", inst.originalSelection?.path || inst.originalSelection?.remoteUrl || "—"],
      ["Original (derivative of)", working.originalPath || approved.originalPath || "—"],
      ["Document", working.document || approved.document || "—"],
      ["Family", working.family || approved.family || "—"],
      ["Section", `${sectionNum(inst.usage.section)} · ${inst.usage.section}`],
      ["Module", inst.usage.module],
      ["Classification", inst.classification],
      ["Crop status", inst.approved ? "APPROVED" : (inst.status || "UNREVIEWED")],
      ["Source gate", isWorkingDifferent(inst) ? "CANDIDATE (not live)" : "APPROVED SOURCE LIVE"],
      ["Mask", inst.render?.mask || (inst.renderMode === "circular" ? "circle" : "none")],
      ["Frame matte", getFrameMatte(inst)],
      ["Render mode", inst.renderMode || "—"],
    ];
    $("#source-meta").innerHTML = rows.map(([k, v]) => `<dt>${k}</dt><dd>${escapeHtml(String(v))}</dd>`).join("");

    $("#sensitive-flag").classList.toggle("hidden", !inst.render?.compositionSensitive);
    const open = $("#btn-open-source");
    open.href = url;
    open.style.display = url ? "" : "none";
    const hint = $("#source-work-hint");
    if (hint) hint.hidden = !isWorkingDifferent(inst);
    const btnApproveSource = $("#btn-approve-source");
    if (btnApproveSource) btnApproveSource.hidden = !isWorkingDifferent(inst);

    $("#link-case").href = CASE_URL + "#" + (inst.usage.section || "");
    renderFrames(inst);
    applyMatteToDetail(inst);
    syncControls(inst);
    window.CscModulePreview?.syncPreview?.(inst);
    updateDistortWarn(inst);
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function applyTransform(img, crop) {
    const sx = (crop.scaleX || 1) * (crop.zoom || 1);
    const sy = (crop.scaleY || 1) * (crop.zoom || 1);
    // Frame fixed; image moves. x/y are focal percentages (object-position style).
    img.style.objectFit = crop.fit || "cover";
    img.style.objectPosition = `${crop.x}% ${crop.y}%`;
    img.style.transformOrigin = `${crop.x}% ${crop.y}%`;
    img.style.transform = `scale(${sx}, ${sy})`;
  }

  function renderFrames(inst) {
    const grid = $("#frames-grid");
    grid.innerHTML = "";
    const ratios = inst.render?.aspectRatios || {};
    const mask = inst.render?.mask || (inst.renderMode === "circular" ? "circle" : null);

    for (const bp of BREAKPOINTS) {
      const crop = inst.crops[bp];
      const ratio = parseRatio(ratios[bp]);
      const w = FRAME_WIDTHS[bp];
      const h = Math.round(w / ratio);
      const card = document.createElement("div");
      card.className = "frame-card" + (bp === activeBp ? " is-active" : "");
      card.dataset.bp = bp;
      card.innerHTML = `
        <div class="frame-card__label">
          <span>${bp.toUpperCase()}</span>
          <span>${ratios[bp] || "—"} · ${w}×${h}px preview</span>
        </div>
        <div class="frame-stage${mask === "circle" ? " is-circle" : ""}" style="aspect-ratio:${ratio}; max-width:${w}px; margin:0 auto;">
          <img alt="" draggable="false" />
          <div class="frame-handles">
            <span class="handle handle--nw" data-corner="nw"></span>
            <span class="handle handle--ne" data-corner="ne"></span>
            <span class="handle handle--sw" data-corner="sw"></span>
            <span class="handle handle--se" data-corner="se"></span>
          </div>
        </div>`;
      const stage = $(".frame-stage", card);
      const img = $("img", stage);
      img.src = assetUrl(inst);
      applyTransform(img, crop);
      bindFrameInteraction(stage, inst, bp);
      card.addEventListener("mousedown", () => {
        if (activeBp !== bp) {
          activeBp = bp;
          syncBpSeg();
          syncControls(inst);
          $$(".frame-card").forEach((c) => c.classList.toggle("is-active", c.dataset.bp === bp));
        }
      });
      grid.appendChild(card);
    }
    applyMatteToDetail(inst);
  }

  function bindFrameInteraction(stage, inst, bp) {
    let mode = null; // pan | scale
    let startX = 0;
    let startY = 0;
    let startCrop = null;
    let corner = null;

    const onMove = (e) => {
      if (!mode) return;
      const crop = inst.crops[bp];
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const rect = stage.getBoundingClientRect();
      if (mode === "pan") {
        // Dragging image: move focal opposite to drag (PowerPoint-like)
        const sens = 100 / Math.max(rect.width, 1);
        crop.x = clamp(startCrop.x - dx * sens, 0, 100);
        crop.y = clamp(startCrop.y - dy * sens, 0, 100);
      } else if (mode === "scale") {
        const dist = (dx + dy) * (corner.includes("n") || corner.includes("w") ? -1 : 1);
        const delta = dist / 200;
        if (distort) {
          if (corner.includes("e") || corner.includes("w")) crop.scaleX = clamp(startCrop.scaleX + delta, 0.5, 2);
          if (corner.includes("n") || corner.includes("s")) crop.scaleY = clamp(startCrop.scaleY + delta, 0.5, 2);
        } else {
          const next = clamp(startCrop.zoom + delta, 0.5, 3);
          crop.zoom = next;
        }
      }
      dirty = true;
      if (inst.status === "UNREVIEWED") inst.status = "IN PROGRESS";
      refreshFrame(bp, inst);
      if (bp === activeBp) syncControls(inst, false);
      updateDistortWarn(inst);
      window.CscModulePreview?.refresh?.(inst);
      scheduleLiveSync(inst);
    };

    const onUp = () => {
      mode = null;
      corner = null;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      persistLocal();
      scheduleLiveSync(inst);
    };

    stage.addEventListener("pointerdown", (e) => {
      if (e.target.classList.contains("handle")) {
        mode = "scale";
        corner = e.target.dataset.corner;
      } else {
        mode = "pan";
      }
      activeBp = bp;
      syncBpSeg();
      startX = e.clientX;
      startY = e.clientY;
      startCrop = { ...inst.crops[bp] };
      stage.setPointerCapture?.(e.pointerId);
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      e.preventDefault();
    });

    stage.addEventListener("wheel", (e) => {
      e.preventDefault();
      activeBp = bp;
      const crop = inst.crops[bp];
      const delta = e.deltaY > 0 ? -0.04 : 0.04;
      crop.zoom = clamp((crop.zoom || 1) + delta, 0.5, 3);
      dirty = true;
      if (inst.status === "UNREVIEWED") inst.status = "IN PROGRESS";
      refreshFrame(bp, inst);
      if (bp === activeBp) syncControls(inst, false);
      persistLocal();
      scheduleLiveSync(inst);
    }, { passive: false });
  }

  function refreshFrame(bp, inst) {
    const card = $(`.frame-card[data-bp="${bp}"]`);
    if (!card) return;
    applyTransform($("img", card), inst.crops[bp]);
    if (bp === activeBp) window.CscModulePreview?.refresh?.(inst);
  }

  function refreshAllFrames(inst) {
    for (const bp of BREAKPOINTS) refreshFrame(bp, inst);
  }

  function clamp(n, a, b) {
    return Math.min(b, Math.max(a, n));
  }

  function syncBpSeg() {
    $$("#bp-seg button").forEach((b) => b.classList.toggle("is-active", b.dataset.bp === activeBp));
  }

  function syncControls(inst, writeDom = true) {
    const crop = inst.crops[activeBp];
    if (!writeDom) {
      $("#out-zoom").textContent = crop.zoom.toFixed(2);
      $("#out-x").textContent = crop.x.toFixed(1) + "%";
      $("#out-y").textContent = crop.y.toFixed(1) + "%";
      $("#out-sx").textContent = crop.scaleX.toFixed(2);
      $("#out-sy").textContent = crop.scaleY.toFixed(2);
      return;
    }
    $("#ctrl-fit").value = crop.fit || "cover";
    $("#ctrl-frame-matte").value = getFrameMatte(inst);
    $("#ctrl-zoom").value = crop.zoom;
    $("#ctrl-x").value = crop.x;
    $("#ctrl-y").value = crop.y;
    $("#ctrl-sx").value = crop.scaleX;
    $("#ctrl-sy").value = crop.scaleY;
    $("#out-zoom").textContent = Number(crop.zoom).toFixed(2);
    $("#out-x").textContent = Number(crop.x).toFixed(1) + "%";
    $("#out-y").textContent = Number(crop.y).toFixed(1) + "%";
    $("#out-sx").textContent = Number(crop.scaleX).toFixed(2);
    $("#out-sy").textContent = Number(crop.scaleY).toFixed(2);
    $("#ctrl-sx").disabled = !distort;
    $("#ctrl-sy").disabled = !distort;
    syncBpSeg();
  }

  function updateDistortWarn(inst) {
    const crops = Object.values(inst.crops || {});
    const bad = crops.some((c) => Math.abs((c.scaleX || 1) - (c.scaleY || 1)) > 0.001);
    $("#distort-warn").classList.toggle("hidden", !bad);
  }

  function bindControls() {
    $("#filter").addEventListener("change", renderRail);
    $("#search").addEventListener("input", renderRail);
    $("#btn-reload").addEventListener("click", async () => {
      localStorage.removeItem(LS_KEY);
      await loadManifest();
      if (selectedId) selectInstance(selectedId);
      toast("Reloaded from disk");
    });
    $("#btn-save").addEventListener("click", () => saveManifest(false));
    $("#btn-export-manifest").addEventListener("click", () => downloadManifestFile());
    $("#btn-export-css").addEventListener("click", () => {
      const directed = manifest.instances.filter(
        (i) => i.directed !== false && i.renderMode !== "non-directed"
      );
      downloadAppliedCssFile(buildAppliedCss(manifest.instances), directed.length);
    });
    $("#btn-apply").addEventListener("click", () => applyApproved());
    $("#btn-delete-instance").addEventListener("click", async () => {
      if (!selectedId) return;
      await deleteInstance(selectedId);
    });

    $$("#bp-seg button").forEach((b) => {
      b.addEventListener("click", () => {
        activeBp = b.dataset.bp;
        const inst = getInst(selectedId);
        if (!inst) return;
        if (window.CscModulePreview?.isPilot?.(inst.id)) {
          const state = window.CscModulePreview.stateForBp(activeBp);
          window.CscModulePreview.setActiveState(state);
          window.CscModulePreview.syncPreview(inst, true);
        } else {
          $("#generic-frames")?.classList.remove("hidden");
        }
        syncControls(inst);
        $$(".frame-card").forEach((c) => c.classList.toggle("is-active", c.dataset.bp === activeBp));
      });
    });

    $("#distort-mode").addEventListener("change", (e) => {
      distort = e.target.checked;
      const inst = getInst(selectedId);
      if (inst) syncControls(inst);
    });

    const onCropInput = (key, parser) => (e) => {
      const inst = getInst(selectedId);
      if (!inst) return;
      inst.crops[activeBp][key] = parser(e.target.value);
      if (inst.status === "UNREVIEWED") inst.status = "IN PROGRESS";
      dirty = true;
      refreshFrame(activeBp, inst);
      syncControls(inst, false);
      updateDistortWarn(inst);
      persistLocal();
      scheduleLiveSync(inst);
    };

    $("#ctrl-fit").addEventListener("change", onCropInput("fit", String));
    $("#ctrl-frame-matte").addEventListener("change", (e) => {
      const inst = getInst(selectedId);
      if (!inst) return;
      ensureRender(inst);
      inst.render.frameMatte = e.target.value;
      if (inst.status === "UNREVIEWED") inst.status = "IN PROGRESS";
      dirty = true;
      applyMatteToDetail(inst);
      persistLocal();
      scheduleLiveSync(inst);
    });
    $("#ctrl-zoom").addEventListener("input", onCropInput("zoom", Number));
    $("#ctrl-x").addEventListener("input", onCropInput("x", Number));
    $("#ctrl-y").addEventListener("input", onCropInput("y", Number));
    $("#ctrl-sx").addEventListener("input", onCropInput("scaleX", Number));
    $("#ctrl-sy").addEventListener("input", onCropInput("scaleY", Number));

    const bumpLive = (inst) => {
      dirty = true;
      refreshFrame(activeBp, inst);
      syncControls(inst);
      updateDistortWarn(inst);
      persistLocal();
      scheduleLiveSync(inst);
    };

    $("#btn-reset-bp").addEventListener("click", () => {
      const inst = getInst(selectedId);
      if (!inst) return;
      inst.crops[activeBp] = cropDefaults(inst);
      bumpLive(inst);
    });

    $("#btn-center").addEventListener("click", () => {
      const inst = getInst(selectedId);
      if (!inst) return;
      inst.crops[activeBp].x = 50;
      inst.crops[activeBp].y = 50;
      bumpLive(inst);
    });

    $("#btn-fit").addEventListener("click", () => {
      const inst = getInst(selectedId);
      if (!inst) return;
      Object.assign(inst.crops[activeBp], { fit: "contain", zoom: 1, scaleX: 1, scaleY: 1, x: 50, y: 50 });
      bumpLive(inst);
    });

    $("#btn-fill").addEventListener("click", () => {
      const inst = getInst(selectedId);
      if (!inst) return;
      Object.assign(inst.crops[activeBp], { fit: "cover", zoom: 1 });
      bumpLive(inst);
    });

    $("#btn-reset-inst").addEventListener("click", () => {
      const inst = getInst(selectedId);
      if (!inst) return;
      for (const bp of BREAKPOINTS) inst.crops[bp] = cropDefaults(inst);
      inst.approved = false;
      inst.status = "UNREVIEWED";
      refreshAllFrames(inst);
      syncControls(inst);
      updateDistortWarn(inst);
      persistLocal();
      scheduleLiveSync(inst);
      renderRail();
      toast("Instance reset");
    });

    $("#btn-copy-path").addEventListener("click", async () => {
      const inst = getInst(selectedId);
      if (!inst) return;
      const w = inst.workingSource || inst.source || {};
      const text = w.path || w.remoteUrl || "";
      try {
        await navigator.clipboard.writeText(text);
        toast("Path copied");
      } catch (_) {
        toast(text);
      }
    });

    $("#btn-view-context").addEventListener("click", () => {
      const inst = getInst(selectedId);
      if (!inst) return;
      const url =
        window.CscModulePreview?.contextUrl?.(inst) ||
        `${CASE_URL}?director=${encodeURIComponent(inst.id)}#${inst.usage.section}`;
      window.open(url, "csc-case-study");
    });

    window.addEventListener("keydown", (e) => {
      if (!selectedId) return;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) return;
      if ($("#source-picker") && !$("#source-picker").hidden) return;
      const inst = getInst(selectedId);
      if (!inst) return;
      const step = e.shiftKey ? 4 : 1;
      const crop = inst.crops[activeBp];
      let handled = false;
      if (e.key === "ArrowLeft") { crop.x = clamp(crop.x - step, 0, 100); handled = true; }
      if (e.key === "ArrowRight") { crop.x = clamp(crop.x + step, 0, 100); handled = true; }
      if (e.key === "ArrowUp") { crop.y = clamp(crop.y - step, 0, 100); handled = true; }
      if (e.key === "ArrowDown") { crop.y = clamp(crop.y + step, 0, 100); handled = true; }
      if (handled) {
        e.preventDefault();
        dirty = true;
        refreshFrame(activeBp, inst);
        syncControls(inst);
        persistLocal();
        scheduleLiveSync(inst);
      }
    });

    window.addEventListener("beforeunload", (e) => {
      if (dirty) {
        persistLocal();
        e.preventDefault();
        e.returnValue = "";
      }
    });
  }

  async function boot() {
    bindControls();
    await probeServer();
    await loadManifest();
    let restore = null;
    try { restore = sessionStorage.getItem("csc-director-selected"); } catch (_) {}
    const params = new URLSearchParams(location.search);
    const fromUrl = params.get("id");
    const target = fromUrl || restore || (manifest.pilots && manifest.pilots[0]);
    if (target && getInst(target)) selectInstance(target);
    if (params.get("replace") === "1" && target && getInst(target)) {
      setTimeout(() => window.CscSourceReplace?.openPicker?.(), 120);
    }
  }

  window.CscDirector = {
    getManifest: () => manifest,
    getSelectedId: () => selectedId,
    getInst,
    ensureSourceModel,
    ensureCrops,
    ensureRender,
    inferFrameMatte,
    getFrameMatte,
    applyFrameMatteToStage,
    sourceKey,
    workingUrl,
    approvedUrl,
    isWorkingDifferent,
    cropDefaults,
    persistLocal,
    saveManifest,
    downloadManifestFile,
    downloadAppliedCssFile,
    probeServer,
    deleteInstance,
    syncAppliedCrops,
    refreshDomBound,
    isDirected,
    isOnPage,
    scheduleLiveSync,
    flushLiveSync,
    selectInstance,
    renderDetail,
    renderFrames,
    renderRail,
    toast,
    setDirty: (v) => { dirty = !!v; },
    markDirty: () => { dirty = true; },
    syncLegacySourceMirror,
    BREAKPOINTS,
    FRAME_WIDTHS,
    parseRatio,
    applyTransform: null, // set below after function exists
    getActiveBp: () => activeBp,
    setActiveBp: (bp) => { activeBp = bp; },
  };

  // expose applyTransform once defined — patch after boot via getter
  Object.defineProperty(window.CscDirector, "applyTransform", {
    get() {
      return applyTransform;
    },
  });

  boot().catch((err) => {
    console.error(err);
    toast("Failed to load manifest: " + err.message);
  });
})();
