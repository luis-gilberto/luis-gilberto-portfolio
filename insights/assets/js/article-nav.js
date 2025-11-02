// Article Navigation
document.addEventListener('DOMContentLoaded', () => {
    const pages = document.querySelectorAll('.page');
    const dots = document.querySelectorAll('.page-dot');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const stages = document.querySelectorAll('.timeline-stage');
    const progressBar = document.querySelector('.progress-bar');
    let currentPage = 0;

    function updatePage(index) {
        // Update pages
        pages.forEach(page => page.classList.remove('active'));
        pages[index].classList.add('active');

        // Update dots
        if (dots) {
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
        }

        // Update timeline stages
        if (stages) {
            stages.forEach(stage => stage.classList.remove('active'));
            stages[index].classList.add('active');
        }

        // Update navigation buttons
        if (prevBtn) prevBtn.disabled = index === 0;
        if (nextBtn) nextBtn.disabled = index === pages.length - 1;

        // Update progress bar
        if (progressBar) {
            progressBar.style.width = `${((index + 1) / pages.length) * 100}%`;
        }

        // Store current page in session storage
        sessionStorage.setItem('currentPage', index);

        // Update URL hash
        window.location.hash = `page${index + 1}`;

        currentPage = index;
    }

    // Initialize navigation
    function initNavigation() {
        // Check for stored page in session storage
        const storedPage = sessionStorage.getItem('currentPage');
        const hashPage = window.location.hash.match(/page(\d+)/);
        
        let initialPage = 0;
        if (hashPage) {
            initialPage = parseInt(hashPage[1]) - 1;
        } else if (storedPage !== null) {
            initialPage = parseInt(storedPage);
        }

        updatePage(initialPage);

        // Add event listeners
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentPage > 0) updatePage(currentPage - 1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (currentPage < pages.length - 1) updatePage(currentPage + 1);
            });
        }

        if (dots) {
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => updatePage(index));
            });
        }

        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' && currentPage > 0) {
                updatePage(currentPage - 1);
            } else if (e.key === 'ArrowRight' && currentPage < pages.length - 1) {
                updatePage(currentPage + 1);
            }
        });
    }

    // Initialize when DOM is loaded
    initNavigation();
});