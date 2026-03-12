# Work That Mattered Carousel - Project-Specific Color Implementation
## Instructions for Updating Card Colors (Option 1: Single Color System)

---

## Overview

Update the "Work That Mattered" carousel cards to use **project-specific colors** instead of generic coral/teal. Each card's "CAMPAIGN" eyebrow and stat badge will use the project's primary color from its diagonal slice hero treatment.

**File to Update:** `work_that_mattered_section.html` (or the insights landing page file containing this carousel)

---

## Color Assignments by Project

Each case study card uses its `--project-color-1` (primary color) for both the eyebrow label and stat badge:

| Case Study | Primary Color | Hex Code | Usage |
|------------|---------------|----------|-------|
| **Teams Consumer Launch** | Deep Purple | `#56246D` | Eyebrow + Stat Badge |
| **Transforming Browsing with AI** | Lime Green | `#A4C639` | Eyebrow + Stat Badge |
| **Edge-ucational Video** | Periwinkle | `#A8A8ED` | Eyebrow + Stat Badge |
| **Edge Mobile Rebrand** | Microsoft Blue | `#0078d4` | Eyebrow + Stat Badge |
| **Family Safety Launch** | Soft Pink | `#F8D7E0` | Eyebrow + Stat Badge |
| **Free to Be Free** | Navy Blue | `#1E4E8C` | Eyebrow + Stat Badge |

---

## Step 1: Add Project-Specific CSS Classes

**FIND** the `<style>` section in your carousel file and **ADD** these new color-specific classes:

```css
/* Project-Specific Card Colors */

/* Teams Consumer Launch - Deep Purple */
.card-teams .campaign-label,
.card-teams .stat-badge {
    background-color: #56246D;
    color: #ffffff;
}

/* Transforming Browsing with AI - Lime Green */
.card-ai-browsing .campaign-label,
.card-ai-browsing .stat-badge {
    background-color: #A4C639;
    color: #1E1E1E; /* Dark text for better contrast on lime */
}

/* Edge-ucational Video - Periwinkle */
.card-edgeucational .campaign-label,
.card-edgeucational .stat-badge {
    background-color: #A8A8ED;
    color: #1E1E1E; /* Dark text for better contrast */
}

/* Edge Mobile Rebrand - Microsoft Blue */
.card-edge-mobile .campaign-label,
.card-edge-mobile .stat-badge {
    background-color: #0078d4;
    color: #ffffff;
}

/* Family Safety Launch - Soft Pink */
.card-family-safety .campaign-label,
.card-family-safety .stat-badge {
    background-color: #F8D7E0;
    color: #1E1E1E; /* Dark text for better contrast on pink */
}

/* Free to Be Free - Navy Blue */
.card-free-to-be-free .campaign-label,
.card-free-to-be-free .stat-badge {
    background-color: #1E4E8C;
    color: #ffffff;
}
```

---

## Step 2: Update HTML Card Structure

**FIND** each carousel card div and **ADD** the project-specific class to the card container.

### Current Structure (Generic):
```html
<div class="carousel-card">
    <span class="campaign-label">CAMPAIGN</span>
    <img src="..." alt="...">
    <h3>Case Study Title</h3>
    <span class="stat-badge">15M+ activations</span>
    <a href="..." class="cta-link">VIEW CASE STUDY →</a>
</div>
```

### Updated Structure (Project-Specific):

#### Card 1: Teams Consumer Launch
```html
<div class="carousel-card card-teams">
    <span class="campaign-label">CAMPAIGN</span>
    <img src="../assets/images/teams-carousel-thumb.jpg" alt="Teams Consumer Launch">
    <h3>Teams Consumer Launch</h3>
    <span class="stat-badge">10M+ users</span>
    <a href="teams_consumer_launch_UPDATED.html" class="cta-link">VIEW CASE STUDY →</a>
</div>
```

#### Card 2: Transforming Browsing with AI
```html
<div class="carousel-card card-ai-browsing">
    <span class="campaign-label">CAMPAIGN</span>
    <img src="../assets/images/ai-browsing-carousel-thumb.jpg" alt="Transforming Browsing with AI">
    <h3>Transforming Browsing with AI</h3>
    <span class="stat-badge">15M+ activations</span>
    <a href="transforming_browsing_ai_UPDATED.html" class="cta-link">VIEW CASE STUDY →</a>
</div>
```

#### Card 3: Edge-ucational Video
```html
<div class="carousel-card card-edgeucational">
    <span class="campaign-label">CAMPAIGN</span>
    <img src="../assets/images/edgeucational-carousel-thumb.jpg" alt="Edge-ucational Video Series">
    <h3>Edge-ucational Video Series</h3>
    <span class="stat-badge">50+ episodes</span>
    <a href="edgeucational_series_UPDATED.html" class="cta-link">VIEW CASE STUDY →</a>
</div>
```

#### Card 4: Edge Mobile Rebrand
```html
<div class="carousel-card card-edge-mobile">
    <span class="campaign-label">CAMPAIGN</span>
    <img src="../assets/images/edge-mobile-carousel-thumb.jpg" alt="Edge Mobile Rebrand">
    <h3>Edge Mobile Rebrand</h3>
    <span class="stat-badge">Global launch</span>
    <a href="edge_mobile_rebrand_UPDATED.html" class="cta-link">VIEW CASE STUDY →</a>
</div>
```

#### Card 5: Family Safety Launch
```html
<div class="carousel-card card-family-safety">
    <span class="campaign-label">CAMPAIGN</span>
    <img src="../assets/images/family-safety-carousel-thumb.jpg" alt="Family Safety Launch">
    <h3>Family Safety Launch</h3>
    <span class="stat-badge">Protection for families</span>
    <a href="family_safety_launch_UPDATED.html" class="cta-link">VIEW CASE STUDY →</a>
</div>
```

