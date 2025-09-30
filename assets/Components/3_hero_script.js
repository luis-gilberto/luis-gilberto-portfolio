// Hero Navigation JavaScript
// Add this to your main.js file

document.addEventListener('DOMContentLoaded', function() {
    const navCards = document.querySelectorAll('.nav-card');

    // Tab switching functionality
    navCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            const tab = this.dataset.tab;

            // Remove active from all cards
            navCards.forEach(c => c.classList.remove('active'));

            // Add active to clicked card
            this.classList.add('active');

            // Show corresponding tab content
            showTabContent(tab);

            // Scroll to content area
            const targetSection = document.querySelector('.tab-content-container');
            if (targetSection) {
                setTimeout(() => {
                    targetSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 100);
            }
        });

        // Hover effects
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(-3px) scale(1.02)';
            }
        });

        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = '';
            }
        });
    });

    function showTabContent(tabName) {
        // Hide all tab contents
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => {
            content.classList.remove('active');
            content.style.opacity = '0';
            content.style.transform = 'translateY(20px)';
        });

        // Show target tab content
        const targetContent = document.getElementById(tabName + '-tab');
        if (targetContent) {
            setTimeout(() => {
                targetContent.classList.add('active');
                targetContent.style.opacity = '1';
                targetContent.style.transform = 'translateY(0)';
            }, 150);
        }
    }

    // Initialize first tab as active
    if (navCards.length > 0) {
        navCards[0].classList.add('active');
        const firstTab = navCards[0].dataset.tab;
        if (firstTab) {
            showTabContent(firstTab);
        }
    }
});