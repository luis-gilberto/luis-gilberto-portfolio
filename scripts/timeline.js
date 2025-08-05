// Timeline data
const timelineData = {
    foundations: {
        title: "Foundations (2012–2014)",
        quote: "This era was my entry into the tech world—and into Microsoft's boldest bets.",
        description: "From the debut of <strong>Windows 8</strong> and the first <strong>Surface</strong> devices to supporting the <strong>Office 2013</strong> rollout, I guided in-store strategy and retail attach for Microsoft's hardware and software milestones.",
        achievements: [
            "<strong>Windows 8 & Surface</strong> launch support across retail channels",
            "Retail attach strategy for <strong>Office 2013</strong>",
            "Campaign optimizations for <strong>PC Accessories</strong>",
            "Product storytelling & marketing enablement online"
        ],
        brands: [
            { src: "assets/images/brands/windows8.png", alt: "Windows 8" },
            { src: "assets/images/brands/surface-rt.png", alt: "Surface RT" },
            { src: "assets/images/brands/office2013.png", alt: "Office 2013" },
            { src: "assets/images/brands/accessories.png", alt: "Surface Accessories" }
        ],
        brandsSupported: {
            title: "Brands I Supported",
            image: { src: "assets/images/Brands_I_Supported_Foundations.png", alt: "Comprehensive overview of brands supported during the Foundations era" }
        }
    },
    ascent: {
        title: "Ascent (2014–2016)",
        quote: "From retail-ready demos to full campaign orchestration.",
        description: "I expanded Microsoft's in-store experiences—launching categories like <strong>Surface Pro 3</strong>, <strong>HoloLens</strong>, and <strong>Microsoft Band</strong>—then moved into Integrated Marketing for <strong>Office</strong>, shaping cross-platform storytelling.",
        achievements: [
            "Office for iPad launch & cross-platform narrative",
            "Surface Pro 3 demo kit & campaign alignment",
            "Microsoft Band & HoloLens retail support",
            "Windows 10 attach strategy & Office GTM coordination"
        ],
        brands: [
            { src: "assets/images/brands/surface.png", alt: "Surface" },
            { src: "assets/images/brands/surface-pro3.png", alt: "Surface Pro 3" },
            { src: "assets/images/brands/ms-band.png", alt: "Microsoft Band" },
            { src: "assets/images/brands/hololens.png", alt: "HoloLens" },
            { src: "assets/images/brands/office.png", alt: "Office" }
        ],
        brandsSupported: {
            title: "Brands I Supported",
            image: { src: "assets/images/Brands_I_Supported_Ascent.png", alt: "Comprehensive overview of brands supported during the Ascent era" }
        }
    },
    rewrite: {
        title: "Rewrite (2016–2018)",
        quote: "Stepping fully into strategic storytelling for Office.",
        description: "Joining the Office Business Group, I led seasonal campaigns and partner go-to-market strategies, guiding the narrative arc from <strong>Office 2016</strong> to <strong>Office 2019</strong>.",
        achievements: [
            "Retail & partner marketing for Office 2016 lifecycle",
            "Early narrative direction for Office 2019",
            "Creative assets for seasonal & evergreen campaigns",
            "Translating product updates into consumer stories"
        ],
        brands: [
            { src: "assets/images/brands/surface.png", alt: "Surface" },
            { src: "assets/images/brands/accessories.png", alt: "PC Accessories" },
            { src: "assets/images/brands/office2016.png", alt: "Office 2016" },
            { src: "assets/images/brands/office2019.png", alt: "Office 2019" }
        ],
        brandsSupported: {
            title: "Brands I Supported",
            image: { src: "assets/images/Brands_I_Supported_Rewrite.png", alt: "Comprehensive overview of brands supported during the Rewrite era" }
        }
    },
    pivot: {
        title: "Pivot (2019–2020)",
        quote: "Reintroducing Microsoft 365 with a human lens.",
        description: "I led the consumer launch of <strong><a href='case-study-fsa.html' target='_blank' style='color: inherit; text-decoration: underline;'>Family Safety</a></strong> during the pandemic and steered the rebrand from Office 365 to <strong>Microsoft 365</strong>, building modular kits of parts for global scale.",
        achievements: [
            "<strong><a href='case-study-fsa.html' target='_blank' style='color: inherit; text-decoration: underline;'>Family Safety</a></strong> launch BoM & animated story <a href='case-study-fsa.html' target='_blank' style='color: inherit; text-decoration: underline;'>campaign</a>",
            "Microsoft 365 rebrand partner rollout",
            "Scalable creative kits for retail & digital"
        ],
        brands: [
            { src: "assets/images/brands/office.png", alt: "Office" },
            { src: "assets/images/brands/microsoft365.png", alt: "Microsoft 365" },
            { src: "assets/images/brands/family-safety.png", alt: "Family Safety" }
        ],
        brandsSupported: {
            title: "Brands I Supported",
            image: { src: "assets/images/Brands_I_Supported_Pivot.png", alt: "Comprehensive overview of brands supported during the Pivot era" }
        }
    },
    rise: {
        title: "Rise (2020–2023)",
        quote: "When the world shut down, storytelling became survival.",
        description: "I created the '<strong><a href='case-study-free-to-be-free.html' target='_blank' style='color: inherit; text-decoration: underline;'>Free to Be Free</a></strong>' campaign celebrating digital liberation, and previewed <strong><a href='case-study-teams-final-dm.html' target='_blank' style='color: inherit; text-decoration: underline;'>Teams for Life</a></strong>—blending lifestyle marketing with product narratives.",
        achievements: [
            "<strong><a href='case-study-free-to-be-free.html' target='_blank' style='color: inherit; text-decoration: underline;'>Free to Be Free</a></strong> brand campaign",
            "<strong><a href='case-study-teams-final-dm.html' target='_blank' style='color: inherit; text-decoration: underline;'>Teams for Life</a></strong> preview launch"
        ],
        brands: [
            { src: "assets/images/brands/teams.png", alt: "Teams" },
            { src: "assets/images/brands/free-to-be-free.png", alt: "Free to Be Free" }
        ],
        brandsSupported: {
            title: "Brands I Supported",
            image: { src: "assets/images/Brands_I_Supported_Rise.png", alt: "Comprehensive overview of brands supported during the Rise era" }
        }
    },
    reinvention: {
        title: "Reinvention (2023–2025)",
        quote: "Even AI needs a heartbeat.",
        description: "I led Microsoft Edge's shift into the AI-powered browser and shaped Copilot narratives—making smart shopping and productivity tools approachable through integrated, human-centered campaigns.",
        achievements: [
            "<strong><a href='case-study-edge-ucational.html' target='_blank' style='color: inherit; text-decoration: underline;'>Edge-ucational Series</a></strong>",
            "<strong><a href='case-study-ai-browsing.html' target='_blank' style='color: inherit; text-decoration: underline;'>Edge AI Campaign</a></strong>",
            "<strong>Mobile App Store Rebrand</strong>"
        ],
        brands: [
            { src: "assets/images/brands/edge.png", alt: "Microsoft Edge" },
            { src: "assets/images/brands/copilot.png", alt: "Copilot" }
        ],
        brandsSupported: {
            title: "Brands I Supported",
            image: { src: "assets/images/Brands_I_Supported_Reinvention.png", alt: "Comprehensive overview of brands supported during the Reinvention era" }
        }
    }
};

