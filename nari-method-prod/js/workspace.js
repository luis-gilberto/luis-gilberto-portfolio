/* ═══════════════════════════════════════════════════════════
   CRIAR SIN CULPAS WORKSPACE · LG ECOSYSTEM
   Workspace JavaScript — Navigation, Interactions, i18n
═══════════════════════════════════════════════════════════ */

/* ── STATE ──────────────────────────────────────────────── */
const state = {
  currentSection: 'home',
  lang: localStorage.getItem('csc-lang') || 'es',
  mobileMenuOpen: false,
};

/* ── BILINGUAL ENGINE ────────────────────────────────────── */
const uiText = {
  // Nav
  home:            { en: 'Home',             es: 'Inicio' },
  artifacts:       { en: 'Artifacts',        es: 'Arquitectura' },
  speaking:        { en: 'Speaking',         es: 'Conferencias' },
  growth:          { en: 'Growth',           es: 'Crecimiento' },
  vault:           { en: 'Brand Vault',      es: 'Marca' },
  signal:          { en: 'Signal Room',      es: 'Señales' },
  requests:        { en: 'Requests',         es: 'Solicitudes' },
  // Hero
  workspaceTag:    { en: 'Private Workspace · Criar Sin Culpas', es: 'Workspace Privado · Criar Sin Culpas' },
  heroRole:        { en: 'Parenting Educator · Founder of Criar Sin Culpas', es: 'Educadora en crianza · Fundadora de Criar Sin Culpas' },
  heroDesc:        { en: 'A private editorial environment for speaking, brand, growth and strategic artifacts. Everything Nari needs, in one place.', es: 'Un entorno editorial privado para speaking, marca, crecimiento y artefactos estratégicos. Todo lo que Nari necesita, en un solo lugar.' },
  heroBtn1:        { en: 'View Artifacts',   es: 'Ver Artefactos' },
  heroBtn2:        { en: 'Speaker Dossier',  es: 'Dossier de Conferencias' },
  focusLabel:      { en: 'Current focus',    es: 'Foco actual' },
  focusValue:      { en: 'Commercial activation', es: 'Activación comercial' },
  lastArtifact:    { en: 'Last artifact',    es: 'Último artefacto' },
  languages:       { en: 'Languages',        es: 'Idiomas' },
  statusLabel:     { en: 'Status',           es: 'Estado' },
  statusValue:     { en: 'Active',           es: 'Activo' },
  // Snapshot
  snapshotEyebrow: { en: 'Workspace Profile', es: 'Perfil del Workspace' },
  snapshotDesc:    { en: 'This workspace centralizes all of Nari\'s speaking assets, strategic reports, brand systems and growth tools. Designed for quick access, agile editing and premium presentation to any audience.', es: 'Este workspace centraliza los activos de speaking, los reportes estratégicos, los sistemas de marca y las herramientas de crecimiento de Nari. Está diseñado para acceso rápido, edición ágil y presentación premium ante cualquier audiencia.' },
  followersLabel:  { en: 'Instagram followers', es: 'Seguidores Instagram' },
  engagementLabel: { en: 'Engagement rate', es: 'Engagement rate' },
  projectionLabel: { en: 'Year 1 projection', es: 'Proyección Año 1' },
  artifactsLabel:  { en: 'Active artifacts', es: 'Artefactos activos' },
  // Phase strip
  phase01:         { en: 'PHASE 01',         es: 'FASE 01' },
  phase02:         { en: 'PHASE 02',         es: 'FASE 02' },
  phase03:         { en: 'PHASE 03',         es: 'FASE 03' },
  phase04:         { en: 'PHASE 04',         es: 'FASE 04' },
  phase01title:    { en: 'Diagnosis ✔',      es: 'Diagnóstico ✔' },
  phase02title:    { en: 'System Architecture ✔', es: 'Arquitectura del Sistema ✔' },
  phase03title:    { en: 'Program Roadmap · In Progress', es: 'Arquitectura del Programa · En Progreso' },
  phase04title:    { en: 'Launch Narrative', es: 'Narrativa de Lanzamiento' },
  // Artifacts section
  artifactsEyebrow:{ en: 'Artifact Registry', es: 'Registro de Artefactos' },
  artifactsTitle:  { en: 'Workspace Artifacts', es: 'Artefactos del Workspace' },
  artifactsDesc:   { en: 'All premium deliverables produced for Criar Sin Culpas. Structured inside the LG Ecosystem.', es: 'Todos los entregables premium producidos para Criar Sin Culpas. Estructurados en el LG Ecosystem.' },
  filterAll:       { en: 'All',              es: 'Todos' },
  filterSpeaking:  { en: 'Speaking',         es: 'Speaking' },
  filterStrategy:  { en: 'Strategy',         es: 'Estrategia' },
  filterBrand:     { en: 'Brand',            es: 'Marca' },
  approved:        { en: 'Approved',         es: 'Aprobado' },
  open:            { en: 'Open',             es: 'Abrir' },
  share:           { en: 'Share',            es: 'Compartir' },
  lgNote:          { en: 'Structured inside the LG Ecosystem', es: 'Estructurado en el LG Ecosystem' },
  newArtifact:     { en: 'Need a new artifact?', es: '¿Necesitas un nuevo artefacto?' },
  newArtifactDesc: { en: 'Submit a request and the LG team will produce it at premium dossier level.', es: 'Envía una solicitud y el equipo LG lo producirá a nivel de dossier premium.' },
  newRequest:      { en: 'New Request →',    es: 'Nueva Solicitud →' },
  // Speaking section
  speakingEyebrow: { en: 'Speaking & Media', es: 'Speaking & Media' },
  speakingTitle:   { en: 'Conference presence and assets', es: 'Presencia y activos de conferencias' },
  speakingDesc:    { en: 'Everything an event organizer, media producer or collaborator needs to work with Nari.', es: 'Todo lo que un organizador de eventos, productor de medios o colaborador necesita para trabajar con Nari.' },
  keynoteLabel:    { en: 'Main Keynote',     es: 'Keynote Principal' },
  keynoteTitle:    { en: 'Connection before control', es: 'Conexión antes que control' },
  keynoteDesc:     { en: 'A conference on digital parenting that invites leaving fear behind to build human and intelligent interventions. Aimed at schools, educational congresses, purpose-driven brands and institutional family programs.', es: 'Una conferencia sobre crianza digital que invita a dejar atrás el miedo para construir intervenciones humanas e inteligentes. Dirigida a escuelas, congresos educativos, marcas con propósito y programas institucionales de familia.' },
  downloadKit:     { en: 'Download Media Kit →', es: 'Descargar Media Kit →' },
  talksTitle:      { en: 'Available talks',  es: 'Conferencias disponibles' },
  assetsTitle:     { en: 'Approved assets',  es: 'Activos aprobados' },
  // Growth section
  growthEyebrow:   { en: 'Growth & Monetization', es: 'Crecimiento & Monetización' },
  growthTitle:     { en: 'Revenue architecture', es: 'Arquitectura de ingresos' },
  growthDesc:      { en: 'Three growth scenarios, two revenue engines, and all the strategic intelligence to activate them.', es: 'Tres escenarios de crecimiento, dos motores de ingresos y toda la inteligencia estratégica para activarlos.' },
  // Signal Room
  signalEyebrow:   { en: 'Signal Room',      es: 'Sala de Señales' },
  signalTitle:     { en: 'Activity & decisions', es: 'Actividad & decisiones' },
  signalDesc:      { en: 'Live registry of updates, pending decisions and strategic signals for the workspace.', es: 'Registro en vivo de actualizaciones, decisiones pendientes y señales estratégicas del workspace.' },
  // Requests
  requestsEyebrow: { en: 'Requests',         es: 'Solicitudes' },
  requestsTitle:   { en: 'Send a request',   es: 'Envía una solicitud' },
  requestsDesc:    { en: 'Need a new artifact, an edit or a strategic consultation? Use this form.', es: '¿Necesitas un nuevo artefacto, una edición o una consulta estratégica? Usa este formulario.' },
};

