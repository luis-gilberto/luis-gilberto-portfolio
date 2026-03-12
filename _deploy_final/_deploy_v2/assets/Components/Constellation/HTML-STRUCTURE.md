# HTML Structure for Multi-Layer Depth Constellation System

## Replace Your Existing Floating Shapes HTML

### Current Structure (Your Original):
```html
<div class="floating-shapes" aria-hidden="true">
    <img src="/TheHub/assets/icons/floating-shapes/compass_rose_coral.png" class="shape coral shape-compass" alt="" />
    <img src="/TheHub/assets/icons/floating-shapes/atom_model_teal.png" class="shape teal shape-atom" alt="" />
    <img src="/TheHub/assets/icons/floating-shapes/telescope_coral.png" class="shape coral shape-telescope" alt="" />
    <img src="/TheHub/assets/icons/floating-shapes/chess_queen_teal.png" class="shape teal shape-queen" alt="" />
</div>
```

### New Structure (Multi-Layer System):
```html
<!-- Ambient Floating Shapes (multi-layer depth constellation) -->
<div class="floating-shapes" aria-hidden="true">
    
    <!-- ============================================
         DEPTH LAYER 1: FAR BACKGROUND
         Barely visible, like distant stars
         ============================================ -->
    <img src="/TheHub/assets/icons/floating-shapes/compass_rose_coral.png" 
         class="shape coral depth-far shape-compass-far" 
         alt="" />
    
    <img src="/TheHub/assets/icons/floating-shapes/chess_queen_teal.png" 
         class="shape teal depth-far shape-queen-far" 
         alt="" />
    
    <!-- ============================================
         DEPTH LAYER 2: MID BACKGROUND
         Soft presence, supporting layer
         ============================================ -->
    <img src="/TheHub/assets/icons/floating-shapes/atom_model_teal.png" 
         class="shape teal depth-mid shape-atom-mid" 
         alt="" />
    
    <img src="/TheHub/assets/icons/floating-shapes/telescope_coral.png" 
         class="shape coral depth-mid shape-telescope-mid" 
         alt="" />
    
    <!-- ============================================
         DEPTH LAYER 3: FOREGROUND
         Main constellation - behind some UI elements
         ============================================ -->
    <img src="/TheHub/assets/icons/floating-shapes/compass_rose_coral.png" 
         class="shape coral depth-front shape-compass" 
         alt="" />
    
    <img src="/TheHub/assets/icons/floating-shapes/atom_model_teal.png" 
         class="shape teal depth-front shape-atom" 
         alt="" />
    
    <img src="/TheHub/assets/icons/floating-shapes/telescope_coral.png" 
         class="shape coral depth-front shape-telescope" 
         alt="" />
    
    <img src="/TheHub/assets/icons/floating-shapes/chess_queen_teal.png" 
         class="shape teal depth-front shape-queen" 
         alt="" />
    
</div>
```

## Complete Hero Section Example

Here's how your complete hero section should look:

```html
<section class="hero" id="home">
    
    <!-- Multi-Layer Depth Constellation -->
    <div class="floating-shapes" aria-hidden="true">
        <!-- Far Background Layer -->
        <img src="/TheHub/assets/icons/floating-shapes/compass_rose_coral.png" 
             class="shape coral depth-far shape-compass-far" alt="" />
        <img src="/TheHub/assets/icons/floating-shapes/chess_queen_teal.png" 
             class="shape teal depth-far shape-queen-far" alt="" />
        
        <!-- Mid Background Layer -->
        <img src="/TheHub/assets/icons/floating-shapes/atom_model_teal.png" 
             class="shape teal depth-mid shape-atom-mid" alt="" />
        <img src="/TheHub/assets/icons/floating-shapes/telescope_coral.png" 
             class="shape coral depth-mid shape-telescope-mid" alt="" />
        
        <!-- Foreground Layer -->
        <img src="/TheHub/assets/icons/floating-shapes/compass_rose_coral.png" 
             class="shape coral depth-front shape-compass" alt="" />
        <img src="/TheHub/assets/icons/floating-shapes/atom_model_teal.png" 
             class="shape teal depth-front shape-atom" alt="" />
        <img src="/TheHub/assets/icons/floating-shapes/telescope_coral.png" 
             class="shape coral depth-front shape-telescope" alt="" />
        <img src="/TheHub/assets/icons/floating-shapes/chess_queen_teal.png" 
             class="shape teal depth-front shape-queen" alt="" />
    </div>

    <!-- Hero Content -->
    <div class="hero-content">
        <div class="hero-badge">
            <span class="badge-dot"></span>
            <span>Available for select projects</span>
        </div>
        
        <h1 class="hero-title">
            <span class="title-line">The <span class="gradient-text">Hub</span></span>
        </h1>
        
        <p class="hero-description">
            Four services, one system. Strategic marketing leadership meets creative excellence.
        </p>

        <div class="hero-cta-group">
            <a href="#" class="btn btn-primary">
                <span>Start a Project</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="round"/>
                </svg>
            </a>
            <a href="#" class="btn btn-secondary">
                <span>Explore Services</span>
            </a>
        </div>
    </div>

    <!-- Hero Stats -->
    <div class="hero-stats">
        <div class="stat-item">
            <span class="stat-number">15+</span>
            <span class="stat-label">Years Experience</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
            <span class="stat-number">20+</span>
            <span class="stat-label">Brands Elevated</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
            <span class="stat-number">300%</span>
            <span class="stat-label">Avg Growth</span>
        </div>
    </div>
    
</section>
```

