   const navbar = document.getElementById('navbar');
        const menuToggle = document.getElementById('menuToggle');
        const navLinks = document.getElementById('navLinks');
        const overlay = document.getElementById('overlay');
        const closeMenu = document.getElementById('closeMenu');
        const serviceDropdown = document.getElementById('serviceDropdown');
        const dropdownToggle = serviceDropdown.querySelector('.dropdown-toggle');

        // Scroll Effect - Change Logo
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Function to close mobile menu
        function closeMobileMenu() {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Function to open mobile menu
        function openMobileMenu() {
            menuToggle.classList.add('active');
            navLinks.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        // Mobile Menu Toggle
        menuToggle.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        // Close menu button
        closeMenu.addEventListener('click', closeMobileMenu);

        // Close menu when clicking overlay
        overlay.addEventListener('click', closeMobileMenu);

        // Service Dropdown Toggle for Mobile
        dropdownToggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 992) {
                e.preventDefault();
                e.stopPropagation();
                serviceDropdown.classList.toggle('active');
            }
        });

        // Close dropdown when clicking on dropdown items (mobile)
        const dropdownItems = serviceDropdown.querySelectorAll('.dropdown-menu a');
        dropdownItems.forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth <= 992) {
                    closeMobileMenu();
                    serviceDropdown.classList.remove('active');
                }
            });
        });

        // Close mobile menu when clicking on nav links (except dropdown toggle)
        const navLinkItems = navLinks.querySelectorAll('li > a:not(.dropdown-toggle)');
        navLinkItems.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 992) {
                    closeMobileMenu();
                }
            });
        });

        // Close mobile menu on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 992) {
                closeMobileMenu();
                serviceDropdown.classList.remove('active');
            }
        });

        // Prevent body scroll when menu is open
        navLinks.addEventListener('touchmove', (e) => {
            e.stopPropagation();
        }, { passive: true });
       
    // Scroll effect
    const handleScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    // Mobile menu toggle
    const toggleMenu = (open) => {
        const isOpen = open ?? !menu.classList.contains('active');
        toggle.classList.toggle('active', isOpen);
        menu.classList.toggle('active', isOpen);
        overlay.classList.toggle('active', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
        toggle.setAttribute('aria-expanded', isOpen);
    };
    
    toggle?.addEventListener('click', () => toggleMenu());
    overlay?.addEventListener('click', () => toggleMenu(false));
    
    // Close menu on link click
    links.forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu(false);
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
    
    // ESC key closes menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('active')) {
            toggleMenu(false);
        }
    });
    
    // Update active link on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        document.querySelectorAll('section[id]').forEach(section => {
            const top = section.offsetTop - 150;
            if (window.scrollY >= top) {
                current = section.getAttribute('id');
            }
        });
        
        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }, { passive: true });
