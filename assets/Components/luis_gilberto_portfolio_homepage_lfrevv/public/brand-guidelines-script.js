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
// COLOR COPY TO CLIPBOARD
// ===================================
function initColorCopy() {
  const swatches = document.querySelectorAll('.color-swatch[data-hex]');
  
  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      const hex = swatch.dataset.hex;
      navigator.clipboard.writeText(hex).then(() => {
        // Show copied feedback
        const overlay = swatch.querySelector('.copy-overlay');
        const icon = overlay.querySelector('.copy-icon');
        
        // Change to check icon temporarily
        icon.innerHTML = '<polyline points="20 6 9 17 4 12"></polyline>';
        
        setTimeout(() => {
          icon.innerHTML = '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>';
        }, 2000);
      });
    });
  });
}

// ===================================
// PERSPECTIVE MODAL
// ===================================
const perspectiveData = {
  storyteller: {
    title: 'The Storyteller',
    subtitle: 'The Systems Thinker',
    type: 'storyteller',
    description: "This is the strategic lens—the one that asks why does this matter and where are we going. It's about seeing the whole system, understanding emotional resonance, and crafting narratives that move people. This perspective uses Playfair Display and Coral to signal depth, warmth, and strategic intent.",
    characteristics: [
      'Sees the big picture and long-term vision',
      'Understands emotional drivers and human motivation',
      'Crafts compelling narratives that resonate',
      'Connects strategy to measurable outcomes'
    ]
  },
  architect: {
    title: 'The Architect',
    subtitle: 'The Curator',
    type: 'architect',
    description: "This is the craft lens—the one that obsesses over details, structure, and execution. It's about building with precision, curating with intention, and ensuring every element serves a purpose. This perspective uses Big Shoulders Display and Teal to signal strength, clarity, and structural integrity.",
    characteristics: [
      'Obsesses over details and execution quality',
      'Builds systems with structural integrity',
      'Curates experiences with intentional design',
      'Ensures consistency across all touchpoints'
    ]
  },
  translator: {
    title: 'The Translator',
    subtitle: 'The Bridge Builder',
    type: 'translator',
    description: "This is the clarity lens—the one that makes complexity accessible. It's about connecting opposites, bridging gaps, and ensuring everyone can understand and engage. This perspective uses Inter and Cloud Dancer to signal inclusivity, readability, and universal accessibility.",
    characteristics: [
      'Makes complex ideas simple and accessible',
      'Bridges technical and non-technical audiences',
      'Ensures inclusive and clear communication',
      'Connects strategy and craft to real-world impact'
    ]
  }
};

function initPerspectiveCards() {
  const cards = document.querySelectorAll('.perspective-card');
  const modal = document.getElementById('perspectiveModal');
  const overlay = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('modalClose');
  
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const perspective = card.dataset.perspective;
      openPerspectiveModal(perspective);
    });
  });
  
  overlay.addEventListener('click', closePerspectiveModal);
  closeBtn.addEventListener('click', closePerspectiveModal);
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closePerspectiveModal();
    }
  });
}

function openPerspectiveModal(perspectiveKey) {
  const modal = document.getElementById('perspectiveModal');
  const data = perspectiveData[perspectiveKey];
  
  if (!data) return;
  
  // Update modal content
  const badge = document.getElementById('modalBadge');
  badge.textContent = data.subtitle;
  badge.className = `modal-badge ${data.type}`;
  
  document.getElementById('modalTitle').textContent = data.title;
  document.getElementById('modalDescription').textContent = data.description;
  
  const dot = document.getElementById('charDot');
  dot.className = `char-dot ${data.type}`;
  
  const list = document.getElementById('characteristicsList');
  list.innerHTML = '';
  data.characteristics.forEach(char => {
    const li = document.createElement('li');
    li.className = data.type;
    li.textContent = char;
    list.appendChild(li);
  });
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closePerspectiveModal() {
  const modal = document.getElementById('perspectiveModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// ===================================
// SCROLL ANIMATIONS
// ===================================
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Animate sections on scroll
  const sections = document.querySelectorAll('.trinity-section, .typography-section, .color-section, .philosophy-section, .cta-section');
  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(40px)';
    section.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(section);
  });
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
  initMobileMenu();
  initColorCopy();
  initPerspectiveCards();
  initScrollAnimations();
  initCurrentYear();
});
