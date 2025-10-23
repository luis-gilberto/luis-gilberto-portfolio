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
        const hasExistingHeader = document.querySelector('.hub-header');
        if (!hasExistingHeader) {
            this.createNavigation();
        } else {
            console.log('HubSystem: existing header detected, skipping nav injection');
        }
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
                        <a href="/" class="hub-nav-logo">
                            <img src="/advisory/assets/TheHub_Logo.png" alt="The Hub" class="hub-nav-logo-img">
                        </a>
                    </div>
                    
                    <div class="hub-nav-actions">
                        <a href="https://luis-gilberto.com/contact?from=imc#cta-hook" class="hub-nav-contact">
                            <img src="/advisory/assets/Contact_Simple_100x100.png" alt="Contact" class="hub-nav-contact-icon">
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
                        <a href="/IMCServices/" class="hub-nav-mobile-link">
                             <img src="/advisory/assets/IMC_Services_Simple_100x100.png" alt="Services">
                             <span>Services</span>
                         </a>
                         <a href="/advisory/" class="hub-nav-mobile-link">
                             <img src="/advisory/assets/Advisory_Simple_100x100.png" alt="Advisory">
                             <span>Advisory</span>
                         </a>
                         <a href="/scopeiq/" class="hub-nav-mobile-link">
                             <img src="/advisory/assets/ScopeIQ_Clean_Telescope_100x100.png" alt="ScopeIQ">
                             <span>ScopeIQ</span>
                         </a>
                         <a href="/strategyiq/" class="hub-nav-mobile-link">
                             <img src="/advisory/assets/StrategyIQ_Simple_100x100.png" alt="StrategyIQ">
                             <span>StrategyIQ</span>
                         </a>
                         <a href="https://luis-gilberto.com/contact?from=hub#cta-hook" class="hub-nav-mobile-link hub-nav-mobile-contact">
                             <img src="/advisory/assets/Contact_Simple_100x100.png" alt="Contact">
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
        // Compute base prefix to work under both /TheHub (root-served) and TheHub-only (folder-served) dev servers
        const basePrefix = window.location.pathname.startsWith('/TheHub/') ? '/TheHub/' : '/';
    
        // Create footer HTML
        const footerHTML = `<footer class="hub-footer" id="hubFooter">
          <div class="footer-container">
            <div class="footer-main">
              <div class="footer-brand">
                <div class="footer-logo">
                  <a href="${basePrefix}index.html" aria-label="The Hub Home">
                    <img src="${basePrefix}advisory/assets/dual_logo-lockup_and_tagline.svg" alt="Luis Gilberto - The Hub">
                  </a>
                </div>
                <p class="footer-tagline">
                  Strategic marketing leadership meets creative excellence.
                </p>
              </div>
              <nav class="footer-nav" aria-label="Footer Navigation">
                <h3 class="footer-nav-title">Explore</h3>
                <div class="footer-nav-links">
                  <a href="${basePrefix}system/" class="footer-link">
                    <img src="${basePrefix}assets/icons/system.png" class="footer-icon" alt="" width="24" height="24" aria-hidden="true" />
                    <span>The System</span>
                  </a>
                  <a href="${basePrefix}brand-guidelines/" class="footer-link">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" stroke-width="2" />
                      <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" stroke-width="2" />
                      <rect x="13" y="3" width="8" height="8" rx="2" stroke="currentColor" stroke-width="2" />
                      <rect x="13" y="13" width="8" height="8" rx="2" stroke="currentColor" stroke-width="2" />
                    </svg>
                    <span>Brand Guidelines</span>
                  </a>
                  <a href="https://luis-gilberto.com/contact?from=imc#cta-hook" class="footer-link">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 8L10.89 13.26C11.22 13.48 11.61 13.59 12 13.59C12.39 13.59 12.78 13.48 13.11 13.26L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <span>Contact</span>
                  </a>
                </div>
              </nav>
              <div class="footer-connect">
                <h3 class="footer-nav-title">Connect</h3>
                <div class="footer-social">
                  <a href="https://www.linkedin.com/in/luisgilberto00/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M6 9H2V21H6V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <circle cx="4" cy="4" r="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>LinkedIn</span>
                  </a>
                  <a href="https://luisgilberto00.link" target="_blank" rel="noopener noreferrer" aria-label="Personal Links">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 13C10.4295 13.5741 10.9774 14.0491 11.6066 14.3929C12.2357 14.7367 12.9315 14.9411 13.6467 14.9923C14.3618 15.0435 15.0796 14.9403 15.7513 14.6897C16.4231 14.4392 17.0331 14.047 17.54 13.54L20.54 10.54C21.4508 9.59695 21.9548 8.33394 21.9434 7.02296C21.932 5.71198 21.4061 4.45791 20.4791 3.53087C19.5521 2.60383 18.298 2.07799 16.987 2.0666C15.676 2.0552 14.413 2.55918 13.47 3.46997L11.75 5.17997" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M14 11C13.5705 10.4259 13.0226 9.9508 12.3934 9.60704C11.7642 9.26328 11.0685 9.05885 10.3533 9.00768C9.63816 8.95651 8.92037 9.05964 8.24861 9.31018C7.57685 9.56073 6.96684 9.9529 6.45996 10.46L3.45996 13.46C2.54917 14.403 2.04519 15.666 2.05659 16.977C2.06798 18.288 2.59382 19.542 3.52086 20.4691C4.44791 21.3961 5.70197 21.9219 7.01295 21.9333C8.32393 21.9447 9.58694 21.4408 10.53 20.53L12.24 18.82" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>luisgilberto00.link</span>
                  </a>
                  <a href="https://luis-gilberto.com" target="_blank" rel="noopener noreferrer" aria-label="Portfolio Website">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                      <path d="M2 12H22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      <path d="M12 2C14.5 4.5 16 8 16 12C16 16 14.5 19.5 12 22C9.5 19.5 8 16 8 12C8 8 9.5 4.5 12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    <span>luis-gilberto.com</span>
                  </a>
                </div>
              </div>
            </div>
            <div class="footer-bottom">
              <div class="footer-bottom-content">
                <p class="footer-copyright"> 2025 Luis Gilberto</p>
                <div class="footer-accent-line"></div>
                <p class="footer-tagline-mini">Built for what's next.</p>
              </div>
            </div>
          </div>
        </footer>
`;

        // Create footer styles
        const footerStyles = `    <style id="hub-footer-styles">
      .hub-footer { background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%); border-top: 1px solid rgba(255,255,255,0.08); margin-top: 4rem; }
      .footer-container { max-width: 1400px; margin: 0 auto; padding: 3rem 2rem 0; }
      .footer-main { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; margin-bottom: 3rem; }
      .footer-brand { text-align: center; display: flex; justify-content: center; align-items: center; }
      .footer-logo img { height: auto; width: auto; max-width: clamp(220px, 50%, 420px); }
      .footer-tagline { color: rgba(255,255,255,0.7); }
      .footer-nav-title { font-size: 1.25rem; font-weight: 700; color: #fff; margin-bottom: 1rem; }
      .footer-nav-links { display: grid; grid-template-columns: 1fr; gap: 0.75rem; }
      .footer-link { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; min-height: 44px; color: #fff; text-decoration: none; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; background: rgba(255,255,255,0.02); transition: all 0.2s ease; }
      .footer-link:hover { background: rgba(255,255,255,0.05); border-color: #f96f6e; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(249,111,110,0.15); }
      .footer-link img.footer-icon { width: clamp(22px, 3.6vw, 24px); height: clamp(22px, 3.6vw, 24px); flex-shrink: 0; transition: all 0.2s ease; }
      .footer-link:hover img.footer-icon { transform: scale(1.1); }
      .footer-social a { display: inline-flex; align-items: center; gap: 0.75rem; margin-right: 1rem; color: #fff; text-decoration: none; }
      .footer-bottom { border-top: 1px solid rgba(255,255,255,0.08); padding: 2rem 0; }
      .footer-bottom-content { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
      .footer-accent-line { flex: 1 1 auto; height: 1px; background: rgba(255,255,255,0.1); margin: 0 1rem; }
      .footer-tagline-mini { color: rgba(255,255,255,0.4); font-size: 0.85rem; font-style: italic; }
      @media (max-width: 1024px) { .footer-main { grid-template-columns: 1fr; gap: 2rem; text-align: center; } .footer-bottom-content { flex-direction: column; gap: 1.25rem; text-align: center; } }
      @media (max-width: 768px) { .footer-container { padding: 2rem 1rem 0; } }
    </style>`;

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



