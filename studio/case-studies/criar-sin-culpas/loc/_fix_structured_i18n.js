/**
 * Fix structured captions / badges where data-i18n-es is flat text but
 * data-i18n-en contains HTML. Move i18n onto leaf nodes so ES keeps styling.
 *
 * Usage: node loc/_fix_structured_i18n.js
 */
const fs = require("fs");
const path = require("path");

const htmlPath = path.join(__dirname, "..", "index.html");
let html = fs.readFileSync(htmlPath, "utf8");

function escAttr(s) {
  return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function stripParentI18n(openAttrs) {
  return openAttrs
    .replace(/\s+data-i18n-en="[^"]*"/gi, "")
    .replace(/\s+data-i18n-es="[^"]*"/gi, "");
}

const fixes = [
  // scan-care
  {
    id: "scan-care-caption",
    find: /<figcaption class="scan-care__caption" id="scan-care-caption"[^>]*>[\s\S]*?<\/figcaption>/,
    replace: `<figcaption class="scan-care__caption" id="scan-care-caption">
                <span class="ev" data-i18n-en="REAL-WORLD USE" data-i18n-es="USO EN LA VIDA REAL">REAL-WORLD USE</span>
                <p class="cap" data-i18n-en="Short sections, strong visual anchors, and immediate next steps reduced the amount a parent had to interpret while already overwhelmed." data-i18n-es="Secciones cortas, anclas visuales fuertes y próximos pasos inmediatos redujeron lo que una madre o un padre tenía que interpretar mientras ya estaba desbordado.">Short sections, strong visual anchors, and immediate next steps reduced the amount a parent had to interpret while already overwhelmed.</p>
              </figcaption>`,
  },
  // protocol-signal
  {
    id: "protocol-signal-caption",
    find: /<figcaption class="protocol-signal__caption" id="protocol-signal-caption"[^>]*>[\s\S]*?<\/figcaption>/,
    replace: `<figcaption class="protocol-signal__caption" id="protocol-signal-caption">
              <span class="ev" data-i18n-en="EVIDENCE" data-i18n-es="EVIDENCIA">EVIDENCE</span>
              <p class="cap" data-i18n-en="Testing plan · Free support experience → signals → deeper structured offer" data-i18n-es="Plan de prueba · Experiencia de apoyo gratuita → señales → oferta estructurada más profunda">Testing plan · Free support experience → signals → deeper structured offer</p>
            </figcaption>`,
  },
  // social-system
  {
    id: "social-system-caption",
    find: /<figcaption class="social-system__caption" id="social-system-caption"[^>]*>[\s\S]*?<\/figcaption>/,
    replace: `<figcaption class="social-system__caption" id="social-system-caption">
                <span class="ev" data-i18n-en="SYSTEM IN THE MOMENT" data-i18n-es="SISTEMA EN EL MOMENTO">SYSTEM IN THE MOMENT</span>
                <p class="cap" data-i18n-en="Real social moment → structured support on the phone" data-i18n-es="Momento social real → apoyo estructurado en el teléfono">Real social moment → structured support on the phone</p>
              </figcaption>`,
  },
  // social-proof
  {
    id: "social-proof-caption",
    find: /<figcaption class="social-proof__caption" id="social-proof-caption"[^>]*>[\s\S]*?<\/figcaption>/,
    replace: `<figcaption class="social-proof__caption" id="social-proof-caption">
                  <span class="ev" data-i18n-en="DOCUMENTARY + LIVE PRACTICE" data-i18n-es="DOCUMENTAL + PRÁCTICA EN VIVO">DOCUMENTARY + LIVE PRACTICE</span>
                  <p class="cap" data-i18n-en="Cadence in practice · Recurring Reels and audience questions" data-i18n-es="Cadencia en práctica · Reels recurrentes y preguntas de la audiencia">Cadence in practice · Recurring Reels and audience questions</p>
                </figcaption>`,
  },
];

// owned-beat captions (two SHIPPED)
const ownedBeatRe =
  /<figcaption class="owned-beat__caption"\s+data-i18n-en="[^"]*"\s+data-i18n-es="([^"]*)"[^>]*>\s*<span class="(ev[^"]*)">([^<]*)<\/span>\s*<p class="cap">([\s\S]*?)<\/p>\s*<\/figcaption>/gi;

