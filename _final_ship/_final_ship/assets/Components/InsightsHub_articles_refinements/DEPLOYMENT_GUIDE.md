# Building The Hub - Hero Integration Deployment Guide

## 📦 Package Contents

This deployment package integrates the full-width hero banner treatment into your "Building The Hub" article.

### Files Included:
1. **building-the-hub-article-with-hero.html** - Complete article with integrated hero
2. **hero-banner-styles.css** - Reusable hero component styles  
3. **building-the-hub-hero-optimized.jpg** - Hero image (to be added)
4. **building-the-hub-hero-thumb.jpg** - Thumbnail for hub grid (to be added)

---

## 🎯 Quick Deploy

### Step 1: Upload Hero Image
The hero image from your generation (Option A) needs to be:
- **Resized to:** 1600×900px (16:9 ratio)
- **Optimized to:** <500KB file size
- **Format:** JPG at 85% quality
- **Filename:** `building-the-hub-hero-optimized.jpg`

**Upload to:** `/insights/articles/building-the-hub/`

### Step 2: Deploy Article HTML
Upload `building-the-hub-article-with-hero.html` to:
```
/insights/articles/building-the-hub/index.html
```

### Step 3: Update Hub Grid Thumbnail (Optional)
Create a square crop (600×600px) of the hero for the Insights Hub grid:
- **Filename:** `building-the-hub-hero-thumb.jpg`
- **Upload to:** `/insights/articles/building-the-hub/`

Update your `insights_hub_editorial.html` grid item:
```html
<div class="article-image-wrapper">
    <img src="/insights/articles/building-the-hub/building-the-hub-hero-thumb.jpg" 
         alt="Building The Hub">
</div>
```

---

## 🎨 Hero Banner Specs

### Visual Treatment
- **Layout:** Full-width edge-to-edge
- **Height:** 65vh (desktop), 50vh (mobile)
- **Overlay:** Left-to-right dark gradient
- **Title:** White, bold, left-aligned
- **Subtitle:** Coral (#F96F6E), italic

### Image Requirements
| Spec | Value |
|------|-------|
| Dimensions | 1600×900px |
| Aspect Ratio | 16:9 |
| Format | JPG |
| File Size | <500KB |
| Compression | 85% quality |
| Focus | Center-weighted composition |

### Typography
- **Title Font:** Inter Bold, 4rem (desktop), 2rem (mobile)
- **Subtitle Font:** Inter Regular Italic, 1.5rem (desktop), 1rem (mobile)
- **Subtitle Color:** #F96F6E (Coral)

---

## 🔄 Reusing for Other Articles

The hero banner component is fully reusable. For each new article:

### 1. Copy the Hero HTML Structure
```html
<header class="article-hero">
    <img src="your-hero-image.jpg" alt="Description" class="hero-image">
    <div class="hero-overlay">
        <div class="hero-content">
            <div class="hero-text">
                <h1>Your Article Title</h1>
                <p class="subtitle">Your italic subtitle</p>
            </div>
        </div>
    </div>
</header>
```

### 2. Include Hero Styles
Either:
- **Option A:** Link to standalone CSS: `<link rel="stylesheet" href="/hero-banner-styles.css">`
- **Option B:** Copy the hero styles into your article's `<style>` tag

### 3. Generate/Optimize Your Hero Image
- Use same 1600×900px specs
- Maintain 16:9 ratio
- Keep file size <500KB
- Use JPG format

---

## 📱 Responsive Behavior

### Desktop (>1024px)
- Hero height: 65vh
- Title overlay: Left-aligned with right-fade gradient
- Full 4rem title size

### Tablet (768px - 1024px)
- Hero height: 55vh
- Stronger gradient for readability
- Title scales to 3rem

### Mobile (<768px)
- Hero height: 50vh
- Gradient shifts to bottom-up (better mobile readability)
- Title scales to 2rem
- Content anchors to bottom of hero

---

## 🎯 Brand Alignment

### Colors Used
- **Coral (#F96F6E):** Subtitle text, section accents
- **Teal (#2ED3C6):** Available for tags/accents (not used in hero)
- **White (#FFFFFF):** Hero title text
- **Black (#1A1A1A):** Body text, borders

### Design System Match
✅ White background body  
✅ Black borders with nested grey  
✅ Coral used sparingly for strategic emphasis  
✅ Inter typography throughout  
✅ Swiss/Bauhaus editorial influence  
✅ Premium publication aesthetic  

---

## ✅ Pre-Launch Checklist

- [ ] Hero image optimized to 1600×900px, <500KB
- [ ] Image filename matches HTML src attribute
- [ ] Article HTML uploaded to correct path
- [ ] Back navigation link points to `/insights/`
- [ ] Mobile responsive layout tested
- [ ] Image loads properly on all devices
- [ ] Gradient overlay provides sufficient text contrast
- [ ] Optional: Hub grid thumbnail created and linked

---

## 🔮 Scaling to Other Articles

Once this implementation is validated, you can:

1. **Generate matching heroes** for other Insights articles using the same layered photography style
2. **Apply consistent treatment** across all monthly pieces
3. **Build visual cohesion** with thematic variations of the 4 Hub icons

**Example article variations:**
- "Navigating The Strategic Mind" → Compass-focused hero
- "The Strategy Sessions" → Chess knight strategy focus  
- Future pieces → Telescope (vision) or Atom (intelligence) themes

---

## 📞 Next Steps

1. **Optimize Option A image** (the selected hero) to 1600×900px, <500KB
2. **Upload to** `/insights/articles/building-the-hub/building-the-hub-hero-optimized.jpg`
3. **Deploy HTML** to `/insights/articles/building-the-hub/index.html`
4. **Test on live site** to verify responsive behavior
5. **Optional:** Generate heroes for other articles to maintain visual consistency

---

**Questions or need adjustments?** This system is designed to scale, so modifications can be applied across all articles simultaneously via the shared CSS file.
