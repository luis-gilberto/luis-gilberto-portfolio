# TRAE: Clean Slate - Remove ALL Palette CSS and Replace with Simple Swatches

## CRITICAL: This is a Complete Replacement

The current `myexperience.html` has **multiple conflicting CSS blocks** for the palette selector. This prompt will:
1. **DELETE all existing palette selector CSS**
2. **Replace with ONE clean CSS block**
3. **Update HTML to simple swatch version**
4. **Keep JavaScript working**

---

## STEP 1: Delete ALL Existing Palette CSS

**Location:** In `myexperience.html`, find and **DELETE EVERYTHING** between these comments (if they exist):

```html
<!-- Remove any CSS blocks that contain these selectors: -->
```

**Search for and DELETE all CSS rules containing:**
- `.resume-palette-selector`
- `.palette-options`
- `.palette-option`
- `.palette-grid`
- `.palette-card`
- `.mini-resume`
- `.mini-sidebar`
- `.mini-name`
- `.mini-content`
- `.mini-job-entry`
- `.mini-date`
- `.mini-title`
- `.mini-company`
- `.coral-light`
- `.coral-dark`
- `.teal-hybrid`
- `.print-bw`
- `.palette-info`
- `.palette-name`
- `.palette-desc`
- `.selector-label`
- `.selector-subtitle`
- `.checkmark`
- `.color-dot`
- `.palette-colors`
- `.current-selection`
- `.current-label`
- `.current-style`
- `.download-btn` (in resume context)
- `.view-full-cv-link`

**Delete ALL occurrences of these selectors throughout the `<style>` tags.**

---

## STEP 2: Add ONE Clean CSS Block

**Location:** After deleting all palette CSS, add this SINGLE CSS block inside the main `<style>` tag (before the closing `</style>`):

```css
/* ==========================================
   RESUME PALETTE SELECTOR - SIMPLE SWATCHES
   ========================================== */

.resume-palette-selector {
    background: var(--surface-dark);
    border: var(--border-light);
    border-radius: var(--radius);
    padding: var(--space-lg);
    box-shadow: var(--shadow-soft);
}

[data-theme="light"] .resume-palette-selector {
    background: var(--surface-light);
}

.selector-label {
    font-family: var(--font-strategist);
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-primary);
    margin-bottom: var(--space-sm);
    display: block;
}

/* Grid Layout - 2x2 */
.palette-options {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: var(--space-md);
}

/* Individual Palette Card */
.palette-option {
    background: var(--surface-dark-2);
    border: 2px solid transparent;
    border-radius: var(--radius-sm);
    padding: 16px 14px;
    cursor: pointer;
    transition: all 0.3s var(--ease-out);
    position: relative;
}

[data-theme="light"] .palette-option {
    background: #F9F9F9;
}

.palette-option:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-soft);
    border-color: rgba(255, 255, 255, 0.15);
}

[data-theme="light"] .palette-option:hover {
    border-color: rgba(0, 0, 0, 0.1);
}

.palette-option.active {
    border-color: var(--coral);
    background: rgba(249, 111, 110, 0.05);
}

/* Checkmark */
.palette-option .checkmark {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 22px;
    height: 22px;
    background: var(--coral);
    border-radius: 50%;
    display: none;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 13px;
    font-weight: bold;
}

.palette-option.active .checkmark {
    display: flex;
}

/* Color Dots */
.palette-colors {
    display: flex;
    gap: 7px;
    margin-bottom: 10px;
}

.color-dot {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.12);
    transition: transform 0.2s var(--ease-out);
}

[data-theme="light"] .color-dot {
    border-color: rgba(0, 0, 0, 0.1);
}

.palette-option:hover .color-dot {
    transform: scale(1.15);
}

/* Text Labels */
.palette-name {
    font-family: var(--font-orchestrator);
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 4px;
}

.palette-desc {
    font-family: var(--font-orchestrator);
    font-size: 12px;
    color: var(--text-muted);
    line-height: 1.4;
}

/* Current Selection */
.current-selection {
    background: var(--surface-dark-2);
    border-radius: var(--radius-sm);
    padding: 14px;
    margin-bottom: var(--space-md);
    text-align: center;
}

[data-theme="light"] .current-selection {
    background: #F5F5F5;
}

.current-label {
    font-family: var(--font-orchestrator);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-subtle);
    margin-bottom: 5px;
    font-weight: 600;
}

.current-style {
    font-family: var(--font-storyteller);
    font-style: italic;
    font-size: 17px;
    font-weight: 600;
    color: var(--coral);
}

/* Download Button */
.download-btn {
    display: block;
    width: 100%;
    background: var(--coral);
    color: white;
    text-decoration: none;
    padding: 15px;
    border-radius: var(--radius-sm);
    font-family: var(--font-strategist);
    font-weight: 700;
    font-size: 14px;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    transition: all 0.3s var(--ease-out);
    border: none;
    cursor: pointer;
    margin-bottom: var(--space-sm);
}

.download-btn:hover {
    background: #E85E5D;
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(249, 111, 110, 0.35);
}

.download-btn:active {
    transform: translateY(0);
}

/* View Full CV Link */
.view-full-cv-link {
    display: block;
    text-align: center;
    font-family: var(--font-orchestrator);
    font-size: 13px;
    font-weight: 500;
    color: var(--text-muted);
    text-decoration: none;
    transition: color 0.2s var(--ease-out);
    padding: 8px;
}

.view-full-cv-link:hover {
    color: var(--coral);
}

/* Mobile - Single Column */
@media (max-width: 640px) {
    .palette-options {
        grid-template-columns: 1fr;
    }
    
    .palette-option {
        padding: 14px 12px;
    }
}
```

