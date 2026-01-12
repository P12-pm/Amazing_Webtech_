// ===================================
// Main JavaScript - Optimized
// (Navbar code removed - see separate navbar.js)
// ===================================

class HeroSlider {
    constructor(options = {}) {
        // Default options
        this.options = {
            autoplay: true,
            autoplaySpeed: 5000,
            animationType: 'fade', // 'fade', 'slide', 'zoom'
            pauseOnHover: true,
            showDots: true,
            showProgress: true,
            showCounter: true,
            keyboard: true,
            touch: true,
            ...options
        };

        // Elements
        this.slider = document.getElementById('hero-slider');
        this.slides = document.querySelectorAll('.slide');
        this.prevBtn = document.getElementById('prev-slide');
        this.nextBtn = document.getElementById('next-slide');
        this.dotsContainer = document.getElementById('slider-dots');
        this.progressBar = document.getElementById('progress-bar');
        this.currentSlideEl = document.getElementById('current-slide');
        this.totalSlidesEl = document.getElementById('total-slides');
        this.pausePlayBtn = document.getElementById('pause-play');
        this.pauseIcon = document.getElementById('pause-icon');
        this.heroSection = document.getElementById('hero');

        // State
        this.currentIndex = 0;
        this.totalSlides = this.slides.length;
        this.isPlaying = this.options.autoplay;
        this.autoplayInterval = null;
        this.progressInterval = null;
        this.progress = 0;
        this.touchStartX = 0;
        this.touchEndX = 0;

        // Initialize
        this.init();
    }

    init() {
        this.createDots();
        this.updateCounter();
        this.bindEvents();
        
        if (this.isPlaying) {
            this.startAutoplay();
        }
        
        // Initial animation for first slide
        this.animateSlide(0, 'in');
    }

