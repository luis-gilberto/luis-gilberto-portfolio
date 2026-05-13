# TRAE PROMPT — Project Journey Section
## Task: Add "De caos a crecimiento" section to nari-method-prod/index.html
### Date: April 2026 | Author: Luis Gilberto

---

## CONTEXT

You are editing a single file: `nari-method-prod/index.html`

This is a polished, production workspace for client "Nari" (Criar Sin Culpas). The file is sensitive. **You must not touch anything outside the specific insertion points listed below.** No refactoring. No reformatting. No renaming. No style changes outside what is explicitly described. One surgical insertion. That's it.

---

## OBJECTIVE

Add a new section called **"Project Journey"** (`id="section-journey"`) to `index.html`.

This section tells a transformation story — **chaos → structure → growth** — through three project phases: Diagnóstico, Arquitectura, and Activación. It is NOT a document list. It is a narrative UI.

---

## WHAT TO ADD

### 1. DRAWER NAVIGATION ENTRY

**Location:** Inside the `<div class="csc-drawer-section">` block that contains the Workspace nav (Home, Artifacts, Activity, Strategic Record). This is approximately **line 188–194**.

**Find this exact block:**
```html
<div class="csc-drawer-section">
  <div class="csc-drawer-label"><span class="lb-en">Workspace</span><span class="lb-es active">Proyecto</span></div>
  <button class="csc-drawer-link" onclick="cscNavGo('home')"><span><span class="lb-en">Home</span><span class="lb-es active">Inicio</span></span><span class="csc-dnl-arrow">›</span></button>
  <button class="csc-drawer-link" onclick="cscNavGo('artifacts')"><span><span class="lb-en">Artifacts</span><span class="lb-es active">Arquitectura</span></span><span class="csc-dnl-arrow">›</span></button>
  <button class="csc-drawer-link" onclick="cscNavGo('activity')"><span><span class="lb-en">Activity</span><span class="lb-es active">Actividad</span></span><span class="csc-dnl-arrow">›</span></button>
  <button class="csc-drawer-link" onclick="cscNavGo('record')"><span><span class="lb-en">Strategic Record</span><span class="lb-es active">Registro Estratégico</span></span><span class="csc-dnl-arrow">›</span></button>
</div>
```

**Add the following button AFTER the "Activity" button and BEFORE the "Strategic Record" button:**
```html
<button class="csc-drawer-link" onclick="cscNavGo('journey')"><span><span class="lb-en">Project Journey</span><span class="lb-es active">Recorrido del Proyecto</span></span><span class="csc-dnl-arrow">›</span></button>
```

**Result after edit:**
```html
<button class="csc-drawer-link" onclick="cscNavGo('activity')">...</button>
<button class="csc-drawer-link" onclick="cscNavGo('journey')"><span><span class="lb-en">Project Journey</span><span class="lb-es active">Recorrido del Proyecto</span></span><span class="csc-dnl-arrow">›</span></button>
<button class="csc-drawer-link" onclick="cscNavGo('record')">...</button>
```

---

### 2. NEW SECTION HTML

**Location:** Insert the entire block below BETWEEN the closing `</section>` of `id="section-activity"` (approximately line 679) and the opening comment of `id="section-record"` (approximately line 681).

**Find this exact string as your anchor point:**
```html
      <!-- ─── SECTION: STRATEGIC RECORD ─── -->
      <section id="section-record" class="ws-section">
```

**Insert the following block IMMEDIATELY BEFORE that anchor string:**

