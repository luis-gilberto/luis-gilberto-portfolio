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
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-animate]').forEach(el => {
        observer.observe(el);
    });
    
    // Trigger initial animations for hero elements
    setTimeout(() => {
        document.querySelectorAll('.hub-hero [data-animate]').forEach(el => {
            el.classList.add('visible');
        });
    }, 100);
});

// ===================================
// SMOOTH SCROLL
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
