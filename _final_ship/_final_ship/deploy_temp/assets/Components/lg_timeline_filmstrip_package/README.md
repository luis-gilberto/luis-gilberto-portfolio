# Luis Gilberto — Timeline Filmstrip (Desktop-first)

This package contains a **one-row, horizontal filmstrip** timeline for desktop that reuses your existing images and your modal data model. Mobile can continue using the vertical stack you already have.

## Files
```
/index.html                -> Demo page wired to CSS/JS below
/css/style.css             -> Styles (variables, filmstrip, modal)
/js/timeline-data.js       -> Your eras, achievements, and brand logos
/js/filmstrip.js           -> Filmstrip behavior + modal bindings
/assets/images/            -> Use your existing images here (see below)
```

## Assets / paths
- Each **card image** points to `assets/images/*.png` matching your current filenames:
  - `Foundations.png`, `timeline-era-2-demo-strategy.png`, `Rewrite.png`, `Pivot.png`, `Rise.png`, `Reinvention.png`
- **Brand logos** (modal “Key Brands”) should be placed as PNG/SVG files in `assets/images/` and referenced in `js/timeline-data.js` (e.g., `brand-windows8.png`).
- **Brands I Supported** (modal) expects a **single composite image** per era (optional). Place files like `brands-supported-foundations.png` in `assets/images/` and reference in `timeline-data.js`. If you don’t want that section for an era, delete the `brandsSupported` block for that era.

## How Trae should integrate
1. **Copy** this folder into your site’s codebase (e.g., `/timeline/filmstrip/`), or merge the pieces into your existing Timeline page.
2. **Wire desktop only:** Replace your desktop timeline block with the filmstrip markup from `index.html` (the `<section class="timeline-section">` inner desktop part). Leave your existing `.timeline-mobile` as-is.
3. **Include CSS/JS:**
   - Add `<link rel="stylesheet" href="/timeline/filmstrip/css/style.css">` to the page head (adjust path to where you place it).
   - Add these before `</body>`:
     ```html
     <script src="/timeline/filmstrip/js/timeline-data.js"></script>
     <script src="/timeline/filmstrip/js/filmstrip.js"></script>
     ```
4. **Images:** Ensure the card images and brand logos live in `/timeline/filmstrip/assets/images/` **or** adjust the paths in `index.html` and `timeline-data.js` to your existing `/assets/images/` directory. The component does not require renaming—paths are the only thing that matter.
5. **Modal content:** `timeline-data.js` mirrors your current structure. Paste your **final copy**, links, and real logo paths there. The logic will render it automatically.
6. **Accessibility:** The track is focusable (`tabindex="0"`) and supports Left/Right keys. Arrows have `aria-label`s.

## Optional enhancements
- Center magnify (scale the centered card), mini-map dots, or infinite wrap can be added in `filmstrip.js` with small extensions.

## Notes
- No external frameworks required; only Font Awesome for arrow icons (optional).
- The component is self-contained; CSS selectors are namespaced to avoid conflicts.
