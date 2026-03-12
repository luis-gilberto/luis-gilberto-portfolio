# Ecosystem Brand Book 2025

## 1. BRAND OVERVIEW

**1.1 Brand Story & Mission**  
Luis Gilberto's ecosystem unites Portfolio, Hub, and Insights, blending Venezuelan warmth with Cascadian minimalism. Originating from global perspectives (Caracas to Seattle), it orchestrates creativity and structure for measurable impact.  
**Mission:** Bridge creative vision and business results through strategic design, data insights, and innovative experiences that resonate globally.  
**Vision:** Transform artistic ideas into ROI-driven outcomes, fostering authentic connections in a structured world.

**1.2 Core Values**  
- **Innovation:** Push creative boundaries with strategic focus (e.g., hybrid typography for emotional depth).  
- **Impact:** Deliver measurable results via design excellence.  
- **Authenticity:** Genuine storytelling that connects humanly and inclusively.  
- **Excellence:** Purposeful restraint in every detail, from icons to messaging.

**1.3 Brand Positioning**  
- **Target Audience:** Creative professionals, marketers, and businesses seeking strategic design for global campaigns.  
- **Unique Value Proposition:** Orchestrating emotion (narrative) and structure (systems) for authentic, results-focused branding.  
- **Brand Personality Traits:** Confident, strategic, authentic, innovative, culturally aware.

## 2. VISUAL IDENTITY

**2.1 Logo Usage**  
- **Primary Logo:** SVG logomark (AUg_logo_White.png for dark nav; white on black). Use full color in light themes.  
- **Variations:** Monochrome (white/black), reversed (dark on light), icon-only (Symbol_mobile.svg for mobile). Favicon: 32x32px SVG.  
- **Minimum Size:** Desktop: 120px width; Mobile: 80px width.  
- **Clear Space:** 1x logo height around all sides.  
- **Placement:** Fixed top-left in nav; centered in mobile drawer; footers as logomark.  
- **Incorrect Usage:** Stretched, recolored outside coral/teal, or without clear space.