html = html.replace(ownedBeatRe, (full, esFlat, evClass, enLabel, enCap) => {
  const es = esFlat
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");
  let label = "PUBLICADO";
  let body = es;
  if (es.startsWith("PUBLICADO ")) {
    body = es.slice("PUBLICADO ".length);
  }
  return `<figcaption class="owned-beat__caption">
                    <span class="${evClass}" data-i18n-en="${escAttr(enLabel)}" data-i18n-es="${escAttr(label)}">${enLabel}</span>
                    <p class="cap" data-i18n-en="${escAttr(enCap.trim())}" data-i18n-es="${escAttr(body.trim())}">${enCap.trim()}</p>
                  </figcaption>`;
});

// product-evidence captions
const productCapRe =
  /<figcaption class="product-evidence__caption"\s+data-i18n-en="[^"]*"\s+data-i18n-es="([^"]*)"[^>]*>\s*<span class="(ev[^"]*)">([^<]*)<\/span>\s*<p class="cap">([\s\S]*?)<\/p>\s*<\/figcaption>/gi;

html = html.replace(productCapRe, (full, esFlat, evClass, enLabel, enCap) => {
  const es = esFlat.replace(/&quot;/g, '"').replace(/&amp;/g, "&");
  const labels = ["ARQUITECTADO", "EN IMPLEMENTACIÓN"];
  let label = labels.find((l) => es === l || es.startsWith(l + " ")) || enLabel;
  let body = es;
  for (const l of labels) {
    if (es.startsWith(l + " ")) {
      label = l;
      body = es.slice(l.length + 1);
      break;
    }
  }
  return `<figcaption class="product-evidence__caption">
                <span class="${evClass}" data-i18n-en="${escAttr(enLabel)}" data-i18n-es="${escAttr(label)}">${enLabel}</span>
                <p class="cap" data-i18n-en="${escAttr(enCap.trim())}" data-i18n-es="${escAttr(body.trim())}">${enCap.trim()}</p>
              </figcaption>`;
});

