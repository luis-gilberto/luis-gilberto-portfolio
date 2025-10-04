/**
 * Hub 2.0 Integration Component
 * Drop-in navigation system for Luis Gilberto's existing pages
 * Non-destructive - preserves existing page design
 */

class HubNavigationIntegration {
    constructor(config = {}) {
        this.config = {
            // Hub Pages - Clean local paths only
            navigationItems: [
                { id: 'services', label: 'Services', url: '/IMCServices/', icon: 'star' },
                { id: 'advisory', label: 'Advisory', url: '/IMCServices/advisory/', icon: 'check-circle' },
                { id: 'scopeiq', label: 'ScopeIQ', url: '/IMCServices/scopeiq-wizard/', icon: 'search' },
                { id: 'strategyiq', label: 'StrategyIQ', url: '/TheHub/strategyiq/', icon: 'brain' }
            ],
            
            // Current page detection
            currentPage: this.detectCurrentPage(),
            
            // Analytics
            trackEvents: true,
            
            ...config
        };
        
        this.isExpanded = false;
        this.isMorphing = false;
        this.elements = {};
    }

    // Initialize the system
    init() {
        this.injectStyles();
        this.createHeader();
        this.createNavigation();
        this.bindEvents();
        this.addContentSpacer();
        
        console.log('🎯 Hub Navigation 2.0 initialized');
        return this;
    }

    // Inject all necessary styles
    injectStyles() {
        if (document.getElementById('hub-nav-styles')) return;

        const styles = `
        <style id="hub-nav-styles">
            .hub-logo-header {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                height: 80px;
                background: rgba(10, 10, 10, 0.95);
                backdrop-filter: blur(20px);
                border-bottom: 1px solid rgba(255, 107, 107, 0.2);
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }

            .hub-logo-container {
                position: relative;
                cursor: pointer;
                transition: all 0.3s ease;
                padding: 10px 20px;
                border-radius: 12px;
                animation: hubLogoPulse 2s ease-in-out infinite;
                user-select: none;
            }

            .hub-logo-container:hover {
                transform: translateY(-2px);
                background: rgba(255, 107, 107, 0.05);
                box-shadow: 0 4px 20px rgba(255, 107, 107, 0.1);
                animation: none;
            }

            @keyframes hubLogoPulse {
                0%, 100% { box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.4); }
                50% { box-shadow: 0 0 0 8px rgba(255, 107, 107, 0); }
            }

            .hub-logo-text {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 1.5rem;
                font-weight: 900;
                background: linear-gradient(135deg, #FF6B6B, #FF8E8E);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                margin: 0;
                letter-spacing: -0.02em;
            }

            .hub-coral-line {
                position: absolute;
                bottom: -2px;
                left: 50%;
                transform: translateX(-50%);
                width: 60px;
                height: 3px;
                background: linear-gradient(90deg, #FF6B6B, #FF8E8E);
                border-radius: 2px;
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                overflow: hidden;
            }

            .hub-coral-line::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
                animation: hubLineShimmer 3s infinite;
            }

            @keyframes hubLineShimmer {
                0% { left: -100%; }
                100% { left: 100%; }
            }

            /* Expanded Navigation States */
            .hub-logo-header.expanded {
                height: auto;
                min-height: 80px;
                padding-bottom: 20px;
            }

            .hub-logo-header.expanded .hub-coral-line {
                width: 200px;
                height: 4px;
                background: linear-gradient(90deg, #FF6B6B, #FF8E8E, #FF6B6B);
            }

            .hub-nav-content {
                position: absolute;
                top: 80px;
                left: 50%;
                transform: translateX(-50%);
                width: 90%;
                max-width: 600px;
                background: rgba(26, 26, 26, 0.95);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 107, 107, 0.2);
                border-radius: 16px;
                padding: 0;
                opacity: 0;
                visibility: hidden;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            }

            .hub-nav-content.visible {
                opacity: 1;
                visibility: visible;
                transform: translateX(-50%) translateY(10px);
            }

            .hub-nav-item {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem 1.5rem;
                color: #e2e8f0;
                text-decoration: none;
                border-bottom: 1px solid rgba(255, 107, 107, 0.1);
                transition: all 0.3s ease;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-weight: 500;
                position: relative;
                overflow: hidden;
            }

            .hub-nav-item:last-child {
                border-bottom: none;
                border-radius: 0 0 16px 16px;
            }

            .hub-nav-item:first-child {
                border-radius: 16px 16px 0 0;
            }

            .hub-nav-item::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 107, 107, 0.1), transparent);
                transition: left 0.5s ease;
            }

            .hub-nav-item:hover::before {
                left: 100%;
            }

            .hub-nav-item:hover {
                background: rgba(255, 107, 107, 0.05);
                color: #FF8E8E;
                transform: translateX(8px);
            }

            .hub-nav-item.active {
                background: rgba(255, 107, 107, 0.1);
                color: #FF8E8E;
                border-left: 3px solid #FF6B6B;
            }

            .hub-nav-icon {
                width: 20px;
                height: 20px;
                fill: currentColor;
                flex-shrink: 0;
            }

            .hub-nav-label {
                font-size: 0.95rem;
                flex-grow: 1;
            }

            /* Content Spacer */
            .hub-content-spacer {
                height: 80px;
                width: 100%;
                flex-shrink: 0;
            }

            /* Mobile Responsive */
            @media (max-width: 768px) {
                .hub-logo-text {
                    font-size: 1.25rem;
                }
                
                .hub-nav-content {
                    width: 95%;
                    max-width: none;
                }
                
                .hub-nav-item {
                    padding: 0.875rem 1.25rem;
                }
                
                .hub-nav-label {
                    font-size: 0.9rem;
                }
            }

            /* Accessibility */
            @media (prefers-reduced-motion: reduce) {
                .hub-logo-container {
                    animation: none;
                }
                
                .hub-coral-line::before {
                    animation: none;
                }
                
                * {
                    transition-duration: 0.1s !important;
                }
            }

            /* High contrast mode */
            @media (prefers-contrast: high) {
                .hub-logo-header {
                    background: rgba(0, 0, 0, 0.98);
                    border-bottom: 2px solid #FF6B6B;
                }
                
                .hub-nav-content {
                    background: rgba(0, 0, 0, 0.98);
                    border: 2px solid #FF6B6B;
                }
            }
        </style>
        `;

        document.head.insertAdjacentHTML('beforeend', styles);
    }

