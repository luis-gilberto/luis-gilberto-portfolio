// Hub Navigation & Footer System
// Complete implementation for The Hub homepage

class HubSystem {
    constructor() {
        this.currentPage = 'home';
        this.isMobile = window.innerWidth <= 768;
        this.isMenuOpen = false;
        
        // Initialize on DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        this.createNavigation();
        this.createFooter();
        this.bindEvents();
        this.addBodyPadding();
        console.log('🎯 Hub Navigation & Footer System initialized');
    }

    createNavigation() {
        // Create navigation HTML
        const navHTML = `
            <nav class="hub-nav" id="hubNav">
                <div class="hub-nav-container">
                    <div class="hub-nav-spacer"></div>
                    
                    <div class="hub-nav-brand">
                        <a href="/TheHub/" class="hub-nav-logo">
                            <img src="/TheHub/advisory/assets/TheHub_Logo.png" alt="The Hub" class="hub-nav-logo-img">
                        </a>
                    </div>
                    
                    <div class="hub-nav-actions">
                        <a href="https://luis-gilberto.com/contact?from=imc#cta-hook" class="hub-nav-contact">
                            <img src="/TheHub/advisory/assets/Contact_Simple_100x100.png" alt="Contact" class="hub-nav-contact-icon">
                            <span class="hub-nav-contact-text">Contact</span>
                        </a>
                        
                        <button class="hub-nav-mobile-toggle" id="hubNavToggle" aria-label="Toggle navigation menu">
                            <span class="hub-nav-hamburger"></span>
                            <span class="hub-nav-hamburger"></span>
                            <span class="hub-nav-hamburger"></span>
                        </button>
                    </div>
                </div>
                
                <div class="hub-nav-mobile-menu" id="hubNavMobileMenu">
                <div class="hub-nav-mobile-content">
                        <a href="/TheHub/IMCServices/" class="hub-nav-mobile-link">
                             <img src="/TheHub/advisory/assets/IMC_Services_Simple_100x100.png" alt="Services">
                             <span>Services</span>
                         </a>
                         <a href="/TheHub/advisory/" class="hub-nav-mobile-link">
                             <img src="/TheHub/advisory/assets/Advisory_Simple_100x100.png" alt="Advisory">
                             <span>Advisory</span>
                         </a>
                         <a href="/TheHub/scopeiq/index.html" class="hub-nav-mobile-link">
                             <img src="/TheHub/advisory/assets/ScopeIQ_Clean_Telescope_100x100.png" alt="ScopeIQ">
                             <span>ScopeIQ</span>
                         </a>
                         <a href="/TheHub/strategyiq/" class="hub-nav-mobile-link">
                             <img src="/TheHub/advisory/assets/StrategyIQ_Simple_100x100.png" alt="StrategyIQ">
                             <span>StrategyIQ</span>
                         </a>
                         <a href="https://luis-gilberto.com/contact?from=hub#cta-hook" class="hub-nav-mobile-link hub-nav-mobile-contact">
                             <img src="/TheHub/advisory/assets/Contact_Simple_100x100.png" alt="Contact">
                             <span>Contact</span>
                         </a>
                    </div>
                </div>
            </nav>
        `;

        // Create navigation styles
        const navStyles = `
            <style id="hub-nav-styles">
                /* Navigation Styles */
                .hub-nav {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 85px;
                    background: rgba(13, 13, 13, 0.95);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                    z-index: 1000;
                    transition: all 0.3s ease;
                }

                .hub-nav.scrolled {
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                }

                .hub-nav-container {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 0 2rem;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    position: relative;
                }

                .hub-nav-spacer {
                    flex: 1;
                }

                .hub-nav-brand {
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    justify-content: center;
                }

                .hub-nav-logo {
                    text-decoration: none;
                    color: white;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.125rem;
                    transition: all 0.3s ease;
                }

                .hub-nav-logo:hover {
                    transform: translateY(-1px);
                }

                .hub-nav-logo-img {
                    height: 75px;
                    width: auto;
                    transition: all 0.3s ease;
                }

                .hub-nav-title {
                    font-size: 1.75rem;
                    font-weight: 700;
                    line-height: 1;
                    background: linear-gradient(135deg, #ffffff 0%, #f96f6e 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .hub-nav-actions {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .hub-nav-contact {
                    display: flex;
                    align-items: center;
                    gap: 0.375rem;
                    padding: 0.375rem 0.75rem;
                    background: #f96f6e;
                    color: white;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 0.95rem;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 16px rgba(249, 111, 110, 0.3);
                }

                .hub-nav-contact:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(249, 111, 110, 0.4);
                    background: #ff7b7a;
                }

                .hub-nav-contact-icon {
                    width: 20px;
                    height: 20px;
                    filter: brightness(0) invert(1);
                }

                .hub-nav-mobile-toggle {
                    display: none;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 6px; /* distinct separation between lines */
                    background: none;
                    border: none;
                    padding: 0.5rem;
                    cursor: pointer;
                }

                .hub-nav-hamburger {
                    display: block;
                    width: 24px;
                    height: 3px; /* thicker for clarity on mobile/tablet */
                    background: white;
                    border-radius: 2px; /* rounded ends to avoid dash look */
                    transition: all 0.3s ease;
                    transform-origin: center; /* align rotations cleanly */
                }

                /* UPDATED: Full-screen mobile drawer overlay */
                .hub-nav-mobile-menu {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    z-index: 1001;
                    background: rgba(12, 12, 12, 0.96); /* darker, less transparent */
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    opacity: 0;
                    visibility: hidden;
                    pointer-events: none;
                    transition: opacity 0.25s ease, visibility 0.25s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .hub-nav-mobile-menu.open {
                    opacity: 1;
                    visibility: visible;
                    pointer-events: auto;
                }

                /* UPDATED: Evenly distributed layout and doubled sizes */
                .hub-nav-mobile-content {
                    width: 100%;
                    height: 100%;
                    max-width: 720px;
                    margin: 0 auto;
                    padding: 2rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-evenly; /* evenly spaced items */
                    align-items: center;
                    gap: 0;
                }

                .hub-nav-mobile-link {
                    display: flex;
                    align-items: center;
                    gap: 1.25rem; /* slightly larger gap */
                    padding: 2rem; /* doubled from 1rem */
                    color: white;
                    text-decoration: none;
                    border-radius: 16px; /* larger radius for bigger cards */
                    transition: all 0.25s ease;
                    border: 1px solid rgba(255, 255, 255, 0.10);
                    width: min(90vw, 520px);
                    will-change: transform;
                }

                .hub-nav-mobile-link:hover {
                    background: rgba(255, 255, 255, 0.06);
                    border-color: rgba(226, 93, 82, 0.35); /* brand coral accent */
                }

                .hub-nav-mobile-contact {
                    background: rgba(226, 93, 82, 0.12); /* match brand coral tone */
                    border-color: #E25D52; /* brand coral */
                }

                .hub-nav-mobile-link img {
                    width: 48px; /* doubled from 24px */
                    height: 48px; /* doubled from 24px */
                    filter: brightness(0) invert(1);
                    image-rendering: -webkit-optimize-contrast; /* improve crispness on WebKit */
                    image-rendering: crisp-edges; /* hint sharper scaling */
                }

                /* Preserve StrategyIQ prominence with doubled scale */
                .hub-nav-mobile-link img[alt="StrategyIQ"] {
                    width: 60px; /* doubled from 30px */
                    height: 60px; /* doubled from 30px */
                }

                .hub-nav-mobile-link span {
                    font-weight: 600; /* slightly bolder for readability */
                    font-size: 1.25rem; /* increase text size */
                    line-height: 1.2;
                }

                /* Mobile/Tablet Styles */
                @media (max-width: 1024px) {
                    .hub-nav-container {
                        padding: 0 1rem;
                    }

                    .hub-nav-contact {
                        display: none;
                    }

                    .hub-nav-mobile-toggle {
                        display: flex;
                    }

                    .hub-nav-title {
                        font-size: 1.5rem;
                    }

                    .hub-nav-subtitle {
                        font-size: 0.8rem;
                    }
                }

                /* Body padding for fixed nav */
                body[data-hub-nav="true"] {
                    padding-top: 85px;
                }

                /* Prevent background scroll when mobile drawer open */
                body.hub-mobile-open {
                    overflow: hidden;
                }
            </style>
        `;

        // Insert navigation
        document.head.insertAdjacentHTML('beforeend', navStyles);
        document.body.insertAdjacentHTML('afterbegin', navHTML);
    }