    createDots() {
        if (!this.options.showDots || !this.dotsContainer) return;

        this.dotsContainer.innerHTML = '';
        
        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.dataset.index = i;
            this.dotsContainer.appendChild(dot);
        }
    }

    updateDots() {
        if (!this.dotsContainer) return;
        
        const dots = this.dotsContainer.querySelectorAll('.slider-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    updateCounter() {
        if (!this.options.showCounter) return;
        
        if (this.currentSlideEl) {
            this.currentSlideEl.textContent = String(this.currentIndex + 1).padStart(2, '0');
        }
        if (this.totalSlidesEl) {
            this.totalSlidesEl.textContent = String(this.totalSlides).padStart(2, '0');
        }
    }

    animateSlide(index, direction) {
        const slide = this.slides[index];
        const animationType = this.options.animationType;

        // Remove all animation classes
        slide.classList.remove(
            'fade-in', 'fade-out',
            'slide-left-in', 'slide-left-out',
            'slide-right-in', 'slide-right-out',
            'zoom-in', 'zoom-out'
        );

        // Add appropriate animation class
        if (animationType === 'fade') {
            slide.classList.add(direction === 'in' ? 'fade-in' : 'fade-out');
        } else if (animationType === 'slide') {
            if (direction === 'in') {
                slide.classList.add(this.slideDirection === 'next' ? 'slide-left-in' : 'slide-right-in');
            } else {
                slide.classList.add(this.slideDirection === 'next' ? 'slide-left-out' : 'slide-right-out');
            }
        } else if (animationType === 'zoom') {
            slide.classList.add(direction === 'in' ? 'zoom-in' : 'zoom-out');
        }
    }

    goToSlide(index, direction = 'next') {
        if (index === this.currentIndex) return;

        this.slideDirection = direction;
        
        // Animate out current slide
        this.slides[this.currentIndex].classList.remove('active');
        this.animateSlide(this.currentIndex, 'out');

        // Update index
        this.currentIndex = index;
        if (this.currentIndex >= this.totalSlides) this.currentIndex = 0;
        if (this.currentIndex < 0) this.currentIndex = this.totalSlides - 1;

        // Animate in new slide
        setTimeout(() => {
            this.slides[this.currentIndex].classList.add('active');
            this.animateSlide(this.currentIndex, 'in');
        }, 100);

        // Update UI
        this.updateDots();
        this.updateCounter();
        this.resetProgress();
    }

    nextSlide() {
        const nextIndex = (this.currentIndex + 1) % this.totalSlides;
        this.goToSlide(nextIndex, 'next');
    }

    prevSlide() {
        const prevIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
        this.goToSlide(prevIndex, 'prev');
    }

    startAutoplay() {
        this.stopAutoplay();
        this.isPlaying = true;
        this.updatePausePlayButton();
        this.startProgress();
        
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, this.options.autoplaySpeed);
    }

    stopAutoplay() {
        this.isPlaying = false;
        this.updatePausePlayButton();
        this.stopProgress();
        
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    toggleAutoplay() {
        if (this.isPlaying) {
            this.stopAutoplay();
        } else {
            this.startAutoplay();
        }
    }

    updatePausePlayButton() {
        if (!this.pauseIcon) return;
        
        if (this.isPlaying) {
            this.pauseIcon.className = 'fas fa-pause';
            this.pausePlayBtn?.setAttribute('aria-label', 'Pause slideshow');
        } else {
            this.pauseIcon.className = 'fas fa-play';
            this.pausePlayBtn?.setAttribute('aria-label', 'Play slideshow');
        }
    }

    startProgress() {
        if (!this.options.showProgress || !this.progressBar) return;
        
        this.progress = 0;
        this.progressBar.style.width = '0%';
        
        const increment = 100 / (this.options.autoplaySpeed / 50);
        
        this.progressInterval = setInterval(() => {
            this.progress += increment;
            if (this.progress > 100) this.progress = 100;
            this.progressBar.style.width = `${this.progress}%`;
        }, 50);
    }

    stopProgress() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
    }

    resetProgress() {
        this.stopProgress();
        if (this.isPlaying) {
            this.startProgress();
        }
    }

    handleTouchStart(e) {
        this.touchStartX = e.changedTouches[0].screenX;
    }

    handleTouchEnd(e) {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.stopAutoplay();
                this.nextSlide();
                if (this.options.autoplay) {
                    setTimeout(() => this.startAutoplay(), 1000);
                }
            } else {
                this.stopAutoplay();
                this.prevSlide();
                if (this.options.autoplay) {
                    setTimeout(() => this.startAutoplay(), 1000);
                }
            }
        }
    }

    bindEvents() {
        // Navigation buttons
        this.prevBtn?.addEventListener('click', () => {
            this.stopAutoplay();
            this.prevSlide();
            if (this.options.autoplay) {
                setTimeout(() => this.startAutoplay(), 1000);
            }
        });

        this.nextBtn?.addEventListener('click', () => {
            this.stopAutoplay();
            this.nextSlide();
            if (this.options.autoplay) {
                setTimeout(() => this.startAutoplay(), 1000);
            }
        });

        // Dot navigation
        this.dotsContainer?.addEventListener('click', (e) => {
            const dot = e.target.closest('.slider-dot');
            if (dot) {
                const index = parseInt(dot.dataset.index);
                this.stopAutoplay();
                this.goToSlide(index, index > this.currentIndex ? 'next' : 'prev');
                if (this.options.autoplay) {
                    setTimeout(() => this.startAutoplay(), 1000);
                }
            }
        });

        // Pause/Play button
        this.pausePlayBtn?.addEventListener('click', () => {
            this.toggleAutoplay();
        });

        // Pause on hover
        if (this.options.pauseOnHover) {
            this.heroSection?.addEventListener('mouseenter', () => {
                if (this.isPlaying) {
                    this.stopProgress();
                    clearInterval(this.autoplayInterval);
                }
            });

            this.heroSection?.addEventListener('mouseleave', () => {
                if (this.isPlaying) {
                    this.startAutoplay();
                }
            });
        }

        // Keyboard navigation
        if (this.options.keyboard) {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    this.stopAutoplay();
                    this.prevSlide();
                    if (this.options.autoplay) {
                        setTimeout(() => this.startAutoplay(), 1000);
                    }
                } else if (e.key === 'ArrowRight') {
                    this.stopAutoplay();
                    this.nextSlide();
                    if (this.options.autoplay) {
                        setTimeout(() => this.startAutoplay(), 1000);
                    }
                } else if (e.key === ' ') {
                    e.preventDefault();
                    this.toggleAutoplay();
                }
            });
        }

        // Touch events
        if (this.options.touch) {
            this.heroSection?.addEventListener('touchstart', (e) => {
                this.handleTouchStart(e);
            }, { passive: true });

            this.heroSection?.addEventListener('touchend', (e) => {
                this.handleTouchEnd(e);
            }, { passive: true });
        }

        // Button ripple effect
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                
                ripple.style.width = ripple.style.height = `${size}px`;
                ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
                ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
                
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });

        // Visibility change - pause when tab is hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (this.isPlaying) {
                    this.stopProgress();
                    clearInterval(this.autoplayInterval);
                }
            } else {
                if (this.isPlaying) {
                    this.startAutoplay();
                }
            }
        });
    }
}

