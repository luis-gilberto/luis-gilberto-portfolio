# Luis Gilberto Hub Icons v1.0

**Generated:** 2026-03-03 04:26 UTC
**Package Contents:** 15 minimal outline icons + Preview grid

---

## 📦 Package Contents

### Icons Generated (15 total)

**5 Icon Concepts × 3 Brand Colors:**

1. **HubOverview** (2×2 grid/dashboard icon)
   - ICON_HubOverview_sm_white.png
   - ICON_HubOverview_sm_coral.png
   - ICON_HubOverview_sm_teal.png

2. **TheSystem** (book/manual icon)
   - ICON_TheSystem_sm_white.png
   - ICON_TheSystem_sm_coral.png
   - ICON_TheSystem_sm_teal.png

3. **StrategyIQ** (pulse/waveform icon)
   - ICON_StrategyIQ_sm_white.png
   - ICON_StrategyIQ_sm_coral.png
   - ICON_StrategyIQ_sm_teal.png

4. **Advisory** (envelope/message icon)
   - ICON_Advisory_sm_white.png
   - ICON_Advisory_sm_coral.png
   - ICON_Advisory_sm_teal.png

5. **Identity** (fingerprint icon) — NEW, replaces compass
   - ICON_Identity_sm_white.png
   - ICON_Identity_sm_coral.png
   - ICON_Identity_sm_teal.png

**Preview:**
- ICON_PREVIEW_GRID.png — Visual reference showing all 15 icons

---

## 🎨 Brand Specifications

All icons follow the Luis Gilberto brand guidelines:

- **Style:** Minimal outline, no fills or gradients
- **Stroke Weight:** 1.8px (uniform)
- **Corner Radius:** 2px on rounded elements
- **Canvas Size:** 32×32px
- **Active Area:** 24×24px (centered with 4px margin)
- **Background:** Transparent
- **Format:** PNG with alpha channel

### Color Values

- **White:** #FFFFFF
- **Coral:** #F47471
- **Teal:** #2ED3C6

---

## 💼 Implementation Notes

### Usage by Journey

**Partner Journey (Teal theme):**
- Use `*_teal.png` variants

**Hire Journey (Coral theme):**
- Use `*_coral.png` variants  

**Explore Journey (Neutral theme):**
- Use `*_white.png` variants

### File Organization

Recommended directory structure:
```
/assets/hp/
  ├── ICON_HubOverview_sm_white.png
  ├── ICON_HubOverview_sm_coral.png
  ├── ICON_HubOverview_sm_teal.png
  └── ... (all other icons)
```

### CSS Implementation

```css
.hub-icon {
  width: 24px;
  height: 24px;
  display: inline-block;
}

/* Journey-specific icon color swapping */
body[data-journey="partner"] .hub-icon {
  content: url('/assets/hp/ICON_[name]_sm_teal.png');
}

body[data-journey="hire"] .hub-icon {
  content: url('/assets/hp/ICON_[name]_sm_coral.png');
}
```

---

## ⚠️ Additional Tasks

### ThePortal.jpg WebP Conversion

**Status:** ⏳ Pending original file from Luis

**Required Action:**
1. Locate original `ThePortal.jpg` (or provide the Portal branding source)
2. Convert to WebP format at 900×900 px
3. Save as `/assets/hp/ThePortal.webp`

**Conversion Command (once file is available):**
```bash
convert ThePortal.jpg -resize 900x900 -quality 85 ThePortal.webp
```

### Leadership Card Image

**Status:** ⏳ Ready for generation

**Option A — Portrait with Strategic Background:**
Use Luis's portrait (https://www.genspark.ai/api/files/s/OJrloR4w) with teal gradient + subtle geometric strategy overlay

**Option B — Abstract Dimensional:**
Generate abstract architectural layers representing "three dimensions of experience"

**Recommended Approach:**
Generate Option B (abstract) via nano-banana-pro model, then Luis can provide actual portrait for Option A if preferred.

**Prompt for Option B:**
```
Professional editorial photography for leadership card. Abstract architectural 
representation of strategic depth and dimensional thinking. Dark background 
(#0A0A0A to #141414) with layered geometric planes suggesting three dimensions 
of experience: technical depth, strategic perspective, and team leadership. 
Teal (#2ED3C6) primary accent light creating depth between layers, coral 
(#F47471) warm accent on foreground element. The composition suggests looking 
through layers of strategic frameworks, with each plane slightly offset creating 
parallax depth. Minimalist, premium, cerebral. No text. No people. Ultra-high 
quality architectural abstraction. 3:4 portrait orientation.
```

---

## 📋 Next Steps

1. ✅ **Icons complete** — Deploy to `/assets/hp/`
2. ⏳ **ThePortal WebP** — Waiting on source file
3. ⏳ **Leadership Image** — Generate via image API or provide portrait
4. 📝 **Update Implementation Guide v1.1** — Add new icon references

---

## 🔗 Related Documents

- Homepage Partner Journey Implementation Guide v1.1
- Brand Guidelines Section 06 (Icon Specifications)
- Megamenu Component Specifications

---

**Questions?** Contact Luis Gilberto / Engineering Team