```html
      <!-- ─── SECTION: PROJECT JOURNEY ─── -->
      <section id="section-journey" class="ws-section">

        <!-- SECTION HEADER -->
        <div class="section-header">
          <div class="section-eyebrow"><span class="lb-en">StrategyIQ · Criar Sin Culpas</span><span class="lb-es active">StrategyIQ · Criar Sin Culpas</span></div>
          <h2 class="section-title"><span class="lb-en">From chaos to <em>growth</em></span><span class="lb-es active">De caos a <em>crecimiento</em></span></h2>
          <p class="section-desc"><span class="lb-en">This is not a document archive. It is the record of a transformation — from understanding the business, to building the system, to activating it and making it grow.</span><span class="lb-es active">Este no es un archivo de documentos. Es el registro de una transformación — de entender el negocio, a construir el sistema, a activarlo y hacerlo crecer.</span></p>
        </div>

        <!-- PROGRESS BAR -->
        <div class="journey-progress" style="max-width:860px;margin:0 auto 48px;padding-left:80px;">
          <div style="height:3px;background:rgba(255,255,255,0.07);border-radius:999px;overflow:hidden;margin-bottom:10px;">
            <div style="height:100%;width:60%;background:linear-gradient(90deg,#4ecdc4,#f96f6e);border-radius:999px;"></div>
          </div>
          <div style="display:flex;justify-content:space-between;">
            <span style="font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#4ecdc4;"><span class="lb-en">Diagnosis ✓</span><span class="lb-es active">Diagnóstico ✓</span></span>
            <span style="font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#f96f6e;"><span class="lb-en">Architecture ◉</span><span class="lb-es active">Arquitectura ◉</span></span>
            <span style="font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(240,236,229,0.35);"><span class="lb-en">Activation</span><span class="lb-es active">Activación</span></span>
          </div>
        </div>

        <!-- JOURNEY SPINE -->
        <div class="pj-journey">

          <!-- ── PHASE 01 · DIAGNÓSTICO ── -->
          <div class="pj-phase">
            <div class="pj-node pj-done">01</div>
            <div class="pj-connector"></div>
            <div class="pj-card pj-card-done">
              <div class="pj-head">
                <div class="pj-head-left">
                  <div class="pj-label pj-label-done"><span class="lb-en">Phase 01 · Diagnosis</span><span class="lb-es active">Fase 01 · Diagnóstico</span></div>
                  <div class="pj-title"><span class="lb-en">Understand the business</span><span class="lb-es active">Entender el negocio</span></div>
                  <div class="pj-subtitle"><span class="lb-en">"What is actually happening here?"</span><span class="lb-es active">"¿Qué está pasando realmente aquí?"</span></div>
                </div>
                <div class="pj-status pj-status-done"><span class="lb-en">Certified ✓</span><span class="lb-es active">Certificado ✓</span></div>
              </div>
              <div class="pj-body">
                <p class="pj-narrative">
                  <span class="lb-en">This phase converts chaos into clarity. <strong>We analyzed the creator, the audience, and the market</strong> until we could define the opportunity and positioning with precision. The result: a certified strategic diagnosis that serves as the foundation for everything that follows.</span>
                  <span class="lb-es active">Esta fase convierte el caos en claridad. <strong>Analizamos a la creadora, la audiencia y el mercado</strong> hasta poder definir con precisión la oportunidad y el posicionamiento. El resultado: un diagnóstico estratégico certificado que sirve como base para todo lo que viene después.</span>
                </p>

                <div class="pj-core-output">
                  <div class="pj-sublabel"><span class="lb-en">Core output</span><span class="lb-es active">Output principal</span></div>
                  <div class="pj-output-card">
                    <div class="pj-output-info">
                      <div class="pj-output-tag pj-tag-teal"><span class="lb-en">Certified Diagnosis</span><span class="lb-es active">Diagnóstico Certificado</span></div>
                      <div class="pj-output-name"><span class="lb-en">Strategic Diagnosis · SIQ-01</span><span class="lb-es active">Diagnóstico Estratégico · SIQ-01</span></div>
                      <div class="pj-output-desc"><span class="lb-en">The moment everything makes sense. We understand the game being played.</span><span class="lb-es active">El momento en que todo toma sentido. Entendemos el juego que se está jugando.</span></div>
                    </div>
                    <a href="https://www.luis-gilberto.com/TheHub/clients/nari/files/SIQ-01_StrategicDiagnosis_CriarSinCulpas.pdf" target="_blank" class="pj-output-link pj-link-teal">
                      <span class="lb-en">Open ↗</span><span class="lb-es active">Abrir ↗</span>
                    </a>
                  </div>
                </div>

                <div class="pj-sublabel"><span class="lb-en">Supporting artifacts</span><span class="lb-es active">Artefactos de soporte</span></div>
                <div class="pj-artifacts">
                  <a href="https://www.luis-gilberto.com/TheHub/clients/nari/files/SIQ_A01_SpeakerMediaKit_CSC" target="_blank" class="pj-tile">
                    <div class="pj-tile-code">A01</div>
                    <div class="pj-tile-name"><span class="lb-en">Speaker Positioning Kit</span><span class="lb-es active">Kit de Posicionamiento para Ponentes</span></div>
                    <div class="pj-tile-desc"><span class="lb-en">External expression of positioning. This is how the world should see you.</span><span class="lb-es active">Expresión externa del posicionamiento. Así es como el mundo debería verte.</span></div>
                    <div class="pj-tile-foot"><span class="pj-tile-lang">ES / EN</span><span class="pj-tile-arrow">↗</span></div>
                  </a>
                  <a href="https://www.luis-gilberto.com/TheHub/clients/nari/files/SIQ_A02_MonetizationReport_CSC" target="_blank" class="pj-tile">
                    <div class="pj-tile-code">A02 · Reporte</div>
                    <div class="pj-tile-name"><span class="lb-en">Monetization Research</span><span class="lb-es active">Investigación de Monetización</span></div>
                    <div class="pj-tile-desc"><span class="lb-en">Market reality. This is how people like you generate income.</span><span class="lb-es active">Realidad del mercado. Así es como personas como tú generan ingresos.</span></div>
                    <div class="pj-tile-foot"><span class="pj-tile-lang">ES / EN</span><span class="pj-tile-arrow">↗</span></div>
                  </a>
                </div>

                <div class="pj-decision">
                  <div class="pj-decision-icon">⚡</div>
                  <div>
                    <div class="pj-decision-label"><span class="lb-en">Strategic Decision · SR-001 + SR-002</span><span class="lb-es active">Decisión estratégica · SR-001 + SR-002</span></div>
                    <div class="pj-decision-text"><span class="lb-en">Strategy will focus on translating existing parenting frameworks into a structured learning architecture — not on increasing content production or audience size.</span><span class="lb-es active">La estrategia se enfocará en traducir los marcos de crianza existentes en una arquitectura de aprendizaje estructurada — no en aumentar la producción de contenido ni el tamaño de la audiencia.</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ── PHASE 02 · ARQUITECTURA ── -->
          <div class="pj-phase">
            <div class="pj-node pj-active">02</div>
            <div class="pj-connector"></div>
            <div class="pj-card pj-card-active">
              <div class="pj-head">
                <div class="pj-head-left">
                  <div class="pj-label pj-label-active"><span class="lb-en">Phase 02 · Architecture · In Progress</span><span class="lb-es active">Fase 02 · Arquitectura · En Progreso</span></div>
                  <div class="pj-title"><span class="lb-en">Build the system</span><span class="lb-es active">Construir el sistema</span></div>
                  <div class="pj-subtitle"><span class="lb-en">"Now we build the machine."</span><span class="lb-es active">"Ahora construimos la máquina."</span></div>
                </div>
                <div class="pj-status pj-status-active"><span class="lb-en">◉ In Progress</span><span class="lb-es active">◉ En Progreso</span></div>
              </div>
              <div class="pj-body">
                <p class="pj-narrative">
                  <span class="lb-en">This is where strategy becomes system. <strong>We transform insights into a structured methodology</strong>, validate it against real content, and build the financial and execution logic. This is where the business becomes repeatable and scalable.</span>
                  <span class="lb-es active">Aquí la estrategia se convierte en sistema. <strong>Transformamos los insights en una metodología estructurada</strong>, la validamos contra contenido real y construimos la lógica financiera y de ejecución. Es donde el negocio se vuelve repetible y escalable.</span>
                </p>

                <!-- METHOD BLOCK -->
                <div class="pj-method">
                  <div class="pj-method-label"><span class="lb-en">The heart of it all · The Nari Method</span><span class="lb-es active">El corazón de todo · El Método Nari</span></div>
                  <div class="pj-method-title"><span class="lb-en">The transformation engine of Criar Sin Culpas</span><span class="lb-es active">El motor de transformación de Criar Sin Culpas</span></div>
                  <div class="pj-method-steps">
                    <div class="pj-step"><div class="pj-step-num">01</div><div class="pj-step-name"><span class="lb-en">Accept</span><span class="lb-es active">Aceptar</span></div></div>
                    <div class="pj-step"><div class="pj-step-num">02</div><div class="pj-step-name"><span class="lb-en">Stabilize</span><span class="lb-es active">Estabilizar</span></div></div>
                    <div class="pj-step"><div class="pj-step-num">03</div><div class="pj-step-name"><span class="lb-en">Connect</span><span class="lb-es active">Conectar</span></div></div>
                    <div class="pj-step"><div class="pj-step-num">04</div><div class="pj-step-name"><span class="lb-en">Guide</span><span class="lb-es active">Guiar</span></div></div>
                  </div>
                </div>

                <div class="pj-core-output">
                  <div class="pj-sublabel"><span class="lb-en">Core output</span><span class="lb-es active">Output principal</span></div>
                  <div class="pj-output-card pj-output-coral">
                    <div class="pj-output-info">
                      <div class="pj-output-tag pj-tag-coral"><span class="lb-en">Certified Architecture</span><span class="lb-es active">Arquitectura Certificada</span></div>
                      <div class="pj-output-name"><span class="lb-en">Program Architecture · SIQ-02</span><span class="lb-es active">Arquitectura del Programa · SIQ-02</span></div>
                      <div class="pj-output-desc"><span class="lb-en">50+ workshops converted into a structured learning journey.</span><span class="lb-es active">50+ talleres convertidos en un recorrido de aprendizaje estructurado.</span></div>
                    </div>
                    <a href="https://www.luis-gilberto.com/TheHub/clients/nari/files/SIQ-02_ProgramArchitecture_CriarSinCulpas.pdf" target="_blank" class="pj-output-link pj-link-coral">
                      <span class="lb-en">Open ↗</span><span class="lb-es active">Abrir ↗</span>
                    </a>
                  </div>
                </div>

                <div class="pj-sublabel"><span class="lb-en">Supporting artifacts</span><span class="lb-es active">Artefactos de soporte</span></div>
                <div class="pj-artifacts">
                  <a href="https://www.luis-gilberto.com/TheHub/clients/nari/files/SIQ-03_ProductArchitecture_CriarSinCulpas.pdf" target="_blank" class="pj-tile">
                    <div class="pj-tile-code"><span class="lb-en">SIQ-03 · In Progress</span><span class="lb-es active">SIQ-03 · En Progreso</span></div>
                    <div class="pj-tile-name"><span class="lb-en">Product Architecture</span><span class="lb-es active">Arquitectura de Productos</span></div>
                    <div class="pj-tile-desc"><span class="lb-en">Converting the method into scalable offers — Entry, Core and Premium.</span><span class="lb-es active">Conversión del método en ofertas escalables — Entry, Core y Premium.</span></div>
                    <div class="pj-tile-foot"><span class="pj-tile-lang">ES / EN</span><span class="pj-tile-arrow">↗</span></div>
                  </a>
                  <a href="https://www.luis-gilberto.com/TheHub/clients/nari/files/SIQ_A02_CommercialActivationBrief_CSC" target="_blank" class="pj-tile">
                    <div class="pj-tile-code">A04 · Brief</div>
                    <div class="pj-tile-name"><span class="lb-en">Commercial Activation Brief</span><span class="lb-es active">Dossier de Activación Comercial</span></div>
                    <div class="pj-tile-desc"><span class="lb-en">Two revenue engines, three scenarios, first steps to activate the business model.</span><span class="lb-es active">Dos motores de ingreso, tres escenarios, primeros pasos para activar el modelo de negocio.</span></div>
                    <div class="pj-tile-foot"><span class="pj-tile-lang">ES / EN</span><span class="pj-tile-arrow">↗</span></div>
                  </a>
                </div>

                <div class="pj-decision">
                  <div class="pj-decision-icon">⚡</div>
                  <div>
                    <div class="pj-decision-label"><span class="lb-en">Strategic Decision · SR-003</span><span class="lb-es active">Decisión estratégica · SR-003</span></div>
                    <div class="pj-decision-text"><span class="lb-en">Three audience segments defined: Ashamed & Overwhelmed (highest volume) · Suspecting Neurodivergence (fastest growth) · Under-Equipped & Aware (highest purchase intent).</span><span class="lb-es active">Tres segmentos de audiencia definidos: Avergonzados y abrumados (mayor volumen) · Sospechan Neurodivergencia (crecimiento rápido) · Conscientes pero sin herramientas (mayor intención de compra).</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ── PHASE 03 · ACTIVACIÓN ── -->
          <div class="pj-phase">
            <div class="pj-node pj-pending">03</div>
            <div class="pj-connector"></div>
            <div class="pj-card pj-card-pending">
              <div class="pj-head">
                <div class="pj-head-left">
                  <div class="pj-label pj-label-pending"><span class="lb-en">Phase 03 · Activation</span><span class="lb-es active">Fase 03 · Activación</span></div>
                  <div class="pj-title"><span class="lb-en">Activate and grow</span><span class="lb-es active">Activar y crecer</span></div>
                  <div class="pj-subtitle"><span class="lb-en">"Now we turn it into revenue."</span><span class="lb-es active">"Ahora lo convertimos en ingresos."</span></div>
                </div>
                <div class="pj-status pj-status-pending"><span class="lb-en">Upcoming</span><span class="lb-es active">Próximo</span></div>
              </div>
              <div class="pj-pending-body">
                <div class="pj-pending-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/></svg>
                </div>
                <div class="pj-pending-text"><span class="lb-en">This phase activates upon completing Architecture. Will include: Commercial Activation Dossier · Brand Partnership Kit · StrategyIQ Campaign System.</span><span class="lb-es active">Esta fase se activa al completar la Arquitectura. Incluirá: Dossier de Activación Comercial · Kit de Alianzas con Marcas · Sistema de Campañas StrategyIQ.</span></div>
              </div>
            </div>
          </div>

        </div><!-- /pj-journey -->

      </section>
      <!-- ─── END SECTION: PROJECT JOURNEY ─── -->

```

