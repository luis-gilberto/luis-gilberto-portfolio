/**
 * LG Advanced Navigation System - Working with Trae's HTML Structure
 * Professional navigation with drag functionality and page awareness
 */

class LGAdvancedNavigation {
    constructor() {
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.currentPage = this.detectCurrentPage();
        this.isMenuOpen = false;

        this.init();
    }

    init() {
        console.log('[LG Navigation] Initializing navigation system');

        this.setupElements();
        this.setupEventListeners();
        this.loadPosition();
        this.setupPageSpecificBehavior();
        this.updateActiveStates();
        this.createOverlay();

        console.log('[LG Navigation] Navigation system ready');
    }

    setupElements() {
        this.container = document.querySelector('.lg-nav-container');
        this.toggle = document.querySelector('.lg-nav-toggle');
        this.menu = document.querySelector('.lg-nav-menu');
        this.closeBtn = document.querySelector('.lg-nav-close');

        if (!this.container || !this.toggle || !this.menu) {
            console.error('[LG Navigation] Required elements not found');
            return;
        }
    }

    setupEventListeners() {
        // Toggle menu
        if (this.toggle) {
            this.toggle.addEventListener('click', (e) => {
                if (!this.isDragging) {
                    this.toggleMenu();
                }
            });
        }

        // Close menu
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closeMenu());
        }

        // Dragging functionality
        if (this.toggle) {
            this.toggle.addEventListener('mousedown', (e) => this.startDrag(e));
            this.toggle.addEventListener('touchstart', (e) => this.startDrag(e), { passive: false });
        }

        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('touchmove', (e) => this.drag(e), { passive: false });

        document.addEventListener('mouseup', () => this.endDrag());
        document.addEventListener('touchend', () => this.endDrag());

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
            }
        });

        // Save position on page unload
        window.addEventListener('beforeunload', () => this.savePosition());

        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
    }

    detectCurrentPage() {
        const path = window.location.pathname.toLowerCase();
        const dataPage = document.body.getAttribute('data-page');

        if (dataPage) return dataPage;
        if (path.includes('advisory')) return 'advisory';
        if (path.includes('scopeiq')) return 'scopeiq';
        if (path.includes('services')) return 'services';

        return 'services'; // default
    }

    setupPageSpecificBehavior() {
        // Add current page indicator
        this.addCurrentPageIndicator();

        // Special behavior for ScopeIQ
        if (this.currentPage === 'scopeiq') {
            this.setupScopeIQBehavior();
        }

        // Remove fake/old navigation links
        this.cleanupNavigationLinks();
    }

    addCurrentPageIndicator() {
        const pageNames = {
            'advisory': 'Advisory Services',
            'scopeiq': 'ScopeIQ Wizard',
            'services': 'Services Hub'
        };

        const pageName = pageNames[this.currentPage] || 'IMC Services';

        // Create current page indicator
        const indicator = document.createElement('div');
        indicator.className = 'lg-nav-current-indicator';
        indicator.textContent = `Current Page: ${pageName}`;

        // Insert at the beginning of the menu
        if (this.menu && this.menu.firstChild) {
            this.menu.insertBefore(indicator, this.menu.firstChild);
        }
    }

    setupScopeIQBehavior() {
        // Find the Services section and add assessment progress
        const servicesSection = document.querySelector('.lg-nav-section');
        if (servicesSection) {
            const progressElement = document.createElement('div');
            progressElement.className = 'lg-nav-progress-indicator';
            progressElement.innerHTML = `
                <div style="background: rgba(249, 111, 110, 0.1); border: 1px solid rgba(249, 111, 110, 0.2); border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; text-align: center;">
                    <div style="color: #FA8B8A; font-size: 12px; font-weight: 500; margin-bottom: 8px;">Assessment In Progress</div>
                    <div style="width: 100%; height: 4px; background: rgba(249, 111, 110, 0.2); border-radius: 2px; overflow: hidden;">
                        <div style="height: 100%; background: linear-gradient(90deg, #F96F6E, #2ED3C6); width: 65%; border-radius: 2px; animation: pulse 2s ease-in-out infinite;"></div>
                    </div>
                </div>
            `;

            servicesSection.appendChild(progressElement);
        }
    }

    cleanupNavigationLinks() {
        // Remove links to pages that don't exist
        const badLinks = [
            'engagement-toolkit',
            'planning-hub'
        ];

        badLinks.forEach(badLink => {
            const link = document.querySelector(`a[href*="${badLink}"]`);
            if (link) {
                console.log(`[LG Navigation] Removing invalid link: ${badLink}`);
                link.remove();
            }
        });

        // Clean up empty sections
        const sections = document.querySelectorAll('.lg-nav-section');
        sections.forEach(section => {
            const links = section.querySelectorAll('.lg-nav-link');
            if (links.length === 0) {
                section.remove();
            }
        });
    }

    updateActiveStates() {
        // Remove all active states
        const links = document.querySelectorAll('.lg-nav-link');
        links.forEach(link => link.classList.remove('active'));

        // Add active state to current page
        const currentLinks = {
            'advisory': 'a[href*="advisory"]',
            'scopeiq': 'a[href*="scopeiq"]',
            'services': 'a[href*="index.html"], a[href="/"], a[href=""]'
        };

        const selector = currentLinks[this.currentPage];
        if (selector) {
            const activeLink = document.querySelector(selector);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }

    createOverlay() {
        // Create overlay for mobile
        const overlay = document.createElement('div');
        overlay.className = 'lg-nav-overlay';
        overlay.addEventListener('click', () => this.closeMenu());
        document.body.appendChild(overlay);
        this.overlay = overlay;
    }

    toggleMenu() {
        if (this.isMenuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        if (this.menu && this.overlay) {
            this.menu.classList.add('active');
            this.overlay.classList.add('active');
            this.isMenuOpen = true;
            console.log('[LG Navigation] Menu opened');
        }
    }

    closeMenu() {
        if (this.menu && this.overlay) {
            this.menu.classList.remove('active');
            this.overlay.classList.remove('active');
            this.isMenuOpen = false;
            console.log('[LG Navigation] Menu closed');
        }
    }

    startDrag(e) {
        e.preventDefault();

        const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
        const clientY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;

        const rect = this.toggle.getBoundingClientRect();

        this.dragOffset = {
            x: clientX - rect.left,
            y: clientY - rect.top
        };

        this.isDragging = true;
        this.container.classList.add('dragging');
        this.toggle.classList.add('dragging');

        // Close menu when starting to drag
        this.closeMenu();

        console.log('[LG Navigation] Drag started');
    }

    drag(e) {
        if (!this.isDragging || !this.toggle) return;

        e.preventDefault();

        const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
        const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;

        const newX = clientX - this.dragOffset.x;
        const newY = clientY - this.dragOffset.y;

        // Constrain to viewport
        const maxX = window.innerWidth - this.toggle.offsetWidth;
        const maxY = window.innerHeight - this.toggle.offsetHeight;

        const constrainedX = Math.max(0, Math.min(newX, maxX));
        const constrainedY = Math.max(0, Math.min(newY, maxY));

        // Apply position
        this.toggle.style.position = 'fixed';
        this.toggle.style.left = constrainedX + 'px';
        this.toggle.style.top = constrainedY + 'px';
        this.toggle.style.right = 'auto';

        // Update menu position to follow toggle
        if (this.menu) {
            this.menu.style.top = Math.min(constrainedY, window.innerHeight - this.menu.offsetHeight - 20) + 'px';

            // Adjust menu position based on toggle location
            if (constrainedX > window.innerWidth / 2) {
                // Toggle on right side - menu on left
                this.menu.style.right = (window.innerWidth - constrainedX) + 'px';
                this.menu.style.left = 'auto';
            } else {
                // Toggle on left side - menu on right  
                this.menu.style.left = (constrainedX + this.toggle.offsetWidth + 10) + 'px';
                this.menu.style.right = 'auto';
            }
        }
    }

    endDrag() {
        if (!this.isDragging) return;

        this.isDragging = false;
        this.container.classList.remove('dragging');
        this.toggle.classList.remove('dragging');

        this.savePosition();
        console.log('[LG Navigation] Drag ended');

        // Small delay to prevent immediate menu open
        setTimeout(() => {
            this.isDragging = false;
        }, 100);
    }

    savePosition() {
        if (!this.toggle) return;

        const rect = this.toggle.getBoundingClientRect();
        const position = {
            x: rect.left,
            y: rect.top,
            timestamp: Date.now()
        };

        try {
            localStorage.setItem('lg-nav-position', JSON.stringify(position));
            console.log('[LG Navigation] Position saved');
        } catch (error) {
            console.error('[LG Navigation] Failed to save position:', error);
        }
    }

    loadPosition() {
        try {
            const saved = localStorage.getItem('lg-nav-position');
            if (saved && this.toggle) {
                const position = JSON.parse(saved);

                // Validate position is still within viewport
                if (position.x >= 0 && position.y >= 0 && 
                    position.x <= window.innerWidth - 60 && 
                    position.y <= window.innerHeight - 60) {

                    this.toggle.style.position = 'fixed';
                    this.toggle.style.left = position.x + 'px';
                    this.toggle.style.top = position.y + 'px';
                    this.toggle.style.right = 'auto';

                    console.log('[LG Navigation] Position loaded');
                }
            }
        } catch (error) {
            console.error('[LG Navigation] Failed to load position:', error);
        }
    }

    handleResize() {
        // Ensure toggle stays within viewport on resize
        if (this.toggle) {
            const rect = this.toggle.getBoundingClientRect();
            const maxX = window.innerWidth - this.toggle.offsetWidth;
            const maxY = window.innerHeight - this.toggle.offsetHeight;

            if (rect.left > maxX || rect.top > maxY) {
                this.toggle.style.left = Math.min(rect.left, maxX) + 'px';
                this.toggle.style.top = Math.min(rect.top, maxY) + 'px';
                this.savePosition();
            }
        }

        // Close menu on resize to prevent layout issues
        this.closeMenu();
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Add required CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
    `;
    document.head.appendChild(style);

    // Initialize navigation
    window.lgNavigation = new LGAdvancedNavigation();
});

// Export for manual initialization if needed
window.LGAdvancedNavigation = LGAdvancedNavigation;
