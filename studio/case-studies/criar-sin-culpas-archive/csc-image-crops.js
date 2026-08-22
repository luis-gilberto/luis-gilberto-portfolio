/**
 * CSC case-study crop binder.
 * Renders APPROVED SOURCE + that source's breakpoint crops.
 * Working/candidate sources in the Director never affect the live page.
 */
(() => {
  const MANIFEST_URL = "/studio/case-studies/criar-sin-culpas-archive/csc-case-study-image-manifest.json";

  function sourceKey(ref) {
    if (!ref) return "";
    return ref.remoteUrl || ref.path || ref.url || "";
  }

  function approvedRef(inst) {
    return inst.approvedSource || inst.source || {};
  }

  function approvedUrl(inst) {
    const a = approvedRef(inst);
    if (a.remoteUrl) return a.remoteUrl;
    if (a.path) return "/" + String(a.path).replace(/^\/+/, "");
    return null;
  }

  function approvedCrops(inst) {
    const key = sourceKey(approvedRef(inst));
    if (key && inst.cropsBySource && inst.cropsBySource[key]) {
      return inst.cropsBySource[key];
    }
    return inst.crops;
  }

  function frameMatte(inst) {
    const matte = inst.render?.frameMatte;
    return matte && matte !== "match-section" ? matte : null;
  }

  function applyFrameMatte(el, inst) {
    const matte = frameMatte(inst);
    if (matte) {
      el.dataset.cscFrameMatte = matte;
    } else {
      delete el.dataset.cscFrameMatte;
    }
  }

  function applyCropVars(el, crops, renderMode) {
    if (!crops) return;
    const set = (bp, c) => {
      if (!c) return;
      el.style.setProperty(`--crop-fit-${bp}`, c.fit || "cover");
      el.style.setProperty(`--crop-x-${bp}`, `${Number(c.x)}%`);
      el.style.setProperty(`--crop-y-${bp}`, `${Number(c.y)}%`);
      el.style.setProperty(`--crop-zoom-${bp}`, String(c.zoom ?? 1));
      el.style.setProperty(`--crop-sx-${bp}`, String(c.scaleX ?? 1));
      el.style.setProperty(`--crop-sy-${bp}`, String(c.scaleY ?? 1));
    };
    set("desktop", crops.desktop);
    set("tablet", crops.tablet);
    set("mobile", crops.mobile);
    el.dataset.cscDirected = "1";
    el.classList.add("is-csc-directed");
    if (renderMode) el.dataset.cscRenderMode = renderMode;
  }

  function runIntegrityAudit(manifest, nodes) {
    const byId = Object.fromEntries((manifest.instances || []).map((i) => [i.id, i]));
    const domIds = [...nodes].map((el) => el.getAttribute("data-csc-img"));
    const domSet = new Set(domIds);
    const manifestIds = (manifest.instances || []).map((i) => i.id);
    const manifestSet = new Set(manifestIds);

    const duplicateDom = domIds.filter((id, i) => domIds.indexOf(id) !== i);
    const missingDom = manifestIds.filter((id) => {
      const inst = byId[id];
      return inst?.directed !== false && !domSet.has(id);
    });
    const missingManifest = domIds.filter((id) => id && !manifestSet.has(id));

    const report = {
      meaningful: (manifest.instances || []).filter((i) => i.directed !== false).length,
      boundDom: domIds.length,
      unboundManifest: missingDom.length,
      orphanDom: missingManifest.length,
      duplicateDomIds: [...new Set(duplicateDom)],
    };
    console.info("[csc-crops:audit]", report);
    document.documentElement.dataset.cscAuditOk = String(
      report.unboundManifest === 0 &&
        report.orphanDom === 0 &&
        report.duplicateDomIds.length === 0
    );
    return report;
  }

  async function bind() {
    const nodes = document.querySelectorAll("[data-csc-img]");
    if (!nodes.length) return;

    let manifest;
    try {
      const res = await fetch(`${MANIFEST_URL}?t=${Date.now()}`, { cache: "no-store" });
      if (!res.ok) throw new Error(String(res.status));
      manifest = await res.json();
    } catch (err) {
      console.warn("[csc-crops] manifest load failed", err);
      return;
    }

    const byId = Object.fromEntries((manifest.instances || []).map((i) => [i.id, i]));
    let bound = 0;
    nodes.forEach((el) => {
      const id = el.getAttribute("data-csc-img");
      const inst = byId[id];
      if (!inst) {
        console.warn("[csc-crops] no manifest instance for", id);
        return;
      }
      const mode = inst.renderMode || inst.render?.renderMode || "directed-cover";
      if (mode === "non-directed") return;

      const url = approvedUrl(inst);
      if (url && el.getAttribute("src") !== url) {
        el.setAttribute("src", url);
      }
      el.dataset.cscApprovedSource = sourceKey(approvedRef(inst));

      applyCropVars(el, approvedCrops(inst), mode);
      applyFrameMatte(el, inst);
      bound += 1;
    });
    document.documentElement.dataset.cscCropsBound = String(bound);
    runIntegrityAudit(manifest, nodes);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind);
  } else {
    bind();
  }

  const LIVE_REV_KEY = "csc-director-live-rev";
  let bindTimer = null;
  function scheduleBind() {
    clearTimeout(bindTimer);
    bindTimer = setTimeout(bind, 200);
  }
  window.addEventListener("storage", (e) => {
    if (e.key === LIVE_REV_KEY) scheduleBind();
  });
  window.addEventListener("csc-director-live-sync", scheduleBind);
})();