---

### 3. CSS STYLES

**Location:** Find the closing `</style>` tag in the `<head>` of `index.html`. Insert the following CSS block **immediately before** that `</style>` tag.

```css
    /* ═══════════════════════════════════════════
       PROJECT JOURNEY SECTION  (pj-*)
       ─────────────────────────────────────────── */
    .pj-journey {
      max-width: 860px;
      margin: 0 auto;
      position: relative;
    }
    .pj-journey::before {
      content: '';
      position: absolute;
      left: 32px;
      top: 24px;
      bottom: 24px;
      width: 1px;
      background: linear-gradient(180deg,
        rgba(78,205,196,0.4) 0%,
        rgba(78,205,196,0.2) 40%,
        rgba(249,111,110,0.2) 60%,
        rgba(249,111,110,0.05) 100%);
    }
    .pj-phase {
      position: relative;
      padding-left: 80px;
      margin-bottom: 56px;
    }
    .pj-phase:last-child { margin-bottom: 0; }
    .pj-node {
      position: absolute;
      left: 20px;
      top: 20px;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.04em;
      z-index: 2;
    }
    .pj-done  { background: #4ecdc4; color: #0e0e0f; box-shadow: 0 0 0 4px rgba(78,205,196,0.12); }
    .pj-active { background: #f96f6e; color: #fff; box-shadow: 0 0 0 4px rgba(249,111,110,0.15), 0 0 16px rgba(249,111,110,0.3); }
    .pj-pending { background: #1c1c1f; border: 1px solid rgba(255,255,255,0.07); color: rgba(240,236,229,0.35); }
    .pj-connector {
      position: absolute;
      left: 32px;
      top: 46px;
      bottom: -56px;
      width: 1px;
      background: rgba(255,255,255,0.04);
    }
    .pj-phase:last-child .pj-connector { display: none; }
    .pj-card {
      background: #161618;
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 14px;
      overflow: hidden;
    }
    .pj-card-done   { border-color: rgba(78,205,196,0.15); }
    .pj-card-active { border-color: rgba(249,111,110,0.2); }
    .pj-card-pending { opacity: 0.5; }
    .pj-head {
      padding: 24px 28px 20px;
      border-bottom: 1px solid rgba(255,255,255,0.04);
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
    }
    .pj-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    .pj-label-done    { color: #4ecdc4; }
    .pj-label-active  { color: #f96f6e; }
    .pj-label-pending { color: rgba(240,236,229,0.35); }
    .pj-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 26px;
      font-weight: 600;
      color: #f0ece5;
      letter-spacing: -0.01em;
      margin-bottom: 6px;
      line-height: 1.15;
    }
    .pj-subtitle { font-size: 13px; color: rgba(240,236,229,0.65); font-weight: 300; font-style: italic; }
    .pj-status {
      flex-shrink: 0;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 5px 12px;
      border-radius: 999px;
    }
    .pj-status-done    { background: rgba(78,205,196,0.12); color: #4ecdc4; border: 1px solid rgba(78,205,196,0.2); }
    .pj-status-active  { background: rgba(249,111,110,0.1); color: #f96f6e; border: 1px solid rgba(249,111,110,0.2); }
    .pj-status-pending { background: rgba(255,255,255,0.04); color: rgba(240,236,229,0.35); border: 1px solid rgba(255,255,255,0.07); }
    .pj-body { padding: 24px 28px; }
    .pj-narrative {
      font-size: 14px;
      line-height: 1.75;
      color: rgba(240,236,229,0.65);
      font-weight: 300;
      margin-bottom: 24px;
      padding-bottom: 24px;
      border-bottom: 1px solid rgba(255,255,255,0.04);
    }
    .pj-narrative strong { color: #f0ece5; font-weight: 500; }
    .pj-sublabel {
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: rgba(240,236,229,0.35);
      margin-bottom: 12px;
    }
    .pj-core-output { margin-bottom: 24px; }
    .pj-output-card {
      background: linear-gradient(135deg,rgba(78,205,196,0.06) 0%,rgba(78,205,196,0.02) 100%);
      border: 1px solid rgba(78,205,196,0.2);
      border-radius: 8px;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }
    .pj-output-coral {
      background: linear-gradient(135deg,rgba(249,111,110,0.06) 0%,rgba(249,111,110,0.02) 100%);
      border-color: rgba(249,111,110,0.2);
    }
    .pj-output-tag { font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 4px; }
    .pj-tag-teal  { color: #4ecdc4; }
    .pj-tag-coral { color: #f96f6e; }
    .pj-output-name { font-size: 14px; font-weight: 500; color: #f0ece5; margin-bottom: 3px; }
    .pj-output-desc { font-size: 12px; color: rgba(240,236,229,0.35); font-weight: 300; }
    .pj-output-link {
      flex-shrink: 0;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
      padding: 8px 14px;
      border-radius: 999px;
      transition: opacity 0.2s;
    }
    .pj-output-link:hover { opacity: 0.75; }
    .pj-link-teal  { color: #4ecdc4; background: rgba(78,205,196,0.12); border: 1px solid rgba(78,205,196,0.2); }
    .pj-link-coral { color: #f96f6e; background: rgba(249,111,110,0.1); border: 1px solid rgba(249,111,110,0.2); }
    .pj-artifacts {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 10px;
      margin-bottom: 20px;
    }
    .pj-tile {
      background: #1c1c1f;
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 8px;
      padding: 14px 16px;
      text-decoration: none;
      display: block;
      transition: border-color 0.2s;
    }
    .pj-tile:hover { border-color: rgba(255,255,255,0.15); }
    .pj-tile-code { font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(240,236,229,0.35); margin-bottom: 6px; }
    .pj-tile-name { font-size: 13px; font-weight: 500; color: #f0ece5; margin-bottom: 4px; line-height: 1.3; }
    .pj-tile-desc { font-size: 11px; color: rgba(240,236,229,0.35); font-weight: 300; line-height: 1.5; }
    .pj-tile-foot { display: flex; align-items: center; justify-content: space-between; margin-top: 10px; }
    .pj-tile-lang { font-size: 9px; font-weight: 600; letter-spacing: 0.1em; color: rgba(240,236,229,0.35); }
    .pj-tile-arrow { font-size: 12px; color: rgba(240,236,229,0.35); }
    .pj-decision {
      background: rgba(232,200,122,0.08);
      border: 1px solid rgba(232,200,122,0.2);
      border-radius: 8px;
      padding: 14px 18px;
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }
    .pj-decision-icon { font-size: 14px; flex-shrink: 0; margin-top: 1px; }
    .pj-decision-label { font-size: 9px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: #e8c87a; margin-bottom: 4px; }
    .pj-decision-text { font-size: 12px; color: rgba(232,200,122,0.75); font-weight: 300; line-height: 1.55; }
    .pj-method {
      background: linear-gradient(135deg,rgba(78,205,196,0.05) 0%,rgba(249,111,110,0.03) 100%);
      border: 1px solid rgba(78,205,196,0.15);
      border-radius: 14px;
      padding: 20px 22px;
      margin-bottom: 20px;
    }
    .pj-method-label { font-size: 9px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #4ecdc4; margin-bottom: 10px; }
    .pj-method-title { font-family: 'Cormorant Garamond', serif; font-size: 18px; font-weight: 600; color: #f0ece5; margin-bottom: 14px; }
    .pj-method-steps { display: grid; grid-template-columns: repeat(4,1fr); gap: 8px; }
    .pj-step { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 8px; padding: 10px 12px; text-align: center; }
    .pj-step-num { font-size: 9px; font-weight: 700; letter-spacing: 0.1em; color: #4ecdc4; margin-bottom: 4px; }
    .pj-step-name { font-size: 12px; font-weight: 500; color: #f0ece5; }
    .pj-pending-body { padding: 20px 28px; display: flex; align-items: center; gap: 12px; }
    .pj-pending-icon { width: 32px; height: 32px; border-radius: 50%; background: #1c1c1f; border: 1px solid rgba(255,255,255,0.07); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .pj-pending-text { font-size: 13px; color: rgba(240,236,229,0.35); font-weight: 300; }
    @media (max-width: 600px) {
      .pj-journey::before { left: 16px; }
      .pj-phase { padding-left: 48px; }
      .pj-node { left: 4px; width: 22px; height: 22px; }
      .pj-connector { left: 15px; }
      .pj-head { flex-direction: column; }
      .pj-title { font-size: 22px; }
      .pj-method-steps { grid-template-columns: repeat(2,1fr); }
      .pj-output-card { flex-direction: column; align-items: flex-start; }
      .pj-artifacts { grid-template-columns: 1fr; }
    }
    /* ─── END PROJECT JOURNEY ─── */
```

