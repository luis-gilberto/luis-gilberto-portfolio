# TRAE: Restore StrategyIQ Chess Piece & Complete Production Content

## CRITICAL ISSUE:
The floating chess piece background icon is MISSING. It was working before and needs to be restored immediately.

---

## STEP 1: RESTORE THE CHESS PIECE ICON

### Add this HTML in the hero section (BEFORE hero-content):

```html
<section class="hero-section">
    <div class="container">
        <!-- CHESS PIECE ICON - ADD THIS FIRST -->
        <div class="hero-icon-wrapper" aria-hidden="true">
            <img src="/assets/images/icons/strategyiq-icon-3d.png" 
                 alt="" 
                 class="hero-icon"
                 loading="eager" />
        </div>
        
        <!-- Hero Content (this already exists) -->
        <div class="hero-content">
            <!-- existing hero content -->
        </div>
    </div>
</section>
```

### Add this CSS for the chess piece:

```css
/* Chess Queen Icon - Fixed Position & Floating Animation */
.hero-icon-wrapper {
    position: fixed !important;
    right: 100px !important;
    top: 50% !important;
    margin-top: -300px !important;
    width: 600px !important;
    height: 600px !important;
    opacity: 0.08 !important;
    transform: none !important;
    z-index: 1 !important;
    pointer-events: none;
}

.hero-icon {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: brightness(1.1) saturate(1.0) drop-shadow(0 0 40px rgba(249, 111, 110, 0.25));
    mix-blend-mode: screen;
    animation: float-hero-icon 15s ease-in-out infinite;
}

@keyframes float-hero-icon {
    0%, 100% {
        transform: translateY(0px) rotate(0deg);
    }
    50% {
        transform: translateY(-15px) rotate(2deg);
    }
}

/* Hero Content Must Be Above Icon */
.hero-content {
    position: relative;
    z-index: 100 !important;
}

/* Responsive */
@media (max-width: 1024px) {
    .hero-icon-wrapper {
        right: 50px !important;
        width: 400px !important;
        height: 400px !important;
        opacity: 0.06 !important;
    }
}

@media (max-width: 767px) {
    .hero-icon-wrapper {
        display: none;
    }
}
```

---

## STEP 2: FIX THE HERO COPY

### Current (WRONG):
```
Meet StrategyIQ™
Not another buzzword-heavy platform. This is your strategic engine – built to read the market, decode the noise, and deliver insights you can act on.
```

### Correct (USE THIS):
```html
<section class="hero-section">
    <div class="container">
        <div class="hero-icon-wrapper" aria-hidden="true">
            <img src="/assets/images/icons/strategyiq-icon-3d.png" alt="" class="hero-icon" loading="eager" />
        </div>
        
        <div class="hero-content">
            <div class="hero-eyebrow">The Hub · Strategy</div>
            <h1 class="hero-title">Meet <span class="highlight">StrategyIQ™</span></h1>
            <p class="hero-subtitle">
                Not another buzzword-heavy platform. This is your strategic engine – 
                built to read the market, decode the noise, and deliver insights you can act on.
            </p>
            <div class="cta-row">
                <a href="#cta" class="cta-button">Activate StrategyIQ</a>
                <a href="/TheHub/system/" class="secondary-link">See how it fits in The Hub →</a>
            </div>
        </div>
    </div>
</section>
```

---

## STEP 3: FIX THE METRICS (CRITICAL)

### Current metrics are WRONG. Replace with:

```html
<section class="container">
    <div class="section-intro">
        <h2>Real Results, <span class="text-coral">Real Fast</span></h2>
    </div>
    
    <div class="intelligence-metrics">
        <div class="metric-card">
            <div class="metric-number">97%</div>
            <div class="metric-label">Accuracy</div>
            <div class="metric-description">Strategic calls that actually land.</div>
        </div>
        <div class="metric-card">
            <div class="metric-number">2.3×</div>
            <div class="metric-label">ROI</div>
            <div class="metric-description">Average uplift our clients see.</div>
        </div>
        <div class="metric-card">
            <div class="metric-number">48h</div>
            <div class="metric-label">Speed</div>
            <div class="metric-description">From data to direction in two days.</div>
        </div>
        <div class="metric-card">
            <div class="metric-number">500+</div>
            <div class="metric-label">Sources</div>
            <div class="metric-description">Live data, all working together.</div>
        </div>
    </div>
</section>
```

---

## STEP 4: FIX THE METHODOLOGY SECTION

### Replace with proper copy and SVG icons (NO Font Awesome):

```html
<section class="container">
    <div class="section-intro">
        <h2>How the Engine <span class="text-coral">Thinks</span></h2>
        <p>We did not slap "AI" on an old consulting model. We built a system that moves with you.</p>
    </div>
    
    <div class="methodology-grid">
        <div class="methodology-card">
            <svg class="card-icon coral" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2ED3C6" stroke-width="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            </svg>
            <h3 class="card-title">AI-Powered Analysis</h3>
            <div class="card-content">
                <p>Live signals, trend forecasts, competitive mapping, and risk sensing – all synced to your goals.</p>
            </div>
        </div>
        
        <div class="methodology-card">
            <svg class="card-icon teal" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2ED3C6" stroke-width="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
            <h3 class="card-title">Strategic Intelligence</h3>
            <div class="card-content">
                <p>Turning raw data into smart plays. Opportunity spotting, resource optimization, and clear roadmaps.</p>
            </div>
        </div>
        
        <div class="methodology-card">
            <svg class="card-icon coral" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2ED3C6" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="12" cy="12" r="6"/>
                <circle cx="12" cy="12" r="2"/>
            </svg>
            <h3 class="card-title">Ecosystem Mapping</h3>
            <div class="card-content">
                <p>See who matters, which partnerships propel you, and where your brand should stand to lead.</p>
            </div>
        </div>
        
        <div class="methodology-card">
            <svg class="card-icon teal" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2ED3C6" stroke-width="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            <h3 class="card-title">Implementation Engine</h3>
            <div class="card-content">
                <p>No "here is your deck, good luck." We plan, track, and adapt in real time, measuring what matters.</p>
            </div>
        </div>
    </div>
</section>
```

