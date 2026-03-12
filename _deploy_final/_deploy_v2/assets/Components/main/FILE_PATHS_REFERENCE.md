# Hub Reveal - File Paths & Setup Reference

## 📂 Service Image File Paths

The four service images should be located at:

```
/TheHub/assets/icons/floating-shapes/
├── compass_rose_coral.png      (Advisory - Top-Left)
├── atom_model_teal.png          (IMC Services - Top-Right)
├── telescope_coral.png          (ScopeIQ - Bottom-Left)
└── chess_queen_teal.png         (StrategyIQ - Bottom-Right)
```

### Full Web Paths:
```html
<!-- Advisory (Compass) - Coral -->
/TheHub/assets/icons/floating-shapes/compass_rose_coral.png

<!-- IMC Services (Atom) - Teal -->
/TheHub/assets/icons/floating-shapes/atom_model_teal.png

<!-- ScopeIQ (Telescope) - Coral -->
/TheHub/assets/icons/floating-shapes/telescope_coral.png

<!-- StrategyIQ (Chess Queen) - Teal -->
/TheHub/assets/icons/floating-shapes/chess_queen_teal.png
```

---

## ✅ Pre-Integration Checklist

### 1. Verify Image Files Exist
Check that all four images are in the correct location:
```
C:\Users\luisg\OneDrive\Documents\Luis Gilberto\TheHub\assets\icons\floating-shapes\
```

**Files needed:**
- [x] compass_rose_coral.png
- [x] atom_model_teal.png
- [x] telescope_coral.png
- [x] chess_queen_teal.png

### 2. Verify Image Properties
Each image should be:
- **Format:** PNG with transparency
- **Size:** Square aspect ratio (recommended 512x512 or 1024x1024)
- **Color:** 
  - Compass & Telescope: Coral (#F96F6E)
  - Atom & Chess Queen: Teal (#2ED3C6)

### 3. Test Image URLs
Before integrating, verify these URLs work in your browser:
```
http://localhost/TheHub/assets/icons/floating-shapes/compass_rose_coral.png
http://localhost/TheHub/assets/icons/floating-shapes/atom_model_teal.png
http://localhost/TheHub/assets/icons/floating-shapes/telescope_coral.png
http://localhost/TheHub/assets/icons/floating-shapes/chess_queen_teal.png
```

---

## 🎯 Integration File Locations

### Main Hub Page
```
/TheHub/index.html
```
This is where the reveal system will be integrated.

### Hub Video
The coral laser line video that triggers the reveal:
```
Duration: 8 seconds
Ends with: Two nested coral rectangles
Trigger: video 'ended' event
```

### Main Stylesheet
Add the reveal CSS to your main stylesheet (likely one of these):
```
/TheHub/css/main.css
/TheHub/styles.css
/TheHub/assets/css/hub.css
```

---

## 🔧 Quick Setup Guide for Trae

### Step 1: Verify Images
```bash
# Check files exist
ls "/TheHub/assets/icons/floating-shapes/"

# Should show:
# compass_rose_coral.png
# atom_model_teal.png
# telescope_coral.png
# chess_queen_teal.png
```

### Step 2: Add HTML
In `/TheHub/index.html`, add right after the Hub video element:
```html
<!-- Hub Reveal System -->
<div class="hub-reveal-system" id="hubRevealSystem">
    <div class="energy-burst">
        <div class="energy-rect energy-rect-outer"></div>
        <div class="energy-rect energy-rect-inner"></div>
    </div>
    
    <div class="service-image service-advisory">
        <img src="/TheHub/assets/icons/floating-shapes/compass_rose_coral.png" alt="">
    </div>
    <div class="service-image service-imc">
        <img src="/TheHub/assets/icons/floating-shapes/atom_model_teal.png" alt="">
    </div>
    <div class="service-image service-scope">
        <img src="/TheHub/assets/icons/floating-shapes/telescope_coral.png" alt="">
    </div>
    <div class="service-image service-strategy">
        <img src="/TheHub/assets/icons/floating-shapes/chess_queen_teal.png" alt="">
    </div>
</div>
```

### Step 3: Add CSS
Copy all CSS from `SIMPLIFIED_IMPLEMENTATION.md` to your main stylesheet.

### Step 4: Add JavaScript
Copy the JavaScript trigger code from `SIMPLIFIED_IMPLEMENTATION.md` to your scripts.

### Step 5: Update Video ID
Find your Hub video element and note its ID:
```html
<video id="hubVideo" ...>  <!-- ← Use this ID in JavaScript -->
```

Then update the JavaScript:
```javascript
const hubVideo = document.getElementById('hubVideo'); // ← Match your video ID
```

---

## 🧪 Testing Checklist

After integration, test:

### Visual Tests
- [ ] Hub video plays correctly
- [ ] Rectangles appear at video end
- [ ] Rectangles expand and fade
- [ ] Four images emerge from center
- [ ] Images fly to correct corners
- [ ] Rotation begins smoothly
- [ ] Main content fades in

### Position Tests
- [ ] Compass (coral) → Top-Left ✓
- [ ] Atom (teal) → Top-Right ✓
- [ ] Telescope (coral) → Bottom-Left ✓
- [ ] Chess Queen (teal) → Bottom-Right ✓

### Performance Tests
- [ ] 60fps throughout sequence
- [ ] No layout shifts
- [ ] Smooth on mobile
- [ ] Images load quickly

### Browser Tests
- [ ] Chrome (Desktop)
- [ ] Firefox (Desktop)
- [ ] Safari (Desktop)
- [ ] Safari (iOS)
- [ ] Chrome (Android)

### Accessibility Tests
- [ ] Reduced motion respected
- [ ] No accessibility violations
- [ ] Content still accessible with animations

---

## 🐛 Troubleshooting

### Images Don't Appear
**Problem:** Service images not showing
**Check:**
1. Image file paths are correct
2. Images exist in folder
3. Web server can access the folder
4. No console errors about 404s

### Video Doesn't Trigger Reveal
**Problem:** Nothing happens after video ends
**Check:**
1. Video ID matches JavaScript
2. JavaScript loaded after video element
3. No console errors
4. Video actually completes (not paused)

### Timing Feels Off
**Problem:** Sequence too fast/slow
**Solution:** Adjust delays in JavaScript (see SIMPLIFIED_IMPLEMENTATION.md)

### Images Too Visible/Subtle
**Problem:** Opacity not right
**Solution:** Adjust opacity value in CSS from 0.15 to 0.10-0.25

### Rotation Not Smooth
**Problem:** Jerky rotation animation
**Check:**
1. Browser supports CSS transforms
2. GPU acceleration enabled
3. No other heavy animations running

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify all file paths are correct
3. Test in incognito mode (no extensions)
4. Compare with working demo file

---

## ✅ Final Verification

Before going live:
- [ ] All images load correctly
- [ ] Timing feels right (2.5s default)
- [ ] Opacity looks good (15% default)
- [ ] Works on mobile
- [ ] Works in all major browsers
- [ ] No console errors
- [ ] Smooth 60fps performance

---

**Ready to integrate? All files are updated with the correct image paths!**
