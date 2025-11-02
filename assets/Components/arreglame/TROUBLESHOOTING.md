# Floating Shapes Not Visible - Troubleshooting Guide

## The Problem
Your floating shapes in the background are not visible. Here's why and how to fix it.

## Root Causes

### 1. **OPACITY TOO LOW** ⚠️ (Main Issue)
Your shapes have extremely low opacity values:
```css
.floating-shapes .depth-far { opacity: 0.04; }   /* 4% visible - nearly invisible! */
.floating-shapes .depth-mid { opacity: 0.08; }   /* 8% visible - barely there */
.floating-shapes .depth-front { opacity: 0.12; } /* 12% visible - very subtle */
```

**FIX:** Increase to reasonable values:
```css
.floating-shapes .depth-far { opacity: 0.20; }   /* 20% - visible but subtle */
.floating-shapes .depth-mid { opacity: 0.30; }   /* 30% - more prominent */
.floating-shapes .depth-front { opacity: 0.40; } /* 40% - clearly visible */
```

### 2. **Multiple Conflicting CSS Definitions**
You have several `.floating-shapes` style blocks scattered throughout your HTML that override each other. This creates unpredictable behavior.

**FIX:** Consolidate all floating shapes CSS into one location (use the `floating-shapes-fixed.css` file I created).

### 3. **Hub Reveal System Interference**
The Hub Reveal System animation might be hiding your shapes with:
```javascript
setTimeout(() => {
  revealSystem.style.display = 'none';
}, 4000);
```

**FIX:** Make sure this only hides the reveal system, not your background shapes. They should be separate elements.

### 4. **Blur + Low Opacity = Invisible**
The combination of heavy blur AND low opacity makes shapes nearly impossible to see:
```css
filter: blur(3px) saturate(0.6); /* + opacity: 0.04 = invisible */
```

**FIX:** Reduce blur or increase opacity (or both).

### 5. **Z-index Layering**
Your shapes might be behind opaque backgrounds.

**FIX:** Ensure:
- `.floating-shapes { z-index: 0; }` (background layer)
- `main, .hero { z-index: 10; }` (content above)
- Hero background should be semi-transparent to see shapes through it

## Quick Fixes

### Option 1: Add Debug CSS (Temporary)
Add this to your `<head>` to immediately see shapes:
```html
<link rel="stylesheet" href="shape-debug.css">
```

### Option 2: Replace Floating Shapes CSS
Replace all your floating shapes CSS with the consolidated version from `floating-shapes-fixed.css`.

### Option 3: Test in Isolation
Open `test-shapes.html` in your browser to verify shapes work in a clean environment.

## Step-by-Step Fix

1. **Open your index.html**

2. **Find all `.floating-shapes` CSS** (there are multiple blocks)

3. **Delete all floating shapes CSS** (search for `.floating-shapes` and remove all related blocks)

4. **Add the fixed CSS**:
   - Either include `floating-shapes-fixed.css` as a separate file
   - Or copy its contents into a single `<style>` block

5. **Test the shapes**:
   ```bash
   # Open the test page
   open test-shapes.html
   ```

6. **Check browser console** for:
   - Image loading errors (404s)
   - CSS warnings
   - JavaScript errors

## How to Verify It's Working

### Visual Checks:
✅ You should see 8 floating shapes:
   - 4 coral (compass, telescope)  
   - 4 teal (atom, chess queen)

✅ Shapes should be at different opacity levels (depth effect)

✅ Shapes should gently float/animate

✅ Coral shapes have coral glow

✅ Teal shapes have teal glow

### Console Checks:
Open browser DevTools (F12) and check:
```javascript
// Should show 8 shapes
document.querySelectorAll('.floating-shapes .shape').length

// Check if images loaded
document.querySelectorAll('.floating-shapes .shape').forEach(img => {
  console.log(img.src, img.complete, img.naturalWidth);
});
```

## Common Issues

### "I still don't see anything!"

1. **Check image paths**:
   ```
   ./assets/icons/floating-shapes/compass_rose_coral.png
   ./assets/icons/floating-shapes/atom_model_teal.png
   ./assets/icons/floating-shapes/telescope_coral.png
   ./assets/icons/floating-shapes/chess_queen_teal.png
   ```
   Make sure these files exist!

2. **Check for CSS conflicts**:
   - Search for `display: none` on `.floating-shapes`
   - Look for `visibility: hidden`
   - Check for `opacity: 0`

3. **Check hero background**:
   If hero has solid background, you won't see shapes behind it:
   ```css
   .hero {
     /* BAD: Solid background blocks shapes */
     background: #0A0A0A;
     
     /* GOOD: Semi-transparent lets shapes show through */
     background: radial-gradient(
       1200px 600px at 50% -10%, 
       rgba(249, 111, 110, 0.50), 
       transparent 60%
     ) var(--dark-bg);
   }
   ```

4. **Disable Hub Reveal System** temporarily:
   ```javascript
   // Comment out or skip the animation
   const shouldShowAnimation = false;
   ```

## Recommended Opacity Values

For best visibility while maintaining subtlety:

```css
/* Desktop */
.depth-far   { opacity: 0.20; }  /* Subtle background */
.depth-mid   { opacity: 0.30; }  /* Medium depth */
.depth-front { opacity: 0.40; }  /* Most visible */

/* Tablet */
@media (max-width: 1024px) {
  .depth-far   { opacity: 0.18; }
  .depth-mid   { opacity: 0.25; }
  .depth-front { opacity: 0.35; }
}

/* Mobile */
@media (max-width: 768px) {
  .depth-far   { opacity: 0.15; }
  .depth-mid   { opacity: 0.22; }
  .depth-front { opacity: 0.30; }
}
```

## Files Created for You

1. **shape-debug.css** - Temporary debug styles with high visibility
2. **floating-shapes-fixed.css** - Clean, consolidated CSS
3. **test-shapes.html** - Isolated test page
4. **TROUBLESHOOTING.md** - This guide

## Next Steps

1. Open `test-shapes.html` - If shapes appear here, the issue is in your main page
2. If shapes DON'T appear in test page - Check image file paths
3. If shapes DO appear in test page - Replace your floating shapes CSS with the fixed version

## Need More Help?

Check console for:
```
❌ 404 errors (images not found)
❌ CSS warnings
❌ JavaScript errors
```

And verify:
✅ All 8 shape images exist in correct folder
✅ Only ONE set of floating shapes CSS
✅ Opacity values are 0.20 or higher
✅ Hero background is semi-transparent
