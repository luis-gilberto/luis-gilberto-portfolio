/**
 * Module-aware preview for CSC Image Director (pilot: Rhythm).
 * Renders the real case-study page in an iframe at actual viewport widths.
 */
(() => {
  const PILOT_IDS = new Set(["operations__ops-tile__41"]);
  const CASE_PATH = "/studio/case-studies/criar-sin-culpas/";

  const STATES = {
    wide: {
      label: "WIDE",
      range: "1280–∞",
      cropKey: "desktop",
      widths: [1280, 1440, 1600],
      defaultWidth: 1440,
    },
    compact: {
      label: "COMPACT",
      range: "821–1100",
      cropKey: "tablet",
      widths: [834, 1024, 1100],
      defaultWidth: 1024,
    },
    stacked: {
      label: "STACKED",
      range: "≤820",
      cropKey: "mobile",
      widths: [375, 390, 430],
      defaultWidth: 390,
    },
  };

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  let activeState = "wide";
  let viewportWidth = STATES.wide.defaultWidth;
  let measurements = null;
  let iframeReady = false;
  let pendingInst = null;

  function isPilot(id) {
    return window.CscDirector?.isOnPage?.(id) ?? false;
  }

  function stateForBp(bp) {
    if (bp === "tablet") return "compact";
    if (bp === "mobile") return "stacked";
    return "wide";
  }

  function bpForState(state) {
    return STATES[state]?.cropKey === "tablet"
      ? "tablet"
      : STATES[state]?.cropKey === "mobile"
        ? "mobile"
        : "desktop";
  }

  function showModulePreview(show) {
    const mp = $("#module-preview");
    const gf = $("#generic-frames");
    if (!mp || !gf) return;
    mp.classList.toggle("hidden", !show);
    gf.classList.toggle("hidden", show);
  }

  function iframeUrl(inst) {
    const u = new URL(CASE_PATH, location.origin);
    u.searchParams.set("directorPreview", "1");
    u.searchParams.set("instance", inst.id);
    u.searchParams.set("state", activeState);
    if (inst.usage?.section) u.hash = inst.usage.section;
    return u.pathname + u.search + u.hash;
  }

  function setViewportWidth(w) {
    viewportWidth = w;
    const wrap = $("#module-preview-viewport");
    if (wrap) wrap.style.width = `${w}px`;
    $("#mp-viewport-label").textContent = `${w}px`;
    $$(".mp-width-btn").forEach((b) => {
      b.classList.toggle("is-active", Number(b.dataset.width) === w);
    });
  }

  function renderStateControls() {
    const host = $("#mp-states");
    if (!host) return;
    host.innerHTML = Object.entries(STATES)
      .map(
        ([key, s]) =>
          `<button type="button" class="mp-state-btn${key === activeState ? " is-active" : ""}" data-state="${key}">${s.label}<span>${s.range}px</span></button>`
      )
      .join("");
    host.querySelectorAll(".mp-state-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeState = btn.dataset.state;
        viewportWidth = STATES[activeState].defaultWidth;
        renderStateControls();
        renderWidthControls();
        setViewportWidth(viewportWidth);
        const inst = pendingInst || D().getInst(D().getSelectedId());
        if (inst) syncPreview(inst, true);
      });
    });
  }

  function renderWidthControls() {
    const host = $("#mp-widths");
    if (!host) return;
    const widths = STATES[activeState].widths;
    host.innerHTML =
      `<label class="mp-width-slider">Width <input type="range" id="mp-width-range" min="${Math.min(...widths)}" max="${Math.max(...widths)}" step="1" value="${viewportWidth}" /></label>` +
      widths
        .map(
          (w) =>
            `<button type="button" class="mp-width-btn${w === viewportWidth ? " is-active" : ""}" data-width="${w}">${w}</button>`
        )
        .join("");
    host.querySelectorAll(".mp-width-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        setViewportWidth(Number(btn.dataset.width));
        const inst = pendingInst || D().getInst(D().getSelectedId());
        if (inst) syncPreview(inst, true);
      });
    });
    const range = $("#mp-width-range");
    if (range) {
      range.addEventListener("input", () => {
        setViewportWidth(Number(range.value));
      });
      range.addEventListener("change", () => {
        const inst = pendingInst || D().getInst(D().getSelectedId());
        if (inst) syncPreview(inst, true);
      });
    }
  }

  function renderMeasurements(m) {
    const dl = $("#mp-measurements");
    if (!dl || !m?.ok) {
      if (dl) dl.innerHTML = "<p class='muted'>Measuring…</p>";
      return;
    }
    measurements = m;
    const ratio = m.aspectRatio ? `${m.aspectRatio} : 1` : "—";
    dl.innerHTML = [
      ["Layout state", STATES[activeState]?.label || activeState],
      ["Viewport", `${m.viewport.width} × ${m.viewport.height} CSS px`],
      ["Module", m.module ? `${m.module.width} × ${m.module.height} CSS px` : "—"],
      ["Media frame", m.mediaFrame ? `${m.mediaFrame.width} × ${m.mediaFrame.height} CSS px` : "—"],
      ["Image frame", `${m.imageFrame.width} × ${m.imageFrame.height} CSS px`],
      ["Aspect ratio", ratio],
      ["Object mode", m.objectMode || "—"],
      [
        "Crop / position",
        m.crop
          ? `x ${Number(m.crop.x).toFixed(1)}% · y ${Number(m.crop.y).toFixed(1)}% · zoom ${Number(m.crop.zoom).toFixed(2)}`
          : "—",
      ],
    ]
      .map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`)
      .join("");
    renderSourcePrep(pendingInst || D().getInst(D().getSelectedId()), m);
  }

  function round(n) {
    return Math.round(n);
  }

  function renderSourcePrep(inst, m) {
    const panel = $("#source-prep");
    if (!panel || !inst || !m?.imageFrame) return;

    const fw = m.imageFrame.width;
    const fh = m.imageFrame.height;
    const x1 = { w: fw, h: fh };
    const x2 = { w: fw * 2, h: fh * 2 };
    const x3 = { w: fw * 3, h: fh * 3 };
    const ratio = fw / fh;
    const ratioLabel = `${ratio.toFixed(3)} : 1`;

    const iw = inst.intrinsic?.width || 0;
    const ih = inst.intrinsic?.height || 0;
    const srcOk = iw >= x2.w * 0.95 && ih >= x2.h * 0.95;
    const srcWarn = !srcOk && iw > 0;

    const exportW = round(x2.w);
    const exportH = round(x2.h);
    const export3W = round(x3.w);
    const export3H = round(x3.h);

    panel.innerHTML = `
      <h3>Source preparation</h3>
      <dl class="source-prep__grid">
        <dt>Actual frame (this viewport)</dt><dd>${fw} × ${fh} CSS px</dd>
        <dt>Recommended master (2×)</dt><dd>${exportW} × ${exportH} px</dd>
        <dt>High-detail (3×)</dt><dd>${export3W} × ${export3H} px</dd>
        <dt>Master crop ratio</dt><dd>${ratioLabel}</dd>
        <dt>Current source</dt><dd>${iw ? `${iw} × ${ih} px` : "unknown"}</dd>
        <dt>Resolution gate</dt><dd class="${srcOk ? "is-ok" : srcWarn ? "is-warn" : ""}">${
          srcOk
            ? "SOURCE RESOLUTION SUFFICIENT ✓"
            : srcWarn
              ? `SOURCE TOO SMALL — recommend at least ${exportW} × ${exportH}`
              : "Load source to verify"
        }</dd>
        <dt>Master recommendation</dt><dd>One master ≥ ${exportW} × ${exportH} px supports WIDE / COMPACT / STACKED with breakpoint crops</dd>
      </dl>
      <div class="source-prep__export">
        <strong>Export crop</strong>
        <code id="export-dims">${exportW} × ${exportH} · ratio ${ratioLabel}</code>
        <button type="button" class="btn btn--ghost" id="btn-copy-dims">Copy dimensions</button>
      </div>`;

    $("#btn-copy-dims")?.addEventListener("click", async () => {
      const text = `${exportW}x${exportH} ratio ${ratio.toFixed(4)}:1`;
      try {
        await navigator.clipboard.writeText(text);
        D().toast("Dimensions copied");
      } catch (_) {
        D().toast(text);
      }
    });
  }

  function postApply(inst) {
    const frame = $("#module-preview-iframe");
    if (!frame?.contentWindow) return;
    frame.contentWindow.postMessage(
      {
        type: "csc-director-apply",
        instance: JSON.parse(JSON.stringify(inst)),
        state: activeState,
      },
      "*"
    );
  }

  function syncPreview(inst, reload = false) {
    if (!inst || !isPilot(inst.id)) {
      showModulePreview(false);
      pendingInst = null;
      $("#generic-frames")?.classList.remove("hidden");
      return;
    }
    pendingInst = inst;
    showModulePreview(true);
    renderStateControls();
    renderWidthControls();
    setViewportWidth(viewportWidth);

    const frame = $("#module-preview-iframe");
    if (!frame) return;

    const nextSrc = iframeUrl(inst);
    const needsLoad = reload || frame.dataset.src !== nextSrc;
    frame.dataset.src = nextSrc;

    if (needsLoad) {
      iframeReady = false;
      frame.src = nextSrc;
      frame.onload = () => {
        iframeReady = true;
        postApply(inst);
      };
    } else if (iframeReady) {
      postApply(inst);
    }
  }

  function refresh(inst) {
    if (!inst || !isPilot(inst.id)) return;
    if (iframeReady) postApply(inst);
  }

  function bindMessages() {
    window.addEventListener("message", (event) => {
      const data = event.data || {};
      if (data.type === "csc-director-measurements") {
        renderMeasurements(data.measurements);
      }
      if (data.type === "csc-director-ready") {
        iframeReady = true;
        if (pendingInst) postApply(pendingInst);
      }
    });
  }

  function D() {
    return window.CscDirector;
  }

  function init() {
    bindMessages();
    renderStateControls();
    renderWidthControls();
    setViewportWidth(viewportWidth);
  }

  window.CscModulePreview = {
    isPilot,
    syncPreview,
    refresh,
    stateForBp,
    bpForState,
    getActiveState: () => activeState,
    setActiveState: (s) => {
      activeState = s;
    },
    getViewportWidth: () => viewportWidth,
    getMeasurements: () => measurements,
    contextUrl(inst) {
      if (!inst) return CASE_PATH;
      const u = new URL(CASE_PATH, location.origin);
      u.searchParams.set("directorPreview", "1");
      u.searchParams.set("instance", inst.id);
      u.searchParams.set("state", activeState);
      u.searchParams.set("viewport", String(viewportWidth));
      if (inst.usage?.section) u.hash = inst.usage.section;
      return u.pathname + u.search + u.hash;
    },
    init,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
