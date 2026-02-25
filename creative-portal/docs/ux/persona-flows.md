# LG / PORTAL Persona Logic & UX Flow Rulebook
**Role:** Principal UX Systems Architect  
**Objective:** Define the core User Flows and Persona Requirements to ensure the navigation logic is airtight.

---

## 1. Persona Logic Map

### The Partner Journey (Client / Lead)
*The Partner seeks strategic clarity and results. Their journey is focused on discovery and the "payoff" of the synthesis.*

1.  **Entry (Secure Gateway):** Login via the Secure Enterprise Gateway.
2.  **Dashboard (Status):** Immediate view of project health, active modules, and pending discovery items.
3.  **Strategic Configuration (Input):** Defining business drivers, primary goals, and success metrics (The Charter).
4.  **Assessment (Action):** Engaging with the StrategyIQ™ Engine through high-fidelity diagnostic questions.
5.  **Results (Payoff):** Consuming the Certified Strategic Brief, backed by the Seal of Authority.

### The Commander Journey (Admin / Consultant)
*The Commander seeks oversight and certification. Their journey is focused on project management and high-level synthesis.*

1.  **Entry (Mission Control):** Login via the Admin Portal.
2.  **Command Center (Metrics):** High-level overview of total clients, active projects, and system health.
3.  **Project View (Oversight):** The "War Room" interface for specific client projects, monitoring assessment progress in real-time.
4.  **Workbench (Certification):** Using the Strategy Workbench to review, refine, and certify AI-generated narratives.
5.  **Roadmap (Deployment):** Exporting the Strategic Dossier and locking the permanent record.

---

## 2. "Red-Line" Logic Rules

To prevent "Stuck States" and ensure every interaction has a purpose, the following rules are enforced:

### Rule: Every Page must have a Primary Intent and a Secondary Exit.
*   **Dead-End Audit:** No page shall exist without a clear path back to the previous context or a forward path to the next logical step.
*   **Primary Intent:** The main reason the user is on the page (e.g., "Complete Assessment").
*   **Secondary Exit:** A fail-safe path to return to safety (e.g., "← Back to Dashboard").

**Standard Implementations:**
| Page Type | Primary Intent | Secondary Exit |
| :--- | :--- | :--- |
| **GTM Results** | Read & Review Brief | `← Back to Strategy Hub` |
| **War Room** | Monitor Project Status | `← Back to Command Center` |
| **Settings** | Update System Connection | `← Back to Dashboard` |
| **Login** | Secure Access | *N/A (Entry Point)* |

---

## 3. Visual Hierarchy Wireframe (Artifact Mode)

### Settings / Profile Page Blueprint
*Following the "Artifact Mode" standards to ensure high-fidelity identity and clarity.*

#### A. Header: Strategic Identity Card
*   **Element:** Prominent Display of the User's Role (e.g., ARCHITECT or PARTNER).
*   **Identity:** `USER: [Name] // SCOPE: [Organization]`.
*   **Branding:** High-contrast typography using the `Big Shoulders` font, Coral/White color scheme.

#### B. Content: System Connection Details
*   **Element:** Authentication & Security status.
*   **Infrastructure:** Database connection health and API key status (Admin only).
*   **Preferences:** Theme toggles (though many headers are "Theme-Immune" Dark Frame).

#### C. Footer: Legal/IP Notice
*   **Element:** Mandatory NDA and Proprietary Data warning.
*   **Branding:** `StrategyIQ™ v5.7 Protocol`.
*   **Note:** "Access is monitored and subject to strict NDA terms."

---

## 4. Success Checklist for Future UI
- [ ] Clicking "View Results" on an unfinished assessment takes you back to questions.
- [ ] The loading screen is only visible during the 5-10 second window of AI generation.
- [ ] The UI layout is clean, centered, and follows the "Artifact Mode" standards.
- [ ] No page exists without a Standard Breadcrumb at the top left.
