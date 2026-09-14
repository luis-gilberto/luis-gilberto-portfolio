(function () {
  var FILM = {
    motion: "kitchen/costello/artifacts/how-the-work-connects/current/Costello_How_The_Work_Connects_motion.html",
    static: "kitchen/costello/artifacts/how-the-work-connects/current/Costello_How_The_Work_Connects_static.html",
    poster: "kitchen/costello/artifacts/how-the-work-connects/current/poster.png",
    end: 114.3,
    runtime: "1:54"
  };
  var END = FILM.end;
  var RUNTIME = FILM.runtime;
  var stage = document.getElementById("connect-stage");
  var watchBtn = document.getElementById("connect-watch");
  var systemBtn = document.getElementById("connect-system");
  var present = document.getElementById("connect-present");
  if (!stage || !watchBtn || !systemBtn || !present) return;

  var canvas = present.querySelector(".lg-present-canvas");
  var frame = present.querySelector("#connect-frame");
  var playBtn = present.querySelector("#present-play");
  var replayBtn = present.querySelector("#present-replay");
  var progress = present.querySelector("#present-progress");
  var timeEl = present.querySelector("#present-time");
  var closeBtn = present.querySelector("#present-close");
  var dock = present.querySelector(".lg-present-dock");
  var endLayer = present.querySelector(".lg-present-end");
  var returnBtn = present.querySelector("#present-return");
  var webLink = present.querySelector("#present-web");
  var refLink = present.querySelector("#present-ref");

  var motionSrc = href(FILM.motion) + "?embed=1";
  var staticSrc = href(FILM.static);
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var mode = "film";
  var lastFocus = null;
  var lastScroll = 0;
  var poll = 0;
  var hideDock = 0;
  var origin = watchBtn;

  function href(rel) {
    return window.CostelloState ? CostelloState.href(rel) : "/studio/" + rel;
  }

  function applyFilm(cur) {
    if (!cur) return;
    if (cur.motion) {
      FILM.motion = cur.motion;
      motionSrc = href(FILM.motion) + "?embed=1";
    }
    if (cur.static) {
      FILM.static = cur.static;
      staticSrc = href(FILM.static);
    }
    if (cur.poster) FILM.poster = cur.poster;
    if (cur.end) END = cur.end;
    if (cur.runtime) RUNTIME = cur.runtime;
    var img = stage.querySelector("img");
    if (img && FILM.poster) img.src = href(FILM.poster);
    setTime(0);
  }

  if (webLink) webLink.href = href("kitchen/costello/plans/costello-website-launch-plan.html");
  if (refLink) refLink.href = href("kitchen/costello/plans/costello-referral-letter-campaign-plan.html");
  var webPlan = document.getElementById("plans-web");
  var refPlan = document.getElementById("plans-ref");
  if (webPlan) webPlan.href = href("kitchen/costello/plans/costello-website-launch-plan.html");
  if (refPlan) refPlan.href = href("kitchen/costello/plans/costello-referral-letter-campaign-plan.html");

  function film() {
    try { return frame.contentWindow && frame.contentWindow.CostelloFilm; } catch (e) { return null; }
  }

  function fmt(sec) {
    var s = Math.max(0, Math.min(END, sec || 0));
    var m = Math.floor(s / 60);
    var r = Math.floor(s % 60);
    return m + ":" + (r < 10 ? "0" : "") + r;
  }

  function setTime(sec) {
    if (timeEl) timeEl.textContent = fmt(sec) + " / " + RUNTIME;
    if (progress) progress.value = String(Math.round((sec / END) * 1000));
    if (playBtn) {
      var api = film();
      var paused = !api || api.isPaused() || api.isDone() || api.getTime() === 0;
      playBtn.textContent = paused && api && !api.isDone() && api.getTime() > 0 ? "Play" : "Pause";
      if (!api || api.getTime() === 0) playBtn.textContent = "Play";
      if (api && !api.isPaused() && api.getTime() > 0 && !api.isDone()) playBtn.textContent = "Pause";
    }
  }

  function targetRect() {
    var pad = window.innerWidth < 700 ? 16 : 48;
    var top = 56;
    var bottom = mode === "film" ? 72 : 48;
    var maxW = window.innerWidth - pad * 2;
    var maxH = window.innerHeight - top - bottom;
    var w = maxW;
    var h = w * 9 / 16;
    if (h > maxH) {
      h = maxH;
      w = h * 16 / 9;
    }
    return {
      left: Math.round((window.innerWidth - w) / 2),
      top: Math.round(top + (maxH - h) / 2),
      width: Math.round(w),
      height: Math.round(h)
    };
  }

  function applyRect(rect) {
    canvas.style.left = rect.left + "px";
    canvas.style.top = rect.top + "px";
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";
  }

  function previewRect() {
    var box = stage.getBoundingClientRect();
    return { left: box.left, top: box.top, width: box.width, height: box.height };
  }

  function trap(e) {
    if (e.key !== "Tab" || present.hidden) return;
    var nodes = present.querySelectorAll("button, a[href], input");
    var list = Array.prototype.filter.call(nodes, function (el) {
      return !el.disabled && el.offsetParent !== null;
    });
    if (!list.length) return;
    var first = list[0];
    var last = list[list.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function armDock() {
    present.classList.add("is-armed");
    clearTimeout(hideDock);
    hideDock = setTimeout(function () { present.classList.remove("is-armed"); }, 1800);
  }

  function watchEnd() {
    clearInterval(poll);
    poll = setInterval(function () {
      var api = film();
      if (!api) return;
      setTime(api.getTime());
      if (api.isDone() || api.getTime() >= END - 0.05) {
        present.classList.add("is-resolved");
        setTime(END);
      }
    }, 200);
  }

  function isMotion() {
    var src = frame.getAttribute("src") || "";
    return /Costello_How_The_Work_Connects_motion\.html|Costello_Ecosystem_Master_Frame_motion\.html/.test(src);
  }

  function kickFilm() {
    var api = film();
    if (!api) return false;
    if (reduce) {
      if (api.finalFrame) api.finalFrame();
      present.classList.add("is-resolved");
      setTime(END);
      return true;
    }
    if (api.playFromStart) api.playFromStart();
    else if (api.play) api.play();
    watchEnd();
    return true;
  }

  function startFilm() {
    if (kickFilm()) return;
    var n = 0;
    var wait = setInterval(function () {
      n += 1;
      if (kickFilm() || n > 80) clearInterval(wait);
    }, 50);
  }

  function open(nextMode, from) {
    origin = from || watchBtn;
    lastFocus = document.activeElement;
    lastScroll = window.scrollY;
    mode = nextMode;
    present.hidden = false;
    present.classList.remove("is-resolved", "is-moving", "is-armed");
    document.body.classList.add("is-presenting");
    dock.hidden = mode !== "film";
    endLayer.hidden = false;
    if (mode === "film" && !reduce) {
      if (!isMotion()) frame.src = motionSrc;
      else startFilm();
    } else {
      frame.src = staticSrc;
    }
    applyRect(previewRect());
    requestAnimationFrame(function () {
      present.classList.add("is-moving");
      applyRect(targetRect());
    });
    setTimeout(function () {
      present.classList.remove("is-moving");
      if (mode === "film") startFilm();
      else {
        present.classList.add("is-resolved");
        setTime(END);
      }
      closeBtn.focus();
    }, reduce ? 0 : 720);
    setTime(0);
  }

  function close() {
    clearInterval(poll);
    present.classList.remove("is-resolved");
    if (!reduce) {
      present.classList.add("is-moving");
      applyRect(previewRect());
    }
    var finish = function () {
      var api = film();
      if (api && api.pause) api.pause();
      present.hidden = true;
      present.classList.remove("is-moving", "is-armed");
      document.body.classList.remove("is-presenting");
      if (mode === "system") frame.src = motionSrc;
      window.scrollTo(0, lastScroll);
      (lastFocus || origin).focus();
    };
    if (reduce) finish();
    else setTimeout(finish, 700);
  }

  frame.addEventListener("load", function () {
    if (present.hidden || mode !== "film") return;
    startFilm();
  });

  function preload() {
    if (!reduce && !frame.getAttribute("src")) frame.src = motionSrc;
  }
  if (window.CostelloState && CostelloState.load) {
    CostelloState.load().then(function (state) {
      applyFilm(state.film && state.film.current);
      preload();
    }).catch(preload);
  } else {
    preload();
  }

  watchBtn.addEventListener("click", function (e) { e.preventDefault(); open("film", watchBtn); });
  systemBtn.addEventListener("click", function (e) { e.preventDefault(); open("system", systemBtn); });
  closeBtn.addEventListener("click", close);
  if (returnBtn) returnBtn.addEventListener("click", close);

  playBtn.addEventListener("click", function () {
    var api = film();
    if (!api) return;
    if (api.isDone()) api.play();
    else api.toggle();
    setTime(api.getTime());
  });

  replayBtn.addEventListener("click", function () {
    var api = film();
    present.classList.remove("is-resolved");
    if (api && api.replay) api.replay();
    else if (api) api.play();
    setTime(0);
    watchEnd();
  });

  present.addEventListener("mousemove", armDock);
  present.addEventListener("keydown", function (e) {
    trap(e);
    if (e.key === "Escape") { e.preventDefault(); close(); }
    if (mode !== "film") return;
    var api = film();
    if (e.key === " " || e.code === "Space") {
      e.preventDefault();
      if (api) {
        if (api.isDone()) api.play();
        else api.toggle();
      }
    }
    if ((e.key === "r" || e.key === "R") && api) {
      e.preventDefault();
      present.classList.remove("is-resolved");
      if (api.replay) api.replay();
      else api.play();
      watchEnd();
    }
    if ((e.key === "f" || e.key === "F") && api) {
      e.preventDefault();
      api.finalFrame();
      present.classList.add("is-resolved");
      setTime(END);
    }
  });

  window.addEventListener("resize", function () {
    if (present.hidden) return;
    applyRect(targetRect());
  });
})();
