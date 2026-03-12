# Hub Reveal Animation - Visual Reference

## Screen Layout After Animation

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                                                             │
│    🧭 COMPASS (CORAL)              ⚛️ ATOM (TEAL)          │
│    Advisory                        IMC Services            │
│    TOP-LEFT (12%, 12%)             TOP-RIGHT (12%, 88%)    │
│    compass_rose_coral.png          atom_model_teal.png     │
│    .service-advisory               .service-imc            │
│                                                             │
│                                                             │
│                  ╔════════════════╗                         │
│                  ║                ║                         │
│                  ║   THE HUB      ║                         │
│                  ║   (Main        ║                         │
│                  ║   Content)     ║                         │
│                  ║                ║                         │
│                  ╚════════════════╝                         │
│                                                             │
│                                                             │
│    🔭 TELESCOPE (CORAL)            ♛ CHESS QUEEN (TEAL)    │
│    ScopeIQ                         StrategyIQ              │
│    BOTTOM-LEFT (88%, 12%)          BOTTOM-RIGHT (88%, 88%) │
│    telescope_coral.png             chess_queen_teal.png    │
│    .service-scope                  .service-strategy       │
│                                                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Animation Sequence

```
TIME    EVENT
────────────────────────────────────────────────────────────
0.0s    Video ends (two nested coral rectangles visible)
        
0.2s    ┌──────────────────┐
        │ Rectangles start │  ← Energy burst begins
        │ expanding        │
        └──────────────────┘
        
0.5s    ┌──────────────────┐
        │ All 4 images     │  ← Icons emerge from center
        │ emerge from      │     (still at center, scale 0)
        │ center point     │
        └──────────────────┘
        
0.5s    🧭 → Top-Left       ← Advisory/Compass starts flying
        
0.65s   ⚛️ → Top-Right      ← IMC/Atom starts flying
        
0.8s    🔭 → Bottom-Left    ← ScopeIQ/Telescope starts flying
        
0.95s   ♛ → Bottom-Right   ← StrategyIQ/Queen starts flying
        
1.2s    ┌──────────────────┐
        │ Rectangles fade  │  ← Energy dispersed
        └──────────────────┘
        
1.7s    ┌──────────────────┐
        │ All images reach │  ← Icons at final positions
        │ their corners    │     (opacity: 15%)
        └──────────────────┘
        
2.0s    ┌──────────────────┐
        │ Gentle rotation  │  ← 360° / 20 seconds
        │ begins           │
        └──────────────────┘
        
2.5s    ┌──────────────────┐
        │ Main content     │  ← Page content fades in
        │ fades in         │
        └──────────────────┘
```

## Color Coding

**CORAL (#F96F6E):**
- Advisory (Compass) 🧭
- ScopeIQ (Telescope) 🔭

**TEAL (#2ED3C6):**
- IMC Services (Atom) ⚛️
- StrategyIQ (Chess Queen) ♛

## File Paths (Absolute)

```
/TheHub/assets/icons/floating-shapes/
├── compass_rose_coral.png    ← Advisory (Top-Left)
├── atom_model_teal.png        ← IMC Services (Top-Right)
├── telescope_coral.png        ← ScopeIQ (Bottom-Left)
└── chess_queen_teal.png       ← StrategyIQ (Bottom-Right)
```

## CSS Classes & Positions

```css
.service-advisory  { top: 12%; left: 12%; }  /* Compass - Top-Left */
.service-imc       { top: 12%; left: 88%; }  /* Atom - Top-Right */
.service-scope     { top: 88%; left: 12%; }  /* Telescope - Bottom-Left */
.service-strategy  { top: 88%; left: 88%; }  /* Chess Queen - Bottom-Right */
```

## HTML Structure

```html
<div class="hub-reveal-system" id="hubRevealSystem">
    <!-- Energy rectangles -->
    <div class="energy-burst">
        <div class="energy-rect energy-rect-outer"></div>
        <div class="energy-rect energy-rect-inner"></div>
    </div>
    
    <!-- Service icons -->
    <div class="service-image service-advisory">
        <img src="/TheHub/assets/icons/floating-shapes/compass_rose_coral.png">
    </div>
    <div class="service-image service-imc">
        <img src="/TheHub/assets/icons/floating-shapes/atom_model_teal.png">
    </div>
    <div class="service-image service-scope">
        <img src="/TheHub/assets/icons/floating-shapes/telescope_coral.png">
    </div>
    <div class="service-image service-strategy">
        <img src="/TheHub/assets/icons/floating-shapes/chess_queen_teal.png">
    </div>
</div>
```

## Quick Verification

### What You Should See:
✓ Compass icon (🧭) with coral glow in top-left  
✓ Atom icon (⚛️) with teal glow in top-right  
✓ Telescope icon (🔭) with coral glow in bottom-left  
✓ Chess Queen icon (♛) with teal glow in bottom-right  
✓ All icons at 15% opacity (subtle ambient presence)  
✓ Gentle clockwise rotation  
✓ No blur overlay  

### What You Should NOT See:
✗ Placeholder text ("Advisory", "IMC Services", etc.)  
✗ Blurry semi-transparent overlay  
✗ Images in wrong corners  
✗ Images with wrong colors/glows  
✗ Missing images (404 errors)  

## Brand Narrative

**The Story:**
The Hub's coral laser lines complete their journey and form two glowing rectangles. This concentrated energy activates and distributes, with the rectangles expanding like energy releasing from the core. From that released energy emerge the four service pillars, each flying to its corner position where it orbits gently—living, active services ready to engage.

**Visual Metaphor:**
- Center Hub = Energy source / Brand core
- Expanding rectangles = Activation / Distribution  
- Four corners = Service pillars extending from center
- Gentle rotation = Living, evolving services
- Ambient presence (15% opacity) = Always available, never intrusive
