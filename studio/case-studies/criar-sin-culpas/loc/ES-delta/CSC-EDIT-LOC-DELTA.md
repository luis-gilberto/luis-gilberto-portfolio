# Criar Sin Culpas · Case Study — Localization DELTA

**Source:** `/studio/case-studies/criar-sin-culpas/` (working edit · EN)
**Baseline ES pack:** `loc/ES/` (prior complete handoff)
**Target locale:** Spanish (es) — LATAM / Mexico preferred
**Status:** ES translations complete for this delta — ready for Nari review
**Scope:** 72 strings new or revised since the ES pack · 32 prior ES strings retired
**Companions:** `csc-edit-delta-strings.csv` · `csc-edit-retire-orphans.csv`

---

## How to use

1. `csc-edit-delta-strings.csv` has ES filled in for all 72 rows.
2. `change=new` rows were translated fresh. `change=revised` rows were re-translated from the current EN — prior ES in Notes was reference only and was not reused where the underlying content changed.
3. Same voice rules as the original handoff (middot `·`, no unverified metrics beyond what's in the source, proper nouns and event names kept in English).
4. Ready to merge into the master ES pack.

## Do not translate (brand / product)

Criar Sin Culpas · LG Studio · StrategyIQ · Nari · Pantallas · Desbordes · Sueño · Hermanos · Emociones · Cine · Foto · Pin · Símbolo · Access Pass · Plausible Analytics (product name) · `portal_entered` · `language_changed` (event names — kept in English)

## Metrics / evidence note

Chapter 06 and 10 include Plausible figures (91-day window · May 22–August 20, 2026 · 223 visitors). Numbers kept exactly as sourced; only surrounding prose localized. Analytics event names (`portal_entered`, `language_changed`) and "Direct/None" traffic-source term rendered as **Directo/Ninguno** for readability, consistent with how Plausible labels that source in Spanish-language contexts — flag if you'd prefer it kept in English as a literal product-UI term.

---

## Translated strings

### 04 · VISUAL SUPPORT INFRASTRUCTURE

| ID | Change | Type | EN (source) | ES (target) | Notes |
|----|--------|------|-------------|-------------|-------|
| `04_visual_support_infrastruc_036` | revised | caption | Cine Editorial distance · Sueño | Cine Distancia editorial · Sueño | REVISED since ES pack. Prior EN: Sleep doodle · Prior ES (do not reuse blindly): Boceto de sueño |
| `04_visual_support_infrastruc_037` | revised | caption | Foto Doodle distance · Sueño | Foto Distancia de boceto · Sueño | REVISED since ES pack. Prior EN: Emociones · Prior ES (do not reuse blindly): Emociones |
| `04_visual_support_infrastruc_038` | revised | caption | Pin Compact mark · Sueño | Pin Marca compacta · Sueño | REVISED since ES pack. Prior EN: Desbordes · Prior ES (do not reuse blindly): Desbordes |
| `04_visual_support_infrastruc_039` | revised | caption | Símbolo System glyph · reusable | Símbolo Glifo del sistema · reutilizable | REVISED since ES pack. Prior EN: Pantallas · Prior ES (do not reuse blindly): Pantallas |
| `04_visual_support_infrastruc_040` | new | body | One drawing, four distances · then named, tagged, and filed for production. | Un dibujo, cuatro distancias · luego nombrado, etiquetado y archivado para producción. | NEW since ES pack · translate fresh |
| `04_visual_support_infrastruc_alt_053` | revised | alt | Sueño illustration at editorial distance | Ilustración de Sueño a distancia editorial | REVISED since ES pack. Prior EN: Emotions doodle crop · Prior ES (do not reuse blindly): Recorte del boceto de emociones |
| `04_visual_support_infrastruc_alt_054` | revised | alt | Sueño illustration at doodle distance | Ilustración de Sueño a distancia de boceto | REVISED since ES pack. Prior EN: Meltdowns doodle crop · Prior ES (do not reuse blindly): Recorte del boceto de desbordes |
| `04_visual_support_infrastruc_alt_055` | revised | alt | Sueño illustration at pin distance | Ilustración de Sueño a distancia de pin | REVISED since ES pack. Prior EN: Screens doodle crop · Prior ES (do not reuse blindly): Recorte del boceto de pantallas |
| `04_visual_support_infrastruc_alt_056` | new | alt | Open-hand symbol from the Criar Sin Culpas symbol set | Símbolo de mano abierta del set de símbolos de Criar Sin Culpas | Image alt text · translate for accessibility |

### 06 · FROM PROTOCOL TO PRODUCT SIGNAL

| ID | Change | Type | EN (source) | ES (target) | Notes |
|----|--------|------|-------------|-------------|-------|
| `06_from_protocol_to_product__008` | revised | label | Behavioral evidence | Evidencia de comportamiento | REVISED since ES pack. Prior EN: Decision · Prior ES (do not reuse blindly): Decisión |
| `06_from_protocol_to_product__009` | revised | heading | What behavior taught us | Lo que el comportamiento nos enseñó | REVISED since ES pack. Prior EN: Build a support ecosystem, not a content library. · Prior ES (do not reuse blindly): Construir un entramado de apoyo, no una biblioteca de contenido. |
| `06_from_protocol_to_product__010` | revised | body | Observed site behavior in a 91-day reporting window shaped how support and pathway decisions were prioritized. | El comportamiento observado en el sitio durante una ventana de reporte de 91 días definió cómo se priorizaron las decisiones de apoyo y de ruta. | REVISED since ES pack. Prior EN: Free protocols handle the moment. Deeper programs build capacity before the next one. · Prior ES (do not reuse blindly): Los protocolos gratuitos atienden el momento. Los programas más profundos construyen capacidad antes del siguiente. |
| `06_from_protocol_to_product__011` | revised | body | Evidence → Interpretation → Decision | Evidencia → Interpretación → Decisión | REVISED since ES pack. Prior EN: Free support → Evidence → Deeper support → New signals · Prior ES (do not reuse blindly): Apoyo gratuito → Evidencia → Apoyo más profundo → Nuevas señales |
| `06_from_protocol_to_product__012` | new | label | Entry signal | Señal de entrada | NEW since ES pack · translate fresh |
| `06_from_protocol_to_product__013` | new | body | Pantallas visitors | Visitantes de Pantallas | NEW since ES pack · translate fresh |
| `06_from_protocol_to_product__014` | new | label | Evidence | Evidencia | NEW since ES pack · translate fresh |
| `06_from_protocol_to_product__015` | new | body | Pantallas reached 71 visitors with 72% average scroll depth . | Pantallas alcanzó 71 visitantes con 72% de profundidad de scroll promedio. | NEW since ES pack · translate fresh |
| `06_from_protocol_to_product__016` | new | label | Interpretation | Interpretación | NEW since ES pack · translate fresh |
| `06_from_protocol_to_product__017` | new | body | A familiar, immediate conflict became the strongest protocol entry point. | Un conflicto conocido e inmediato se convirtió en el punto de entrada más fuerte a los protocolos. | NEW since ES pack · translate fresh |
| `06_from_protocol_to_product__019` | new | body | Keep urgent, recognizable needs at the front of the public support layer. | Mantener las necesidades urgentes y reconocibles al frente de la capa de apoyo pública. | NEW since ES pack · translate fresh |
| `06_from_protocol_to_product__020` | new | label | Depth signal | Señal de profundidad | NEW since ES pack · translate fresh |
| `06_from_protocol_to_product__021` | new | body | 108 sec | 108 seg | NEW since ES pack · translate fresh |
| `06_from_protocol_to_product__022` | new | body | Desbordes attention | Atención en Desbordes | NEW since ES pack · translate fresh |
| `06_from_protocol_to_product__024` | new | body | Desbordes reached 41 visitors, 79% average scroll depth , and 108 seconds average time on page. | Desbordes alcanzó 41 visitantes, 79% de profundidad de scroll promedio y 108 segundos de tiempo promedio en la página. | NEW since ES pack · translate fresh |
| `06_from_protocol_to_product__026` | new | body | Parents did not only sample acute-support content. They stayed with it. | Las familias no solo probaron el contenido de apoyo agudo. Se quedaron con él. | NEW since ES pack · translate fresh |
| `06_from_protocol_to_product__028` | new | body | Prioritize concise intervention first, with enough depth to support understanding after the immediate moment. | Priorizar primero la intervención concisa, con suficiente profundidad para apoyar la comprensión después del momento inmediato. | NEW since ES pack · translate fresh |
| `06_from_protocol_to_product__029` | new | label | Pathway signal | Señal de ruta | NEW since ES pack · translate fresh |
| `06_from_protocol_to_product__030` | new | body | ~30% | ~30% | NEW since ES pack · translate fresh |
| `06_from_protocol_to_product__031` | new | body | Portal entries | Entradas al portal | NEW since ES pack · translate fresh |
| `06_from_protocol_to_product__033` | new | body | 67 unique visitors triggered portal_entered, approximately 30% of the 223 visitors in the reporting window. | 67 visitantes únicos activaron portal_entered, aproximadamente el 30% de los 223 visitantes en la ventana de reporte. | NEW since ES pack · translate fresh |
| `06_from_protocol_to_product__035` | new | body | A meaningful share moved beyond an individual page into the broader support environment. | Una porción significativa avanzó más allá de una página individual hacia el entorno de apoyo más amplio. | NEW since ES pack · translate fresh |
| `06_from_protocol_to_product__037` | new | body | Continue developing an owned pathway rather than treating protocols as isolated content. | Continuar desarrollando una ruta propia en lugar de tratar los protocolos como contenido aislado. | NEW since ES pack · translate fresh |
| `06_from_protocol_to_product__038` | new | label | Language signal | Señal de idioma | NEW since ES pack · translate fresh |
| `06_from_protocol_to_product__039` | new | body | Language changes | Cambios de idioma | NEW since ES pack · translate fresh |
| `06_from_protocol_to_product__041` | new | body | 45 unique visitors triggered language_changed. | 45 visitantes únicos activaron language_changed. | NEW since ES pack · translate fresh |
| `06_from_protocol_to_product__043` | new | body | Visitors actively used the bilingual capability. | Los visitantes usaron activamente la capacidad bilingüe. | NEW since ES pack · translate fresh |
| `06_from_protocol_to_product__045` | new | body | Treat bilingual delivery as experience infrastructure, not a translation layer. | Tratar la entrega bilingüe como infraestructura de experiencia, no como una capa de traducción. | NEW since ES pack · translate fresh |
| `06_from_protocol_to_product__046` | new | body | Plausible Analytics · 91-day window · May 22–August 20, 2026 | Plausible Analytics · ventana de 91 días · 22 de mayo–20 de agosto, 2026 | NEW since ES pack · translate fresh |
| `06_from_protocol_to_product__047` | new | body | We initially assumed the opportunity was to organize educational content. Behavior showed that parents first needed immediate, navigable support. That changed the architecture. | Al inicio asumimos que la oportunidad era organizar contenido educativo. El comportamiento mostró que las familias necesitaban primero apoyo inmediato y navegable. Eso cambió la arquitectura. | NEW since ES pack · translate fresh |

### 10 · WHAT ACTUALLY CHANGED

| ID | Change | Type | EN (source) | ES (target) | Notes |
|----|--------|------|-------------|-------------|-------|
| `10_what_actually_changed_005` | revised | label | Pantallas visitors | Visitantes de Pantallas | REVISED since ES pack. Prior EN: Existing condition · Prior ES (do not reuse blindly): Condición existente |
| `10_what_actually_changed_006` | revised | body | Strongest protocol entry point · 72% average scroll | Punto de entrada más fuerte a los protocolos · 72% de scroll promedio | REVISED since ES pack. Prior EN: ~30K · Prior ES (do not reuse blindly): ~30K |
| `10_what_actually_changed_007` | revised | body | 108 SEC | 108 SEG | REVISED since ES pack. Prior EN: Instagram followers already existed before the owned system. · Prior ES (do not reuse blindly): Seguidores en Instagram que ya existían antes del sistema propio. |
| `10_what_actually_changed_008` | revised | label | Desbordes attention | Atención en Desbordes | REVISED since ES pack. Prior EN: Approximate starting audience documented in engagement materials. · Prior ES (do not reuse blindly): Audiencia inicial aproximada, documentada en los materiales de levantamiento. |
| `10_what_actually_changed_009` | revised | body | 41 visitors · 79% average scroll | 41 visitantes · 79% de scroll promedio | REVISED since ES pack. Prior EN: Shipped support · Prior ES (do not reuse blindly): Apoyo publicado |
| `10_what_actually_changed_010` | revised | label | Portal entries | Entradas al portal | REVISED since ES pack. Prior EN: Bilingual protocols launched on the owned platform. · Prior ES (do not reuse blindly): Protocolos bilingües lanzados en la plataforma propia. |
| `10_what_actually_changed_011` | revised | body | Unique visitors · approximately 30% of the reporting audience | Visitantes únicos · aproximadamente 30% de la audiencia del reporte | REVISED since ES pack. Prior EN: Pantallas · Desbordes · Sueño · Hermanos · Prior ES (do not reuse blindly): Pantallas · Desbordes · Sueño · Hermanos |
| `10_what_actually_changed_012` | revised | label | Language changes | Cambios de idioma | REVISED since ES pack. Prior EN: Owned experience · Prior ES (do not reuse blindly): Experiencia propia |
| `10_what_actually_changed_013` | revised | body | Unique visitors actively using the bilingual experience | Visitantes únicos que usan activamente la experiencia bilingüe | REVISED since ES pack. Prior EN: Public + bilingual · Prior ES (do not reuse blindly): Pública + bilingüe |
| `10_what_actually_changed_014` | revised | body | Plausible Analytics · May 22–August 20, 2026 · 223 total visitors | Plausible Analytics · 22 de mayo–20 de agosto, 2026 · 223 visitantes totales | REVISED since ES pack. Prior EN: Support moved beyond social publishing into owned protocols, editorial guidance, and reusable pathways. · Prior ES (do not reuse blindly): El apoyo pasó de la publicación en redes sociales a protocolos propios, guía editorial y rutas reutilizables. |
| `10_what_actually_changed_015` | revised | label | What the experience validated | Lo que la experiencia validó | REVISED since ES pack. Prior EN: Operating practice · Prior ES (do not reuse blindly): Práctica operativa |
| `10_what_actually_changed_016` | revised | heading | The support content earned attention. | El contenido de apoyo ganó atención. | REVISED since ES pack. Prior EN: Defined system · Prior ES (do not reuse blindly): Sistema definido |
| `10_what_actually_changed_017` | revised | body | Protocol visitors showed strong scroll depth, sustained attention on Desbordes, movement into the portal, and active use of the bilingual experience. | Los visitantes de los protocolos mostraron una fuerte profundidad de scroll, atención sostenida en Desbordes, movimiento hacia el portal y uso activo de la experiencia bilingüe. | REVISED since ES pack. Prior EN: Rhythm, governance, measurement, and production now connect signals to shipped support. · Prior ES (do not reuse blindly): Ritmo, gobernanza, medición y producción ahora conectan las señales con el apoyo publicado. |
| `10_what_actually_changed_018` | revised | label | What remains unproven | Lo que aún no está probado | REVISED since ES pack. Prior EN: VOICE · Prior ES (do not reuse blindly): VOZ |
| `10_what_actually_changed_019` | revised | heading | Distribution has not caught up. | La distribución todavía no llegó. | REVISED since ES pack. Prior EN: Individual expression · Prior ES (do not reuse blindly): Expresión individual |
| `10_what_actually_changed_020` | revised | body | Of 223 visitors, 208 arrived through Direct/None. Instagram contributed 9 visitors, while Google and Bing contributed 2 combined. Early traffic remained concentrated within an existing network. | De 223 visitantes, 208 llegaron por Directo/Ninguno. Instagram aportó 9 visitantes, mientras que Google y Bing aportaron 2 en conjunto. El tráfico temprano se mantuvo concentrado dentro de una red existente. | REVISED since ES pack. Prior EN: Structured, governed brand voice · Prior ES (do not reuse blindly): Voz de marca estructurada y gobernada |
| `10_what_actually_changed_021` | revised | body | The early evidence validated the support experience, not yet its distribution. | La evidencia temprana validó la experiencia de apoyo, no todavía su distribución. | REVISED since ES pack. Prior EN: KNOWLEDGE · Prior ES (do not reuse blindly): CONOCIMIENTO |
| `10_what_actually_changed_022` | revised | label | System transform | Transformación del sistema | REVISED since ES pack. Prior EN: Dispersed expertise · Prior ES (do not reuse blindly): Experiencia dispersa |
| `10_what_actually_changed_023` | revised | heading | From existing value to operating system | Del valor existente al sistema operativo | REVISED since ES pack. Prior EN: Navigable support and editorial architecture · Prior ES (do not reuse blindly): Arquitectura de apoyo y contenido editorial navegable |
| `10_what_actually_changed_025` | revised | list | Trust | Confianza | REVISED since ES pack. Prior EN: Instagram-dependent presence · Prior ES (do not reuse blindly): Presencia dependiente de Instagram |
| `10_what_actually_changed_028` | revised | list | Workshops and explanations | Talleres y explicaciones | REVISED since ES pack. Prior EN: Individual publishing · Prior ES (do not reuse blindly): Publicación individual |
| `10_what_actually_changed_029` | revised | list | Instagram presence | Presencia en Instagram | REVISED since ES pack. Prior EN: Recurring operating and measurement rhythm · Prior ES (do not reuse blindly): Ritmo recurrente de operación y medición |
| `10_what_actually_changed_030` | revised | body | Formation | Formación | REVISED since ES pack. Prior EN: BUSINESS · Prior ES (do not reuse blindly): NEGOCIO |
| `10_what_actually_changed_037` | revised | body | What now exists | Lo que existe ahora | REVISED since ES pack. Prior EN: WHAT CHANGED · Prior ES (do not reuse blindly): LO QUE CAMBIÓ |
| `10_what_actually_changed_038` | revised | list | Governed brand system Shipped | Sistema de marca gobernado Publicado | REVISED since ES pack. Prior EN: The practice can publish, learn, and make decisions through a defined system. · Prior ES (do not reuse blindly): La práctica puede publicar, aprender y tomar decisiones a través de un sistema definido. |
| `10_what_actually_changed_039` | revised | list | Four bilingual protocols Shipped | Cuatro protocolos bilingües Publicado | REVISED since ES pack. Prior EN: WHAT BECAME POSSIBLE · Prior ES (do not reuse blindly): LO QUE SE VOLVIÓ POSIBLE |
| `10_what_actually_changed_040` | revised | list | Editorial support surface Shipped | Superficie editorial de apoyo Publicado | REVISED since ES pack. Prior EN: Owned bilingual support and a path from immediate relief toward continued care. · Prior ES (do not reuse blindly): Apoyo bilingüe propio y un camino del alivio inmediato hacia el cuidado continuo. |
| `10_what_actually_changed_041` | revised | list | Owned bilingual platform Shipped | Plataforma bilingüe propia Publicado | REVISED since ES pack. Prior EN: WHAT REMAINS · Prior ES (do not reuse blindly): LO QUE FALTA |
| `10_what_actually_changed_042` | revised | list | Measurement instrumentation Defined | Instrumentación de medición Definido | REVISED since ES pack. Prior EN: Adoption, retention, pricing, and commercial validation. · Prior ES (do not reuse blindly): Adopción, retención, precio y validación comercial. |
| `10_what_actually_changed_043` | revised | list | Operating rhythm and governance Operating | Ritmo operativo y gobernanza Operando | REVISED since ES pack. Prior EN: Nari’s trust now has infrastructure. · Prior ES (do not reuse blindly): La confianza de Nari ahora tiene infraestructura. |
| `10_what_actually_changed_044` | revised | list | Product and membership architecture Architected | Arquitectura de producto y membresía Arquitectado | REVISED since ES pack. Prior EN: WORKING EDIT · Private duplicate · Not linked from Studio navigation · Direct URL only · Prior ES (do not reuse blindly): EDICIÓN DE TRABAJO · Duplicado privado · No enlazado desde la navegación del Estudio · Solo por URL directa |
| `10_what_actually_changed_aria_057` | new | aria | What the experience validated and what remains unproven | Lo que la experiencia validó y lo que aún no está probado | Screen-reader label |
| `10_what_actually_changed_aria_058` | new | aria | Formation | Formación | Screen-reader label |

---

## Retire list (informational)

These 32 EN strings left the live page (28 of them are IDs now reused above with new content; 4 are pure removals with no replacement). No translation action needed — do not translate further. See `csc-edit-retire-orphans.csv`.

- **04 · VISUAL SUPPORT INFRASTRUCTURE** — 8 retired
- **10 · WHAT ACTUALLY CHANGED** — 24 retired

Pure removals (no reused ID, safe to delete outright from any prior ES reference material):
- `04_visual_support_infrastruc_alt_052` — Sleep doodle crop
- `10_what_actually_changed_026` — Owned bilingual support experience
- `10_what_actually_changed_031` — Audience without a product pathway
- `10_what_actually_changed_032` — Defined support and membership architecture

## Open questions

1. `10_what_actually_changed_020` / `06_from_protocol_to_product__033` — "Direct/None" rendered as **Directo/Ninguno**. Confirm this matches how Plausible's UI is being referenced elsewhere, or if it should stay in English as a literal source-tool label.
2. Section 06/10 now carry real traffic numbers (91-day window, 223 visitors, etc.) — worth a quick fact-check pass against the live Plausible dashboard before this goes out, since these are now performance claims, not narrative color.
3. `10_what_actually_changed_019` ("Distribution has not caught up.") translated as **La distribución todavía no llegó.** — flag if you want a version closer to the literal "hasn't caught up" register.