function t(key) {
  const entry = uiText[key];
  if (!entry) return key;
  return entry[state.lang] || entry.es || entry.en || key;
}

function applyLang() {
  const lang = state.lang;

  // Toggle lb-en / lb-es blocks
  document.querySelectorAll('.lb-en, .lb-es').forEach(el => {
    const isEn = el.classList.contains('lb-en');
    el.classList.toggle('active', isEn ? lang === 'en' : lang === 'es');
  });

  // Toggle language buttons
  document.querySelectorAll('.sys-lang, .lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // Apply data-t attributes
  document.querySelectorAll('[data-t]').forEach(el => {
    const key = el.dataset.t;
    const text = t(key);
    if (text !== key) el.textContent = text;
  });

  // Persist
  localStorage.setItem('csc-lang', lang);

  // Re-render dynamic artifacts
  if (typeof renderArtifactPhases === 'function') renderArtifactPhases();
  if (typeof renderSignals === 'function') renderSignals();
}

function setLang(lang) {
  state.lang = lang;
  window.__cscLang = lang; // expose for doc links that use inline onclick
  applyLang();
}

/* ── ARTIFACTS DATA (bilingual) ──────────────────────────── */
const artifactsData = [
  {
    id: 'A01', phase: 1,
    typeKey: 'speaking',
    title:   { en: 'Speaker Dossier', es: 'Dossier de Conferencias' },
    code:    'SIQ_A01_SpeakerMediaKit_CSC',
    type:    { en: 'Client Deliverable · ES/EN', es: 'Entregable para cliente · ES/EN' },
    desc:    { en: 'Complete external-facing speaker kit. Positioning narrative, audience data, topic menu and collaboration formats for event organizers and brand partners.', es: 'Media kit completo de speaking — conferencias magistrales, talleres, colaboraciones editoriales y prueba de autoridad. Versión final en español e inglés.' },
    url:     'https://www.luis-gilberto.com/TheHub/clients/nari/files/SIQ_A01_SpeakerMediaKit_CSC',
    status:  'approved', pages: '2',
    langs:   'ES / EN',
  },
  {
    id: 'A02', phase: 1,
    typeKey: 'strategy',
    title:   { en: 'Monetization Research Report', es: 'Reporte de Monetización' },
    code:    'SIQ_A02_MonetizationReport_CSC',
    type:    { en: 'Market Intelligence · Bilingual', es: 'Inteligencia de mercado · Bilingüe' },
    desc:    { en: 'Competitive landscape analysis, creator benchmarking and monetization model research for Criar Sin Culpas.', es: 'Inteligencia de mercado y arquitectura de ingresos. Proyecciones, mix de monetización, precios de cursos y alianzas de marca.' },
    urlEn:   'files/SIQ_A02_MonetizationReport_CSC.html?lang=en',
    urlEs:   'files/SIQ_A02_MonetizationReport_CSC.html?lang=es',
    status:  'approved', pages: '3',
    langs:   'ES / EN',
  },
  {
    id: 'A03', phase: 2,
    typeKey: 'strategy',
    title:   { en: 'Financial Model', es: 'Modelo Financiero' },
    code:    'SIQ_A03_FinancialModel_CSC',
    type:    { en: 'Revenue Modeling · Excel', es: 'Modelado de ingresos · Excel' },
    desc:    { en: '12-month financial model with revenue stream assumptions, pricing scenarios and sensitivity analysis across monetization channels.', es: 'Modelo financiero de 12 meses con supuestos de ingresos, escenarios de precios y análisis de sensibilidad para distintos canales de monetización.' },
    url:     'https://www.luis-gilberto.com/TheHub/clients/nari/files/SIQ_A02_FinancialModel_CSC.xlsx',
    status:  'approved', pages: '—',
    langs:   'ES / EN',
  },
  {
    id: 'A04', phase: 3,
    typeKey: 'strategy',
    title:   { en: 'Commercial Activation Brief', es: 'Brief de Activación Comercial' },
    code:    'SIQ_A04_CommercialActivationBrief_CSC',
    type:    { en: 'Strategic Brief · Bilingual', es: 'Resumen estratégico · Bilingüe' },
    desc:    { en: 'Bilingual commercial strategy brief covering revenue architecture, channel prioritization and activation sequencing.', es: 'Dos motores de ingresos, tres escenarios de crecimiento, señales estratégicas y acciones inmediatas para activar el potencial comercial de Criar Sin Culpas.' },
    urlEn:   'https://www.genspark.ai/api/files/s/NfzVOSim',
    urlEs:   'https://www.genspark.ai/api/files/s/aZJm7Q3O',
    status:  'approved', pages: '2',
    langs:   'ES / EN',
  },
  {
    id: 'A05', phase: 3,
    typeKey: 'strategy',
    title:   { en: 'Brand Partnership Kit', es: 'Kit para Alianzas con Marcas' },
    code:    'SIQ_A05_BrandPartnershipKit_CSC',
    type:    { en: 'Revenue Activation · Engine 01', es: 'Activación de Ingresos · Motor 01' },
    desc:    { en: 'Bilingual brand partnership kit — market opportunity, audience data, content pillars, pricing tiers and collaboration formats for brand partners.', es: 'Kit de alianzas bilingüe — oportunidad de mercado, demografía de audiencia, pilares de contenido y precios para colaboraciones comerciales.' },
    urlEn:   'files/SIQ_A05_BrandPartnershipKit_CSC.html?lang=en',
    urlEs:   'files/SIQ_A05_BrandPartnershipKit_CSC.html?lang=es',
    status:  'approved', pages: '—',
    langs:   'ES / EN',
  },
  {
    id: 'A06', phase: 3,
    typeKey: 'brand',
    title:   { en: 'CSC Viz ID', es: 'CSC Viz ID' },
    code:    'SIQ_BrandAsset_VizID_CSC',
    type:    { en: 'Brand Identity · Single page', es: 'Identidad visual · Una página' },
    desc:    { en: 'Complete visual brand guide — colors, typography, image direction, voice, signature components and asset checklist. The brand reference on one page.', es: 'Guía visual completa de identidad de marca. Colores, tipografía, dirección de imagen, voz, componentes de firma y checklist de activos. La referencia de marca en una sola página.' },
    url:     'https://www.genspark.ai/api/files/s/LH7IeTeM',
    status:  'approved', pages: '1',
    langs:   'ES',
  },
];

/* ── SIGNALS DATA (bilingual) ────────────────────────────── */
const signalsData = [
  {
    type: 'raw',
    title:       { en: 'Raw Input Detected',       es: 'Señal Cruda Detectada' },
    rawText:     '"No saben cómo quitar las pantallas sin pelear."',
    pattern:     { en: 'Screen Overstimulation & Transition Friction', es: 'Sobreestimulación de Pantallas & Fricción de Transición' },
    patternLabel:{ en: 'DETECTED DIFFICULTY:', es: 'DIFICULTAD DETECTADA:' },
    mapped:      { en: 'Mapped to: Entry Product 01', es: 'Mapeado a: Producto de Entrada 01' },
  },
  {
    type: 'raw',
    title:       { en: 'Raw Input Detected',       es: 'Señal Cruda Detectada' },
    rawText:     '"Padres desesperados por los berrinches en la calle."',
    pattern:     { en: 'Emotional Dysregulation & Public Shame', es: 'Desregulación Emocional & Vergüenza Pública' },
    patternLabel:{ en: 'DETECTED DIFFICULTY:', es: 'DIFICULTAD DETECTADA:' },
    mapped:      { en: 'Mapped to: Entry Product 02', es: 'Mapeado a: Producto de Entrada 02' },
  },
  {
    type: 'raw',
    title:       { en: 'Raw Input Detected',       es: 'Señal Cruda Detectada' },
    rawText:     '"Siento culpa cuando pongo límites."',
    pattern:     { en: 'Parent Guilt Around Discipline', es: 'Culpa Parental al Poner Límites' },
    patternLabel:{ en: 'DETECTED DIFFICULTY:', es: 'DIFICULTAD DETECTADA:' },
    mapped:      { en: 'Flagship · Phase 01 (Accept)', es: 'Insignia · Fase 01 (Aceptar)' },
  },
  {
    type: 'raw',
    title:       { en: 'Raw Input Detected',       es: 'Señal Cruda Detectada' },
    rawText:     '"Termino gritándole yo también."',
    pattern:     { en: 'Parent Emotional Dysregulation', es: 'Desregulación Emocional del Padre' },
    patternLabel:{ en: 'DETECTED DIFFICULTY:', es: 'DIFICULTAD DETECTADA:' },
    mapped:      { en: 'Flagship · Phase 02 (Stabilize)', es: 'Insignia · Fase 02 (Estabilizar)' },
  },
  {
    type: 'raw',
    title:       { en: 'Raw Input Detected',       es: 'Señal Cruda Detectada' },
    rawText:     '"Mi hijo no me escucha."',
    pattern:     { en: 'Authority Confusion & Instruction Fatigue', es: 'Confusión de Autoridad & Fatiga de Instrucciones' },
    patternLabel:{ en: 'DETECTED DIFFICULTY:', es: 'DIFICULTAD DETECTADA:' },
    mapped:      { en: 'Flagship · Phase 04 (Guide)', es: 'Insignia · Fase 04 (Guiar)' },
  },
  {
    type: 'commercial',
    title:       { en: 'Commercial Signal Detected', es: 'Señal Comercial Detectada' },
    rawText:     '"Tengo 50 talleres ya listos pero no sé cómo organizarlos."',
    pattern:     { en: 'Unpackaged Curriculum Asset', es: 'Activo Curricular Sin Empaquetar' },
    patternLabel:{ en: 'Revenue Signal:', es: 'Señal de Ingresos:' },
    mapped:      { en: 'Mapped to: Engine 02 · Program Architecture', es: 'Mapeado a: Motor 02 · Arquitectura del Programa' },
  },
  {
    type: 'commercial',
    title:       { en: 'Commercial Signal Detected', es: 'Señal Comercial Detectada' },
    rawText:     '"No tengo una estrategia de monetización clara."',
    pattern:     { en: 'Missing Commercial Architecture', es: 'Arquitectura Comercial Faltante' },
    patternLabel:{ en: 'Revenue Signal:', es: 'Señal de Ingresos:' },
    mapped:      { en: 'Mapped to: Engines 01 & 02 · Commercial Layer', es: 'Mapeado a: Motores 01 & 02 · Capa Comercial' },
  },
];

/* ── RENDER ARTIFACTS (dynamic, bilingual) ───────────────── */
function renderArtifactPhases() {
  const metaSvgGlobe = `<svg class="meta-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 3c-2.5 3-4 5.5-4 9s1.5 6 4 9M12 3c2.5 3 4 5.5 4 9s-1.5 6-4 9M3 12h18"/></svg>`;
  const metaSvgCal   = `<svg class="meta-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="3" y="4" width="18" height="17" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="16" y1="2" x2="16" y2="6"/></svg>`;
  const metaSvgDoc   = `<svg class="meta-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>`;

  [1, 2, 3].forEach(phaseNum => {
    const container = document.getElementById(`phase-${phaseNum}-artifacts`);
    if (!container) return;
    const phaseArtifacts = artifactsData.filter(a => a.phase === phaseNum);
    container.innerHTML = phaseArtifacts.map(art => {
      const title = art.title[state.lang] || art.title.es;
      const desc  = art.desc[state.lang]  || art.desc.es;
      const typeLabel = art.type[state.lang] || art.type.es;
      let actions = '';
      const shareBtnLabel = state.lang === 'en' ? 'Share' : 'Compartir';
      const shareSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`;
      if (art.urlEn && art.urlEs) {
        const openLabel = state.lang === 'en';
        actions = `<a href="${art[openLabel ? 'urlEn' : 'urlEs']}" target="_blank" class="btn-primary small">${openLabel ? 'Open' : 'Abrir'}</a>
                   <button class="btn-ghost small" onclick="shareArtifact('${art.id}')" style="display:inline-flex;align-items:center;">${shareSvg}${shareBtnLabel}</button>`;
      } else {
        const url = art.url || '#';
        actions = `<a href="${url}" target="_blank" class="btn-primary small">${state.lang === 'en' ? 'Open' : 'Abrir'}</a>
                   <button class="btn-ghost small" onclick="shareArtifact('${art.id}')" style="display:inline-flex;align-items:center;">${shareSvg}${shareBtnLabel}</button>`;
      }
      return `
        <div class="artifact-card" data-type="${art.typeKey}" style="margin-bottom:16px;">
          <div class="ac-status-row">
            <span class="ac-type ${art.typeKey}">${typeLabel}</span>
            <span class="ac-status approved">
              <svg width="6" height="6" viewBox="0 0 6 6" style="display:inline-block;vertical-align:middle;margin-right:4px;"><circle cx="3" cy="3" r="3" fill="#2ED3C6"/></svg>
              ${state.lang === 'en' ? 'Approved' : 'Aprobado'}
            </span>
          </div>
          <h3 class="ac-title">${title}</h3>
          <p class="ac-code">${art.code}</p>
          <p class="ac-desc">${desc}</p>
          <div class="ac-meta-row">
            <span class="ac-meta-item">${metaSvgGlobe} ${art.langs}</span>
            <span class="ac-meta-item">${metaSvgCal} ${state.lang === 'en' ? 'Apr 2026' : 'Abr 2026'}</span>
            <span class="ac-meta-item">${metaSvgDoc} ${art.pages} ${state.lang === 'en' ? 'pages' : 'páginas'}</span>
          </div>
          <div class="ac-actions">${actions}</div>
          <div class="ac-lg-note">${state.lang === 'en' ? 'Structured inside the LG Ecosystem' : 'Estructurado en el LG Ecosystem'}</div>
        </div>`;
    }).join('');
  });
}

/* ── RENDER SIGNALS (dynamic, bilingual) ─────────────────── */
function renderSignals() {
  const container = document.getElementById('signals-ledger-container');
  if (!container) return;
  container.innerHTML = signalsData.map(sig => {
    const isCommercial = sig.type === 'commercial';
    const accentColor  = isCommercial ? '#F96F6E' : '#2ED3C6';
    const bgColor      = isCommercial ? 'rgba(249,111,110,0.05)' : 'rgba(46,211,198,0.05)';
    const labelColor   = isCommercial ? '#F96F6E' : '#2ED3C6';
    const title   = sig.title[state.lang]        || sig.title.es;
    const pattern = sig.pattern[state.lang]      || sig.pattern.es;
    const plabel  = sig.patternLabel[state.lang] || sig.patternLabel.es;
    const mapped  = sig.mapped[state.lang]       || sig.mapped.es;
    return `
      <div style="border-left:2px solid ${accentColor};padding-left:16px;margin-bottom:24px;">
        <div style="font-size:9px;font-weight:700;color:#6B6560;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:6px;">${title}</div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:16px;font-style:italic;color:var(--text-primary);margin-bottom:10px;">${sig.rawText}</div>
        <div style="background:${bgColor};border:1px solid ${labelColor}26;border-radius:6px;padding:10px 12px;">
          <div style="font-size:10px;font-weight:700;color:${labelColor};letter-spacing:0.08em;text-transform:uppercase;margin-bottom:4px;">${plabel}</div>
          <div style="font-size:13px;color:var(--text-primary);font-weight:500;margin-bottom:6px;">${pattern}</div>
          <div style="font-size:11px;color:var(--text-muted);">${mapped}</div>
        </div>
      </div>`;
  }).join('');
}

/* ── GATE / ENTRY ────────────────────────────────────────── */
function returnToGate() {
  document.getElementById("workspace").classList.add("hidden");
  document.getElementById("gate").style.display = "";
  document.getElementById("gate").style.opacity = "1";
}

function enterWorkspace(targetSection = 'home') {
  const gate = document.getElementById('gate');
  const workspace = document.getElementById('workspace');

  gate.style.transition = 'opacity 0.55s cubic-bezier(0.4,0,0.2,1), transform 0.55s cubic-bezier(0.4,0,0.2,1)';
  gate.style.opacity = '0';
  gate.style.transform = 'translateY(-20px)';

  setTimeout(() => {
    gate.classList.add('hidden');
    workspace.classList.remove('hidden');
    workspace.style.opacity = '0';
    requestAnimationFrame(() => {
      workspace.style.transition = 'opacity 0.45s ease';
      workspace.style.opacity = '1';
    });
    goToSection(targetSection, false);
    animateSectionEntrance(targetSection);
    renderArtifactPhases();
    renderSignals();
    applyLang();
  }, 500);
}

/* ── SECTION NAVIGATION ──────────────────────────────────── */
function goToSection(sectionId, animate = true) {
  if (state.mobileMenuOpen) toggleMobileMenu();
  // Close megamenu
  const vp = document.getElementById('cscNavViewport');
  if (vp) vp.classList.remove('open');
  document.querySelectorAll('.mega-trigger').forEach(t => t.classList.remove('mega-active'));

  document.querySelectorAll('.ws-section').forEach(sec => sec.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));

  const section = document.getElementById('section-' + sectionId);
  if (section) {
    if (animate) {
      section.style.animation = 'none';
      section.offsetHeight;
      section.style.animation = '';
    }
    section.classList.add('active');
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const navItem = document.querySelector(`[data-section="${sectionId}"]`);
  if (navItem) navItem.classList.add('active');
  state.currentSection = sectionId;

  const workspace = document.getElementById('workspace');
  if (workspace.classList.contains('hidden')) {
    enterWorkspace(sectionId);
    return;
  }
  animateSectionEntrance(sectionId);
}

/* ── MOBILE DRAWER ───────────────────────────────────────── */
function toggleMobileMenu() {
  const drawer  = document.getElementById('cscDrawer');
  const overlay = document.getElementById('cscDrawerOverlay');
  if (!drawer) return;
  state.mobileMenuOpen = !state.mobileMenuOpen;
  drawer.classList.toggle('open', state.mobileMenuOpen);
  if (overlay) {
    overlay.classList.toggle('visible', state.mobileMenuOpen);
    overlay.style.display = state.mobileMenuOpen ? 'block' : 'none';
  }
  document.body.style.overflow = state.mobileMenuOpen ? 'hidden' : '';
}

/* ── MEGAMENU NAVIGATION HELPER ──────────────────────────── */
function cscNavGo(section) {
  // Close drawer if open
  if (state.mobileMenuOpen) toggleMobileMenu();
  // Close megamenu viewport
  const vp = document.getElementById('cscNavViewport');
  if (vp) vp.classList.remove('open');
  document.querySelectorAll('.mega-trigger').forEach(t => t.classList.remove('mega-active'));
  // Navigate
  goToSection(section);
}

/* ── MEGAMENU DESKTOP ENGINE ─────────────────────────────── */
function initMegaMenu() {
  const triggers = document.querySelectorAll('.mega-trigger');
  const viewport = document.getElementById('cscNavViewport');
  const views    = document.querySelectorAll('.csc-view-content');
  if (!viewport || !triggers.length) return;

  let closeTimer;

  function openPanel(triggerKey) {
    clearTimeout(closeTimer);
    // Hide all views, show target
    views.forEach(v => v.style.display = 'none');
    const target = document.getElementById('view-' + triggerKey);
    if (target) target.style.display = 'block';
    viewport.classList.add('open');
    // Mark active trigger
    triggers.forEach(t => t.classList.toggle('mega-active', t.dataset.trigger === triggerKey));
  }

  function scheduleClose() {
    closeTimer = setTimeout(() => {
      viewport.classList.remove('open');
      triggers.forEach(t => t.classList.remove('mega-active'));
    }, 180);
  }

  triggers.forEach(trigger => {
    trigger.addEventListener('mouseenter', () => openPanel(trigger.dataset.trigger));
    trigger.addEventListener('mouseleave', scheduleClose);
    // Also support click/tap for touch devices
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = viewport.classList.contains('open') && trigger.classList.contains('mega-active');
      if (isOpen) {
        scheduleClose();
      } else {
        openPanel(trigger.dataset.trigger);
      }
    });
  });

  viewport.addEventListener('mouseenter', () => clearTimeout(closeTimer));
  viewport.addEventListener('mouseleave', scheduleClose);

  // Click outside closes panel
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.sys-nav')) {
      viewport.classList.remove('open');
      triggers.forEach(t => t.classList.remove('mega-active'));
    }
  });
}

/* ── LANGUAGE TOGGLE ─────────────────────────────────────── */
function initLangToggles() {
  document.querySelectorAll('.sys-lang, .lang-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      setLang(this.dataset.lang);
    });
  });
}

/* ── BIO ACCORDION ───────────────────────────────────────── */
function toggleBio(element) {
  const isOpen = element.classList.contains('open');
  document.querySelectorAll('.bio-item').forEach(item => item.classList.remove('open'));
  if (!isOpen) element.classList.add('open');
}

/* ── ARTIFACT FILTER ─────────────────────────────────────── */
function initArtifactFilter() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const filter = this.dataset.filter;
      document.querySelectorAll('.artifact-card[data-type]').forEach(card => {
        const show = filter === 'all' || card.dataset.type === filter;
        if (show) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'translateY(8px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ── PRIORITY SELECTOR ───────────────────────────────────── */
function initPrioritySelector() {
  document.querySelectorAll('.priority-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.priority-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

/* ── REQUEST FORM ────────────────────────────────────────── */
function submitRequest() {
  const subject = document.querySelector('.form-input')?.value?.trim();
  const desc    = document.querySelector('.form-textarea')?.value?.trim();
  if (!subject && !desc) {
    const btn = document.querySelector('.btn-primary.full');
    if (!document.getElementById('shakeStyle')) {
      const style = document.createElement('style');
      style.id = 'shakeStyle';
      style.textContent = `@keyframes shake { 0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)} }`;
      document.head.appendChild(style);
    }
    if (btn) { btn.style.animation = 'none'; btn.offsetHeight; btn.style.animation = 'shake 0.4s ease'; }
    return;
  }
  const toast = document.getElementById('toast');
  if (toast) {
    toast.classList.remove('hidden');
    document.querySelectorAll('.form-input, .form-textarea').forEach(el => el.value = '');
    setTimeout(() => {
      toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      setTimeout(() => { toast.classList.add('hidden'); toast.style.opacity = ''; toast.style.transform = ''; }, 300);
    }, 3500);
  }
}

/* ── COPY TEXT ───────────────────────────────────────────── */
function copyText(btn, text) {
  event.stopPropagation();
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      const orig = btn.textContent;
      btn.textContent = '✓ Copiado';
      btn.style.color = 'var(--teal)';
      setTimeout(() => { btn.textContent = orig; btn.style.color = ''; }, 2000);
    });
  }
}

/* ══════════════════════════════════════════════════════════
   SHARE MODAL SYSTEM
══════════════════════════════════════════════════════════ */
let _shrCurrentArt = null;

function shareArtifact(id) {
  const art = artifactsData.find(a => a.id === id);
  if (!art) return;
  _shrCurrentArt = art;
  openShareModal(art);
}

function openShareModal(art) {
  const modal = document.getElementById('share-modal');
  if (!modal) return;

  const lang  = state.lang;
  const title = art.title[lang] || art.title.es;
  const url   = art.url || art.urlEn || (window.location.origin + window.location.pathname);
  const pubUrl = url; // same for now — swap to a dedicated public URL when available

  // Populate header
  document.getElementById('shr-eyebrow').textContent = art.code;
  document.getElementById('shr-title').textContent = title;

  // ── Link tab ──
  document.getElementById('shr-link-url').value = pubUrl;

  // ── Social captions ──
  const tagLine = lang === 'en'
    ? `Crianza: from the inside out.\n\nNari Fateha's method — Accept. Connect. Design. The parenting system that changes the adult first.\n\n👉 ${pubUrl}\n\n#CriarSinCulpas #PositiveParenting #ParentingSupport`
    : `Criar sin pelear. Criar sin culpa.\n\nEl método de Nari Fateha — Aceptar. Conectar. Diseñar. El sistema que cambia al adulto primero.\n\n👉 ${pubUrl}\n\n#CriarSinCulpas #CrianzaPositiva #FamiliasConPropósito`;

  const liCaption = lang === 'en'
    ? `Effective parenting doesn't start with the child's behavior — it starts with the adult's state.\n\nNari Fateha's method lays out three decisions every overwhelmed parent can make: stabilize, connect, redesign.\n\nThis is the "${title}" — built with rigor, designed for real families.\n\n${pubUrl}`
    : `La crianza efectiva no empieza con la conducta del niño — empieza con el estado del adulto.\n\nEl Método Nari describe tres decisiones que cualquier padre desbordado puede tomar: estabilizar, conectar, rediseñar.\n\nEste es el "${title}" — construido con rigor, diseñado para familias reales.\n\n${pubUrl}`;

  const xCaption = lang === 'en'
    ? `You can't guide a child if you're emotionally overwhelmed. That's where the Nari Method starts — with the adult. "${title}" → ${pubUrl}`
    : `No puedes guiar a un niño si estás emocionalmente desbordado. Por eso el Método Nari empieza por el adulto. "${title}" → ${pubUrl}`;

  const waCaption = lang === 'en'
    ? `Hey! Sharing this with you — "${title}" from the Criar Sin Culpas method by Nari Fateha. Practical, warm, and actually useful for families. ${pubUrl}`
    : `¡Hola! Te comparto esto — "${title}" del método de Crianza de Nari Fateha. Práctico, cálido y realmente útil para familias. ${pubUrl}`;

  document.getElementById('shr-ig-caption').value = tagLine;
  document.getElementById('shr-li-caption').value = liCaption;
  document.getElementById('shr-x-caption').value  = xCaption;
  document.getElementById('shr-wa-caption').value = waCaption;
  shrUpdateXCount();

  // ── Email ──
  const emailSubject = lang === 'en'
    ? `"${title}" — Criar Sin Culpas / Nari Fateha`
    : `"${title}" — Criar Sin Culpas / Nari Fateha`;

  const emailBody = lang === 'en'
    ? `Hi,\n\nI wanted to share this resource with you — it's the "${title}" from the Criar Sin Culpas method by Nari Fateha.\n\nNari is a parenting educator whose approach starts by stabilizing the adult, then connecting with the child, and finally redesigning the behavior system. It's practical, warm, and grounded in real family dynamics.\n\nYou can access it here:\n${pubUrl}\n\nLet me know what you think!\n\n---\nBuilt inside the LG Ecosystem`
    : `Hola,\n\nQuería compartirte este recurso — es el "${title}" del método Criar Sin Culpas de Nari Fateha.\n\nNari es educadora en crianza y su método empieza por estabilizar al adulto, luego conectar con el niño y finalmente rediseñar el sistema conductual. Es práctico, cálido y anclado en la vida familiar real.\n\nPuedes acceder aquí:\n${pubUrl}\n\nCuéntame qué te parece.\n\n---\nBuilt inside the LG Ecosystem`;

  document.getElementById('shr-email-subject').value = emailSubject;
  document.getElementById('shr-email-body').value    = emailBody;

  // ── Embed — generate all 4 formats ──
  shrBuildEmbeds(art, pubUrl, lang);
  shrPickEmbedFormat('speaker-card', null); // default panel

  // ── PDF ──
  const pdfUrlEs = art.urlEs || art.url || pubUrl;
  const pdfUrlEn = art.urlEn || art.url || pubUrl;
  const pdfNameEs = (art.title.es || title) + ' — ES';
  const pdfNameEn = (art.title.en || title) + ' — EN';
  const pdfEsEl = document.getElementById('shr-pdf-es');
  const pdfEnEl = document.getElementById('shr-pdf-en');
  if (pdfEsEl) { pdfEsEl.href = pdfUrlEs; }
  if (pdfEnEl) { pdfEnEl.href = pdfUrlEn; }
  document.getElementById('shr-pdf-es-name').textContent = pdfNameEs;
  document.getElementById('shr-pdf-en-name').textContent = pdfNameEn;

  // Switch to link tab by default
  shrSwitchTab('link');

  // Apply lang to newly rendered lb- spans inside modal
  applyLang();

  // Show
  modal.style.display = 'flex';
  requestAnimationFrame(() => { modal.classList.add('visible'); });
  document.body.style.overflow = 'hidden';
}

function closeShareModal(e) {
  // if called from backdrop click, only close if the backdrop itself was clicked
  if (e instanceof MouseEvent && e.target !== document.getElementById('share-modal')) return;
  const modal = document.getElementById('share-modal');
  if (!modal) return;
  modal.classList.remove('visible');
  setTimeout(() => {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }, 250);
}

// Close on ESC
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const modal = document.getElementById('share-modal');
    if (modal && modal.classList.contains('visible')) closeShareModal();
  }
});

