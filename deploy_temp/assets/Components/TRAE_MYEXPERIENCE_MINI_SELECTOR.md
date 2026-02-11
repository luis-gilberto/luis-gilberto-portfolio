# TRAE: Add Minimal Resume Palette Selector to myexperience.html

Add a compact, teaser-style palette selector to the myexperience.html page in the "PROFESSIONAL RECORD" section. This is a simplified version without the preview panel - just palette options and download button.

## LOCATION

**File:** myexperience.html  
**Section:** Line ~398 - Inside the "PROFESSIONAL RECORD" section (#resume)  
**Exact insertion point:** Replace the current download area that contains:
```html
<div style="text-align:center; padding-right:2rem; border-right:1px solid rgba(255,255,255,0.1);">
    <h3>The Full Story</h3>
    <p style="margin-bottom:2rem; color:var(--text-muted);">Download the official CV or view the interactive web version.</p>
    <a href="assets/documents/Luis_Gilberto_Resume.pdf?v=3" class="resume-btn" download>Download PDF</a>
    <br><br>
    <a href="/cv.html" style="font-size:0.9rem; border-bottom:1px solid #666; padding-bottom:2px;">View Web Version &rarr;</a>
</div>
```

## STEP 1: ADD CSS

Add this CSS to the `<style>` block (before the closing `</style>` tag around line ~385):

```css
/* === MINIMAL RESUME PALETTE SELECTOR === */
.resume-palette-mini {
    text-align: center;
    padding-right: 2rem;
    border-right: 1px solid rgba(255,255,255,0.1);
}

.resume-palette-mini h3 {
    margin-bottom: 0.5rem;
}

.resume-palette-mini > p {
    margin-bottom: 1.5rem;
    color: var(--text-muted);
}

.mini-selector-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: rgba(255,255,255,0.4);
    margin-bottom: 12px;
    display: block;
}

.mini-palette-options {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-bottom: 16px;
    max-width: 280px;
    margin-left: auto;
    margin-right: auto;
}

.mini-palette-option {
    background: rgba(255,255,255,0.03);
    border: 2px solid transparent;
    border-radius: 10px;
    padding: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
}

.mini-palette-option:hover {
    transform: translateY(-2px);
    background: rgba(255,255,255,0.05);
}

.mini-palette-option.active {
    border-color: var(--coral);
    background: rgba(249, 111, 110, 0.08);
}

.mini-palette-option .mini-checkmark {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 16px;
    height: 16px;
    background: var(--coral);
    border-radius: 50%;
    display: none;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 10px;
}

.mini-palette-option.active .mini-checkmark {
    display: flex;
}

.mini-palette-colors {
    display: flex;
    gap: 5px;
    margin-bottom: 6px;
    justify-content: center;
}

.mini-color-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 1px solid rgba(10, 10, 10, 0.15);
}

.mini-palette-name {
    font-size: 11px;
    font-weight: 600;
    color: #fff;
}

.mini-current-selection {
    font-size: 11px;
    color: rgba(255,255,255,0.5);
    margin-bottom: 16px;
}

.mini-current-style {
    color: var(--coral);
    font-weight: 600;
}

.mini-web-link {
    font-size: 0.9rem;
    border-bottom: 1px solid #666;
    padding-bottom: 2px;
    color: rgba(255,255,255,0.7);
    text-decoration: none;
    transition: color 0.2s;
}

.mini-web-link:hover {
    color: #fff;
}

@media (max-width: 900px) {
    .resume-palette-mini {
        border-right: none;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        padding-right: 0;
        padding-bottom: 2rem;
        margin-bottom: 2rem;
    }
}
```

## STEP 2: REPLACE HTML

Find and **replace** the download area div (around line ~402) with this new component:

```html
<div class="resume-palette-mini">
    <h3>The Full Story</h3>
    <p>Choose your style and download the official CV.</p>
    
    <label class="mini-selector-label">Choose Style</label>
    
    <div class="mini-palette-options">
        <!-- Coral Light -->
        <div class="mini-palette-option active" 
             data-style="coral-light" 
             data-pdf="./assets/Components/THE_FOUR/LS-cv_coral-light.pdf">
            <span class="mini-checkmark">✓</span>
            <div class="mini-palette-colors">
                <span class="mini-color-dot" style="background: #F96F6E;"></span>
                <span class="mini-color-dot" style="background: #F4F1ED;"></span>
                <span class="mini-color-dot" style="background: #E8E6E3;"></span>
            </div>
            <div class="mini-palette-name">Coral Light</div>
        </div>

        <!-- Coral Dark -->
        <div class="mini-palette-option" 
             data-style="coral-dark" 
             data-pdf="./assets/Components/THE_FOUR/LS-cv_coral-dark.pdf">
            <span class="mini-checkmark">✓</span>
            <div class="mini-palette-colors">
                <span class="mini-color-dot" style="background: #F96F6E;"></span>
                <span class="mini-color-dot" style="background: #2A2A2A;"></span>
                <span class="mini-color-dot" style="background: #FF9B9A;"></span>
            </div>
            <div class="mini-palette-name">Coral Dark</div>
        </div>

        <!-- Teal Hybrid -->
        <div class="mini-palette-option" 
             data-style="teal-hybrid" 
             data-pdf="./assets/Components/THE_FOUR/LS-cv_teal-hybrid.pdf">
            <span class="mini-checkmark">✓</span>
            <div class="mini-palette-colors">
                <span class="mini-color-dot" style="background: #2A2A2A;"></span>
                <span class="mini-color-dot" style="background: #2ED3C6;"></span>
                <span class="mini-color-dot" style="background: #F4F1ED;"></span>
            </div>
            <div class="mini-palette-name">Teal Hybrid</div>
        </div>

        <!-- Print B&W -->
        <div class="mini-palette-option" 
             data-style="print-bw" 
             data-pdf="./assets/Components/THE_FOUR/LS-cv_print-bw.pdf">
            <span class="mini-checkmark">✓</span>
            <div class="mini-palette-colors">
                <span class="mini-color-dot" style="background: #FFFFFF; border-color: #999;"></span>
                <span class="mini-color-dot" style="background: #0A0A0A;"></span>
            </div>
            <div class="mini-palette-name">Print B&W</div>
        </div>
    </div>

    <div class="mini-current-selection">
        Currently: <span class="mini-current-style" id="miniCurrentStyle">Coral Light</span>
    </div>

    <a href="./assets/Components/THE_FOUR/LS-cv_coral-light.pdf" 
       class="resume-btn" 
       id="miniDownloadBtn" 
       download>
        Download PDF
    </a>
    
    <br><br>
    
    <a href="/cv.html" class="mini-web-link">
        View Web Version &rarr;
    </a>
</div>
```

## STEP 3: ADD JAVASCRIPT

Add this JavaScript to the existing `<script>` block at the bottom (before the closing `</script>` tag around line ~485):

```javascript
// === MINI PALETTE SELECTOR (myexperience page) ===
(function() {
    const miniPaletteOptions = document.querySelectorAll('.mini-palette-option');
    const miniCurrentStyle = document.getElementById('miniCurrentStyle');
    const miniDownloadBtn = document.getElementById('miniDownloadBtn');

    const styleNames = {
        'coral-light': 'Coral Light',
        'coral-dark': 'Coral Dark',
        'teal-hybrid': 'Teal Hybrid',
        'print-bw': 'Print B&W'
    };

    if (miniPaletteOptions.length > 0) {
        miniPaletteOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Remove active class from all
                miniPaletteOptions.forEach(opt => opt.classList.remove('active'));
                
                // Add active to clicked
                this.classList.add('active');
                
                // Get data
                const styleName = this.getAttribute('data-style');
                const pdfUrl = this.getAttribute('data-pdf');
                
                // Update UI
                if (miniCurrentStyle) {
                    miniCurrentStyle.textContent = styleNames[styleName];
                }
                
                if (miniDownloadBtn) {
                    miniDownloadBtn.setAttribute('href', pdfUrl);
                }

                console.log('📄 Mini selector: ' + styleNames[styleName] + ' selected');
            });
        });

        console.log('✅ Mini palette selector initialized');
    }
})();
```

## WHAT THIS DOES

**Visual Changes:**
- Replaces the simple download section with a compact 2×2 palette grid
- Shows 4 resume style options with color dots
- Displays currently selected style
- Updates download button to correct PDF

**User Experience:**
1. User sees 4 palette options in a clean grid
2. Clicks their preferred style
3. Active state shows coral border + checkmark
4. "Currently: [Style Name]" updates
5. Download button href updates to selected PDF
6. User clicks "Download PDF" to get their chosen variant

**Key Differences from Full Version:**
- ✅ No preview panel (keeps it compact)
- ✅ Smaller palette cards (2×2 grid fits sidebar)
- ✅ Simpler interaction (click → download)
- ✅ Same brand styling and colors
- ✅ Mobile-responsive (stacks on small screens)

## EXPECTED RESULT

**Before:** Simple text + one download button  
**After:** Interactive palette selector with 4 style options

**Console Output:**
```
✅ Mini palette selector initialized
📄 Mini selector: Coral Dark selected
```

**On Page:**
- Clean 2×2 grid of palette options
- Coral Light selected by default
- Clicking updates active state and download link
- "View Web Version →" link remains below
- Mobile-friendly (grid stacks vertically)

## VALIDATION CHECKLIST

After implementation:
- [ ] 4 palette options visible in 2×2 grid
- [ ] Coral Light selected by default (active state)
- [ ] Clicking palette shows coral border + checkmark
- [ ] "Currently: [Style]" text updates
- [ ] Download button href updates
- [ ] "View Web Version" link still works
- [ ] Mobile responsive (stacks on <900px)
- [ ] Console shows initialization message

## NOTES

- All file paths use `./` prefix to match cv.html setup
- PDF paths point to THE_FOUR folder: `./assets/Components/THE_FOUR/`
- Component is fully self-contained
- Works independently from cv.html palette selector
- Reuses existing brand colors and fonts
- No preview functionality (intentionally minimal)
- Mobile-friendly with automatic stacking

## FILE PATHS USED

```
./assets/Components/THE_FOUR/LS-cv_coral-light.pdf
./assets/Components/THE_FOUR/LS-cv_coral-dark.pdf
./assets/Components/THE_FOUR/LS-cv_teal-hybrid.pdf
./assets/Components/THE_FOUR/LS-cv_print-bw.pdf
```

These match the full selector on cv.html for consistency.
