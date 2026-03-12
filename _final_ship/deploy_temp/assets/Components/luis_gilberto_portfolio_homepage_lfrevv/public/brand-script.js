// ===================================
// THEME TOGGLE
// ===================================
const themeToggle = document.getElementById('themeToggle');
const mobileThemeToggle = document.getElementById('mobileThemeToggle');
const bodyElement = document.body;

const currentTheme = localStorage.getItem('theme') || 'dark';
bodyElement.setAttribute('data-theme', currentTheme);

function toggleTheme() {
    const current = bodyElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    bodyElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
}

if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

if (mobileThemeToggle) {
    mobileThemeToggle.addEventListener('click', toggleTheme);
}

// ===================================
// MOBILE MENU TOGGLE
// ===================================
const mobileMenuToggle = document.getElementById('mobileMenuToggle');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        // Add your mobile menu logic here
    });
}

// ===================================
// SCROLL ANIMATIONS
// ===================================
const observerOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all elements with data-animate
document.querySelectorAll('[data-animate]').forEach(el => {
    observer.observe(el);
});

// ===================================
// NAV SCROLL EFFECT
// ===================================
let lastScroll = 0;
const nav = document.querySelector('.primary-nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ===================================
// PARALLAX EFFECT ON SCROLL
// ===================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll('.shape');
    
    shapes.forEach((shape, index) => {
        const speed = 0.5 + (index * 0.2);
        const yPos = -(scrolled * speed);
        shape.style.transform = `translateY(${yPos}px)`;
    });
});

// ===================================
// COLOR SWATCH CLICK TO COPY
// ===================================
document.querySelectorAll('.color-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
        const hexCode = swatch.closest('.color-card').querySelector('.hex-code').textContent;
        
        if (hexCode && !hexCode.includes('→')) {
            navigator.clipboard.writeText(hexCode).then(() => {
                // Visual feedback
                const label = swatch.querySelector('.swatch-label');
                const originalText = label.textContent;
                label.textContent = 'COPIED!';
                
                setTimeout(() => {
                    label.textContent = originalText;
                }, 1500);
            });
        }
    });
});

// ===================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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

// ===================================
// HOVER EFFECTS FOR FOOTER LINKS
// ===================================
document.querySelectorAll('footer a').forEach(link => {
    link.addEventListener('mouseenter', function() {
        this.style.color = 'white';
    });
    link.addEventListener('mouseleave', function() {
        if (!this.style.color.includes('F96F6E') && !this.style.color.includes('2ED3C6')) {
            this.style.color = 'rgba(255,255,255,0.75)';
        }
    });
});

// ===================================
// INITIALIZE ON LOAD
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    // Trigger initial animations
    setTimeout(() => {
        document.querySelectorAll('[data-animate]').forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight) {
                el.classList.add('visible');
            }
        });
    }, 100);
});