---

## RULES FOR TRAE

1. **Only touch three locations:** the drawer nav entry, the `</style>` tag (CSS insertion), and the section insertion point before `<!-- ─── SECTION: STRATEGIC RECORD ─── -->`.
2. **Do not modify** any existing CSS classes, JavaScript functions, or other sections.
3. **Do not rename** any existing IDs or classes.
4. **Do not reformat** the rest of the file.
5. **Do not add** any new JS — `cscNavGo('journey')` already works with the existing navigation function.
6. **Verify** that `id="section-journey"` does not already exist before inserting.
7. **All document links** must use `https://www.luis-gilberto.com/TheHub/clients/nari/files/` prefix — do not change them.
8. After editing, run a quick search to confirm `id="section-journey"` appears exactly once and `cscNavGo('journey')` appears exactly once in the drawer.

---

## SUMMARY OF CHANGES

| What | Where | Action |
|------|-------|--------|
| CSS block (all `pj-*` styles) | Before `</style>` in `<head>` | INSERT |
| Drawer nav button | After `cscNavGo('activity')` line, before `cscNavGo('record')` line | INSERT |
| Full section HTML | Before `<!-- ─── SECTION: STRATEGIC RECORD ─── -->` | INSERT |

**Total insertions: 3. Zero deletions. Zero modifications to existing content.**
