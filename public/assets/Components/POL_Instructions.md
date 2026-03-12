# Prompt for Trae: Update "Proof of Life" Article Images

## Task
Replace the temporary Imgur URLs in the "Proof of Life" article with the final image paths from the insights assets folder.

## Image File Locations
All images are located in: `/insights/assets/images/POL/`

## Image Replacements Needed

### 1. Hero Image
**Current:** `https://i.imgur.com/ld88HSo.png`
**Replace with:** `/insights/assets/images/POL/POL_Hero.jpg`
**Dark variant:** `/insights/assets/images/POL/POL_Hero_dark.jpg`

### 2. Decorative Break 1
**Current:** `https://i.imgur.com/Qe74JAj.png`
**Replace with:** `/insights/assets/images/POL/decorative-break-1.jpg`

### 3. Decorative Break 2
**Current:** `https://i.imgur.com/afRDt7p.png`
**Replace with:** `/insights/assets/images/POL/decorative-break-2.jpg`

### 4. Decorative Break 3
**Current:** `https://i.imgur.com/uVX9p8A.png`
**Replace with:** `/insights/assets/images/POL/decorative-break-3.jpg`

### 5. Decorative Break 4
**Current:** `https://i.imgur.com/e6Srmqs.png`
**Replace with:** `/insights/assets/images/POL/decorative-break-4.jpg`

## Dark Mode Images
The CSS already includes dark mode support that automatically switches to dark variants:
- `POL_Hero_dark.jpg` (for hero image)
- `decorative-break-1_dark.jpg`
- `decorative-break-2_dark.jpg`
- `decorative-break-3_dark.jpg`
- `decorative-break-4_dark.jpg`

These are triggered via `@media (prefers-color-scheme: dark)` in the CSS.

## File to Update
`proof-of-life-final.html`

## Verification
After updating, verify:
1. All images load correctly in light mode
2. Dark mode variants appear when system is set to dark mode
3. Breadcrumbs navigation links work properly
4. Article is accessible at `/insights/proof-of-life/`

## Additional Notes
- All images including the hero now have dark variants
- The hero image switches to POL_Hero_dark.jpg in dark mode
- All decorative breaks have both light and dark versions
- Image paths are relative to the insights section root with POL subfolder
- Maintain the existing alt text for accessibility
