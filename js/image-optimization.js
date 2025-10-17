// Image optimization and lazy loading
(function() {
    // IntersectionObserver for lazy loading
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                loadImage(img);
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.01
    });

    function loadImage(img) {
        const src = img.dataset.src;
        if (!src) return;

        // Start loading the image
        img.src = src;
        img.classList.add('loading');

        // Handle load completion
        img.onload = () => {
            img.classList.remove('loading');
            img.classList.add('loaded');
            img.removeAttribute('data-src');
        };

        // Handle load errors
        img.onerror = () => {
            img.classList.remove('loading');
            img.classList.add('error');
            console.warn(`Failed to load image: ${src}`);
        };
    }

    // Setup responsive images with srcset
    function setupResponsiveImage(img) {
        const basePath = img.dataset.src?.replace(/\.[^/.]+$/, '');
        if (!basePath) return;

        // Generate srcset for different sizes
        const sizes = [300, 600, 900, 1200, 1800];
        const srcset = sizes
            .map(size => `${basePath}-${size}.webp ${size}w`)
            .join(', ');

        // Set srcset and sizes
        img.srcset = srcset;
        img.sizes = img.dataset.sizes || '(max-width: 768px) 100vw, 50vw';

        // Fallback for browsers that don't support webp
        const fallbackSrc = img.dataset.src;
        if (fallbackSrc) {
            const fallbackImg = new Image();
            fallbackImg.src = fallbackSrc;
            fallbackImg.onerror = () => {
                img.src = fallbackSrc;
            };
        }
    }

    // Initialize lazy loading
    function initLazyLoading() {
        document.querySelectorAll('img[data-src]').forEach(img => {
            if ('loading' in HTMLImageElement.prototype) {
                // Browser supports native lazy loading
                img.loading = 'lazy';
                setupResponsiveImage(img);
                loadImage(img);
            } else {
                // Use IntersectionObserver as fallback
                imageObserver.observe(img);
            }
        });
    }

    // Initialize background image lazy loading
    function initBackgroundLazy() {
        document.querySelectorAll('[data-background]').forEach(el => {
            const loadBackground = () => {
                const url = el.dataset.background;
                if (!url) return;

                const img = new Image();
                img.onload = () => {
                    el.style.backgroundImage = `url(${url})`;
                    el.classList.add('background-loaded');
                };
                img.src = url;
            };

            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver(
                    ([entry]) => {
                        if (entry.isIntersecting) {
                            loadBackground();
                            observer.unobserve(el);
                        }
                    },
                    { rootMargin: '50px' }
                );
                observer.observe(el);
            } else {
                // Fallback for older browsers
                loadBackground();
            }
        });
    }

    // Initialize when DOM is ready
    function init() {
        initLazyLoading();
        initBackgroundLazy();

        // Reinitialize on dynamic content changes
        const observer = new MutationObserver((mutations) => {
            let shouldReinit = false;
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length) {
                    shouldReinit = true;
                }
            });
            if (shouldReinit) {
                initLazyLoading();
                initBackgroundLazy();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();