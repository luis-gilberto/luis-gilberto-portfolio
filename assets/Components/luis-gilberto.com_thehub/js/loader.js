// Hub Loading Animation Initialization
document.addEventListener('DOMContentLoaded', function() {
  const loader = HubLoader.create({
    videoUrl: '/TheHub/assets/components/hub-animation/coral_laser_line.mp4',
    duration: 12000,
    autoStart: true,
    showProgress: false,
    skipOnClick: true,
    onComplete: function() {
      // Trigger logo flicker and collapse
      const logoOverlay = document.querySelector('.hub-logo-overlay');
      if (logoOverlay) {
        logoOverlay.classList.add('hub-logo-collapse');
      }
      
      // Show main content after collapse
      setTimeout(() => {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.style.display = 'block';
        }
        
        // Pulse nav logo
        setTimeout(() => {
          const navLogo = document.querySelector('.hub-nav-logo-img');
          if (navLogo) {
            navLogo.classList.add('nav-logo-attract');
          }
        }, 500);
        
        // Reveal elements
        const revealElements = document.querySelectorAll('.reveal');
        revealElements.forEach(el => {
          if (el.getBoundingClientRect().top < window.innerHeight) {
            el.classList.add('in');
          }
        });
      }, 2000);
    }
  });
});
