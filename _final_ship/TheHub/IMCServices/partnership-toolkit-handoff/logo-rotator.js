/**
 * Microsoft Logo Rotator - JavaScript Module
 * A reusable component for displaying rotating Microsoft product logos
 */

class LogoRotator {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.currentIndex = 0;
        this.isPlaying = true;
        this.intervalId = null;
        this.rotationSpeed = options.rotationSpeed || 3000; // 3 seconds per logo
        this.logoPath = options.logoPath || '../RotatorLogo/';
        
        // Default logo data - can be overridden via options
        this.logos = options.logos || [
            {
                name: 'Microsoft Copilot',
                file: 'Copilot.svg',
                description: 'AI-powered assistant enhancing productivity across Microsoft 365'
            },
            {
                name: 'Microsoft Edge',
                file: 'Edge.svg',
                description: 'Fast, secure web browser with enterprise-grade security'
            },
            {
                name: 'Microsoft Teams',
                file: 'Teams.svg',
                description: 'Collaboration platform connecting teams worldwide'
            },
            {
                name: 'Microsoft 365',
                file: 'Microsoft365.svg',
                description: 'Complete productivity suite for modern workplace'
            },
            {
                name: 'Office 365',
                file: 'Office365.svg',
                description: 'Cloud-based Office applications and services'
            },
            {
                name: 'Surface Pro',
                file: 'Surface_Pro.svg',
                description: 'Versatile 2-in-1 device for professional mobility'
            },
            {
                name: 'HoloLens',
                file: 'HoloLens.svg',
                description: 'Mixed reality platform for immersive experiences'
            },
            {
                name: 'Copilot in Edge',
                file: 'Copilot_in_Edge.svg',
                description: 'AI-enhanced browsing with integrated Copilot features'
            },
            {
                name: 'Family Safety',
                file: 'Family_Safety.svg',
                description: 'Digital wellbeing tools for family protection'
            },
            {
                name: 'M365 Free Apps',
                file: 'M365_Free_Apps.svg',
                description: 'Essential Microsoft 365 applications at no cost'
            },
            {
                name: 'Microsoft Band',
                file: 'Microsoft_Band.svg',
                description: 'Fitness tracker with health monitoring capabilities'
            },
            {
                name: 'O365',
                file: 'O365.svg',
                description: 'Office 365 suite for business productivity'
            },
            {
                name: 'Office 2016-19',
                file: 'Office2016_19.svg',
                description: 'Desktop Office suite with classic applications'
            }
        ];

        this.init();
    }

    init() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container with ID '${this.containerId}' not found`);
            return;
        }

        this.createHTML();
        this.createLogoElements();
        this.createProgressDots();
        this.bindEvents();
        this.startRotation();
        this.showLogo(0);
    }

    createHTML() {
        const container = document.getElementById(this.containerId);
        container.innerHTML = `
            <div class="logo-rotator-container">
                <h1 class="rotator-title">Microsoft Portfolio</h1>
                <p class="rotator-subtitle">Technologies & Platforms I've Supported</p>

                <div class="logo-rotator" id="${this.containerId}-rotator">
                    <!-- Logos will be dynamically inserted here -->
                </div>

                <div class="logo-info">
                    <div class="logo-name" id="${this.containerId}-name">Microsoft Copilot</div>
                    <div class="logo-description" id="${this.containerId}-description">AI-powered assistant enhancing productivity across Microsoft 365</div>
                </div>

                <div class="rotator-controls">
                    <button class="control-btn" id="${this.containerId}-prevBtn">← Previous</button>
                    <button class="control-btn" id="${this.containerId}-playPauseBtn">⏸️ Pause</button>
                    <button class="control-btn" id="${this.containerId}-nextBtn">Next →</button>
                </div>

                <div class="progress-indicator" id="${this.containerId}-progress">
                    <!-- Progress dots will be dynamically inserted here -->
                </div>
            </div>
        `;
    }

    createLogoElements() {
        const rotator = document.getElementById(`${this.containerId}-rotator`);

        this.logos.forEach((logo, index) => {
            const logoItem = document.createElement('div');
            logoItem.className = 'logo-item';
            logoItem.innerHTML = `<img src="${this.logoPath}${logo.file}" alt="${logo.name}" loading="lazy">`;
            rotator.appendChild(logoItem);
        });
    }

    createProgressDots() {
        const indicator = document.getElementById(`${this.containerId}-progress`);

        this.logos.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'progress-dot';
            dot.addEventListener('click', () => this.goToLogo(index));
            indicator.appendChild(dot);
        });
    }

    bindEvents() {
        document.getElementById(`${this.containerId}-prevBtn`).addEventListener('click', () => this.previousLogo());
        document.getElementById(`${this.containerId}-nextBtn`).addEventListener('click', () => this.nextLogo());
        document.getElementById(`${this.containerId}-playPauseBtn`).addEventListener('click', () => this.togglePlayPause());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    this.previousLogo();
                    break;
                case 'ArrowRight':
                    this.nextLogo();
                    break;
                case ' ':
                    e.preventDefault();
                    this.togglePlayPause();
                    break;
            }
        });

        // Pause on hover
        const rotator = document.getElementById(`${this.containerId}-rotator`);
        rotator.addEventListener('mouseenter', () => {
            if (this.isPlaying) {
                this.pauseRotation();
            }
        });

        rotator.addEventListener('mouseleave', () => {
            if (this.isPlaying) {
                this.startRotation();
            }
        });
    }

    showLogo(index) {
        // Hide all logos
        const logoItems = document.querySelectorAll(`#${this.containerId}-rotator .logo-item`);
        logoItems.forEach(item => item.classList.remove('active'));

        // Show current logo
        logoItems[index].classList.add('active');

        // Update info
        const logo = this.logos[index];
        document.getElementById(`${this.containerId}-name`).textContent = logo.name;
        document.getElementById(`${this.containerId}-description`).textContent = logo.description;

        // Update progress dots
        const dots = document.querySelectorAll(`#${this.containerId}-progress .progress-dot`);
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');

        this.currentIndex = index;
    }

    nextLogo() {
        const nextIndex = (this.currentIndex + 1) % this.logos.length;
        this.showLogo(nextIndex);
    }

    previousLogo() {
        const prevIndex = (this.currentIndex - 1 + this.logos.length) % this.logos.length;
        this.showLogo(prevIndex);
    }

    goToLogo(index) {
        this.showLogo(index);
    }

    startRotation() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }

        this.intervalId = setInterval(() => {
            this.nextLogo();
        }, this.rotationSpeed);
    }

    pauseRotation() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    togglePlayPause() {
        const btn = document.getElementById(`${this.containerId}-playPauseBtn`);

        if (this.isPlaying) {
            this.pauseRotation();
            btn.innerHTML = '▶️ Play';
            this.isPlaying = false;
        } else {
            this.startRotation();
            btn.innerHTML = '⏸️ Pause';
            this.isPlaying = true;
        }
    }

    // Public methods for external control
    destroy() {
        this.pauseRotation();
        const container = document.getElementById(this.containerId);
        if (container) {
            container.innerHTML = '';
        }
    }

    updateLogos(newLogos) {
        this.logos = newLogos;
        this.pauseRotation();
        this.createLogoElements();
        this.createProgressDots();
        this.showLogo(0);
        if (this.isPlaying) {
            this.startRotation();
        }
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LogoRotator;
}

// Global assignment for direct script inclusion
if (typeof window !== 'undefined') {
    window.LogoRotator = LogoRotator;
}