function shrSwitchTab(tab) {
  document.querySelectorAll('.shr-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
  ['link','social','email','embed','pdf'].forEach(t => {
    const el = document.getElementById('shr-tab-' + t);
    if (el) el.style.display = t === tab ? 'block' : 'none';
  });
}

function shrCopy(inputId, btn) {
  const el = document.getElementById(inputId);
  if (!el) return;
  const text = el.value;
  navigator.clipboard.writeText(text).then(() => {
    shrFlashCopied(btn);
  }).catch(() => {
    el.select();
    document.execCommand('copy');
    shrFlashCopied(btn);
  });
}

function shrCopyField(fieldId, btn) {
  const el = document.getElementById(fieldId);
  if (!el) return;
  navigator.clipboard.writeText(el.value).then(() => {
    shrFlashCopied(btn);
  }).catch(() => {
    el.select();
    document.execCommand('copy');
    shrFlashCopied(btn);
  });
}

function shrFlashCopied(btn) {
  if (btn) {
    const orig = btn.innerHTML;
    btn.classList.add('copied');
    btn.innerHTML = '<span>✓ ' + (state.lang === 'en' ? 'Copied' : 'Copiado') + '</span>';
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.innerHTML = orig;
    }, 1800);
  }
  // also show bottom toast
  let flash = document.getElementById('shr-copied-flash');
  if (!flash) {
    flash = document.createElement('div');
    flash.id = 'shr-copied-flash';
    flash.className = 'shr-copied-flash';
    document.body.appendChild(flash);
  }
  flash.textContent = state.lang === 'en' ? '✓ Copied to clipboard' : '✓ Copiado al portapapeles';
  flash.classList.add('show');
  clearTimeout(flash._timer);
  flash._timer = setTimeout(() => flash.classList.remove('show'), 2000);
}

