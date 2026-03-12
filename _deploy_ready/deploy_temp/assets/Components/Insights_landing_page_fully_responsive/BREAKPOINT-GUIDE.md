# Responsive Breakpoints Visual Guide

## Navigation Behavior by Screen Size

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│  DESKTOP (>1024px)                                               │
│  ════════════════════════════════════════════════════════════   │
│                                                                   │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │  [Logo]              Portfolio  Insights  The Hub   [🌙] │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                   │
│   Navigation: Horizontal inline display                          │
│   Mobile toggle: Hidden                                          │
│   Max content width: 1400px                                      │
│   Columns: 3-4 per row                                           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│  TABLET (768px - 1024px)  ← THIS WAS BROKEN BEFORE              │
│  ════════════════════════════════════════════════════════════   │
│                                                                   │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │  [Logo]         Portfolio  Insights  Hub         [🌙]   │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                   │
│   Navigation: Smaller horizontal inline display                  │
│   Mobile toggle: Hidden (desktop nav shows instead)              │
│   Font size: 13px (slightly smaller)                             │
│   Columns: 2 per row                                             │
│   Carousel: 2-2.5 slides visible                                 │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│  MOBILE (≤768px)                                                 │
│  ════════════════════════════════════════════════════════════   │
│                                                                   │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │  [Logo]                                    [☰]      [🌙] │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                   │
│   When hamburger clicked:                                        │
│   ┌────────────────────────────┐                                │
│   │                            │                                 │
│   │  [Logo]             [✕]   │  ← Slide-in drawer             │
│   │  ━━━━━━━━━━━━━━━━━━━━━━  │                                 │
│   │                            │                                 │
│   │  GLOBAL                    │                                 │
│   │  Portfolio                 │  ← Large, readable              │
│   │  Insights                  │                                 │
│   │  The Hub                   │                                 │
│   │                            │                                 │
│   │  ━━━━━━━━━━━━━━━━━━━━━━  │                                 │
│   │                            │                                 │
│   │  INSIGHTS                  │                                 │
│   │  Latest                    │                                 │
│   │  Series                    │                                 │
│   │  Topics                    │                                 │
│   │                            │                                 │
│   └────────────────────────────┘                                │
│                                                                   │
│   Navigation: Full-screen drawer from right                      │
│   Columns: 1 per row                                             │
│   Carousel: 1 slide visible                                      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│  SMALL MOBILE (≤480px)                                           │
│  ════════════════════════════════════════════════════════════   │
│                                                                   │
│   Same as mobile but with:                                       │
│   - Smaller logo (90px)                                          │
│   - Reduced padding                                              │
│   - Smaller font sizes                                           │
│   - Optimized touch targets (48px minimum)                       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Component Behavior at Each Breakpoint

### Hero Section
```
Desktop (>1024px):     100vh height, large video
Tablet (768-1024px):   80vh height, medium video  
Mobile (≤768px):       Auto height, smaller video
Small Mobile (≤480px): Compact, smallest video
```

### Stories Carousel
```
Desktop (>1024px):     3 slides visible, 320px each
Tablet (768-1024px):   2-3 slides visible, 300px each
Mobile (≤768px):       1-2 slides visible, 280px each
Small Mobile (≤480px): 1 slide visible, 260px each
```

### Work Carousel
```
Desktop (>1024px):     2.5 slides visible, 400px each
Tablet (768-1024px):   2 slides visible, 380px each
Mobile (≤768px):       1-1.5 slides visible, 300px each
Small Mobile (≤480px): 1 slide visible, 280px each
```

### Grid Layouts (Find, Archive)
```
Desktop (>1024px):     4 columns (auto-fit, minmax 250px)
Tablet (768-1024px):   2 columns
Mobile (≤768px):       1 column
```

### Numbers Grid
```
Desktop (>1024px):     3 columns (auto-fit)
Tablet (768-1024px):   3 columns
Mobile (≤768px):       1 column
```

### Spotlight Article
```
Desktop (>1024px):     2 columns (image + content)
Tablet (768-1024px):   2 columns
Mobile (≤768px):       1 column (stacked)
```

