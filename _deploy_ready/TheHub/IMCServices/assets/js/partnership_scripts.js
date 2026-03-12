/* Luis Gilberto B2B Tech Storytelling Partnership Page - Custom JavaScript */
/* Extracted and organized from partnership_b2b_storytelling.html */


        // Gateway Access Control
        function checkAccess() {
            const accessCodeElement = document.getElementById('accessCode');
            const errorMessage = document.getElementById('errorMessage');
            
            if (!accessCodeElement) return; // Exit if elements don't exist
            
            const accessCode = accessCodeElement.value.toUpperCase();
            
            if (accessCode === 'LG100') {
                // Track successful hub access
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'hub_assessment_start', {
                        'event_category': 'imc_services',
                        'event_label': 'assessment_initiated'
                    });
                }
                
                const gatewayOverlay = document.getElementById('gatewayOverlay');
                const mainContent = document.getElementById('mainContent');
                
                if (gatewayOverlay) gatewayOverlay.style.display = 'none';
                if (mainContent) mainContent.classList.remove('hidden');
                
                // Initialize scroll animations
                initializeScrollAnimations();
            } else {
                // Track failed access attempt
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'toolkit_access_attempt', {
                        'event_category': 'imc_services',
                        'event_label': 'toolkit_password_entry'
                    });
                }
                
                if (errorMessage) errorMessage.classList.remove('hidden');
                accessCodeElement.value = '';
                setTimeout(() => {
                    if (errorMessage) errorMessage.classList.add('hidden');
                }, 3000);
            }
        }

        // Enter key support for access code
        const accessCodeElement = document.getElementById('accessCode');
        if (accessCodeElement) {
            accessCodeElement.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    checkAccess();
                }
            });
        }

        // Lead Capture Tracking Function
        function trackLeadCapture(action) {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'lead_capture', {
                    'event_category': 'imc_services',
                    'event_label': action,
                    'value': 1
                });
            }
        }

        // Make function globally available
        window.trackLeadCapture = trackLeadCapture;

        // Track hub engagement specifically
        function trackHubEngagement(stage) {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'hub_engagement', {
                    'event_category': 'strategic_planning',
                    'event_label': stage
                });
            }
        }

        // Make function globally available
        window.trackHubEngagement = trackHubEngagement;

        // Track strategic intelligence section views
        window.addEventListener('scroll', function() {
            const intelligenceSection = document.getElementById('strategic-intelligence');
            if (intelligenceSection && isElementInViewport(intelligenceSection)) {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'section_view', {
                        'event_category': 'imc_services',
                        'event_label': 'strategic_intelligence_viewed'
                    });
                }
            }
        });

        function isElementInViewport(el) {
            const rect = el.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }

        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Initialize scroll-triggered animations
        function initializeScrollAnimations() {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        
                        // Special handling for evolving text
                        const evolvingTexts = entry.target.querySelectorAll('.evolving-text');
                        evolvingTexts.forEach(text => {
                            const letters = text.querySelectorAll('.letter');
                            letters.forEach((letter, index) => {
                                letter.style.animationDelay = `${index * 0.1}s`;
                            });
                        });
                    }
                });
            }, observerOptions);

            // Observe sections for scroll animations
            document.querySelectorAll('section').forEach(section => {
                section.style.opacity = '0';
                section.style.transform = 'translateY(20px)';
                section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(section);
            });
        }

        // Enhanced hover effects for partnership cards
        document.querySelectorAll('.partnership-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
                this.style.boxShadow = '0 20px 40px rgba(255, 107, 107, 0.15)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = 'none';
            });
        });

        // Mobile menu toggle functionality
        function initializeMobileMenu() {
            const mobileMenuBtn = document.getElementById('mobile-menu-btn');
            const mobileMenu = document.getElementById('mobile-menu');
            
            if (mobileMenuBtn && mobileMenu) {
                mobileMenuBtn.addEventListener('click', function() {
                    const isOpen = mobileMenu.classList.contains('active');
                    
                    if (isOpen) {
                        mobileMenu.classList.remove('active');
                        mobileMenuBtn.setAttribute('aria-expanded', 'false');
                    } else {
                        mobileMenu.classList.add('active');
                        mobileMenuBtn.setAttribute('aria-expanded', 'true');
                    }
                });
                
                // Close mobile menu when clicking outside
                document.addEventListener('click', function(event) {
                    if (!mobileMenuBtn.contains(event.target) && !mobileMenu.contains(event.target)) {
                        mobileMenu.classList.remove('active');
                        mobileMenuBtn.setAttribute('aria-expanded', 'false');
                    }
                });
                
                // Close mobile menu on escape key
                document.addEventListener('keydown', function(event) {
                    if (event.key === 'Escape' && mobileMenu.classList.contains('active')) {
                        mobileMenu.classList.remove('active');
                        mobileMenuBtn.setAttribute('aria-expanded', 'false');
                    }
                });
            }
        }

        // Auto-focus access code input
        const accessCodeFocusElement = document.getElementById('accessCode');
        if (accessCodeFocusElement) {
            accessCodeFocusElement.focus();
        }

        // Initialize mobile menu functionality
        document.addEventListener('DOMContentLoaded', function() {
            initializeMobileMenu();
        });
    


        window.__genspark_remove_badge_link = "https://www.genspark.ai/api/html_badge/" +
            "remove_badge?token=To%2FBnjzloZ3UfQdcSaYfDnB8MM8j5x2LErS%2FWfKMk3HMZeAOyvEk1w2hbysURCVs2gj5sKuYKuB%2FrYxVf9TucDQ3M4iKk8er0vEhrEz%2FCIDTpZwASgdY%2BKnvs2%2FcNEg1ruVPKbBr02zmOe2i0WQhRbVUmQt11ahjaaBvM14HXwLH99OJnvCNcm2YCAAWFVCvXL7R7vgatsudAcD8UdW7dg1vsBnLd%2FtdKIxHEeEmk4Yyfwslo88bvyYTXjPt9B8rHTcMHSE4Ti5XfnRKlCkMfq3YX32yjXRl98X6HU1zPmsItRk1vHaMOnsueeGsNFSFs4FcUc6ngihH%2BlqEk%2BFiO9U7tkKX9xEFo1PFkaBNWS7kmyYGouXpa9XgCVSuI%2FxpU8260%2F0FdVJG8f7LfzxcADvTvnKlo0o7EW9NqXxf5ZjcFvXKMnmTRPu3gyB2whOAWUtfQiXs8RWyLcQQ7NtU90WFfGny6uE7BBCah9L5AkKGdZZ6dGDvhEk9qV9VCvgE95naRwQA5G4XIBTmMrnZ%2Bp8J42m0IUz0rlIdQVCIRLU%3D";
        window.__genspark_locale = "en-US";
        window.__genspark_token = "To/BnjzloZ3UfQdcSaYfDnB8MM8j5x2LErS/WfKMk3HMZeAOyvEk1w2hbysURCVs2gj5sKuYKuB/rYxVf9TucDQ3M4iKk8er0vEhrEz/CIDTpZwASgdY+Knvs2/cNEg1ruVPKbBr02zmOe2i0WQhRbVUmQt11ahjaaBvM14HXwLH99OJnvCNcm2YCAAWFVCvXL7R7vgatsudAcD8UdW7dg1vsBnLd/tdKIxHEeEmk4Yyfwslo88bvyYTXjPt9B8rHTcMHSE4Ti5XfnRKlCkMfq3YX32yjXRl98X6HU1zPmsItRk1vHaMOnsueeGsNFSFs4FcUc6ngihH+lqEk+FiO9U7tkKX9xEFo1PFkaBNWS7kmyYGouXpa9XgCVSuI/xpU8260/0FdVJG8f7LfzxcADvTvnKlo0o7EW9NqXxf5ZjcFvXKMnmTRPu3gyB2whOAWUtfQiXs8RWyLcQQ7NtU90WFfGny6uE7BBCah9L5AkKGdZZ6dGDvhEk9qV9VCvgE95naRwQA5G4XIBTmMrnZ+p8J42m0IUz0rlIdQVCIRLU=";
    

