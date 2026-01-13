/**
 * LG Universal Navigation System
 * Dynamically generates advanced navigation for all IMC Services pages
 * Automatically detects page context and adapts navigation accordingly
 */

class LGUniversalNavigation {
    constructor() {
        this.pageConfig = this.detectPageContext();
        this.init();
    }

    detectPageContext() {
        const path = window.location.pathname;
        const hostname = window.location.hostname;
        
        // Page detection logic
        if (path.includes('/advisory/')) {
            return {
                page: 'advisory',
                title: 'IMC Hub',
                subtitle: 'Current Page: Advisory',
                basePath: '../',
                pageLinks: [
                    { href: '#hero', text: 'Advisory Overview', icon: 'star' },
                    { href: '#services', text: 'Strategic Services', icon: 'briefcase' },
                    { href: '#investment', text: 'Investment Levels', icon: 'chart' },
                    { href: '#testimonials', text: 'Client Success Stories', icon: 'users' },
                    { href: '#microsoft-legacy', text: 'Microsoft Legacy', icon: 'shield' }
                ]
            };
        } else if (path.includes('/scopeiq-wizard/')) {
            return {
                page: 'scopeiq',
                title: 'IMC Hub',
                subtitle: 'Current Page: ScopeIQ',
                basePath: '../',
                pageLinks: [
                    { href: '#wizard-start', text: 'Start Diagnostic', icon: 'play' },
                    { href: '#about-scopeiq', text: 'About ScopeIQ', icon: 'info' },
                    { href: '#how-it-works', text: 'How It Works', icon: 'cog' },
                    { href: '#results', text: 'Sample Results', icon: 'chart' }
                ]
            };
        } else if (path.includes('/planning-hub/')) {
            return {
                page: 'planning-hub',
                title: 'IMC Hub',
                subtitle: 'Current Page: Planning Hub',
                basePath: '../',
                pageLinks: [
                    { href: '#overview', text: 'Hub Overview', icon: 'grid' },
                    { href: '#tools', text: 'Planning Tools', icon: 'tool' },
                    { href: '#templates', text: 'Templates', icon: 'document' },
                    { href: '#resources', text: 'Resources', icon: 'book' }
                ]
            };
        } else if (path.includes('/engagement-toolkit/') || path.includes('/toolkit/')) {
            return {
                page: 'toolkit',
                title: 'IMC Hub',
                subtitle: 'Current Page: Engagement Toolkit',
                basePath: '../',
                pageLinks: [
                    { href: '#toolkit-overview', text: 'Toolkit Overview', icon: 'briefcase' },
                    { href: '#engagement-tools', text: 'Engagement Tools', icon: 'tool' },
                    { href: '#templates', text: 'Templates & Assets', icon: 'document' },
                    { href: '#best-practices', text: 'Best Practices', icon: 'star' }
                ]
            };
        } else {
            // Main index page
            return {
                page: 'home',
                title: 'IMC Hub',
                subtitle: 'Current Page: Services Hub',
                basePath: './',
                pageLinks: [
                    { href: '#services', text: 'Services Overview', icon: 'grid' },
                    { href: '#process', text: 'Our Process', icon: 'arrow-right' },
                    { href: '#results', text: 'Results & Impact', icon: 'chart' },
                    { href: '#engagement', text: 'Engagement Models', icon: 'users' }
                ]
            };
        }
    }

    getIconSVG(iconName) {
        const icons = {
            star: '<path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />',
            briefcase: '<path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />',
            chart: '<path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />',
            users: '<path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />',
            shield: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />',
            play: '<path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />',
            info: '<path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />',
            cog: '<path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />',
            grid: '<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />',
            tool: '<path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />',
            document: '<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />',
            book: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />',
            'arrow-right': '<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />',
            home: '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />'
        };
        return icons[iconName] || icons.star;
    }

    generateNavigationHTML() {
        const config = this.pageConfig;
        
        return `
        <!-- Advanced Navigation System -->
        <div class="lg-nav-container">
            <!-- Navigation Toggle Button -->
            <button class="lg-nav-toggle" type="button">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </button>

            <!-- Navigation Menu -->
            <nav class="lg-nav-menu">
                <!-- Circular Motif -->
                <div class="lg-nav-motif">
                    <div class="lg-nav-motif-circle">
                        <svg class="lg-nav-motif-logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <text x="50" y="50" text-anchor="middle" dominant-baseline="central" fill="currentColor" font-family="Arial, sans-serif" font-weight="bold" font-size="24">LG</text>
                        </svg>
                    </div>
                </div>

                <!-- Navigation Header -->
                <div class="lg-nav-header">
                    <div class="lg-nav-header-content">
                        <h2 class="lg-nav-title">${config.title}</h2>
                        <p class="lg-nav-subtitle">${config.subtitle}</p>
                    </div>
                    <!-- Close Button -->
                    <button class="lg-nav-close" type="button">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <!-- IMC HUB Section -->
                <div class="lg-nav-section">
                    <div class="lg-nav-section-title">IMC HUB</div>
                    <a href="${config.basePath}index.html" class="lg-nav-link ${config.page === 'home' ? 'active' : ''}">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            ${this.getIconSVG('home')}
                        </svg>
                        IMC Services
                    </a>
                    <a href="${config.basePath}advisory/index.html" class="lg-nav-link ${config.page === 'advisory' ? 'active' : ''}">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            ${this.getIconSVG('star')}
                        </svg>
                        Advisory
                    </a>
                    <a href="${config.basePath}scopeiq-wizard/index.html" class="lg-nav-link ${config.page === 'scopeiq' ? 'active' : ''}">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            ${this.getIconSVG('chart')}
                        </svg>
                        ScopeIQ
                    </a>
                </div>

                <!-- Page-specific Section -->
                <div class="lg-nav-section">
                    <div class="lg-nav-section-title">EXPLORE ON THIS PAGE</div>
                    ${config.pageLinks.map(link => `
                        <a href="${link.href}" class="lg-nav-link lg-nav-page-link">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                ${this.getIconSVG(link.icon)}
                            </svg>
                            ${link.text}
                        </a>
                    `).join('')}
                </div>

                <!-- Connect Section -->
                <div class="lg-nav-section">
                    <div class="lg-nav-section-title">Connect</div>
                    <a href="mailto:me@luis-gilberto.com" class="lg-nav-link">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                        Email
                    </a>
                    <a href="https://www.linkedin.com/in/luisgilberto00" target="_blank" class="lg-nav-link">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                        </svg>
                        LinkedIn
                    </a>
                </div>
            </nav>

            <!-- Navigation Backdrop -->
            <div class="lg-nav-backdrop"></div>
        </div>`;
    }

    init() {
        // Check if navigation already exists
        if (document.querySelector('.lg-nav-container')) {
            console.log('[LG Universal Navigation] Navigation already exists, skipping initialization');
            return;
        }

        // Insert navigation HTML
        const navigationHTML = this.generateNavigationHTML();
        document.body.insertAdjacentHTML('afterbegin', navigationHTML);

        // Dispatch event to signal navigation HTML is ready
        const event = new CustomEvent('lgNavigationReady', {
            detail: { pageConfig: this.pageConfig }
        });
        document.dispatchEvent(event);

        console.log('[LG Universal Navigation] Universal navigation initialized for page:', this.pageConfig.page);
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.lgUniversalNavigation = new LGUniversalNavigation();
    });
} else {
    window.lgUniversalNavigation = new LGUniversalNavigation();
}

// Export for manual initialization
window.LGUniversalNavigation = LGUniversalNavigation;