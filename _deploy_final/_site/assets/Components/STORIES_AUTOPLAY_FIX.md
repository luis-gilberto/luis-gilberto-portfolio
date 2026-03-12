# Stories Carousel - Infinite Auto-Rotation

**Date**: November 12, 2025  
**For**: Trae (Implementation)  
**Task**: Add automatic infinite cycling to Stories carousel (2 seconds per card)

---

## Overview

Add auto-rotation functionality to the Stories carousel so it continuously cycles through all 6 cards with a 2-second pause on each card, then loops back to the beginning infinitely.

**User Experience:**
- Card 1 displays for 2 seconds
- Auto-advance to Card 2 (2 seconds)
- Auto-advance to Card 3 (2 seconds)
- Auto-advance to Card 4 (2 seconds)
- Auto-advance to Card 5 (2 seconds)
- Auto-advance to Card 6 (2 seconds)
- Loop back to Card 1 and repeat infinitely

**Interaction Behavior:**
- User can still manually navigate (arrows, dots, swipe)
- Auto-rotation pauses when user hovers over carousel
- Auto-rotation resumes when hover ends
- Auto-rotation pauses when user manually changes slide
- Auto-rotation resumes after 2 seconds of inactivity

---

## Implementation Steps

### Step 1: Locate Stories Carousel JavaScript

Find the Stories carousel Swiper initialization in your JavaScript. It should look something like this:

```javascript
const storiesSwiper = new Swiper('.stories-swiper', {
    slidesPerView: 'auto',
    spaceBetween: 30,
    centeredSlides: false,
    loop: false,
    navigation: {
        nextEl: '.stories-swiper .swiper-button-next',
        prevEl: '.stories-swiper .swiper-button-prev',
    },
    pagination: {
        el: '.stories-swiper .swiper-pagination',
        clickable: true,
    },
    breakpoints: {
        320: {
            slidesPerView: 1,
            spaceBetween: 20,
            centeredSlides: true,
        },
        768: {
            slidesPerView: 2,
            spaceBetween: 25,
        },
        1024: {
            slidesPerView: 'auto',
            spaceBetween: 30,
        }
    }
});
```

### Step 2: Replace with Auto-Rotation Enabled Configuration

**DELETE** the existing `storiesSwiper` initialization code.

**REPLACE WITH** this new configuration:

```javascript
// Stories Carousel - With Infinite Auto-Rotation (2 seconds per card)
const storiesSwiper = new Swiper('.stories-swiper', {
    slidesPerView: 'auto',
    spaceBetween: 30,
    centeredSlides: false,
    loop: true, // Enable infinite loop
    speed: 600, // Transition speed in milliseconds
    
    // Auto-rotation configuration
    autoplay: {
        delay: 2000, // 2 seconds per card
        disableOnInteraction: false, // Continue autoplay after user interaction
        pauseOnMouseEnter: true, // Pause when hovering over carousel
    },
    
    // Navigation arrows
    navigation: {
        nextEl: '.stories-swiper .swiper-button-next',
        prevEl: '.stories-swiper .swiper-button-prev',
    },
    
    // Pagination dots
    pagination: {
        el: '.stories-swiper .swiper-pagination',
        clickable: true,
        dynamicBullets: false, // Show all dots for better visibility
    },
    
    // Keyboard control
    keyboard: {
        enabled: true,
        onlyInViewport: true,
    },
    
    // Touch/swipe behavior
    grabCursor: true,
    touchEventsTarget: 'container',
    
    // Responsive breakpoints
    breakpoints: {
        // Mobile: single card
        320: {
            slidesPerView: 1,
            spaceBetween: 20,
            centeredSlides: true,
        },
        // Tablet: 2 cards
        768: {
            slidesPerView: 2,
            spaceBetween: 25,
            centeredSlides: false,
        },
        // Desktop: auto (3-4 cards based on viewport)
        1024: {
            slidesPerView: 'auto',
            spaceBetween: 30,
            centeredSlides: false,
        }
    }
});
```

### Step 3: Add Manual Pause/Resume Controls (Optional Enhancement)

If you want to give users a way to manually pause/resume the auto-rotation, add this additional code after the Swiper initialization:

```javascript
// Optional: Add pause/play button functionality
const pauseButton = document.querySelector('.stories-pause-button');
let isAutoplayPaused = false;

if (pauseButton) {
    pauseButton.addEventListener('click', function() {
        if (isAutoplayPaused) {
            storiesSwiper.autoplay.start();
            pauseButton.textContent = 'Pause';
            pauseButton.setAttribute('aria-label', 'Pause carousel auto-rotation');
            isAutoplayPaused = false;
        } else {
            storiesSwiper.autoplay.stop();
            pauseButton.textContent = 'Play';
            pauseButton.setAttribute('aria-label', 'Resume carousel auto-rotation');
            isAutoplayPaused = true;
        }
    });
}

// Optional: Pause autoplay when user focuses on a card (accessibility)
const storyCards = document.querySelectorAll('.stories-swiper .story-card');
storyCards.forEach(card => {
    card.addEventListener('focus', function() {
        storiesSwiper.autoplay.stop();
    });
    
    card.addEventListener('blur', function() {
        if (!isAutoplayPaused) {
            storiesSwiper.autoplay.start();
        }
    });
});
```

