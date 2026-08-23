/**
 * Case-study side bridge for CSC Image Director module previews.
 * Active when ?directorPreview=1 — applies WORKING instance state from parent,
 * reports real DOM measurements, highlights selected module.
 */
(() => {
  const params = new URLSearchParams(location.search);
  if (params.get("directorPreview") !== "1") return;

  const INSTANCE = params.get("instance") || "";
  const STATE = params.get("state") || "wide";
  const CROP_MAP = { wide: "desktop", compact: "tablet", stacked: "mobile" };

  let workingInst = null;

  function cropKeyForState(state) {
    return CROP_MAP[state] || "desktop";
  }

  function sourceUrl(ref) {
    if (!ref) return null;
    if (ref.remoteUrl) return ref.remoteUrl;
    if (ref.path) return "/" + String(ref.path).replace(/^\/+/, "");
    return null;
  }

  function applyCropVars(el, crop, renderMode) {
    if (!crop) return;
    el.style.setProperty("--crop-fit-desktop", crop.fit || "cover");
    el.style.setProperty("--crop-x-desktop", `${Number(crop.x)}%`);
    el.style.setProperty("--crop-y-desktop", `${Number(crop.y)}%`);
    el.style.setProperty("--crop-zoom-desktop", String(crop.zoom ?? 1));
    el.style.setProperty("--crop-sx-desktop", String(crop.scaleX ?? 1));
    el.style.setProperty("--crop-sy-desktop", String(crop.scaleY ?? 1));
    el.style.setProperty("--crop-fit-tablet", crop.fit || "cover");
    el.style.setProperty("--crop-x-tablet", `${Number(crop.x)}%`);
    el.style.setProperty("--crop-y-tablet", `${Number(crop.y)}%`);
    el.style.setProperty("--crop-zoom-tablet", String(crop.zoom ?? 1));
    el.style.setProperty("--crop-sx-tablet", String(crop.scaleX ?? 1));
    el.style.setProperty("--crop-sy-tablet", String(crop.scaleY ?? 1));
    el.style.setProperty("--crop-fit-mobile", crop.fit || "cover");
    el.style.setProperty("--crop-x-mobile", `${Number(crop.x)}%`);
    el.style.setProperty("--crop-y-mobile", `${Number(crop.y)}%`);
    el.style.setProperty("--crop-zoom-mobile", String(crop.zoom ?? 1));
    el.style.setProperty("--crop-sx-mobile", String(crop.scaleX ?? 1));
    el.style.setProperty("--crop-sy-mobile", String(crop.scaleY ?? 1));
    el.dataset.cscDirected = "1";
    el.classList.add("is-csc-directed");
    if (renderMode) el.dataset.cscRenderMode = renderMode;
  }

  function applyFrameMatte(el, inst) {
    const matte = inst?.render?.frameMatte;
    if (matte && matte !== "match-section") {
      el.dataset.cscFrameMatte = matte;
    } else {
      delete el.dataset.cscFrameMatte;
    }
  }

  function moduleRoot(img) {
    return (
      img.closest(".ops-tile") ||
      img.closest(".gen-card") ||
      img.closest(".artifact") ||
      img.closest(".read-plate") ||
      img.closest(".start-portrait__frame") ||
      img.closest(".early-frag") ||
      img.closest(".vis-col") ||
      img.closest(".ladder figure") ||
      img.closest(".named-set figure") ||
      img.closest(".hero__visual") ||
      img.closest("figure") ||
      img.parentElement
    );
  }

  function mediaRoot(img) {
    return (
      img.closest(".ops-tile__media") ||
      img.closest(".gen-card__media") ||
      img.parentElement
    );
  }

  function clearHighlights() {
    document.querySelectorAll(".csc-director-highlight").forEach((el) => {
      el.classList.remove("csc-director-highlight");
    });
  }

  function applyWorkingInstance(inst, state) {
    if (!inst?.id) return false;
    const el = document.querySelector(`[data-csc-img="${inst.id}"]`);
    if (!el) return false;

    workingInst = inst;
    const ref = inst.workingSource || inst.approvedSource || inst.source || {};
    const url = sourceUrl(ref);
    if (url) el.setAttribute("src", url);

    const key = ref.remoteUrl || ref.path || "";
    const crops = (key && inst.cropsBySource?.[key]) || inst.crops || {};
    const ck = cropKeyForState(state || STATE);
    applyCropVars(el, crops[ck], inst.renderMode || inst.render?.renderMode);
    applyFrameMatte(el, inst);

    clearHighlights();
    const mod = moduleRoot(el);
    const media = mediaRoot(el);
    if (mod) mod.classList.add("csc-director-highlight");
    if (media && media !== mod) media.classList.add("csc-director-highlight");

    mod?.scrollIntoView({ block: "center", inline: "nearest", behavior: "instant" });
    return true;
  }

  function measureInstance(id, state) {
    const el = document.querySelector(`[data-csc-img="${id}"]`);
    if (!el) return { ok: false, error: "Image not found in DOM" };

    const mod = moduleRoot(el);
    const media = mediaRoot(el);
    const imgRect = el.getBoundingClientRect();
    const modRect = mod?.getBoundingClientRect();
    const mediaRect = media?.getBoundingClientRect();
    const ck = cropKeyForState(state || STATE);
    const crops = workingInst?.crops || {};
    const crop = crops[ck] || {};

    return {
      ok: true,
      instanceId: id,
      state: state || STATE,
      viewport: {
        width: Math.round(document.documentElement.clientWidth),
        height: Math.round(document.documentElement.clientHeight),
      },
      module: modRect
        ? { width: Math.round(modRect.width), height: Math.round(modRect.height) }
        : null,
      mediaFrame: mediaRect
        ? { width: Math.round(mediaRect.width), height: Math.round(mediaRect.height) }
        : null,
      imageFrame: {
        width: Math.round(imgRect.width),
        height: Math.round(imgRect.height),
      },
      aspectRatio: imgRect.height
        ? Number((imgRect.width / imgRect.height).toFixed(3))
        : null,
      objectMode: crop.fit || el.style.objectFit || getComputedStyle(el).objectFit,
      crop: {
        x: crop.x,
        y: crop.y,
        zoom: crop.zoom,
        scaleX: crop.scaleX,
        scaleY: crop.scaleY,
      },
    };
  }

  function reply(type, payload) {
    window.parent.postMessage({ type, ...payload }, "*");
  }

  window.addEventListener("message", (event) => {
    const data = event.data || {};
    if (data.type === "csc-director-apply") {
      const ok = applyWorkingInstance(data.instance, data.state);
      reply("csc-director-applied", { ok, instanceId: data.instance?.id });
      if (ok) {
        requestAnimationFrame(() => {
          reply("csc-director-measurements", {
            measurements: measureInstance(data.instance.id, data.state),
          });
        });
      }
    }
    if (data.type === "csc-director-measure") {
      reply("csc-director-measurements", {
        measurements: measureInstance(data.instanceId || INSTANCE, data.state),
      });
    }
  });

  document.documentElement.dataset.cscDirectorBridge = "1";

  if (INSTANCE) {
    const tryScroll = () => {
      const el = document.querySelector(`[data-csc-img="${INSTANCE}"]`);
      if (el) {
        moduleRoot(el)?.scrollIntoView({ block: "center", inline: "nearest" });
        reply("csc-director-ready", { instanceId: INSTANCE });
      }
    };
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", tryScroll);
    } else {
      setTimeout(tryScroll, 80);
    }
  } else {
    reply("csc-director-ready", { instanceId: null });
  }
})();
