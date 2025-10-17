// Gerenciador do menu móvel
export class MobileMenuManager {
    constructor() {
        this.menuButton = document.querySelector('.menu-mobile');
        this.navList = document.querySelector('.nav-list');
        this.navLinks = document.querySelectorAll('.nav-list li a');
        this.isOpen = false;
        this.touchStartY = 0;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Toggle menu
        this.menuButton?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.navList.contains(e.target) && !this.menuButton.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Handle link clicks
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Handle touch events for swipe
        if (this.navList) {
            this.navList.addEventListener('touchstart', (e) => {
                this.touchStartY = e.touches[0].clientY;
            }, { passive: true });

            this.navList.addEventListener('touchmove', (e) => {
                if (!this.isOpen) return;
                
                const touchY = e.touches[0].clientY;
                const deltaY = touchY - this.touchStartY;

                // If swiping down, prevent default scroll and handle swipe
                if (deltaY > 50) {
                    e.preventDefault();
                    this.closeMenu();
                }
            }, { passive: false });
        }

        // Handle orientation change
        window.addEventListener('orientationchange', () => {
            if (this.isOpen) {
                // Wait for orientation change to complete
                setTimeout(() => this.adjustMenuPosition(), 100);
            }
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });

        // Handle scroll lock
        this.setupScrollLock();
    }

    setupScrollLock() {
        // Store initial body style
        const originalStyle = window.getComputedStyle(document.body).overflow;
        
        // Observe menu state
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.target.classList.contains('active')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = originalStyle;
                }
            });
        });

        // Start observing
        if (this.navList) {
            observer.observe(this.navList, { 
                attributes: true, 
                attributeFilter: ['class'] 
            });
        }
    }

    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.menuButton?.classList.add('active');
        this.navList?.classList.add('active');
        document.body.classList.add('menu-open');
        this.isOpen = true;

        // Announce menu state for screen readers
        this.announceMenuState('Menu aberto');
    }

    closeMenu() {
        this.menuButton?.classList.remove('active');
        this.navList?.classList.remove('active');
        document.body.classList.remove('menu-open');
        this.isOpen = false;

        // Announce menu state for screen readers
        this.announceMenuState('Menu fechado');
    }

    adjustMenuPosition() {
        if (!this.navList) return;
        
        // Get viewport dimensions
        const vh = window.innerHeight;
        const menuHeight = this.navList.offsetHeight;

        // Adjust menu position if it's taller than viewport
        if (menuHeight > vh) {
            this.navList.style.maxHeight = `${vh - 60}px`; // 60px for header
            this.navList.style.overflowY = 'auto';
        } else {
            this.navList.style.maxHeight = '';
            this.navList.style.overflowY = '';
        }
    }

    announceMenuState(message) {
        // Create or get existing live region
        let liveRegion = document.getElementById('menu-announce');
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'menu-announce';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('class', 'sr-only');
            document.body.appendChild(liveRegion);
        }
        
        // Update announcement
        liveRegion.textContent = message;
    }
}