    // Create the header with logo
    createHeader() {
        const header = document.createElement('div');
        header.className = 'hub-logo-header';
        header.id = 'hubLogoHeader';
        
        header.innerHTML = `
            <div class="hub-logo-container" id="hubLogoTrigger" role="button" tabindex="0" aria-label="Toggle Hub Navigation" aria-expanded="false">
                <h1 class="hub-logo-text">The Hub.</h1>
                <div class="hub-coral-line" id="hubCoralLine"></div>
            </div>
            <div class="hub-nav-content" id="hubNavContent" role="menu" aria-hidden="true">
                <!-- Navigation items will be inserted here -->
            </div>
        `;
        
        document.body.insertBefore(header, document.body.firstChild);
        
        // Store element references
        this.elements.header = header;
        this.elements.logoTrigger = document.getElementById('hubLogoTrigger');
        this.elements.coralLine = document.getElementById('hubCoralLine');
        this.elements.navContent = document.getElementById('hubNavContent');
    }

    // Create navigation items
    createNavigation() {
        // Ensure navContent element exists
        if (!this.elements.navContent) {
            this.elements.navContent = document.getElementById('hubNavContent');
        }
        
        if (!this.elements.navContent) {
            console.error('Hub Navigation: navContent element not found');
            return;
        }
        
        // Clear existing navigation items to prevent duplicates
        this.elements.navContent.innerHTML = '';
        
        this.config.navigationItems.forEach(item => {
            const navItem = this.createNavItem(item);
            this.elements.navContent.appendChild(navItem);
        });

        // Mark current page
        this.markCurrentPage();
    }

