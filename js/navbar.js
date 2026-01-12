document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const closeMenu = document.getElementById('closeMenu');
    const overlay = document.getElementById('overlay');
    const serviceDropdown = document.getElementById('serviceDropdown');
    const dropdownToggle = serviceDropdown.querySelector('.dropdown-toggle');

    // Scroll Effect for Navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Open Mobile Menu
    menuToggle.addEventListener('click', function() {
        navLinks.classList.add('active');
        overlay.classList.add('active');
        menuToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Close Mobile Menu Function
    function closeMobileMenu() {
        navLinks.classList.remove('active');
        overlay.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.style.overflow = '';
        // Also close dropdown when menu closes
        serviceDropdown.classList.remove('active');
    }

    // Close Menu Button
    closeMenu.addEventListener('click', closeMobileMenu);

    // Close on Overlay Click
    overlay.addEventListener('click', closeMobileMenu);

    // Mobile Dropdown Toggle
    dropdownToggle.addEventListener('click', function(e) {
        // Only toggle on mobile
        if (window.innerWidth <= 992) {
            e.preventDefault();
            e.stopPropagation();
            serviceDropdown.classList.toggle('active');
        }
    });

    // Close menu when clicking nav links (except dropdown toggle)
    navLinks.querySelectorAll('a:not(.dropdown-toggle)').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 992) {
                closeMobileMenu();
            }
        });
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992) {
            closeMobileMenu();
        }
    });

    // Close dropdown when clicking outside (Desktop)
    document.addEventListener('click', function(e) {
        if (window.innerWidth > 992) {
            if (!serviceDropdown.contains(e.target)) {
                serviceDropdown.classList.remove('active');
            }
        }
    });

    // Escape key to close menu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });
});