function shrOpenWhatsApp() {
  const text = document.getElementById('shr-wa-caption')?.value || '';
  window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent(text), '_blank');
}

function shrOpenEmailClient() {
  const subject = document.getElementById('shr-email-subject')?.value || '';
  const body    = document.getElementById('shr-email-body')?.value || '';
  window.location.href = 'mailto:?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
}

function shrPrintContent() {
  const art = _shrCurrentArt;
  if (!art) return;
  const url = art.url || art.urlEn || '#';
  if (url !== '#') {
    window.open(url, '_blank');
  } else {
    window.print();
  }
}

function shrUpdateXCount() {
  const el = document.getElementById('shr-x-caption');
  const counter = document.getElementById('shr-x-count');
  if (!el || !counter) return;
  const len = el.value.length;
  counter.textContent = len + ' / 280';
  counter.style.color = len > 260 ? 'var(--coral)' : 'var(--text-muted)';
}

/* ══════════════════════════════════════════════════════════
   EMBED FORMAT SYSTEM
══════════════════════════════════════════════════════════ */

// Nari's approved bios (short versions for embeds)
const NARI_BIO = {
  es: 'Educadora en crianza y fundadora de Criar Sin Culpas. Acompaña a familias, escuelas e instituciones en crianza digital, regulación emocional y construcción de confianza familiar.',
  en: 'Parenting educator and founder of Criar Sin Culpas. She supports families, schools, and institutions on digital parenting, emotional regulation, and family trust-building.'
};
const NARI_ROLE = {
  es: 'Educadora en Crianza · Conferencista · Fundadora, Criar Sin Culpas',
  en: 'Parenting Educator · Speaker · Founder, Criar Sin Culpas'
};
const NARI_TOPICS = {
  es: ['Crianza digital', 'Regulación emocional', 'Familias neurodivergentes', 'Confianza familiar'],
  en: ['Digital parenting', 'Emotional regulation', 'Neurodivergent families', 'Family trust']
};