// Initialize reveal overlay functionality
function initializeRevealOverlay() {
    const startButton = document.getElementById('startJourney');
    const closeButton = document.getElementById('revealClose');
    const overlay = document.getElementById('revealOverlay');
    const revealContent = document.querySelector('.reveal-content');
    
    if (!overlay) return;
    
    // Function to close the overlay
    function closeOverlay() {
        overlay.style.display = 'none';
        // Make timeline hero visible
        const timelineHero = document.getElementById('timelineHero');
        if (timelineHero) {
            timelineHero.classList.add('visible');
        }
    }
    
    // Close overlay when clicking the start journey button
    if (startButton) {
        startButton.addEventListener('click', closeOverlay);
    }
    
    // Close overlay when clicking the X button
    if (closeButton) {
        closeButton.addEventListener('click', closeOverlay);
    }
    
    // Close overlay when clicking outside the content area
    overlay.addEventListener('click', function(e) {
        // Only close if clicking the overlay itself, not the content
        if (e.target === overlay) {
            closeOverlay();
        }
    });
    
    // Prevent clicks on the content from bubbling up to the overlay
    if (revealContent) {
        revealContent.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Close overlay with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && overlay.style.display !== 'none') {
            closeOverlay();
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize reveal overlay functionality
    initializeRevealOverlay();
    
    // Initialize timeline
    initializeTimeline();
    setupNavigation();
});

// Initialize timeline
function initializeTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const eraContents = document.querySelectorAll('.era-content');
    
    timelineItems.forEach(item => {
        item.addEventListener('click', function() {
            const era = this.getAttribute('data-era');
            
            // Remove active class from all items and contents
            timelineItems.forEach(i => i.classList.remove('active'));
            eraContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked item and corresponding content
            this.classList.add('active');
            const targetContent = document.getElementById(era);
            if (targetContent) {
                targetContent.classList.add('active');
            }
            
            // Open modal with era data
            openTimelineModal(era);
        });
    });
    
    // Initialize modal functionality
    initializeModal();
}

// Initialize modal functionality
function initializeModal() {
    const modal = document.getElementById('timeline-modal');
    const closeBtn = document.querySelector('.timeline-modal .modal-close');
    const overlay = document.querySelector('.timeline-modal .modal-overlay');
    
    // Close modal events
    if (closeBtn) {
        closeBtn.addEventListener('click', closeTimelineModal);
    }
    if (overlay) {
        overlay.addEventListener('click', closeTimelineModal);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (modal && modal.classList.contains('active') && e.key === 'Escape') {
            closeTimelineModal();
        }
    });
}

