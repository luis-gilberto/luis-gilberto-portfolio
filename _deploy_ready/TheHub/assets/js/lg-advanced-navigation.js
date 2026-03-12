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
        this.dragStartTime = 0;
        this.dragThreshold = 5; // pixels
        this.clickTimeout = 150; // ms
        this.isMobile = this.detectMobile();

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
        this.setupTooltips();

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
                e.preventDefault();
                
                // On mobile, use a timeout to distinguish between tap and drag
                if (this.isMobile) {
                    setTimeout(() => {
                        if (!this.isDragging) {
                            this.toggleMenu();
                        }
                    }, 10);
                } else {
                    if (!this.isDragging) {
                        this.toggleMenu();
                    }
                }
            });

            // Add touch event for better mobile support
            this.toggle.addEventListener('touchend', (e) => {
                // Only handle if not dragging
                if (!this.isDragging) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleMenu();
                }
            });
        }

        // Close menu
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeMenu();
            });
            
            // Add touch event for better mobile support
            this.closeBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeMenu();
            });
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

        // Auto-close menu when navigation links are clicked
        this.setupAutoClose();

        // Listen for hash changes to update subsection active states
        window.addEventListener('hashchange', () => {
            if (this.currentPage === 'services') {
                this.updateSubsectionActiveStates();
            }
        });
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

    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
               window.innerWidth <= 768;
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
            'scopeiq': 'ScopeIQ',
            'services': 'Services Hub'
        };

        const pageName = pageNames[this.currentPage] || 'Services';
        const navHeader = this.menu?.querySelector('.lg-nav-header');
        if (!this.menu || !navHeader) return;

        // Remove existing indicator
        const existingIndicator = this.menu.querySelector('.lg-nav-current-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }

        // Create current page indicator
        const indicator = document.createElement('div');
        indicator.className = 'lg-nav-current-indicator';
        indicator.innerHTML = `Current Page: ${pageName}`;

        // Insert after the header
        navHeader.insertAdjacentElement('afterend', indicator);
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

        // Handle subsection active states for Services page
        if (this.currentPage === 'services') {
            this.updateSubsectionActiveStates();
        }
    }

    updateSubsectionActiveStates() {
        // Get current hash from URL
        const currentHash = window.location.hash;
        
        // Remove active states from all subsection links
        const subsectionLinks = document.querySelectorAll('.services-sections .lg-nav-link');
        subsectionLinks.forEach(link => link.classList.remove('active'));

        // Add active state to current subsection if hash matches
        if (currentHash) {
            const activeSubsection = document.querySelector(`.services-sections .lg-nav-link[href="${currentHash}"]`);
            if (activeSubsection) {
                activeSubsection.classList.add('active');
                console.log('[LG Navigation] Active subsection:', currentHash);
            }
        }
    }

    setupAutoClose() {
        // Add click listeners to all navigation links
        const navLinks = this.menu?.querySelectorAll('a[href], .lg-nav-link');
        console.log('[LG Navigation] Setting up auto-close for', navLinks?.length, 'links');
        
        if (navLinks) {
            navLinks.forEach((link, index) => {
                const href = link.getAttribute('href');
                console.log(`[LG Navigation] Link ${index}:`, href, link.textContent?.trim());
                
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');
                    console.log('[LG Navigation] Link clicked:', href, 'Menu open:', this.isMenuOpen);
                    
                    // Check if it's a section link (starts with #) or any other link
                    if (href && (href.startsWith('#') || href.includes('.html') || href.includes('mailto:') || href.includes('http'))) {
                        console.log('[LG Navigation] Valid link clicked, closing menu:', href);
                        
                        // For section links, close immediately
                        if (href.startsWith('#')) {
                            console.log('[LG Navigation] Section link - closing immediately');
                            this.closeMenu();
                        } else {
                            // For other links, small delay to allow for smooth transition
                            console.log('[LG Navigation] External link - closing with delay');
                            setTimeout(() => {
                                this.closeMenu();
                            }, 150);
                        }
                    }
                }, true); // Use capture phase to ensure we catch the event
            });
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
        if (this.menu && this.overlay && this.toggle) {
            this.menu.classList.add('active');
            this.overlay.classList.add('active');
            this.toggle.classList.add('active');
            this.isMenuOpen = true;
            console.log('[LG Navigation] Menu opened');
        }
    }

    closeMenu() {
        if (this.menu && this.overlay && this.toggle) {
            this.menu.classList.remove('active');
            this.overlay.classList.remove('active');
            this.toggle.classList.remove('active');
            this.isMenuOpen = false;
            console.log('[LG Navigation] Menu closed');
        }
    }

    startDrag(e) {
        const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
        const clientY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;

        const rect = this.toggle.getBoundingClientRect();

        this.dragOffset = {
            x: clientX - rect.left,
            y: clientY - rect.top
        };

        this.dragStartTime = Date.now();
        this.dragStartPosition = { x: clientX, y: clientY };

        // Don't immediately set dragging state on mobile - wait for movement
        if (!this.isMobile) {
            e.preventDefault();
            this.isDragging = true;
            this.container.classList.add('dragging');
            this.toggle.classList.add('dragging');
            this.closeMenu();
        }

        console.log('[LG Navigation] Drag initiated');
    }

    drag(e) {
        const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
        const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;

        // On mobile, check if we've moved enough to start dragging
        if (this.isMobile && !this.isDragging && this.dragStartPosition) {
            const deltaX = Math.abs(clientX - this.dragStartPosition.x);
            const deltaY = Math.abs(clientY - this.dragStartPosition.y);
            
            if (deltaX > this.dragThreshold || deltaY > this.dragThreshold) {
                e.preventDefault();
                this.isDragging = true;
                this.container.classList.add('dragging');
                this.toggle.classList.add('dragging');
                this.closeMenu();
                console.log('[LG Navigation] Mobile drag started');
            } else {
                return; // Not enough movement to start drag
            }
        }

        if (!this.isDragging || !this.toggle) return;

        e.preventDefault();

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
        // Reset drag state
        this.dragStartPosition = null;
        this.dragStartTime = 0;

        if (!this.isDragging) return;

        this.isDragging = false;
        this.container.classList.remove('dragging');
        this.toggle.classList.remove('dragging');

        this.savePosition();
        console.log('[LG Navigation] Drag ended');
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

    setupTooltips() {
        console.log('[LG Navigation] Setting up tooltips');
        
        // Get all info icons
        const infoIcons = document.querySelectorAll('.lg-nav-info-icon');
        const tooltips = document.querySelectorAll('.lg-nav-tooltip');
        
        // Add hover listeners to info icons
        infoIcons.forEach(icon => {
            const tooltipId = icon.getAttribute('data-tooltip');
            const tooltip = document.getElementById(`tooltip-${tooltipId}`);
            
            if (tooltip) {
                // Show tooltip on hover
                icon.addEventListener('mouseenter', () => {
                    this.hideAllTooltips(); // Hide any other open tooltips
                    this.showTooltip(tooltip, icon);
                });
                
                // Hide tooltip when leaving icon or tooltip
                icon.addEventListener('mouseleave', (e) => {
                    // Small delay to allow moving to tooltip
                    setTimeout(() => {
                        if (!tooltip.matches(':hover') && !icon.matches(':hover')) {
                            this.hideTooltip(tooltip);
                        }
                    }, 100);
                });
                
                // Keep tooltip visible when hovering over it
                tooltip.addEventListener('mouseenter', () => {
                    // Tooltip stays visible
                });
                
                tooltip.addEventListener('mouseleave', () => {
                    this.hideTooltip(tooltip);
                });
            }
        });
        
        // Add click listeners to close buttons (still useful for accessibility)
        const closeButtons = document.querySelectorAll('.lg-nav-tooltip-close');
        closeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const tooltip = button.closest('.lg-nav-tooltip');
                if (tooltip) {
                    this.hideTooltip(tooltip);
                }
            });
        });
    }
    
    toggleTooltip(tooltip, icon) {
        const isVisible = tooltip.classList.contains('show');
        
        // Hide all other tooltips first
        this.hideAllTooltips();
        
        if (!isVisible) {
            this.showTooltip(tooltip, icon);
        }
    }
    
    showTooltip(tooltip, icon) {
        // Position the tooltip relative to the icon
        this.positionTooltip(tooltip, icon);
        
        // Show the tooltip
        tooltip.classList.add('show');
        
        console.log('[LG Navigation] Tooltip shown');
    }
    
    hideTooltip(tooltip) {
        tooltip.classList.remove('show');
        tooltip.classList.remove('position-right', 'position-left', 'position-bottom', 'position-overlay');
    }
    
    hideAllTooltips() {
        const tooltips = document.querySelectorAll('.lg-nav-tooltip');
        tooltips.forEach(tooltip => {
            this.hideTooltip(tooltip);
        });
    }
    
    positionTooltip(tooltip, icon) {
        const iconRect = icon.getBoundingClientRect();
        const menuRect = this.menu.getBoundingClientRect();

        // Reset positioning classes
        tooltip.classList.remove('position-right', 'position-left', 'position-bottom');

        // Always position as overlay within the menu area
        tooltip.classList.add('position-overlay');
        
        // Calculate position relative to the icon within the menu
        const iconRelativeTop = iconRect.top - menuRect.top;
        
        // Position tooltip to the right side of the menu, aligned with the icon
        tooltip.style.right = '10px'; // 10px from right edge of menu
        tooltip.style.left = 'auto';
        tooltip.style.top = `${Math.max(10, iconRelativeTop - 10)}px`; // Near the icon but at least 10px from top
        tooltip.style.bottom = 'auto';
        
        // Ensure tooltip doesn't go below menu
        const tooltipHeight = 100; // Approximate height
        if (iconRelativeTop + tooltipHeight > menuRect.height - 20) {
            tooltip.style.top = 'auto';
            tooltip.style.bottom = '10px';
        }
        
        console.log('[LG Navigation] Tooltip positioned as absolute overlay within menu');
    }
}

// Initialize when navigation HTML is ready
document.addEventListener('lgNavigationReady', () => {
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

// Fallback: Auto-initialize when DOM is ready if navigation elements already exist
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if navigation elements exist and lgNavigationReady hasn't fired
    if (document.querySelector('.lg-nav-container') && !window.lgNavigation) {
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
    }
});

// Export for manual initialization if needed
window.LGAdvancedNavigation = LGAdvancedNavigation;