// ============================================
// INITIALIZE SLIDER
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize with custom options
    const slider = new HeroSlider({
        autoplay: true,
        autoplaySpeed: 5000,
        animationType: 'fade',
        pauseOnHover: true,
        showDots: true,
        showProgress: true,
        showCounter: true,
        keyboard: true,
        touch: true
    });

    // Make slider accessible globally if needed
    window.heroSlider = slider;
});

// ===================================
// OTHER INITIALIZATIONS
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    initHeroSlider();
    initTestimonialSlider();
    initSmoothScroll();
    initScrollAnimations();
    initCounterAnimation();
    initContactForm();
    initBackToTop();
    initVideoHandler();
});

// ===================================
// Hero Slider (Alternative)
// ===================================
function initHeroSlider() {
    const slides = document.querySelectorAll('#hero-slider .slide');
    const videoContainer = document.querySelector('.hero-video-container');
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    
    if (!slides.length) return;
    
    let current = 0;
    let isTransitioning = false;

    const changeSlide = (index) => {
        if (isTransitioning) return;
        isTransitioning = true;

        slides[current].classList.remove('active');
        current = (index + slides.length) % slides.length;

        setTimeout(() => {
            slides[current].classList.add('active');
            setTimeout(() => { isTransitioning = false; }, 1200);
        }, 50); 
    };

    nextBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        changeSlide(current + 1);
    });

    prevBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        changeSlide(current - 1);
    });

    setInterval(() => {
        if (!isTransitioning) changeSlide(current + 1);
    }, 6000);
}

// ===================================
// Testimonial Slider
// ===================================
function initTestimonialSlider() {
    const items = document.querySelectorAll('.testimonial-item');
    const dotsContainer = document.getElementById('testimonial-dots');
    
    if (!items.length || !dotsContainer) return;
    
    let current = 0;
    
    items.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('testimonial-dot');
        dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => show(i));
        dotsContainer.appendChild(dot);
    });
    
    const dots = dotsContainer.querySelectorAll('.testimonial-dot');
    
    const show = (index) => {
        items[current].classList.remove('active');
        dots[current].classList.remove('active');
        current = (index + items.length) % items.length;
        items[current].classList.add('active');
        dots[current].classList.add('active');
    };
    
    setInterval(() => show(current + 1), 6000);
}

// ===================================
// Smooth Scroll
// ===================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
}

// ===================================
// Scroll Animations
// ===================================
function initScrollAnimations() {
    const elements = document.querySelectorAll('[data-aos]');
    if (!elements.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-aos-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, parseInt(delay));
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    elements.forEach(el => observer.observe(el));
}

