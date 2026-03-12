# DIAGNOSTIC CHECKLIST - Fix Double Atom Issue

## The Problem
You're seeing TWO orbital atom shapes because:
1. ✗ External CSS file is conflicting with inline styles
2. ✗ Possible duplicate HTML elements
3. ✗ CSS selectors not matching properly

## Solution: 3 Simple Steps

### STEP 1: Remove External CSS Link
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In your <head> section, find and DELETE this line:

```html
<link rel="stylesheet" href="/IMCServices/strategic-hero-fixes.css">
```

Located at: Line 22 in your current HTML

WHY: External CSS is creating positioning conflicts


### STEP 2: Replace Hero Section CSS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Find this comment in your HTML (around line 102-103):
```css
/* Hero styles moved to strategic-hero-fixes.css */
/* Orbital watermark moved to strategic-hero-fixes.css */
```

Replace those comments AND any remaining hero/orbital styles with the 
complete CSS block from "complete-fix-instructions.html"


### STEP 3: Check for Duplicate HTML Elements
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In your <body>, search for:
- "hero-icon-wrapper" 
- "orbital"
- Any <img> or <svg> tags with atom graphics

YOU SHOULD ONLY HAVE **ONE** element like this:

```html
<div class="hero-icon-wrapper">
    <img src="/path/to/atom.png" alt="" class="hero-icon">
</div>
```

If you find multiple elements with similar classes or multiple atom images:
→ DELETE all but one
→ Keep the one inside your <section id="services-hero" class="hero">


## Quick Visual Test

After making changes, you should see:
✓ ONE atom shape (not two)
✓ Atom positioned to the right side, partially off-screen
✓ Content (headline) sitting higher on the page
✓ Atom NOT blocking your headline text


## Still Seeing Two Atoms?

Search your HTML for these patterns and DELETE duplicates:

❌ DUPLICATE PATTERN 1:
```html
<!-- Old positioning -->
<div style="position: absolute; right: 3%; top: 6vh;">
    <img src="atom.png">
</div>

<!-- New positioning -->
<div class="hero-icon-wrapper">
    <img src="atom.png">
</div>
```
→ Delete the first one (inline styles)


❌ DUPLICATE PATTERN 2:
```html
<!-- Multiple wrapper divs -->
<div class="orbital-bg">...</div>
<div class="hero-icon-wrapper">...</div>
```
→ Keep only hero-icon-wrapper


❌ DUPLICATE PATTERN 3:
CSS creating pseudo-elements:
```css
.hero::before {
    content: '';
    background: url('atom.png');
}
```
→ These should be set to display: none (already in my fix)


## File Locations to Check

1. Main HTML file: /IMCServices/index.html
2. External CSS: /IMCServices/strategic-hero-fixes.css (DELETE or ignore this)
3. Any included partials or components


## Expected Final Structure

```html
<section id="services-hero" class="hero">
    
    <!-- ONLY ONE ATOM SHAPE -->
    <div class="hero-icon-wrapper">
        <img src="/assets/images/atom-orbital.png" alt="" class="hero-icon">
    </div>
    
    <!-- Your content -->
    <p class="eyebrow">STRATEGIC MARKETING LEADERSHIP</p>
    <h1 class="hero-title">Where Strategy Meets <span>Creative</span> Excellence</h1>
    <p class="hero-subtitle">I lead integrated marketing...</p>
    
</section>
```


## Debugging Commands

If using browser DevTools:

1. Right-click on one of the atom shapes → Inspect
2. Look at the computed styles panel
3. Check which CSS rules are applying
4. Look for duplicate elements in the DOM tree


## Common Mistakes

❌ Keeping both external CSS AND inline styles
❌ Not deleting old positioning code
❌ Multiple <img> tags with atom graphics
❌ CSS pseudo-elements (::before, ::after) creating shapes


## Final Verification Checklist

After implementing the fix:

□ External CSS link removed from <head>
□ New CSS pasted into <style> tag in <head>
□ Only ONE .hero-icon-wrapper in HTML body
□ No duplicate atom images or shapes
□ Browser cache cleared (Ctrl+Shift+R / Cmd+Shift+R)
□ Page reloaded and tested

Expected Result:
✓ Single atom shape on the right
✓ Content elevated and unobstructed
✓ Elegant asymmetric composition


## Still Need Help?

Share:
1. Your complete <head> section
2. Your complete hero section HTML (body)
3. Screenshot of browser DevTools showing duplicate elements

I'll pinpoint the exact issue!
