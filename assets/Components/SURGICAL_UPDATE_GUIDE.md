# STRATEGYIQ: Update Public Content While Preserving Admin Engine

## CRITICAL: DO NOT REPLACE THE ENTIRE FILE

The page has TWO modes that must BOTH work:
1. **Public Mode** - Marketing page (needs updating)
2. **Admin Mode** - Live engine with assessments (keep as-is)

## APPROACH: SURGICAL UPDATES ONLY

Only update the content inside `<div id="publicMode">` and leave everything else intact.

---

## STEP 1: LOCATE THE PUBLIC MODE SECTION

Find this in your HTML (around line 1908):
```html
<!-- Public Mode Content -->
<div id="publicMode" class="public-mode">
    <!-- ALL PUBLIC CONTENT IS HERE -->
</div>
```

This section ends around line 2193 (before `<div id="liveEngine">`).

---

## STEP 2: REPLACE ONLY THE PUBLIC MODE CONTENT

**DELETE everything between these two lines:**
```html
<div id="publicMode" class="public-mode">
    [DELETE ALL THIS OLD CONTENT]
</div>
```

**REPLACE with this NEW public content:**

```html
<div id="publicMode" class="public-mode">
    
    <!-- Hero Section with Chess Piece -->
    <section class="hero-section" style="position: relative; padding: 8rem 0 6rem; min-height: 100vh; display: flex; align-items: center;">
        <div class="container" style="position: relative; z-index: 10;">
            
            <!-- Floating Chess Piece Icon -->
            <div class="hero-icon-wrapper" aria-hidden="true" style="position: fixed !important; right: 100px !important; top: 50% !important; margin-top: -300px !important; width: 600px !important; height: 600px !important; opacity: 0.08 !important; z-index: 1 !important; pointer-events: none;">
                <img src="/assets/images/icons/strategyiq-icon-3d.png" 
                     alt="" 
                     class="hero-icon"
                     loading="eager"
                     style="width: 100%; height: 100%; object-fit: contain; filter: brightness(1.1) saturate(1.0) drop-shadow(0 0 40px rgba(249, 111, 110, 0.25)); mix-blend-mode: screen; animation: float-hero-icon 15s ease-in-out infinite;" />
            </div>
            
            <div class="hero-content" style="position: relative; z-index: 100; text-align: center; max-width: 900px; margin: 0 auto;">
                <div class="hero-eyebrow" style="color: var(--coral); font-size: 0.875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1rem;">
                    The Hub · Strategy
                </div>
                <h1 class="hero-title" style="font-family: 'Playfair Display', serif; font-size: clamp(2.5rem, 5vw, 4.5rem); font-weight: 700; margin-bottom: 1.5rem; line-height: 1.1;">
                    Meet <span style="color: var(--coral);">StrategyIQ™</span>
                </h1>
                <p class="hero-subtitle" style="font-size: clamp(1.125rem, 2vw, 1.375rem); color: var(--ink-dim); line-height: 1.6; margin-bottom: 2.5rem; max-width: 700px; margin-left: auto; margin-right: auto;">
                    Not another buzzword-heavy platform. This is your strategic engine – built to read the market, decode the noise, and deliver insights you can act on.
                </p>
                <div class="cta-row" style="display: flex; gap: 1.5rem; justify-content: center; flex-wrap: wrap;">
                    <a href="#cta" style="padding: 1rem 2.5rem; background: linear-gradient(135deg, var(--coral), var(--teal)); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; transition: all 0.3s ease;">
                        Activate StrategyIQ
                    </a>
                    <a href="/TheHub/system/" style="padding: 1rem 2.5rem; color: var(--coral); text-decoration: none; border: 2px solid var(--coral); border-radius: 8px; font-weight: 600; transition: all 0.3s ease;">
                        See how it fits in The Hub →
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- Metrics Section -->
    <section class="container" style="padding: 6rem 0;">
        <div class="section-intro" style="text-align: center; margin-bottom: 4rem;">
            <h2 style="font-family: 'Playfair Display', serif; font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; margin-bottom: 1rem;">
                Real Results, <span style="color: var(--coral);">Real Fast</span>
            </h2>
        </div>
        
        <div class="intelligence-metrics" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
            <div class="metric-card" style="text-align: center; padding: 2.5rem 2rem; background: var(--glass-bg); backdrop-filter: blur(10px); border: 1px solid var(--glass-border); border-radius: 1.5rem; transition: all 0.3s ease;">
                <div class="metric-number" style="font-size: 3.5rem; font-weight: 700; color: var(--coral); margin-bottom: 0.5rem; font-family: 'Playfair Display', serif;">97%</div>
                <div class="metric-label" style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem;">Accuracy</div>
                <div class="metric-description" style="color: var(--ink-muted); font-size: 0.875rem;">Strategic calls that actually land.</div>
            </div>
            <div class="metric-card" style="text-align: center; padding: 2.5rem 2rem; background: var(--glass-bg); backdrop-filter: blur(10px); border: 1px solid var(--glass-border); border-radius: 1.5rem; transition: all 0.3s ease;">
                <div class="metric-number" style="font-size: 3.5rem; font-weight: 700; color: var(--coral); margin-bottom: 0.5rem; font-family: 'Playfair Display', serif;">2.3×</div>
                <div class="metric-label" style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem;">ROI</div>
                <div class="metric-description" style="color: var(--ink-muted); font-size: 0.875rem;">Average uplift our clients see.</div>
            </div>
            <div class="metric-card" style="text-align: center; padding: 2.5rem 2rem; background: var(--glass-bg); backdrop-filter: blur(10px); border: 1px solid var(--glass-border); border-radius: 1.5rem; transition: all 0.3s ease;">
                <div class="metric-number" style="font-size: 3.5rem; font-weight: 700; color: var(--coral); margin-bottom: 0.5rem; font-family: 'Playfair Display', serif;">48h</div>
                <div class="metric-label" style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem;">Speed</div>
                <div class="metric-description" style="color: var(--ink-muted); font-size: 0.875rem;">From data to direction in two days.</div>
            </div>
            <div class="metric-card" style="text-align: center; padding: 2.5rem 2rem; background: var(--glass-bg); backdrop-filter: blur(10px); border: 1px solid var(--glass-border); border-radius: 1.5rem; transition: all 0.3s ease;">
                <div class="metric-number" style="font-size: 3.5rem; font-weight: 700; color: var(--coral); margin-bottom: 0.5rem; font-family: 'Playfair Display', serif;">500+</div>
                <div class="metric-label" style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem;">Sources</div>
                <div class="metric-description" style="color: var(--ink-muted); font-size: 0.875rem;">Live data, all working together.</div>
            </div>
        </div>
    </section>

    <!-- Section Divider -->
    <div class="section-divider" style="display: flex; align-items: center; justify-content: center; margin: 4rem 0 3rem; gap: 2rem;">
        <div class="divider-line" style="flex: 1; height: 1px; background: linear-gradient(90deg, transparent, rgba(249, 111, 110, 0.5), transparent);"></div>
        <div class="divider-content" style="color: var(--ink-muted); font-weight: 500; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.15em; white-space: nowrap;">Strategic Methodology</div>
        <div class="divider-line" style="flex: 1; height: 1px; background: linear-gradient(90deg, rgba(249, 111, 110, 0.5), transparent);"></div>
    </div>

    <!-- Methodology Section -->
    <section class="container" style="padding: 0 0 6rem;">
        <div class="section-intro" style="text-align: center; margin-bottom: 4rem;">
            <h2 style="font-family: 'Playfair Display', serif; font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; margin-bottom: 1rem;">
                How the Engine <span style="color: var(--coral);">Thinks</span>
            </h2>
            <p style="font-size: 1.125rem; color: var(--ink-muted); max-width: 600px; margin: 0 auto;">
                We didn't slap "AI" on an old consulting model. We built a system that moves with you.
            </p>
        </div>
        
        <div class="methodology-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem;">
            <div class="methodology-card" style="background: var(--glass-bg); backdrop-filter: blur(10px); border: 1px solid var(--glass-border); border-radius: 1.5rem; padding: 2rem; transition: all 0.3s ease;">
                <svg class="card-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2ED3C6" stroke-width="2" style="margin-bottom: 1.5rem;">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                </svg>
                <h3 class="card-title" style="font-size: 1.375rem; font-weight: 600; margin-bottom: 0.75rem;">AI-Powered Analysis</h3>
                <div class="card-content" style="color: var(--ink-muted); font-size: 0.9375rem; line-height: 1.6;">
                    <p>Live signals, trend forecasts, competitive mapping, and risk sensing – all synced to your goals.</p>
                </div>
            </div>
            
            <div class="methodology-card" style="background: var(--glass-bg); backdrop-filter: blur(10px); border: 1px solid var(--glass-border); border-radius: 1.5rem; padding: 2rem; transition: all 0.3s ease;">
                <svg class="card-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2ED3C6" stroke-width="2" style="margin-bottom: 1.5rem;">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
                <h3 class="card-title" style="font-size: 1.375rem; font-weight: 600; margin-bottom: 0.75rem;">Strategic Intelligence</h3>
                <div class="card-content" style="color: var(--ink-muted); font-size: 0.9375rem; line-height: 1.6;">
                    <p>Turning raw data into smart plays. Opportunity spotting, resource optimization, and clear roadmaps.</p>
                </div>
            </div>
            
            <div class="methodology-card" style="background: var(--glass-bg); backdrop-filter: blur(10px); border: 1px solid var(--glass-border); border-radius: 1.5rem; padding: 2rem; transition: all 0.3s ease;">
                <svg class="card-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2ED3C6" stroke-width="2" style="margin-bottom: 1.5rem;">
                    <circle cx="12" cy="12" r="10"/>
                    <circle cx="12" cy="12" r="6"/>
                    <circle cx="12" cy="12" r="2"/>
                </svg>
                <h3 class="card-title" style="font-size: 1.375rem; font-weight: 600; margin-bottom: 0.75rem;">Ecosystem Mapping</h3>
                <div class="card-content" style="color: var(--ink-muted); font-size: 0.9375rem; line-height: 1.6;">
                    <p>See who matters, which partnerships propel you, and where your brand should stand to lead.</p>
                </div>
            </div>
            
            <div class="methodology-card" style="background: var(--glass-bg); backdrop-filter: blur(10px); border: 1px solid var(--glass-border); border-radius: 1.5rem; padding: 2rem; transition: all 0.3s ease;">
                <svg class="card-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2ED3C6" stroke-width="2" style="margin-bottom: 1.5rem;">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
                <h3 class="card-title" style="font-size: 1.375rem; font-weight: 600; margin-bottom: 0.75rem;">Implementation Engine</h3>
                <div class="card-content" style="color: var(--ink-muted); font-size: 0.9375rem; line-height: 1.6;">
                    <p>No "here's your deck, good luck." We plan, track, and adapt in real time, measuring what matters.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-banner" id="cta" style="padding: 6rem 0; background: linear-gradient(135deg, rgba(249, 111, 110, 0.1), rgba(46, 211, 198, 0.1)); margin-top: 4rem;">
        <div class="container" style="text-align: center;">
            <h2 style="font-family: 'Playfair Display', serif; font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; margin-bottom: 1.5rem;">
                Ready to stop guessing and start <span style="color: var(--coral);">executing?</span>
            </h2>
            <p style="font-size: 1.25rem; color: var(--ink-dim); margin-bottom: 2.5rem; max-width: 700px; margin-left: auto; margin-right: auto;">
                Let's plug you into StrategyIQ™ and kick your business into high gear.
            </p>
            <div class="cta-row" style="display: flex; gap: 1.5rem; justify-content: center; flex-wrap: wrap;">
                <a href="/contact/" style="padding: 1.25rem 3rem; background: linear-gradient(135deg, var(--coral), var(--teal)); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 1.125rem; transition: all 0.3s ease;">
                    Book a Session
                </a>
                <a href="/TheHub/system/" style="padding: 1.25rem 3rem; color: var(--coral); text-decoration: none; border: 2px solid var(--coral); border-radius: 8px; font-weight: 600; font-size: 1.125rem; transition: all 0.3s ease;">
                    Learn how it fits in The Hub →
                </a>
            </div>
        </div>
    </section>

</div>
<!-- END OF PUBLIC MODE -->
```

