// Gerenciamento de Tema (sistema aprimorado)
const themeManager = (function () {
    const STORAGE_KEY = 'theme-preference';
    const TRANSITION_DURATION = 300;
    let initialized = false;

    function createToggleIfMissing() {
        if (document.querySelector('.theme-toggle')) {
            return document.querySelector('.theme-toggle');
        }

        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.type = 'button';
        themeToggle.setAttribute('aria-label', 'Alternar tema');
        themeToggle.innerHTML = `
            <i class="fas fa-sun light-icon" aria-hidden="true"></i>
            <i class="fas fa-moon dark-icon" aria-hidden="true"></i>
            <span class="visually-hidden">Alternar tema</span>
        `;

        const header = document.querySelector('.header');
        if (header) header.appendChild(themeToggle);
        else document.body.appendChild(themeToggle);

        themeToggle.addEventListener('click', () => toggleTheme());
        return themeToggle;
    }

    function updateMetaThemeColor(theme) {
        const colors = {
            dark: '#1A1614',
            light: '#93765A'
        };

        document.querySelectorAll('meta[name="theme-color"]').forEach(meta => {
            meta.setAttribute('content', colors[theme] || colors.light);
        });
    }

    function updateThemeToggle(theme) {
        const toggle = document.querySelector('.theme-toggle');
        if (!toggle) return;

        const isDark = theme === 'dark';
        toggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
        toggle.setAttribute('title', `Mudar para tema ${isDark ? 'claro' : 'escuro'}`);
        
        // Update ARIA label for better accessibility
        toggle.setAttribute('aria-label', `Alternar para tema ${isDark ? 'claro' : 'escuro'}`);
    }

    function setThemeWithTransition(theme) {
        // Prevent transition flash by adding class before change
        document.documentElement.classList.add('no-transitions');
        
        // Set theme
        document.documentElement.setAttribute('data-theme', theme);
        updateMetaThemeColor(theme);
        updateThemeToggle(theme);

        // Remove transition blocker after a short delay
        requestAnimationFrame(() => {
            document.documentElement.classList.remove('no-transitions');
        });
    }

    function applyTheme(theme, persist = false) {
        // Validate theme
        if (theme !== 'dark' && theme !== 'light') {
            console.warn(`Invalid theme: ${theme}. Defaulting to light.`);
            theme = 'light';
        }

        setThemeWithTransition(theme);

        if (persist) {
            try {
                localStorage.setItem(STORAGE_KEY, theme);
            } catch (e) {
                console.warn('Failed to save theme preference:', e);
            }
        }
    }

    function getPreferredTheme() {
        // Check stored preference
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored === 'light' || stored === 'dark') return stored;
        } catch (e) {
            console.warn('Failed to read theme preference:', e);
        }

        // Check system preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }

        return 'light';
    }

    function handleSystemThemeChange(e) {
        // Only react to system changes if no user preference is stored
        try {
            if (!localStorage.getItem(STORAGE_KEY)) {
                applyTheme(e.matches ? 'dark' : 'light', false);
            }
        } catch (e) {
            console.warn('Failed to handle system theme change:', e);
        }
    }

    function toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next, true);
    }

    return {
        init() {
            if (initialized) return;
            initialized = true;

            // Prevent FOUC by setting initial theme before page load
            const initialTheme = getPreferredTheme();
            document.documentElement.setAttribute('data-theme', initialTheme);

            // Setup complete theme system after DOM is ready
            document.addEventListener('DOMContentLoaded', () => {
                createToggleIfMissing();
                applyTheme(initialTheme, false);

                // Listen for system theme changes
                const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                if (mediaQuery?.addEventListener) {
                    mediaQuery.addEventListener('change', handleSystemThemeChange);
                } else if (mediaQuery?.addListener) {
                    mediaQuery.addListener(handleSystemThemeChange);
                }
            });
        },
        applyTheme,
        toggleTheme,
        getPreferredTheme
    };
})();

// Initialize theme system
themeManager.init();

// Responsividade Avançada
const responsiveManager = {
    init() {
        this.setupResponsiveImages();
        this.setupLazyLoading();
        this.setupResponsiveMenu();
        this.setupScrollAnimations();
    },

    setupResponsiveImages() {
        const images = document.querySelectorAll('img[data-srcset]');
        images.forEach(img => {
            const loadImage = () => {
                if (img.dataset.srcset) {
                    img.srcset = img.dataset.srcset;
                }
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
            };
            
            if ('loading' in HTMLImageElement.prototype) {
                img.loading = 'lazy';
                loadImage();
            } else {
                // Fallback para navegadores antigos
                const observer = new IntersectionObserver(entries => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            loadImage();
                            observer.unobserve(entry.target);
                        }
                    });
                });
                observer.observe(img);
            }
        });
    },

    setupLazyLoading() {
        const lazyElements = document.querySelectorAll('[data-lazy]');
        const lazyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('loaded');
                    if (entry.target.dataset.src) {
                        entry.target.src = entry.target.dataset.src;
                    }
                    lazyObserver.unobserve(entry.target);
                }
            });
        }, { rootMargin: '50px' });

        lazyElements.forEach(element => lazyObserver.observe(element));
    },

    setupResponsiveMenu() {
        const menuButton = document.querySelector('.menu-mobile');
        const navList = document.querySelector('.nav-list');
        
        if (menuButton && navList) {
            menuButton.addEventListener('click', () => {
                menuButton.classList.toggle('active');
                navList.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            });

            // Fechar menu ao clicar em links
            navList.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    menuButton.classList.remove('active');
                    navList.classList.remove('active');
                    document.body.classList.remove('menu-open');
                });
            });

            // Fechar menu ao redimensionar para desktop
            window.addEventListener('resize', () => {
                if (window.innerWidth > 768) {
                    menuButton.classList.remove('active');
                    navList.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            });
        }
    },

    setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    // Opcional: remover o observer após a animação
                    // animationObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        animatedElements.forEach(element => {
            animationObserver.observe(element);
            // Adicionar delay baseado no índice para efeito cascata
            element.style.setProperty('--animation-delay', `${element.dataset.delay || '0'}ms`);
        });
    }
};

// Performance
const performanceManager = {
    init() {
        this.deferNonCriticalStyles();
        this.setupPerformanceMetrics();
    },

    deferNonCriticalStyles() {
        document.querySelectorAll('link[data-defer]').forEach(link => {
            link.media = 'print';
            link.onload = () => { link.media = 'all' };
        });
    },

    setupPerformanceMetrics() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                const metrics = performance.getEntriesByType('navigation')[0];
                console.log('Performance metrics:', {
                    loadTime: metrics.loadEventEnd - metrics.loadEventStart,
                    domContentLoaded: metrics.domContentLoadedEventEnd - metrics.domContentLoadedEventStart,
                    firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime
                });
            });
        }
    }
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    themeManager.init();
    responsiveManager.init();
    performanceManager.init();
});