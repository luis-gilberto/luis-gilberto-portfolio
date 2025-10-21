/* ================================
   IMC Services Page JavaScript
   ================================ */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initHeroIcon();
    initScrollAnimations();
    initSmoothScroll();
});

/* ================================
   Navigation
   ================================ */
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Animate hamburger menu
            const spans = navToggle.querySelectorAll('span');
            if (navToggle.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close menu when clicking a link
        const allNavLinks = navLinks.querySelectorAll('.nav-link');
        allNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
                
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }
    
    // Handle scroll behavior for nav background
    let lastScroll = 0;
    const nav = document.querySelector('.hub-nav');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            nav.style.background = 'rgba(10, 10, 10, 0.95)';
            nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            nav.style.background = 'rgba(10, 10, 10, 0.8)';
            nav.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });
}

/* ================================
   Hero Icon Loading & Animation
   ================================ */
function initHeroIcon() {
    const heroIcon = document.querySelector('.hero-icon');
    
    if (!heroIcon) return;
    
    const iconFileName = heroIcon.getAttribute('data-icon-src');
    
    // Check if icon exists in AI Drive
    const iconSources = [
        `/api/aidrive/file/IMC_Services_Sophisticated.png`,
        `/aidrive/IMC_Services_Sophisticated.png`,
        `https://page.gensparksite.com/v1/base64_upload/IMC_Services_Sophisticated.png`
    ];
    
    // Try loading the icon from different possible paths
    loadIconWithFallback(heroIcon, iconSources, 0);
}

function loadIconWithFallback(iconElement, sources, index) {
    if (index >= sources.length) {
        console.log('Icon not found, using placeholder');
        return;
    }
    
    const img = new Image();
    img.onload = function() {
        iconElement.src = sources[index];
        iconElement.classList.add('loaded');
        
        // Trigger entrance animation
        setTimeout(() => {
            iconElement.style.animation = 'icon-entrance 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards, float-hero-icon 9s ease-in-out 1.2s infinite';
        }, 100);
        
        console.log('✅ Icon loaded successfully from:', sources[index]);
    };
    
    img.onerror = function() {
        console.log('❌ Failed to load from:', sources[index]);
        // Try next source
        loadIconWithFallback(iconElement, sources, index + 1);
    };
    
    img.src = sources[index];
}

/* ================================
   Scroll Animations
   ================================ */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all cards and major elements
    const animatedElements = document.querySelectorAll(`
        .promise-card,
        .capability-card,
        .process-step,
        .partner-card,
        .case-study-card,
        .cta-card
    `);
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // Hero elements fade in on load
    const heroElements = document.querySelectorAll(`
        .hero-eyebrow,
        .hero-title,
        .hero-subtitle,
        .hero-cta-group,
        .hero-stats
    `);
    
    heroElements.forEach((el, index) => {
        setTimeout(() => {
            el.style.animation = `fadeInUp 0.8s ease-out ${index * 0.1}s forwards`;
            el.style.opacity = '0';
        }, 100);
    });
}

/* ================================
   Smooth Scroll
   ================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            e.preventDefault();
            
            const target = document.querySelector(href);
            if (target) {
                const navHeight = document.querySelector('.hub-nav').offsetHeight;
                const targetPosition = target.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ================================
   Icon Entrance Animation Keyframes
   (Added via JS since it's triggered programmatically)
   ================================ */
const iconEntranceStyle = document.createElement('style');
iconEntranceStyle.textContent = `
    @keyframes icon-entrance {
        0% {
            opacity: 0;
            transform: scale(0.5) rotate(-15deg);
            filter: brightness(2) saturate(2) drop-shadow(0 0 80px rgba(249, 111, 110, 0.8));
        }
        60% {
            opacity: 0.15;
            transform: scale(1.05) rotate(2deg);
        }
        100% {
            opacity: 0.95;
            transform: scale(1) rotate(0deg);
            filter: brightness(1.2) saturate(1.1) drop-shadow(0 0 50px rgba(249, 111, 110, 0.4));
        }
    }
`;
document.head.appendChild(iconEntranceStyle);

/* ================================
   Stats Counter Animation (Optional Enhancement)
   ================================ */
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const targetText = stat.textContent;
        
        // Only animate if it's a number
        const match = targetText.match(/(\d+)/);
        if (match) {
            const targetValue = parseInt(match[0]);
            const suffix = targetText.replace(match[0], '');
            let current = 0;
            const increment = targetValue / 50;
            const duration = 1500;
            const stepTime = duration / 50;
            
            const counter = setInterval(() => {
                current += increment;
                if (current >= targetValue) {
                    stat.textContent = targetValue + suffix;
                    clearInterval(counter);
                } else {
                    stat.textContent = Math.floor(current) + suffix;
                }
            }, stepTime);
        }
    });
}

// Trigger stats animation when hero comes into view
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            setTimeout(animateStats, 500);
            heroObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    heroObserver.observe(heroStats);
}

/* ================================
   Console Welcome Message
   ================================ */
console.log('%c🎨 IMC Services Page', 'font-size: 20px; font-weight: bold; color: #F96F6E;');
console.log('%cWhere Strategy Meets Creative Excellence', 'font-size: 14px; color: #2ED3C6;');
console.log('%c\nBuilt with ❤️ by The Hub', 'font-size: 12px; color: #999;');