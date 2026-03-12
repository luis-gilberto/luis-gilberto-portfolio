// COMPLETE WORKING JAVASCRIPT FOR INSIGHTS PAGE
// Replace your entire <script> section with this

document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    
    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // Tab Switching
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ============================================
    // THREAD ANIMATION - ADD THIS!
    // ============================================
    (function() {
        'use strict';

        const config = {
            startDelay: 400,
            pathDuration: 2500,
            dotAppearDelay: 2500,
            dotDuration: 500
        };

        function initThreadAnimation() {
            const threadPath = document.querySelector('.thread-path');
            const threadDot = document.querySelector('.thread-dot');
            
            if (!threadPath || !threadDot) {
                console.warn('Thread animation elements not found');
                return;
            }

            const pathLength = threadPath.getTotalLength();
            
            threadPath.style.strokeDasharray = pathLength;
            threadPath.style.strokeDashoffset = pathLength;
            threadPath.style.opacity = '0';
            threadDot.style.opacity = '0';
            threadDot.style.transform = 'scale(0)';

            setTimeout(() => {
                threadPath.style.transition = `
                    stroke-dashoffset ${config.pathDuration}ms cubic-bezier(0.65, 0, 0.35, 1),
                    opacity 200ms ease-out
                `;
                threadPath.style.strokeDashoffset = '0';
                threadPath.style.opacity = '1';

                setTimeout(() => {
                    threadDot.style.transition = `
                        opacity ${config.dotDuration}ms ease-out,
                        transform ${config.dotDuration}ms cubic-bezier(0.34, 1.56, 0.64, 1)
                    `;
                    threadDot.style.opacity = '1';
                    threadDot.style.transform = 'scale(1)';
                }, config.dotAppearDelay);
            }, config.startDelay);
        }

        // Call the animation function
        initThreadAnimation();
    })();
    // ============================================
    // END THREAD ANIMATION
    // ============================================

    // Initialize Swiper Carousel for Stories tab
    const storiesSwiperContainer = document.querySelector('.stories-swiper');
    if (storiesSwiperContainer && typeof Swiper !== 'undefined') {
        const storiesSwiper = new Swiper('.stories-swiper', {
            effect: 'coverflow',
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: 'auto',
            loop: false,
            coverflowEffect: {
                rotate: 0,
                stretch: 0,
                depth: 110,
                modifier: 1,
                slideShadows: false,
            },
            pagination: {
                el: '.stories-swiper .swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.stories-swiper .swiper-button-next',
                prevEl: '.stories-swiper .swiper-button-prev',
            },
            keyboard: { enabled: true },
            breakpoints: {
                480: { slidesPerView: 1.1, spaceBetween: 20 },
                768: { slidesPerView: 1.5, spaceBetween: 30 },
                968: { slidesPerView: 2, spaceBetween: 30 },
                1200: { slidesPerView: 2.5, spaceBetween: 40 }
            }
        });
    }

    // Initialize Swiper Carousel for Work That Mattered section
    if (document.querySelector('.work-swiper') && typeof Swiper !== 'undefined') {
        const workSwiper = new Swiper('.work-swiper', {
            effect: 'coverflow',
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: 'auto',
            loop: false,
            coverflowEffect: {
                rotate: 0,
                stretch: 0,
                depth: 120,
                modifier: 1.5,
                slideShadows: false,
            },
            pagination: {
                el: '.work-swiper-pagination',
                clickable: true,
                dynamicBullets: true,
            },
            navigation: {
                nextEl: '.work-swiper-next',
                prevEl: '.work-swiper-prev',
            },
            keyboard: { enabled: true },
            breakpoints: {
                480: { slidesPerView: 1.1, spaceBetween: 20 },
                768: { slidesPerView: 1.5, spaceBetween: 30 },
                968: { slidesPerView: 2, spaceBetween: 30 },
                1200: { slidesPerView: 2.5, spaceBetween: 40 }
            }
        });
    }
});
