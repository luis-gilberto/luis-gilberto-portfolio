    // Theme Toggle Script
    (function() {
        const themeToggle = document.getElementById('themeToggle');
        const htmlElement = document.documentElement;
        const currentTheme = localStorage.getItem('theme') || 'light';
        htmlElement.setAttribute('data-theme', currentTheme);

        // Helper to update video source
        function updateVideoSource(theme) {
            const videoSource = document.getElementById('heroVideoSource');
            const videoElement = document.getElementById('heroVideo');
            
            if (videoSource && videoElement) {
                const newSrc = theme === 'dark' 
                    ? '/insights/assets/videos/insights-video-dark-perfect.webm' 
                    : '/insights/assets/videos/insights-video-light.webm';
                
                // Only reload if source actually changes
                if (videoSource.getAttribute('src') !== newSrc) {
                    videoSource.src = newSrc;
                    videoElement.load();
                    videoElement.play().catch(e => console.log('Autoplay prevented:', e));
                }
            }
        }

        // Initialize video
        updateVideoSource(currentTheme);
        
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const newTheme = htmlElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
                htmlElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                updateVideoSource(newTheme);
            });
        }

        // Mobile Menu Toggle
        const mobileToggle = document.getElementById('mobileMenuToggle');
        const mobileOverlay = document.getElementById('mobileMenuOverlay');
        const mobileClose = document.getElementById('mobileMenuClose');
        
        if (mobileToggle && mobileOverlay) {
            mobileToggle.addEventListener('click', () => {
                mobileOverlay.classList.toggle('is-open');
                mobileToggle.classList.toggle('is-active');
                const isOpen = mobileOverlay.classList.contains('is-open');
                document.body.style.overflow = isOpen ? 'hidden' : '';
                
                // Toggle Icon (Simple inversion or could swap SVG)
                if (isOpen) {
                    mobileToggle.style.color = 'var(--coral-accent)';
                } else {
                    mobileToggle.style.color = '';
                }
            });

            // Close button inside overlay
            if (mobileClose) {
                mobileClose.addEventListener('click', () => {
                    mobileOverlay.classList.remove('is-open');
                    mobileToggle.classList.remove('is-active');
                    document.body.style.overflow = '';
                    mobileToggle.style.color = '';
                });
            }

            // Close when clicking a link
            const mobileLinks = mobileOverlay.querySelectorAll('.mobile-nav-link, .mobile-sub-link');
            mobileLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mobileOverlay.classList.remove('is-open');
                    mobileToggle.classList.remove('is-active');
                    document.body.style.overflow = '';
                    mobileToggle.style.color = '';
                });
            });
        }
    })();

    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

/* --- Timeline Interaction --- */ 
 document.addEventListener('DOMContentLoaded', function() { 
     const timelineItems = document.querySelectorAll('.timeline-item'); 
     
     if (timelineItems.length > 0) { 
         timelineItems.forEach(item => { 
             item.addEventListener('click', function() { 
                 // Toggle active state on click 
                 const isActive = this.classList.contains('active'); 
                 
                 // Close all other items (accordion style) 
                 timelineItems.forEach(i => i.classList.remove('active')); 
                 
                 // If it wasn't active before, open it now 
                 if (!isActive) { 
                     this.classList.add('active'); 
                 } 
             }); 
         }); 
 
         // Open the first item by default for better discoverability 
         setTimeout(() => { 
             timelineItems[0].classList.add('active'); 
         }, 500); 
     } 
 });