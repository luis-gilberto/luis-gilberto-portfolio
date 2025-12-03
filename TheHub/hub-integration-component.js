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
                { id: 'home', label: 'Home', url: 'https://luis-gilberto.com/TheHub/', icon: 'home' },
                { id: 'services', label: 'Services', url: 'https://luis-gilberto.com/TheHub/IMCServices/', icon: 'star' },
                { id: 'advisory', label: 'Advisory', url: 'https://luis-gilberto.com/TheHub/advisory/', icon: 'check-circle' },
                { id: 'scopeiq', label: 'ScopeIQ', url: 'https://luis-gilberto.com/TheHub/scopeiq/', icon: 'search' },
                { id: 'strategyiq', label: 'StrategyIQ', url: 'https://luis-gilberto.com/TheHub/strategyiq/', icon: 'brain' }
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
                font-size: 28px;
                font-weight: 700;
                color: #FF6B6B;
                margin-bottom: 2px;
                position: relative;
                text-shadow: 0 0 10px rgba(255, 107, 107, 0.3);
                font-family: inherit;
            }

            .hub-logo-tagline {
                font-size: 12px;
                color: #94a3b8;
                text-align: center;
                font-weight: 500;
                letter-spacing: 0.5px;
                font-family: inherit;
            }

            .hub-click-hint {
                position: absolute;
                top: -35px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 10px;
                color: #64748b;
                background: rgba(10, 10, 10, 0.9);
                padding: 4px 8px;
                border-radius: 6px;
                border: 1px solid rgba(255, 107, 107, 0.2);
                white-space: nowrap;
                opacity: 0.8;
                animation: hubHintFade 3s ease-in-out infinite;
                font-family: inherit;
            }

            @keyframes hubHintFade {
                0%, 50%, 100% { opacity: 0.8; }
                25%, 75% { opacity: 0.4; }
            }

            .hub-coral-line {
                position: absolute;
                top: -6px;
                left: 50%;
                transform: translateX(-50%);
                width: 60px;
                height: 4px;
                background: linear-gradient(90deg, #FF6B6B, #FF8E8E);
                border-radius: 2px;
                transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                transform-origin: center;
                box-shadow: 0 0 10px rgba(255, 107, 107, 0.4);
            }

            .hub-coral-line.morphing-stage-1 {
                width: 200px;
                height: 4px;
                top: 40px;
            }

            .hub-coral-line.morphing-stage-2 {
                width: 600px;
                height: 4px;
                top: 40px;
            }

            .hub-coral-line.morphing-stage-3 {
                width: 600px;
                height: 60px;
                top: 20px;
                border-radius: 30px;
                background: rgba(10, 10, 10, 0.98);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 107, 107, 0.3);
                box-shadow: 0 10px 40px rgba(255, 107, 107, 0.2);
            }

            .hub-navigation-content {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                opacity: 0;
                transform: translateY(10px);
                transition: all 0.4s ease 0.6s;
                display: flex;
                align-items: center;
                justify-content: space-around;
                padding: 0 20px;
            }

            .hub-coral-line.morphing-stage-3 .hub-navigation-content {
                opacity: 1;
                transform: translateY(0);
            }

            .hub-nav-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 8px;
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
                text-decoration: none;
                color: #94a3b8;
                min-width: 80px;
                position: relative;
            }

            .hub-nav-item:hover {
                background: rgba(255, 107, 107, 0.1);
                transform: translateY(-2px);
                color: #FF6B6B;
                box-shadow: 0 4px 15px rgba(255, 107, 107, 0.1);
                text-decoration: none;
            }

            .hub-nav-item.active {
                color: #FF6B6B;
                background: rgba(255, 107, 107, 0.1);
            }

            .hub-nav-item.active::after {
                content: '';
                position: absolute;
                bottom: -2px;
                left: 50%;
                transform: translateX(-50%);
                width: 20px;
                height: 2px;
                background: #FF6B6B;
                border-radius: 1px;
            }

            .hub-nav-icon {
                width: 24px;
                height: 24px;
                margin-bottom: 4px;
                transition: all 0.2s ease;
            }

            .hub-nav-item:hover .hub-nav-icon {
                transform: scale(1.1);
                filter: drop-shadow(0 0 5px rgba(255, 107, 107, 0.5));
            }

            .hub-nav-label {
                font-size: 11px;
                font-weight: 600;
                text-align: center;
                line-height: 1.2;
                font-family: inherit;
            }

            .hub-close-hint {
                position: absolute;
                top: -25px;
                right: 15px;
                font-size: 10px;
                color: #64748b;
                font-weight: 500;
                opacity: 0;
                transition: opacity 0.3s ease 0.8s;
                font-family: inherit;
            }

            .hub-coral-line.morphing-stage-3 .hub-close-hint {
                opacity: 1;
            }

            .hub-content-spacer {
                height: 80px;
                width: 100%;
            }

            .hub-logo-container.glowing {
                animation: hubLogoGlow 1.5s ease-in-out infinite alternate;
            }

            @keyframes hubLogoGlow {
                from { box-shadow: 0 0 5px rgba(255, 107, 107, 0.3); }
                to { box-shadow: 0 0 20px rgba(255, 107, 107, 0.6); }
            }

            @media (max-width: 768px) {
                .hub-coral-line.morphing-stage-2,
                .hub-coral-line.morphing-stage-3 {
                    width: 90vw;
                    max-width: 500px;
                }
                
                .hub-navigation-content {
                    padding: 0 15px;
                }
                
                .hub-nav-item {
                    min-width: 60px;
                }
                
                .hub-nav-label {
                    font-size: 10px;
                }

                .hub-logo-header {
                    padding: 0 15px;
                }
            }
        </style>
        `;

        document.head.insertAdjacentHTML('beforeend', styles);
    }

    // Create header structure
    createHeader() {
        if (document.querySelector('.hub-logo-header')) return;

        const header = document.createElement('div');
        header.className = 'hub-logo-header';
        header.innerHTML = `
            <!-- Hub logo container removed as requested -->
        `;

        document.body.insertBefore(header, document.body.firstChild);
        
        // Remove references to the removed elements
        this.elements.logoTrigger = null;
        this.elements.coralLine = null;
        this.elements.navContent = null;
    }

    // Create navigation items
    createNavigation() {
        // Navigation elements have been removed, skip navigation creation
        console.log('Hub Navigation: Navigation elements removed, skipping navigation creation');
        return;
    }

    // Create individual nav item
    createNavItem(item) {
        const navItem = document.createElement('a');
        navItem.className = 'hub-nav-item';
        navItem.href = item.url;
        navItem.dataset.page = item.id;

        const icon = this.createIcon(item.icon);
        const label = document.createElement('div');
        label.className = 'hub-nav-label';
        label.textContent = item.label;

        navItem.appendChild(icon);
        navItem.appendChild(label);

        return navItem;
    }

    // Create SVG icons
    createIcon(iconType) {
        const icon = document.createElement('svg');
        icon.className = 'hub-nav-icon';
        icon.setAttribute('viewBox', '0 0 24 24');
        icon.setAttribute('fill', 'currentColor');

        const iconPaths = {
            'home': 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
            'star': 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
            'check-circle': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
            'search': 'M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 0 1 9.5 16 6.5 6.5 0 0 1 3 9.5 6.5 6.5 0 0 1 9.5 3m0 2C7.01 5 5 7.01 5 9.5S7.01 14 9.5 14 14 11.99 14 9.5 11.99 5 9.5 5z',
            'bar-chart': 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z',
            'mail': 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z'
        };

        const path = document.createElement('path');
        path.setAttribute('d', iconPaths[iconType] || iconPaths['star']);
        icon.appendChild(path);

        return icon;
    }

    // Bind all event listeners
    bindEvents() {
        // Since hub navigation elements have been removed, skip event binding
        console.log('Hub Navigation: Navigation elements removed, skipping event binding');
        return;
    }

    // Add content spacer
    addContentSpacer() {
        if (document.querySelector('.hub-content-spacer')) return;

        const spacer = document.createElement('div');
        spacer.className = 'hub-content-spacer';
        
        // Insert after header
        const header = document.querySelector('.hub-logo-header');
        header.insertAdjacentElement('afterend', spacer);
    }

    // Toggle hub navigation
    toggleHub() {
        // Navigation elements removed, no toggle functionality
        console.log('Hub Navigation: Toggle functionality disabled - elements removed');
        return;
    }

    // Open hub
    openHub() {
        // Navigation elements removed, no open functionality
        console.log('Hub Navigation: Open functionality disabled - elements removed');
        return;
    }

    // Close hub
    closeHub() {
        // Navigation elements removed, no close functionality
        console.log('Hub Navigation: Close functionality disabled - elements removed');
        return;
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
        // Navigation elements removed, no page marking functionality
        console.log('Hub Navigation: Page marking disabled - elements removed');
        return;
    }

    // Detect current page
    detectCurrentPage() {
        const path = window.location.pathname;
        if (path === '/TheHub/' || path === '/TheHub/index.html' || path === '/' || path === '/index.html') return 'home';
        if (path.includes('/IMCServices')) return 'services';
        if (path.includes('/TheHub/advisory') || path.includes('/advisory')) return 'advisory';
        if (path.includes('/scopeiq')) return 'scopeiq';
        if (path.includes('/TheHub/strategyiq') || path.includes('/strategyiq')) return 'strategyiq';
        return null;
    }

    // Start glow effect
    startGlowEffect() {
        // Navigation elements removed, no glow effect
        console.log('Hub Navigation: Glow effect disabled - elements removed');
        return;
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