// ===================================
// Counter Animation
// ===================================
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;
    
    const animate = (el) => {
        const target = parseInt(el.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const update = () => {
            current += step;
            if (current < target) {
                el.textContent = Math.floor(current);
                requestAnimationFrame(update);
            } else {
                el.textContent = target;
            }
        };
        update();
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animate(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(c => observer.observe(c));
}

// ===================================
// Contact Form
// ===================================
function initContactForm() {
    const form = document.getElementById('contact-form');
    const message = document.getElementById('form-message');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const data = Object.fromEntries(new FormData(form));
        const btn = form.querySelector('button[type="submit"]');
        
        if (!data.name || !data.email || !data.message) {
            showMessage('Please fill in all required fields.', 'error');
            return;
        }
        
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            showMessage('Please enter a valid email address.', 'error');
            return;
        }
        
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
        
        await new Promise(r => setTimeout(r, 1500));
        
        showMessage('Thank you! Your message has been sent successfully.', 'success');
        form.reset();
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
    });
    
    function showMessage(text, type) {
        message.textContent = text;
        message.className = `form-message ${type}`;
        setTimeout(() => {
            message.className = 'form-message';
            message.textContent = '';
        }, 5000);
    }
}

// Newsletter Form
document.getElementById('newsletter-form')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = this.querySelector('button');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
    
    await new Promise(r => setTimeout(r, 1000));
    
    alert('Thank you for subscribing!');
    this.reset();
    btn.disabled = false;
    btn.innerHTML = 'Subscribe';
});

// ===================================
// Back to Top
// ===================================
function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    
    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===================================
// Video Handler
// ===================================
function initVideoHandler() {
    const video = document.getElementById('hero-video');
    if (!video) return;
    
    video.play().catch(() => {
        const container = document.querySelector('.hero-video-container');
        if (container) {
            container.style.background = 'linear-gradient(135deg, #0f172a 0%, #6366f1 100%)';
        }
    });
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            entry.isIntersecting ? video.play().catch(() => {}) : video.pause();
        });
    }, { threshold: 0.25 });
    
    observer.observe(video);
}

// Console branding
console.log('%c 🚀 Amazing WebTech ', 'background: linear-gradient(135deg, #6366f1, #a855f7); color: white; padding: 10px 20px; font-size: 16px; border-radius: 8px; font-weight: bold;');

// ============================================
// CUSTOM CURSOR ANIMATION SYSTEM
// ============================================

class CustomCursor {
    constructor(options = {}) {
        this.options = {
            cursorSize: 8,
            followerSize: 40,
            cursorColor: '#0066cc',
            followerColor: '#0066cc',
            trailEnabled: true,
            trailLength: 8,
            magneticEnabled: true,
            magneticStrength: 0.3,
            glowEnabled: true,
            textCursor: true,
            hoverScale: 1.5,
            clickScale: 0.8,
            speed: 0.15,
            followerSpeed: 0.1,
            ...options
        };

        this.cursor = document.getElementById('cursor');
        this.follower = document.getElementById('cursor-follower');
        this.trail = document.getElementById('cursor-trail');
        this.cursorText = document.getElementById('cursor-text');

        this.mouseX = 0;
        this.mouseY = 0;
        this.cursorX = 0;
        this.cursorY = 0;
        this.followerX = 0;
        this.followerY = 0;
        this.isHovering = false;
        this.isClicking = false;
        this.isHidden = false;
        this.currentElement = null;
        this.trailParticles = [];
        this.lastTrailTime = 0;
        this.rafId = null;

        this.supportsHover = window.matchMedia('(hover: hover)').matches;
        this.isTouchDevice = 'ontouchstart' in window;

        if (this.supportsHover && !this.isTouchDevice) {
            this.init();
        }
    }

    init() {
        this.createGlowElement();
        this.bindEvents();
        this.animate();
        this.setupMagneticElements();
        this.addHoverListeners();
        
        setTimeout(() => {
            if (this.cursor) this.cursor.style.opacity = '1';
            if (this.follower) this.follower.style.opacity = '0.6';
        }, 100);
    }

    createGlowElement() {
        if (!this.options.glowEnabled) return;
        
        this.glow = document.createElement('div');
        this.glow.className = 'cursor-glow';
        document.body.appendChild(this.glow);
    }

    bindEvents() {
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        document.addEventListener('mousedown', () => this.onMouseDown());
        document.addEventListener('mouseup', () => this.onMouseUp());
        document.addEventListener('mouseenter', () => this.showCursor());
        document.addEventListener('mouseleave', () => this.hideCursor());
        document.addEventListener('focusin', (e) => this.onFocusIn(e));
        document.addEventListener('focusout', () => this.onFocusOut());
    }

