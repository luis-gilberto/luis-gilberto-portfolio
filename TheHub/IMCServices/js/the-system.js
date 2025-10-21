/**
 * The System - Interactive JavaScript
 * Handles scroll animations, intersection observers, and interactive effects
 */

// ===================================
// Scroll Animation Observer
// ===================================

const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.fade-in-up');
    fadeElements.forEach(el => animateOnScroll.observe(el));
});

// ===================================
// Smooth Scroll for Navigation
// ===================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Skip if href is just "#"
        if (href === '#') return;
        
        e.preventDefault();
        
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            const navHeight = document.querySelector('.main-nav').offsetHeight;
            const targetPosition = targetElement.offsetTop - navHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// Navigation Active State on Scroll
// ===================================

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.pageYOffset + 200;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===================================
// Parallax Effect for Background Orbs
// ===================================

let ticking = false;

function updateParallax() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-section');
    
    if (hero) {
        const parallaxElements = hero.querySelectorAll('::before, ::after');
        const speed = 0.5;
        const yPos = -(scrolled * speed);
        
        hero.style.transform = `translateY(${yPos}px)`;
    }
    
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
    }
});

// ===================================
// Glass Card Tilt Effect on Mouse Move
// ===================================

const glassCards = document.querySelectorAll('.glass-card');

glassCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ===================================
// Typing Animation for Hero Tagline
// ===================================

function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Trigger typing animation when hero is visible
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const tagline = entry.target.querySelector('.hero-tagline');
            if (tagline && !tagline.classList.contains('typed')) {
                tagline.classList.add('typed');
                const originalText = tagline.textContent;
                setTimeout(() => {
                    typeWriter(tagline, originalText, 50);
                }, 1000);
            }
        }
    });
}, { threshold: 0.5 });

const heroSection = document.querySelector('.hero-section');
if (heroSection) {
    heroObserver.observe(heroSection);
}

// ===================================
// Counter Animation for Numbers
// ===================================

function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    
    updateCounter();
}

// ===================================
// Ecosystem Flow Animation
// ===================================

const flowObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const flowItems = entry.target.querySelectorAll('.flow-item');
            const arrows = entry.target.querySelectorAll('.flow-arrow');
            
            flowItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('visible');
                }, index * 200);
            });
            
            arrows.forEach((arrow, index) => {
                setTimeout(() => {
                    arrow.style.opacity = '1';
                    arrow.style.transform = 'scale(1)';
                }, (index + 1) * 200);
            });
        }
    });
}, { threshold: 0.3 });

const ecosystemDiagram = document.querySelector('.ecosystem-diagram');
if (ecosystemDiagram) {
    // Set initial state for arrows
    const arrows = ecosystemDiagram.querySelectorAll('.flow-arrow');
    arrows.forEach(arrow => {
        arrow.style.opacity = '0';
        arrow.style.transform = 'scale(0)';
        arrow.style.transition = 'all 0.5s ease';
    });
    
    flowObserver.observe(ecosystemDiagram);
}

// ===================================
// Scroll Progress Indicator
// ===================================

const progressBar = document.createElement('div');
progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--coral), var(--teal));
    z-index: 9999;
    transition: width 0.1s ease;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
});

// ===================================
// Magnetic Button Effect
// ===================================

const buttons = document.querySelectorAll('.btn');

buttons.forEach(button => {
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = '';
    });
});

// ===================================
// Arm Section Sequential Reveal
// ===================================

const armSections = document.querySelectorAll('.arm-section');

const armObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const header = entry.target.querySelector('.arm-header');
            const card = entry.target.querySelector('.arm-glass-card');
            const icon = entry.target.querySelector('.arm-icon');
            
            if (icon) {
                // Add entrance animation for icons
                setTimeout(() => {
                    icon.style.animation = 'icon-entrance 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards, float-icon 8s ease-in-out 1.2s infinite';
                }, 50);
            }
            
            if (header) {
                setTimeout(() => {
                    header.classList.add('visible');
                }, 100);
            }
            
            if (card) {
                setTimeout(() => {
                    card.classList.add('visible');
                }, 300);
            }
        }
    });
}, { threshold: 0.2 });

