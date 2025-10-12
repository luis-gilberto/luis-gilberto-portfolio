class AdvancedNavigation {
    constructor() {
        console.log('AdvancedNavigation constructor called');
        this.trigger = null;
        this.panel = null;
        this.isOpen = false;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.currentTooltip = null;
        this.scrollSpy = null;
        
        this.init();
    }

    init() {
        console.log('AdvancedNavigation init called');
        this.createElements();
        this.bindEvents();
        this.initScrollSpy();
        this.initKeyboardNavigation();
        console.log('AdvancedNavigation init completed');
    }

    createElements() {
        console.log('Creating navigation elements...');
        // Create trigger button
        this.trigger = document.createElement('button');
        console.log('Trigger button created:', this.trigger);
        this.trigger.className = 'lg-nav-toggle';
        this.trigger.type = 'button';
        
        // Ensure trigger is visible with explicit styles
        this.trigger.style.position = 'fixed';
        this.trigger.style.top = '40px';
        this.trigger.style.left = '40px';
        this.trigger.style.width = '60px';
        this.trigger.style.height = '60px';
        this.trigger.style.background = '#f96f6e';
        this.trigger.style.border = 'none';
        this.trigger.style.borderRadius = '50%';
        this.trigger.style.cursor = 'pointer';
        this.trigger.style.zIndex = '1001';
        this.trigger.style.display = 'flex';
        this.trigger.style.alignItems = 'center';
        this.trigger.style.justifyContent = 'center';
        this.trigger.style.color = 'white';
        this.trigger.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
        this.trigger.style.transition = 'all 0.3s ease';
        this.trigger.style.opacity = '1';
        this.trigger.style.visibility = 'visible';
        this.trigger.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 488 456" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M189.19 245.66C186.77 247.36 184.29 248.97 181.88 250.69V268.82C181.88 274.85 186.77 279.75 192.81 279.75H289.08C293.99 279.75 297.76 284.16 296.93 289.01C288.43 339.06 244.86 377.17 192.39 377.17H184.39C125.82 377.17 78.3401 329.69 78.3401 271.12V10.65C78.3401 4.76999 73.5702 0 67.6902 0H10.6501C4.77015 0 0 4.76999 0 10.65V265.52C0 370.35 84.9801 455.34 189.82 455.34C289.87 455.34 371.83 377.94 379.11 279.75C379.46 275.05 379.64 270.31 379.64 265.52V204.56C368.99 202.21 358.05 201.54 346.88 200.6C289.04 195.72 235.01 213.52 189.18 245.68L189.19 245.66Z" fill="currentColor"/>
                <path d="M482.52 202.14C459.6 189.98 434.75 180.53 408.28 174.35C372.78 166.06 337.29 164.3 303.05 168.27C302.13 168.38 301.2 168.5 300.28 168.62C273.45 171.99 247.42 178.87 222.8 188.92C218.97 190.48 215.19 192.15 211.43 193.86C173.04 211.35 138.42 236.59 110.03 268.15C106.04 272.58 106.76 279.49 111.57 283C115.75 286.04 121.53 285.39 124.98 281.55C148.56 255.34 176.75 233.8 207.92 217.85C210.96 216.3 214.01 214.78 217.1 213.33C273.36 187.02 338.54 178.69 403.71 193.92C416.3 196.86 428.49 200.59 440.25 205.05C444.25 206.56 448.19 208.16 452.09 209.83C459.25 212.91 466.24 216.27 473.05 219.88C477.49 222.23 482.97 221.02 485.93 216.96C489.54 212 487.91 205.01 482.5 202.14H482.52Z" fill="currentColor"/>
            </svg>
        `;
        this.trigger.setAttribute('aria-label', 'Open navigation menu');

        // Create navigation panel
        this.panel = document.createElement('div');
        this.panel.className = 'advanced-nav-panel';
        this.panel.innerHTML = `
            <div class="nav-backdrop"></div>
            <div class="nav-content" role="dialog" aria-labelledby="nav-title" aria-modal="true">
                <div class="nav-header">
                    <div class="nav-header-info">
                        <h2 id="nav-title">Navigation</h2>
                        <p>Quick access to all sections</p>
                    </div>
                    <button class="nav-close" aria-label="Close navigation">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                
                <div class="nav-section">
                    <div class="nav-section-title">IMC HUB</div>
                    <a href="../../" class="nav-link" data-tooltip="hub">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9,22 9,12 15,12 15,22"></polyline>
                        </svg>
                        The Hub
                        <div class="nav-info-icon">i</div>
                    </a>
                    <a href="../" class="nav-link" data-tooltip="services">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                            <path d="M2 17l10 5 10-5"></path>
                            <path d="M2 12l10 5 10-5"></path>
                        </svg>
                        Services
                        <div class="nav-info-icon">i</div>
                    </a>
                    <a href="./" class="nav-link active" data-tooltip="advisory">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 11H5a2 2 0 0 0-2 2v3c0 1.1.9 2 2 2h4m6-6h4a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-4m-6 0V9a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2z"></path>
                        </svg>
                        Advisory
                        <div class="nav-info-icon">i</div>
                    </a>
                    <a href="../scopeiq-wizard/" class="nav-link" data-tooltip="scopeiq">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"></path>
                        </svg>
                        ScopeIQ
                        <div class="nav-info-icon">i</div>
                    </a>
                </div>

                <div class="nav-section">
                    <div class="nav-section-title">Explore on this page</div>
                    <a href="#hero" class="nav-link page-nav-link" data-section="hero">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                        </svg>
                        Hero Section
                    </a>
                    <a href="#services" class="nav-link page-nav-link" data-section="services">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="3" width="7" height="7"></rect>
                            <rect x="14" y="3" width="7" height="7"></rect>
                            <rect x="14" y="14" width="7" height="7"></rect>
                            <rect x="3" y="14" width="7" height="7"></rect>
                        </svg>
                        Strategic Services
                    </a>
                    <a href="#investment" class="nav-link page-nav-link" data-section="investment">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="1" x2="12" y2="23"></line>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>
                        Investment Levels
                    </a>
                    <a href="#testimonials" class="nav-link page-nav-link" data-section="testimonials">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        Client Stories
                    </a>
                    <a href="#microsoft-legacy" class="nav-link page-nav-link" data-section="microsoft-legacy">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polygon points="12 2 15.09 8.26 22 9 17 14.74 18.18 21.02 12 17.77 5.82 21.02 7 14.74 2 9 8.91 8.26 12 2"></polygon>
                        </svg>
                        Brand Legacy
                    </a>
                </div>

                <div class="nav-section">
                    <div class="nav-section-title">Connect</div>
                    <a href="mailto:luis@luis-gilberto.com" class="nav-link">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        Email
                    </a>
                    <a href="https://linkedin.com/in/luisgilberto" target="_blank" rel="noopener" class="nav-link">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                            <rect x="2" y="9" width="4" height="12"></rect>
                            <circle cx="4" cy="4" r="2"></circle>
                        </svg>
                        LinkedIn
                    </a>
                </div>
            </div>
        `;

        // Append to body
        console.log('Appending trigger to body...');
        document.body.appendChild(this.trigger);
        console.log('Trigger appended. Appending panel to body...');
        document.body.appendChild(this.panel);
        console.log('Panel appended. Elements creation complete.');
    }

    bindEvents() {
        // Trigger events
        this.trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggle();
        });

        // Keyboard support for trigger
        this.trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggle();
            }
        });

        // Drag functionality
        this.trigger.addEventListener('mousedown', this.handleDragStart.bind(this));
        document.addEventListener('mousemove', this.handleDragMove.bind(this));
        document.addEventListener('mouseup', this.handleDragEnd.bind(this));

        // Touch events for mobile
        this.trigger.addEventListener('touchstart', this.handleTouchStart.bind(this));
        document.addEventListener('touchmove', this.handleTouchMove.bind(this));
        document.addEventListener('touchend', this.handleTouchEnd.bind(this));

        // Panel events
        const backdrop = this.panel.querySelector('.nav-backdrop');
        const closeBtn = this.panel.querySelector('.nav-close');
        
        backdrop.addEventListener('click', () => this.close());
        closeBtn.addEventListener('click', () => this.close());

        // Page navigation links
        const pageLinks = this.panel.querySelectorAll('.page-nav-link');
        console.log('Found page navigation links:', pageLinks.length);
        pageLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                console.log('Navigation link clicked:', link.getAttribute('href'));
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                console.log('Target ID:', targetId);
                this.scrollToSection(targetId);
                this.close();
            });
        });

        // Tooltip functionality
        const tooltipTriggers = this.panel.querySelectorAll('[data-tooltip]');
        tooltipTriggers.forEach(trigger => {
            const infoIcon = trigger.querySelector('.nav-info-icon');
            if (infoIcon) {
                infoIcon.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.showTooltip(trigger, trigger.dataset.tooltip);
                });
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    handleDragStart(e) {
        if (e.target.closest('.nav-info-icon')) return;
        
        this.isDragging = true;
        this.trigger.classList.add('dragging');
        const rect = this.trigger.getBoundingClientRect();
        this.dragOffset.x = e.clientX - rect.left;
        this.dragOffset.y = e.clientY - rect.top;
        e.preventDefault();
    }

    handleDragMove(e) {
        if (!this.isDragging) return;
        
        const x = e.clientX - this.dragOffset.x;
        const y = e.clientY - this.dragOffset.y;
        
        this.updateTriggerPosition(x, y);
    }

    handleDragEnd() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.trigger.classList.remove('dragging');
    }

    handleTouchStart(e) {
        if (e.target.closest('.nav-info-icon')) return;
        
        const touch = e.touches[0];
        this.touchStartTime = Date.now();
        this.touchStartPos = { x: touch.clientX, y: touch.clientY };
        this.hasMoved = false;
        
        const rect = this.trigger.getBoundingClientRect();
        this.dragOffset.x = touch.clientX - rect.left;
        this.dragOffset.y = touch.clientY - rect.top;
        
        // Don't prevent default immediately - let it be a potential tap
    }

    handleTouchMove(e) {
        if (!this.touchStartPos) return;
        
        const touch = e.touches[0];
        const deltaX = Math.abs(touch.clientX - this.touchStartPos.x);
        const deltaY = Math.abs(touch.clientY - this.touchStartPos.y);
        
        // If moved more than 10px, consider it a drag
        if (deltaX > 10 || deltaY > 10) {
            if (!this.isDragging) {
                this.isDragging = true;
                this.hasMoved = true;
                this.trigger.classList.add('dragging');
            }
            
            const x = touch.clientX - this.dragOffset.x;
            const y = touch.clientY - this.dragOffset.y;
            
            this.updateTriggerPosition(x, y);
            e.preventDefault();
        }
    }

    handleTouchEnd(e) {
        const touchEndTime = Date.now();
        const touchDuration = touchEndTime - this.touchStartTime;
        
        // If it was a quick tap (less than 300ms) and didn't move much, treat as click
        if (!this.hasMoved && touchDuration < 300) {
            e.preventDefault();
            this.toggle();
        }
        
        this.isDragging = false;
        this.hasMoved = false;
        this.touchStartPos = null;
        this.touchStartTime = null;
        this.trigger.classList.remove('dragging');
    }

    updateTriggerPosition(x, y) {
        const maxX = window.innerWidth - this.trigger.offsetWidth;
        const maxY = window.innerHeight - this.trigger.offsetHeight;
        
        const constrainedX = Math.max(0, Math.min(x, maxX));
        const constrainedY = Math.max(0, Math.min(y, maxY));
        
        this.trigger.style.left = `${constrainedX}px`;
        this.trigger.style.top = `${constrainedY}px`;
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.isOpen = true;
        this.trigger.classList.add('active');
        this.panel.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus management
        const firstFocusable = this.panel.querySelector('.nav-close');
        if (firstFocusable) {
            setTimeout(() => firstFocusable.focus(), 100);
        }
    }

    close() {
        this.isOpen = false;
        this.trigger.classList.remove('active');
        this.panel.classList.remove('active');
        document.body.style.overflow = '';
        this.hideTooltip();
        
        // Return focus to trigger
        this.trigger.focus();
    }

    scrollToSection(sectionId) {
        console.log('scrollToSection called with:', sectionId);
        const element = document.getElementById(sectionId);
        console.log('Found element:', element);
        if (element) {
            const headerOffset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            console.log('Scrolling to position:', offsetPosition);

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        } else {
            console.log('Element not found for ID:', sectionId);
        }
    }

    showTooltip(trigger, type) {
        this.hideTooltip();

        const tooltips = {
            services: {
                title: 'Services Overview',
                desc: 'Comprehensive business solutions including strategy, operations, and digital transformation services.'
            },
            advisory: {
                title: 'Strategic Advisory',
                desc: 'Expert consulting for business strategy, market positioning, and growth planning tailored to your needs.'
            },
            scopeiq: {
                title: 'ScopeIQ Platform',
                desc: 'Intelligent project scoping tool that helps define requirements, estimate costs, and plan timelines.'
            }
        };

        const tooltipData = tooltips[type];
        if (!tooltipData) return;

        const tooltip = document.createElement('div');
        tooltip.className = 'nav-tooltip';
        tooltip.innerHTML = `
            <button class="nav-tooltip-close" aria-label="Close tooltip">×</button>
            <div class="nav-tooltip-title">${tooltipData.title}</div>
            <p class="nav-tooltip-desc">${tooltipData.desc}</p>
        `;

        document.body.appendChild(tooltip);
        this.currentTooltip = tooltip;

        // Position tooltip
        const triggerRect = trigger.getBoundingClientRect();
        const panelRect = this.panel.querySelector('.nav-content').getBoundingClientRect();
        
        tooltip.style.top = `${triggerRect.top}px`;
        tooltip.style.left = `${panelRect.right + 20}px`;

        // Show tooltip
        setTimeout(() => tooltip.classList.add('show'), 10);

        // Close button
        const closeBtn = tooltip.querySelector('.nav-tooltip-close');
        closeBtn.addEventListener('click', () => this.hideTooltip());

        // Auto-hide after 5 seconds
        setTimeout(() => this.hideTooltip(), 5000);
    }

    hideTooltip() {
        if (this.currentTooltip) {
            this.currentTooltip.remove();
            this.currentTooltip = null;
        }
    }

    initScrollSpy() {
        const sections = ['hero', 'services', 'investment', 'testimonials', 'microsoft-legacy'];
        const navLinks = this.panel.querySelectorAll('.page-nav-link');

        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        this.scrollSpy = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const sectionId = entry.target.id;
                const navLink = this.panel.querySelector(`[data-section="${sectionId}"]`);
                
                if (entry.isIntersecting) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    if (navLink) {
                        navLink.classList.add('active');
                    }
                }
            });
        }, observerOptions);

        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                this.scrollSpy.observe(section);
            }
        });
    }

    initKeyboardNavigation() {
        this.panel.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                this.handleTabNavigation(e);
            }
        });
    }

    handleTabNavigation(e) {
        const focusableElements = this.panel.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }

    destroy() {
        if (this.scrollSpy) {
            this.scrollSpy.disconnect();
        }
        
        this.hideTooltip();
        
        if (this.trigger) {
            this.trigger.remove();
        }
        
        if (this.panel) {
            this.panel.remove();
        }
        
        document.body.style.overflow = '';
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing AdvancedNavigation');
    const nav = new AdvancedNavigation();
    console.log('AdvancedNavigation initialized:', nav);
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden && window.advancedNav && window.advancedNav.isOpen) {
        window.advancedNav.close();
    }
});