    createFooter() {
        // Create footer HTML
        const footerHTML = `
            <footer class="hub-footer" id="hubFooter">
                <div class="hub-footer-container">
                    <div class="hub-footer-content">
                        <div class="hub-footer-brand">
                            <img src="/TheHub/advisory/assets/dual_logo-lockup_and_tagline.svg" alt="Luis Gilberto - The Hub" class="hub-footer-dual-lockup">
                        </div>
                        
                        <div class="hub-footer-links">
                            <div class="hub-footer-links-grid">
                                <a href="/TheHub/system/" class="hub-footer-link">
                                    <img src="/TheHub/advisory/assets/TheHub_Logo.png" alt="The System" class="hub-footer-link-icon">
                                    <span class="hub-footer-link-label">The System</span>
                                </a>
                                <a href="/TheHub/brand-guidelines/" class="hub-footer-link">
                                    <img src="/TheHub/advisory/assets/Brand_Guidelines_Simple_100x100.png" alt="Brand Guidelines" class="hub-footer-link-icon">
                                    <span class="hub-footer-link-label">Brand Guidelines</span>
                                </a>
                                <a href="https://luis-gilberto.com/contact?from=hub#cta-hook" class="hub-footer-link">
                                    <img src="/TheHub/advisory/assets/Contact_Simple_100x100.png" alt="Contact" class="hub-footer-link-icon">
                                    <span class="hub-footer-link-label">Contact</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    <div class="hub-footer-bottom">
                        <div class="hub-footer-bottom-content">
                            <div class="hub-footer-copyright">
                                <p>&copy; 2025 Luis Gilberto. All rights reserved.</p>
                            </div>
                            <div class="hub-footer-bottom-links">
                                <a href="https://www.linkedin.com/in/luisgilberto00" target="_blank" rel="noopener noreferrer" class="hub-footer-bottom-link">LinkedIn</a>
                                <a href="https://luis-gilberto.com/IMCServices/brand-guidelines/" class="hub-footer-bottom-link">Brand Guidelines</a>
                                <span class="hub-footer-bottom-tagline">Built for what's next</span>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        `;

        // Create footer styles
        const footerStyles = `
            <style id="hub-footer-styles">
                /* Footer Styles */
                .hub-footer {
                    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
                    border-top: 1px solid rgba(255, 255, 255, 0.08);
                    margin-top: 4rem;
                }

                .hub-footer-container {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 3rem 2rem 0;
                }

                .hub-footer-content {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 4rem;
                    margin-bottom: 3rem;
                }

                .hub-footer-brand {
                    text-align: center;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .hub-footer-dual-lockup {
                    height: auto;
                    max-width: 50%;
                    width: auto;
                }

                .hub-footer-links-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1rem;
                }

                .hub-footer-link {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1.25rem;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 16px;
                    color: white;
                    text-decoration: none;
                    transition: all 0.3s ease;
                }

                .hub-footer-link:hover {
                    background: rgba(255, 255, 255, 0.05);
                    border-color: #f96f6e;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(249, 111, 110, 0.15);
                }

                .hub-footer-link-icon {
                    width: 36px;
                    height: 36px;
                    filter: brightness(0) invert(1);
                    transition: all 0.3s ease;
                }

                .hub-footer-link:hover .hub-footer-link-icon {
                    filter: brightness(0) invert(1) sepia(1) saturate(5) hue-rotate(330deg);
                }

                .hub-footer-link-label {
                    font-weight: 600;
                    font-size: 1rem;
                }

                .hub-footer-bottom {
                    border-top: 1px solid rgba(255, 255, 255, 0.08);
                    padding: 2rem 0;
                }

                .hub-footer-bottom-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 1rem;
                }

                .hub-footer-copyright p {
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 0.9rem;
                    margin: 0;
                }

                .hub-footer-bottom-links {
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                }

                .hub-footer-bottom-link {
                    color: rgba(255, 255, 255, 0.7);
                    text-decoration: none;
                    font-size: 0.9rem;
                    font-weight: 500;
                    transition: all 0.3s ease;
                }

                .hub-footer-bottom-link:hover {
                    color: #f96f6e;
                }

                .hub-footer-bottom-tagline {
                    color: rgba(255, 255, 255, 0.4);
                    font-size: 0.85rem;
                    font-style: italic;
                }

                /* Responsive Styles */
                @media (max-width: 1024px) {
                    .hub-footer-content {
                        grid-template-columns: 1fr;
                        gap: 3rem;
                        text-align: center;
                    }

                    .hub-footer-brand {
                        text-align: center;
                        margin-bottom: 2rem;
                    }

                    .hub-footer-links {
                        text-align: center;
                    }

                    .hub-footer-links-grid {
                        justify-content: center;
                        max-width: 600px;
                        margin: 0 auto;
                    }
                }

                @media (max-width: 768px) {
                    .hub-footer-container {
                        padding: 2rem 1rem 0;
                    }

                    .hub-footer-links-grid {
                        grid-template-columns: 1fr;
                        gap: 1rem;
                    }

                    .hub-footer-bottom-content {
                        flex-direction: column;
                        text-align: center;
                        gap: 1.5rem;
                        align-items: center;
                    }

                    .hub-footer-copyright {
                        text-align: center;
                        width: 100%;
                    }

                    .hub-footer-bottom-links {
                        flex-direction: column;
                        gap: 1rem;
                        align-items: center;
                    }
                }

                @media (max-width: 480px) {
                    .hub-footer-dual-lockup {
                        max-width: 70%;
                    }
                }
            </style>
        `;

        // Insert footer
        document.head.insertAdjacentHTML('beforeend', footerStyles);
        document.body.insertAdjacentHTML('beforeend', footerHTML);
    }

