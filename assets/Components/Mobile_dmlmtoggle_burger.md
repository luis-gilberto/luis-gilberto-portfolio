# Instructions for Trae: Fix Mobile Navigation Across All Insights Pages

## Overview
We're fixing two mobile navigation issues across the entire Insights site:
1. Theme toggle button and hamburger menu overlapping
2. Mobile menu requiring horizontal/vertical scrolling

## Step 1: Upload the CSS File

Upload this file to your server:
- **File**: insights-mobile-fixes.css
- **Location**: /insights/assets/css/insights-mobile-fixes.css

## Step 2: Add CSS Link to ALL Insights Pages

Add this line in the `<head>` section of each page, **AFTER** the existing styles but **BEFORE** the closing `</head>` tag:

```html
<link rel="stylesheet" href="/insights/assets/css/insights-mobile-fixes.css">
```

### Pages that need this link added:

**Main Pages:**
- /insights/index.html
- /insights/proof-of-life/index.html
- /insights/building-insights/index.html
- /insights/building-the-hub/index.html
- /insights/unlocking-the-blank-page/index.html
- /insights/move-at-your-speed/index.html

**Case Study Pages:**
- /insights/family-safety-launch/index.html
- /insights/free-to-be-free/index.html
- /insights/teams-consumer-launch/index.html
- /insights/edge-ucational-series/index.html
- /insights/transforming-browsing-ai/index.html
- /insights/edge-mobile-rebrand/index.html

**Any other Insights pages that use the unified navigation**

## Step 3: Optional JavaScript Enhancement

If you want to prevent body scrolling when the mobile menu is open, add this to your navigation JavaScript (in the openMenu function):

```javascript
document.body.classList.add('menu-open');
```

And in the closeMenu function:

```javascript
document.body.classList.remove('menu-open');
```

## Testing Checklist

After implementation, test on mobile:
- [ ] Theme toggle appears to the left of hamburger menu (not overlapping)
- [ ] Clicking hamburger opens full-screen menu
- [ ] Menu items are visible without horizontal scrolling
- [ ] Menu items are visible without excessive vertical scrolling
- [ ] Clicking a menu item or close button closes the menu properly
- [ ] Background body doesn't scroll when menu is open

## What Gets Fixed

✅ Theme toggle repositioned on mobile (72px from right instead of 20px)
✅ Mobile menu takes full screen width/height
✅ No horizontal scrolling required
✅ Menu items properly left-aligned
✅ Works on all screen sizes (360px to 768px+)

## Rollback Instructions

If something breaks, simply remove the `<link>` tag from the pages to revert to original behavior.