    // Create individual navigation item
    createNavItem(item) {
        const navItem = document.createElement('a');
        navItem.className = 'hub-nav-item';
        navItem.href = item.url;
        navItem.dataset.page = item.id;
        navItem.role = 'menuitem';
        navItem.setAttribute('aria-label', `Navigate to ${item.label}`);
        
        const icon = this.createIcon(item.icon);
        const label = document.createElement('span');
        label.className = 'hub-nav-label';
        label.textContent = item.label;
        
        navItem.appendChild(icon);
        navItem.appendChild(label);
        
        return navItem;
    }

    // Create SVG icons
    createIcon(iconType) {
        const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        icon.setAttribute('class', 'hub-nav-icon');
        icon.setAttribute('viewBox', '0 0 24 24');
        icon.setAttribute('fill', 'currentColor');
        
        const iconPaths = {
            'star': 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
            'check-circle': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
            'brain': 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z',
            'search': 'M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 0 1 9.5 16 6.5 6.5 0 0 1 3 9.5 6.5 6.5 0 0 1 9.5 3m0 2C7.01 5 5 7.01 5 9.5S7.01 14 9.5 14 14 11.99 14 9.5 11.99 5 9.5 5z',
            'mail': 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z'
        };

        const path = document.createElement('path');
        path.setAttribute('d', iconPaths[iconType] || iconPaths['star']);
        icon.appendChild(path);

        return icon;
    }

    // Bind all event listeners
    bindEvents() {
        // Ensure elements exist before binding
        if (!this.elements.logoTrigger) {
            this.elements.logoTrigger = document.getElementById('hubLogoTrigger');
        }
        if (!this.elements.coralLine) {
            this.elements.coralLine = document.getElementById('hubCoralLine');
        }
        if (!this.elements.navContent) {
            this.elements.navContent = document.getElementById('hubNavContent');
        }
        
        if (!this.elements.logoTrigger || !this.elements.coralLine || !this.elements.navContent) {
            console.error('Hub Navigation: Required elements not found for event binding');
            console.log('Elements found:', {
                logoTrigger: !!this.elements.logoTrigger,
                coralLine: !!this.elements.coralLine,
                navContent: !!this.elements.navContent
            });
            return;
        }
        
        try {
            // Logo click
            if (this.elements.logoTrigger && typeof this.elements.logoTrigger.addEventListener === 'function') {
                this.elements.logoTrigger.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleHub();
                });
            }

            // Outside click to close
            document.addEventListener('click', (e) => {
                if (this.isExpanded && 
                    this.elements.coralLine && this.elements.logoTrigger &&
                    !this.elements.coralLine.contains(e.target) && 
                    !this.elements.logoTrigger.contains(e.target)) {
                    this.closeHub();
                }
            });

            // Navigation clicks
            if (this.elements.navContent && typeof this.elements.navContent.addEventListener === 'function') {
                this.elements.navContent.addEventListener('click', (e) => {
                    const navItem = e.target.closest('.hub-nav-item');
                    if (navItem) {
                        e.preventDefault();
                        const page = navItem.dataset.page;
                        const url = navItem.href;
                        this.navigateToPage(page, url);
                    }
                });
            }