---

## STEP 3: Replace HTML Structure

**Location:** Find the `.resume-palette-selector` div in `myexperience.html`

**Replace the ENTIRE `.resume-palette-selector` div with this:**

```html
<div class="resume-palette-selector">
    <label class="selector-label">Choose Your Resume Style</label>
    
    <div class="palette-options">
        
        <!-- Coral Light -->
        <div class="palette-option active" data-style="coral-light" data-pdf="assets/Components/THE_FOUR/LS-cv_coral-light.pdf">
            <span class="checkmark">✓</span>
            <div class="palette-colors">
                <span class="color-dot" style="background: #F96F6E;"></span>
                <span class="color-dot" style="background: #F4F1ED;"></span>
                <span class="color-dot" style="background: #E8E6E3;"></span>
            </div>
            <div class="palette-name">Coral Light</div>
            <div class="palette-desc">Warm & approachable</div>
        </div>
        
        <!-- Coral Dark -->
        <div class="palette-option" data-style="coral-dark" data-pdf="assets/Components/THE_FOUR/LS-cv_coral-dark-pdf.pdf">
            <span class="checkmark">✓</span>
            <div class="palette-colors">
                <span class="color-dot" style="background: #F96F6E;"></span>
                <span class="color-dot" style="background: #2A2A2A;"></span>
                <span class="color-dot" style="background: #FF9B9A;"></span>
            </div>
            <div class="palette-name">Coral Dark</div>
            <div class="palette-desc">Bold & premium</div>
        </div>
        
        <!-- Teal Hybrid -->
        <div class="palette-option" data-style="teal-hybrid" data-pdf="assets/Components/THE_FOUR/LS-cv_teal-hybrid-pdf.pdf">
            <span class="checkmark">✓</span>
            <div class="palette-colors">
                <span class="color-dot" style="background: #2A2A2A;"></span>
                <span class="color-dot" style="background: #2ED3C6;"></span>
                <span class="color-dot" style="background: #F4F1ED;"></span>
            </div>
            <div class="palette-name">Teal Hybrid</div>
            <div class="palette-desc">Modern & strategic</div>
        </div>
        
        <!-- Print B&W -->
        <div class="palette-option" data-style="print-bw" data-pdf="assets/Components/THE_FOUR/LS-cv_print-bw-pdf.pdf">
            <span class="checkmark">✓</span>
            <div class="palette-colors">
                <span class="color-dot" style="background: #FFFFFF; border-color: #999;"></span>
                <span class="color-dot" style="background: #0A0A0A;"></span>
            </div>
            <div class="palette-name">Print B&W</div>
            <div class="palette-desc">Ink-saver elegance</div>
        </div>
        
    </div>
    
    <!-- Current Selection -->
    <div class="current-selection">
        <div class="current-label">Currently Selected</div>
        <div class="current-style" id="currentStyle">Coral Light</div>
    </div>
    
    <!-- Download Button -->
    <a href="assets/Components/THE_FOUR/LS-cv_coral-light.pdf" class="download-btn" id="downloadBtn" download>
        Download PDF
    </a>
    
    <!-- Link to Full CV Page -->
    <a href="cv.html" class="view-full-cv-link">
        View Full Interactive Web Version →
    </a>
</div>
```

---

## STEP 4: Verify JavaScript Exists

**Location:** At the bottom of `myexperience.html`, before `</body>`

**Verify this JavaScript block exists (it should already be there):**

```javascript
<script>
    document.addEventListener('DOMContentLoaded', function(){
        const options = document.querySelectorAll('.palette-option');
        const currentStyleLabel = document.getElementById('currentStyle');
        const downloadBtn = document.getElementById('downloadBtn');
        if(!options.length || !currentStyleLabel || !downloadBtn) return;
        const names = { 'coral-light':'Coral Light','coral-dark':'Coral Dark','teal-hybrid':'Teal Hybrid','print-bw':'Print B&W' };
        options.forEach(opt=>{
            opt.addEventListener('click', function(){
                options.forEach(o=>o.classList.remove('active'));
                this.classList.add('active');
                const style = this.getAttribute('data-style');
                const pdf = this.getAttribute('data-pdf');
                currentStyleLabel.textContent = names[style] || style;
                downloadBtn.href = pdf;
            });
            opt.style.cursor = 'pointer';
        });
    });
</script>
```

