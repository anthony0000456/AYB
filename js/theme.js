// Gerenciamento de Tema
const themeManager = {
    init() {
        this.setupThemeToggle();
        this.setupSystemThemeListener();
        this.loadUserPreference();
    },

    setupThemeToggle() {
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = `
            <i class="fas fa-sun light-icon"></i>
            <i class="fas fa-moon dark-icon"></i>
            <span class="visually-hidden">Alternar tema</span>
        `;
        
        themeToggle.addEventListener('click', () => this.toggleTheme());
        document.body.appendChild(themeToggle);
    },

    setupSystemThemeListener() {
        window.matchMedia('(prefers-color-scheme: dark)').addListener(e => {
            if (!localStorage.getItem('theme')) {
                document.documentElement.classList.toggle('dark-theme', e.matches);
            }
        });
    },

    loadUserPreference() {
        const userTheme = localStorage.getItem('theme');
        if (userTheme) {
            document.documentElement.classList.toggle('dark-theme', userTheme === 'dark');
        } else {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.classList.toggle('dark-theme', systemPrefersDark);
        }
    },

    toggleTheme() {
        const isDark = document.documentElement.classList.toggle('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // Atualizar meta theme-color
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.content = isDark ? '#1A1614' : '#93765A';
        }
    }
};

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