    onMouseMove(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        
        if (this.options.trailEnabled) {
            this.createTrailParticle(e.clientX, e.clientY);
        }

        this.checkElementUnderCursor(e);
    }

    onMouseDown() {
        this.isClicking = true;
        
        if (this.cursor) this.cursor.classList.add('click');
        if (this.follower) this.follower.classList.add('click');
        
        this.createRipple();
    }

    onMouseUp() {
        this.isClicking = false;
        
        if (this.cursor) this.cursor.classList.remove('click');
        if (this.follower) this.follower.classList.remove('click');
    }

    onFocusIn(e) {
        const target = e.target;
        if (target.matches('a, button, [role="button"], input, textarea, select')) {
            this.setHoverState(true, 'focus');
        }
    }

    onFocusOut() {
        this.setHoverState(false);
    }

    showCursor() {
        this.isHidden = false;
        if (this.cursor) this.cursor.classList.remove('hidden');
        if (this.follower) this.follower.classList.remove('hidden');
    }

    hideCursor() {
        this.isHidden = true;
        if (this.cursor) this.cursor.classList.add('hidden');
        if (this.follower) this.follower.classList.add('hidden');
    }

    checkElementUnderCursor(e) {
        const element = document.elementFromPoint(e.clientX, e.clientY);
        
        if (element !== this.currentElement) {
            this.currentElement = element;
            this.updateCursorForElement(element);
        }
    }

    updateCursorForElement(element) {
        if (!element) return;

        this.resetCursorState();

        const cursorType = element.closest('[data-cursor]')?.dataset.cursor;
        
        if (cursorType) {
            this.handleCustomCursor(cursorType, element);
            return;
        }

        if (element.closest('a, button, [role="button"]')) {
            this.setHoverState(true, 'link');
        } else if (element.closest('input, textarea, select')) {
            this.setTextMode(true);
        } else if (element.closest('.btn')) {
            this.setHoverState(true, 'button');
        } else if (element.closest('[data-magnetic]')) {
            this.setHoverState(true, 'magnetic');
        } else if (element.closest('img, video, .image-wrapper, .card')) {
            this.setHoverState(true, 'media');
        } else {
            this.setHoverState(false);
        }
    }

    handleCustomCursor(type, element) {
        switch (type) {
            case 'view':
                this.showCursorText('View');
                break;
            case 'drag':
                this.showCursorText('Drag');
                break;
            case 'play':
                this.showCursorText('Play');
                break;
            case 'explore':
                this.showCursorText('Explore');
                break;
            case 'link':
                this.showCursorText('Click');
                break;
            case 'zoom':
                this.showCursorText('Zoom');
                break;
            case 'none':
                this.hideCursor();
                break;
            default:
                this.showCursorText(type);
        }
    }

    setHoverState(isHovering, type = 'default') {
        this.isHovering = isHovering;
        
        if (isHovering) {
            if (this.cursor) this.cursor.classList.add('hover');
            if (this.follower) {
                this.follower.classList.add('hover');
                
                switch (type) {
                    case 'link':
                        this.follower.classList.add('link-hover');
                        break;
                    case 'button':
                        this.follower.classList.add('button-hover');
                        break;
                    case 'magnetic':
                        this.follower.classList.add('magnetic');
                        break;
                    case 'media':
                        this.follower.classList.add('hover-large');
                        break;
                }
            }
            
            if (this.glow) this.glow.classList.add('active');
        } else {
            this.resetCursorState();
        }
    }

    setTextMode(isTextMode) {
        if (isTextMode) {
            if (this.cursor) this.cursor.classList.add('text-mode');
            if (this.follower) this.follower.classList.add('text-mode');
        } else {
            if (this.cursor) this.cursor.classList.remove('text-mode');
            if (this.follower) this.follower.classList.remove('text-mode');
        }
    }

