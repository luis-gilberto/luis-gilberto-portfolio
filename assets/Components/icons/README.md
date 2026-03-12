# Luis Gilberto Icon Library

A collection of custom icons representing different sections of the Luis Gilberto portfolio ecosystem.

## 📦 Contents

This library includes 7 icons in multiple formats:

1. **Timeline** - Clock icon representing career journey
2. **About Me** - User icon representing personal story
3. **Resume** - Document icon representing professional experience
4. **Brand Guidelines** - Star icon representing visual DNA
5. **Insights** - Lightbulb/currency icon representing strategic thinking
6. **The Hub** - Grid icon representing productized tools
7. **The Portal** - Lock icon representing exclusive access

## 🎨 Available Formats

### SVG Files (Scalable Vector Graphics)
- **Location:** `dist/icons/*.svg`
- **Usage:** Web, print, any size
- **Benefits:** Infinitely scalable, small file size, CSS customizable

### Color Variations
Each icon is available in the following color schemes:

#### Coral (Primary)
- **Color:** `#F96F6E` / `hsl(1, 95%, 70%)`
- **Usage:** Primary actions, emotional emphasis
- **Files:** `*-coral.svg`

#### Teal (Secondary)
- **Color:** `#2ED3C6` / `hsl(174, 71%, 51%)`
- **Usage:** Innovation, structural elements
- **Files:** `*-teal.svg`

#### White
- **Color:** `#FFFFFF`
- **Usage:** Dark backgrounds, navigation
- **Files:** `*-white.svg`

#### Black
- **Color:** `#2a2a2a`
- **Usage:** Light backgrounds, print
- **Files:** `*-black.svg`

## 📐 Specifications

- **ViewBox:** `0 0 24 24`
- **Stroke Width:** `1.5px`
- **Stroke Linecap:** `round`
- **Stroke Linejoin:** `round`
- **Style:** Outline/stroke-based (no fills)
- **Default Size:** `32x32px` (scalable)

## 💻 Usage Examples

### HTML
```html
<!-- Inline SVG with custom color -->
<svg width="32" height="32" viewBox="0 0 24 24" fill="none">
  <circle cx="12" cy="12" r="10" stroke="#F96F6E" stroke-width="1.5"/>
  <polyline points="12 6 12 12 16 14" stroke="#F96F6E" stroke-width="1.5"/>
</svg>

<!-- As image -->
<img src="icons/timeline.svg" alt="Timeline" width="32" height="32">
```

### CSS
```css
.icon {
  width: 32px;
  height: 32px;
  color: #F96F6E; /* Coral */
}

.icon svg {
  stroke: currentColor;
}
```

### React/JSX
```jsx
import TimelineIcon from './icons/timeline.svg';

function MyComponent() {
  return <TimelineIcon className="icon" />;
}
```

## 🎯 Size Guidelines

### UI Elements
- **Small:** 24px (buttons, inline text)
- **Medium:** 32px (cards, navigation)
- **Large:** 48px (feature highlights)
- **Hero:** 80px (landing sections)

### Print
- **Business Cards:** 0.5 inch (36pt)
- **Brochures:** 1 inch (72pt)
- **Posters:** 2-4 inches (144-288pt)

## 🎨 Color Usage by Context

### Timeline Icon
- **Primary:** Coral (journey, milestones)
- **Alternative:** Black (print, formal)

### About Me Icon
- **Primary:** Teal (human connection)
- **Alternative:** Coral (personal brand)

### Resume Icon
- **Primary:** Deep Blue `#2C3E50` (professional)
- **Alternative:** Black (formal documents)

### Brand Guidelines Icon
- **Primary:** Coral (brand identity)
- **Alternative:** Teal (design systems)

### Insights Icon
- **Primary:** Coral (thought leadership)
- **Alternative:** Black (editorial)

### The Hub Icon
- **Primary:** Teal (systems, structure)
- **Alternative:** Coral (innovation)

### The Portal Icon
- **Primary:** Deep Blue (exclusivity)
- **Alternative:** Teal (access)

## 🔧 Customization

### Changing Colors
Replace `currentColor` or `stroke` attribute:
```svg
<svg stroke="#YOUR_COLOR">
  <!-- icon paths -->
</svg>
```

### Changing Size
Adjust `width` and `height` attributes (viewBox remains `0 0 24 24`):
```svg
<svg width="48" height="48" viewBox="0 0 24 24">
  <!-- icon paths -->
</svg>
```

### Changing Stroke Width
Adjust `stroke-width` for thicker/thinner lines:
```svg
<svg stroke-width="2">  <!-- Thicker -->
<svg stroke-width="1">  <!-- Thinner -->
```

## 📱 Export Settings

### For Web
- Format: SVG
- Optimization: SVGO
- Decimal precision: 2
- Remove metadata: Yes

### For Print
- Format: SVG or PDF
- Resolution: Vector (infinite)
- Color mode: CMYK for print, RGB for digital

### For Social Media
- Format: PNG
- Size: 512x512px (profile icons)
- Size: 1200x1200px (posts)
- Background: Transparent

## 🚀 Integration

### Figma
1. Drag SVG files into Figma
2. Icons will import as vectors
3. Use as components for consistency

### Sketch
1. Import SVG files
2. Convert to symbols
3. Create library for team sharing

### Adobe Illustrator
1. File → Open → Select SVG
2. Icons are fully editable vectors
3. Save as AI for archiving

## 📄 License

These icons are part of the Luis Gilberto brand ecosystem.
© 2025 Luis Gilberto. All rights reserved.

## 🆘 Support

For questions or custom icon requests, contact:
- Email: hello@luisgilberto.com
- Website: luis-gilberto.com

---

**Version:** 1.0.0  
**Last Updated:** 2025  
**Maintained by:** Luis Gilberto Design Team