**2.2 Color System**  
- **Primary Colors:** Coral hsl(0, 92%, 70%) (#F96F6E) for strategy/CTAs; Teal hsl(174, 78%, 59%) (#2ED3C6) for innovation.  
- **Secondary/Accent:** Gradient Coral → Teal for hybrid moments; Cloud Dancer hsl(45, 42%, 95%) (#F3EFE0) for warmth.  
- **Semantic Colors:** Success: Teal; Warning: hsl(16, 100%, 66%) (#FF6B35); Error: hsl(0, 92%, 70%) muted; Info: Cool Gray hsl(240, 5%, 72%) (#B2B2BB).  
- **Neutral/Grayscale:** Ink hsl(0, 0%, 100%) (#FFFFFF) dark text; Deep Blue hsl(210, 35%, 27%) (#2C3E50) backgrounds; Surface Dark hsl(0, 0%, 4%) (#0A0A0A).  
- **Backgrounds:** Dark mode: hsl(240, 3%, 6%) (#111); Light: hsl(0, 0%, 100%) (#FFF) with glass borders rgba(255,255,255,0.1).  
- **Hierarchy/Proportions:** 60% neutrals, 30% primary, 10% accents; Coral for emotional, Teal for structural.  
- **Accessibility:** WCAG AA compliant (4.5:1 min contrast); e.g., white text on dark bg (21:1).

**2.3 Typography**  
- **Primary Typeface:** Inter (sans-serif) via Google Fonts CDN: font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif.  
- **Secondary:** Playfair Display (serif) for narrative; Big Shoulders Display (sans-serif) for architect.  
- **Font Hierarchy (CSS):**  
  - H1: 112px, weight 800 (Playfair/Big Shoulders), line-height 1.1, letter-spacing 0.02em.  
  - H2: 64px, weight 800, line-height 1.2, uppercase for Big Shoulders.  
  - H3-H6: 32-24px, weight 700, line-height 1.3.  
  - Body: 14px (default), weight 400-500, line-height 1.8, max-width 65ch.  
  - UI/Captions: 12px Inter 500, line-height 1.5.  
- **Responsive Scale:** Mobile (<768px): H1 56px, body 16px; Tablet (768-1024px): H1 80px; Desktop (>1024px): Full scale.  
- **Loading:** Preload Inter/Playfair; Fallbacks: sans-serif/serif.

**2.4 Iconography**  
- **Style:** Outline SVG (stroke 2px, rounded caps); filled for status.  
- **Sizes:** 48px (UI primary), 24px (nav/actions), 80px (hero). ViewBox 0 0 24 24.  
- **Library:** Custom set (e.g., vision.svg); Colors: Coral/Teal only; Naming: snake_case. No emojis.  
- **Usage:** Navigation (theme toggle SVGs), actions (contact icons), indicators (success checkmarks in Teal).

**2.5 Imagery & Media**  
- **Photography Style:** High-contrast, dramatic lighting; authentic urban moments, diverse/inclusive humans emphasizing emotion.  
- **Aspect Ratios:** Hero: 16:9; Cards: 4:3; Mobile: 1:1.  
- **Formats:** WebP (compressed <100KB), fallback JPG/PNG; No staged poses.  
- **Video:** 16:9, no autoplay; Subtle transitions (200ms ease-in-out).  
- **Placeholders:** Skeleton loaders in Cloud Dancer; Empty states with Inter body text.

**2.6 Spacing & Grid System**  
- **Base Unit:** 4px (var(--space-xs)).  
- **Scale:** 4px, 8px (--md), 16px (--lg), 24px, 32px, 48px (--xl), 64px.  
- **Grid:** 12-column, max-width 1200px container; Gutters 24px.  
- **Breakpoints:** Mobile <768px (stacked), Tablet 768-1024px (2-col), Desktop >1024px (full grid).

## 3. UI COMPONENTS

**3.1 Navigation Components**  
- **Header/Navbar:** Fixed dark (#000) top bar; White logo left, Inter links right; Mobile hamburger toggle to overlay drawer.  
- **Menu Styles:** Primary: Horizontal Inter 500; Secondary: Subnav underlined on hover.  
- **Breadcrumbs:** Inter small, gray separators.  
- **Footer:** Grid with brand (Big Shoulders), links (Inter), social SVGs.

**3.2 Buttons & CTAs**  
- **Styles:** Primary: Coral bg, white text, 8px radius; Secondary: Teal outline; Tertiary: Text link underline.  
- **States:** Hover: Scale 1.05 (200ms); Active: Shadow inset; Disabled: Opacity 0.5; Loading: Spinner overlay.  
- **Sizes:** Small 32px height, Medium 40px, Large 48px; Icon buttons 40x40px.  
- **Groups/Links:** Flex row, 8px gap; Links: Coral underline on hover. Borders: 1px glass rgba.

**3.3 Form Elements**  
- **Inputs/Textareas:** Inter 400, 8px radius, border hsl(0,0%,80%); Focus: Teal glow.  
- **Selects:** Dropdown with Inter labels, arrow SVG.  
- **Checkboxes/Radios:** Custom SVG outlines, Teal fill on select.  
- **Toggles:** Theme switch with sun/moon SVGs, slide animation.  
- **Validation:** Error: Coral border/text; Success: Teal; Placeholders: Gray Inter italic.  
- **Labels/Helpers:** Inter bold above, small below; File upload: Dashed border card.

**3.4 Feedback Components**  
- **Alerts:** Cards with icon, Coral/Teal borders; Types: Success (Teal), Error (Coral).  
- **Toasts:** Top-right, 3000ms fade, Inter body.  
- **Modals:** Overlay drawer (mobile), 8px radius, esc/close X.  
- **Loaders:** Spinners (Teal SVG), progress bars, skeleton grids in Cloud Dancer.  
- **Tooltips:** Popover on hover/focus, Inter small.  
- **Empty States:** Centered Inter message + icon.

**3.5 Content Components**  
- **Cards:** 16px radius, elevated shadow; Header H3 Big Shoulders, content Inter lists.  
- **Tables:** Usage matrix style: Bordered, thead Coral bg rgba, Inter text.  
- **Lists:** Unordered Inter with bullets; Definition: Bold terms.  
- **Badges/Tags:** Coral/Teal pills, 4px radius.  
- **Avatars:** Circular PNG, 40-80px.  
- **Accordions/Tabs:** Inter headers, expandable content; Tabs underlined active.

## 4. INTERACTION & BEHAVIOR

**4.1 Interactive States**  
- **Hover:** 200ms ease-in-out scale/opacity; e.g., nav links underline in Coral.  
- **Focus:** Teal outline 2px for keyboard (Tab nav).  
- **Active:** Depress 1px, color shift (Coral to darker hsl(0,92%,60%)).  
- **Disabled:** Grayed hsl(0,0%,50%), no pointer.  
- **Loading:** Overlay spinner, cursor progress.

**4.2 Animations & Transitions**  
- **Timing:** 200-300ms duration for hovers/transitions.  
- **Easing:** ease-in-out; cubic-bezier(0.4, 0, 0.2, 1) for smooth.  
- **Micro-Interactions:** Button click ripple (Teal), menu slide (300ms).  
- **Page/Scroll:** Fade-in sections on load; Smooth scroll-behavior: smooth.  
- **Principles:** Use for feedback (e.g., form submit success); Avoid excess—restraint for clarity; No animations on reduced motion.
