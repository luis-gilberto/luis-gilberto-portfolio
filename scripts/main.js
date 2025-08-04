// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Set active navigation link based on current page
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current page link
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        
        // Handle different page scenarios
        if ((currentPage === 'index.html' || currentPage === '') && (href === '#' || href === 'index.html')) {
            link.classList.add('active');
        } else if (href === currentPage) {
            link.classList.add('active');
        } else if ((currentPage.startsWith('case-study-') || currentPage.startsWith('caseStudy_')) && href === 'myexperience.html') {
            // Case studies are part of the experience section
            link.classList.add('active');
        }
    });
}

// Set active nav link on page load
document.addEventListener('DOMContentLoaded', setActiveNavLink);

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

// Navbar background remains consistent - no scroll changes

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.tour-card, .about-content, .whats-next');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Progress bar animations
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    progressBars.forEach(bar => {
        const percentage = bar.getAttribute('data-percentage');
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.width = percentage + '%';
        }, 500);
    });
}

// Intersection Observer for progress bars
const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateProgressBars();
            progressObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Scroll Indicator with enhanced behavior
let scrollInactivityTimer;
let initialPulseTimer;
let isScrollIndicatorVisible = true;
let hasInitialPulseShown = false;

function handleScrollIndicator() {
    const scrollIndicator = document.getElementById('scrollIndicator');
    if (!scrollIndicator) return;
    
    const scrollThreshold = 200; // Hide after scrolling 200px
    const scrollY = window.scrollY;
    
    // Clear any existing inactivity timer
    if (scrollInactivityTimer) {
        clearTimeout(scrollInactivityTimer);
    }
    
    // Remove flashing state when user scrolls
    scrollIndicator.classList.remove('flashing');
    
    if (scrollY > scrollThreshold) {
        scrollIndicator.classList.add('hidden');
        isScrollIndicatorVisible = false;
        
        // Set timer to show indicator again after 30 seconds of inactivity
        scrollInactivityTimer = setTimeout(() => {
            if (window.scrollY > scrollThreshold) {
                scrollIndicator.classList.remove('hidden');
                scrollIndicator.classList.add('flashing');
                isScrollIndicatorVisible = true;
                
                // Auto-hide after 3 seconds of flashing
                setTimeout(() => {
                    scrollIndicator.classList.remove('flashing');
                    scrollIndicator.classList.add('hidden');
                    isScrollIndicatorVisible = false;
                }, 3000);
            }
        }, 30000); // 30 seconds
    } else {
        scrollIndicator.classList.remove('hidden', 'flashing');
        isScrollIndicatorVisible = true;
    }
}

function initializeScrollIndicator() {
    const scrollIndicator = document.getElementById('scrollIndicator');
    if (!scrollIndicator || hasInitialPulseShown) return;
    
    // Show initial pulse for 3 seconds, then fade away
    scrollIndicator.classList.add('flashing');
    hasInitialPulseShown = true;
    
    initialPulseTimer = setTimeout(() => {
        scrollIndicator.classList.remove('flashing');
        scrollIndicator.classList.add('hidden');
        isScrollIndicatorVisible = false;
    }, 3000); // 3 seconds initial pulse
}

// Throttle scroll events for better performance
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(handleScrollIndicator, 10);
});

// Portrait fade on scroll
window.addEventListener('scroll', function() {
    const scrollPosition = window.pageYOffset;
    const portraitElement = document.querySelector('.hero-portrait');
    
    if (portraitElement && window.innerWidth <= 768) {
        // Fade out portrait as user scrolls (starts at 0.25, fades to 0.05)
        const fadeStart = 0;
        const fadeEnd = 400;
        const fadeAmount = Math.max(0.05, 0.25 - (scrollPosition / fadeEnd) * 0.2);
        
        portraitElement.style.opacity = fadeAmount;
    }
});

// Video Modal Functionality
class VideoModal {
    constructor() {
        this.modal = document.querySelector('.video-modal');
        this.overlay = document.querySelector('.video-modal-overlay');
        this.closeBtn = document.querySelector('.video-modal-close');
        this.prevBtn = document.querySelector('.video-nav-prev');
        this.nextBtn = document.querySelector('.video-nav-next');
        this.modalVideo = document.querySelector('.video-modal-player');
        this.modalTitle = document.querySelector('.video-modal-title');
        this.modalDescription = document.querySelector('.video-modal-description');
        this.videos = document.querySelectorAll('.video-item');
        this.currentIndex = 0;
        
        this.init();
    }
    
    init() {
        if (!this.modal || this.videos.length === 0) return;
        
        // Add click listeners to video items
        this.videos.forEach((video, index) => {
            video.addEventListener('click', () => {
                this.openModal(index);
            });
        });
        
        // Modal controls
        this.closeBtn?.addEventListener('click', () => this.closeModal());
        this.overlay?.addEventListener('click', () => this.closeModal());
        this.prevBtn?.addEventListener('click', () => this.previousVideo());
        this.nextBtn?.addEventListener('click', () => this.nextVideo());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.modal?.classList.contains('active')) return;
            
            switch(e.key) {
                case 'Escape':
                    this.closeModal();
                    break;
                case 'ArrowLeft':
                    this.previousVideo();
                    break;
                case 'ArrowRight':
                    this.nextVideo();
                    break;
            }
        });
    }
    
    openModal(index) {
        this.currentIndex = index;
        this.updateModalContent();
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Play the video
        if (this.modalVideo) {
            this.modalVideo.play();
        }
    }
    
    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Pause the video
        if (this.modalVideo) {
            this.modalVideo.pause();
        }
    }
    
    nextVideo() {
        this.currentIndex = (this.currentIndex + 1) % this.videos.length;
        this.updateModalContent();
    }
    
    previousVideo() {
        this.currentIndex = (this.currentIndex - 1 + this.videos.length) % this.videos.length;
        this.updateModalContent();
    }
    
    updateModalContent() {
        const currentVideo = this.videos[this.currentIndex];
        const videoElement = currentVideo.querySelector('video');
        const description = currentVideo.querySelector('.video-description');
        
        if (videoElement && this.modalVideo) {
            // Copy video source
            this.modalVideo.src = videoElement.src;
            this.modalVideo.load();
            this.modalVideo.play();
        }
        
        if (description) {
            const title = description.querySelector('h4');
            const desc = description.querySelector('p');
            
            if (title && this.modalTitle) {
                this.modalTitle.textContent = title.textContent;
            }
            
            if (desc && this.modalDescription) {
                this.modalDescription.textContent = desc.textContent;
            }
        }
    }
}

// Initialize video modal when DOM is loaded
// Note: VideoModal disabled to prevent conflict with VideoModalCarousel in video-modal.js
// document.addEventListener('DOMContentLoaded', () => {
//     new VideoModal();
// });

// Preloader (optional)
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Observe progress charts for animation
    const performanceSection = document.querySelector('.performance-charts');
    if (performanceSection) {
        progressObserver.observe(performanceSection);
    }
    
    // Initialize scroll indicator
    initializeScrollIndicator();
});