### Step 4: Add Pause/Play Button to HTML (If Using Optional Enhancement)

If you implemented the optional pause/play button functionality, add this button to your Stories carousel section HTML:

**Locate** the Stories section (should have class `.tab-content` with id or similar):

```html
<div class="tab-content active" data-tab="stories">
    <div class="swiper stories-swiper">
        <!-- Existing swiper content -->
        <div class="swiper-wrapper">
            <!-- Cards here -->
        </div>
        
        <!-- Existing pagination and navigation -->
        <div class="swiper-pagination"></div>
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
        
        <!-- ADD THIS: Pause/Play Button -->
        <button class="stories-pause-button" 
                aria-label="Pause carousel auto-rotation"
                title="Pause auto-rotation">
            Pause
        </button>
    </div>
</div>
```

### Step 5: Add Pause/Play Button Styles (If Using Optional Enhancement)

Add these styles to your CSS (after the Stories carousel styles):

```css
/* Stories Carousel - Pause/Play Button */
.stories-pause-button {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    z-index: 20;
    background: var(--card-bg);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 2px solid var(--border-color);
    border-radius: 8px;
    padding: 0.6rem 1.2rem;
    font-family: var(--font-base);
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stories-pause-button:hover {
    background: var(--coral-accent);
    border-color: var(--coral-accent);
    color: #FFFFFF;
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(249, 111, 110, 0.3);
}

.stories-pause-button:focus {
    outline: 2px solid var(--coral-accent);
    outline-offset: 2px;
}

.stories-pause-button:active {
    transform: scale(0.98);
}

/* Responsive: Hide pause button on small screens (optional) */
@media (max-width: 480px) {
    .stories-pause-button {
        font-size: 0.75rem;
        padding: 0.5rem 1rem;
        bottom: 0.75rem;
        right: 0.75rem;
    }
}
```

---

## Configuration Options Explained

### Auto-Rotation Settings

```javascript
autoplay: {
    delay: 2000, // Time each card displays (milliseconds)
    disableOnInteraction: false, // Keep autoplay after manual navigation
    pauseOnMouseEnter: true, // Pause when user hovers
}
```

**Customization Options:**
- **Change rotation speed**: Adjust `delay` value
  - `delay: 1500` = 1.5 seconds per card
  - `delay: 3000` = 3 seconds per card
  - `delay: 5000` = 5 seconds per card

- **Stop autoplay after manual interaction**: Set `disableOnInteraction: true`
  - User clicks arrow → autoplay stops permanently
  - User swipes → autoplay stops permanently

- **Keep autoplay running on hover**: Set `pauseOnMouseEnter: false`
  - Cards continue rotating even when user hovers
  - Not recommended for accessibility

### Loop Configuration

```javascript
loop: true, // Enable infinite loop
```

**What this does:**
- Creates seamless infinite cycling
- After Card 6, automatically loops back to Card 1
- No "jump back to start" visible to user
- Clones slides internally for smooth transitions

### Speed Configuration

```javascript
speed: 600, // Transition duration (milliseconds)
```

**Customization:**
- `speed: 400` = Fast transitions (0.4 seconds)
- `speed: 600` = Medium transitions (0.6 seconds) [RECOMMENDED]
- `speed: 800` = Slow transitions (0.8 seconds)
- `speed: 1000` = Very slow transitions (1 second)

---

## Testing Checklist

### Auto-Rotation Behavior
- [ ] Carousel automatically advances after 2 seconds
- [ ] Carousel cycles through all 6 cards sequentially
- [ ] After Card 6, carousel loops back to Card 1
- [ ] Loop continues infinitely without stopping

### User Interaction
- [ ] Hover over carousel → autoplay pauses
- [ ] Move mouse away → autoplay resumes
- [ ] Click arrow button → card changes, autoplay continues
- [ ] Swipe/drag card → card changes, autoplay continues
- [ ] Click pagination dot → jumps to card, autoplay continues

### Responsive Behavior
- [ ] Desktop: Autoplay works with multiple cards visible
- [ ] Tablet: Autoplay works with 2 cards visible
- [ ] Mobile: Autoplay works with single card visible

### Accessibility
- [ ] Keyboard navigation (arrow keys) still works
- [ ] Focus on card pauses autoplay (if optional enhancement added)
- [ ] Pause button has proper ARIA labels (if optional enhancement added)
- [ ] Screen reader announces slide changes

### Performance
- [ ] Smooth transitions without lag
- [ ] No memory leaks with infinite loop
- [ ] Works across all modern browsers

---

## Troubleshooting

### Issue: Autoplay Doesn't Start

**Possible Causes:**
1. **Swiper.js version incompatibility** - Ensure you're using Swiper 8+
2. **Autoplay module not loaded** - Verify Swiper bundle includes autoplay

