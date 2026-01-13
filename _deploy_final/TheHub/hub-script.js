// Theme Toggle - Enhanced
const html = document.documentElement;
const themeToggleButtons = document.querySelectorAll('.theme-toggle');

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);
console.log('Initial theme loaded:', savedTheme);

// Handle all theme toggle buttons
themeToggleButtons.forEach((button, index) => {
    console.log('Theme button found:', index);
    button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        console.log('Toggling theme from', currentTheme, 'to', newTheme);
        
        html.setAttribute('data-theme', newTheme);
        
        try {
            localStorage.setItem('theme', newTheme);
            console.log('Theme saved successfully');
        } catch (error) {
            console.error('Failed to save theme:', error);
        }
    });
});

// Mobile Menu
const mobileToggle = document.getElementById('mobileMenuToggle');
const mobileOverlay = document.getElementById('mobileMenuOverlay');
const drawerCloseBtn = document.getElementById('drawerCloseBtn');

function openDrawer() {
    if (mobileOverlay) {
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeDrawer() {
    if (mobileOverlay) {
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);

// Close on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
});

// Scroll Animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('[data-animate]');
    console.log('Found animated elements:', animatedElements.length);
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Active State Logic for Mobile Menu
    const currentPath = window.location.pathname;
    const mobileLinks = document.querySelectorAll('.mobile-link');

    mobileLinks.forEach(link => {
        // Get the raw href
        const linkHref = link.getAttribute('href');
        if (!linkHref) return;

        // Resolve relative paths to absolute for comparison if needed, 
        // but simple string matching usually works if hrefs are root-relative (start with /)
        
        // Check for exact match
        if (currentPath === linkHref) {
            link.classList.add('active');
        } 
        // Handle /index.html vs /
        else if (linkHref.endsWith('/index.html') && currentPath === linkHref.replace('/index.html', '/')) {
            link.classList.add('active');
        }
        else if (currentPath.endsWith('/index.html') && linkHref === currentPath.replace('/index.html', '/')) {
            link.classList.add('active');
        }
        // Handle specific case for root
        else if (currentPath === '/' && linkHref === '/index.html') {
            link.classList.add('active');
        }
    });
});
