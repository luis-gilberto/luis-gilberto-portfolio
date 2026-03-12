// Enhanced Bounce Evolution Timeline Functionality
// Replace the previous Legacy Carousel JavaScript with this

document.addEventListener('DOMContentLoaded', function() {
    const bounceSlides = document.querySelectorAll('#bounceEvolutionTrack .carousel-slide');
    const bounceIndicators = document.querySelectorAll('#bounceEvolutionIndicators .timeline-dot');
    const bouncePrevBtn = document.getElementById('bounceEvolutionPrevBtn');
    const bounceNextBtn = document.getElementById('bounceEvolutionNextBtn');
    const bounceAutoplayBtn = document.getElementById('bounceAutoplayBtn');
    const bouncePlayIcon = bounceAutoplayBtn ? bounceAutoplayBtn.querySelector('.play-icon') : null;
    const bounceProgressFill = document.getElementById('bounceProgressFill');

    let currentBounceIndex = 0;
    let bounceAutoplayInterval;
    let isBounceAutoplayActive = true;

    function showBounceSlide(index) {
        // Remove active class from all slides and indicators
        bounceSlides.forEach(slide => slide.classList.remove('active'));
        bounceIndicators.forEach(ind => ind.classList.remove('active'));

        // Add active class to current slide and indicator
        if (bounceSlides[index]) bounceSlides[index].classList.add('active');
        if (bounceIndicators[index]) bounceIndicators[index].classList.add('active');

        // Update progress bar
        if (bounceProgressFill) {
            const progressPercent = ((index + 1) / bounceSlides.length) * 100;
            bounceProgressFill.style.width = progressPercent + '%';
        }

        currentBounceIndex = index;
    }

    function nextBounceSlide() {
        const nextIndex = (currentBounceIndex + 1) % bounceSlides.length;
        showBounceSlide(nextIndex);
    }

    function prevBounceSlide() {
        const prevIndex = (currentBounceIndex - 1 + bounceSlides.length) % bounceSlides.length;
        showBounceSlide(prevIndex);
    }

    function startBounceAutoplay() {
        bounceAutoplayInterval = setInterval(nextBounceSlide, 4000);
        isBounceAutoplayActive = true;
        if (bounceAutoplayBtn) bounceAutoplayBtn.classList.add('active');
        if (bouncePlayIcon) bouncePlayIcon.textContent = '⏸';
    }

    function stopBounceAutoplay() {
        clearInterval(bounceAutoplayInterval);
        isBounceAutoplayActive = false;
        if (bounceAutoplayBtn) bounceAutoplayBtn.classList.remove('active');
        if (bouncePlayIcon) bouncePlayIcon.textContent = '▶';
    }

    // Event listeners
    if (bounceNextBtn) {
        bounceNextBtn.addEventListener('click', () => {
            nextBounceSlide();
            if (isBounceAutoplayActive) {
                stopBounceAutoplay();
                startBounceAutoplay(); // Restart autoplay timer
            }
        });
    }

    if (bouncePrevBtn) {
        bouncePrevBtn.addEventListener('click', () => {
            prevBounceSlide();
            if (isBounceAutoplayActive) {
                stopBounceAutoplay();
                startBounceAutoplay(); // Restart autoplay timer
            }
        });
    }

    bounceIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showBounceSlide(index);
            if (isBounceAutoplayActive) {
                stopBounceAutoplay();
                startBounceAutoplay(); // Restart autoplay timer
            }
        });
    });

    if (bounceAutoplayBtn) {
        bounceAutoplayBtn.addEventListener('click', () => {
            if (isBounceAutoplayActive) {
                stopBounceAutoplay();
            } else {
                startBounceAutoplay();
            }
        });
    }

    // Start autoplay on load if elements exist
    if (bounceSlides.length > 0) {
        // Initialize progress bar
        showBounceSlide(0);
        startBounceAutoplay();
    }

    // Update the scrollTargets array to include the new section
    // Find this array in your existing code and replace '.legacy-bounce' with '.bounce-to-legacy'
    // Example:
    // const scrollTargets = [
    //     '.project-overview',
    //     '.campaign-section',
    //     '.video-section',
    //     '.brand-identity',
    //     '.evolution-gallery',
    //     '.bounce-to-legacy',  // Change this line
    //     '.visual-impact',
    //     '.reflection',
    //     '.cta-section'
    // ];
});