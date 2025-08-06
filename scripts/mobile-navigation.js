/**
 * Mobile Article Navigation System
 * Provides unified navigation for mobile article reading
 * Author: Luis Gilberto
 */

class MobileArticleNavigation {
    constructor() {
        this.isInitialized = false;
        this.sections = [];
        this.currentSection = 0;
        this.isAutoScrolling = false;
        this.autoScrollSpeed = 50; // pixels per second
        this.lastScrollY = 0;
        this.scrollDirection = 'up';
        this.hideTimeout = null;
        this.readingStartTime = Date.now();
        this.wordsPerMinute = 200; // Average reading speed
        
        this.init();
    }
    
    init() {
        if (this.isInitialized || window.innerWidth > 768) return;
        
        this.createNavigationHTML();
        this.detectSections();
        this.bindEvents();
        this.updateProgress();
        this.calculateReadingTime();
        this.isInitialized = true;
        
        console.log('Mobile Article Navigation initialized');
    }
    
    createNavigationHTML() {
        // Remove existing navigation elements
        const existingElements = document.querySelectorAll('.scroll-progress-circle, .back-to-top, .hero-scroll-prompt');
        existingElements.forEach(el => el.style.display = 'none');
        
        const navHTML = `
            <div class="mobile-article-nav" id="mobileArticleNav">
                <div class="nav-auto-scroll" id="navAutoScroll"></div>
                <div class="nav-progress-bar">
                    <div class="nav-progress-fill" id="navProgressFill"></div>
                </div>
                <div class="nav-controls">
                    <div class="nav-reading-info">
                        <div class="nav-progress-text" id="navProgressText">0%</div>
                        <div class="nav-time-estimate" id="navTimeEstimate">0 min left</div>
                    </div>
                    <div class="nav-sections" id="navSections"></div>
                    <div class="nav-actions">
                        <button class="nav-btn" id="navTocBtn" title="Table of Contents">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3 9h14V7H3v2zm0 4h14v-2H3v2zm0 4h14v-2H3v2zm16 0h2v-2h-2v2zm0-10v2h2V7h-2zm0 6h2v-2h-2v2z"/>
                            </svg>
                        </button>
                        <button class="nav-btn" id="navAutoScrollBtn" title="Auto Scroll">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                        </button>
                        <button class="nav-btn primary" id="navBackToTopBtn" title="Back to Top">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="nav-toc-overlay" id="navTocOverlay">
                <div class="nav-toc-content">
                    <div class="nav-toc-header">
                        <h3 class="nav-toc-title">Article Sections</h3>
                        <button class="nav-toc-close" id="navTocClose">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                        </button>
                    </div>
                    <ul class="nav-toc-list" id="navTocList"></ul>
                    <div class="nav-reading-controls">
                        <button class="nav-control-btn" id="navFontSizeBtn">Font Size</button>
                        <button class="nav-control-btn" id="navThemeBtn">Theme</button>
                        <button class="nav-control-btn" id="navShareBtn">Share</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', navHTML);
        
        // Cache DOM elements
        this.nav = document.getElementById('mobileArticleNav');
        this.progressFill = document.getElementById('navProgressFill');
        this.progressText = document.getElementById('navProgressText');
        this.timeEstimate = document.getElementById('navTimeEstimate');
        this.sectionsContainer = document.getElementById('navSections');
        this.tocOverlay = document.getElementById('navTocOverlay');
        this.tocList = document.getElementById('navTocList');
        this.autoScrollIndicator = document.getElementById('navAutoScroll');
    }
    
    detectSections() {
        // Find all major headings in the article
        const headings = document.querySelectorAll('h1, h2, h3, .section-title, .campaign-title, .features-title');
        this.sections = [];
        
        headings.forEach((heading, index) => {
            // Skip if heading is in navigation or footer
            if (heading.closest('.mobile-article-nav, .nav-toc-overlay, footer, .footer')) return;
            
            const section = {
                element: heading,
                title: heading.textContent.trim(),
                id: heading.id || `section-${index}`,
                offsetTop: heading.offsetTop,
                visited: false
            };
            
            // Assign ID if not present
            if (!heading.id) {
                heading.id = section.id;
            }
            
            this.sections.push(section);
        });
        
        this.createSectionDots();
        this.createTableOfContents();
    }
    
    createSectionDots() {
        this.sectionsContainer.innerHTML = '';
        
        this.sections.forEach((section, index) => {
            const dot = document.createElement('div');
            dot.className = 'nav-section-dot';
            dot.dataset.section = index;
            dot.title = section.title;
            
            dot.addEventListener('click', () => {
                this.scrollToSection(index);
            });
            
            this.sectionsContainer.appendChild(dot);
        });
    }
    
    createTableOfContents() {
        this.tocList.innerHTML = '';
        
        this.sections.forEach((section, index) => {
            const li = document.createElement('li');
            li.className = 'nav-toc-item';
            
            const link = document.createElement('a');
            link.className = 'nav-toc-link';
            link.href = `#${section.id}`;
            link.dataset.section = index;
            
            link.innerHTML = `
                <div class="nav-toc-number">${index + 1}</div>
                <div class="nav-toc-text">${section.title}</div>
            `;
            
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToSection(index);
                this.closeToc();
            });
            
            li.appendChild(link);
            this.tocList.appendChild(li);
        });
    }
    
    bindEvents() {
        // Scroll event with throttling
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.handleScroll();
            }, 10);
        });
        
        // Navigation button events
        document.getElementById('navBackToTopBtn').addEventListener('click', () => {
            this.scrollToTop();
        });
        
        document.getElementById('navTocBtn').addEventListener('click', () => {
            this.toggleToc();
        });
        
        document.getElementById('navAutoScrollBtn').addEventListener('click', () => {
            this.toggleAutoScroll();
        });
        
        document.getElementById('navTocClose').addEventListener('click', () => {
            this.closeToc();
        });
        
        // TOC overlay click to close
        this.tocOverlay.addEventListener('click', (e) => {
            if (e.target === this.tocOverlay) {
                this.closeToc();
            }
        });
        
        // Reading controls
        document.getElementById('navFontSizeBtn').addEventListener('click', () => {
            this.toggleFontSize();
        });
        
        document.getElementById('navThemeBtn').addEventListener('click', () => {
            this.toggleTheme();
        });
        
        document.getElementById('navShareBtn').addEventListener('click', () => {
            this.shareArticle();
        });
        
        // Resize event
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.nav) {
                this.nav.style.display = 'none';
            } else if (window.innerWidth <= 768 && this.nav) {
                this.nav.style.display = 'block';
            }
        });
    }
    
    handleScroll() {
        const currentScrollY = window.pageYOffset;
        this.scrollDirection = currentScrollY > this.lastScrollY ? 'down' : 'up';
        this.lastScrollY = currentScrollY;
        
        this.updateProgress();
        this.updateCurrentSection();
        this.handleNavVisibility();
    }
    
    updateProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.min((scrollTop / docHeight) * 100, 100);
        
        this.progressFill.style.width = `${scrollPercent}%`;
        this.progressText.textContent = `${Math.round(scrollPercent)}%`;
        
        // Update reading time estimate
        const remainingPercent = 100 - scrollPercent;
        const totalWords = this.estimateWordCount();
        const remainingWords = (totalWords * remainingPercent) / 100;
        const remainingMinutes = Math.ceil(remainingWords / this.wordsPerMinute);
        
        this.timeEstimate.textContent = remainingMinutes > 0 ? `${remainingMinutes} min left` : 'Complete';
    }
    
    updateCurrentSection() {
        const scrollTop = window.pageYOffset + 100; // Offset for better detection
        
        let currentIndex = 0;
        for (let i = 0; i < this.sections.length; i++) {
            if (scrollTop >= this.sections[i].element.offsetTop) {
                currentIndex = i;
                this.sections[i].visited = true;
            }
        }
        
        if (currentIndex !== this.currentSection) {
            this.currentSection = currentIndex;
            this.updateSectionDots();
            this.updateTocLinks();
        }
    }
    
    updateSectionDots() {
        const dots = this.sectionsContainer.querySelectorAll('.nav-section-dot');
        dots.forEach((dot, index) => {
            dot.classList.remove('active', 'completed');
            
            if (index === this.currentSection) {
                dot.classList.add('active');
            } else if (this.sections[index].visited) {
                dot.classList.add('completed');
            }
        });
    }
    
    updateTocLinks() {
        const links = this.tocList.querySelectorAll('.nav-toc-link');
        links.forEach((link, index) => {
            link.classList.remove('active');
            if (index === this.currentSection) {
                link.classList.add('active');
            }
        });
    }
    
    handleNavVisibility() {
        if (this.hideTimeout) clearTimeout(this.hideTimeout);
        
        if (this.scrollDirection === 'down' && this.lastScrollY > 200) {
            this.hideTimeout = setTimeout(() => {
                this.nav.classList.add('hidden');
            }, 1000);
        } else {
            this.nav.classList.remove('hidden');
        }
    }
    
    scrollToSection(index) {
        if (index >= 0 && index < this.sections.length) {
            const section = this.sections[index];
            section.element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Add haptic feedback if available
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        }
    }
    
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Reset section tracking
        this.currentSection = 0;
        this.sections.forEach(section => section.visited = false);
        this.updateSectionDots();
        
        if (navigator.vibrate) {
            navigator.vibrate(100);
        }
    }
    
    toggleToc() {
        this.tocOverlay.classList.toggle('active');
        
        // Prevent body scroll when TOC is open
        if (this.tocOverlay.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
    
    closeToc() {
        this.tocOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    toggleAutoScroll() {
        const btn = document.getElementById('navAutoScrollBtn');
        
        if (this.isAutoScrolling) {
            this.stopAutoScroll();
            btn.classList.remove('active');
        } else {
            this.startAutoScroll();
            btn.classList.add('active');
        }
    }
    
    startAutoScroll() {
        this.isAutoScrolling = true;
        this.autoScrollIndicator.classList.add('active');
        
        const scroll = () => {
            if (!this.isAutoScrolling) return;
            
            window.scrollBy(0, this.autoScrollSpeed / 60); // 60fps
            
            // Stop at bottom
            if (window.pageYOffset + window.innerHeight >= document.documentElement.scrollHeight - 10) {
                this.stopAutoScroll();
                return;
            }
            
            requestAnimationFrame(scroll);
        };
        
        requestAnimationFrame(scroll);
    }
    
    stopAutoScroll() {
        this.isAutoScrolling = false;
        this.autoScrollIndicator.classList.remove('active');
        document.getElementById('navAutoScrollBtn').classList.remove('active');
    }
    
    toggleFontSize() {
        const body = document.body;
        const currentSize = body.style.fontSize || '16px';
        const sizes = ['16px', '18px', '20px', '22px'];
        const currentIndex = sizes.indexOf(currentSize);
        const nextIndex = (currentIndex + 1) % sizes.length;
        
        body.style.fontSize = sizes[nextIndex];
        
        // Store preference
        localStorage.setItem('articleFontSize', sizes[nextIndex]);
    }
    
    toggleTheme() {
        const body = document.body;
        body.classList.toggle('light-theme');
        
        // Store preference
        localStorage.setItem('articleTheme', body.classList.contains('light-theme') ? 'light' : 'dark');
    }
    
    shareArticle() {
        if (navigator.share) {
            navigator.share({
                title: document.title,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                // Show feedback
                const btn = document.getElementById('navShareBtn');
                const originalText = btn.textContent;
                btn.textContent = 'Copied!';
                setTimeout(() => {
                    btn.textContent = originalText;
                }, 2000);
            });
        }
    }
    
    calculateReadingTime() {
        const wordCount = this.estimateWordCount();
        const readingTime = Math.ceil(wordCount / this.wordsPerMinute);
        
        // Update initial time estimate
        this.timeEstimate.textContent = `${readingTime} min read`;
    }
    
    estimateWordCount() {
        const content = document.querySelector('.case-study-content, .content-section, main, article');
        if (!content) return 1000; // Default estimate
        
        const text = content.textContent || content.innerText || '';
        return text.trim().split(/\s+/).length;
    }
    
    // Load user preferences
    loadPreferences() {
        const fontSize = localStorage.getItem('articleFontSize');
        if (fontSize) {
            document.body.style.fontSize = fontSize;
        }
        
        const theme = localStorage.getItem('articleTheme');
        if (theme === 'light') {
            document.body.classList.add('light-theme');
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new MobileArticleNavigation();
    });
} else {
    new MobileArticleNavigation();
}

// Re-initialize on page navigation (for SPAs)
window.addEventListener('popstate', () => {
    setTimeout(() => {
        new MobileArticleNavigation();
    }, 100);
});