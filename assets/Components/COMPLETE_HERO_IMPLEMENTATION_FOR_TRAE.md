# Complete Hero Section Implementation Guide for Trae

**Date**: November 13, 2025  
**Project**: Insights Landing Page - Hero Section Refinement  
**Objective**: Transform current hero section into editorial-grade experience  
**Estimated Time**: 45-60 minutes  
**Test Environment**: Create copy of index page first

---

## BEFORE YOU START

### Step 0: Create Test Environment

**Create a copy of the Insights index page for testing:**

1. Navigate to your Insights directory
2. Duplicate `index.html` → `index-test.html`
3. Work on `index-test.html` for all changes below
4. Once Luis approves, copy changes back to `index.html`

```bash
# Command to create test copy
cp index.html index-test.html
```

---

## VISUAL REFERENCE - WHAT WE'RE BUILDING

### Light Mode (Default)
![Light Mode Hero](https://www.genspark.ai/api/files/s/vZ7C6Eld?cache_control=3600)

**Key Elements:**
- Cream/beige background (#F5F3EF)
- Small "FROM THE TRENCHES" label with coral underline
- Large serif "Insights" with coral thread weaving through
- Coral accent lines flanking the logo
- Centered Georgia serif description
- Rounded badge "• Published Monthly"
- Spacious, editorial layout

---

### Dark Mode
![Dark Mode Hero](https://www.genspark.ai/api/files/s/sUEhiH6I?cache_control=3600)

**Key Elements:**
- Navy background (#0F1B3D)
- Cream text (inverted from light mode)
- Coral thread with subtle glow
- Same hierarchy and spacing
- Coral elements more luminous

---

### Breathing Pulse Animation Detail
![Animation States](https://www.genspark.ai/api/files/s/zyBuZBLc?cache_control=3600)

**Animation Cycle:**
- STATE 1: Coral thread at normal width (2.5px)
- STATE 2: Thread gently expands (3px) with subtle glow
- STATE 3: Returns to normal
- 4-second gentle cycle (like breathing)
- Starts after main animation completes

---

### Mobile Responsive View
![Mobile View](https://www.genspark.ai/api/files/s/mYh9t2op?cache_control=3600)

**Mobile Adaptations:**
- All content stacks vertically
- Accent lines hidden (too cramped)
- Smaller but readable text sizes
- Adequate touch targets for badge
- Maintains elegance at small sizes

---

## HIERARCHY CLARIFICATION

**CRITICAL - Get this right:**

```
┌─────────────────────────────────────────┐
│   FROM THE TRENCHES  ← Secondary Label  │
│   (small, supportive)                   │
│                                         │
│        [Insights Animation]             │
│      ← PRIMARY HERO                     │
│   (large serif logo with thread)        │
│                                         │
│   Description text...                   │
│   ← Subheading                          │
│                                         │
│   • Published Monthly                   │
│   ← Badge                               │
└─────────────────────────────────────────┘
```

**NOT THIS:**
- ❌ "FROM THE TRENCHES" as main title
- ❌ "INSIGHTS" in Big Shoulders Display above animation
- ❌ Left-aligned text

**YES THIS:**
- ✅ "Insights" animated logo as primary hero
- ✅ "FROM THE TRENCHES" as supportive editorial label
- ✅ Everything centered

---

## PART 1: HTML STRUCTURE CHANGES

### Current Structure (What You Have Now)

```html
<section class="hero-section">
    <div class="container">
        <span class="editorial-label">From The Trenches</span>
        <h1>INSIGHTS</h1>  <!-- REMOVE THIS -->
        <!-- Your 5-frame animation here -->
        <p class="hero-subtitle">This is where I share what I'm learning...</p>
        <span class="publish-cadence">Published monthly</span>
    </div>
</section>
```

### New Structure (What You Need)

```html
<section class="hero-section">
    <div class="container">
        <!-- Secondary editorial label - stays at top -->
        <span class="editorial-label">From The Trenches</span>
        
        <!-- PRIMARY HERO: Wrap your existing animation -->
        <div class="insights-animation-container">
            
            <!-- YOUR EXISTING 5-FRAME ANIMATION GOES HERE -->
            <!-- Keep whatever animation code you currently have -->
            <!-- Just wrap it inside this container -->
            
            <!-- Example: If you're using SVG -->
            <svg class="insights-logo-svg" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
                <!-- Frame 05 final static state -->
                <text x="50%" y="50%" 
                      text-anchor="middle" 
                      dominant-baseline="middle" 
                      class="insights-text"
                      font-family="Crimson Text, Georgia, serif"
                      font-size="120"
                      fill="#0F1B3D">Insights</text>
                
                <!-- Coral thread with breathing pulse -->
                <path class="coral-thread" 
                      d="M 100,200 Q 400,180 700,200" 
                      stroke="#F96F6E" 
                      stroke-width="2.5" 
                      stroke-linecap="round"
                      fill="none"/>
            </svg>
            
            <!-- Or if you're using Canvas/JavaScript, keep your code here -->
            <!-- Or if you're using Lottie, keep your code here -->
            
        </div>
        
        <!-- Centered serif description -->
        <p class="hero-subtitle">
            This is where I share what I'm learning: from brand strategy 
            and AI-powered launches to the messy, human side of creative 
            leadership. New posts monthly.
        </p>
        
        <!-- Badge-style cadence -->
        <span class="publish-cadence">Published Monthly</span>
    </div>
</section>
```

### Important Notes About Animation

**Your 5-Frame Animation Sequence:**
- Frame 01: Thread appears
- Frame 02: Thread interweaves through 's', 'g', 't'
- Frame 03: Color transitions
- Frame 04: Sticker merges
- Frame 05: Final static state ← This is where CSS breathing pulse begins

**Animation Requirements:**
1. Must play ONCE on page load (not infinite loop)
2. Must end on Frame 05 (the static logo state)
3. Should take ~2-3 seconds total
4. After completion, CSS breathing pulse activates automatically

**If you need help integrating your specific animation format (Canvas/Lottie/SVG), ask Luis to share your current animation code.**

---

## PART 2: ADD GOOGLE FONT (CRITICAL)

Add this to the `<head>` section of your HTML, **before** your existing styles:

```html
<!-- Add elegant serif font for "Insights" logo and description -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600&display=swap" rel="stylesheet">
```

**Why Crimson Text:**
- Elegant editorial aesthetic
- Perfect for large display text
- Works beautifully with coral thread interweaving
- Free and loads fast

---

## PART 3: CSS CHANGES

### Step 1: Update CSS Variables

**FIND** your `:root` CSS variables section (should be near top of stylesheet)

**UPDATE** these specific variables:

```css
:root {
    /* Light Mode Colors - DEFAULT */
    --bg-primary: #F5F3EF;        /* Cream/beige background */
    --bg-secondary: #FFFFFF;
    --text-primary: #0F1B3D;       /* Navy blue */
    --text-secondary: #4A5568;     /* Muted gray */
    --coral-accent: #F96F6E;       /* Coral */
    --shadow-light: rgba(15, 27, 61, 0.1);
    
    /* Fonts */
    --font-serif: 'Crimson Text', Georgia, serif;
    --font-display: 'Big Shoulders Display', cursive;
    --font-base: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Dark Mode Override */
[data-theme="dark"] {
    --bg-primary: #0F1B3D;         /* Navy background */
    --bg-secondary: #1a2744;
    --text-primary: #F5F3EF;       /* Cream text */
    --text-secondary: rgba(245, 243, 239, 0.8);
    --shadow-light: rgba(249, 111, 110, 0.2);
}
```

---

### Step 2: Replace Hero Section CSS

**FIND** your `.hero-section` CSS block (starts around line 300-400)

**DELETE** everything from `.hero-section {` through the end of hero-related styles, INCLUDING:
- `.hero-section`
- `.editorial-label`
- `.hero-section h1` (this is being removed anyway)
- `.hero-subtitle`
- `.publish-cadence`
- Any media queries related to these

**REPLACE WITH** this complete new CSS:

```css
/* ============================================
   HERO SECTION - REFINED EDITORIAL
   ============================================ */

.hero-section {
    position: relative;
    text-align: center; /* Changed from left */
    padding: 10rem 0 6rem 0; /* Increased padding */
    background: var(--bg-primary);
    border-bottom: 2px solid var(--text-primary);
    overflow: visible;
    isolation: isolate;
}

/* Subtle coral glow behind content */
.hero-section::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 700px;
    height: 500px;
    background: radial-gradient(
        ellipse at center,
        rgba(249, 111, 110, 0.03) 0%,
        transparent 70%
    );
    z-index: 0;
    pointer-events: none;
}

/* Stronger glow in dark mode */
[data-theme="dark"] .hero-section::before {
    background: radial-gradient(
        ellipse at center,
        rgba(249, 111, 110, 0.08) 0%,
        transparent 70%
    );
}

/* ============================================
   SECONDARY LABEL: "From The Trenches"
   ============================================ */

.editorial-label {
    display: inline-block;
    font-family: var(--font-base);
    font-size: 0.6875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.3em; /* Increased */
    color: var(--text-secondary);
    margin-bottom: 3rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--coral-accent);
    position: relative;
    z-index: 2;
    
    /* Fade-in animation */
    opacity: 0;
    animation: fadeInDown 0.6s ease forwards;
    animation-delay: 0.2s;
}

/* Subtle glow in dark mode */
[data-theme="dark"] .editorial-label {
    text-shadow: 0 2px 12px rgba(249, 111, 110, 0.3);
}

/* ============================================
   PRIMARY HERO: "Insights" Animated Logo
   ============================================ */

/* REMOVE old h1 - animation is the hero */
.hero-section h1 {
    display: none !important;
}

/* Animation container */
.insights-animation-container {
    position: relative;
    margin: 0 auto 4rem;
    max-width: 900px;
    z-index: 2;
    
    /* Container fade-in */
    opacity: 0;
    animation: fadeInScale 1s ease forwards;
    animation-delay: 0.6s;
}

/* Coral accent lines - LEFT */
.insights-animation-container::before {
    content: '';
    position: absolute;
    top: 50%;
    left: -130px;
    width: 100px;
    height: 2px;
    background: var(--coral-accent);
    opacity: 0;
    transform: translateX(-20px);
    animation: slideInLeft 0.8s ease forwards;
    animation-delay: 2.5s; /* After animation completes */
}

/* Coral accent lines - RIGHT */
.insights-animation-container::after {
    content: '';
    position: absolute;
    top: 50%;
    right: -130px;
    width: 100px;
    height: 2px;
    background: var(--coral-accent);
    opacity: 0;
    transform: translateX(20px);
    animation: slideInRight 0.8s ease forwards;
    animation-delay: 2.5s; /* After animation completes */
}

/* Logo SVG styling */
.insights-logo-svg {
    width: 100%;
    max-width: 800px;
    height: auto;
    display: block;
    margin: 0 auto;
}

/* Insights text */
.insights-text {
    font-family: var(--font-serif);
    font-size: 120px;
    font-weight: 400;
    fill: var(--text-primary);
    letter-spacing: -0.02em;
}

/* Coral thread with breathing pulse */
.coral-thread {
    stroke: var(--coral-accent);
    stroke-width: 2.5;
    stroke-linecap: round;
    fill: none;
    
    /* Breathing pulse - starts after animation */
    animation: threadBreathing 4s ease-in-out infinite;
    animation-delay: 3s;
    transform-origin: center;
}

/* Breathing pulse keyframes */
@keyframes threadBreathing {
    0%, 100% {
        stroke-width: 2.5;
        opacity: 1;
    }
    50% {
        stroke-width: 3; /* Gentle expansion */
        opacity: 0.85;
    }
}

/* Dark mode glow pulse */
[data-theme="dark"] .coral-thread {
    filter: drop-shadow(0 0 6px rgba(249, 111, 110, 0.4));
    animation: threadBreathingDark 4s ease-in-out infinite;
    animation-delay: 3s;
}

@keyframes threadBreathingDark {
    0%, 100% {
        stroke-width: 2.5;
        opacity: 1;
        filter: drop-shadow(0 0 6px rgba(249, 111, 110, 0.4));
    }
    50% {
        stroke-width: 3;
        opacity: 0.9;
        filter: drop-shadow(0 0 10px rgba(249, 111, 110, 0.6));
    }
}

/* ============================================
   DESCRIPTION (SUBHEADING)
   ============================================ */

.hero-subtitle {
    font-family: var(--font-serif); /* Serif */
    font-size: clamp(1.3rem, 3vw, 1.5rem);
    line-height: 1.8;
    font-weight: 400;
    color: var(--text-secondary);
    opacity: 0.9;
    max-width: 720px;
    margin: 0 auto 3rem;
    text-align: center; /* Centered */
    position: relative;
    z-index: 2;
    
    /* Fade-in animation */
    opacity: 0;
    animation: fadeInUp 0.8s ease forwards;
    animation-delay: 3s;
}

/* ============================================
   BADGE: "Published Monthly"
   ============================================ */

.publish-cadence {
    display: inline-block; /* Changed from block */
    font-family: var(--font-base);
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-secondary);
    padding: 0.6rem 1.8rem; /* Added padding */
    border: 1px solid rgba(249, 111, 110, 0.3); /* Added border */
    border-radius: 25px; /* Pill shape */
    margin: 0 auto;
    text-align: center;
    position: relative;
    z-index: 2;
    font-style: normal; /* Remove italic */
    background: transparent;
    transition: all 0.3s ease;
    
    /* Fade-in animation */
    opacity: 0;
    animation: fadeIn 0.6s ease forwards;
    animation-delay: 3.6s;
}

/* Coral dot prefix */
.publish-cadence::before {
    content: '•';
    color: var(--coral-accent);
    margin-right: 0.5rem;
    font-size: 1.2em;
    vertical-align: middle;
}

/* Badge hover effect */
.publish-cadence:hover {
    border-color: var(--coral-accent);
    background: rgba(249, 111, 110, 0.05);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(249, 111, 110, 0.2);
    cursor: pointer;
}

[data-theme="dark"] .publish-cadence:hover {
    background: rgba(249, 111, 110, 0.1);
    box-shadow: 0 4px 12px rgba(249, 111, 110, 0.3);
}

/* ============================================
   ENTRANCE ANIMATIONS
   ============================================ */

@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInScale {
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 0.9;
        transform: translateY(0);
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes slideInLeft {
    to {
        opacity: 0.4;
        transform: translateX(0);
    }
}

@keyframes slideInRight {
    to {
        opacity: 0.4;
        transform: translateX(0);
    }
}

/* ============================================
   RESPONSIVE BREAKPOINTS
   ============================================ */

@media (max-width: 1024px) {
    /* Hide accent lines on smaller screens */
    .insights-animation-container::before,
    .insights-animation-container::after {
        display: none;
    }
}

@media (max-width: 968px) {
    .hero-section {
        padding: 8rem 0 4rem 0;
    }
    
    .editorial-label {
        margin-bottom: 2.5rem;
    }
    
    .insights-animation-container {
        margin-bottom: 3rem;
        max-width: 700px;
    }
    
    .insights-text {
        font-size: 90px;
    }
    
    .hero-subtitle {
        font-size: 1.3rem;
        max-width: 90%;
        padding: 0 1rem;
    }
}

@media (max-width: 768px) {
    .hero-section {
        padding: 6rem 0 3rem 0;
    }
    
    .editorial-label {
        font-size: 0.625rem;
        letter-spacing: 0.25em;
        margin-bottom: 2rem;
    }
    
    .insights-animation-container {
        margin-bottom: 2.5rem;
        max-width: 90%;
    }
    
    .insights-text {
        font-size: 70px;
    }
    
    .coral-thread {
        stroke-width: 2;
    }
    
    .hero-subtitle {
        font-size: 1.2rem;
        line-height: 1.7;
        margin-bottom: 2rem;
    }
    
    .publish-cadence {
        font-size: 0.85rem;
        padding: 0.55rem 1.5rem;
    }
}

@media (max-width: 480px) {
    .hero-section {
        padding: 5rem 0 2.5rem 0;
    }
    
    .editorial-label {
        font-size: 0.6rem;
        margin-bottom: 1.5rem;
    }
    
    .insights-animation-container {
        margin-bottom: 2rem;
    }
    
    .insights-text {
        font-size: 50px;
    }
    
    .coral-thread {
        stroke-width: 1.5;
    }
    
    .hero-subtitle {
        font-size: 1.15rem;
        line-height: 1.65;
        margin-bottom: 1.5rem;
        padding: 0 0.5rem;
    }
    
    .publish-cadence {
        font-size: 0.8rem;
        padding: 0.5rem 1.4rem;
    }
}

/* Reduced motion accessibility */
@media (prefers-reduced-motion: reduce) {
    .editorial-label,
    .insights-animation-container,
    .hero-subtitle,
    .publish-cadence {
        animation: none;
        opacity: 1;
        transform: none;
    }
    
    .insights-animation-container::before,
    .insights-animation-container::after {
        animation: none;
        opacity: 0.4;
        transform: translateX(0);
    }
    
    .coral-thread {
        animation: none;
    }
    
    .publish-cadence:hover {
        transform: translateY(-2px); /* Keep subtle hover */
    }
}
```

---

## PART 4: TESTING CHECKLIST

### Visual Inspection

**Desktop (1920px+):**
- [ ] "FROM THE TRENCHES" appears small at top with coral underline
- [ ] "Insights" logo large and centered in serif font
- [ ] Coral thread weaves through letters
- [ ] Thin coral accent lines visible on left/right
- [ ] Description centered in serif font
- [ ] "• Published Monthly" badge with coral border
- [ ] Generous spacing throughout
- [ ] Light mode: cream background, navy text
- [ ] Dark mode: navy background, cream text

**Tablet (768-1024px):**
- [ ] Accent lines hidden
- [ ] Logo scales appropriately
- [ ] Description remains readable
- [ ] Spacing adjusts gracefully

**Mobile (<768px):**
- [ ] All content stacks vertically
- [ ] Logo readable at smaller size
- [ ] Description font size comfortable
- [ ] Badge maintains tappability
- [ ] No horizontal scroll

### Animation Testing

- [ ] Page loads showing light mode by default
- [ ] Your 5-frame animation plays on load
- [ ] Animation plays ONCE (does not loop)
- [ ] Animation ends on Frame 05 static state
- [ ] After 3 seconds, breathing pulse begins on coral thread
- [ ] Pulse is subtle (gentle expansion/contraction)
- [ ] 4-second breathing cycle continues smoothly

### Entrance Sequence

Watch the orchestrated entrance (should take ~4 seconds total):

1. [ ] Label fades in from above (0.2s delay)
2. [ ] Animation container scales in (0.6s delay)
3. [ ] Your 5-frame animation plays (~2.5s)
4. [ ] Accent lines slide in from sides (2.5s delay)
5. [ ] Description fades up from below (3s delay)
6. [ ] Badge fades in (3.6s delay)
7. [ ] Breathing pulse activates (3s delay)

### Dark Mode Toggle

- [ ] Click theme toggle
- [ ] Background changes navy → cream swap works
- [ ] Text changes cream → navy swap works
- [ ] Coral elements get subtle glow
- [ ] All content remains readable
- [ ] Breathing pulse glow intensifies slightly

### Hover States

- [ ] Badge has hover effect (border/background/lift)
- [ ] No jarring movements
- [ ] Smooth transitions

### Browser Testing

- [ ] Chrome/Edge: All features work
- [ ] Firefox: Serif fonts load, animations smooth
- [ ] Safari: Filters render, no lag

---

## PART 5: TROUBLESHOOTING

### Issue: Accent Lines Don't Appear

**Cause**: Screen width may be too narrow

**Fix**: Check if viewport is > 1024px, or inspect element to see if `::before` and `::after` pseudo-elements exist

### Issue: Animation Loops Instead of Stopping

**Cause**: Your animation code may have `loop: true` setting

**Fix**: In your animation initialization, set:
- Canvas: `loop: false`
- Lottie: `loop: false`
- SVG: `fill="freeze"` on `<animate>` tags

### Issue: Breathing Pulse Doesn't Start

**Cause 1**: `.coral-thread` class not applied to your thread path
**Cause 2**: Animation delay too short, starts before main animation finishes

**Fix 1**: Ensure your thread SVG path has `class="coral-thread"`
**Fix 2**: Increase `animation-delay` to 3.5s or 4s

### Issue: Serif Font Not Loading

**Cause**: Google Fonts link not added or has typo

**Fix**: Verify `<link>` tag in `<head>`:
```html
<link href="https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600&display=swap" rel="stylesheet">
```

### Issue: Dark Mode Colors Wrong

**Cause**: CSS variables not updated correctly

**Fix**: Verify `[data-theme="dark"]` block has:
```css
--bg-primary: #0F1B3D;  /* Navy background */
--text-primary: #F5F3EF; /* Cream text */
```

### Issue: Description Still Left-Aligned

**Cause**: Old CSS not fully replaced

**Fix**: Ensure `.hero-subtitle` has:
```css
text-align: center;
margin: 0 auto 3rem;
```

---

## PART 6: ANIMATION INTEGRATION GUIDE

### If You're Using SVG Animation

Your SVG should end looking like this Frame 05 state:

```html
<svg class="insights-logo-svg" viewBox="0 0 800 400">
    <!-- Insights text -->
    <text x="400" y="200" 
          text-anchor="middle" 
          class="insights-text">Insights</text>
    
    <!-- Coral thread -->
    <path class="coral-thread" 
          d="M 100,200 Q 400,180 700,200" 
          stroke="#F96F6E" 
          stroke-width="2.5" 
          fill="none"/>
    
    <!-- Your animation sequence -->
    <animate ... dur="2.5s" fill="freeze" />
</svg>
```

Key: `fill="freeze"` keeps final state visible

### If You're Using Canvas/JavaScript

```javascript
// Your existing animation code
function playInsightsAnimation() {
    // ... animation logic ...
    
    // After animation completes:
    onAnimationComplete: function() {
        // CSS breathing pulse takes over automatically
        // No JavaScript needed - it's in CSS
    }
}
```

### If You're Using Lottie

```javascript
const animation = lottie.loadAnimation({
    container: document.querySelector('.insights-animation-container'),
    renderer: 'svg',
    loop: false, // CRITICAL: Play once
    autoplay: true,
    path: 'insights-animation.json'
});

// CSS breathing pulse activates automatically after completion
```

---

## FINAL DELIVERABLES CHECKLIST

Before telling Luis it's ready:

### Code Changes
- [ ] `index-test.html` has new HTML structure
- [ ] Google Fonts link added to `<head>`
- [ ] CSS variables updated (light/dark mode)
- [ ] Hero section CSS completely replaced
- [ ] Animation wrapped in container
- [ ] `.coral-thread` class applied for breathing pulse

### Visual Verification
- [ ] Light mode looks like mockup
- [ ] Dark mode looks like mockup
- [ ] Mobile looks like mobile mockup
- [ ] Spacing feels premium and spacious
- [ ] Serif typography loads correctly

### Animation Behavior
- [ ] Plays once on page load
- [ ] Ends on Frame 05
- [ ] Breathing pulse starts after completion
- [ ] Pulse is subtle, not distracting

### Functionality
- [ ] Theme toggle works (light/dark)
- [ ] Badge hover effect works
- [ ] Responsive at all breakpoints
- [ ] No console errors
- [ ] No horizontal scroll on any device

---

## CONTACT LUIS IF...

- Your animation uses a format not covered (custom Canvas, WebGL, etc.)
- You need help matching Frame 05 static state
- Breathing pulse timing feels off
- Colors don't match mockups
- Any console errors appear
- Layout breaks at specific viewport size

**Don't guess - ask! Luis wants this perfect.**

---

## ESTIMATED TIME BREAKDOWN

- Google Fonts setup: 2 min
- HTML structure changes: 10 min
- CSS variable updates: 5 min
- CSS hero section replacement: 15 min
- Animation integration: 10 min
- Testing (all devices): 15 min
- Bug fixes/adjustments: 10 min

**Total: 45-60 minutes**

---

**Good luck, Trae! This is going to look incredible.**

---

**End of Implementation Guide**