// Open timeline modal
function openTimelineModal(era) {
    const modal = document.getElementById('timeline-modal');
    const data = timelineData[era];
    
    if (!modal || !data) return;
    
    // Populate modal content
    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-quote').textContent = `"${data.quote}"`;
    document.getElementById('modal-description').innerHTML = `<p>${data.description}</p>`;
    
    // Populate achievements
    const achievementsList = document.querySelector('#modal-achievements ul');
    achievementsList.innerHTML = '';
    data.achievements.forEach(achievement => {
        const li = document.createElement('li');
        li.innerHTML = achievement;
        achievementsList.appendChild(li);
    });
    
    // Populate brands
    const brandLogos = document.querySelector('#modal-brands .brand-logos');
    brandLogos.innerHTML = '';
    data.brands.forEach(brand => {
        const img = document.createElement('img');
        img.src = brand.src;
        img.alt = brand.alt;
        img.onerror = function() { this.style.display = 'none'; }; // Hide broken images
        brandLogos.appendChild(img);
    });
    
    // Populate brands supported (comprehensive image)
    const brandsSupportedContainer = document.querySelector('#modal-brands-supported .brands-supported-image');
    const brandsSupportedSection = document.querySelector('#modal-brands-supported');
    if (data.brandsSupported && data.brandsSupported.image) {
        brandsSupportedContainer.innerHTML = '';
        const img = document.createElement('img');
        img.src = data.brandsSupported.image.src;
        img.alt = data.brandsSupported.image.alt;
        img.onerror = function() { brandsSupportedSection.style.display = 'none'; }; // Hide section if image fails
        brandsSupportedContainer.appendChild(img);
        brandsSupportedSection.style.display = 'block';
    } else {
        brandsSupportedSection.style.display = 'none';
    }
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close timeline modal
function closeTimelineModal() {
    const modal = document.getElementById('timeline-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Setup navigation
function setupNavigation() {
    const prevBtn = document.getElementById('navLeft');
    const nextBtn = document.getElementById('navRight');
    const timelineTrack = document.getElementById('timelineTrack');
    
    if (prevBtn && nextBtn && timelineTrack) {
        const items = timelineTrack.querySelectorAll('.timeline-item');
        const totalItems = items.length;
        let currentIndex = 0;
        
        // Calculate responsive item width and visible items
        function getResponsiveValues() {
            const screenWidth = window.innerWidth;
            if (screenWidth <= 480) {
                return { itemWidth: 280, visibleItems: 1 }; // Show 1 item on mobile
            } else if (screenWidth <= 768) {
                return { itemWidth: 280, visibleItems: 2 }; // Show 2 items on tablet
            } else {
                return { itemWidth: 280, visibleItems: 3 }; // Show 3 items on desktop
            }
        }
        
        let { itemWidth, visibleItems } = getResponsiveValues();
        
        // Update button states - always enabled for infinite scroll
        function updateButtons() {
            prevBtn.disabled = false;
            nextBtn.disabled = false;
            
            // Ensure buttons are visible and active
            prevBtn.style.display = 'flex';
            nextBtn.style.display = 'flex';
            prevBtn.style.opacity = '1';
            nextBtn.style.opacity = '1';
        }
        
        // Update timeline position and active state
        function updateTimeline() {
            // Calculate scroll position (include gap in calculation)
            const gap = 24; // 1.5rem = 24px
            const translateX = -currentIndex * (itemWidth + gap);
            
            timelineTrack.style.transition = 'transform 0.5s ease';
            timelineTrack.style.transform = `translateX(${translateX}px)`;
            
            // Update active states
            const eraContents = document.querySelectorAll('.era-content');
            
            // Remove active class from all
            items.forEach(item => item.classList.remove('active'));
            eraContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to current item
            if (items[currentIndex]) {
                items[currentIndex].classList.add('active');
                const era = items[currentIndex].getAttribute('data-era');
                const targetContent = document.getElementById(era);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            }
            
            // Update button states based on current position
            prevBtn.disabled = false;
            nextBtn.disabled = false;
            prevBtn.style.opacity = '1';
            nextBtn.style.opacity = '1';
            
            // Log for debugging
            console.log(`Current index: ${currentIndex}, Total items: ${totalItems}, TranslateX: ${translateX}px`);
        }
        
        prevBtn.addEventListener('click', function() {
            currentIndex = (currentIndex - 1 + totalItems) % totalItems;
            updateTimeline();
        });
        
        nextBtn.addEventListener('click', function() {
            currentIndex = (currentIndex + 1) % totalItems;
            updateTimeline();
        });
        
        // Handle window resize
        window.addEventListener('resize', function() {
            const newValues = getResponsiveValues();
            itemWidth = newValues.itemWidth;
            visibleItems = newValues.visibleItems;
            
            updateTimeline();
        });
        
        // Initialize
        updateTimeline();
    }
}

// Animate timeline items
function animateTimelineItems() {
    const items = document.querySelectorAll('.timeline-item');
    items.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
}