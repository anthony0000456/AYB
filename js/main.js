import { ScrollManager } from './modules/scroll-manager.js';
import { MobileMenuManager } from './modules/mobile-menu.js';
import { FAQManager } from './modules/faq-manager.js';

document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM
    const header = document.querySelector('.header');

    // Prevenir FOUC (Flash of Unstyled Content)
    document.documentElement.style.visibility = 'visible';

    // Inicializar gerenciadores
    const scrollManager = new ScrollManager();
    const mobileMenu = new MobileMenuManager();
    const faqManager = new FAQManager();

    // Scroll suave com gerenciador
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                scrollManager.smoothScrollTo(target, 80);
            }
        });
    });

    // Header scroll behavior
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Adicionar classe scrolled ao header
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Esconder/mostrar header no scroll
        if (currentScroll > lastScroll && currentScroll > 200) {
            header.classList.add('header-hidden');
        } else {
            header.classList.remove('header-hidden');
        }

        lastScroll = currentScroll;
    });

    // Animações ao scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight * 0.8 && elementBottom > 0) {
                element.classList.add('animate');
            }
        });
    };

    // Iniciar animações
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Primeira execução
});