            // Keyboard navigation
            if (this.elements.logoTrigger && typeof this.elements.logoTrigger.addEventListener === 'function') {
                this.elements.logoTrigger.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.toggleHub();
                    }
                });
            }

            // Escape key to close
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isExpanded) {
                    this.closeHub();
                }
            });
        } catch (error) {
            console.error('Hub Navigation: Error binding events:', error);
        }
    }

    // Toggle hub navigation
    toggleHub() {
        if (this.isMorphing) return;
        
        if (this.isExpanded) {
            this.closeHub();
        } else {
            this.openHub();
        }
    }

    // Open hub navigation
    openHub() {
        if (this.isMorphing || this.isExpanded) return;
        
        this.isMorphing = true;
        this.isExpanded = true;
        
        // Update ARIA attributes
        this.elements.logoTrigger.setAttribute('aria-expanded', 'true');
        this.elements.navContent.setAttribute('aria-hidden', 'false');
        
        // Add expanded class to header
        this.elements.header.classList.add('expanded');
        
        // Show navigation content with delay for coral line animation
        setTimeout(() => {
            this.elements.navContent.classList.add('visible');
            this.isMorphing = false;
        }, 200);
        
        this.trackEvent('hub_opened');
    }

    // Close hub navigation
    closeHub() {
        if (this.isMorphing || !this.isExpanded) return;
        
        this.isMorphing = true;
        this.isExpanded = false;
        
        // Update ARIA attributes
        this.elements.logoTrigger.setAttribute('aria-expanded', 'false');
        this.elements.navContent.setAttribute('aria-hidden', 'true');
        
        // Hide navigation content
        this.elements.navContent.classList.remove('visible');
        
        // Remove expanded class after animation
        setTimeout(() => {
            this.elements.header.classList.remove('expanded');
            this.isMorphing = false;
        }, 400);
        
        this.trackEvent('hub_closed');
    }

    // Navigate to page
    navigateToPage(page, url) {
        this.trackEvent('hub_navigation', { page, url });
        
        this.closeHub();
        
        setTimeout(() => {
            window.location.href = url;
        }, 600);
    }

    // Mark current page as active
    markCurrentPage() {
        const currentPath = window.location.pathname;
        const navItems = this.elements.navContent.querySelectorAll('.hub-nav-item');
        
        navItems.forEach(item => {
            const itemPath = new URL(item.href, window.location.origin).pathname;
            if (currentPath === itemPath || currentPath.startsWith(itemPath + '/')) {
                item.classList.add('active');
            }
        });
    }

    // Detect current page
    detectCurrentPage() {
        const path = window.location.pathname;
        if (path === '/' || path === '/index.html') return 'home';
        if (path.includes('/IMCServices')) return 'services';
        if (path.includes('/advisory')) return 'advisory';
        if (path.includes('/scopeiq')) return 'scopeiq';
        if (path.includes('/strategyiq')) return 'strategyiq';
        return null;
    }

    // Add content spacer to prevent overlap
    addContentSpacer() {
        // Check if spacer already exists
        if (document.querySelector('.hub-content-spacer')) return;
        
        const spacer = document.createElement('div');
        spacer.className = 'hub-content-spacer';
        
        // Insert after the header
        const firstElement = document.body.children[1]; // Skip the header we just added
        if (firstElement) {
            document.body.insertBefore(spacer, firstElement);
        }
    }

    // Track events
    trackEvent(event, data = {}) {
        if (this.config.trackEvents && typeof gtag !== 'undefined') {
            gtag('event', event, {
                event_category: 'hub_navigation_2.0',
                ...data
            });
        }
        console.log(`🎯 Hub 2.0 Event: ${event}`, data);
    }

    // Destroy the system
    destroy() {
        const elements = [
            '.hub-logo-header',
            '.hub-content-spacer',
            '#hub-nav-styles'
        ];
        
        elements.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) element.remove();
        });
        
        console.log('🎯 Hub Navigation 2.0 destroyed');
    }
}

// Static initialization
HubNavigationIntegration.init = function(config = {}) {
    if (typeof window !== 'undefined') {
        window.hubNavigation = new HubNavigationIntegration(config).init();
        return window.hubNavigation;
    }
};

// Auto-initialize
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (!window.hubNavigation) {
                HubNavigationIntegration.init();
            }
        });
    } else {
        if (!window.hubNavigation) {
            HubNavigationIntegration.init();
        }
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HubNavigationIntegration;
}