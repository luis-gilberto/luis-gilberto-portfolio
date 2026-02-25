# Strategic System Blueprint (V6.2)
## Current State User Journey & UI Architecture

**Role:** Principal Systems Architect  
**Objective:** Document the optimized user journey, routing logic, and UI architecture of the StrategyIQ™ Portal (V6.2). This serves as the master reference for future development and design alignment.

---

## 1. The 4-Stage Strategic Lifecycle

The portal orchestrates a high-performance journey from raw intake to certified deployment.

### Stage 1: Identity & Intake
- **Flow:** Login → Strategic Identity Hub (Dashboard).
- **Intent:** Establish the "Partner Identity". The system bridges the "Acme Identity" (Project context) with the individual user profile.
- **Key Artifacts:** [StrategyCard.tsx](file:///c:/Users/luisg/OneDrive/Documents/Luis Gilberto/creative-portal/src/components/strategy/StrategyCard.tsx) (Engagement Ledger).

### Stage 2: Strategic Calibration
- **Flow:** Dashboard → Strategic Configuration Modal (Charter).
- **Intent:** Define the "Business Mandate". Before discovery begins, the client/strategist must lock OKRs, Business Drivers (Market Capture, Margin Protection), and Performance Benchmarks (CAC/LTV).
- **Logic Gate:** [useProjectStatus.ts](file:///c:/Users/luisg/OneDrive/Documents/Luis Gilberto/creative-portal/src/hooks/useProjectStatus.ts) enforces `isCalibrated` before allowing Stage 3.

### Stage 3: Strategic Discovery
- **Flow:** Assessment Engine → Initial Intelligence Synthesis.
- **Intent:** Capture "Contextual Intelligence" across dimensions (GTM, Brand, Campaign, Creative). 
- **Implementation:** [AssessmentRunner.tsx](file:///c:/Users/luisg/OneDrive/Documents/Luis Gilberto/creative-portal/src/components/strategy/AssessmentRunner.tsx) executes the 20-question logic waterfall.

### Stage 4: Project Roadmap
- **Flow:** Grand Synthesis → Master Roadmap → Approve & Deploy.
- **Intent:** Final "Advisory Grade" output. Aggregates all discovery data into a multi-phase acceleration plan.
- **Key Artifacts:** [MasterRoadmapModal.tsx](file:///c:/Users/luisg/OneDrive/Documents/Luis Gilberto/creative-portal/src/components/strategy/MasterRoadmapModal.tsx) with "Seal of Authority" certification.

---

## 2. UI Logic Contract (Non-Negotiables)

These architectural rules are permanent fixtures of the V6.2 system.

### A. The Floating Comm Link
- **Constraint:** Moved from static sidebar to a persistent floating widget.
- **Rationale:** **Canvas De-obstruction**. Strategic workbenches (like the Editorial Review) require 100% horizontal real estate for document-level editing. The chat now sits in the "empty space" of the lower-right quadrant.
- **Implementation:** [FloatingCommLink.tsx](file:///c:/Users/luisg/OneDrive/Documents/Luis Gilberto/creative-portal/src/components/portal/comm-link/FloatingCommLink.tsx).

### B. TOC Navigation (Editorial Simplicity)
- **Constraint:** Use of text-based, persona-driven navigation labels.
- **Rationale:** Aligns with the **Artifact Mode** design system. We prioritize semantic meaning over abstract icons to maintain an "Executive Dashboard" feel.

### C. The Artifact Standard
- **Typography:** `Big Shoulders Display` for headers (Italic/Black), `Inter` for functional text.
- **Semantic Colors:** 
  - **Coral:** Discovery / Action Required / At Risk.
  - **Yellow:** Review / Manual Validation.
  - **Teal:** Published / Certified / Secure.
- **Watermarking:** The `SealOfAuthority` is applied to all "Certified" outputs at 5% opacity to signify physical-document fidelity.

---

## 3. UX Deltas (Wireframe v1.0 vs. Implementation)

| Feature | Wireframe v1.0 | V6.2 Implementation | Functional Upgrade |
| :--- | :--- | :--- | :--- |
| **Chat UI** | Static Sidebar | **Floating Comm Link** | Allows multi-tasking during editorial review without layout shifts. |
| **Calibration** | Optional Modal | **Hard Logic Gate** | System now prevents assessment finalization until `isCalibrated` is true. |
| **Review Layout** | Top/Bottom | **65/35 Side-by-Side** | Optimized for wide-screen "Editorial Review" with integrated formatting tools. |
| **Project Status** | Plain Text | **Status 1-4 Pill Grid** | Visualizes progression through the 4-Stage Lifecycle. |

---

## 4. Route Inventory & Persona Intent

| Route | Persona Intent | Primary Action |
| :--- | :--- | :--- |
| `/dashboard` | **The Hub** | Monitor engagement ledger & initialize calibration. |
| `/strategy-iq/[id]/[dim]` | **The Engine** | Execute strategic discovery assessments. |
| `/admin/mapping` | **Master Architect** | Visualize client ecosystem connections. |
| `/settings` | **Strategic Identity** | Manage system connection status (API/DB/Auth). |
| `/analytics` | **Intelligence Monitoring** | Review aggregate performance metrics. |
| `/vault` | **Artifact Storage** | Access certified strategic dossiers. |

---

**Master Status:** `V6.2 ACTIVE`  
**Last Updated:** 2026-02-24  
**Protocol:** StrategyIQ™ Secure Archive