function shrBuildEmbeds(art, pubUrl, lang) {
  const artTitle  = art.title[lang] || art.title.es;
  const bio       = NARI_BIO[lang];
  const role      = NARI_ROLE[lang];
  const topics    = NARI_TOPICS[lang];
  const bookLabel = lang === 'en' ? 'Book Nari' : 'Contactar a Nari';
  const contactLabel = lang === 'en' ? 'Contact' : 'Contacto';
  const websiteLabel = lang === 'en' ? 'Website' : 'Sitio web';
  const speakerLabel = lang === 'en' ? 'Speaker · Educator · Author' : 'Conferencista · Educadora · Autora';

  /* ── 1. SPEAKER CARD ── */
  const topicChips = topics.map(t =>
    `<span style="display:inline-block;padding:3px 10px;background:#fdf0ef;border:1px solid #f9c8c7;border-radius:999px;font-size:11px;font-family:sans-serif;color:#c0504d;margin:3px 4px 0 0;">${t}</span>`
  ).join('');

  const speakerCardHTML = `<table cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:560px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;border-radius:12px;overflow:hidden;border:1px solid #ede3d7;background:#fbf7f1;">
  <tr><td style="padding:0;height:4px;background:linear-gradient(90deg,#f96f6e,#4bada8);"></td></tr>
  <tr><td style="padding:28px 28px 8px;">
    <p style="margin:0 0 2px;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#f96f6e;font-weight:700;">Criar Sin Culpas</p>
    <h2 style="margin:0 0 4px;font-size:26px;font-weight:400;color:#151515;font-family:Georgia,'Times New Roman',serif;line-height:1.15;">Nari Fateha</h2>
    <p style="margin:0 0 16px;font-size:12px;color:#6d625a;">${role}</p>
    <p style="margin:0 0 18px;font-size:13px;line-height:1.65;color:#2f2a26;">${bio}</p>
    <div style="margin-bottom:20px;">${topicChips}</div>
    <a href="${pubUrl}" style="display:inline-block;padding:10px 22px;background:#f96f6e;color:#fff;border-radius:999px;font-size:12px;font-weight:600;text-decoration:none;letter-spacing:.04em;">${bookLabel} →</a>
  </td></tr>
  <tr><td style="padding:14px 28px;border-top:1px solid #ede3d7;">
    <p style="margin:0;font-size:10px;color:#a89e97;">criarsinculpas.com · nari@criarsinculpas.com · @criarsinculpas</p>
  </td></tr>
</table>`;

  const speakerCardPreview = `<div style="max-width:460px;font-family:-apple-system,sans-serif;border-radius:10px;overflow:hidden;border:1px solid #ede3d7;background:#fbf7f1;">
    <div style="height:3px;background:linear-gradient(90deg,#f96f6e,#4bada8);"></div>
    <div style="padding:20px 20px 8px;">
      <p style="margin:0 0 2px;font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:#f96f6e;font-weight:700;">Criar Sin Culpas</p>
      <h2 style="margin:0 0 3px;font-size:20px;font-weight:400;color:#151515;font-family:Georgia,serif;line-height:1.2;">Nari Fateha</h2>
      <p style="margin:0 0 12px;font-size:11px;color:#6d625a;">${role}</p>
      <p style="margin:0 0 12px;font-size:12px;line-height:1.6;color:#2f2a26;">${bio}</p>
      <div style="margin-bottom:14px;">${topicChips}</div>
      <a href="${pubUrl}" style="display:inline-block;padding:8px 18px;background:#f96f6e;color:#fff;border-radius:999px;font-size:11px;font-weight:600;text-decoration:none;">${bookLabel} →</a>
    </div>
    <div style="padding:10px 20px;border-top:1px solid #ede3d7;">
      <p style="margin:0;font-size:9px;color:#a89e97;">criarsinculpas.com · @criarsinculpas</p>
    </div>
  </div>`;

  const scPrev = document.getElementById('emb-preview-speaker-card');
  const scCode = document.getElementById('emb-code-speaker-card');
  if (scPrev) scPrev.innerHTML = speakerCardPreview;
  if (scCode) scCode.value = speakerCardHTML;

  /* ── 2. EMAIL SIGNATURE ── */
  const sigHTML = `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;max-width:480px;">
  <tr>
    <td style="padding-right:14px;vertical-align:top;border-right:2px solid #f96f6e;padding-right:16px;">
      <p style="margin:0;font-size:15px;font-weight:700;color:#151515;">Nari Fateha</p>
      <p style="margin:2px 0 0;font-size:11px;color:#6d625a;">${speakerLabel}</p>
      <p style="margin:4px 0 0;font-size:11px;color:#4bada8;font-weight:600;">Criar Sin Culpas</p>
    </td>
    <td style="padding-left:16px;vertical-align:top;">
      <p style="margin:0;font-size:11px;color:#6d625a;">📧 <a href="mailto:nari@criarsinculpas.com" style="color:#6d625a;text-decoration:none;">nari@criarsinculpas.com</a></p>
      <p style="margin:3px 0 0;font-size:11px;color:#6d625a;">🌐 <a href="https://criarsinculpas.com" style="color:#4bada8;text-decoration:none;">criarsinculpas.com</a></p>
      <p style="margin:3px 0 0;font-size:11px;color:#6d625a;">📲 <a href="https://instagram.com/criarsinculpas" style="color:#6d625a;text-decoration:none;">@criarsinculpas</a></p>
      <p style="margin:6px 0 0;"><a href="${pubUrl}" style="display:inline-block;padding:4px 12px;background:#f96f6e;color:#fff;border-radius:999px;font-size:10px;font-weight:600;text-decoration:none;">${bookLabel}</a></p>
    </td>
  </tr>
</table>`;

  const sigPreview = `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;max-width:420px;">
    <tr>
      <td style="padding-right:14px;vertical-align:top;border-right:2px solid #f96f6e;">
        <p style="margin:0;font-size:14px;font-weight:700;color:#151515;">Nari Fateha</p>
        <p style="margin:2px 0 0;font-size:10px;color:#6d625a;">${speakerLabel}</p>
        <p style="margin:4px 0 0;font-size:11px;color:#4bada8;font-weight:600;">Criar Sin Culpas</p>
      </td>
      <td style="padding-left:14px;vertical-align:top;">
        <p style="margin:0;font-size:10px;color:#6d625a;">📧 nari@criarsinculpas.com</p>
        <p style="margin:3px 0 0;font-size:10px;color:#4bada8;">🌐 criarsinculpas.com</p>
        <p style="margin:3px 0 0;font-size:10px;color:#6d625a;">📲 @criarsinculpas</p>
        <p style="margin:6px 0 0;"><a href="${pubUrl}" style="display:inline-block;padding:4px 10px;background:#f96f6e;color:#fff;border-radius:999px;font-size:10px;font-weight:600;text-decoration:none;">${bookLabel}</a></p>
      </td>
    </tr>
  </table>`;

  const sigPrev = document.getElementById('emb-preview-email-sig');
  const sigCode = document.getElementById('emb-code-email-sig');
  if (sigPrev) sigPrev.innerHTML = sigPreview;
  if (sigCode) sigCode.value = sigHTML;

  /* ── 3. BIO BLOCK (Markdown) ── */
  const mdTopics = topics.map(t => `- ${t}`).join('\n');
  const bioMd = `## Nari Fateha
**${role}**

${bio}

### ${lang === 'en' ? 'Topics' : 'Temas'}
${mdTopics}

---
📧 nari@criarsinculpas.com  
🌐 criarsinculpas.com  
📲 @criarsinculpas  
${lang === 'en' ? '🔗 Full speaker dossier' : '🔗 Dossier completo'}: ${pubUrl}`;

  const bioPreviewHTML = `<div style="color:#2f2a26;font-size:13px;">
    <h2 style="margin:0 0 2px;font-size:18px;font-weight:600;color:#151515;">Nari Fateha</h2>
    <p style="margin:0 0 12px;font-size:11px;color:#6d625a;">${role}</p>
    <p style="margin:0 0 14px;line-height:1.65;">${bio}</p>
    <p style="margin:0 0 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:#4bada8;">${lang === 'en' ? 'Topics' : 'Temas'}</p>
    <ul style="margin:0 0 14px;padding-left:18px;">${topics.map(t => `<li style="margin-bottom:2px;font-size:12px;">${t}</li>`).join('')}</ul>
    <p style="margin:0;font-size:11px;color:#6d625a;">nari@criarsinculpas.com · criarsinculpas.com · @criarsinculpas</p>
  </div>`;

  const bioPrev = document.getElementById('emb-preview-bio-block');
  const bioCode = document.getElementById('emb-code-bio-block');
  if (bioPrev) bioPrev.innerHTML = bioPreviewHTML;
  if (bioCode) bioCode.value = bioMd;
  // store plain text version for alternate copy button
  bioCode && (bioCode.dataset.plain = `Nari Fateha\n${role}\n\n${bio}\n\n${lang === 'en' ? 'Topics' : 'Temas'}:\n${topics.join(', ')}\n\nnari@criarsinculpas.com | criarsinculpas.com | @criarsinculpas\n${pubUrl}`);

  /* ── 4. NOTION / IFRAME ── */
  const notionUrl = document.getElementById('emb-notion-url');
  const iframeCode = document.getElementById('emb-iframe-code');
  if (notionUrl) notionUrl.value = pubUrl;
  if (iframeCode) iframeCode.value = `<iframe src="${pubUrl}" width="100%" height="480" frameborder="0" style="border-radius:10px;border:1px solid #ede3d7;" title="Nari Fateha — Criar Sin Culpas" loading="lazy"></iframe>`;
}