    showCursorText(text) {
        if (!this.cursorText || !this.options.textCursor) return;
        
        const textSpan = this.cursorText.querySelector('span');
        if (textSpan) textSpan.textContent = text;
        
        this.cursorText.classList.add('active');
        
        if (this.cursor) this.cursor.classList.add('hover');
        if (this.follower) this.follower.classList.add('hover');
    }

    hideCursorText() {
        if (!this.cursorText) return;
        this.cursorText.classList.remove('active');
    }

    resetCursorState() {
        if (this.cursor) {
            this.cursor.classList.remove('hover', 'text-mode', 'blend', 'stretch');
        }
        if (this.follower) {
            this.follower.classList.remove(
                'hover', 'hover-large', 'link-hover', 
                'button-hover', 'magnetic', 'text-mode', 
                'blend', 'stretch'
            );
        }
        if (this.glow) {
            this.glow.classList.remove('active');
        }
        
        this.hideCursorText();
    }

    createTrailParticle(x, y) {
        const now = Date.now();
        if (now - this.lastTrailTime < 30) return;
        this.lastTrailTime = now;

        const particle = document.createElement('div');
        particle.className = 'trail-particle';
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        document.body.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 800);
    }

    createRipple() {
        const ripple = document.createElement('div');
        ripple.className = 'cursor-ripple';
        ripple.style.left = `${this.mouseX}px`;
        ripple.style.top = `${this.mouseY}px`;
        document.body.appendChild(ripple);

        requestAnimationFrame(() => {
            ripple.classList.add('animate');
        });

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    setupMagneticElements() {
        if (!this.options.magneticEnabled) return;

        const magneticElements = document.querySelectorAll('[data-magnetic]');
        
        magneticElements.forEach(el => {
            el.addEventListener('mousemove', (e) => this.handleMagneticMove(e, el));
            el.addEventListener('mouseleave', () => this.handleMagneticLeave(el));
        });
    }

    handleMagneticMove(e, element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (e.clientX - centerX) * this.options.magneticStrength;
        const deltaY = (e.clientY - centerY) * this.options.magneticStrength;
        
        element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        
        const inner = element.querySelector('span, img, i');
        if (inner) {
            inner.style.transform = `translate(${deltaX * 0.5}px, ${deltaY * 0.5}px)`;
        }
    }

    handleMagneticLeave(element) {
        element.style.transform = '';
        
        const inner = element.querySelector('span, img, i');
        if (inner) {
            inner.style.transform = '';
        }
    }

    addHoverListeners() {
        const interactiveElements = document.querySelectorAll(
            'a, button, [role="button"], input, textarea, select, .btn, [data-cursor], [data-magnetic]'
        );

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => this.updateCursorForElement(el));
            el.addEventListener('mouseleave', () => this.resetCursorState());
        });
    }

    animate() {
        this.cursorX += (this.mouseX - this.cursorX) * this.options.speed;
        this.cursorY += (this.mouseY - this.cursorY) * this.options.speed;
        
        this.followerX += (this.mouseX - this.followerX) * this.options.followerSpeed;
        this.followerY += (this.mouseY - this.followerY) * this.options.followerSpeed;

        if (this.cursor) {
            this.cursor.style.left = `${this.cursorX}px`;
            this.cursor.style.top = `${this.cursorY}px`;
        }

        if (this.follower) {
            this.follower.style.left = `${this.followerX}px`;
            this.follower.style.top = `${this.followerY}px`;
        }

        if (this.trail) {
            this.trail.style.left = `${this.followerX}px`;
            this.trail.style.top = `${this.followerY}px`;
        }

        if (this.cursorText) {
            this.cursorText.style.left = `${this.followerX}px`;
            this.cursorText.style.top = `${this.followerY}px`;
        }

        if (this.glow) {
            this.glow.style.left = `${this.followerX}px`;
            this.glow.style.top = `${this.followerY}px`;
        }

        this.rafId = requestAnimationFrame(() => this.animate());
    }

    setColor(color) {
        document.documentElement.style.setProperty('--cursor-color', color);
        if (this.cursor) this.cursor.style.background = color;
        if (this.follower) this.follower.style.borderColor = color;
    }

    setLoading(isLoading) {
        if (isLoading) {
            if (this.cursor) this.cursor.classList.add('loading');
            if (this.follower) this.follower.classList.add('loading');
        } else {
            if (this.cursor) this.cursor.classList.remove('loading');
            if (this.follower) this.follower.classList.remove('loading');
        }
    }

    destroy() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
        
        if (this.glow) {
            this.glow.remove();
        }
        
        document.querySelectorAll('.trail-particle, .cursor-ripple').forEach(el => el.remove());
    }

    refresh() {
        this.setupMagneticElements();
        this.addHoverListeners();
    }
}

