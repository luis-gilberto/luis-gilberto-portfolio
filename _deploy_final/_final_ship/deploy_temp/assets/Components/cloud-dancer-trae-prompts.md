# Cloud Dancer Implementation Guide for Trae
## Copy-Paste Prompts for Surgical Background Migration

---

## 🎨 COLOR VALUES QUICK REFERENCE

**BEFORE → AFTER**
```
#FFFFFF → #F4F1ED (Cloud Dancer primary)
#F8F8F8 → #EAE6E1 (Cloud Dancer secondary)
#F0F0F0 → #E0D9D1 (Cloud Dancer tertiary)
```

**KEEP UNCHANGED**
```
#FF6B6B (Coral)
#2ED3C6 (Teal)
#1a1a2e (Navy)
```

---

## 📋 PHASE 1: CORE VARIABLES (START HERE)

### Prompt 1: Update Root CSS Variables
```
Update the CSS root variables in the :root selector for light mode only:
- Change --bg-primary from #FFFFFF to #F4F1ED
- Change --bg-secondary from #F8F8F8 to #EAE6E1
- Change --bg-tertiary from #F0F0F0 to #E0D9D1

DO NOT modify:
- Any color accent variables (coral, teal, navy)
- Any text color variables
- Any border variables
- Dark mode variables

Only update these three background variables in the light mode :root definition.
```

---

## 📋 PHASE 2: BODY & SECTIONS

### Prompt 2: Update Body Background
```
Find all instances where body background is set to white or #FFFFFF and replace with #F4F1ED.
Also find background: white; or background-color: white; and replace with the CSS variable var(--bg-primary).

Only update body-level backgrounds. Do not touch navigation backgrounds, card backgrounds (unless they explicitly use white), or modal backgrounds.
```

### Prompt 3: Update Section Backgrounds
```
Find all section backgrounds that use #FFFFFF or white and replace with var(--bg-primary).
Find all section backgrounds that use #F8F8F8 and replace with var(--bg-secondary).

Target these sections specifically:
- .hero-container
- .hero-section
- .quick-tour-section
- .banner-rotator
- .whats-next
- .footer

Preserve all other styling. Only change the background-color property.
```

---

## 📋 PHASE 3: COMPONENTS

### Prompt 4: Update Card Backgrounds
```
Update card backgrounds to use the Cloud Dancer palette:

For cards with white backgrounds:
- Change background: #FFFFFF to background: var(--bg-primary)
- Change background-color: white to background-color: var(--bg-primary)

Target these card classes:
- .card-preview
- .card-front
- .tour-card
- Any element with class containing "card"

Do not change card borders, shadows, padding/margins, or text colors inside cards.
```

### Prompt 5: Update Glassmorphism Effects
```
Find all glassmorphism effects that use rgba(255, 255, 255, X) and update the base color to match Cloud Dancer's warm tone.

Update --glass-bg variable from:
rgba(255, 255, 255, 0.8) 

To:
rgba(244, 241, 237, 0.8)

This maintains the glass effect but with the warm Cloud Dancer base instead of pure white.

Only update the RGB values in glassmorphism backgrounds, keep alpha/opacity values identical.
```

---

## 📋 PHASE 4: SPECIFIC PAGES

### Prompt 6: Update TheHub Directory
```
Navigate to /TheHub/ directory and apply the same background variable updates:
- Update all white (#FFFFFF) backgrounds to var(--bg-primary) or #F4F1ED
- Update all light gray (#F8F8F8) backgrounds to var(--bg-secondary) or #EAE6E1

Maintain all color logic for coral sections (strategy/expertise), teal sections (creative/execution), and gradient sections (partnership).

Only change base backgrounds, not accent color backgrounds.
```

### Prompt 7: Update Insights Directory
```
Navigate to /insights/ directory and apply Cloud Dancer backgrounds:
- Article backgrounds: var(--bg-primary)
- Sidebar backgrounds: var(--bg-secondary)
- Featured content boxes: var(--bg-tertiary) if using deeper layering

This enhances the editorial feel for the New Yorker-inspired aesthetic.
```

### Prompt 8: Update Portfolio Pages
```
Update backgrounds for these specific files:
- /timeline.html
- /cv.html
- /myexperience.html
- /about.html

Apply the same Cloud Dancer palette:
- Main content areas: var(--bg-primary)
- Alternating sections: var(--bg-secondary)
- Nested elements: var(--bg-tertiary)

Preserve all timeline styling, date markers, and visual hierarchy.
```

---

