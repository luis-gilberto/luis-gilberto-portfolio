// Toolkit Authentication and Access Control

class ToolkitAuth {
    constructor() {
        this.accessCodes = {
            'STRATEGIC2024': 'premium',
            'MARKETING_PRO': 'premium',
            'ENTERPRISE_AI': 'exclusive',
            'LUIS_DIRECT': 'exclusive'
        };
        this.currentAccess = null;
        this.init();
    }

    init() {
        // Check if already authenticated
        const savedAccess = sessionStorage.getItem('toolkit_access');
        if (savedAccess && this.validateAccess(savedAccess)) {
            this.currentAccess = savedAccess;
            this.unlockContent();
        } else {
            this.showPasswordPrompt();
        }

        // Set up event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Password form submission
        const passwordForm = document.getElementById('password-form');
        if (passwordForm) {
            passwordForm.addEventListener('submit', (e) => this.handlePasswordSubmit(e));
        }

        // Enter key on password input
        const passwordInput = document.getElementById('password-input');
        if (passwordInput) {
            passwordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handlePasswordSubmit(e);
                }
            });
        }

        // Resource download tracking
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('track-download')) {
                this.trackResourceAccess(e.target.dataset.resource);
            }
        });
    }

    showPasswordPrompt() {
        const overlay = document.getElementById('password-overlay');
        if (overlay) {
            overlay.style.display = 'flex';
        }
    }

    hidePasswordPrompt() {
        const overlay = document.getElementById('password-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    handlePasswordSubmit(e) {
        e.preventDefault();
        
        const passwordInput = document.getElementById('password-input');
        const errorElement = document.getElementById('password-error');
        const submitButton = document.getElementById('password-submit');
        
        if (!passwordInput || !errorElement || !submitButton) return;
        
        const password = passwordInput.value.trim().toUpperCase();
        
        // Clear previous errors
        errorElement.classList.remove('show');
        
        // Show loading state
        submitButton.textContent = 'Verifying...';
        submitButton.disabled = true;
        
        // Simulate verification delay
        setTimeout(() => {
            if (this.accessCodes[password]) {
                this.currentAccess = this.accessCodes[password];
                sessionStorage.setItem('toolkit_access', this.currentAccess);
                
                // Track successful access
                this.trackAccess(password, this.currentAccess);
                
                this.unlockContent();
                this.hidePasswordPrompt();
            } else {
                // Show error
                errorElement.textContent = 'Invalid access code. Please check your code and try again.';
                errorElement.classList.add('show');
                
                // Track failed attempt
                this.trackFailedAccess(password);
                
                // Reset form
                passwordInput.value = '';
                passwordInput.focus();
            }
            
            // Reset button
            submitButton.textContent = 'Access Toolkit';
            submitButton.disabled = false;
        }, 1000);
    }

    validateAccess(accessLevel) {
        return ['premium', 'exclusive'].includes(accessLevel);
    }

    unlockContent() {
        const content = document.getElementById('toolkit-content');
        if (content) {
            content.classList.add('unlocked');
        }
        
        // Show/hide content based on access level
        this.filterContentByAccess();
    }

    filterContentByAccess() {
        const premiumElements = document.querySelectorAll('[data-access="premium"]');
        const exclusiveElements = document.querySelectorAll('[data-access="exclusive"]');
        
        // Show premium content for premium and exclusive users
        premiumElements.forEach(element => {
            if (this.currentAccess === 'premium' || this.currentAccess === 'exclusive') {
                element.style.display = 'block';
            } else {
                element.style.display = 'none';
            }
        });
        
        // Show exclusive content only for exclusive users
        exclusiveElements.forEach(element => {
            if (this.currentAccess === 'exclusive') {
                element.style.display = 'block';
            } else {
                element.style.display = 'none';
            }
        });
        
        // Update access level indicator
        this.updateAccessIndicator();
    }

    updateAccessIndicator() {
        const indicator = document.getElementById('access-level-indicator');
        if (indicator && this.currentAccess) {
            const levelText = this.currentAccess === 'exclusive' ? 'Exclusive Access' : 'Premium Access';
            const levelIcon = this.currentAccess === 'exclusive' ? '👑' : '⭐';
            indicator.innerHTML = `${levelIcon} ${levelText}`;
            indicator.className = `access-level ${this.currentAccess}`;
        }
    }

    trackAccess(code, level) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'toolkit_access_granted', {
                event_category: 'Toolkit',
                event_label: level,
                custom_parameter_1: code,
                value: level === 'exclusive' ? 2 : 1
            });
        }
    }

    trackFailedAccess(attemptedCode) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'toolkit_access_denied', {
                event_category: 'Toolkit',
                event_label: 'invalid_code',
                custom_parameter_1: attemptedCode
            });
        }
    }

    trackResourceAccess(resourceName) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'resource_download', {
                event_category: 'Toolkit',
                event_label: resourceName,
                custom_parameter_1: this.currentAccess,
                value: 1
            });
        }
    }

    logout() {
        sessionStorage.removeItem('toolkit_access');
        this.currentAccess = null;
        
        const content = document.getElementById('toolkit-content');
        if (content) {
            content.classList.remove('unlocked');
        }
        
        this.showPasswordPrompt();
        
        // Reset password form
        const passwordInput = document.getElementById('password-input');
        if (passwordInput) {
            passwordInput.value = '';
        }
        
        const errorElement = document.getElementById('password-error');
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }

    // Public method to check current access level
    hasAccess(requiredLevel) {
        if (!this.currentAccess) return false;
        
        if (requiredLevel === 'premium') {
            return this.currentAccess === 'premium' || this.currentAccess === 'exclusive';
        }
        
        if (requiredLevel === 'exclusive') {
            return this.currentAccess === 'exclusive';
        }
        
        return false;
    }
}