function shrPickEmbedFormat(fmt, btn) {
  // Toggle card active state
  document.querySelectorAll('.emb-format-card').forEach(c => c.classList.remove('active'));
  if (btn) btn.classList.add('active');
  else {
    const target = document.querySelector(`.emb-format-card[data-fmt="${fmt}"]`);
    if (target) target.classList.add('active');
  }
  // Show correct output panel
  ['speaker-card','email-sig','bio-block','notion'].forEach(f => {
    const panel = document.getElementById(`emb-out-${f}`);
    if (panel) panel.style.display = f === fmt ? 'block' : 'none';
  });
}

function shrCopyBioPlain() {
  const el = document.getElementById('emb-code-bio-block');
  if (!el) return;
  const text = el.dataset.plain || el.value;
  navigator.clipboard.writeText(text).then(() => shrFlashCopied(null));
}

/* ── TOGGLE MENU ─────────────────────────────────────────── */
function toggleMenu() { goToSection('requests'); }

/* ── SIGNALS LEDGER MODAL ────────────────────────────────── */
function openSignalsLedger() {
  renderSignals();
  const modal = document.getElementById('signals-modal');
  if (modal) {
    modal.style.display = 'flex';
    requestAnimationFrame(() => { modal.style.opacity = '1'; });
  }
}
function closeSignalsLedger() {
  const modal = document.getElementById('signals-modal');
  if (modal) {
    modal.style.opacity = '0';
    setTimeout(() => { modal.style.display = 'none'; }, 300);
  }
}