// visual-lib gallery figcaptions
const galleryRe =
  /<figcaption\s+data-i18n-en="[^"]*"\s+data-i18n-es="([^"]*)"[^>]*>\s*<span class="visual-lib-gallery__name">([^<]*)<\/span>\s*<span class="visual-lib-gallery__meta">([^<]*)<\/span>\s*<\/figcaption>/gi;

html = html.replace(galleryRe, (full, esFlat, enName, enMeta) => {
  const es = esFlat.replace(/&quot;/g, '"').replace(/&amp;/g, "&");
  const name = enName.trim();
  let metaEs = es;
  if (es.startsWith(name + " ")) metaEs = es.slice(name.length + 1);
  return `<figcaption>
                <span class="visual-lib-gallery__name" data-i18n-en="${escAttr(name)}" data-i18n-es="${escAttr(name)}">${name}</span>
                <span class="visual-lib-gallery__meta" data-i18n-en="${escAttr(enMeta.trim())}" data-i18n-es="${escAttr(metaEs.trim())}">${enMeta.trim()}</span>
              </figcaption>`;
});

// social-signal steps
const socialStepRe =
  /<li class="social-signal__step"\s+data-i18n-en="[^"]*"\s+data-i18n-es="([^"]*)"[^>]*>\s*<p class="social-signal__k">([^<]*)<\/p>\s*<p class="(social-signal__v[^"]*)">([\s\S]*?)<\/p>\s*<\/li>/gi;

html = html.replace(socialStepRe, (full, esFlat, enK, vClass, enV) => {
  const es = esFlat.replace(/&quot;/g, '"').replace(/&amp;/g, "&");
  const map = {
    Cadence: "Cadencia",
    Questions: "Preguntas",
    Responses: "Respuestas",
  };
  const esK = map[enK.trim()] || enK.trim();
  let body = es;
  if (es.startsWith(esK + " ")) body = es.slice(esK.length + 1);
  return `<li class="social-signal__step">
                  <p class="social-signal__k" data-i18n-en="${escAttr(enK.trim())}" data-i18n-es="${escAttr(esK)}">${enK.trim()}</p>
                  <p class="${vClass}" data-i18n-en="${escAttr(enV.trim())}" data-i18n-es="${escAttr(body.trim())}">${enV.trim()}</p>
                </li>`;
});

// qualities list items
html = html.replace(
  /<li data-i18n-en="<span class=&quot;qualities__number&quot;>(\d+)<\/span>([^"]+)" data-i18n-es="\d+ ([^"]+)">\s*<span class="qualities__number">\d+<\/span>[^<]*<\/li>/g,
  (_, num, enWord, esWord) =>
    `<li><span class="qualities__number">${num}</span><span data-i18n-en="${escAttr(enWord)}" data-i18n-es="${escAttr(esWord)}">${enWord}</span></li>`
);

// signal-pivot logic chain
html = html.replace(
  /<p class="signal-pivot__logic"[^>]*>[\s\S]*?<\/p>/,
  `<p class="signal-pivot__logic" aria-label="From use to product change" data-i18n-en="From use to product change" data-i18n-es="Del uso al cambio de producto" data-i18n-attr="aria-label">
              <span data-i18n-en="Use" data-i18n-es="Usar">Use</span>
              <span class="signal-pivot__sep" aria-hidden="true">→</span>
              <span data-i18n-en="Observe" data-i18n-es="Observar">Observe</span>
              <span class="signal-pivot__sep" aria-hidden="true">→</span>
              <span data-i18n-en="Learn" data-i18n-es="Aprender">Learn</span>
              <span class="signal-pivot__sep" aria-hidden="true">→</span>
              <span data-i18n-en="Change" data-i18n-es="Cambiar">Change</span>
            </p>`
);

let count = 0;
for (const fix of fixes) {
  if (!fix.find.test(html)) {
    console.warn("MISSING", fix.id);
    continue;
  }
  html = html.replace(fix.find, fix.replace);
  count += 1;
  console.log("fixed", fix.id);
}

// owned-beat chain if flattened
html = html.replace(
  /<(ol|ul|p|div)([^>]*)\sdata-i18n-en="([^"]*→[^"]*)"\sdata-i18n-es="([^"]*→[^"]*)"([^>]*)>([\s\S]*?)<\/\1>/gi,
  (full, tag, pre, enRaw, esRaw, post, inner) => {
    if (!inner.includes("<span")) return full;
    const enParts = enRaw
      .replace(/&quot;/g, '"')
      .replace(/<[^>]+>/g, " ")
      .split(/\s*→\s*/)
      .map((s) => s.trim())
      .filter(Boolean);
    const esParts = esRaw
      .replace(/&quot;/g, '"')
      .split(/\s*→\s*/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (enParts.length < 2 || enParts.length !== esParts.length) return full;
    let i = 0;
    const nextInner = inner.replace(/<span([^>]*)>([^<]*)<\/span>/g, (m, attrs, text) => {
      const t = text.trim();
      if (!t || t === "→") return m;
      if (i >= enParts.length) return m;
      const enT = enParts[i];
      const esT = esParts[i];
      i += 1;
      const clean = attrs
        .replace(/\s+data-i18n-en="[^"]*"/gi, "")
        .replace(/\s+data-i18n-es="[^"]*"/gi, "");
      return `<span${clean} data-i18n-en="${escAttr(enT)}" data-i18n-es="${escAttr(esT)}">${text}</span>`;
    });
    const cleanOpen = stripParentI18n(pre + post);
    count += 1;
    console.log("fixed arrow-chain", tag);
    return `<${tag}${cleanOpen}>${nextInner}</${tag}>`;
  }
);

fs.writeFileSync(htmlPath, html);
console.log("done; explicit fixes:", count);