// Resource Management
class ToolkitResources {
    constructor(auth) {
        this.auth = auth;
        this.resources = {
            frameworks: [
                {
                    title: '🎨 Creative-Integrated Marketing Framework',
                    description: 'Comprehensive methodology combining strategic partnerships with creative marketing solutions for maximum impact.',
                    type: 'Framework',
                    access: 'premium',
                    downloadUrl: '#',
                    previewUrl: '#'
                },
                {
                    title: 'Strategic Marketing Assessment Framework',
                    description: 'Comprehensive evaluation methodology for marketing opportunities and strategic readiness.',
                    type: 'Framework',
                    access: 'premium',
                    downloadUrl: '#',
                    previewUrl: '#'
                },
                {
                    title: '🎨 Brand Synergy & Creative Alignment Tool',
                    description: 'Advanced framework for evaluating creative compatibility and brand alignment in strategic marketing initiatives.',
                    type: 'Tool',
                    access: 'premium',
                    downloadUrl: '#',
                    previewUrl: '#'
                },
                {
                    title: 'B2B Marketing ROI Calculator',
                    description: 'Advanced spreadsheet model for calculating marketing value and ROI projections.',
                    type: 'Tool',
                    access: 'premium',
                    downloadUrl: '#',
                    previewUrl: '#'
                },
                {
                    title: '🎨 Enterprise AI + Creative Integration Playbook',
                    description: 'Exclusive playbook combining AI-focused strategic marketing with creative implementation.',
                    type: 'Playbook',
                    access: 'exclusive',
                    downloadUrl: '#',
                    previewUrl: '#'
                }
            ],
            templates: [
                {
                    title: '🎨 Creative Campaign Templates',
                    description: 'Ready-to-use creative templates for integrated marketing campaigns and brand storytelling.',
                    type: 'Template',
                    access: 'premium',
                    downloadUrl: '#',
                    previewUrl: '#'
                },
                {
                    title: 'Marketing Agreement Templates',
                    description: 'Legal-reviewed templates for various marketing structures and agreements.',
                    type: 'Template',
                    access: 'premium',
                    downloadUrl: '#',
                    previewUrl: '#'
                },
                {
                    title: '🎨 Brand Integration Worksheets',
                    description: 'Creative worksheets for seamless brand integration and visual identity alignment in marketing campaigns.',
                    type: 'Worksheet',
                    access: 'premium',
                    downloadUrl: '#',
                    previewUrl: '#'
                },
                {
                    title: 'Strategic Planning Worksheets',
                    description: 'Step-by-step worksheets for marketing strategy development and execution.',
                    type: 'Worksheet',
                    access: 'premium',
                    downloadUrl: '#',
                    previewUrl: '#'
                },
                {
                    title: '🎨 Creative Brief & Asset Library Templates',
                    description: 'Professional templates for creative briefs, asset organization, and brand guideline documentation.',
                    type: 'Template',
                    access: 'exclusive',
                    downloadUrl: '#',
                    previewUrl: '#'
                }
            ],
            case_studies: [
                {
                    title: '🎨 Creative-Tech Marketing: AI + Design Success Story',
                    description: 'Comprehensive case study of a successful creative-technology marketing initiative combining AI innovation with award-winning design.',
                    type: 'Case Study',
                    access: 'exclusive',
                    downloadUrl: '#',
                    previewUrl: '#'
                },
                {
                    title: 'Microsoft Marketing Case Study',
                    description: 'Detailed analysis of successful enterprise AI marketing implementation.',
                    type: 'Case Study',
                    access: 'exclusive',
                    downloadUrl: '#',
                    previewUrl: '#'
                },
                {
                    title: '🎨 Brand Transformation Through Strategic Creative Marketing',
                    description: 'Multi-phase case study showing how creative marketing initiatives drove 300% brand engagement increase.',
                    type: 'Case Study',
                    access: 'exclusive',
                    downloadUrl: '#',
                    previewUrl: '#'
                }
            ]
        };
    }

    renderResources() {
        Object.keys(this.resources).forEach(category => {
            const container = document.getElementById(`${category}-container`);
            if (container) {
                container.innerHTML = this.resources[category]
                    .map(resource => this.renderResourceCard(resource))
                    .join('');
            }
        });
    }

    renderResourceCard(resource) {
        const hasAccess = this.auth.hasAccess(resource.access);
        const accessIcon = resource.access === 'exclusive' ? '👑' : '⭐';
        
        return `
            <div class="resource-item" data-access="${resource.access}">
                <div class="resource-type">${resource.type}</div>
                <h3 class="resource-title">${resource.title}</h3>
                <p class="resource-description">${resource.description}</p>
                <div class="resource-actions">
                    ${hasAccess ? `
                        <a href="${resource.downloadUrl}" class="btn-toolkit-primary track-download" data-resource="${resource.title}">
                            📥 Download
                        </a>
                        <a href="${resource.previewUrl}" class="btn-toolkit-secondary">
                            👁️ Preview
                        </a>
                    ` : `
                        <button class="btn-toolkit-primary" disabled>
                            🔒 Requires ${resource.access} Access
                        </button>
                    `}
                </div>
                <div class="access-level ${resource.access}">
                    ${accessIcon} ${resource.access} Access Required
                </div>
            </div>
        `;
    }
}

// Initialize when page loads
let toolkitAuth, toolkitResources;

document.addEventListener('DOMContentLoaded', function() {
    toolkitAuth = new ToolkitAuth();
    toolkitResources = new ToolkitResources(toolkitAuth);
    
    // Render resources after auth is initialized
    setTimeout(() => {
        toolkitResources.renderResources();
    }, 100);
});

// Make globally available
window.toolkitAuth = toolkitAuth;
window.toolkitResources = toolkitResources;