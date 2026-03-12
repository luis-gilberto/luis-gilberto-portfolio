// Partnership Toolkit JavaScript

// Global variables
let servicesData = [];
let investmentData = [];

// Function to stabilize card layout and remove animation delays
function stabilizeCardLayout() {
    // Remove animation delays that might cause issues
    const serviceCards = document.querySelectorAll('.service-card');
    const investmentCards = document.querySelectorAll('.investment-card');
    
    serviceCards.forEach((card, index) => {
        card.style.animationDelay = '0s'; // Remove staggered animations
    });
    
    investmentCards.forEach((card, index) => {
        card.style.animationDelay = '0s'; // Remove staggered animations
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    try {
        // Load data
        await loadData();
        
        // Initialize components
        initializeCustomCursor();
        initializeServiceCards();
        initializeInvestmentCards();
        initializeInvestmentPriceReveal();
        
        // Add this line to stabilize layout
        stabilizeCardLayout();
        
        initializeAnimations();
        
        // Show main content (remove if password protection not needed)
        showMainContent();
        
    } catch (error) {
        console.error('Failed to initialize app:', error);
    }
}

// Load data from JSON file
async function loadData() {
    try {
        const response = await fetch('partnership_data.json');
        const data = await response.json();
        
        servicesData = data.services;
        investmentData = data.investment;
        
    } catch (error) {
        console.error('Failed to load data:', error);
        // Fallback data
        loadFallbackData();
    }
}

// Fallback data if JSON fails to load
function loadFallbackData() {
    servicesData = [
        {
            title: "Go-to-Market Strategy",
            subtitle: "Market analysis and positioning",
            icon: "chart",
            details: [
                "Market analysis and segmentation",
                "Value proposition development",
                "Target audience identification",
                "Competitive landscape analysis",
                "Launch timeline and milestones"
            ]
        },
        {
            title: "Brand Positioning",
            subtitle: "Differentiation and messaging",
            icon: "tag",
            details: [
                "Brand differentiation strategy",
                "Core messaging framework",
                "Voice and tone guidelines",
                "Positioning statement development",
                "Brand architecture planning"
            ]
        },
        {
            title: "Campaign Execution",
            subtitle: "Creative and media strategy",
            icon: "megaphone",
            details: [
                "Creative concept development",
                "Multi-channel campaign planning",
                "Content strategy and creation",
                "Media planning and optimization",
                "Performance tracking and iteration"
            ]
        },
        {
            title: "Cross-Channel Narrative",
            subtitle: "Content strategy integration",
            icon: "message",
            details: [
                "Consistent messaging across channels",
                "Content calendar development",
                "Storytelling framework creation",
                "Cross-platform optimization",
                "Brand narrative evolution"
            ]
        }
    ];

    investmentData = [
        {
            id: "quick",
            title: "Quick-Start Sprint",
            price: "$4k–$8k",
            description: "Positioning audit, lightweight customer inputs, and a GTM roadmap you can run tomorrow.",
            duration: "2–4 weeks",
            tier: "foundation",
            details: [
                "Market positioning assessment",
                "Customer discovery interviews",
                "Competitive landscape analysis",
                "Go-to-market roadmap",
                "Messaging framework"
            ]
        },
        {
            id: "fractional",
            title: "Fractional Leadership",
            price: "$3k–$6k/mo",
            description: "Hands-on marketing leadership without full-time headcount.",
            duration: "3–6 months",
            tier: "foundation",
            details: [
                "Strategic planning",
                "Team guidance",
                "Campaign oversight",
                "Performance optimization",
                "Monthly strategy sessions"
            ]
        },
        {
            id: "launch",
            title: "Launch Campaign",
            price: "$12k–$25k",
            description: "Full campaign: strategy, creative, media, and measurement for your big moment.",
            duration: "6–12 weeks",
            tier: "premium",
            details: [
                "Campaign strategy",
                "Creative development",
                "Multi-channel execution",
                "Media planning",
                "Performance tracking"
            ]
        },
        {
            id: "growth",
            title: "Growth Partnership",
            price: "$8k–$15k/mo",
            description: "Ongoing campaign optimization, creative iteration, and growth experiments.",
            duration: "6+ months",
            tier: "premium",
            details: [
                "Campaign optimization",
                "A/B testing",
                "Creative iteration",
                "Growth strategy",
                "Performance reviews"
            ]
        },
        {
            id: "enterprise",
            title: "Select Partnerships",
            price: "By Application",
            description: "Strategic advisory for complex go-to-market challenges. Limited to 3 clients quarterly.",
            duration: "Project-based",
            tier: "exclusive",
            details: [
                "GTM strategy",
                "Executive advisory",
                "Team alignment",
                "Market entry planning",
                "Partnership benefits"
            ]
        },
        {
            id: "ally",
            title: "Founder's Circle",
            price: "$2k–$4k/mo",
            description: "Monthly strategy sessions, messaging reviews, and campaign guidance. Next availability: Q3 2025.",
            duration: "Ongoing",
            tier: "exclusive",
            details: [
                "Monthly strategy sessions",
                "Messaging reviews",
                "Campaign guidance",
                "Priority access",
                "Community access"
            ]
        }
    ];
}

// Custom Cursor
function initializeCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    if (!cursor || !follower) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursor.style.transform = `translate(${mouseX - 8}px, ${mouseY - 8}px)`;
    });
    
    // Smooth follower animation
    function animateFollower() {
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        
        follower.style.transform = `translate(${followerX - 16}px, ${followerY - 16}px)`;
        
        requestAnimationFrame(animateFollower);
    }
    
    animateFollower();
    
    // Hover effects
    const hoverElements = document.querySelectorAll('button, a, .service-card, .investment-card');
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform += ' scale(1.5)';
            follower.style.transform += ' scale(0.8)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = cursor.style.transform.replace(' scale(1.5)', '');
            follower.style.transform = follower.style.transform.replace(' scale(0.8)', '');
        });
    });
}



