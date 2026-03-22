# Luis Gilberto Ecosystem — Trae Governance Rules
# Version 1.0 | March 20, 2026
# -----------------------------------------------
# PURPOSE:
# These rules enforce channel separation, prevent
# architecture leaks, and maintain system stability.
# ALL code edits must comply with these rules.
# When in doubt: do less, confirm first.
# -----------------------------------------------

---

## 1. BEFORE ANY EDIT

Before touching any file, answer these three questions:

1. Which channel does this file belong to?
   - /portal/           → Portal channel
   - /TheHub/           → Hub channel
   - /insights/         → Insights channel
   - /assets/js/        → Shared infrastructure
   - everything else    → Portfolio / root

2. Does the requested change violate any rule in this file?
   - If YES → stop, flag the violation, ask for clarification
   - If NO  → proceed

3. Is the change surgical (exact find/replace) or structural (new sections, new logic)?
   - Surgical → proceed with exact match only
   - Structural → confirm scope before executing

---

## 2. NAV COMPONENT RULES

TARGET FILE: assets/js/nav-component.js

### ALLOWED
- Header rendering
- Mobile drawer rendering
- Theme state (localStorage key: lg-theme — hyphen, not underscore)
- Logo asset swapping based on channel
- Active state detection via path.includes()

### FORBIDDEN — reject any change that introduces these
- Footer injection of any kind
- Content copy or product names
- StrategyIQ references
- Ecosystem messaging or architecture descriptions
- Persona switching logic
- Modal injection
- Any conditional that changes what content is shown per channel

### VIOLATION RESPONSE
If a requested edit to nav-component.js includes any FORBIDDEN item:
→ STOP. Do not make the change.
→ Report: "This change violates nav scope governance. nav-component.js is infrastructure only."

---

## 3. PORTAL CHANNEL RULES

TARGET FILES: Any file with path containing /portal/
INCLUDES: portal/index.html, portal/recruiters/index.html, portal/partners/index.html

### FORBIDDEN — never appear on Portal pages
- "StrategyIQ" (any form, any capitalization)
- "The Hub" used as an explanatory or upstream reference
- Ecosystem architecture descriptions
- References to Advisory, Studio as system components
- Dependency language ("where X becomes Y", "bridge between", "turn signal into")
- Audience badge or persona switcher
- Megamenu or dropdown nav
- nav-component.js (Portal pages use portal-nav.js only)

### ALLOWED
- Product language: outcomes, workflows, execution
- Portal logo lockup (image asset, not text recreation)
- Links to /portal/, /portal/recruiters/, /portal/partners/
- "The Hub" as a quiet secondary ecosystem link (mobile drawer only)
- "About Luis" as a quiet secondary link (mobile drawer only)

### CTA LANGUAGE — Portal pages
FORBIDDEN:
- "Learn more"
- "Explore the Portal"
- "Visit the Portal"
- "Click here"

REQUIRED PATTERN — CTA must imply structure, system, intentionality:
- "Enter the system"
- "See how this operates"
- "This is where strategy runs"
- "Start a Conversation"

---

## 4. HUB CHANNEL RULES

TARGET FILES: Any file with path containing /TheHub/

### ALLOWED
- StrategyIQ naming (Hub is the only public channel that can name it)
- Full ecosystem explanation
- System relationships between components
- Advisory, Studio, Portal references
- Hub megamenu with all three arms listed

### FORBIDDEN
- Dependency language on Advisory page (Advisory must read as standalone)
- StrategyIQ in footer column (remove if found)
- "Four arms. One system." — correct version is "Three arms. One system."

### nav-component.js on Hub pages
- data-active must be set to "hub"
- data-base must be set to "../../" for subpages, "../" for top-level Hub

---

## 5. INSIGHTS CHANNEL RULES

TARGET FILES: Any file with path containing /insights/

### DEFAULT (applies to all Insights articles)
- No StrategyIQ references in megamenu, footer, or article body
- No ecosystem architecture descriptions
- Hub megamenu panel header: "Three arms. One system." (not Four)
- Footer tagline: "Making sense of design, technology, and the choices behind them."
- Footer copy: "Crafted with intention. Grounded in real practice."
- No em dashes anywhere

### EXCEPTION
- Articles in the Building Series may reference StrategyIQ when the article
  is specifically about building the ecosystem

