// Typewriter cursor fix - replace the type() method in TypewriterController
// Find this method around line 1120 and replace it with:

type() {
    if (this.isDestroyed || !this.element || !this.isActive) {
        return;
    }
    
    const currentTagline = this.taglines[this.currentIndex];
    if (!currentTagline) {
        console.error('No tagline found at index:', this.currentIndex);
        return;
    }
    
    let typeSpeed = this.options.typeSpeed;
    let displayText = '';
    
    if (this.isDeleting) {
        // Deleting characters
        displayText = currentTagline.substring(0, this.charIndex - 1);
        this.charIndex--;
        typeSpeed = this.options.deleteSpeed;
    } else {
        // Typing characters
        displayText = currentTagline.substring(0, this.charIndex + 1);
        this.charIndex++;
    }
    
    // Add cursor at the current position - THIS IS THE KEY CHANGE
    this.element.innerHTML = displayText + '<span class="cursor">|</span>';
    
    // Handle state transitions
    if (!this.isDeleting && this.charIndex === currentTagline.length) {
        // Finished typing current tagline
        typeSpeed = this.options.pauseEnd;
        this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
        // Finished deleting
        this.isDeleting = false;
        this.currentIndex = (this.currentIndex + 1) % this.taglines.length;
        typeSpeed = this.options.pauseStart;
    }
    
    // Schedule next iteration with safety check
    this.timeoutId = setTimeout(() => {
        if (!this.isDestroyed && this.isActive) {
            this.type();
        }
    }, typeSpeed);
}

// Also add this CSS for the cursor animation:
.cursor {
    animation: blink 1s infinite;
}

@keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
}