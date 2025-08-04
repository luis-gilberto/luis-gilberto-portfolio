
// Quick Tour Animation JavaScript - Corrected Version

document.addEventListener('DOMContentLoaded', function() {
    initQuickTourAnimations();
});

function initQuickTourAnimations() {
    const cards = document.querySelectorAll('.tour-card');
    const shuffleButton = document.querySelector('.shuffle-button');
    const cardStack = document.querySelector('.card-stack');
    let isShuffling = false;
    let focusedCard = null;

    // Create backdrop element
    const backdrop = document.createElement('div');
    backdrop.className = 'card-backdrop';
    document.body.appendChild(backdrop);

    // Intersection Observer for entrance animation
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Trigger entrance animation
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('animate-in');
                    }, index * 400);
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Start observing
    if (cardStack) {
        observer.observe(cardStack);
    }

    // Card click handlers
    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (isShuffling) return;
            
            if (card.classList.contains('focused')) {
                // Already focused, do nothing or close
                return;
            }
            
            // Remove focus from other cards
            cards.forEach(c => c.classList.remove('focused'));
            cardStack.classList.remove('has-focused');
            
            // Focus this card
            card.classList.add('focused');
            cardStack.classList.add('has-focused');
            backdrop.classList.add('active');
            focusedCard = card;
        });

        // CTA button click handlers
        const ctaButton = card.querySelector('.card-cta');
        if (ctaButton) {
            ctaButton.addEventListener('click', (e) => {
                e.stopPropagation();
                const cardType = card.dataset.card;
                handleCTAClick(cardType);
            });
        }
    });

    // Backdrop click handler
    backdrop.addEventListener('click', () => {
        closeFocusedCard();
    });

    // Escape key handler
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && focusedCard) {
            closeFocusedCard();
        }
    });

    // Shuffle button handler
    if (shuffleButton) {
        shuffleButton.addEventListener('click', () => {
            if (isShuffling) return;
            shuffleCards();
        });
    }

    function closeFocusedCard() {
        if (focusedCard) {
            focusedCard.classList.remove('focused');
            cardStack.classList.remove('has-focused');
            backdrop.classList.remove('active');
            focusedCard = null;
        }
    }

    function shuffleCards() {
        if (isShuffling) return;
        isShuffling = true;
        
        // Close focused card if any
        closeFocusedCard();
        
        // Add shuffling class
        cards.forEach(card => {
            card.classList.add('shuffling');
            card.classList.add('shuffle-spread');
        });
        
        // After spread animation, gather and reorder
        setTimeout(() => {
            // Remove spread classes
            cards.forEach(card => {
                card.classList.remove('shuffle-spread');
            });
            
            // Randomize z-index and positions
            const positions = [
                { zIndex: 5, transform: 'translateX(0) rotate(-2deg) translate(0px, 0px)' },
                { zIndex: 4, transform: 'translateX(0) rotate(1deg) translate(15px, 20px)' },
                { zIndex: 3, transform: 'translateX(0) rotate(-1deg) translate(30px, 40px)' },
                { zIndex: 2, transform: 'translateX(0) rotate(2deg) translate(45px, 60px)' },
                { zIndex: 1, transform: 'translateX(0) rotate(-1deg) translate(60px, 80px)' }
            ];
            
            // Shuffle positions array
            const shuffledPositions = [...positions].sort(() => Math.random() - 0.5);
            
            cards.forEach((card, index) => {
                card.style.zIndex = shuffledPositions[index].zIndex;
                card.style.transform = shuffledPositions[index].transform;
            });
            
            // Remove shuffling class after animation
            setTimeout(() => {
                cards.forEach(card => {
                    card.classList.remove('shuffling');
                });
                isShuffling = false;
            }, 500);
            
        }, 750);
    }

    function handleCTAClick(cardType) {
        switch(cardType) {
            case 'about-me':
                // Replace with your actual navigation
                window.location.href = 'about.html';
                break;
            case 'brand-guide':
                // Replace with your actual navigation
                window.location.href = 'brand-guide.html';
                break;
            case 'timeline':
                // Replace with your actual navigation
                window.location.href = 'timeline.html';
                break;
            case 'my-experience':
                // Replace with your actual navigation
                window.location.href = 'myexperience.html';
                break;
            case 'resume':
                // Replace with your actual navigation
                window.location.href = 'cv.html';
                break;
            default:
                alert('Navigate to: ' + cardType);
        }
    }
}