### INSIGHTS NAV — bespoke nav baked into each article HTML
- Each file has its own nav, NOT a shared nav-component.js
- Portal panel must NOT include "Strategy tools & StrategyIQ engine"
- Hub panel must NOT include StrategyIQ panel item

---

## 6. PORTFOLIO / ROOT RULES

TARGET FILES: Any file at root level or under /timeline/, /about/, /myexperience/

### FORBIDDEN
- StrategyIQ (not until trademark secured and public launch planned)
- Ecosystem architecture explanation
- System relationship descriptions

### ALLOWED
- Links to The Hub (as navigation)
- Links to The Portal (as destination, matched to audience)
- Brief mentions of Advisory or Studio without architecture explanation

---

## 7. SHARED INFRASTRUCTURE RULES

### localStorage theme key
CORRECT:   localStorage.getItem('lg-theme')    ← hyphen
INCORRECT: localStorage.getItem('lg_theme')    ← underscore

This is a recurring bug source. Check every file touched.

### Header heights
- Hub and Portfolio pages: --header-height: 80px
- Portal pages: --header-height: 72px
- Insights articles: --header-h: 64px

### Portal nav script
- Portal pages use: /assets/js/portal-nav.js
- Hub/Portfolio/Insights pages use: /assets/js/nav-component.js
- Never cross-reference these

### Brand tokens (never modify)
- --coral: #F96F6E
- --teal: #2ED3C6 (Hub/Portfolio) | #4BADA8 (Insights)
- --font-strategist: 'Big Shoulders Display'
- --font-storyteller: 'Playfair Display'
- --font-orchestrator: 'Inter'

---

## 8. CTA RULES (global)

### FORBIDDEN CTA LANGUAGE — anywhere in the ecosystem
- "Learn more"
- "Explore the Portal"
- "Click here"
- "Visit the Portal"
- "Find out more"

### REQUIRED CTA PATTERN
Every CTA should answer: what is the user about to enter or do?

APPROVED PATTERNS:
- "Enter the system →"
- "See how this operates →"
- "This is where strategy runs."
- "Start a Conversation"
- "Start the Conversation"
- "Book a 15-Minute Introduction"
- "Work with Luis"
- "Back to Insights"

---

## 9. FAILURE MODES — what breaks if rules are violated

| Rule Violated | Failure Mode |
|---|---|
| StrategyIQ on Portal pages | Product clarity collapses. Users must understand architecture before value. |
| nav-component.js makes content decisions | System instability. Any edit risks cascading regressions across all channels. |
| Advisory uses dependency language | Reads as a step in a system, not a standalone capability. Clients disengage. |
| Portfolio references ecosystem architecture | Positioning dilutes. Evidence becomes sales material. Audience trust weakens. |
| Portal and Hub share nav with conditionals | Fragility accumulates silently. Cross-channel regressions become untraceable. |
| Insights articles name StrategyIQ outside Building Series | Editorial voice becomes promotional. Reader trust in content quality erodes. |
| localStorage key uses underscore (lg_theme) | Theme state breaks. Pages load in wrong mode. Persistent bug across sessions. |

---

## 10. PRIORITY ORDER

When conflicts arise between rules, follow this order:

1. System stability (nav scope, no cross-contamination)
2. Channel separation (right content in right channel)
3. Messaging clarity (standalone pages, no dependency language)
4. Visual consistency (tokens, spacing, typography)

---

## 11. SURGICAL EDIT PROTOCOL

Every edit request must follow this pattern:

1. READ the target file first. Never edit blind.
2. IDENTIFY the exact string to change. No approximations.
3. CONFIRM the context (surrounding lines) before replacing.
4. EXECUTE the exact change. Nothing more.
5. VERIFY by searching for the changed string post-edit.
6. REPORT line numbers and confirmation that no other lines were touched.

**If Trae cannot find the exact string: STOP and report. Do not attempt a fuzzy match.**

---

## 12. WHAT TRAE SHOULD NEVER DO

- Batch edit multiple files without explicit per-file confirmation
- Rewrite sections when asked to make a surgical change
- Add new components or elements unless explicitly requested
- Change spacing, indentation, or formatting beyond the edit target
- Modify nav-component.js and portal-nav.js in the same operation
- Make changes to files not listed in the prompt
- Report success without verifying the actual file content