// ============================================
// CURSOR SPARKLE EFFECT
// ============================================

class CursorSparkle {
    constructor() {
        this.sparkles = [];
        this.maxSparkles = 30;
        this.colors = ['#0066cc', '#00a8e8', '#00d4ff', '#ffffff'];
        
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => this.createSparkle(e));
    }

    createSparkle(e) {
        if (this.sparkles.length >= this.maxSparkles) return;
        if (Math.random() > 0.3) return;

        const sparkle = document.createElement('div');
        sparkle.className = 'cursor-sparkle';
        sparkle.style.cssText = `
            position: fixed;
            width: ${Math.random() * 6 + 2}px;
            height: ${Math.random() * 6 + 2}px;
            background: ${this.colors[Math.floor(Math.random() * this.colors.length)]};
            border-radius: 50%;
            pointer-events: none;
            z-index: 99995;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            transform: translate(-50%, -50%);
            animation: sparkleFade 0.8s ease-out forwards;
        `;
        
        document.body.appendChild(sparkle);
        this.sparkles.push(sparkle);

        setTimeout(() => {
            sparkle.remove();
            this.sparkles = this.sparkles.filter(s => s !== sparkle);
        }, 800);
    }
}

// Add sparkle animation CSS dynamically
const sparkleStyles = document.createElement('style');
sparkleStyles.textContent = `
    @keyframes sparkleFade {
        0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -50%) translateY(-20px) scale(0);
        }
    }
`;
document.head.appendChild(sparkleStyles);

// ============================================
// CURSOR SPOTLIGHT EFFECT
// ============================================

class CursorSpotlight {
    constructor(options = {}) {
        this.options = {
            size: 300,
            opacity: 0.1,
            color: '0, 102, 204',
            ...options
        };

        this.spotlight = null;
        this.init();
    }

    init() {
        this.createSpotlight();
        this.bindEvents();
    }

    createSpotlight() {
        this.spotlight = document.createElement('div');
        this.spotlight.className = 'cursor-spotlight';
        this.spotlight.style.cssText = `
            position: fixed;
            width: ${this.options.size}px;
            height: ${this.options.size}px;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1;
            background: radial-gradient(
                circle,
                rgba(${this.options.color}, ${this.options.opacity}) 0%,
                rgba(${this.options.color}, 0.05) 40%,
                transparent 70%
            );
            transform: translate(-50%, -50%);
            transition: opacity 0.3s ease;
            opacity: 0;
        `;
        document.body.appendChild(this.spotlight);
    }

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.spotlight.style.left = `${e.clientX}px`;
            this.spotlight.style.top = `${e.clientY}px`;
        });

        document.addEventListener('mouseenter', () => {
            this.spotlight.style.opacity = '1';
        });

        document.addEventListener('mouseleave', () => {
            this.spotlight.style.opacity = '0';
        });
    }

    destroy() {
        if (this.spotlight) {
            this.spotlight.remove();
        }
    }
}

// ============================================
// INITIALIZE CURSOR EFFECTS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const supportsHover = window.matchMedia('(hover: hover)').matches;
    const isTouchDevice = 'ontouchstart' in window;

    if (supportsHover && !isTouchDevice) {
        window.customCursor = new CustomCursor({
            trailEnabled: true,
            magneticEnabled: true,
            glowEnabled: true,
            textCursor: true,
            speed: 0.2,
            followerSpeed: 0.1
        });

        console.log('Custom cursor initialized');
    }
});

// Refresh cursor on dynamic content
function refreshCursor() {
    if (window.customCursor) {
        window.customCursor.refresh();
    }
}