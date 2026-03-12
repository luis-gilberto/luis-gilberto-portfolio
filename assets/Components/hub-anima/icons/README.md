# Luis Gilberto Icon Library

Complete set of SVG icons for the Luis Gilberto ecosystem.

## 📁 Icon Files

### Main Navigation Icons (40x40px)
- `portfolio-folder.svg` - Portfolio section (Coral)
- `hub-grid.svg` - The Hub section (Teal)
- `insights-lightbulb.svg` - Insights section (Coral)
- `portal-external-link.svg` - The Portal section (Coral)

### Card Icons (32x32px)
- `timeline-clock.svg` - Timeline card (Coral)
- `about-user.svg` - About Me card (Teal)
- `resume-document.svg` - Resume card (Coral)
- `brand-star.svg` - Brand Guidelines card (Coral)

## 🎨 Color Palette

- **Coral:** `#F96F6E` / `hsl(1, 95%, 70%)` / `rgb(249, 111, 110)`
- **Teal:** `#2ED3C6` / `hsl(174, 71%, 51%)` / `rgb(46, 211, 198)`

## 📐 Specifications

- **Style:** Outline (stroke-based)
- **Stroke Width:** 1.5px (cards), 1.8px (navigation)
- **Stroke Caps:** Rounded
- **Stroke Joins:** Rounded
- **ViewBox:** 0 0 24 24 (scalable)
- **Format:** SVG (vector, infinitely scalable)

## 💡 Usage Examples

### HTML (Inline)
```html
<svg width="40" height="40" viewBox="0 0 24 24" fill="none">
  <path d="..." stroke="#F96F6E" stroke-width="1.8"/>
</svg>
```

### HTML (External File)
```html
<img src="icons/portfolio-folder.svg" alt="Portfolio" width="40" height="40">
```

### CSS (Background)
```css
.icon-portfolio {
  background-image: url('icons/portfolio-folder.svg');
  width: 40px;
  height: 40px;
}
```

### React/JSX
```jsx
import PortfolioIcon from './icons/portfolio-folder.svg';

<img src={PortfolioIcon} alt="Portfolio" />
```

## 🎯 Use Cases

### Web
- Navigation menus
- Card headers
- Button icons
- Feature highlights

### Print/Marketing
- Business cards
- Presentations
- Brochures
- Social media graphics

### Export Sizes
- **Small:** 24x24px (UI elements)
- **Medium:** 40x40px (cards, navigation)
- **Large:** 80x80px (hero sections)
- **Print:** 512x512px @ 300 DPI

## 🔄 Color Variations

To change colors, simply update the `stroke` attribute:

```svg
<!-- White version (for dark backgrounds) -->
<path stroke="#FFFFFF" ... />

<!-- Black version (for light backgrounds) -->
<path stroke="#2A2A2A" ... />

<!-- Dynamic color (inherits from CSS) -->
<path stroke="currentColor" ... />
```

## ♿ Accessibility

All icons include:
- Semantic naming
- Proper viewBox for scaling
- Rounded caps/joins for clarity
- High contrast colors (WCAG AA compliant)

## 📦 File Formats Available

- ✅ SVG (vector, web-ready)
- ✅ PNG (raster, multiple sizes on request)
- ✅ PDF (print-ready on request)

---

**Need different sizes or colors?** These SVG files are infinitely scalable and can be easily customized!
