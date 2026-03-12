/**
 * ADVANCED NAVIGATION SYSTEM - SCOPEIQ WIZARD
 * 
 * Features:
 * - Fixed position navigation trigger with coral logomark
 * - Glass morphism styling with pulsating glow
 * - ScopeIQ-specific navigation panel
 * - Wizard progress tracking
 * - Responsive design and accessibility
 * - Keyboard support
 */

class AdvancedNavigation {
  constructor() {
    this.isOpen = false;
    
    this.init();
  }

  init() {
    this.createNavigationElements();
    this.bindEvents();
    this.updateWizardProgress();
  }

  createNavigationElements() {
    // Create navigation trigger button
    this.trigger = document.createElement('button');
    this.trigger.className = 'lg-nav-toggle';
    this.trigger.setAttribute('aria-label', 'Open navigation menu');
    this.trigger.setAttribute('aria-expanded', 'false');
    this.trigger.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 488 456" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M189.19 245.66C186.77 247.36 184.29 248.97 181.88 250.69V268.82C181.88 274.85 186.77 279.75 192.81 279.75H289.08C293.99 279.75 297.76 284.16 296.93 289.01C288.43 339.06 244.86 377.17 192.39 377.17H184.39C125.82 377.17 78.3401 329.69 78.3401 271.12V10.65C78.3401 4.76999 73.5702 0 67.6902 0H10.6501C4.77015 0 0 4.76999 0 10.65V265.52C0 370.35 84.9801 455.34 189.82 455.34C289.87 455.34 371.83 377.94 379.11 279.75C379.46 275.05 379.64 270.31 379.64 265.52V204.56C368.99 202.21 358.05 201.54 346.88 200.6C289.04 195.72 235.01 213.52 189.18 245.68L189.19 245.66Z" fill="currentColor"/>
        <path d="M482.52 202.14C459.6 189.98 434.75 180.53 408.28 174.35C372.78 166.06 337.29 164.3 303.05 168.27C302.13 168.38 301.2 168.5 300.28 168.62C273.45 171.99 247.42 178.87 222.8 188.92C218.97 190.48 215.19 192.15 211.43 193.86C173.04 211.35 138.42 236.59 110.03 268.15C106.04 272.58 106.76 279.49 111.57 283C115.75 286.04 121.53 285.39 124.98 281.55C148.56 255.34 176.75 233.8 207.92 217.85C210.96 216.3 214.01 214.78 217.1 213.33C273.36 187.02 338.54 178.69 403.71 193.92C416.3 196.86 428.49 200.59 440.25 205.05C444.25 206.56 448.19 208.16 452.09 209.83C459.25 212.91 466.24 216.27 473.05 219.88C477.49 222.23 482.97 221.02 485.93 216.96C489.54 212 487.91 205.01 482.5 202.14H482.52Z" fill="currentColor"/>
      </svg>
    `;

    // Create navigation backdrop
    this.backdrop = document.createElement('div');
    this.backdrop.className = 'advanced-nav-backdrop';
    this.backdrop.setAttribute('aria-hidden', 'true');

    // Create navigation panel
    this.panel = document.createElement('div');
    this.panel.className = 'advanced-nav-panel';
    this.panel.setAttribute('role', 'navigation');
    this.panel.setAttribute('aria-label', 'Main navigation');
    this.panel.innerHTML = this.createPanelContent();

    // Append to body
    document.body.appendChild(this.trigger);
    document.body.appendChild(this.backdrop);
    document.body.appendChild(this.panel);

    // Get close button reference
    this.closeBtn = this.panel.querySelector('.advanced-nav-close');
  }

  createPanelContent() {
    return `
      <div class="advanced-nav-header">
        <div class="nav-logo">
          <svg width="32" height="32" viewBox="0 0 488 456" fill="none" xmlns="http://www.w3.org/2000/svg" style="color: #F96F6E;">
            <path d="M189.19 245.66C186.77 247.36 184.29 248.97 181.88 250.69V268.82C181.88 274.85 186.77 279.75 192.81 279.75H289.08C293.99 279.75 297.76 284.16 296.93 289.01C288.43 339.06 244.86 377.17 192.39 377.17H184.39C125.82 377.17 78.3401 329.69 78.3401 271.12V10.65C78.3401 4.76999 73.5702 0 67.6902 0H10.6501C4.77015 0 0 4.76999 0 10.65V265.52C0 370.35 84.9801 455.34 189.82 455.34C289.87 455.34 371.83 377.94 379.11 279.75C379.46 275.05 379.64 270.31 379.64 265.52V204.56C368.99 202.21 358.05 201.54 346.88 200.6C289.04 195.72 235.01 213.52 189.18 245.68L189.19 245.66Z" fill="currentColor"/>
            <path d="M482.52 202.14C459.6 189.98 434.75 180.53 408.28 174.35C372.78 166.06 337.29 164.3 303.05 168.27C302.13 168.38 301.2 168.5 300.28 168.62C273.45 171.99 247.42 178.87 222.8 188.92C218.97 190.48 215.19 192.15 211.43 193.86C173.04 211.35 138.42 236.59 110.03 268.15C106.04 272.58 106.76 279.49 111.57 283C115.75 286.04 121.53 285.39 124.98 281.55C148.56 255.34 176.75 233.8 207.92 217.85C210.96 216.3 214.01 214.78 217.1 213.33C273.36 187.02 338.54 178.69 403.71 193.92C416.3 196.86 428.49 200.59 440.25 205.05C444.25 206.56 448.19 208.16 452.09 209.83C459.25 212.91 466.24 216.27 473.05 219.88C477.49 222.23 482.97 221.02 485.93 216.96C489.54 212 487.91 205.01 482.5 202.14H482.52Z" fill="currentColor"/>
          </svg>
        </div>
        <button class="advanced-nav-close" aria-label="Close navigation">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div class="advanced-nav-content">
        <!-- IMC HUB Section -->
        <div class="nav-section">
          <div class="nav-section-title">IMC HUB</div>
          <a href="../" class="nav-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9,22 9,12 15,12 15,22"/>
            </svg>
            Services
          </a>
          <a href="../advisory/index.html" class="nav-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h4m6-11h4a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-4m-6-4h6"/>
            </svg>
            Advisory
          </a>
          <a href="index.html" class="nav-link active">
            <svg width="20" height="20" viewBox="0 0 488 456" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M189.19 245.66C186.77 247.36 184.29 248.97 181.88 250.69V268.82C181.88 274.85 186.77 279.75 192.81 279.75H289.08C293.99 279.75 297.76 284.16 296.93 289.01C288.43 339.06 244.86 377.17 192.39 377.17H184.39C125.82 377.17 78.3401 329.69 78.3401 271.12V10.65C78.3401 4.76999 73.5702 0 67.6902 0H10.6501C4.77015 0 0 4.76999 0 10.65V265.52C0 370.35 84.9801 455.34 189.82 455.34C289.87 455.34 371.83 377.94 379.11 279.75C379.46 275.05 379.64 270.31 379.64 265.52V204.56C368.99 202.21 358.05 201.54 346.88 200.6C289.04 195.72 235.01 213.52 189.18 245.68L189.19 245.66Z" fill="currentColor"/>
              <path d="M482.52 202.14C459.6 189.98 434.75 180.53 408.28 174.35C372.78 166.06 337.29 164.3 303.05 168.27C302.13 168.38 301.2 168.5 300.28 168.62C273.45 171.99 247.42 178.87 222.8 188.92C218.97 190.48 215.19 192.15 211.43 193.86C173.04 211.35 138.42 236.59 110.03 268.15C106.04 272.58 106.76 279.49 111.57 283C115.75 286.04 121.53 285.39 124.98 281.55C148.56 255.34 176.75 233.8 207.92 217.85C210.96 216.3 214.01 214.78 217.1 213.33C273.36 187.02 338.54 178.69 403.71 193.92C416.3 196.86 428.49 200.59 440.25 205.05C444.25 206.56 448.19 208.16 452.09 209.83C459.25 212.91 466.24 216.27 473.05 219.88C477.49 222.23 482.97 221.02 485.93 216.96C489.54 212 487.91 205.01 482.5 202.14H482.52Z" fill="currentColor"/>
            </svg>
            ScopeIQ
          </a>
        </div>

        <!-- Wizard Progress Section -->
        <div class="nav-section">
          <div class="wizard-progress">
            <div class="progress-title">Wizard Progress</div>
            <div class="progress-bar">
              <div class="progress-fill" id="wizard-progress-fill" style="width: 0%"></div>
            </div>
            <div class="progress-text" id="wizard-progress-text">Getting Started</div>
          </div>
        </div>

        <!-- Quick Actions Section -->
        <div class="nav-section">
          <div class="nav-section-title">Quick Actions</div>
          <a href="#" class="nav-link" onclick="window.location.reload()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M1 4v6h6M23 20v-6h-6"/>
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
            </svg>
            Restart Wizard
          </a>
          <a href="#" class="nav-link" onclick="saveProgress()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17,21 17,13 7,13 7,21"/>
              <polyline points="7,3 7,8 15,8"/>
            </svg>
            Save Progress
          </a>
        </div>
      </div>
      
      <!-- Navigation Footer -->
      <div class="advanced-nav-footer">
        <div class="nav-footer-separator"></div>
        <div class="nav-footer-content">
          <svg width="20" height="20" viewBox="0 0 488 456" fill="none" xmlns="http://www.w3.org/2000/svg" class="nav-footer-logo">
            <path d="M189.19 245.66C186.77 247.36 184.29 248.97 181.88 250.69V268.82C181.88 274.85 186.77 279.75 192.81 279.75H289.08C293.99 279.75 297.76 284.16 296.93 289.01C288.43 339.06 244.86 377.17 192.39 377.17H184.39C125.82 377.17 78.3401 329.69 78.3401 271.12V10.65C78.3401 4.76999 73.5702 0 67.6902 0H10.6501C4.77015 0 0 4.76999 0 10.65V265.52C0 370.35 84.9801 455.34 189.82 455.34C289.87 455.34 371.83 377.94 379.11 279.75C379.46 275.05 379.64 270.31 379.64 265.52V204.56C368.99 202.21 358.05 201.54 346.88 200.6C289.04 195.72 235.01 213.52 189.18 245.68L189.19 245.66Z" fill="currentColor"/>
            <path d="M482.52 202.14C459.6 189.98 434.75 180.53 408.28 174.35C372.78 166.06 337.29 164.3 303.05 168.27C302.13 168.38 301.2 168.5 300.28 168.62C273.45 171.99 247.42 178.87 222.8 188.92C218.97 190.48 215.19 192.15 211.43 193.86C173.04 211.35 138.42 236.59 110.03 268.15C106.04 272.58 106.76 279.49 111.57 283C115.75 286.04 121.53 285.39 124.98 281.55C148.56 255.34 176.75 233.8 207.92 217.85C210.96 216.3 214.01 214.78 217.1 213.33C273.36 187.02 338.54 178.69 403.71 193.92C416.3 196.86 428.49 200.59 440.25 205.05C444.25 206.56 448.19 208.16 452.09 209.83C459.25 212.91 466.24 216.27 473.05 219.88C477.49 222.23 482.97 221.02 485.93 216.96C489.54 212 487.91 205.01 482.5 202.14H482.52Z" fill="currentColor"/>
          </svg>
          <span class="nav-footer-text">Smart Navigation</span>
        </div>
      </div>
    `;
  }

  bindEvents() {
    // Click event for toggle
    this.trigger.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggle();
    });

    // Close button and backdrop events
    this.closeBtn.addEventListener('click', () => this.close());
    this.backdrop.addEventListener('click', () => this.close());

    // Keyboard events
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
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
    this.trigger.setAttribute('aria-expanded', 'true');
    this.backdrop.classList.add('active');
    this.panel.classList.add('active');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Focus management
    setTimeout(() => {
      this.closeBtn.focus();
    }, 300);
  }

  close() {
    this.isOpen = false;
    this.trigger.classList.remove('active');
    this.trigger.setAttribute('aria-expanded', 'false');
    this.backdrop.classList.remove('active');
    this.panel.classList.remove('active');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Return focus to trigger
    this.trigger.focus();
  }

  updateWizardProgress() {
    // Get current wizard step from URL or page state
    const currentStep = this.getCurrentWizardStep();
    const totalSteps = 5; // Adjust based on your wizard steps
    const progressPercentage = (currentStep / totalSteps) * 100;
    
    const progressFill = document.getElementById('wizard-progress-fill');
    const progressText = document.getElementById('wizard-progress-text');
    
    if (progressFill && progressText) {
      progressFill.style.width = `${progressPercentage}%`;
      progressText.textContent = this.getStepName(currentStep);
    }
  }

  getCurrentWizardStep() {
    // Determine current step based on URL hash, query params, or page state
    const hash = window.location.hash;
    const params = new URLSearchParams(window.location.search);
    const step = params.get('step') || hash.replace('#step-', '') || '1';
    
    return parseInt(step) || 1;
  }

  getStepName(step) {
    const stepNames = {
      1: 'Getting Started',
      2: 'Project Details',
      3: 'Requirements',
      4: 'Configuration',
      5: 'Review & Submit'
    };
    
    return stepNames[step] || 'In Progress';
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.advancedNav = new AdvancedNavigation();
});

// Update progress when URL changes (for SPA behavior)
window.addEventListener('hashchange', () => {
  if (window.advancedNav) {
    window.advancedNav.updateWizardProgress();
  }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AdvancedNavigation;
}