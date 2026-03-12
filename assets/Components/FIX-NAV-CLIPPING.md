# Quick Fix: Hide Shapes Behind Navigation

## Problem
The floating shapes extend all the way to the top of the hero section, making them visible above/overlapping with the navigation bar. For realism, they should be clipped to stay below the nav.

## Solution

Add this CSS to clip the floating shapes container:

```css
/* Clip floating shapes to stay below the fixed navigation */
.floating-shapes {
    position: absolute;
    top: 80px;        /* Start below nav - adjust if your nav height is different */
    bottom: 0;
    left: 0;
    right: 0;
    /* Remove: inset: 0; if you have it */
    pointer-events: none;
    overflow: hidden;
    perspective: 1200px;
    transform-style: preserve-3d;
}
```

### What Changed:
- **Before**: `inset: 0;` (shapes fill entire hero, including nav area)
- **After**: `top: 80px;` (shapes start below the nav bar)

### Adjust the Value:
If your nav height is different than 80px, change the `top` value:
- Nav is 70px tall? → `top: 70px;`
- Nav is 90px tall? → `top: 90px;`

### Alternative (if that doesn't work):
If the shapes still peek through, add overflow clipping to the hero:

```css
.hero {
    position: relative;
    margin-top: 80px;
    padding: 20vh 1.5rem 12vh;
    text-align: center;
    overflow: hidden;  /* Add this line */
    /* ... rest of hero styles ... */
}
```

## Visual Result

**Before** (your screenshots):
```
┌─────────────────────────────────────┐
│         NAV BAR (fixed)             │
├─────────────────────────────────────┤
│  👁️ Shape visible above nav         │  ← Problem
│                                     │
│         Hero Content                │
```

**After** (with fix):
```
┌─────────────────────────────────────┐
│         NAV BAR (fixed)             │
├─────────────────────────────────────┤
│  🚫 Shapes clipped/hidden           │  ← Fixed!
│                                     │
│         Hero Content                │
```

## Implementation

### Option 1: Quick Test (DevTools)
1. Open browser DevTools (F12)
2. Find `.floating-shapes` in Elements
3. Change `inset: 0;` to remove it
4. Add `top: 80px;`
5. See if it works

### Option 2: Permanent Fix
Tell Trae to:
1. Open the CSS file
2. Find `.floating-shapes` selector
3. Replace `inset: 0;` with:
   ```css
   top: 80px;
   bottom: 0;
   left: 0;
   right: 0;
   ```
4. Test and adjust `top` value if needed

## Testing Checklist
- [ ] Top shapes no longer visible above nav
- [ ] Bottom shapes still visible as expected
- [ ] Side shapes still positioned correctly
- [ ] No shapes clipped too aggressively
- [ ] Works on mobile too

## Mobile Consideration
The fix should work on mobile too, but if your mobile nav is a different height, add:

```css
@media (max-width: 768px) {
    .floating-shapes {
        top: 70px;  /* Adjust for mobile nav height */
    }
}
```

---

**TL;DR**: Change `.floating-shapes` from `inset: 0;` to `top: 80px; bottom: 0; left: 0; right: 0;`

This clips the shapes to start below the navigation instead of filling the entire hero area.
