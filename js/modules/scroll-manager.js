// Gerenciador de scroll e navegação
export class ScrollManager {
    constructor() {
        this.scrollPositions = new Map();
        this.setupScrollRestoration();
    }

    setupScrollRestoration() {
        if ('scrollRestoration' in history) {
            // Disable automatic scroll restoration
            history.scrollRestoration = 'manual';
        }

        // Save scroll position before unload
        window.addEventListener('beforeunload', () => {
            this.saveScrollPosition(window.location.pathname, window.scrollY);
        });

        // Restore scroll position on load
        window.addEventListener('load', () => {
            const savedPosition = this.getScrollPosition(window.location.pathname);
            if (savedPosition) {
                window.scrollTo(0, savedPosition);
            }
        });

        // Handle back/forward navigation
        window.addEventListener('popstate', () => {
            const savedPosition = this.getScrollPosition(window.location.pathname);
            if (savedPosition) {
                window.scrollTo(0, savedPosition);
            }
        });
    }

    saveScrollPosition(path, position) {
        this.scrollPositions.set(path, position);
        // Also save to sessionStorage for persistence
        try {
            sessionStorage.setItem(`scroll_${path}`, position);
        } catch (e) {
            console.warn('Failed to save scroll position to sessionStorage:', e);
        }
    }

    getScrollPosition(path) {
        // Try to get from memory first
        if (this.scrollPositions.has(path)) {
            return this.scrollPositions.get(path);
        }
        // Fall back to sessionStorage
        try {
            const saved = sessionStorage.getItem(`scroll_${path}`);
            return saved ? parseInt(saved, 10) : null;
        } catch (e) {
            console.warn('Failed to get scroll position from sessionStorage:', e);
            return null;
        }
    }

    smoothScrollTo(element, offset = 0) {
        if (!element) return;
        
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        // Check if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        window.scrollTo({
            top: offsetPosition,
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
    }
}