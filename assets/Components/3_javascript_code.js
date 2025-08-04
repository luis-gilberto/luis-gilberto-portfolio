// Legacy Carousel Functionality - Add this to your existing script section

document.addEventListener('DOMContentLoaded', function() {
    const legacySlides = document.querySelectorAll('.carousel-slide');
    const legacyIndicators = document.querySelectorAll('#legacyIndicators .indicator');
    const legacyPrevBtn = document.getElementById('legacyPrevBtn');
    const legacyNextBtn = document.getElementById('legacyNextBtn');
    const legacyAutoplayBtn = document.getElementById('legacyAutoplayBtn');
    const legacyPlayIcon = legacyAutoplayBtn ? legacyAutoplayBtn.querySelector('.play-icon') : null;

    let currentLegacyIndex = 0;
    let legacyAutoplayInterval;
    let isLegacyAutoplayActive = true;

    function showLegacySlide(index) {
        // Remove active class from all slides and indicators
        legacySlides.forEach(slide => slide.classList.remove('active'));
        legacyIndicators.forEach(ind => ind.classList.remove('active'));

        // Add active class to current slide and indicator
        if (legacySlides[index]) legacySlides[index].classList.add('active');
        if (legacyIndicators[index]) legacyIndicators[index].classList.add('active');

        currentLegacyIndex = index;
    }

    function nextLegacySlide() {
        const nextIndex = (currentLegacyIndex + 1) % legacySlides.length;
        showLegacySlide(nextIndex);
    }

    function prevLegacySlide() {
        const prevIndex = (currentLegacyIndex - 1 + legacySlides.length) % legacySlides.length;
        showLegacySlide(prevIndex);
    }

    function startLegacyAutoplay() {
        legacyAutoplayInterval = setInterval(nextLegacySlide, 4000);
        isLegacyAutoplayActive = true;
        if (legacyAutoplayBtn) legacyAutoplayBtn.classList.add('active');
        if (legacyPlayIcon) legacyPlayIcon.textContent = '⏸';
    }

    function stopLegacyAutoplay() {
        clearInterval(legacyAutoplayInterval);
        isLegacyAutoplayActive = false;
        if (legacyAutoplayBtn) legacyAutoplayBtn.classList.remove('active');
        if (legacyPlayIcon) legacyPlayIcon.textContent = '▶';
    }

    // Event listeners
    if (legacyNextBtn) {
        legacyNextBtn.addEventListener('click', () => {
            nextLegacySlide();
            if (isLegacyAutoplayActive) {
                stopLegacyAutoplay();
                startLegacyAutoplay(); // Restart autoplay timer
            }
        });
    }

    if (legacyPrevBtn) {
        legacyPrevBtn.addEventListener('click', () => {
            prevLegacySlide();
            if (isLegacyAutoplayActive) {
                stopLegacyAutoplay();
                startLegacyAutoplay(); // Restart autoplay timer
            }
        });
    }

    legacyIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showLegacySlide(index);
            if (isLegacyAutoplayActive) {
                stopLegacyAutoplay();
                startLegacyAutoplay(); // Restart autoplay timer
            }
        });
    });

    if (legacyAutoplayBtn) {
        legacyAutoplayBtn.addEventListener('click', () => {
            if (isLegacyAutoplayActive) {
                stopLegacyAutoplay();
            } else {
                startLegacyAutoplay();
            }
        });
    }

    // Start autoplay on load if elements exist
    if (legacySlides.length > 0) {
        startLegacyAutoplay();
    }

    // Also update the scrollTargets array
    // Find the existing scrollTargets array and add '.legacy-bounce' after '.evolution-gallery'
    // Example:
    // const scrollTargets = [
    //     '.project-overview',
    //     '.campaign-section',
    //     '.video-section',
    //     '.brand-identity',
    //     '.evolution-gallery',
    //     '.legacy-bounce',  // Add this line
    //     '.visual-impact',
    //     '.reflection',
    //     '.cta-section'
    // ];
});