    bindEvents() {
        // Mobile menu toggle
        const toggle = document.getElementById('hubNavToggle');
        const mobileMenu = document.getElementById('hubNavMobileMenu');
        
        if (toggle && mobileMenu) {
            toggle.addEventListener('click', () => {
                this.isMenuOpen = !this.isMenuOpen;
                mobileMenu.classList.toggle('open', this.isMenuOpen);
                document.body.classList.toggle('hub-mobile-open', this.isMenuOpen);
                
                // Animate hamburger
                const hamburgers = toggle.querySelectorAll('.hub-nav-hamburger');
                if (this.isMenuOpen) {
                    hamburgers[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                    hamburgers[1].style.opacity = '0';
                    hamburgers[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    hamburgers[0].style.transform = 'none';
                    hamburgers[1].style.opacity = '1';
                    hamburgers[2].style.transform = 'none';
                }
            });

            // NEW: Close drawer when clicking overlay outside content
            mobileMenu.addEventListener('click', (e) => {
                const content = mobileMenu.querySelector('.hub-nav-mobile-content');
                if (e.target === mobileMenu && this.isMenuOpen) {
                    toggle.click();
                }
            });
        }

        // Close mobile menu when clicking links
        const mobileLinks = document.querySelectorAll('.hub-nav-mobile-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (this.isMenuOpen) {
                    toggle.click();
                }
            });
        });

        // Scroll effect for navigation
        let lastScrollY = window.scrollY;
        const nav = document.getElementById('hubNav');
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
            
            lastScrollY = currentScrollY;
        });

        // Close mobile menu on resize
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth <= 768;
            if (!this.isMobile && this.isMenuOpen) {
                toggle.click();
            }
        });

        // Close mobile menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                toggle.click();
            }
        });
    }

    addBodyPadding() {
        document.body.setAttribute('data-hub-nav', 'true');
    }
}

// Initialize the system
window.hubSystem = new HubSystem();