/* ── MICRO INTERACTIONS ──────────────────────────────────── */
function initMicroInteractions() {
  document.querySelectorAll('.artifact-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transition = 'all 0.22s cubic-bezier(0.4,0,0.2,1)';
    });
  });
  document.querySelectorAll('.signal-item').forEach((item, i) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-8px)';
    setTimeout(() => {
      item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      item.style.opacity = '1';
      item.style.transform = 'translateX(0)';
    }, i * 80);
  });
}

/* ── SCROLL ──────────────────────────────────────────────── */
function initScrollBehavior() {
  document.querySelectorAll('a[href="#"]').forEach(link => {
    link.addEventListener('click', e => e.preventDefault());
  });
}

/* ── KEYBOARD ────────────────────────────────────────────── */
function initKeyboardNav() {
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      if (state.mobileMenuOpen) toggleMobileMenu();
      closeSignalsLedger();
    }
  });
}

/* ── AMBIENT BG ──────────────────────────────────────────── */
function initAmbientBg() {
  const style = document.createElement('style');
  style.textContent = `.workspace-main::before { content:''; position:fixed; top:0;left:0;right:0;bottom:0; background:radial-gradient(ellipse 70% 50% at 20% 20%, rgba(249,111,110,0.03) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 80% 80%, rgba(46,211,198,0.02) 0%, transparent 60%); pointer-events:none; z-index:-1; }`;
  document.head.appendChild(style);
}

