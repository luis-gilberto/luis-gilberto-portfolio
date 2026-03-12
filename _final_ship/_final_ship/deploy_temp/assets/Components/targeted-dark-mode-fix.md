# Targeted Fix for Dark Mode Text Legibility - Apply to Existing File

## Problem
Text is unreadable in dark mode due to CSS variable conflicts.

## Solution: Replace Dark Mode CSS Section Only

### Step 1: Locate the Dark Mode Section
Find this block in the existing HTML (starts around line 290):

```css
/* Dark Mode */
@media (prefers-color-scheme: dark) {
    :root {
        --white: #1a1a1a;
        --off-white: #0a0a0a;
        --text-dark: #e5e5e5;
        --black: #ffffff;
        --grey-light: #2a2a2a;
        --grey-mid: #999999;
    }
    ...
}
```

### Step 2: Replace ENTIRE Dark Mode Block
Delete everything from `/* Dark Mode */` to the closing `}` of the `@media (prefers-color-scheme: dark)` block.

Replace with this:

```css
/* Dark Mode - System Preference */
@media (prefers-color-scheme: dark) {
    :root {
        --black: #FFFFFF;
        --white: #1a1a1a;
        --off-white: #0a0a0a;
        --grey-light: #2a2a2a;
        --grey-mid: #999999;
        --text-dark: #e5e5e5;
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

### Step 3: Update Manual Toggle Section
Find the `html[data-theme="dark"]` block and replace it with:

```css
/* Dark Mode - Manual Toggle */
html[data-theme="dark"] {
    --black: #FFFFFF;
    --white: #1a1a1a;
    --off-white: #0a0a0a;
    --grey-light: #2a2a2a;
    --grey-mid: #999999;
    --text-dark: #e5e5e5;
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

## Key Changes Explained

1. **Removed nested selectors** - Dark mode variables now only target `:root`, not nested elements like `.footer-cta`
2. **Fixed variable names** - `--black` and `--white` swap properly now
3. **Simplified image selectors** - Removed conflicting rules

## What NOT to Change
- Keep all the existing light mode CSS
- Keep the breadcrumbs styles
- Keep the hero, article-body, and footer sections
- Keep the responsive media queries

## Test After Implementation
1. Toggle to dark mode - text should be light on dark background
2. Toggle to light mode - text should be dark on light background  
3. Check that images swap between light/dark variants
4. Verify footer CTA maintains contrast in both modes

That's it - just replace those two CSS blocks and the text legibility issue will be fixed!
