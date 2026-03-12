class VideoModalCarousel {
    constructor() {
        this.videos = [];
        this.currentIndex = 0;
        this.modal = null;
        this.modalVideo = null;
        this.modalVideoSource = null;
        this.modalTitle = null;
        this.modalDescription = null;
        this.closeBtn = null;
        this.prevBtn = null;
        this.nextBtn = null;
        this.overlay = null;
        
        this.init();
    }
    
    init() {
        this.collectVideos();
        this.getModalElements();
        this.addEventListeners();
        this.generateThumbnails();
    }
    
    collectVideos() {
        const videoItems = document.querySelectorAll('.video-item');
        this.videos = Array.from(videoItems).map(item => {
            const video = item.querySelector('video source');
            const title = item.querySelector('.video-description h3');
            const description = item.querySelector('.video-description p');
            
            return {
                src: video ? video.src : '',
                title: title ? title.textContent : '',
                description: description ? description.textContent : '',
                element: item
            };
        });
    }
    
    getModalElements() {
        this.modal = document.getElementById('videoModal');
        if (!this.modal) {
            console.warn('Video modal not found');
            return;
        }
        
        this.modalVideo = document.getElementById('modalVideo');
        this.modalVideoSource = document.getElementById('modalVideoSource');
        this.modalTitle = document.getElementById('modalVideoTitle');
        this.modalDescription = document.getElementById('modalVideoDescription');
        this.closeBtn = this.modal.querySelector('.video-modal-close');
        this.prevBtn = this.modal.querySelector('.video-nav-prev');
        this.nextBtn = this.modal.querySelector('.video-nav-next');
        this.overlay = this.modal.querySelector('.video-modal-overlay');
    }
    
    addEventListeners() {
        // Add click listeners to video items
        this.videos.forEach((video, index) => {
            video.element.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal(index);
            });
        });
        
        // Modal controls - only add if elements exist
        if (!this.modal) return;
        
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closeModal());
        }
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.closeModal());
        }
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.previousVideo());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextVideo());
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.modal.classList.contains('active')) {
                switch(e.key) {
                    case 'Escape':
                        this.closeModal();
                        break;
                    case 'ArrowLeft':
                        this.previousVideo();
                        break;
                    case 'ArrowRight':
                        this.nextVideo();
                        break;
                }
            }
        });
    }
    
    generateThumbnails() {
        // Create thumbnail navigation if needed
        const thumbnailContainer = document.createElement('div');
        thumbnailContainer.className = 'video-thumbnails';
        
        this.videos.forEach((video, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = 'video-thumbnail';
            thumbnail.addEventListener('click', () => this.goToVideo(index));
            thumbnailContainer.appendChild(thumbnail);
        });
        
        // Add thumbnails to modal if container exists
        const modalContent = this.modal.querySelector('.video-modal-content');
        if (modalContent && this.videos.length > 1) {
            modalContent.appendChild(thumbnailContainer);
        }
    }
    
    openModal(index) {
        if (!this.modal) return;
        
        this.currentIndex = index;
        this.updateModalContent();
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Auto-play video
        setTimeout(() => {
            if (this.modalVideo) {
                this.modalVideo.play().catch(e => {
                    console.log('Auto-play prevented:', e);
                });
            }
        }, 100);
    }
    
    closeModal() {
        if (!this.modal) return;
        
        this.modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Explicitly set to auto instead of empty string
        
        // Pause video
        if (this.modalVideo) {
            this.modalVideo.pause();
        }
    }
    
    nextVideo() {
        this.currentIndex = (this.currentIndex + 1) % this.videos.length;
        this.updateModalContent();
    }
    
    previousVideo() {
        this.currentIndex = (this.currentIndex - 1 + this.videos.length) % this.videos.length;
        this.updateModalContent();
    }
    
    goToVideo(index) {
        this.currentIndex = index;
        this.updateModalContent();
    }
    
    updateModalContent() {
        const currentVideo = this.videos[this.currentIndex];
        
        if (currentVideo && this.modalVideoSource) {
            this.modalVideoSource.src = currentVideo.src;
            this.modalVideo.load();
            
            if (this.modalTitle) {
                this.modalTitle.textContent = currentVideo.title;
            }
            
            if (this.modalDescription) {
                this.modalDescription.textContent = currentVideo.description;
            }
            
            // Update thumbnail active state
            const thumbnails = this.modal.querySelectorAll('.video-thumbnail');
            thumbnails.forEach((thumb, index) => {
                thumb.classList.toggle('active', index === this.currentIndex);
            });
            
            // Auto-play new video
            setTimeout(() => {
                if (this.modalVideo) {
                    this.modalVideo.play().catch(e => {
                        console.log('Auto-play prevented:', e);
                    });
                }
            }, 100);
        }
    }
}

// Initialize the video modal carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new VideoModalCarousel();
});