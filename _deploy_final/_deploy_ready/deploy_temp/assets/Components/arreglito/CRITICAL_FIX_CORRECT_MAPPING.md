# 🔴 CRITICAL FIX: Correct Image-to-Service Mapping

## The REAL Problem

The code has **INCORRECT mappings** between services and images!

### ❌ WRONG Mapping (What's Currently in Code):
```
service-imc       → compass_rose_coral.png  ❌ WRONG!
service-advisory  → atom_model_teal.png     ❌ WRONG!
service-scope     → telescope_coral.png     ✓ Correct
service-strategy  → chess_queen_teal.png    ✓ Correct
```

### ✅ CORRECT Mapping (What It Should Be):
According to your original design spec:

```
Advisory     = 🧭 Compass (coral)     = compass_rose_coral.png
IMC Services = ⚛️ Atom (teal)         = atom_model_teal.png
ScopeIQ      = 🔭 Telescope (coral)   = telescope_coral.png
StrategyIQ   = ♛ Chess Queen (teal)   = chess_queen_teal.png
```

## The Fix

### REMOVE DUPLICATE Hub Reveal System Block

There are **TWO Hub Reveal System blocks** in the HTML:
1. One near the top (around line 50-80)
2. One near the bottom (around line 1400+)

**DELETE the one at the top** (it's a duplicate causing conflicts).

### REPLACE the Bottom Hub Reveal System Block

Find this block near the end of the HTML (just before `</body>`) and replace it entirely:

```html
<!-- Hub Reveal System -->
<div class="hub-reveal-system" id="hubRevealSystem">
    <!-- Energy burst from rectangles -->
    <div class="energy-burst">
        <div class="energy-rect energy-rect-outer"></div>
        <div class="energy-rect energy-rect-inner"></div>
    </div>
    
    <!-- Service images - CORRECT MAPPINGS -->
    <div class="service-image service-advisory">
        <img src="/TheHub/assets/icons/floating-shapes/compass_rose_coral.png" alt="Advisory - Compass">
    </div>
    <div class="service-image service-imc">
        <img src="/TheHub/assets/icons/floating-shapes/atom_model_teal.png" alt="IMC Services - Atom">
    </div>
    <div class="service-image service-scope">
        <img src="/TheHub/assets/icons/floating-shapes/telescope_coral.png" alt="ScopeIQ - Telescope">
    </div>
    <div class="service-image service-strategy">
        <img src="/TheHub/assets/icons/floating-shapes/chess_queen_teal.png" alt="StrategyIQ - Chess Queen">
    </div>
</div>
```

### UPDATE the CSS

Find `.hub-reveal-system` CSS and make sure it has:

```css
.hub-reveal-system {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    opacity: 0;
    pointer-events: none;
    background: transparent;     /* ← NO BLUR BACKGROUND */
    backdrop-filter: none;        /* ← NO BLUR FILTER */
    transition: opacity 0.3s ease-out;
}
```

## Why You're Seeing Placeholder Text

The faint text you're seeing ("Advisory", "IMC Services", etc.) is from the `alt` attributes of the `<img>` tags showing up because:
1. Images aren't loading (wrong paths or wrong mappings)
2. Browser is displaying alt text as fallback
3. The alt text is styled with low opacity, making it look like watermarks

## Testing Checklist

After fix:
- [ ] Only ONE Hub Reveal System block exists (at bottom, before `</body>`)
- [ ] Image mappings match: Advisory=Compass, IMC=Atom, ScopeIQ=Telescope, StrategyIQ=Queen
- [ ] All paths use `/TheHub/assets/...` (absolute, not relative)
- [ ] CSS has `background: transparent` and `backdrop-filter: none`
- [ ] Clear cache and test (Cmd+Shift+R)
- [ ] Verify actual icon images appear, not text watermarks

## Quick Verification

Open browser console and check if images load:
```javascript
// Paste this in console to test if images exist
['compass_rose_coral', 'atom_model_teal', 'telescope_coral', 'chess_queen_teal'].forEach(img => {
  const path = `/TheHub/assets/icons/floating-shapes/${img}.png`;
  fetch(path).then(r => console.log(path, r.ok ? '✓' : '✗'));
});
```

All four should show `✓` if files exist at those paths.