// Service Cards
function initializeServiceCards() {
    const container = document.getElementById('servicesGrid');
    if (!container) return;
    
    container.innerHTML = '';
    
    servicesData.forEach((service, index) => {
        const card = createServiceCard(service, index);
        container.appendChild(card);
    });
}

function createServiceCard(service, index) {
    const card = document.createElement('div');
    card.className = 'service-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    card.innerHTML = `
        <div class="rotation-hint">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
        </div>
        
        <div class="service-card-inner">
            <div class="service-card-front">
                <div class="service-icon">
                    ${getServiceIcon(service.icon)}
                </div>
                
                <div class="service-content">
                    <h3 class="service-title">${service.title}</h3>
                    <p class="service-subtitle">${service.subtitle}</p>
                </div>
                
                <div class="service-hint">
                    <span>Tap to explore</span>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                </div>
            </div>
            
            <div class="service-card-back">
                <div class="service-back-header">
                    <h4 class="service-back-title">${service.title}</h4>
                </div>
                
                <div class="service-details">
                    <ul>
                        ${service.details.map(detail => `
                            <li><span>${detail}</span></li>
                        `).join('')}
                    </ul>
                </div>
                
                <div class="service-back-hint">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                    <span>TAP TO RETURN</span>
                </div>
            </div>
        </div>
    `;
    
    // Add click handler
    const inner = card.querySelector('.service-card-inner');
    card.addEventListener('click', () => {
        inner.classList.toggle('flipped');
    });
    
    return card;
}

function getServiceIcon(iconType) {
    const icons = {
        chart: `<svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
        </svg>`,
        tag: `<svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
        </svg>`,
        megaphone: `<svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/>
        </svg>`,
        message: `<svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>`
    };
    
    return icons[iconType] || icons.chart;
}

// Investment Cards
function initializeInvestmentCards() {
    const container = document.getElementById('investmentGrid');
    if (!container) return;
    
    container.innerHTML = '';
    
    investmentData.forEach((investment, index) => {
        const card = createInvestmentCard(investment, index);
        container.appendChild(card);
    });
}

function createInvestmentCard(investment, index) {
    const card = document.createElement('div');
    card.className = `investment-card ${investment.tier}`;
    card.style.animationDelay = `${index * 0.05}s`;
    
    card.innerHTML = `
        <div class="rotation-hint">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
            </svg>
        </div>
        
        ${investment.tier === 'exclusive' ? '<div class="exclusive-badge">EXCLUSIVE</div>' : ''}
        
        <div class="investment-card-inner">
            <div class="investment-card-front">
                <h3 class="investment-title">${investment.title}</h3>
                
                <div class="investment-duration">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>${investment.duration}</span>
                </div>
                
                <div class="investment-description">
                    <p>${investment.description}</p>
                </div>
                
                <div class="investment-hint">
                    <span>Tap for investment</span>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                </div>
            </div>
            
            <div class="investment-card-back">
                <div class="investment-back-header">
                    <h4 class="investment-back-title">${investment.title}</h4>
                    <div class="investment-price">${investment.price.replace(/\$/g, '<span class="dollar-sign">$</span>')}</div>
                    <div class="investment-back-divider"></div>
                </div>
                
                <div class="investment-details">
                    <ul>
                        ${investment.details.map(detail => `
                            <li><span>${detail}</span></li>
                        `).join('')}
                    </ul>
                </div>
                
                <div class="investment-back-hint">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                    <span>Tap to return</span>
                </div>
            </div>
        </div>
    `;
    
    // Add click handler
    const inner = card.querySelector('.investment-card-inner');
    card.addEventListener('click', () => {
        inner.classList.toggle('flipped');
    });
    
    return card;
}

// Initialize animations
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);
    
    // Observe animated elements
    const animatedElements = document.querySelectorAll('[class*="fadeIn"], [class*="slideIn"]');
    animatedElements.forEach(el => observer.observe(el));
}

// Utility Functions
function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        // Could add a toast notification here
        console.log('Link copied to clipboard');
    }).catch(err => {
        console.error('Failed to copy link:', err);
    });
}

// Handle window resize
window.addEventListener('resize', debounce(() => {
    // Reinitialize components that need resize handling
    initializeCustomCursor();
}, 250));

// Debounce utility
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

// Handle visibility change
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when tab is not visible
        document.body.style.animationPlayState = 'paused';
    } else {
        // Resume animations when tab becomes visible
        document.body.style.animationPlayState = 'running';
    }
});

// Investment Price Reveal System
function initializeInvestmentPriceReveal() {
    const priceHint = document.getElementById('investmentPriceHint');
    const priceModal = document.getElementById('investmentPriceModal');
    const revealInput = document.getElementById('investmentRevealInput');
    
    if (!priceHint || !priceModal) return;
    
    // Show modal when hint is clicked
    priceHint.addEventListener('click', function() {
        priceModal.style.display = 'flex';
        setTimeout(() => revealInput.focus(), 100);
    });
    
    // Handle Enter key in input
    revealInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            revealInvestmentPrices();
        }
    });
    
    // Close modal when clicking outside
    priceModal.addEventListener('click', function(e) {
        if (e.target === priceModal) {
            closeInvestmentModal();
        }
    });
}

function closeInvestmentModal() {
    const priceModal = document.getElementById('investmentPriceModal');
    const revealInput = document.getElementById('investmentRevealInput');
    const revealError = document.getElementById('investmentRevealError');
    
    if (priceModal) priceModal.style.display = 'none';
    if (revealInput) revealInput.value = '';
    if (revealError) revealError.textContent = '';
}

function revealInvestmentPrices() {
    const revealInput = document.getElementById('investmentRevealInput');
    const revealError = document.getElementById('investmentRevealError');
    const investmentSection = document.querySelector('.investment-section');
    
    const validCodes = ['SHOWPRICES', 'PRICING', 'REVEAL', 'PARTNERSHIP'];
    const code = revealInput.value.trim().toUpperCase();
    
    if (validCodes.includes(code)) {
        if (investmentSection) investmentSection.classList.add('prices-revealed');
        closeInvestmentModal();
    } else {
        if (revealError) revealError.textContent = 'Invalid access code. Please try again.';
        if (revealInput) {
            revealInput.value = '';
            revealInput.focus();
        }
    }
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});
