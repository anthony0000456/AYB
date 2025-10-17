// Funções da Landing Page
document.addEventListener('DOMContentLoaded', function() {
    initScarcityTimer();
    initScrollAnimation();
    initVideoPlayers();
    initTestimonialSlider();
    initFAQ();
    initCTAButtons();
});

// Timer de Escassez
function initScarcityTimer() {
    // Data final (ajuste conforme necessário)
    const endDate = new Date('2025-10-31T23:59:59').getTime();

    function updateTimer() {
        const now = new Date().getTime();
        const distance = endDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('timer-days').textContent = days.toString().padStart(2, '0');
        document.getElementById('timer-hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('timer-minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('timer-seconds').textContent = seconds.toString().padStart(2, '0');

        if (distance < 0) {
            clearInterval(timerInterval);
            document.querySelector('.scarcity-timer').innerHTML = 'Oferta Encerrada!';
        }
    }

    const timerInterval = setInterval(updateTimer, 1000);
    updateTimer();
}

// Animação de Scroll
function initScrollAnimation() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    elements.forEach(element => observer.observe(element));
}

// Players de Vídeo
function initVideoPlayers() {
    const videoButtons = document.querySelectorAll('.play-button');
    const overlay = document.querySelector('.depoimentos-overlay');
    const modalContainer = overlay ? overlay.querySelector('.video-container') : null;
    const closeBtn = overlay ? overlay.querySelector('.close-modal') : null;

    function openVideoModal(videoId) {
        if (!overlay || !modalContainer) return false;

        // Evita autoplay agressivo em dispositivos móveis
        const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768;
        const autoplay = isMobile ? 0 : 1;

        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0&showinfo=0&autoplay=${autoplay}`;
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        iframe.setAttribute('allowfullscreen', '');
        iframe.width = '100%';
        iframe.height = '100%';

        // Limpa e insere iframe no modal
        modalContainer.innerHTML = '';
        modalContainer.appendChild(iframe);

        overlay.classList.add('active');
        // Evita scroll de fundo
        document.body.style.overflow = 'hidden';
        // foco acessível
        if (closeBtn) closeBtn.focus();
        return true;
    }

    function closeVideoModal() {
        if (!overlay || !modalContainer) return;
        overlay.classList.remove('active');
        // Remove iframe para parar o vídeo
        modalContainer.innerHTML = '';
        document.body.style.overflow = '';
    }

    videoButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const videoId = this.dataset.videoId;
            // Tenta abrir no modal, se não existir faz o fallback in-place
            const opened = openVideoModal(videoId);
            if (!opened) {
                const videoContainer = this.closest('.video-wrapper');
                if (!videoContainer) return;
                const iframe = document.createElement('iframe');
                iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0&showinfo=0&autoplay=1`;
                iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
                iframe.setAttribute('allowfullscreen', '');
                videoContainer.innerHTML = '';
                videoContainer.appendChild(iframe);
            }
        });
    });

    // Handlers de fechamento do modal
    if (closeBtn) closeBtn.addEventListener('click', closeVideoModal);
    if (overlay) overlay.addEventListener('click', function(e) {
        if (e.target === overlay) closeVideoModal();
    });
    // Fechar com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeVideoModal();
        }
    });
}

// Slider de Depoimentos
function initTestimonialSlider() {
    const slider = document.querySelector('.testimonial-slider');
    if (!slider) return;

    let currentSlide = 0;
    const slides = slider.querySelectorAll('.testimonial-card');
    const totalSlides = slides.length;

    function updateSlider() {
        const offset = currentSlide * -100;
        slider.style.transform = `translateX(${offset}%)`;
    }

    const nextBtn = document.querySelector('.slider-next');
    const prevBtn = document.querySelector('.slider-prev');

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlider();
        });
    }

    // Auto-play
    setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    }, 5000);
}

// FAQ Accordion
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Fecha todos os itens
            faqItems.forEach(faqItem => faqItem.classList.remove('active'));
            
            // Abre o item clicado
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Botões CTA
function initCTAButtons() {
    const ctaButtons = document.querySelectorAll('[data-scroll-to]');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = button.dataset.scrollTo;
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Notificação de Urgência
function showUrgencyNotification() {
    const notifications = [
        "🔥 Últimas 3 vagas disponíveis!",
        "⚡ 5 pessoas se inscreveram nos últimos 30 minutos",
        "🎓 Turma quase lotada - Garanta sua vaga!"
    ];

    const container = document.createElement('div');
    container.className = 'urgency-notification animate';
    
    const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
    container.textContent = randomNotification;
    
    document.body.appendChild(container);
    
    setTimeout(() => {
        container.remove();
    }, 5000);
}

// Mostrar notificações aleatoriamente
setInterval(showUrgencyNotification, 30000);