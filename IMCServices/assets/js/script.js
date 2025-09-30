// Access Code Functionality
function checkAccess() {
    const input = document.getElementById('accessCode');
    const errorMessage = document.getElementById('errorMessage');
    const overlay = document.getElementById('gatewayOverlay');
    const mainContent = document.getElementById('mainContent');

    if (input.value.toUpperCase() === 'LG100') {
        overlay.classList.add('hidden');
        mainContent.classList.remove('hidden');
        
        // Initialize evolving text animations
        initializeAnimations();
        
        // Initialize navigation
        initializeNavigation();
    } else {
        errorMessage.classList.remove('hidden');
        input.value = '';
        input.focus();
    }
}

// Initialize Evolving Text Animations
function initializeAnimations() {
    // Enhanced evolving text effect on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const letters = entry.target.querySelectorAll('.letter');
                letters.forEach((letter, index) => {
                    letter.style.animationDelay = `${index * 0.1}s`;
                    letter.style.animationDuration = '2s';
                });
            }
        });
    }, observerOptions);

    // Observe all evolving text elements
    document.querySelectorAll('.evolving-text').forEach(el => {
        observer.observe(el);
    });
}

// Initialize Navigation
function initializeNavigation() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            // Add mobile menu functionality here if needed
            console.log('Mobile menu clicked');
        });
    }

    // Active navigation highlighting
    setActiveNavLink();
    
    // Update active nav on scroll
    window.addEventListener('scroll', setActiveNavLink);
}

// Set Active Navigation Link
function setActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('text-brand-coral', 'font-semibold');
        link.classList.add('text-gray-300');
        
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.remove('text-gray-300');
            link.classList.add('text-brand-coral', 'font-semibold');
        }
    });
}

// Enhanced Hover Effects
function initializeHoverEffects() {
    // Partnership card hover effects
    document.querySelectorAll('.partnership-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            const evolvingText = this.querySelector('.evolving-text');
            if (evolvingText) {
                const letters = evolvingText.querySelectorAll('.letter');
                letters.forEach((letter, index) => {
                    letter.style.animationDelay = `${index * 0.05}s`;
                    letter.style.animationDuration = '1s';
                });
            }
        });
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Allow Enter key to submit access code
    const accessCodeInput = document.getElementById('accessCode');
    if (accessCodeInput) {
        accessCodeInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkAccess();
            }
        });
        
        // Focus on input when page loads
        accessCodeInput.focus();
    }
    
    // Initialize hover effects
    initializeHoverEffects();
});

// Intersection Observer for scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe all partnership cards
    document.querySelectorAll('.partnership-card').forEach(card => {
        observer.observe(card);
    });
}

// Initialize scroll animations when main content is shown
function initializeAllAnimations() {
    initializeAnimations();
    initializeScrollAnimations();
    initializeNavigation();
}

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(setActiveNavLink, 100);

// Replace the scroll event listener with the optimized version
window.addEventListener('scroll', optimizedScrollHandler);