---

## STEP 3: ADD FLOATING ANIMATION CSS

Find the `<style>` section in your `<head>` and add this animation:

```css
@keyframes float-hero-icon {
    0%, 100% {
        transform: translateY(0px) rotate(0deg);
    }
    50% {
        transform: translateY(-15px) rotate(2deg);
    }
}

/* Responsive chess piece */
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
        display: none !important;
    }
}

/* Hover effects */
.metric-card:hover {
    transform: translateY(-5px);
    border-color: var(--coral);
    box-shadow: 0 20px 40px rgba(249, 111, 110, 0.15);
}

.methodology-card:hover {
    transform: translateY(-5px);
    border-color: var(--coral);
    box-shadow: 0 20px 40px rgba(249, 111, 110, 0.15);
}
```

---

## STEP 4: VERIFY ADMIN MODE IS INTACT

**DO NOT TOUCH** these sections:
- ❌ Admin toggle button (line ~1876-1890)
- ❌ Admin modal (line ~1892-1906)
- ❌ `<div id="liveEngine">` section (line ~2195 onward)
- ❌ All JavaScript functions (line ~2790 onward)
- ❌ Assessment questions and scoring logic
- ❌ Supabase database code

These must remain **completely unchanged**.

---

## STEP 5: TEST BOTH MODES