#### Card 6: Free to Be Free
```html
<div class="carousel-card card-free-to-be-free">
    <span class="campaign-label">CAMPAIGN</span>
    <img src="../assets/images/free-to-be-free-carousel-thumb.jpg" alt="Free to Be Free">
    <h3>Free to Be Free</h3>
    <span class="stat-badge">Brand evolution</span>
    <a href="free_to_be_free_UPDATED.html" class="cta-link">VIEW CASE STUDY →</a>
</div>
```

---

## Step 3: Remove Generic Coral/Teal Styles

**FIND** and **REMOVE** or **COMMENT OUT** the old generic color styles:

```css
/* OLD - REMOVE THESE */
.campaign-label {
    background-color: #FF7F50; /* Generic coral */
    color: #ffffff;
}

.stat-badge {
    background-color: #008B8B; /* Generic teal */
    color: #ffffff;
}
```

**Note:** Only remove if these aren't used elsewhere. If they are base styles, the project-specific classes will override them anyway.

---

## Step 4: Ensure Accessibility (Text Contrast)

Some project colors need **dark text** instead of white for proper contrast:

**Light Background Colors (Need Dark Text):**
- Lime Green (#A4C639) → Use `#1E1E1E`
- Periwinkle (#A8A8ED) → Use `#1E1E1E`
- Soft Pink (#F8D7E0) → Use `#1E1E1E`

**Dark Background Colors (Use White Text):**
- Deep Purple (#56246D) → Use `#ffffff`
- Microsoft Blue (#0078d4) → Use `#ffffff`
- Navy Blue (#1E4E8C) → Use `#ffffff`

This is already implemented in the CSS classes above. ✅

---

## Step 5: Update Carousel Navigation (Optional Enhancement)

If you want the carousel navigation dots to also reflect project colors:

```css
/* Active carousel dot matches current card's project color */
.carousel-dots .dot.active[data-project="teams"] {
    background-color: #56246D;
}

.carousel-dots .dot.active[data-project="ai-browsing"] {
    background-color: #A4C639;
}

.carousel-dots .dot.active[data-project="edgeucational"] {
    background-color: #A8A8ED;
}

.carousel-dots .dot.active[data-project="edge-mobile"] {
    background-color: #0078d4;
}

.carousel-dots .dot.active[data-project="family-safety"] {
    background-color: #F8D7E0;
}

.carousel-dots .dot.active[data-project="free-to-be-free"] {
    background-color: #1E4E8C;
}
```

Then add `data-project` attributes to each dot in the HTML:
```html
<div class="carousel-dots">
    <span class="dot active" data-project="teams"></span>
    <span class="dot" data-project="ai-browsing"></span>
    <span class="dot" data-project="edgeucational"></span>
    <!-- etc -->
</div>
```

---

## Visual Reference

**Before (Generic Coral/Teal):**
- All cards: Coral "CAMPAIGN" + Teal stats
- No visual differentiation between projects

**After (Project-Specific):**
- Teams: Deep purple (#56246D) for both
- AI Browsing: Lime green (#A4C639) for both
- Edge-ucational: Periwinkle (#A8A8ED) for both
- Edge Mobile: Microsoft blue (#0078d4) for both
- Family Safety: Soft pink (#F8D7E0) for both
- Free to Be Free: Navy blue (#1E4E8C) for both

---

## Quality Checklist

After implementing, verify:

- [ ] All 6 cards have their project-specific class applied
- [ ] "CAMPAIGN" eyebrow uses correct project color
- [ ] Stat badge uses correct project color
- [ ] Text contrast meets WCAG AA standards (4.5:1 minimum)
- [ ] Light backgrounds use dark text (#1E1E1E)
- [ ] Dark backgrounds use white text (#ffffff)
- [ ] No generic coral (#FF7F50) or teal (#008B8B) remaining
- [ ] Colors match the diagonal slice hero treatment in each case study
- [ ] Carousel navigation still functions correctly
- [ ] Cards are clickable and link to correct case study pages

---

## Testing Instructions

1. **Desktop View**: Check all 6 cards cycle through carousel correctly with new colors
2. **Color Consistency**: Open a case study from carousel, verify card color matches hero diagonal slices
3. **Contrast Test**: Use browser DevTools to verify all text passes WCAG AA (4.5:1)
4. **Dark Mode**: If applicable, test that card colors work in dark mode context
5. **Touch Targets**: Verify stat badges and eyebrows don't interfere with card clickability

---

## Color Palette Quick Reference

```css
/* Copy-Paste Reference */
#56246D  /* Teams - Deep Purple */
#A4C639  /* AI Browsing - Lime Green */
#A8A8ED  /* Edge-ucational - Periwinkle */
#0078d4  /* Edge Mobile - Microsoft Blue */
#F8D7E0  /* Family Safety - Soft Pink */
#1E4E8C  /* Free to Be Free - Navy Blue */

/* Text Colors for Contrast */
#ffffff  /* White text - use with dark backgrounds */
#1E1E1E  /* Dark text - use with light backgrounds */
```

---

## Notes

- **Brand Consistency**: These colors match the `--project-color-1` from each case study's hero treatment
- **Scalability**: If you add more case studies, follow the same pattern
- **Fallback**: If project-specific class is missing, cards will use default carousel styling
- **Performance**: No additional HTTP requests, all inline CSS

---

**Questions?** Reference the case study color palette document or contact Luis for clarification.

**Last Updated:** November 10, 2025