**Fix:** Check your Swiper library import:
```html
<!-- Make sure you're using the BUNDLE version that includes autoplay -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
```

### Issue: Autoplay Stops After User Interaction

**Cause:** `disableOnInteraction` is set to `true` (default behavior)

**Fix:** Set it to `false`:
```javascript
autoplay: {
    delay: 2000,
    disableOnInteraction: false, // This keeps autoplay running
}
```

### Issue: Cards Jump or Stutter During Loop

**Cause:** `loop: true` requires at least 2x the number of `slidesPerView` slides

**Fix:** You have 6 cards, so this shouldn't be an issue. But if it happens:
1. Verify all 6 cards have proper HTML structure
2. Check for CSS conflicts affecting card width
3. Ensure `slidesPerView: 'auto'` is correctly configured

### Issue: Hover Pause Doesn't Work

**Cause:** `pauseOnMouseEnter` requires proper element targeting

**Fix:** Verify the carousel container has correct class:
```html
<div class="swiper stories-swiper">
    <!-- Autoplay will pause when hovering over this element -->
</div>
```

---

## Advanced Customizations

### Option 1: Progressive Speed (Slow Down Before Transition)

Make transitions feel more natural by slowing down before advancing:

```javascript
autoplay: {
    delay: 2000,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
    waitForTransition: true, // Wait for transition to complete before advancing
}
```

### Option 2: Random Slide Duration

Make each card stay for a different duration:

```javascript
const storiesSwiper = new Swiper('.stories-swiper', {
    // ... other config
    autoplay: {
        delay: 2000, // Base delay
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
    },
    on: {
        slideChange: function() {
            // Randomize delay between 1.5-3 seconds
            const randomDelay = Math.floor(Math.random() * 1500) + 1500;
            this.params.autoplay.delay = randomDelay;
        }
    }
});
```

### Option 3: Progress Bar Instead of Pagination

Replace dots with a progress bar showing time until next card:

**HTML:**
```html
<div class="stories-autoplay-progress">
    <span class="autoplay-progress-bar"></span>
</div>
```

**CSS:**
```css
.stories-autoplay-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: rgba(249, 111, 110, 0.2);
    z-index: 10;
}

.autoplay-progress-bar {
    display: block;
    height: 100%;
    background: var(--coral-accent);
    width: 0;
    transition: width 2000ms linear;
}
```

**JavaScript:**
```javascript
const progressBar = document.querySelector('.autoplay-progress-bar');

const storiesSwiper = new Swiper('.stories-swiper', {
    // ... other config
    on: {
        autoplayTimeLeft(swiper, time, percentage) {
            // Update progress bar width based on remaining time
            progressBar.style.width = (1 - percentage) * 100 + '%';
        }
    }
});
```

---

## Accessibility Considerations

### Reduced Motion Preference

Respect users who have motion sensitivity:

```javascript
// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const storiesSwiper = new Swiper('.stories-swiper', {
    // ... other config
    autoplay: prefersReducedMotion ? false : {
        delay: 2000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
    }
});
```

### ARIA Live Region

Announce slide changes to screen readers:

**HTML:**
```html
<div class="swiper stories-swiper" aria-live="polite" aria-atomic="true">
    <!-- Swiper content -->
</div>
```

**JavaScript:**
```javascript
const storiesSwiper = new Swiper('.stories-swiper', {
    // ... other config
    on: {
        slideChange: function() {
            // Announce current slide number to screen readers
            const currentSlide = this.realIndex + 1;
            const totalSlides = this.slides.length - (this.params.loop ? this.loopedSlides * 2 : 0);
            this.el.setAttribute('aria-label', `Slide ${currentSlide} of ${totalSlides}`);
        }
    }
});
```

---

## Performance Notes

### Battery Life Consideration

Infinite auto-rotation can drain battery on mobile devices. Consider:

1. **Pause when page not visible:**
```javascript
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        storiesSwiper.autoplay.stop();
    } else {
        storiesSwiper.autoplay.start();
    }
});
```

2. **Pause after certain number of cycles:**
```javascript
let cycleCount = 0;
const MAX_CYCLES = 3; // Stop after 3 complete cycles

storiesSwiper.on('slideChange', function() {
    if (this.realIndex === 0 && this.previousIndex === 5) {
        cycleCount++;
        if (cycleCount >= MAX_CYCLES) {
            this.autoplay.stop();
        }
    }
});
```

---

## Summary

**Minimum Implementation** (Just auto-rotation):
1. Update Swiper config with `loop: true` and `autoplay` settings
2. Test across devices

**Recommended Implementation** (With pause button):
1. Update Swiper config
2. Add pause/play button HTML
3. Add pause/play button CSS
4. Add pause/play button JavaScript
5. Test all interactions

**Advanced Implementation** (With accessibility):
1. All of the above
2. Add reduced motion detection
3. Add ARIA live region
4. Add visibility change detection
5. Comprehensive testing

---

**End of Document**
