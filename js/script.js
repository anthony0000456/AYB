document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM
    const header = document.querySelector('.header');
    const menuMobile = document.querySelector('.menu-mobile');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-list li a');

    // Toggle menu mobile
    if (menuMobile && navList) {
        menuMobile.addEventListener('click', () => {
            menuMobile.classList.toggle('active');
            navList.classList.toggle('active');
        });
    }

    // Fechar menu ao clicar em um link
    if (navLinks && navLinks.length) {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuMobile?.classList.remove('active');
                navList?.classList.remove('active');
            });
        });
    }

    // Scroll suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header sticky com aparecimento suave
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (!header) return;

        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }

        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            // Scroll down
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            // Scroll up
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });

    // Animação de elementos ao scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.observe(element);
    });
});