**If missing, add it.** If present, leave it as is.

---

## Testing Checklist

### Local Testing

Open: **http://localhost:8000/myexperience.html**

- [ ] **Visual Check:**
  - [ ] 4 color swatch cards visible in 2×2 grid
  - [ ] Each card shows 2-3 colored dots
  - [ ] Clean, simple layout (no broken rendering)
  - [ ] "Choose Your Resume Style" header visible
  - [ ] "Currently Selected: Coral Light" visible
  - [ ] Download button visible
  - [ ] "View Full Interactive Web Version →" link visible
  
- [ ] **Interactive Check:**
  - [ ] Click Coral Light → Border turns coral, checkmark appears
  - [ ] Click Coral Dark → Border moves, label updates
  - [ ] Click Teal Hybrid → Border moves, label updates
  - [ ] Click Print B&W → Border moves, label updates
  - [ ] Download button href updates (right-click → inspect)
  - [ ] "View Full Web Version" link goes to `/cv.html`
  
- [ ] **Console Check:**
  - [ ] Open DevTools Console (F12)
  - [ ] No CSS errors about palette selectors
  - [ ] No "duplicate selector" warnings
  - [ ] JavaScript runs without errors

### Production Testing

After deployment to https://www.luis-gilberto.com/myexperience:

- [ ] **Cache Purge:**
  - [ ] Cloudflare Dashboard → Caching → Purge Everything
  - [ ] Wait 60 seconds (longer than usual to ensure full purge)
  
- [ ] **Hard Refresh:**
  - [ ] Windows: `Ctrl + Shift + R`
  - [ ] Mac: `Cmd + Shift + R`
  - [ ] Do this 2-3 times to ensure cache is cleared
  
- [ ] **Verify all checks above**

---

## Quick Console Verification

After deployment, paste this in browser console:

```javascript
// Count CSS rules for palette selector
const sheets = Array.from(document.styleSheets);
let paletteRules = 0;
sheets.forEach(sheet => {
    try {
        const rules = Array.from(sheet.cssRules || []);
        rules.forEach(rule => {
            if (rule.selectorText && (
                rule.selectorText.includes('.palette-option') ||
                rule.selectorText.includes('.mini-resume') ||
                rule.selectorText.includes('.palette-card')
            )) {
                paletteRules++;
                console.log('Found:', rule.selectorText);
            }
        });
    } catch(e) {}
});

console.log('Total palette selector rules:', paletteRules);
console.log('Expected: ~15-20 rules (for simple swatches)');
console.log('If > 30: Still has duplicate/conflicting CSS');

// Check HTML structure
console.log('Palette options:', document.querySelectorAll('.palette-option').length);
console.log('Color dots:', document.querySelectorAll('.color-dot').length);
console.log('Should be: 4 options, 11 dots');
```

**Expected Output:**
```
Total palette selector rules: 18
Expected: ~15-20 rules (for simple swatches)
Palette options: 4
Color dots: 11
Should be: 4 options, 11 dots
```

**If you see > 30 rules:** CSS wasn't fully cleaned - some old rules remain

---

## Troubleshooting

### If cards still render incorrectly:
1. **Check for leftover CSS:** Search HTML for `.mini-resume`, `.palette-card`, `.palette-grid`
2. **Delete ANY remaining references** to these selectors
3. **Verify only ONE `.palette-options` CSS rule exists**

### If grid is broken:
1. **Inspect `.palette-options` in DevTools**
2. **Check computed styles** - should show `display: grid`, `grid-template-columns: repeat(2, 1fr)`
3. **If showing different values:** Old CSS is still loading

### If JavaScript doesn't work:
1. **Check console for errors**
2. **Verify `data-style` and `data-pdf` attributes exist** on `.palette-option` elements
3. **Verify IDs exist:** `currentStyle`, `downloadBtn`

### If download link is wrong:
1. **Check PDF paths** - should match: `assets/Components/THE_FOUR/LS-cv_coral-light.pdf` (etc.)
2. **Verify no typos** in `data-pdf` attributes

---

## Summary

**What This Does:**
- **DELETES** all conflicting palette CSS (mini resume previews, old versions, duplicates)
- **ADDS** ONE clean CSS block for simple swatches
- **REPLACES** HTML with working 2×2 grid structure
- **KEEPS** JavaScript working (already present)
- **ADDS** link to full CV page

**End Result:**
- Clean 2×2 grid of color swatch cards
- No rendering issues or layout conflicts
- Click to select → border changes, download link updates
- Link to full CV page at bottom
- Works in both light and dark modes

**Time Estimate:**
- Delete old CSS: 5 minutes
- Add new CSS + HTML: 5 minutes
- Test locally: 3 minutes
- Deploy & verify: 5 minutes
- **Total:** ~18 minutes

---

**CRITICAL:** Make sure to **DELETE ALL old palette CSS first**. That's the root cause of the rendering issue. If old CSS remains, the problem will persist.

Ready to implement! 🚀
