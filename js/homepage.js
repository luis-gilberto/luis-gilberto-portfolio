// ===================================
// THEME TOGGLE
// ===================================
function initTheme() {
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const shouldBeDark = stored === 'dark' || (!stored && prefersDark);
  
  if (shouldBeDark) {
    document.documentElement.classList.add('dark');
  }
  
  const themeToggles = document.querySelectorAll('.theme-toggle');
  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  });
}

// ===================================
// NAVIGATION SCROLL
// ===================================
function initNavScroll() {
  const nav = document.getElementById('primaryNav');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
}

// ===================================
// MOBILE MENU
// ===================================
function initMobileMenu() {
  const toggle = document.getElementById('mobileMenuToggle');
  const overlay = document.getElementById('mobileMenuOverlay');
  const links = overlay.querySelectorAll('.mobile-nav-link');
  
  toggle.addEventListener('click', () => {
    overlay.classList.toggle('active');
  });
  
  links.forEach(link => {
    link.addEventListener('click', () => {
      overlay.classList.remove('active');
    });
  });
}

// ===================================
// PARTICLES ANIMATION
// ===================================
function initParticles() {
  const container = document.getElementById('particlesContainer');
  const particleCount = 8;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 2}s`;
    particle.style.animationDuration = `${3 + Math.random() * 2}s`;
    container.appendChild(particle);
  }
}

// ═══════════════════════════════════════════════════════
// HERO TILES - Drag Any Direction + Levitation (Provided Block)
// ═══════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', function() {
  const tiles = document.querySelectorAll('.hero-tile');
  
  if (!tiles.length) { 
    console.warn('No hero tiles found'); 
    return; 
  } 
  
  tiles.forEach(tile => { 
    const img1 = tile.querySelector('.tile-image-1') || tile.querySelector('.tile-image:nth-child(1)'); 
    const img2 = tile.querySelector('.tile-image-2') || tile.querySelector('.tile-image:nth-child(2)'); 
    const hint = tile.querySelector('.tile-hint'); 
    const cta = tile.querySelector('.tile-cta'); 
    
    if (!img1 || !img2) { 
      console.warn('Tile missing images:', tile); 
      return; 
    } 
    
    let isDragging = false; 
    let startX = 0; 
    let startY = 0; 
    let currentX = 0; 
    let currentY = 0; 
    let totalDistance = 0; 
    let isRevealed = false; 
    
    img1.style.opacity = '1'; 
    img2.style.opacity = '0'; 
    
    const calculateDistance = () => { 
      const deltaX = currentX - startX; 
      const deltaY = currentY - startY; 
      return Math.sqrt(deltaX * deltaX + deltaY * deltaY); 
    }; 
    
    const handleStart = (e) => { 
      if (isRevealed) return; 
      
      isDragging = true; 
      
      if (e.type.includes('mouse')) { 
        startX = e.clientX; 
        startY = e.clientY; 
      } else { 
        startX = e.touches[0].clientX; 
        startY = e.touches[0].clientY; 
      } 
      
      tile.style.cursor = 'grabbing'; 
      e.preventDefault(); 
    }; 
    
    const handleMove = (e) => { 
      if (!isDragging || isRevealed) return; 
      
      e.preventDefault(); 
      
      if (e.type.includes('mouse')) { 
        currentX = e.clientX; 
        currentY = e.clientY; 
      } else { 
        currentX = e.touches[0].clientX; 
        currentY = e.touches[0].clientY; 
      } 
      
      totalDistance = calculateDistance(); 
      
      const dragProgress = Math.min(totalDistance / 80, 1); 
      
      img1.style.opacity = 1 - dragProgress; 
      img2.style.opacity = dragProgress; 
      
      if (hint) { 
        hint.style.opacity = (1 - dragProgress) * 0.7; 
      } 
    }; 
    
    const handleEnd = () => { 
      if (!isDragging || isRevealed) return; 
      
      isDragging = false; 
      tile.style.cursor = 'grab'; 
      
      if (totalDistance > 80) { 
        reveal(); 
      } else { 
        img1.style.opacity = '1'; 
        img2.style.opacity = '0'; 
        if (hint) hint.style.opacity = '0'; 
      } 
      
      totalDistance = 0; 
    }; 
    
    const reveal = () => { 
      isRevealed = true; 
      
      img1.style.opacity = '0'; 
      img2.style.opacity = '1'; 
      
      if (hint) hint.style.display = 'none'; 
      
      setTimeout(() => { 
        tile.classList.add('tile-levitating'); 
      }, 100); 
      
      if (cta) { 
        cta.style.display = 'flex'; 
        setTimeout(() => { 
          cta.style.opacity = '0'; 
        }, 200); 
      } 
      
      tile.style.cursor = 'default'; 
      
      console.log('🎉 Tile revealed and levitating!'); 
    }; 
    
    tile.addEventListener('mousedown', handleStart); 
    document.addEventListener('mousemove', handleMove); 
    document.addEventListener('mouseup', handleEnd); 
    
    tile.addEventListener('touchstart', handleStart, { passive: false }); 
    document.addEventListener('touchmove', handleMove, { passive: false }); 
    document.addEventListener('touchend', handleEnd); 
    
    tile.addEventListener('mouseenter', () => { 
      if (isRevealed && cta) { 
        cta.style.opacity = '1'; 
        cta.style.transform = 'translateX(-50%) translateY(-5px)'; 
      } 
    }); 
    
    tile.addEventListener('mouseleave', () => { 
      if (isRevealed && cta) { 
        cta.style.opacity = '0'; 
        cta.style.transform = 'translateX(-50%) translateY(20px)'; 
      } 
    }); 
  }); 
  
  console.log('✅ Hero tiles initialized:', tiles.length); 
});

// ===================================
// BANNER ROTATOR
// ===================================
function initBannerRotator() {
  const texts = document.querySelectorAll('.banner-text');
  let currentIndex = 0;
  
  setInterval(() => {
    texts[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % texts.length;
    texts[currentIndex].classList.add('active');
  }, 3000);
}

// ===================================
// CARD FLIP
// ===================================
function initCardFlip() {
  const cards = document.querySelectorAll('.tour-card');
  
  cards.forEach(card => {
    // Card flip handler
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
    
    // Prevent flip when clicking CTA
    const cta = card.querySelector('.card-cta');
    if (cta) {
      cta.addEventListener('click', (e) => {
        e.stopPropagation();
        // Allow default link behavior to proceed
      });
    }
    
    // Keyboard accessibility
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('flipped');
      }
    });
  });
}

// ===================================
// SHUFFLE CARDS
// ===================================
function initShuffle() {
  const button = document.getElementById('shuffleButton');
  const cardsContainer = document.querySelector('.quick-tour-section');
  if (!button) return;
  
  button.addEventListener('click', () => {
    const allCards = Array.from(document.querySelectorAll('.tour-card'));
    
    // Shuffle array
    for (let i = allCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allCards[i], allCards[j]] = [allCards[j], allCards[i]];
    }
    
    // Reset flipped state
    allCards.forEach(card => card.classList.remove('flipped'));
    
    // Reorder in DOM
    const grids = document.querySelectorAll('.cards-grid');
    let cardIndex = 0;
    
    grids.forEach(grid => {
      const gridCards = Array.from(grid.querySelectorAll('.tour-card'));
      gridCards.forEach(() => {
        if (allCards[cardIndex]) {
          grid.appendChild(allCards[cardIndex]);
          cardIndex++;
        }
      });
    });
  });
}

// ===================================
// CONSTELLATION CANVAS
// ===================================
function initConstellation() {
  const canvas = document.getElementById('constellationCanvas');
  const ctx = canvas.getContext('2d');
  
  let stars = [];
  let animationId;
  
  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    initStars();
  }
  
  function initStars() {
    stars = [];
    const starCount = Math.floor((canvas.width * canvas.height) / 15000);
    
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.3
      });
    }
  }
  
  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw stars
    stars.forEach(star => {
      star.x += star.vx;
      star.y += star.vy;
      
      if (star.x < 0 || star.x > canvas.width) star.vx *= -1;
      if (star.y < 0 || star.y > canvas.height) star.vy *= -1;
      
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(249, 111, 110, ${star.opacity})`;
      ctx.fill();
    });
    
    // Draw connections
    stars.forEach((star1, i) => {
      stars.slice(i + 1).forEach(star2 => {
        const dx = star1.x - star2.x;
        const dy = star1.y - star2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          ctx.beginPath();
          ctx.moveTo(star1.x, star1.y);
          ctx.lineTo(star2.x, star2.y);
          ctx.strokeStyle = `rgba(46, 211, 198, ${0.2 * (1 - distance / 150)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });
    });
    
    animationId = requestAnimationFrame(drawStars);
  }
  
  resizeCanvas();
  drawStars();
  
  window.addEventListener('resize', resizeCanvas);
}

// ===================================
// CURRENT YEAR
// ===================================
function initCurrentYear() {
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

// ===================================
// INITIALIZE ALL
// ===================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavScroll();
  initMobileMenu();
  initParticles();
  initBannerRotator();
  initCardFlip();
  initShuffle();
  initConstellation();
  initCurrentYear();
});
