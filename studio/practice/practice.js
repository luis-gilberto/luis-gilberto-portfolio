/* ============================================================
   LG Studio — The Practice · turnkey behaviour layer
   Vanilla JS. No dependencies. Safe to defer.
   Everything is scoped to the [data-lg-practice] wrapper.
   ============================================================ */
(function () {
  "use strict";

  var COPY = {
  "en": {
    "htmlLang": "en",
    "meta": {
      "title": "LG Studio: The Practice",
      "description": "Why LG Studio begins with a read: how visible symptoms differ from underlying conditions, the two ways to begin, and how Read / Direct / Build organizes the work.",
      "ogTitle": "LG Studio: The Practice",
      "ogDescription": "Marketing failure rarely begins in marketing. The read that finds the cause before intervening in the effect."
    },
    "nav": {
      "skip": "Skip to content",
      "identity": "Identity",
      "properties": "Properties",
      "navLabel": "LG Studio navigation",
      "primary": "Primary",
      "mobilePrimary": "Mobile primary",
      "siteNav": "Site navigation",
      "brand": "LG Studio",
      "practice": "Practice",
      "work": "Work",
      "cta": "Let’s talk",
      "menu": "Menu",
      "close": "Close",
      "contact": "Contact",
      "language": "Language"
    },
    "rail": {
      "label": "Chapters",
      "thePractice": "The Practice",
      "whyTheRead": "Why the read",
      "architecture": "Closer to the source",
      "twoReads": "Two ways to begin",
      "waysToBegin": "Read / Direct / Build",
      "goDeeper": "Go deeper"
    },
    "hero": {
      "eyebrow": "The Practice",
      "line1": "What sometimes",
      "line2": "appears to be a",
      "line3a": "marketing failure ",
      "line3accent": "rarely",
      "line4": "begins in marketing",
      "p1": "Growth slows. Leads become inconsistent. The website no longer feels right. Teams begin questioning the messaging, the campaign, the brand, or the sales process. These are often treated as marketing problems because marketing is where they become visible.",
      "p2": "But the source may lie elsewhere. A company can outgrow the story it has been telling about itself. Markets shift while old assumptions remain in place. Different parts of an organization begin describing the same thing in different ways. Over time, those conditions surface in communication.",
      "pull": "Visible problems matter. They are just not always where the story begins.",
      "p3": "Marketing can clarify a direction. It cannot create one. When the underlying questions remain unresolved, communication often ends up carrying more weight than it should. The work begins by looking beyond the symptom, not to avoid it, but to understand what produced it.",
      "alt": "A calm water surface revealing a deeper submerged landscape below."
    },
    "s01": {
      "eyebrow": "Why the read",
      "heading1": "The visible problem",
      "heading2": "is rarely the whole problem",
      "lens1": "The symptom appears where it can be seen",
      "lens2": "The cause often does not",
      "p1": "A company revises its website three times in two years and still struggles to explain what it does. A sales team asks for better marketing while prospects continue asking the same questions. A business invests more effort into communication but finds itself having the same conversations six months later.",
      "pull": "The work changes. The questions remain.",
      "p2": "This does not mean the website was unimportant. Or that marketing does not matter. It means that communication often reveals conditions that already exist. Sometimes the words are unclear. Sometimes the offer has drifted, or the market has changed, or different parts of the organization are working from different assumptions. Until those conditions are understood, it becomes difficult to know what should actually be fixed.",
      "p3": "The visible problem is real. Growth slows. Leads become inconsistent. The message feels unclear, customers hesitate, and teams feel pressure to act. These are the moments that attract attention. They are tangible, measurable, and difficult to ignore.",
      "icebergAlt": "Iceberg showing a small visible peak above water and a much larger structure below the surface.",
      "noteAbove": "what shows",
      "noteBelow": "what shapes it",
      "caption": "What is less visible are the questions that have not yet been answered, the assumptions that no longer hold, and the decisions whose consequences only become apparent later. A company may have outgrown its original story. A market may have shifted while internal thinking remained the same. Different parts of an organisation may be moving toward different interpretations of the future.",
      "captionPull": "The visible problem is rarely imagined. It is simply not always alone."
    },
    "s02": {
      "heading": "We move closer to the source",
      "p1": "Most problems arrive with an obvious explanation. Growth slows, so marketing becomes the concern. The website feels dated, so it is redesigned. The message feels unclear, so it is rewritten.",
      "p2": "Sometimes those actions help. Sometimes they do not. Not because the response was wrong, but because it addressed where the condition appeared rather than what may have produced it.",
      "p3": "A company can spend months refining its message and still struggle to explain why customers choose it. Another can redesign its website and find itself having the same conversations six months later. A leadership team can agree on goals while holding very different ideas about what the organisation actually is.",
      "p4": "What begins as a question about communication often becomes a conversation about something else. The work moves gradually from what is visible toward what is influencing it. Not in search of hidden complexity.",
      "pull": "In search of enough clarity to know what deserves attention and what does not."
    },
    "s03": {
      "eyebrow": "Two ways to begin",
      "heading": "Every engagement begins with one of two reads",
      "aside": "Some situations arrive with urgency. A launch is approaching, growth has stalled, a decision needs to be made.",
      "card1Title": "Read the Situation",
      "card1Body": "The question is immediate and practical: what is happening here? A read of the market, the context, and the problem as it actually presents.",
      "card1Link": "Explore StrategyIQ",
      "card1Alt": "Strategic analysis workspace mapping market signals, competitive context, and opportunity.",
      "card2Title": "Read the Practice",
      "card2Body": "Other situations arrive differently. Less as a problem to solve and more as a pattern that keeps returning. The same questions. The same tensions. The same uncertainty showing up in different forms. The question becomes: what are we missing?",
      "card2Link": "Explore El Retrato",
      "card2Alt": "Editorial workspace exploring source material, visual patterns, sequencing, and creative direction.",
      "siblings": "Sibling chapters:",
      "closing": "One read focuses on the situation. The other focuses on the practice behind it. Both begin from the same place: paying attention to what is present before deciding what it means."
    },
    "s04": {
      "eyebrow": "Our architecture",
      "heading": "Read / Direct / Build",
      "intro": "Once the read makes what matters visible, the work continues: deciding what should lead, aligning the path, and building what lasts.",
      "steps": [
        {
          "title": "Read",
          "lede": "Make visible what matters.",
          "body": "Before deciding what to do, we observe what is already present. Patterns, tensions, contradictions, and signals that usually stay hidden behind the visible problems."
        },
        {
          "title": "Direct",
          "lede": "Decide with clarity. Align the path.",
          "body": "Once what matters becomes visible, the task is to decide what deserves attention, what should lead, and how to align the organisation around a shared direction."
        },
        {
          "title": "Build",
          "lede": "Create what lasts. Make it real.",
          "body": "Decisions only gain value when they take shape. Building turns clarity and direction into something tangible, consistent, and able to hold over time."
        }
      ]
    },
    "s05": {
      "eyebrow": "Go deeper",
      "heading": "The longer argument lives elsewhere",
      "aside": "Some ideas require more space. Not because they are complicated, but because they take time to unfold.",
      "cards": [
        {
          "meta": "EN · Insights",
          "title": "The Pattern I Couldn’t Ignore",
          "desc": "Founding / origin essay · why the pattern kept appearing."
        },
        {
          "meta": "EN · Insights",
          "title": "The Translation Problem",
          "desc": "Editorial lens · what gets lost between intention and expression."
        },
        {
          "meta": "Methodology",
          "title": "El Retrato",
          "desc": "Entry to Read the Practice · then El Revelado and El Encuadre."
        },
        {
          "meta": "Instrument",
          "title": "StrategyIQ",
          "desc": "Read the Situation · diagnostic instrument for clarity and decision."
        }
      ],
      "closing": "The essays are a place for observations gathered over years of work, conversations, and practice. They are not instructions. They are attempts to understand. Some begin with communication. Others begin somewhere else entirely. Most end up circling the same question.",
      "thesis": "What becomes possible once we start paying attention to what is actually there?",
      "cta": "Let’s talk"
    }
  },
  "es": {
    "htmlLang": "es",
    "meta": {
      "title": "La Práctica de LG",
      "description": "Por qué LG Studio comienza con una lectura: cómo los síntomas visibles se diferencian de las condiciones que los producen, las dos formas de comenzar y cómo Leer, Conversar y Construir organizan el trabajo.",
      "ogTitle": "La Práctica de LG",
      "ogDescription": "Lo que parece un problema de marketing rara vez comienza en marketing. Una lectura que busca la causa antes de intervenir en el efecto."
    },
    "nav": {
      "skip": "Saltar al contenido",
      "identity": "Identidad",
      "properties": "Propiedades",
      "navLabel": "Navegación de LG Studio",
      "primary": "Principal",
      "mobilePrimary": "Principal móvil",
      "siteNav": "Navegación del sitio",
      "brand": "LG Studio",
      "practice": "La Práctica",
      "work": "Proyectos",
      "cta": "Conversemos",
      "menu": "Menú",
      "close": "Cerrar",
      "contact": "Contacto",
      "language": "Idioma"
    },
    "rail": {
      "label": "Capítulos",
      "thePractice": "La Práctica",
      "whyTheRead": "Por qué una lectura",
      "architecture": "La Fuente",
      "twoReads": "Dos maneras de empezar",
      "waysToBegin": "Leer / Dirigir / Construir",
      "goDeeper": "Profundizar"
    },
    "hero": {
      "eyebrow": "La Práctica",
      "line1": "Lo que a veces",
      "line2": "parece un fracaso",
      "line3a": "de marketing ",
      "line3accent": "rara vez",
      "line4": "comienza en marketing",
      "p1": "El crecimiento se desacelera. Los prospectos llegan de forma irregular. El sitio web ya no se siente bien. Los equipos empiezan a cuestionar el mensaje, la campaña, la marca o el proceso de ventas. Todos estos casos suelen tratarse como problemas de marketing porque es allí donde se vuelven visibles. Sin embargo, el origen podría estar en otra parte.",
      "p2": "Una empresa puede superar la historia que venía contando sobre sí misma. Los mercados cambian mientras las viejas suposiciones siguen en pie. Distintas áreas de una organización empiezan a describir lo mismo de maneras distintas. Con el tiempo, esas condiciones salen a la superficie en la comunicación.",
      "pull": "Los problemas visibles importan. Pero no siempre son el comienzo de la historia.",
      "p3": "El marketing puede aclarar una dirección. No puede crearla. Cuando las preguntas de fondo siguen sin resolverse, la comunicación termina cargando más peso del que le corresponde. El trabajo comienza mirando más allá del síntoma, no para evitarlo, sino para entender qué lo produjo.",
      "alt": "Una superficie de agua en calma que deja ver un paisaje sumergido más profundo."
    },
    "s01": {
      "eyebrow": "Por qué una lectura",
      "heading1": "El problema visible",
      "heading2": "rara vez es el problema completo",
      "lens1": "El síntoma aparece donde puede verse",
      "lens2": "La causa rara vez lo hace",
      "p1": "Una empresa rehace su sitio web tres veces en dos años y aún le cuesta explicar cuál es su verdadero propósito. Un equipo de ventas pide mejor marketing mientras los prospectos siguen haciendo las mismas preguntas. Una empresa puede dedicar mucho esfuerzo a definir su mensaje y aun así encontrarse explicando lo mismo seis meses después.",
      "pull": "El trabajo cambia. Las preguntas permanecen.",
      "p2": "Esto no significa que el sitio web no importara. Ni que el marketing no cuente. Significa que la comunicación suele revelar condiciones que ya existían. A veces las palabras no son claras. A veces la oferta se desvió, o el mercado cambió, o distintas áreas trabajan desde suposiciones distintas. Hasta entender esas condiciones, es difícil saber qué hay que arreglar realmente.",
      "p3": "El problema visible también es real. El crecimiento se ha desacelerado. Los prospectos se han vuelto irregulares. El mensaje se siente confuso, por lo que los clientes dudan y los equipos sienten la presión de actuar. Todos estos son problemas reales y, precisamente por eso, atraen la atención. Son tangibles, medibles y difíciles de ignorar.",
      "icebergAlt": "Iceberg con una pequeña punta visible sobre el agua y una estructura mucho mayor bajo la superficie.",
      "noteAbove": "lo visible",
      "noteBelow": "lo que lo forma",
      "caption": "Lo menos visible son las preguntas que aún no tienen respuesta, las suposiciones que han dejado de ser válidas y las decisiones cuyas consecuencias solo se hacen evidentes con el tiempo. Una empresa puede haber dejado atrás la narrativa con la que comenzó. Un mercado puede haber cambiado mientras la forma de pensar dentro de la organización permaneció igual. Distintas áreas de la empresa pueden estar avanzando hacia visiones diferentes del futuro.",
      "captionPull": "El problema visible rara vez es imaginario. Simplemente, no suele ser el único problema."
    },
    "s02": {
      "heading": "Nos acercamos a la fuente",
      "p1": "Casi todos los problemas llegan con una explicación evidente. El crecimiento se frena, entonces la preocupación es el marketing. El sitio se ve viejo, entonces se rediseña. El mensaje no es claro, entonces se reescribe.",
      "p2": "A veces esas acciones ayudan. A veces no. No porque la respuesta fuera equivocada, sino porque atendió el lugar donde apareció la condición y no las condiciones que la produjeron.",
      "p3": "Una empresa puede pasar meses afinando su mensaje y aún así no lograr explicar por qué la eligen sus clientes. Otra puede rediseñar su sitio y seis meses después estar en las mismas conversaciones. Un equipo directivo puede coincidir en los objetivos y sostener ideas muy distintas sobre lo que la organización realmente es.",
      "p4": "Lo que empieza como una pregunta sobre comunicación suele convertirse en una conversación sobre otra cosa. Es ahí donde el trabajo empieza a desplazarse poco a poco desde lo visible hacia aquello que lo está influyendo. No en busca de una complejidad oculta, sino de la claridad necesaria para entender qué merece atención y qué no.",
      "pull": ""
    },
    "s03": {
      "eyebrow": "Dos maneras de empezar",
      "heading": "Todo proyecto comienza con una de dos lecturas",
      "aside": "Algunas situaciones llegan con urgencia. Se acerca un lanzamiento, el crecimiento se estancó, hay que tomar una decisión.",
      "card1Title": "Leer la Situación",
      "card1Body": "La pregunta es inmediata y práctica: ¿qué está pasando aquí? Una lectura del mercado, del contexto y del problema tal como se presenta.",
      "card1Link": "Explorar StrategyIQ",
      "card1Alt": "Espacio de análisis estratégico donde se mapean señales del mercado, contexto competitivo y oportunidades.",
      "card2Title": "Leer la Práctica",
      "card2Body": "Otras situaciones llegan distinto. Menos como un problema por resolver y más como un patrón que vuelve. Las mismas preguntas. Las mismas tensiones. La misma incertidumbre apareciendo de formas distintas. La pregunta pasa a ser: ¿qué se nos está escapando?",
      "card2Link": "Explorar El Retrato",
      "card2Alt": "Espacio editorial que explora material de origen, patrones visuales, secuencia y dirección creativa.",
      "siblings": "Capítulos relacionados:",
      "closing": "Una lectura se concentra en la situación. La otra se concentra en la práctica que hay detrás. Ambas comienzan desde el mismo lugar: prestar atención a lo que está presente antes de decidir qué significa."
    },
    "s04": {
      "eyebrow": "Nuestra arquitectura",
      "heading": "Leer / Dirigir / Construir",
      "intro": "Después de que la lectura hace visible lo que importa, el trabajo continúa: decidir qué debe liderar, alinear el camino y construir lo que perdura.",
      "steps": [
        {
          "title": "Leer",
          "lede": "Hacer visible lo que importa.",
          "body": "Antes de decidir qué hacer, observamos lo que ya está presente. Patrones, tensiones, contradicciones y señales que suelen quedar ocultas detrás de los problemas visibles."
        },
        {
          "title": "Dirigir",
          "lede": "Decidir con claridad. Alinear el camino.",
          "body": "Una vez que lo importante se vuelve visible, la tarea es decidir qué merece atención, qué debe liderar y cómo alinear a la organización en torno a una dirección compartida."
        },
        {
          "title": "Construir",
          "lede": "Crear lo que perdura. Hacerlo real.",
          "body": "Las decisiones solo adquieren valor cuando toman forma. Construir es convertir claridad y dirección en algo tangible, consistente y capaz de sostenerse en el tiempo."
        }
      ]
    },
    "s05": {
      "eyebrow": "Profundizar",
      "heading": "El argumento más largo vive en otra parte",
      "aside": "Algunas ideas necesitan más espacio. No porque sean complicadas, sino porque tardan en desplegarse.",
      "cards": [
        {
          "meta": "EN · Insights",
          "title": "The Pattern I Couldn’t Ignore",
          "desc": "Ensayo de origen · por qué el patrón seguía apareciendo."
        },
        {
          "meta": "EN · Insights",
          "title": "The Translation Problem",
          "desc": "Mirada editorial · lo que se pierde entre la intención y la expresión."
        },
        {
          "meta": "Metodología",
          "title": "El Retrato",
          "desc": "Entrada a Leer la Práctica · luego El Revelado y El Encuadre."
        },
        {
          "meta": "Instrumento",
          "title": "StrategyIQ",
          "desc": "Leer la Situación · instrumento de diagnóstico para ganar claridad y decidir."
        }
      ],
      "closing": "Los ensayos son un lugar para observaciones reunidas en años de trabajo, conversaciones y práctica. No son instrucciones. Son intentos de entender. Algunos empiezan por la comunicación. Otros empiezan en un lugar completamente distinto. Casi todos terminan rondando la misma pregunta.",
      "thesis": "¿Qué ocurre cuando prestas atención a lo que verdaderamente está ahí?",
      "cta": "Conversemos"
    }
  }
};

  var root = document.querySelector("[data-lg-practice]");
  if (!root) return;

  var STORAGE_KEY = "lg-lang";
  var LEGACY_KEY = "studio-lang";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- helpers ---------------------------------------------- */
  function get(dict, path) {
    var cur = dict;
    var parts = path.split(".");
    for (var i = 0; i < parts.length; i++) {
      if (cur == null) return undefined;
      cur = cur[parts[i]];
    }
    return cur;
  }

  function readStoredLang() {
    try {
      var primary = window.localStorage.getItem(STORAGE_KEY);
      if (primary === "en" || primary === "es") return primary;
      var legacy = window.localStorage.getItem(LEGACY_KEY);
      if (legacy === "en" || legacy === "es") return legacy;
    } catch (e) {}
    return null;
  }

  function persistLang(next) {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
      window.localStorage.setItem(LEGACY_KEY, next);
    } catch (e) {}
  }

  /* ---------- 1 · LANGUAGE ------------------------------------------ */
  var lang = "en";
  function applyLang(next) {
    var dict = COPY[next];
    if (!dict) return;
    lang = next;

    root.querySelectorAll("[data-i18n]").forEach(function (el) {
      var v = get(dict, el.getAttribute("data-i18n"));
      if (typeof v !== "string") return;
      el.textContent = v;
      if (el.hasAttribute("data-i18n-optional")) el.hidden = v.trim() === "";
    });

    root.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(",").forEach(function (pair) {
        var bits = pair.split(":");
        var v = get(dict, bits[1].trim());
        if (typeof v === "string") el.setAttribute(bits[0].trim(), v);
      });
    });

    /* toggle state (header + drawer) */
    root.querySelectorAll(".ed-nav-lang-toggle").forEach(function (group) {
      group.setAttribute("data-lang", next);
    });
    root.querySelectorAll("[data-lang-set]").forEach(function (b) {
      var on = b.getAttribute("data-lang-set") === next;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });

    /* Host page owns <head> metadata; only sync document language. */
    document.documentElement.lang = dict.htmlLang;
  }

  var stored = readStoredLang();
  if (stored === "en" || stored === "es") applyLang(stored);
  else if ((navigator.language || "").toLowerCase().indexOf("es") === 0) applyLang("es");
  else applyLang("en");

  root.querySelectorAll("[data-lang-set]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var next = btn.getAttribute("data-lang-set");
      applyLang(next);
      persistLang(next);
    });
  });

  /* ---------- 2 · HERO READY (masked headline reveal) --------------- */
  var hero = root.querySelector(".prac-open");
  if (hero) window.setTimeout(function () { hero.classList.add("is-ready"); }, 60);

  /* ---------- 3 · SCROLL REVEAL ------------------------------------- */
  (function reveal() {
    var SELECTOR = "[data-reveal], .rule-draw, .layers, .prac-iceberg";
    var query = function () { return Array.prototype.slice.call(root.querySelectorAll(SELECTOR)); };
    var nodes = query();

    if (typeof IntersectionObserver === "undefined" || reduced.matches) {
      nodes.forEach(function (n) { n.classList.add("is-in"); });
      if (reduced.matches) {
        new MutationObserver(function () {
          query().forEach(function (n) { n.classList.add("is-in"); });
        }).observe(root, { childList: true, subtree: true });
      }
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -4% 0px", threshold: 0.05 });

    nodes.forEach(function (n) { io.observe(n); });

    new MutationObserver(function () {
      query().forEach(function (n) { if (!n.classList.contains("is-in")) io.observe(n); });
    }).observe(root, { childList: true, subtree: true });

    var lightVisible = function () {
      query().forEach(function (n) {
        if (n.classList.contains("is-in")) return;
        var r = n.getBoundingClientRect();
        if (r.bottom > 0 && r.top < window.innerHeight) {
          n.classList.add("is-in");
          io.unobserve(n);
        }
      });
    };
    window.addEventListener("scroll", lightVisible, { passive: true });
    window.addEventListener("resize", lightVisible);
    window.setTimeout(lightVisible, 900);
  })();

  /* ---------- 4 · NAV: condensed state + reading progress ----------- */
  (function nav() {
    var bar = root.querySelector(".nav");
    var progress = root.querySelector("[data-nav-progress]");
    if (!bar) return;
    var frame = 0;
    var onScroll = function () {
      if (frame) return;
      frame = window.requestAnimationFrame(function () {
        frame = 0;
        var y = window.scrollY;
        bar.classList.toggle("is-condensed", y > 40);
        var max = document.documentElement.scrollHeight - window.innerHeight;
        var ratio = max > 0 ? Math.min(1, y / max) : 0;
        if (progress) progress.style.setProperty("--progress", String(ratio));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  })();

  /* ---------- 5 · MOBILE DRAWER ------------------------------------- */
  (function drawer() {
    var panel = root.querySelector("#ed-nav-drawer");
    var toggle = root.querySelector("[data-drawer-open]");
    if (!panel || !toggle) return;
    var open = function (state) {
      panel.classList.toggle("is-open", state);
      panel.setAttribute("aria-hidden", state ? "false" : "true");
      if (state) panel.removeAttribute("hidden"); else panel.setAttribute("hidden", "");
      toggle.setAttribute("aria-expanded", state ? "true" : "false");
      root.classList.toggle("ed-nav-drawer-open", state);
      document.body.style.overflow = state ? "hidden" : "";
    };
    toggle.addEventListener("click", function () { open(true); });
    panel.querySelectorAll("[data-drawer-close], .ed-nav-drawer-link").forEach(function (el) {
      el.addEventListener("click", function () { open(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && panel.classList.contains("is-open")) open(false);
    });
  })();

  /* ---------- 6 · CHAPTER RAIL (active chapter + surface inversion) -- */
  (function rail() {
    var railEl = root.querySelector(".chapter-rail");
    if (!railEl) return;
    var links = Array.prototype.slice.call(railEl.querySelectorAll("a"));
    var ids = links.map(function (a) { return a.getAttribute("href").slice(1); });
    var sections = ids.map(function (id) { return root.querySelector("#" + id); }).filter(Boolean);
    if (!sections.length) return;

    if (typeof IntersectionObserver !== "undefined") {
      var io = new IntersectionObserver(function (entries) {
        var hit = entries.filter(function (e) { return e.isIntersecting; })
          .sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; })[0];
        if (!hit) return;
        var el = hit.target;
        links.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + el.id);
        });
        railEl.setAttribute("data-surface-mode", el.dataset.surface === "ink" ? "ink" : "paper");
        railEl.classList.toggle("is-visible", el.id !== "the-practice");
      }, { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.2, 0.5, 1] });
      sections.forEach(function (s) { io.observe(s); });
    }

    /* smooth in-page scrolling without a global html { scroll-behavior } */
    links.forEach(function (a) {
      a.addEventListener("click", function (e) {
        var target = root.querySelector(a.getAttribute("href"));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: reduced.matches ? "auto" : "smooth", block: "start" });
      });
    });
    var skip = root.querySelector(".studio-skip");
    if (skip) skip.addEventListener("click", function (e) {
      var main = root.querySelector("#studio-main");
      if (!main) return;
      e.preventDefault();
      main.scrollIntoView({ behavior: "auto", block: "start" });
    });
  })();

  /* ---------- 7 · ICEBERG DEPTH PARALLAX ---------------------------- */
  (function depth() {
    var el = root.querySelector("[data-depth]");
    if (!el || reduced.matches) return;
    var frame = 0;
    var update = function () {
      frame = 0;
      var r = el.getBoundingClientRect();
      var span = window.innerHeight + r.height;
      var p = Math.min(1, Math.max(0, (window.innerHeight - r.top) / span));
      el.style.setProperty("--depth", p.toFixed(4));
    };
    var onScroll = function () {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
  })();
})();