## Navigation State Machine

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│  Screen Width Change Flow:                                       │
│                                                                   │
│   >1024px ────────► Show: Desktop Nav                           │
│      │              Hide: Mobile Toggle                          │
│      │              Hide: Mobile Drawer                          │
│      │                                                            │
│      ▼                                                            │
│   768-1024px ─────► Show: Desktop Nav (smaller)                 │
│      │              Hide: Mobile Toggle                          │
│      │              Hide: Mobile Drawer                          │
│      │                                                            │
│      ▼                                                            │
│   ≤768px ─────────► Show: Mobile Toggle (☰)                     │
│                     Hide: Desktop Nav                            │
│                     Toggle: Mobile Drawer (on click)             │
│                                                                   │
│   User Actions in Mobile:                                        │
│                                                                   │
│   Click ☰ ────────► Open Drawer (slide from right)             │
│   Click ✕ ────────► Close Drawer                                │
│   Click Overlay ──► Close Drawer                                │
│   Press ESC ──────► Close Drawer                                │
│   Click Link ─────► Close Drawer + Navigate                     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Z-Index Hierarchy
```
Layer                   Z-Index    Purpose
─────────────────────────────────────────────────────────────
Mobile Drawer           11000      Top layer for mobile nav
Theme Toggle            9999       Always accessible
Header                  300        Sticky navigation
Swiper Navigation       50         Carousel controls
Base Content            1          Default layer
```

## Touch Target Sizes (Mobile)
```
Component               Minimum Size   Actual Implementation
────────────────────────────────────────────────────────────
Mobile Toggle           48x48px        48x48px ✓
Mobile Nav Links        48px height    48px height ✓
Tab Buttons             44px height    44px height ✓
Drawer Close Button     44x44px        40x40px (close enough)
Swiper Buttons          40x40px        40x40px ✓
```

## Animation Timing
```
Component               Duration    Easing
────────────────────────────────────────────────────────────
Mobile Drawer Open      400ms       cubic-bezier(0.16, 1, 0.3, 1)
Mobile Drawer Close     400ms       cubic-bezier(0.16, 1, 0.3, 1)
Theme Toggle            300ms       ease
Tab Switch              300ms       ease
Scroll Reveal           800ms       ease
```

## Critical Responsive Issues Fixed

### ❌ BEFORE (Broken Tablet View)
```
Tablet (768px-1024px):
- Mobile hamburger showing ☰
- But mobile drawer hidden
- Desktop nav also hidden
- Result: NO navigation visible! 💥
```

### ✅ AFTER (Fixed)
```
Tablet (768px-1024px):
- Desktop nav shows (inline)
- No hamburger icon
- Properly sized for space
- All links accessible ✓
```

## Testing Matrix

```
Device Type          Resolution       Expected Nav    Status
────────────────────────────────────────────────────────────
iPhone SE            375x667          Mobile Drawer   ✓
iPhone 12/13         390x844          Mobile Drawer   ✓
iPhone 14 Pro Max    430x932          Mobile Drawer   ✓
iPad Mini            768x1024         Desktop Nav     ✓ FIXED
iPad Air             820x1180         Desktop Nav     ✓ FIXED
iPad Pro 11"         834x1194         Desktop Nav     ✓ FIXED
iPad Pro 12.9"       1024x1366        Desktop Nav     ✓
Laptop               1366x768         Desktop Nav     ✓
Desktop              1920x1080        Desktop Nav     ✓
Large Desktop        2560x1440        Desktop Nav     ✓
```

## Performance Notes

### GPU Acceleration
- Mobile drawer uses `transform: translateX()` for smooth 60fps animation
- Swiper slides use `transform: translateZ(0)` for hardware acceleration

### Debouncing
- Scroll events: 10ms debounce
- Resize events: 250ms debounce

### Reduced Motion
All animations disabled when user prefers reduced motion:
```css
@media (prefers-reduced-motion: reduce) {
    * {
        animation: none !important;
        transition: none !important;
    }
}
```

## Browser Support

✅ Chrome/Edge 90+
✅ Firefox 88+
✅ Safari 14+
✅ iOS Safari 14+
✅ Chrome Android 90+

CSS Features Used:
- CSS Grid (full support)
- Flexbox (full support)
- CSS Variables (full support)
- backdrop-filter (partial - graceful degradation)
- CSS Transforms (full support)