armSections.forEach(section => {
    armObserver.observe(section);
});

// Add icon entrance keyframes dynamically
const iconStyle = document.createElement('style');
iconStyle.textContent = `
    @keyframes icon-entrance {
        from {
            opacity: 0;
            transform: scale(0.5) rotate(-90deg);
        }
        to {
            opacity: 1;
            transform: scale(1) rotate(0deg);
        }
    }
`;
document.head.appendChild(iconStyle);

// ===================================
// Easter Egg: Konami Code
// ===================================

let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Easter egg activated!
        document.body.style.animation = 'rainbow 3s ease infinite';
        
        // Add rainbow animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow {
                0%, 100% { filter: hue-rotate(0deg); }
                50% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 3000);
    }
});

// ===================================
// Performance: Lazy Load Images
// ===================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===================================
// Mobile Menu Toggle (if needed)
// ===================================

function createMobileMenu() {
    const nav = document.querySelector('.main-nav');
    const navLinks = document.querySelector('.nav-links');

    // Guard: if navigation elements are not present, skip setup
    if (!nav || !navLinks) return;

    if (window.innerWidth <= 768 && !document.querySelector('.mobile-menu-toggle')) {
        const toggle = document.createElement('button');
        toggle.className = 'mobile-menu-toggle';
        toggle.innerHTML = '☰';
        toggle.style.cssText = `
            display: block;
            background: none;
            border: none;
            color: var(--ink);
            font-size: 2rem;
            cursor: pointer;
            padding: 0.5rem;
        `;

        toggle.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            if (navLinks.style.display === 'flex') {
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.right = '0';
                navLinks.style.flexDirection = 'column';
                navLinks.style.background = 'rgba(10, 10, 10, 0.95)';
                navLinks.style.padding = '2rem';
                navLinks.style.backdropFilter = 'blur(20px)';
            }
        });

        const navContainer = nav.querySelector('.nav-container');
        if (!navContainer) return;
        navContainer.appendChild(toggle);
    }
}

window.addEventListener('resize', createMobileMenu);
createMobileMenu();

// ===================================
// Admin Mode Toggle with Password Protection
// ===================================

let adminModeActive = false;
const ADMIN_PASSWORD = 'LG100';

const adminToggleBtn = document.getElementById('admin-toggle');
const adminContents = document.querySelectorAll('.admin-content');

adminToggleBtn.addEventListener('click', () => {
    if (!adminModeActive) {
        // Prompt for password
        const password = prompt('Enter admin password:');
        
        if (password === ADMIN_PASSWORD) {
            adminModeActive = true;
            adminToggleBtn.classList.add('active');
            
            // Show all admin content
            adminContents.forEach(content => {
                content.style.display = 'block';
            });
            
            // Store in session
            sessionStorage.setItem('adminMode', 'true');
            
            console.log('%c🔓 Admin Mode Activated', 'font-size: 16px; font-weight: bold; color: #F96F6E;');
        } else if (password !== null) {
            alert('Incorrect password');
        }
    } else {
        // Deactivate admin mode
        adminModeActive = false;
        adminToggleBtn.classList.remove('active');
        
        // Hide all admin content
        adminContents.forEach(content => {
            content.style.display = 'none';
        });
        
        // Remove from session
        sessionStorage.removeItem('adminMode');
        
        console.log('%c🔒 Admin Mode Deactivated', 'font-size: 16px; color: #999;');
    }
});

// Check if admin mode was previously activated in this session
if (sessionStorage.getItem('adminMode') === 'true') {
    adminModeActive = true;
    adminToggleBtn.classList.add('active');
    adminContents.forEach(content => {
        content.style.display = 'block';
    });
}

// ===================================
// Console Message (Developer Easter Egg)
// ===================================

console.log('%c🚀 The Hub - Built for what\'s next', 'font-size: 20px; font-weight: bold; color: #F96F6E;');
console.log('%cLooking for something? Let\'s build it together.', 'font-size: 14px; color: #2ED3C6;');
console.log('%cDesigned & built by Luis Gilberto Sánchez', 'font-size: 12px; color: rgba(255,255,255,0.6);');