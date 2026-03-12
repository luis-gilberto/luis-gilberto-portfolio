# FINAL FIX: Dark Mode Text Legibility Issue

## Root Cause Identified
The external `/assets/css/theme.css` file is likely overriding the inline dark mode variables. The CSS cascade is working against us.

## Solution: Add !important to Critical Variables

### Step 1: Locate Both Dark Mode Blocks
Find these two sections in the current HTML.

### Step 2: Add !important to Text Color Variables

Replace the `@media (prefers-color-scheme: dark)` block with:

```css
/* Dark Mode - System Preference */
@media (prefers-color-scheme: dark) {
    :root {
        --black: #FFFFFF !important;
        --white: #1a1a1a !important;
        --off-white: #0a0a0a !important;
        --grey-light: #2a2a2a !important;
        --grey-mid: #999999 !important;
        --text-dark: #e5e5e5 !important;
    }

    body {
        background: var(--white) !important;
        color: var(--text-dark) !important;
    }

    .hero {
        background: var(--off-white) !important;
    }

    .hero-image img[src*="POL_Hero"] {
        content: url('/insights/assets/images/POL/POL_Hero_dark.jpg');
    }

    .decorative-break img[src*="decorative-break-1"] {
        content: url('/insights/assets/images/POL/decorative-break-1_dark.jpg');
    }

    .decorative-break img[src*="decorative-break-2"] {
        content: url('/insights/assets/images/POL/decorative-break-2_dark.jpg');
    }

    .decorative-break img[src*="decorative-break-3"] {
        content: url('/insights/assets/images/POL/decorative-break-3_dark.jpg');
    }

    .decorative-break img[src*="decorative-break-4"] {
        content: url('/insights/assets/images/POL/decorative-break-4_dark.jpg');
    }
}
```

### Step 3: Update Manual Toggle Block

In the second `<style>` tag (after the theme.css link), replace the `html[data-theme="dark"]` section with:

```css
/* Dark Mode - Manual Toggle */
html[data-theme="dark"] {
    --black: #FFFFFF !important;
    --white: #1a1a1a !important;
    --off-white: #0a0a0a !important;
    --grey-light: #2a2a2a !important;
    --grey-mid: #999999 !important;
    --text-dark: #e5e5e5 !important;
}

html[data-theme="dark"] body {
    background: var(--white) !important;
    color: var(--text-dark) !important;
}

html[data-theme="dark"] .hero {
    background: var(--off-white) !important;
}

html[data-theme="dark"] .hero-image img[src*="POL_Hero"] {
    content: url('/insights/assets/images/POL/POL_Hero_dark.jpg');
}

html[data-theme="dark"] .decorative-break img[src*="decorative-break-1"] {
    content: url('/insights/assets/images/POL/decorative-break-1_dark.jpg');
}

html[data-theme="dark"] .decorative-break img[src*="decorative-break-2"] {
    content: url('/insights/assets/images/POL/decorative-break-2_dark.jpg');
}

html[data-theme="dark"] .decorative-break img[src*="decorative-break-3"] {
    content: url('/insights/assets/images/POL/decorative-break-3_dark.jpg');
}

html[data-theme="dark"] .decorative-break img[src*="decorative-break-4"] {
    content: url('/insights/assets/images/POL/decorative-break-4_dark.jpg');
}
```

## Why This Works

1. **!important** overrides external theme.css conflicts
2. **Direct body styling** ensures background and text colors apply immediately
3. **Direct hero styling** ensures the hero section background switches properly

## Alternative Solution (If !important Doesn't Work)

If the issue persists, the problem is in `/assets/css/theme.css`. You'll need to either:

1. **Option A**: Move the theme.css link BEFORE the inline styles (swap line order)
2. **Option B**: Check theme.css and ensure it's not setting conflicting dark mode colors

## Test Checklist
✓ Light mode: Black text on white background
✓ Dark mode: Light text (#e5e5e5) on dark background (#1a1a1a)
✓ Hero section background changes in both modes
✓ All text remains readable in both modes

The !important declarations will force the correct colors regardless of what theme.css is doing.
