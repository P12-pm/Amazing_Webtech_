/**
 * Mobile Navigation Handler
 * Complete solution for mobile menu functionality
 */

(function() {
    'use strict';

    // DOM Elements
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const closeMenu = document.getElementById('closeMenu');
    const overlay = document.getElementById('navOverlay');
    const dropdowns = document.querySelectorAll('.dropdown');
    const body = document.body;

    // Check if all elements exist
    if (!navbar || !menuToggle || !navLinks) {
        console.warn('Navbar elements not found');
        return;
    }

    /**
     * Open Mobile Menu
     */
    function openMenu() {
        menuToggle.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
        navLinks.classList.add('active');
        if (overlay) overlay.classList.add('active');
        body.classList.add('menu-open');
        
        // Prevent scroll
        body.style.overflow = 'hidden';
        body.style.position = 'fixed';
        body.style.width = '100%';
        body.style.top = `-${window.scrollY}px`;
    }

    /**
     * Close Mobile Menu
     */
    function closeMenuHandler() {
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        body.classList.remove('menu-open');
        
        // Restore scroll
        const scrollY = body.style.top;
        body.style.overflow = '';
        body.style.position = '';
        body.style.width = '';
        body.style.top = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
        
        // Close all dropdowns
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }

    /**
     * Toggle Mobile Menu
     */
    function toggleMenu() {
        if (navLinks.classList.contains('active')) {
            closeMenuHandler();
        } else {
            openMenu();
        }
    }

    /**
     * Handle Dropdown Toggle (Mobile)
     */
    function handleDropdown(e) {
        // Only on mobile
        if (window.innerWidth > 991) return;
        
        const dropdown = e.currentTarget.closest('.dropdown');
        const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
        
        // If clicked on the toggle or icon
        if (e.target.closest('.dropdown-toggle')) {
            e.preventDefault();
            e.stopPropagation();
            
            // Close other dropdowns
            dropdowns.forEach(d => {
                if (d !== dropdown) {
                    d.classList.remove('active');
                }
            });
            
            // Toggle current dropdown
            dropdown.classList.toggle('active');
        }
    }

    /**
     * Handle Scroll - Add/Remove scrolled class
     */
    function handleScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    /**
     * Handle Window Resize
     */
    function handleResize() {
        if (window.innerWidth > 991) {
            closeMenuHandler();
        }
    }

    /**
     * Handle Escape Key
     */
    function handleEscape(e) {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMenuHandler();
        }
    }

    /**
     * Handle Click Outside
     */
    function handleClickOutside(e) {
        if (window.innerWidth > 991) {
            // Close dropdown when clicking outside on desktop
            if (!e.target.closest('.dropdown')) {
                dropdowns.forEach(d => d.classList.remove('active'));
            }
        }
    }

    /**
     * Smooth scroll to sections
     */
    function handleNavClick(e) {
        const link = e.target.closest('a');
        if (!link) return;
        
        const href = link.getAttribute('href');
        
        // If it's an anchor link
        if (href && href.startsWith('#') && href !== '#') {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                closeMenuHandler();
                
                setTimeout(() => {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 300);
            }
        }
        // If it's a page link (not dropdown toggle)
        else if (href && !link.classList.contains('dropdown-toggle')) {
            closeMenuHandler();
        }
    }

    // Event Listeners
    menuToggle.addEventListener('click', toggleMenu);
    
    if (closeMenu) {
        closeMenu.addEventListener('click', closeMenuHandler);
    }
    
    if (overlay) {
        overlay.addEventListener('click', closeMenuHandler);
    }
    
    // Dropdown handlers
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', handleDropdown);
    });
    
    // Navigation link clicks
    navLinks.addEventListener('click', handleNavClick);
    
    // Scroll handler
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Resize handler
    window.addEventListener('resize', handleResize);
    
    // Keyboard handler
    document.addEventListener('keydown', handleEscape);
    
    // Click outside handler
    document.addEventListener('click', handleClickOutside);
    
    // Touch events for better mobile experience
    let touchStartX = 0;
    let touchEndX = 0;
    
    navLinks.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    navLinks.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;
        
        // Swipe right to close
        if (swipeDistance > swipeThreshold && navLinks.classList.contains('active')) {
            closeMenuHandler();
        }
    }
    
    // Initial scroll check
    handleScroll();
    
    // Accessibility - Focus trap
    function trapFocus(e) {
        if (!navLinks.classList.contains('active')) return;
        
        const focusableElements = navLinks.querySelectorAll(
            'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }
    
    navLinks.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            trapFocus(e);
        }
    });

})();