---

## STEP 5: FIX THE COMPARISON SECTION

### Add the VS circle and proper structure:

```html
<section class="container comparison-section">
    <div class="section-intro">
        <h2>Traditional vs <span class="text-coral">StrategyIQ™</span></h2>
        <p>See how our advanced methodology compares to conventional approaches</p>
    </div>
    
    <div class="comparison-wrapper">
        <div class="comparison-grid">
            <div class="comparison-column traditional">
                <span class="comparison-badge legacy">Legacy</span>
                <div class="comparison-header">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <h3 class="comparison-title">Traditional Consulting</h3>
                </div>
                <ul class="comparison-list">
                    <li>Weeks to months for analysis</li>
                    <li>Static reports and presentations</li>
                    <li>Limited data integration</li>
                    <li>Subjective recommendations</li>
                    <li>One-time engagement model</li>
                </ul>
            </div>

            <!-- VS CIRCLE - ADD THIS -->
            <div class="vs-circle">VS</div>

            <div class="comparison-column highlight">
                <span class="comparison-badge next-gen">Next-Gen</span>
                <div class="comparison-header">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#F96F6E" stroke-width="2">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                    </svg>
                    <h3 class="comparison-title">StrategyIQ™ Engine</h3>
                </div>
                <ul class="comparison-list">
                    <li>Real-time analysis and insights</li>
                    <li>Interactive dashboards and tools</li>
                    <li>500+ integrated data sources</li>
                    <li>AI-powered recommendations</li>
                    <li>Continuous optimization platform</li>
                </ul>
            </div>
        </div>
    </div>
</section>
```

### Add VS circle CSS:

```css
.comparison-wrapper {
    position: relative;
    margin-top: 50px;
}

.comparison-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 80px;
    align-items: center;
    position: relative;
}

.vs-circle {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: #0a0a0b;
    border: 3px solid var(--coral);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
    font-weight: 900;
    color: #fff;
    box-shadow: 0 0 60px rgba(249,111,110,.6),
                0 0 100px rgba(249,111,110,.3) inset;
    z-index: 10;
}

@media (max-width: 1024px) {
    .vs-circle {
        display: none;
    }
}
```

---

## STEP 6: FIX THE RESULTS SECTION

```html
<section class="container">
    <div class="section-intro">
        <h2>Proven. Tested. <span class="text-coral">Trusted.</span></h2>
    </div>
    
    <ul class="result-points">
        <li>
            <strong>Big players, big impact.</strong> 
            Over 50 Fortune 500 brands have plugged into this system and seen change.
        </li>
        <li>
            <strong>Deep roots.</strong> 
            15+ years of experience across enterprises, startups, and public organizations.
        </li>
        <li>
            <strong>Systematic success.</strong> 
            A blend of quantitative insight, qualitative context, and predictive modeling – 
            rolled into one repeatable strategy engine.
        </li>
    </ul>
</section>
```

---

## STEP 7: FIX THE CTA SECTION

```html
<section class="cta-banner">
    <div class="container">
        <h2>Ready to stop guessing and start <span class="text-coral">executing?</span></h2>
        <p>Let us plug you into StrategyIQ™ and kick your business into high gear.</p>
        <div class="cta-row" style="justify-content:center">
            <a href="/contact/" class="cta-button">Book a Session</a>
            <a href="/TheHub/system/" class="secondary-link">Learn how it fits in The Hub →</a>
        </div>
    </div>
</section>
```

---

## VERIFICATION CHECKLIST

After making these changes, verify:

✅ **Chess piece icon:**
- Large (600px) on desktop
- Floating gently on right side
- Subtle (opacity 0.08)
- Behind all content

✅ **Hero:**
- Eyebrow: "The Hub · Strategy"
- Title: "Meet StrategyIQ™" (with coral highlight)
- Subtitle: "Not another buzzword-heavy platform..."
- Two CTAs: "Activate StrategyIQ" and "See how it fits in The Hub →"

✅ **Metrics:**
- 97% Accuracy
- 2.3× ROI
- 48h Speed
- 500+ Sources

✅ **Methodology:**
- 4 cards with SVG icons (no Font Awesome)
- Teal stroke color on icons
- Proper copy for each pillar

✅ **Comparison:**
- VS circle visible between columns (desktop)
- Clock icon on left (gray)
- Bolt icon on right (coral)
- Proper copy in both columns

✅ **Results:**
- 3 points about Fortune 500, experience, systematic success

✅ **CTA:**
- "Ready to stop guessing and start executing?"
- Two buttons: "Book a Session" and "Learn how it fits in The Hub"

---

## IMPORTANT NOTES:

1. **DO NOT use Font Awesome icons** - use inline SVG only
2. **Chess piece MUST be position: fixed** (not absolute)
3. **Hero content MUST have z-index: 100** to appear above icon
4. **Icon path:** `/assets/images/icons/strategyiq-icon-3d.png`
5. **All copy must match EXACTLY** as specified above

---

## REFERENCE:
Use the file: `strategyiq_production_complete.html` as the master reference for all HTML/CSS/content.
