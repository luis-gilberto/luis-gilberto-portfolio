# Floating Shapes Depth System - Quick Reference Card

## 🎨 Layer Overview

```
                    FRONT → BACK
┌────────────────────────────────────────────────────┐
│                                                    │
│  Layer 3: FOREGROUND (Main Constellation)         │
│  ▸ z-index: 2                                     │
│  ▸ Opacity: 0.18-0.22                            │
│  ▸ Blur: 0.5px                                    │
│  ▸ Animation: 32-40s                              │
│  ▸ Size: clamp(32-88px)                           │
│  ▸ 4 shapes: Compass, Atom, Telescope, Queen      │
│                                                    │
├────────────────────────────────────────────────────┤
│                                                    │
│  Layer 2: MID BACKGROUND (Supporting)             │
│  ▸ z-index: 1                                     │
│  ▸ Opacity: 0.12                                  │
│  ▸ Blur: 1px                                      │
│  ▸ Animation: 42-44s                              │
│  ▸ Size: clamp(32-56px)                           │
│  ▸ 2 shapes: Atom, Telescope                      │
│                                                    │
├────────────────────────────────────────────────────┤
│                                                    │
│  Layer 1: FAR BACKGROUND (Distant Stars)          │
│  ▸ z-index: 0                                     │
│  ▸ Opacity: 0.06                                  │
│  ▸ Blur: 2px                                      │
│  ▸ Animation: 48-50s                              │
│  ▸ Size: clamp(26-48px)                           │
│  ▸ 2 shapes: Compass, Queen                       │
│                                                    │
└────────────────────────────────────────────────────┘
```

## 📍 Spatial Layout (Desktop)

```
┌──────────────────────────────────────────────┐
│                    HERO                       │
│                                               │
│  Compass-FAR         [Badge]      Queen-FAR  │
│  (8%, 18%)                        (65%, R12%)│
│                                               │
│         Atom-MID                              │
│         (22%, 28%)                            │
│                                               │
│  Compass-FRONT    [TITLE]    Atom-FRONT      │
│  (38%, 12%)                  (28%, R22%)     │
│                                               │
│              [Description]                    │
│                                               │
│                 [CTAs]                        │
│                                               │
│  Telescope-FRONT           Telescope-MID     │
│  (B12%, 20%)               (B22%, R25%)      │
│                                               │
│       Queen-FRONT        [Stats]             │
│       (B15%, R18%)                            │
│                                               │
└──────────────────────────────────────────────┘

Legend:
- Numbers in (Y, X) or (Y, RX%) where R = right-aligned
- B = bottom-aligned
- FRONT/MID/FAR = depth layer
```

## 🎭 Shape Distribution

### Coral Shapes (Warm Energy) 🔴
```
Far:    Compass
Mid:    Telescope
Front:  Compass + Telescope
```

### Teal Shapes (Cool Analytical) 🔵
```
Far:    Queen
Mid:    Atom
Front:  Atom + Queen
```

**Balance**: 4 coral, 4 teal (perfect 50/50)

## ⚡ Animation Types

### Continuous Rotation (360°)
- **Compass** shapes → Constant exploration
- **Telescope** shapes → Scanning/discovery

### Pendulum (180° swing)
- **Atom** shapes → Oscillating energy
- **Queen** shapes → Strategic movement

## 🎚️ Opacity Scale

```
0.06 ━━━━━━━━━━━━━━━━━━━━━━━━ Far Background
     (barely visible)

0.12 ━━━━━━━━━━━━━━━━━━━━━━━━ Mid Background
     (soft presence)

0.18-0.22 ━━━━━━━━━━━━━━━━━━ Foreground
          (main constellation)
```

## 🎯 Z-Index Stack

```
z-index: 3  ▸ Hero Title, CTAs (always on top)
            │
z-index: 2  ▸ Badge, Stats + FOREGROUND shapes
            │ ⚠️ Some shapes appear BEHIND badge/stats
z-index: 1  ▸ MID BACKGROUND shapes
            │
z-index: 0  ▸ FAR BACKGROUND shapes
            │
            ▼ Hero gradient background
```

## 🔧 Quick Adjustments

### Make Shape More Distant:
```css
opacity: 0.04-0.06;
filter: blur(2-3px) saturate(0.6-0.7);
animation: ...50-60s...;
```

### Make Shape Closer:
```css
opacity: 0.20-0.25;
filter: blur(0-0.3px) saturate(0.95-1.0);
animation: ...25-30s...;
```

### Add New Far Shape:
```css
.shape-newshape-far {
    z-index: 0;
    opacity: 0.06;
    top: 45%; left: 60%;
    width: clamp(28px, 4vw, 48px);
    animation: shapePendulum 52s ... infinite;
    filter: blur(2px) saturate(0.7);
}
```

## 📱 Mobile Overrides

```css
@media (max-width: 768px) {
    .depth-far { opacity: 0.05; }
    .depth-mid { opacity: 0.10; }
    .depth-front { opacity: 0.15; }
}
```

## ✨ Hover Effect

```
Before Hover → On Hover
─────────────────────────
Far:   0.06 → 0.09
Mid:   0.12 → 0.15
Front: 0.18 → 0.22
```

## ⏱️ Animation Speeds Reference

```
SLOW (Distant)  ━━ 48-52s
MEDIUM          ━━ 40-46s  
FAST (Close)    ━━ 30-40s
```

**Rule**: Slower = Further away (depth cue)

## 🎨 Color Glow Reference

```css
/* Coral shapes */
filter: drop-shadow(0 Xpx Ypx rgba(249, 111, 110, Z));

/* Teal shapes */
filter: drop-shadow(0 Xpx Ypx rgba(46, 211, 198, Z));
```

Where:
- X = vertical offset (2-8px)
- Y = blur radius (8-20px)
- Z = opacity (0.08-0.22)

## 🚀 Performance Tips

✅ Uses `transform` and `opacity` only (GPU-accelerated)
✅ `will-change: transform, opacity` for smooth animations
✅ `backface-visibility: hidden` prevents flicker
✅ Respects `prefers-reduced-motion`

## 🎯 Best Practices Checklist

- [ ] Total shapes: 8-12 (current: 8 ✓)
- [ ] Color balance: 50/50 coral/teal ✓
- [ ] Animation variety: Mix rotation + pendulum ✓
- [ ] No shapes in center 60% vertically ✓
- [ ] Mobile opacity reduced ✓
- [ ] Reduced motion support ✓
- [ ] z-index layering correct ✓

---

## 🎨 CSS Class Reference

```html
<!-- Far Background -->
<img class="shape coral depth-far shape-compass-far" ... />

<!-- Mid Background -->
<img class="shape teal depth-mid shape-atom-mid" ... />

<!-- Foreground -->
<img class="shape coral depth-front shape-telescope" ... />
```

**Class Structure**: `.shape` + `.color` + `.depth-layer` + `.shape-name`

---

## 📊 Summary Stats

- **Total Shapes**: 8 (4 front + 2 mid + 2 far)
- **Layers**: 3 distinct depth levels
- **Opacity Range**: 0.06 to 0.22 (367% variation)
- **Size Range**: 26px to 88px (338% variation)
- **Animation Range**: 32s to 50s (156% variation)
- **Color Split**: 50% coral, 50% teal
- **Z-Index Range**: 0 to 3 (4 levels)

---

**Last Updated**: Based on thehub-index-enhanced-depth.html
**Version**: 1.0 - Multi-Layer Constellation System
