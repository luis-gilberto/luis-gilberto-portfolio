// ========================================
// THEME TOGGLE
// ========================================
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);
themeToggle.setAttribute('aria-pressed', currentTheme === 'dark' ? 'true' : 'false');

themeToggle.addEventListener('click', () => {
    const theme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    
    const footerLogo = document.querySelector('.footer-logo');
    if (footerLogo) {
        footerLogo.src = theme === 'dark' 
            ? 'assets/images/Logomark_White_a.png' 
            : 'assets/images/Logomark_Black_a.png';
    }
    const isDark = theme === 'dark';
    if (isDark) initParticleCanvas(); else destroyParticles();
});

window.addEventListener('DOMContentLoaded', () => {
    const footerLogo = document.querySelector('.footer-logo');
    if (footerLogo) {
        footerLogo.src = currentTheme === 'dark'
            ? 'assets/images/Logomark_White_a.png'
            : 'assets/images/Logomark_Black_a.png';
    }
});

// ========================================
// SET CURRENT YEAR
// ========================================
document.getElementById('currentYear').textContent = new Date().getFullYear();

// ========================================
// NAVIGATION BEHAVIOR
// ========================================
const primaryNav = document.getElementById('primaryNav');
const mobileToggle = document.getElementById('mobileToggle');
const mobileOverlay = document.getElementById('mobileOverlay');

window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
        primaryNav.classList.add('scrolled');
    } else {
        primaryNav.classList.remove('scrolled');
    }
});

const drawerCloseBtn = document.getElementById('drawerCloseBtn');
function focusTrap(container) { const focusable = container.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'); const first = focusable[0]; const last = focusable[focusable.length - 1]; container.addEventListener('keydown', (e) => { if (e.key !== 'Tab') return; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } }); }
function openDrawer() { if (mobileOverlay) { mobileOverlay.classList.add('active'); mobileOverlay.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; focusTrap(mobileOverlay); if (drawerCloseBtn) drawerCloseBtn.focus(); } if (mobileToggle) { mobileToggle.setAttribute('aria-expanded', 'true'); mobileToggle.classList.add('active'); } }
function closeDrawer() { if (mobileOverlay) { mobileOverlay.classList.remove('active'); mobileOverlay.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; } if (mobileToggle) { mobileToggle.setAttribute('aria-expanded', 'false'); mobileToggle.classList.remove('active'); mobileToggle.focus(); } }
if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });
if (mobileOverlay) {
    mobileOverlay.addEventListener('click', (e) => { if (e.target === mobileOverlay) closeDrawer(); });
}

// ========================================
// HERO ANIMATION
// ========================================
function startHeroAnimation() {
    const heroTiles = document.querySelectorAll('.hero-tile');
    const heroSection = document.getElementById('heroSection');
    const coralFormation = document.getElementById('coralFormation');
    const finalPeriod = document.getElementById('finalPeriod');
    const tilesContainer = document.getElementById('heroTilesContainer');

    setTimeout(() => {
        heroTiles.forEach((tile, index) => {
            setTimeout(() => {
                tile.classList.add('phase-1');
                tile.classList.add(`tile-${index + 1}-entry`);
            }, index * 150);
        });
    }, 200);

    setTimeout(() => {
        heroTiles.forEach(tile => {
            tile.classList.remove('phase-1');
            tile.classList.remove('tile-1-entry', 'tile-2-entry', 'tile-3-entry', 'tile-4-entry', 'tile-5-entry');
            tile.classList.add('phase-2');
        });
    }, 1200);

    setTimeout(() => {
        heroTiles.forEach((tile, index) => {
            tile.classList.remove('phase-2');
            tile.classList.add('phase-3');
            tile.classList.add(`tile-${index + 1}-stack`);
        });
    }, 2400);

    setTimeout(() => {
        heroTiles.forEach(tile => {
            tile.classList.add('phase-4');
        });
    }, 3800);

    setTimeout(() => {
        coralFormation.classList.add('form');
    }, 4800);

    setTimeout(() => {
        coralFormation.classList.remove('form');
        coralFormation.addEventListener('animationend', function handler(e) {
            if (e.animationName === 'periodTravel') {
                coralFormation.removeEventListener('animationend', handler);
                setTimeout(() => {
                    coralFormation.classList.add('hidden');
                    finalPeriod.classList.add('typing');
                    
                    setTimeout(() => {
                        finalPeriod.classList.add('reveal');
                        const breathingText = document.querySelector('.breathing-text');
                        breathingText.classList.add('active');
                        heroSection.classList.add('hero-visible');
                        
                        setTimeout(() => {
                            tilesContainer.style.display = 'none';
                        }, 500);
                    }, 500);
                }, 300);
            }
        });
        coralFormation.classList.add('travel');
    }, 6000);
}