### Test Public Mode:
1. Visit the page normally
2. Verify you see:
   - ✅ Large chess piece floating on right
   - ✅ Hero: "Meet StrategyIQ™"
   - ✅ Metrics: 97%, 2.3×, 48h, 500+
   - ✅ 4 methodology cards
   - ✅ CTA section at bottom
   - ✅ Admin button visible (gear icon, bottom-right)

### Test Admin Mode:
1. Click admin button
2. Enter password: **LG100**
3. Verify admin engine loads:
   - ✅ "Live StrategyIQ™ Engine" header
   - ✅ Session timer starts
   - ✅ Three assessment cards (Go-to-Market, Brand, Digital)
   - ✅ Exit Engine button works
4. Try starting an assessment
5. Verify questions load properly
6. Click "Exit Engine" - should return to public mode

---

## WHAT THIS APPROACH DOES:

✅ **Updates** public content with new copy & design  
✅ **Preserves** all admin functionality  
✅ **Adds** chess piece icon to hero  
✅ **Maintains** toggle between modes  
✅ **Keeps** all assessments, scoring, database intact  

---

## CRITICAL NOTES:

1. **Only replace content inside `<div id="publicMode">`**
2. **Do NOT modify admin button, modal, or live engine sections**
3. **Do NOT touch JavaScript functions**
4. **Do NOT remove Supabase code**
5. **Chess piece image must exist at:** `/assets/images/icons/strategyiq-icon-3d.png`

---

## IF SOMETHING BREAKS:

### Public mode broken?
- Check you only replaced the publicMode div content
- Verify chess piece path is correct
- Clear browser cache

### Admin mode broken?
- You probably modified liveEngine div or JavaScript
- Restore from backup immediately
- Start over, being more careful about what you change

### Password not working?
- Password is case-sensitive: **LG100**
- Check JavaScript function checkAdminPassword() wasn't modified

---

## SUMMARY:

This is a **surgical update** - only replacing the public-facing content while keeping all the admin/assessment functionality intact. This ensures both modes work perfectly.

The key is **discipline** - only change what's needed, leave everything else alone.