## Class Structure Breakdown

### Each shape needs 4 classes:

1. **`.shape`** - Base shape styling (required for all)
2. **`.coral` or `.teal`** - Color designation
3. **`.depth-far`, `.depth-mid`, or `.depth-front`** - Depth layer
4. **`.shape-{name}`** - Specific shape identifier (for positioning)

### Examples:
```html
<!-- Far background compass -->
<img class="shape coral depth-far shape-compass-far" ... />

<!-- Mid background atom -->
<img class="shape teal depth-mid shape-atom-mid" ... />

<!-- Foreground telescope -->
<img class="shape coral depth-front shape-telescope" ... />
```

## Shape Naming Convention

| Layer | Shape | Color | Class Name |
|-------|-------|-------|------------|
| Far | Compass | Coral | `shape-compass-far` |
| Far | Queen | Teal | `shape-queen-far` |
| Mid | Atom | Teal | `shape-atom-mid` |
| Mid | Telescope | Coral | `shape-telescope-mid` |
| Front | Compass | Coral | `shape-compass` |
| Front | Atom | Teal | `shape-atom` |
| Front | Telescope | Coral | `shape-telescope` |
| Front | Queen | Teal | `shape-queen` |

## Order Matters! 

Shapes should be in this order in HTML:
1. Far background shapes first
2. Mid background shapes second
3. Foreground shapes last

This ensures proper z-index layering even without explicit z-index values.

## Adding Custom Shapes

To add a new far background shape:

```html
<!-- Add to Far Background section -->
<img src="/path/to/new-shape.png" 
     class="shape coral depth-far shape-newshape-far" 
     alt="" />
```

Then add corresponding CSS (see depth-system-css-only.css):
```css
.shape-newshape-far {
    top: 45%;
    left: 50%;
    width: clamp(28px, 4vw, 48px);
    animation: shapePendulum 52s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
}
```

## Important Notes

1. **aria-hidden="true"** - All shapes are decorative, hidden from screen readers
2. **Empty alt attributes** - Required for validation, but hidden from assistive tech
3. **Order in HTML** - Determines paint order (first painted = furthest back)
4. **Image paths** - Update `/TheHub/assets/icons/floating-shapes/` to match your structure

## Quick Implementation Steps

1. **Backup** your current HTML
2. **Find** the existing `.floating-shapes` div in your code
3. **Replace** the entire div and its contents with the new structure above
4. **Add** the new CSS from `depth-system-css-only.css`
5. **Test** on desktop and mobile
6. **Adjust** positions if needed using the quick reference guide

## Troubleshooting

**Shapes not visible?**
- Check image paths are correct
- Verify CSS is loaded after base styles
- Check browser console for errors

**Shapes appear flat (no depth)?**
- Ensure all class names are correct (depth-far, depth-mid, depth-front)
- Check opacity values in CSS
- Verify blur filters are working (some old browsers don't support)

**Shapes in wrong positions?**
- Review position values in CSS
- Check that parent `.hero` has `position: relative`
- Verify viewport units are working

**Animations not smooth?**
- Check `will-change` property is present
- Verify GPU acceleration is working
- Test in different browsers

---

## That's It!

Copy the new HTML structure into your page, add the CSS, and you'll have the full multi-layer depth constellation system running. 

See `README.md` for the complete implementation guide!
