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

// ===================================
// INTERACTIVE 3D TILES
// ===================================
function initInteractiveTiles() {
  const tilesContainer = document.getElementById('heroTiles');
  const tiles = document.querySelectorAll('.hero-tile');
  
  let mouseX = 0;
  let mouseY = 0;
  let targetRotateX = 0;
  let targetRotateY = 0;
  let currentRotateX = 0;
  let currentRotateY = 0;

  // Global mouse tracking for container rotation
  document.addEventListener('mousemove', (e) => {
    if (!tilesContainer) return;
    
    const rect = tilesContainer.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX = (e.clientX - centerX) / rect.width;
    mouseY = (e.clientY - centerY) / rect.height;
    
    targetRotateX = mouseY * -10;
    targetRotateY = mouseX * 10;
  });

  // Smooth animation loop for container
  function animateContainer() {
    currentRotateX += (targetRotateX - currentRotateX) * 0.1;
    currentRotateY += (targetRotateY - currentRotateY) * 0.1;
    
    if (tilesContainer) {
      tilesContainer.style.transform = `rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;
    }
    
    requestAnimationFrame(animateContainer);
  }
  animateContainer();

  // Individual tile drag interactions
  tiles.forEach((tile) => {
    const inner = tile.querySelector('.tile-inner');
    const images = tile.querySelectorAll('.tile-image');
    const overlay = tile.querySelector('.tile-overlay');
    const hint = overlay?.querySelector('.tile-hint');
    const cta = overlay?.querySelector('.tile-cta');
    let currentImageIndex = 0;
    
    // Update CTA visibility based on current image
    function updateOverlay() {
      if (!hint || !cta) return;
      
      const link = tile.getAttribute(`data-link-${currentImageIndex}`);
      const label = tile.getAttribute(`data-label-${currentImageIndex}`);
      
      if (link && label) {
        hint.style.display = 'none';
        cta.style.display = 'inline-flex';
        cta.href = link;
        cta.querySelector('span').textContent = label;
      } else {
        hint.style.display = 'block';
        cta.style.display = 'none';
      }
    }
    
    updateOverlay();
    
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let tileRotateX = 0;
    let tileRotateY = 0;

    tile.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      tile.style.transition = 'none';
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      currentX = deltaX;
      currentY = deltaY;
      
      tileRotateX = (deltaY / 10) * -1;
      tileRotateY = deltaX / 10;
      
      if (inner) {
        inner.style.transform = `translate(${currentX}px, ${currentY}px) rotateX(${tileRotateX}deg) rotateY(${tileRotateY}deg)`;
      }
    });

    document.addEventListener('mouseup', () => {
      if (!isDragging) return;
      
      isDragging = false;
      tile.style.transition = 'transform 0.3s ease';
      
      if (inner) {
        inner.style.transform = '';
      }
      
      // Cycle image if dragged significantly
      if (Math.abs(currentX) > 30 || Math.abs(currentY) > 30) {
        images[currentImageIndex].classList.remove('active');
        currentImageIndex = (currentImageIndex + 1) % images.length;
        images[currentImageIndex].classList.add('active');
        updateOverlay();
      }
      
      currentX = 0;
      currentY = 0;
    });

    // Touch support
    tile.addEventListener('touchstart', (e) => {
      isDragging = true;
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      tile.style.transition = 'none';
    });

    document.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      
      const touch = e.touches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;
      
      currentX = deltaX;
      currentY = deltaY;
      
      tileRotateX = (deltaY / 10) * -1;
      tileRotateY = deltaX / 10;
      
      if (inner) {
        inner.style.transform = `translate(${currentX}px, ${currentY}px) rotateX(${tileRotateX}deg) rotateY(${tileRotateY}deg)`;
      }
    });

    document.addEventListener('touchend', () => {
      if (!isDragging) return;
      
      isDragging = false;
      tile.style.transition = 'transform 0.3s ease';
      
      if (inner) {
        inner.style.transform = '';
      }
      
      if (Math.abs(currentX) > 30 || Math.abs(currentY) > 30) {
        images[currentImageIndex].classList.remove('active');
        currentImageIndex = (currentImageIndex + 1) % images.length;
        images[currentImageIndex].classList.add('active');
        updateOverlay();
      }
      
      currentX = 0;
      currentY = 0;
    });
  });
}

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
  initInteractiveTiles();
  initBannerRotator();
  initCardFlip();
  initShuffle();
  initConstellation();
  initCurrentYear();
});
