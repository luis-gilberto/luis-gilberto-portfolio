# Partnership Toolkit - Asset Requirements & Specifications

## 📋 Asset Overview

This document outlines all required assets for the Partnership Toolkit implementation, including specifications, formats, and usage guidelines.

## 🖼️ Image Assets

### Primary Logo
**File**: `logo-lockup_white_default.svg`
- **Current Source**: CDN hosted
- **Usage**: Header logo, password overlay
- **Format**: SVG (preferred) or PNG
- **Dimensions**: 200x55px (desktop), 120x33px (mobile)
- **Background**: Transparent
- **Color**: White (#FFFFFF)
- **Notes**: Should include both text and symbol elements

### Portrait Image
**File**: `hp-new_1.jpg`
- **Current Source**: CDN hosted
- **Usage**: Hero section profile image
- **Format**: JPG or WebP
- **Dimensions**: 256x256px minimum (displayed at 128x128px)
- **Aspect Ratio**: 1:1 (square)
- **Quality**: High resolution for retina displays
- **Processing**: Grayscale filter applied via CSS
- **Notes**: Professional headshot, well-lit, neutral background

### Scene Logo
**File**: `neon_blue.png`
- **Current Source**: CDN hosted
- **Usage**: Testimonial section
- **Format**: PNG with transparency
- **Dimensions**: 48x48px
- **Background**: Transparent
- **Color**: Neon blue theme
- **Notes**: Company logo for testimonial attribution

## 🏢 Microsoft Product Logos

### Status: **REQUIRED - NOT YET IMPLEMENTED**
Currently showing as text-only. Need actual logo assets.

### Logo Specifications
- **Format**: SVG (preferred) or PNG
- **Dimensions**: 24x24px display size (48x48px source for retina)
- **Background**: Transparent
- **Style**: Official Microsoft product logos
- **Usage**: Scrolling experience showcase section

### Required Logos List

#### 1. Microsoft Edge
- **Product**: Microsoft Edge Browser
- **Official Colors**: Blue gradient (#0078D4 to #106EBE)
- **Style**: Current Edge logo (circular with wave)

#### 2. Microsoft 365
- **Product**: Microsoft 365 Suite
- **Official Colors**: Orange gradient (#D83B01 to #FF8C00)
- **Style**: Four-square Microsoft logo or M365 specific logo

#### 3. Microsoft Teams
- **Product**: Microsoft Teams
- **Official Colors**: Purple (#6264A7)
- **Style**: Teams logo with chat bubble elements

#### 4. Surface
- **Product**: Microsoft Surface devices
- **Official Colors**: Blue gradient (#0078D4 to #40E0D0)
- **Style**: Surface logo with device silhouette

#### 5. Office
- **Product**: Microsoft Office Suite
- **Official Colors**: Orange/Red (#D83B01)
- **Style**: Office logo or individual app icons

#### 6. Copilot
- **Product**: Microsoft Copilot AI
- **Official Colors**: Multi-color gradient (blue, purple, teal)
- **Style**: Copilot logo with AI elements

#### 7. Family Safety
- **Product**: Microsoft Family Safety
- **Official Colors**: Teal/Green (#00D4AA to #00A693)
- **Style**: Family Safety logo with shield/heart elements

#### 8. Windows
- **Product**: Windows Operating System
- **Official Colors**: Blue (#00BCF2) or four-color flag
- **Style**: Windows flag logo

#### 9. HoloLens
- **Product**: Microsoft HoloLens
- **Official Colors**: Purple gradient (#8B5CF6 to #A855F7)
- **Style**: HoloLens logo with holographic elements

## 🎨 Asset Preparation Guidelines

### Image Optimization
```bash
# Compress images
imagemin input.jpg --out-dir=output --plugin=imagemin-mozjpeg
imagemin input.png --out-dir=output --plugin=imagemin-pngquant

# Convert to WebP
cwebp input.jpg -q 80 -o output.webp

# Generate multiple sizes
convert input.jpg -resize 128x128 output-128.jpg
convert input.jpg -resize 256x256 output-256.jpg
```

### SVG Optimization
```bash
# Optimize SVG files
svgo input.svg -o output.svg --config='{
  "plugins": [
    "removeDoctype",
    "removeXMLProcInst",
    "removeComments",
    "removeMetadata",
    "removeTitle",
    "removeDesc",
    "removeUselessDefs",
    "removeEditorsNSData",
    "removeEmptyAttrs",
    "removeHiddenElems",
    "removeEmptyText",
    "removeEmptyContainers"
  ]
}'
```

## 📁 File Structure

### Recommended Asset Organization
```
assets/
├── images/
│   ├── logos/
│   │   ├── logo-lockup_white_default.svg
│   │   └── microsoft/
│   │       ├── edge.svg
│   │       ├── microsoft-365.svg
│   │       ├── teams.svg
│   │       ├── surface.svg
│   │       ├── office.svg
│   │       ├── copilot.svg
│   │       ├── family-safety.svg
│   │       ├── windows.svg
│   │       └── hololens.svg
│   ├── portraits/
│   │   ├── luis-gilberto.jpg
│   │   ├── luis-gilberto-256.jpg
│   │   └── luis-gilberto.webp
│   └── testimonials/
│       └── scene-logo.png
├── fonts/ (if hosting locally)
│   ├── cormorant-garamond/
│   └── inter/
└── icons/
    ├── favicon.ico
    ├── apple-touch-icon.png
    └── manifest-icons/
```

## 🔄 Asset Integration

### HTML Updates Required
```html
<!-- Replace CDN URLs with local assets -->
<!-- Current CDN URLs to replace: -->

<!-- Logo -->
<img src="https://c.animaapp.com/mfhp38pd9tIBcE/assets/logo-lockup_white_default.svg" 
     alt="Luis Gilberto Logo">
<!-- Replace with: -->
<img src="assets/images/logos/logo-lockup_white_default.svg" 
     alt="Luis Gilberto Logo">

<!-- Portrait -->
<img src="https://c.animaapp.com/mfhp38pd9tIBcE/assets/hp-new_1.jpg" 
     alt="Luis Gilberto">
<!-- Replace with: -->
<img src="assets/images/portraits/luis-gilberto.jpg" 
     alt="Luis Gilberto">

<!-- Scene Logo -->
<img src="https://c.animaapp.com/mfhp38pd9tIBcE/img/neon_blue.png" 
     alt="Scene Logo">
<!-- Replace with: -->
<img src="assets/images/testimonials/scene-logo.png" 
     alt="Scene Logo">
```

### JavaScript Updates for Microsoft Logos
```javascript
// Update the experience list to include logo images
const microsoftProducts = [
    {
        name: 'Microsoft Edge',
        logo: 'assets/images/logos/microsoft/edge.svg'
    },
    {
        name: 'Microsoft 365',
        logo: 'assets/images/logos/microsoft/microsoft-365.svg'
    },
    {
        name: 'Microsoft Teams',
        logo: 'assets/images/logos/microsoft/teams.svg'
    },
    {
        name: 'Surface',
        logo: 'assets/images/logos/microsoft/surface.svg'
    },
    {
        name: 'Office',
        logo: 'assets/images/logos/microsoft/office.svg'
    },
    {
        name: 'Copilot',
        logo: 'assets/images/logos/microsoft/copilot.svg'
    },
    {
        name: 'Family Safety',
        logo: 'assets/images/logos/microsoft/family-safety.svg'
    },
    {
        name: 'Windows',
        logo: 'assets/images/logos/microsoft/windows.svg'
    },
    {
        name: 'HoloLens',
        logo: 'assets/images/logos/microsoft/hololens.svg'
    }
];

// Update the experience list HTML generation
function generateExperienceItem(product) {
    return `
        <div class="experience-item">
            <img src="${product.logo}" alt="${product.name} Logo" class="experience-logo">
            <span>${product.name}</span>
        </div>
    `;
}
```

### CSS Updates for Logo Display
```css
/* Add styles for Microsoft product logos */
.experience-item {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    height: 64px;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-white-90);
}

.experience-logo {
    width: 24px;
    height: 24px;
    object-fit: contain;
    flex-shrink: 0;
}
```

## 🎯 Favicon & App Icons

### Required Icons
```html
<!-- Favicon -->
<link rel="icon" type="image/x-icon" href="assets/icons/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="assets/icons/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="assets/icons/favicon-16x16.png">

<!-- Apple Touch Icons -->
<link rel="apple-touch-icon" sizes="180x180" href="assets/icons/apple-touch-icon.png">

<!-- Android Chrome Icons -->
<link rel="icon" type="image/png" sizes="192x192" href="assets/icons/android-chrome-192x192.png">
<link rel="icon" type="image/png" sizes="512x512" href="assets/icons/android-chrome-512x512.png">

<!-- Web App Manifest -->
<link rel="manifest" href="assets/icons/site.webmanifest">
```

### Icon Specifications
- **Favicon**: 32x32px, 16x16px ICO format
- **Apple Touch Icon**: 180x180px PNG
- **Android Icons**: 192x192px, 512x512px PNG
- **Background**: Solid color or transparent
- **Design**: Simplified version of main logo

## 📊 Performance Considerations

### Image Loading Strategy
```html
<!-- Critical images (above fold) -->
<img src="logo.svg" alt="Logo" loading="eager">

<!-- Non-critical images (below fold) -->
<img src="portrait.jpg" alt="Portrait" loading="lazy">

<!-- Responsive images -->
<img src="portrait-256.jpg" 
     srcset="portrait-128.jpg 128w, portrait-256.jpg 256w"
     sizes="(max-width: 768px) 96px, 128px"
     alt="Portrait">

<!-- Modern format with fallback -->
<picture>
    <source srcset="portrait.webp" type="image/webp">
    <img src="portrait.jpg" alt="Portrait">
</picture>
```

### Asset Preloading
```html
<!-- Preload critical assets -->
<link rel="preload" href="assets/images/logos/logo-lockup_white_default.svg" as="image">
<link rel="preload" href="assets/images/portraits/luis-gilberto.webp" as="image">

<!-- Prefetch non-critical assets -->
<link rel="prefetch" href="assets/images/logos/microsoft/edge.svg">
```

## 🔍 Quality Assurance

### Asset Checklist
- [ ] All images optimized for web
- [ ] SVG files cleaned and optimized
- [ ] Multiple formats provided (WebP + fallback)
- [ ] Responsive image sizes generated
- [ ] Alt text provided for all images
- [ ] File sizes within performance budgets
- [ ] Copyright/licensing verified
- [ ] Brand guidelines compliance checked

### Testing Requirements
- [ ] Images display correctly across all browsers
- [ ] Retina/high-DPI displays render crisp images
- [ ] Lazy loading works properly
- [ ] Fallback images load when modern formats fail
- [ ] Performance impact measured and acceptable

## 📞 Asset Delivery

### Preferred Delivery Methods
1. **Zip Archive**: All assets in organized folder structure
2. **Cloud Storage**: Google Drive, Dropbox, or similar
3. **Git Repository**: Version-controlled asset delivery
4. **CDN Links**: Temporary solution with download instructions

### Asset Handoff Format
```
partnership-toolkit-assets.zip
├── README.md (this file)
├── images/
│   ├── logos/
│   ├── portraits/
│   ├── testimonials/
│   └── microsoft/
├── icons/
├── fonts/ (optional)
└── integration-guide.md
```

## 🚨 Critical Path Assets

### Must-Have for Launch
1. **Logo** - Header and password overlay
2. **Portrait** - Hero section profile
3. **Microsoft Logos** - All 9 product logos for experience section

### Nice-to-Have
1. **Scene Logo** - Testimonial section (can use placeholder)
2. **Custom Icons** - Favicon set
3. **Local Fonts** - Currently using Google Fonts CDN

## 📋 Asset Approval Process

### Review Checklist
- [ ] Brand guidelines compliance
- [ ] Technical specifications met
- [ ] File naming conventions followed
- [ ] Optimization completed
- [ ] Quality assurance passed
- [ ] Legal/copyright clearance obtained

### Approval Workflow
1. **Asset Preparation** - Designer/developer prepares assets
2. **Technical Review** - Developer validates specifications
3. **Brand Review** - Brand team approves visual elements
4. **Legal Review** - Legal team clears usage rights
5. **Final Approval** - Project manager signs off
6. **Integration** - Developer implements assets
7. **Testing** - QA validates implementation

---

**Document Version**: 1.0.0  
**Last Updated**: December 2024  
**Contact**: Development Team for technical questions, Brand Team for asset approval
