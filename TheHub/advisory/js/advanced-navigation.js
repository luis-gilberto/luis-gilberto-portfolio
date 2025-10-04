class AdvancedNavigation {
    constructor() {
        this.trigger = document.getElementById('navTrigger');
        this.panel = document.getElementById('navPanel');
        this.closeBtn = document.getElementById('navClose');
        this.backdrop = this.panel?.querySelector('.nav-backdrop');
        this.menu = this.panel?.querySelector('.nav-content');
        this.isDragging = false;
        
        if (this.trigger && this.panel) {
            this.init();
        }
    }
    
    init() {
        this.trigger.addEventListener('click', (e) => {
            if (!this.isDragging) {
                this.toggleNav();
            }
        });
        
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closeNav());
        }
        if (this.backdrop) {
            this.backdrop.addEventListener('click', () => this.closeNav());
        }
        
        this.initDragging();
        this.initSmoothScrolling();
        this.initScrollSpy();
        this.setupTooltips();
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.panel.classList.contains('active')) {
                this.closeNav();
            }
        });
        
        window.addEventListener('resize', () => this.updateTriggerPosition());
        window.addEventListener('load', () => this.updateTriggerPosition());
    }
    
    toggleNav() {
        this.panel.classList.toggle('active');
        document.body.style.overflow = this.panel.classList.contains('active') ? 'hidden' : '';
    }
    
    closeNav() {
        this.panel.classList.remove('active');
        document.body.style.overflow = '';
        this.hideAllTooltips();
    }
    
    setupTooltips() {
        const infoIcons = document.querySelectorAll('.nav-info-icon');
        const tooltipCloses = document.querySelectorAll('.nav-tooltip-close');
        
        infoIcons.forEach(icon => {
            const tooltipId = icon.getAttribute('data-tooltip');
            const tooltip = document.getElementById(`tooltip-${tooltipId}`);
            
            if (tooltip) {
                icon.addEventListener('mouseenter', () => {
                    this.hideAllTooltips();
                    this.showTooltip(tooltip, icon);
                });
                
                icon.addEventListener('mouseleave', () => {
                    setTimeout(() => {
                        if (!tooltip.matches(':hover') && !icon.matches(':hover')) {
                            this.hideTooltip(tooltip);
                        }
                    }, 100);
                });
                
                tooltip.addEventListener('mouseenter', () => {});
                tooltip.addEventListener('mouseleave', () => {
                    this.hideTooltip(tooltip);
                });
            }
        });
        
        tooltipCloses.forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                const tooltip = closeBtn.closest('.nav-tooltip');
                if (tooltip) {
                    this.hideTooltip(tooltip);
                }
            });
        });
    }
    
    showTooltip(tooltip, icon) {
        this.positionTooltip(tooltip, icon);
        tooltip.classList.add('show');
    }
    
    hideTooltip(tooltip) {
        tooltip.classList.remove('show');
    }
    
    hideAllTooltips() {
        document.querySelectorAll('.nav-tooltip').forEach(tooltip => {
            this.hideTooltip(tooltip);
        });
    }
    
    positionTooltip(tooltip, icon) {
        if (!this.menu) return;
        
        const iconRect = icon.getBoundingClientRect();
        const menuRect = this.menu.getBoundingClientRect();
        
        const iconRelativeTop = iconRect.top - menuRect.top;
        
        tooltip.style.right = '10px';
        tooltip.style.left = 'auto';
        tooltip.style.top = `${Math.max(10, iconRelativeTop - 10)}px`;
        tooltip.style.bottom = 'auto';
    }
    
    initDragging() {
        let startX, startY, currentX, currentY;
        
        this.trigger.addEventListener('mousedown', (e) => {
            this.isDragging = false;
            startX = e.clientX;
            startY = e.clientY;
            currentX = this.trigger.offsetLeft;
            currentY = this.trigger.offsetTop;
            
            const handleMouseMove = (e) => {
                if (!this.isDragging) {
                    const deltaX = Math.abs(e.clientX - startX);
                    const deltaY = Math.abs(e.clientY - startY);
                    if (deltaX > 5 || deltaY > 5) {
                        this.isDragging = true;
                    }
                }
                
                if (this.isDragging) {
                    const newX = currentX + (e.clientX - startX);
                    const newY = currentY + (e.clientY - startY);
                    
                    const maxX = window.innerWidth - this.trigger.offsetWidth;
                    const maxY = window.innerHeight - this.trigger.offsetHeight;
                    
                    this.trigger.style.left = Math.max(0, Math.min(newX, maxX)) + 'px';
                    this.trigger.style.top = Math.max(0, Math.min(newY, maxY)) + 'px';
                }
            };
            
            const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
                
                setTimeout(() => {
                    this.isDragging = false;
                }, 10);
            };
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        });
    }
    
    initSmoothScrolling() {
        const pageLinks = document.querySelectorAll('.page-nav-link');
        pageLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    this.closeNav();
                }
            });
        });
    }
    
    initScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.page-nav-link');
        
        if (sections.length === 0 || navLinks.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    
                    navLinks.forEach(link => link.classList.remove('active'));
                    
                    const activeLink = document.querySelector(`.page-nav-link[href="#${id}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-20% 0px -20% 0px'
        });
        
        sections.forEach(section => observer.observe(section));
    }
    
    updateTriggerPosition() {
        if (window.innerWidth <= 768) {
            this.trigger.style.left = '50%';
            this.trigger.style.transform = 'translateX(-50%)';
            this.trigger.style.top = '16px';
        } else {
            if (!this.trigger.style.left || this.trigger.style.left === '50%') {
                this.trigger.style.left = '24px';
                this.trigger.style.transform = 'none';
                this.trigger.style.top = '24px';
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AdvancedNavigation();
});