document.addEventListener('DOMContentLoaded', startHeroAnimation);

// ========================================
// CARD GAME - IMPROVED SHUFFLE
// ========================================
class CardGame {
    constructor() {
        this.cards = [];
        this.cardStack = null;
        this.shuffleButton = null;
        this.lastShuffleOrder = null;
        this.isShuffling = false;
        this.init();
    }

    init() {
        setTimeout(() => this.setup(), 1000);
    }

    setup() {
        this.cardStack = document.getElementById('cardStack');
        this.cards = Array.from(document.querySelectorAll('.tour-card'));
        this.shuffleButton = document.getElementById('shuffleBtn');

        if (!this.cardStack || this.cards.length === 0) return;

        this.setupCards();
        this.setupShuffleButton();
    }

    setupCards() {
        this.cards.forEach((card) => {
            card.addEventListener('click', (e) => {
                if (card.dataset.justTouched === 'true') return;
                this.flipCard(e, card);
            });
            card.addEventListener('touchend', (e) => {
                if (e.target.tagName === 'A' || e.target.closest('a')) return;
                card.dataset.justTouched = 'true';
                this.flipCard(e, card);
                setTimeout(() => { delete card.dataset.justTouched; }, 250);
            }, { passive: true });
        });
    }

    flipCard(e, card) {
        if (e.target.tagName === 'A' || e.target.closest('a')) return;
        if (this.isShuffling) return;
        
        card.classList.toggle('flipped');
    }

    setupShuffleButton() {
        if (!this.shuffleButton) return;
        this.shuffleButton.addEventListener('click', () => this.shuffleCards());
    }

    shuffleCards() {
        if (this.isShuffling || this.cards.length === 0) return;
        
        this.isShuffling = true;
        this.cardStack.classList.add('shuffling');
        
        this.cards.forEach(card => card.classList.remove('flipped'));
        
        const positions = ['position-1', 'position-2', 'position-3', 'position-4', 'position-5'];
        let newOrder;
        let attempts = 0;
        
        do {
            newOrder = this.fisherYatesShuffle([...positions]);
            attempts++;
        } while (
            this.lastShuffleOrder && 
            JSON.stringify(newOrder) === JSON.stringify(this.lastShuffleOrder) && 
            attempts < 50
        );
        
        this.lastShuffleOrder = [...newOrder];
        
        this.cards.forEach((card, index) => {
            card.classList.remove('position-1', 'position-2', 'position-3', 'position-4', 'position-5');
            
            const staggerDelay = 50 + (Math.random() * 100);
            
            setTimeout(() => {
                card.classList.add('shuffling-active');
                card.classList.add(newOrder[index]);
                
                const rotationVariation = (Math.random() - 0.5) * 4;
                const jitterX = (Math.random() - 0.5) * 6;
                const jitterY = (Math.random() - 0.5) * 6;
                
                card.style.setProperty('--rotation-variation', `${rotationVariation}deg`);
                card.style.setProperty('--jitter-x', `${jitterX}px`);
                card.style.setProperty('--jitter-y', `${jitterY}px`);
                
                setTimeout(() => {
                    card.classList.remove('shuffling-active');
                }, 600);
                
            }, staggerDelay);
        });
        
        setTimeout(() => {
            this.cardStack.classList.remove('shuffling');
            this.isShuffling = false;
        }, 1200);
    }

    fisherYatesShuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}

const cardGame = new CardGame();

// ========================================
// BANNER ROTATOR
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const bannerLines = document.querySelectorAll('.banner-line');
    if (bannerLines.length === 0) return;
    
    let currentIndex = 0;
    
    function rotateLines() {
        bannerLines[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % bannerLines.length;
        bannerLines[currentIndex].classList.add('active');
    }
    
    setTimeout(() => {
        setInterval(rotateLines, 3000);
    }, 7000);
});

// ========================================
// CONSTELLATION CANVAS
// ========================================
function initConstellation() {
    const canvas = document.getElementById('constellation-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const section = document.querySelector('.whats-next');
    
    let nodes = [];
    let mouse = { x: 0, y: 0 };
    let isMobile = window.innerWidth <= 768;
    
    const nodeConfig = {
        count: isMobile ? 30 : 50,
        maxSpeed: 0.2,
        connectionDistance: isMobile ? 80 : 120,
        activationRadius: isMobile ? 60 : 100,
        colors: {
            node: '#FF6B6B',
            connection: 'rgba(255, 107, 107, 0.3)'
        }
    };
    
    function resizeCanvas() {
        const rect = section.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }
    
    section.addEventListener('mousemove', function(e) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    
    class Node {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * nodeConfig.maxSpeed;
            this.vy = (Math.random() - 0.5) * nodeConfig.maxSpeed;
            this.radius = Math.random() * 2 + 1;
            this.highlighted = false;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x <= 0 || this.x >= canvas.width) this.vx *= -1;
            if (this.y <= 0 || this.y >= canvas.height) this.vy *= -1;
            
            this.x = Math.max(0, Math.min(canvas.width, this.x));
            this.y = Math.max(0, Math.min(canvas.height, this.y));
            
            const distance = Math.sqrt(
                Math.pow(this.x - mouse.x, 2) + Math.pow(this.y - mouse.y, 2)
            );
            this.highlighted = distance < nodeConfig.activationRadius;
        }
    }
    
    function createNodes() {
        nodes = [];
        for (let i = 0; i < nodeConfig.count; i++) {
            nodes.push(new Node());
        }
    }
    
    function drawConnections() {
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const distance = Math.sqrt(
                    Math.pow(nodes[i].x - nodes[j].x, 2) + 
                    Math.pow(nodes[i].y - nodes[j].y, 2)
                );
                
                if (distance < nodeConfig.connectionDistance) {
                    const opacity = 1 - (distance / nodeConfig.connectionDistance);
                    ctx.strokeStyle = `rgba(255, 107, 107, ${opacity * 0.2})`;
                    ctx.lineWidth = 0.5;
                    
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    function drawNodes() {
        nodes.forEach(node => {
            const alpha = node.highlighted ? 0.8 : 0.5;
            
            ctx.fillStyle = `rgba(255, 107, 107, ${alpha})`;
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fill();
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        nodes.forEach(node => node.update());
        drawConnections();
        drawNodes();
        
        requestAnimationFrame(animate);
    }
    
    resizeCanvas();
    createNodes();
    animate();
    
    window.addEventListener('resize', function() {
        isMobile = window.innerWidth <= 768;
        resizeCanvas();
        createNodes();
    });
}

document.addEventListener('DOMContentLoaded', initConstellation);

let _particleRAF;
function initParticleCanvas() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    function createParticle() {
        return { x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5, size: Math.random() * 2 + 1, opacity: Math.random() * 0.5 + 0.1, hue: Math.random() * 60 + 200 };
    }
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${p.hue}, 70%, 60%, ${p.opacity})`; ctx.fill();
        });
        _particleRAF = requestAnimationFrame(animate);
    }
    window.addEventListener('resize', resize); resize();
    for (let i = 0; i < 50; i++) particles.push(createParticle());
    animate();
}
function destroyParticles() { if (_particleRAF) cancelAnimationFrame(_particleRAF); }
if (html.getAttribute('data-theme') === 'dark') { initParticleCanvas(); }
