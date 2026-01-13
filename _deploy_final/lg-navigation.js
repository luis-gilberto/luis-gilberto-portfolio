class LGNavigation {
  constructor() {
    this.mobileToggle = document.querySelector('.lg-mobile-toggle');
    this.mobileMenu = document.querySelector('.lg-mobile-menu');
    this.mobileNavItems = document.querySelectorAll('.lg-mobile-nav-item.has-dropdown');
    this.navLinks = document.querySelectorAll('.lg-nav-link, .lg-mobile-nav-link');

    this.init();
  }

  init() {
    this.setupMobileToggle();
    this.setupMobileDropdowns();
    this.setupActiveStates();
    this.setupSmoothScrolling();
    this.handleOutsideClicks();
  }

  setupMobileToggle() {
    if (!this.mobileToggle || !this.mobileMenu) return;

    this.mobileToggle.addEventListener('click', () => {
      this.mobileToggle.classList.toggle('active');
      this.mobileMenu.classList.toggle('active');

      const isActive = this.mobileMenu.classList.contains('active');
      this.mobileToggle.setAttribute('aria-expanded', isActive);

      if (isActive) {
        this.mobileMenu.style.maxHeight = this.mobileMenu.scrollHeight + 'px';
      } else {
        this.mobileMenu.style.maxHeight = '0';
        this.closeAllMobileDropdowns();
      }
    });
  }

  setupMobileDropdowns() {
    this.mobileNavItems.forEach(item => {
      const link = item.querySelector('.lg-mobile-nav-link');
      const dropdown = item.querySelector('.lg-mobile-dropdown');

      if (!link || !dropdown) return;

      link.addEventListener('click', (e) => {
        e.preventDefault();

        const isActive = item.classList.contains('active');

        this.closeAllMobileDropdowns();

        if (!isActive) {
          item.classList.add('active');
          dropdown.style.maxHeight = dropdown.scrollHeight + 'px';
          this.updateMobileMenuHeight();
        }
      });
    });
  }

  closeAllMobileDropdowns() {
    this.mobileNavItems.forEach(item => {
      const dropdown = item.querySelector('.lg-mobile-dropdown');
      item.classList.remove('active');
      if (dropdown) {
        dropdown.style.maxHeight = '0';
      }
    });
    this.updateMobileMenuHeight();
  }

  updateMobileMenuHeight() {
    if (this.mobileMenu && this.mobileMenu.classList.contains('active')) {
      setTimeout(() => {
        this.mobileMenu.style.maxHeight = this.mobileMenu.scrollHeight + 'px';
      }, 300);
    }
  }

  setupActiveStates() {
    const currentPath = window.location.pathname;

    this.navLinks.forEach(link => {
      const href = link.getAttribute('href');

      if (href && (href === currentPath || 
          (href !== '/' && currentPath.startsWith(href)))) {
        link.classList.add('active');
      }
    });
  }

  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));

        if (target) {
          e.preventDefault();

          const headerHeight = document.querySelector('.lg-header').offsetHeight;
          const targetPosition = target.offsetTop - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          if (this.mobileMenu.classList.contains('active')) {
            this.closeMobileMenu();
          }
        }
      });
    });
  }

  handleOutsideClicks() {
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.lg-nav')) {
        this.closeMobileMenu();
      }
    });
  }

  closeMobileMenu() {
    if (this.mobileToggle && this.mobileMenu) {
      this.mobileToggle.classList.remove('active');
      this.mobileMenu.classList.remove('active');
      this.mobileToggle.setAttribute('aria-expanded', 'false');
      this.mobileMenu.style.maxHeight = '0';
      this.closeAllMobileDropdowns();
    }
  }

  // Public methods for external control
  setActiveLink(href) {
    this.navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === href) {
        link.classList.add('active');
      }
    });
  }

  addNavigationItem(text, href, parent = null) {
    const desktopMenu = document.querySelector('.lg-nav-menu');
    const mobileMenu = document.querySelector('.lg-mobile-nav');

    if (desktopMenu && mobileMenu) {
      // Desktop item
      const desktopItem = document.createElement('li');
      desktopItem.className = 'lg-nav-item';
      desktopItem.innerHTML = `<a href="${href}" class="lg-nav-link">${text}</a>`;

      // Mobile item
      const mobileItem = document.createElement('li');
      mobileItem.className = 'lg-mobile-nav-item';
      mobileItem.innerHTML = `<a href="${href}" class="lg-mobile-nav-link">${text}</a>`;

      if (parent) {
        // Add to dropdown if parent specified
        const parentDropdown = document.querySelector(`[href="${parent}"] + .lg-dropdown`);
        const parentMobileDropdown = document.querySelector(`[href="${parent}"] + .lg-mobile-dropdown`);

        if (parentDropdown) {
          const dropdownItem = document.createElement('a');
          dropdownItem.href = href;
          dropdownItem.className = 'lg-dropdown-item';
          dropdownItem.textContent = text;
          parentDropdown.appendChild(dropdownItem);
        }

        if (parentMobileDropdown) {
          const mobileDropdownItem = document.createElement('a');
          mobileDropdownItem.href = href;
          mobileDropdownItem.className = 'lg-mobile-dropdown-item';
          mobileDropdownItem.textContent = text;
          parentMobileDropdown.appendChild(mobileDropdownItem);
        }
      } else {
        // Add as main navigation item
        desktopMenu.appendChild(desktopItem);
        mobileMenu.appendChild(mobileItem);
      }

      this.setupActiveStates();
    }
  }

  removeNavigationItem(href) {
    const items = document.querySelectorAll(`[href="${href}"]`);
    items.forEach(item => {
      const parent = item.closest('li');
      if (parent) {
        parent.remove();
      }
    });
  }

  highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.lg-nav-link[href^="#"]');

    if (sections.length === 0) return;

    const headerHeight = document.querySelector('.lg-header').offsetHeight;
    const scrollPosition = window.scrollY + headerHeight + 100;

    let currentSection = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const navigation = new LGNavigation();

  // Optional: Highlight active sections on scroll
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      navigation.highlightActiveSection();
    }, 100);
  });

  // Make navigation instance globally available
  window.LGNavigation = navigation;
});

// Accessibility enhancements
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const navigation = window.LGNavigation;
    if (navigation) {
      navigation.closeMobileMenu();
    }
  }
});

// Add focus management for better accessibility
document.querySelectorAll('.lg-nav-link, .lg-mobile-nav-link').forEach(link => {
  link.addEventListener('focus', () => {
    link.parentElement.classList.add('focused');
  });

  link.addEventListener('blur', () => {
    link.parentElement.classList.remove('focused');
  });
});