## 📋 PHASE 5: EDGE CASES

### Prompt 9: Update Inline Styles
```
Search for any inline style attributes that set background colors:
- style="background: white"
- style="background-color: #FFFFFF"
- style="background: #F8F8F8"

Replace these with:
- style="background: var(--bg-primary)" (for white)
- style="background: var(--bg-secondary)" (for light gray)

Or better yet, remove inline styles and apply appropriate CSS classes.
```

### Prompt 10: Update Footer Backgrounds
```
Specifically for the footer section:
- Main footer background: var(--bg-primary) or #F4F1ED
- Footer column backgrounds: maintain as var(--bg-primary)
- Footer bottom section: maintain as var(--bg-primary)

Ensure footer borders remain unchanged but may need slight opacity adjustment if contrast is too low.
```

---

## 📋 PHASE 6: VERIFICATION

### Prompt 11: Verify Dark Mode Unchanged
```
Verify that all dark mode CSS variables under [data-theme="dark"] remain completely unchanged:
- --bg-primary: #0E0E0F
- --bg-secondary: #1a1a1a
- --bg-tertiary: #2a2a2a

Dark mode should be completely unaffected. Run a check to confirm no dark mode variables were accidentally modified.
```

### Prompt 12: Comprehensive Visual Check
```
After all updates, perform a visual check across all pages:
1. Homepage (index.html)
2. Timeline (timeline.html)
3. Experience (myexperience.html)
4. About (about.html)
5. CV (cv.html)
6. TheHub (all pages)
7. Insights (all pages)

Verify:
✓ All backgrounds are warm Cloud Dancer tones
✓ Coral (#FF6B6B) accent stands out clearly
✓ Teal (#2ED3C6) accent is visible and vibrant
✓ Text is readable (no contrast issues)
✓ Dark mode is completely unaffected
✓ No pure white (#FFFFFF) remains in light mode

Report any inconsistencies or pages that were missed.
```

---

## 🚨 EMERGENCY ROLLBACK (IF NEEDED)

### Rollback Prompt
```
Rollback to original colors:

Update :root variables to:
--bg-primary: #FFFFFF;
--bg-secondary: #F8F8F8;
--bg-tertiary: #F0F0F0;

And revert any --glass-bg changes to:
rgba(255, 255, 255, 0.8)

All other changes will automatically revert since they reference these variables.
```

---

## 💡 BEST PRACTICES FOR USING THESE PROMPTS

1. **Go in order** - Start with Prompt 1, complete it, test, then move to Prompt 2
2. **Test after each phase** - Don't rush through all prompts at once
3. **Ask Trae to confirm** - Request "show me the changed lines" after each prompt
4. **Check visually** - Open the page in browser after each major phase
5. **One prompt at a time** - Paste exactly as written, don't combine prompts

### Example Flow:

**You to Trae:**
> "Trae, let's implement Cloud Dancer backgrounds. Start with Prompt 1 from my guide. Update only the three background variables in the :root selector for light mode. Confirm when complete and show me the changed lines."

**[Wait for Trae to complete and confirm]**

**You to Trae:**
> "Perfect. Now run Prompt 2 - update body backgrounds to use the new var(--bg-primary). Show me all files that were modified."

**[Continue through all prompts systematically]**

---

## ✅ FINAL CHECKLIST

Before marking complete:

- [ ] All :root light mode background variables updated
- [ ] All section backgrounds using new palette
- [ ] All card backgrounds updated
- [ ] All glassmorphism effects using new base color
- [ ] Dark mode completely unchanged
- [ ] TheHub pages updated
- [ ] Insights pages updated
- [ ] Portfolio pages updated
- [ ] No inline white backgrounds remain
- [ ] All pages visually tested
- [ ] Mobile responsive views checked

---

## 🎯 WHAT THIS ACHIEVES

**Strategic Benefits:**
- Editorial sophistication (especially for Insights)
- "Caracas meets Cascadia" aesthetic authenticity
- Better coral accent vibrancy (warm-on-warm harmony)
- Premium positioning (established vs. startup feel)
- 2026 cultural relevance (Pantone Color of the Year)

**What Stays the Same:**
- All accent colors and their meanings
- All text colors and hierarchy
- All layouts and spacing
- All interactions and animations
- All dark mode styling
- All brand logic (coral=strategy, teal=execution)

---

**This is a high-impact, low-risk change. The variable-based approach means most updates cascade automatically, and rollback is instant if needed.**

**You're going to LOVE how this feels. It's sophistication as a background color.** 🎨
