// ═══════════════════════════════════════════════════════
// FIXED CARD VIDEO HOVER + FLIP LOGIC
// ═══════════════════════════════════════════════════════
// 
// BEHAVIOR SUMMARY:
// - DESKTOP: Hover plays video, click flips card
// - MOBILE: Tap flips card (no video preview on mobile)
//
// Replace your existing "MOBILE-AWARE CARD LOGIC" section with this code

document.addEventListener('DOMContentLoaded', function() {
  const videoCards = document.querySelectorAll('.tour-card-video');
  const allCards = document.querySelectorAll('.tour-card');
  
  // More reliable touch device detection
  const isTouchDevice = ('ontouchstart' in window) || 
                        (navigator.maxTouchPoints > 0) || 
                        (navigator.msMaxTouchPoints > 0);
  
  // Check if device has fine pointer (mouse) - hybrid devices like Surface
  const hasFinPointer = window.matchMedia('(pointer: fine)').matches;
  
  // Use hover behavior if device has a fine pointer (even if also touch-capable)
  const useHoverBehavior = hasFinPointer;
  
  console.log('Card system initialized:', { 
    isTouchDevice, 
    hasFinPointer, 
    useHoverBehavior,
    videoCardsFound: videoCards.length,
    totalCards: allCards.length
  });

  // ===== VIDEO CARD CONTROLS =====
  videoCards.forEach(card => {
    const video = card.querySelector('.card-hover-video');
    const staticImg = card.querySelector('.card-static-img');
    
    if (!video) {
      console.warn('Video card missing video element:', card);
      return;
    }
    
    // Remove autoplay attribute and pause video initially
    video.removeAttribute('autoplay');
    video.pause();
    video.currentTime = 0;
    
    // Ensure static image is visible by default
    if (staticImg) {
      staticImg.style.opacity = '1';
    }
    video.style.opacity = '0';
    
    if (useHoverBehavior) {
      // ===== DESKTOP: Mouse hover to play video =====
      
      card.addEventListener('mouseenter', function() {
        // Don't play video if card is flipped
        if (card.classList.contains('flipped')) return;
        
        // Show video, hide static image
        video.style.opacity = '1';
        if (staticImg) staticImg.style.opacity = '0';
        
        // Play video
        video.play().catch(err => {
          console.log('Video autoplay blocked:', err.message);
        });
      });
      
      card.addEventListener('mouseleave', function() {
        // Hide video, show static image
        video.style.opacity = '0';
        if (staticImg) staticImg.style.opacity = '1';
        
        // Pause and reset video
        video.pause();
        video.currentTime = 0;
      });
      
    } else {
      // ===== MOBILE: No hover video, just tap to flip =====
      // Videos stay hidden on mobile - tap goes straight to flip
      video.style.display = 'none';
    }
    
    // Stop video when card flips (works for both desktop and mobile)
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.attributeName === 'class') {
          if (card.classList.contains('flipped')) {
            video.pause();
            video.currentTime = 0;
            video.style.opacity = '0';
            if (staticImg) staticImg.style.opacity = '1';
          }
        }
      });
    });
    
    observer.observe(card, { attributes: true, attributeFilter: ['class'] });
  });

  // ===== CARD FLIP LOGIC (ALL CARDS) =====
  allCards.forEach(card => {
    
    card.addEventListener('click', function(e) {
      // Don't flip if clicking on a link (the "Explore →" CTA)
      if (e.target.closest('a')) {
        return;
      }
      
      // Toggle flip state
      this.classList.toggle('flipped');
      
      // Close any other flipped cards
      allCards.forEach(otherCard => {
        if (otherCard !== this && otherCard.classList.contains('flipped')) {
          otherCard.classList.remove('flipped');
        }
      });
    });
  });
  
  // ===== CLICK OUTSIDE TO CLOSE FLIPPED CARDS =====
  document.addEventListener('click', function(e) {
    // If click is not on any card, close all flipped cards
    if (!e.target.closest('.tour-card')) {
      allCards.forEach(card => {
        card.classList.remove('flipped');
      });
    }
  });

  console.log('✅ Card video + flip system ready');
});
