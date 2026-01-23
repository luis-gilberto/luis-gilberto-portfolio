// Luis Gilberto - Immersive Portfolio JavaScript

// Track orders for different audience moods
const TRACK_ORDERS = {
    recruiter: ['timeline', 'projects', 'how', 'essays', 'contact'],
    partner: ['projects', 'how', 'timeline', 'essays', 'contact'],
    inspiration: ['projects', 'essays', 'timeline', 'how', 'contact']
};

// Initialize immersive scroll animation
function initImmersive() {
    const hero = document.getElementById('immersiveHero');
    if (!hero) return;
    
    const imgs = hero.querySelectorAll('.hero__img');
    const endcap = hero.querySelector('.hero__endcap');
    
    // Preload images for smooth animation
    imgs.forEach(img => {
        const preloadImg = new Image();
        preloadImg.src = img.src;
    });
    
    function onScroll() {
        const rect = hero.getBoundingClientRect();
        const vh = window.innerHeight;
        const end = rect.height - vh;
        const progress = Math.max(0, Math.min(1, (vh - rect.top) / (end || 1)));
        
        // Animate images with different scaling rates
        imgs.forEach(img => {
            const maxScale = parseFloat(getComputedStyle(img).getPropertyValue('--maxScale')) || 6;
            const scale = 1 + progress * (maxScale - 1);
            const alpha = 1 - progress * 1.1;
            
            img.style.setProperty('--scale', scale.toFixed(3));
            img.style.setProperty('--alpha', Math.max(0, alpha).toFixed(3));
        });
        
        // Animate endcap (content that appears at the end)
        const endStart = 0.8;
        const endProgress = Math.max(0, (progress - endStart) / (1 - endStart));
        endcap.style.setProperty('--endScale', (0.8 + 0.2 * endProgress).toFixed(3));
        endcap.style.setProperty('--endAlpha', endProgress.toFixed(3));
    }
    
    // Use passive scroll listener for better performance
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Initial call to set up the scene
    onScroll();
}

// Apply track selection and reorder content
function applyTrack(track) {
    const content = document.getElementById('pageContent');
    const sections = {};
    
    // Collect all sections
    [...content.children].forEach(sec => {
        sections[sec.dataset.section] = sec;
    });
    
    // Reorder sections based on selected track
    TRACK_ORDERS[track].forEach(key => {
        if (sections[key]) {
            content.appendChild(sections[key]);
        }
    });
    
    // Store selection in localStorage for persistence
    localStorage.setItem('lg_track', track);
    
    // Add visual feedback
    document.querySelectorAll('.selector__card').forEach(card => {
        card.classList.remove('selected');
    });
    
    const selectedCard = document.querySelector(`[data-track="${track}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    // Smooth scroll to content
    setTimeout(() => {
        content.scrollIntoView({ behavior: 'smooth' });
    }, 300);
}

// Initialize mood selector
function initMoodSelector() {
    const selector = document.getElementById('trackSelector');
    if (!selector) return;
    
    // Handle card clicks
    selector.addEventListener('click', (e) => {
        const card = e.target.closest('.selector__card');
        if (card && card.dataset.track) {
            applyTrack(card.dataset.track);
        }
    });
    
    // Handle keyboard navigation
    selector.addEventListener('keydown', (e) => {
        const card = e.target.closest('.selector__card');
        if (card && e.key === 'Enter' && card.dataset.track) {
            applyTrack(card.dataset.track);
        }
    });
    
    // Make cards focusable
    document.querySelectorAll('.selector__card').forEach(card => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
    });
}

// Restore previous track selection
function restoreTrackSelection() {
    const savedTrack = localStorage.getItem('lg_track');
    if (savedTrack && TRACK_ORDERS[savedTrack]) {
        applyTrack(savedTrack);
    }
}

// Smooth scroll for CTA buttons
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Performance monitoring
function initPerformanceMonitoring() {
    // Monitor scroll performance
    let scrollTimeout;
    let isScrolling = false;
    
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            isScrolling = true;
            requestAnimationFrame(() => {
                isScrolling = false;
            });
        }
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // Scroll ended - could trigger lazy loading here
        }, 150);
    }, { passive: true });
}

// Intersection Observer for performance optimization
function initIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });
    
    // Observe content sections
    document.querySelectorAll('#pageContent section').forEach(section => {
        observer.observe(section);
    });
}

// Error handling for missing images
function initImageErrorHandling() {
    document.querySelectorAll('.hero__img').forEach(img => {
        img.addEventListener('error', () => {
            console.warn(`Failed to load image: ${img.src}`);
            img.style.opacity = '0';
        });
        
        img.addEventListener('load', () => {
            img.style.opacity = img.style.getPropertyValue('--alpha') || '1';
        });
    });
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Core functionality
    initImmersive();
    initMoodSelector();
    initSmoothScroll();
    
    // Performance and UX enhancements
    initPerformanceMonitoring();
    initIntersectionObserver();
    initImageErrorHandling();
    
    // Restore previous state
    restoreTrackSelection();
    
    // Add loaded class for CSS transitions
    document.body.classList.add('loaded');
});

// Handle window resize for responsive behavior
window.addEventListener('resize', () => {
    // Debounce resize events
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(() => {
        // Recalculate scroll positions if needed
        const scrollEvent = new Event('scroll');
        window.dispatchEvent(scrollEvent);
    }, 250);
});

// Export functions for potential external use
window.LuisPortfolio = {
    applyTrack,
    initImmersive,
    initMoodSelector
};