/* ── SECTION ENTRANCE ANIMATIONS ────────────────────────── */
function animateSectionEntrance(sectionId) {
  const section = document.getElementById('section-' + sectionId);
  if (!section) return;
  section.querySelectorAll('.stat-card, .artifact-card-mini, .qa-item, .talk-card, .mix-card, .phase-cell').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(12px)';
    el.style.transition = 'none';
    setTimeout(() => {
      el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, i * 60);
  });
}

function observeSections() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.stat-card, .artifact-card-mini, .qa-item, .talk-card, .mix-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(12px)';
    el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    observer.observe(el);
  });
}

/* ── GATE PARTICLES ──────────────────────────────────────── */
function initGateParticles() {
  const gate = document.getElementById('gate');
  if (!gate) return;
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;pointer-events:none;opacity:0.3;';
  gate.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let particles = [], animId;

  function resize() { canvas.width = gate.offsetWidth; canvas.height = gate.offsetHeight; }
  function createParticle() {
    return { x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3, vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.4 - 0.1, alpha: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.5 ? '#F96F6E' : '#2ED3C6' };
  }
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color; ctx.globalAlpha = p.alpha; ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.y < -5) { particles[i] = createParticle(); particles[i].y = canvas.height + 5; }
    });
    ctx.globalAlpha = 1;
    animId = requestAnimationFrame(draw);
  }
  resize();
  particles = Array.from({ length: 60 }, createParticle);
  draw();
  window.addEventListener('resize', resize);
  window.addEventListener('workspaceEntered', () => { cancelAnimationFrame(animId); canvas.remove(); });
}

/* ── INIT ALL ────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {
  // Apply saved language immediately
  window.__cscLang = state.lang;
  applyLang();

  initLangToggles();
  initMegaMenu();
  initArtifactFilter();
  initPrioritySelector();
  initScrollBehavior();
  initKeyboardNav();
  initAmbientBg();
  initGateParticles();

  const workspaceObserver = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      if (mutation.target.id === 'workspace' && !mutation.target.classList.contains('hidden')) {
        setTimeout(observeSections, 200);
        renderArtifactPhases();
        renderSignals();
        workspaceObserver.disconnect();
      }
    });
  });
  workspaceObserver.observe(document.getElementById('workspace'), { attributes: true, attributeFilter: ['class'] });

  window.addEventListener('load', () => {
    const gateInner = document.querySelector('.gate-inner');
    if (gateInner) {
      gateInner.style.opacity = '0';
      gateInner.style.transform = 'translateY(24px)';
      setTimeout(() => {
        gateInner.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        gateInner.style.opacity = '1';
        gateInner.style.transform = 'translateY(0)';
      }, 100);
    }
  });

  // Close signals modal on backdrop click
  document.getElementById('signals-modal')?.addEventListener('click', function(e) {
    if (e.target === this) closeSignalsLedger();
  });

  // Vault info tooltips
  initVaultTooltips();
});

/* ══════════════════════════════════════════════════════════
   VAULT TOOLTIP ENGINE
══════════════════════════════════════════════════════════ */
function initVaultTooltips() {
  // Create single shared tooltip bubble
  let tip = document.getElementById('vault-tooltip-bubble');
  if (!tip) {
    tip = document.createElement('div');
    tip.id = 'vault-tooltip-bubble';
    tip.className = 'vault-tooltip';
    tip.setAttribute('role', 'tooltip');
    document.body.appendChild(tip);
  }

  let hideTimer = null;

  function showTip(icon) {
    clearTimeout(hideTimer);
    const text = icon.dataset.tooltip;
    if (!text) return;

    tip.textContent = text;
    tip.classList.add('visible');

    // Position: above the icon, centered
    const rect = icon.getBoundingClientRect();
    const tipW  = 300; // max-width matches CSS
    let left = rect.left + rect.width / 2 - tipW / 2;
    let top  = rect.top - tip.offsetHeight - 12 + window.scrollY;

    // Clamp to viewport horizontally
    left = Math.max(12, Math.min(left, window.innerWidth - tipW - 12));

    // If not enough space above, flip below
    if (rect.top - tip.offsetHeight - 12 < 8) {
      top = rect.bottom + 10 + window.scrollY;
    }

    tip.style.left = left + 'px';
    tip.style.top  = top  + 'px';
    tip.style.width = tipW + 'px';
  }

  function hideTip() {
    hideTimer = setTimeout(() => tip.classList.remove('visible'), 120);
  }

  // Wire up all ⓘ icons (works on both static and dynamically added ones)
  function attachIcons() {
    document.querySelectorAll('.vault-info-icon').forEach(icon => {
      if (icon._tipBound) return; // already attached
      icon._tipBound = true;

      // Mouse
      icon.addEventListener('mouseenter', () => showTip(icon));
      icon.addEventListener('mouseleave', hideTip);

      // Touch / keyboard
      icon.addEventListener('focus', () => showTip(icon));
      icon.addEventListener('blur',  hideTip);
      icon.addEventListener('click', (e) => {
        e.stopPropagation();
        tip.classList.contains('visible') ? hideTip() : showTip(icon);
      });
    });
  }

  attachIcons();

  // Re-attach when workspace becomes visible (dynamic render)
  const ws = document.getElementById('workspace');
  if (ws) {
    new MutationObserver(attachIcons).observe(ws, { childList: true, subtree: true });
  }

  // Clicking anywhere else hides
  document.addEventListener('click', (e) => {
    if (!e.target.classList.contains('vault-info-icon')) hideTip();
  });
}
