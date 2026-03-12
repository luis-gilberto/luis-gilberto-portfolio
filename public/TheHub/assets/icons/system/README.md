# Hub Icon System - Usage Guidelines

## The Four Arms Icon Map

| ARM | ICON | COLOR | FILE | NEVER USE |
|-----|------|-------|------|-----------|
| **StrategyIQ** | Telescope | Coral | `telescope_coral.png` | Compass, Atom, Queen |
| **Advisory** | Compass Rose | Coral | `compass_rose_coral.png` | Telescope, Atom, Queen |
| **Studio** | Atom Model | Teal | `atom_model_teal.png` | Telescope, Compass, Queen |
| **Portal** | Chess Queen | Teal | `chess_queen_teal.png` | Telescope, Compass, Atom |

## Sacred Rules

### 1. NEVER Swap Icons
❌ **WRONG:** Using telescope for Advisory  
✅ **RIGHT:** Using compass rose for Advisory

### 2. NEVER Change Colors
❌ **WRONG:** `telescope_teal.png`  
✅ **RIGHT:** `telescope_coral.png`

### 3. ALWAYS Use Full Paths
❌ **WRONG:** `../../icons/telescope.png`  
✅ **RIGHT:** `/TheHub/assets/icons/arms/strategyiq/telescope_coral.png`

### 4. ALWAYS Include Alt Text
❌ **WRONG:** `<img src="..." alt="">`  
✅ **RIGHT:** `<img src="..." alt="StrategyIQ">`

## Where Each Icon Appears

### Telescope (StrategyIQ)
- StrategyIQ landing page hero
- Hub homepage Card 01 (Architecture grid)
- Hub homepage Flow Step 1
- All StrategyIQ marketing materials
- Assessment report covers
- Strategic brief templates

### Compass Rose (Advisory)
- Advisory landing page hero
- Hub homepage Card 02 (Architecture grid)
- Hub homepage Flow Step 2
- All Advisory marketing materials
- Consultation proposals
- Leadership alignment docs

### Atom Model (Studio)
- IMC Services landing page
- Hub homepage Card 03 (Architecture grid)
- Hub homepage Flow Step 3
- All Studio marketing materials
- Creative briefs
- Production deliverables

### Chess Queen (Portal)
- Portal login page
- Hub homepage Card 04 (Architecture grid)
- Hub homepage Flow Step 4 (highlighted with teal border)
- Portal interface elements
- Project dashboards
- Client communications

## Implementation Checklist

When adding icons to a new page:

- [ ] Import `/TheHub/assets/css/icon-system.css`
- [ ] Use component from `icon-components.html`
- [ ] Verify correct icon for the arm
- [ ] Verify correct color (coral or teal)
- [ ] Include proper alt text
- [ ] Test on mobile (should scale proportionally)
- [ ] Test in light/dark modes

## Color Psychology

**Coral (#F96F6E) - Strategy Arms**
- StrategyIQ: "We look ahead" (Telescope)
- Advisory: "We guide direction" (Compass)
- Represents: Vision, leadership, expertise

**Teal (#2ED3C6) - Execution Arms**
- Studio: "We build" (Atom - building blocks)
- Portal: "We manage" (Queen - command center)
- Represents: Action, creation, implementation

## File Naming Convention

```
[symbol]_[color].png
[symbol]_[color]@2x.png (retina)
[symbol]_[color].svg (vector)

Examples:
telescope_coral.png
telescope_coral@2x.png
telescope_coral.svg
```

## When to Add New Icons

Only add icons if creating a NEW service arm. Current four arms are complete.

If adding new services UNDER existing arms, continue using parent arm's icon.

Example:
- "StrategyIQ Pro" → Still uses telescope
- "Advisory Plus" → Still uses compass rose

## Deprecated Icons

Icons in `/deprecated/` folder should NEVER be used. They are kept only for historical reference.

## Support

Questions about icon usage? Check:
1. This README
2. `/TheHub/assets/icons/system/manifest.json`
3. `/TheHub/assets/components/icon-components.html`

Still unsure? Default to the manifest.json mapping - that file is LAW.
