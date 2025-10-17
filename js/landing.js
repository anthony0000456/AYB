// Funções da Landing Page
document.addEventListener('DOMContentLoaded', function() {
    initScarcityTimer();
    initScrollAnimation();
    initVideoPlayers();
    initTestimonialSlider();
    initFAQ();
    initCTAButtons();
});

// Timer de Escassez com fallback e validação
function initScarcityTimer() {
    // Configuração do timer com fallback
    const defaultEndDate = new Date();
    defaultEndDate.setDate(defaultEndDate.getDate() + 7); // 7 dias por padrão
    
    const endDateStr = document.querySelector('.scarcity-timer')?.dataset.endDate || defaultEndDate.toISOString();
    const endDate = new Date(endDateStr).getTime();
    let timerInterval = null;

    function showAlternativeCTA() {
        const container = document.querySelector('.scarcity-timer');
        if (!container) return;
        
        container.innerHTML = `
            <div class="timer-ended">
                <p class="timer-ended-message">Nova turma em breve!</p>
                <a href="#investimento" class="cta-button">
                    <span>Entre na lista de espera</span>
                    <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        `;
        
        // Adiciona classe para animação
        container.classList.add('timer-ended-state');
    }

    function updateTimer() {
        const now = new Date().getTime();
        const distance = endDate - now;

        // Elementos do timer
        const daysEl = document.getElementById('timer-days');
        const hoursEl = document.getElementById('timer-hours');
        const minutesEl = document.getElementById('timer-minutes');
        const secondsEl = document.getElementById('timer-seconds');

        // Verifica se os elementos existem antes de atualizar
        if (!daysEl || !hoursEl || !minutesEl || !secondsEl) {
            if (timerInterval) clearInterval(timerInterval);
            return;
        }

        if (distance < 0) {
            if (timerInterval) clearInterval(timerInterval);
            showAlternativeCTA();
            return;
        }

        // Cálculos do timer
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Atualiza com animação suave
        const updateWithAnimation = (el, value) => {
            if (el.textContent !== value) {
                el.classList.add('timer-update');
                el.textContent = value;
                setTimeout(() => el.classList.remove('timer-update'), 300);
            }
        };

        updateWithAnimation(daysEl, days.toString().padStart(2, '0'));
        updateWithAnimation(hoursEl, hours.toString().padStart(2, '0'));
        updateWithAnimation(minutesEl, minutes.toString().padStart(2, '0'));
        updateWithAnimation(secondsEl, seconds.toString().padStart(2, '0'));

        // Atualiza urgência visual baseado no tempo restante
        const container = document.querySelector('.scarcity-timer');
        if (container) {
            if (days === 0) {
                if (hours < 2) container.classList.add('urgent');
                else if (hours < 12) container.classList.add('warning');
            }
        }
    }

    // Inicia o timer com tratamento de erro
    try {
        timerInterval = setInterval(updateTimer, 1000);
        updateTimer();
    } catch (error) {
        console.error('Erro ao inicializar o timer:', error);
        showAlternativeCTA();
    }
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
    let currentPlayer = null;

    function createLoadingIndicator() {
        const loader = document.createElement('div');
        loader.className = 'video-loader';
        loader.setAttribute('aria-label', 'Carregando vídeo...');
        loader.innerHTML = '<div class="spinner"></div><p>Carregando vídeo...</p>';
        return loader;
    }

    function showError(container, message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'video-error';
        errorElement.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
            <button class="retry-button">
                <i class="fas fa-redo"></i> Tentar novamente
            </button>
        `;
        container.innerHTML = '';
        container.appendChild(errorElement);
        return errorElement;
    }

    async function openVideoModal(videoId, button) {
        if (!overlay || !modalContainer) return false;
        if (overlay.classList.contains('active')) return false;

        const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768;

        try {
            // Show loading state
            modalContainer.innerHTML = '';
            modalContainer.appendChild(createLoadingIndicator());
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Wait for YouTube API
            if (!window.testimonialManager.isApiLoaded()) {
                await new Promise((resolve) => window.testimonialManager.onApiReady(resolve));
            }

            // Create player with enhanced options
            currentPlayer = new YT.Player(modalContainer, {
                videoId: videoId,
                playerVars: {
                    autoplay: isMobile ? 0 : 1,
                    rel: 0,
                    showinfo: 0,
                    modestbranding: 1,
                    playsinline: 1,
                    origin: window.location.origin
                },
                events: {
                    onReady: (event) => {
                        if (!isMobile) event.target.playVideo();
                    },
                    onError: (event) => {
                        console.error('YouTube player error:', event.data);
                        const errorElement = showError(modalContainer, 'Erro ao carregar o vídeo. Por favor, tente novamente.');
                        errorElement.querySelector('.retry-button').onclick = () => {
                            openVideoModal(videoId, button);
                        };
                    }
                }
            });

            // Setup focus management
            setupFocusTrap();
            return true;

        } catch (error) {
            console.error('Error loading video:', error);
            const errorElement = showError(modalContainer, 'Não foi possível carregar o vídeo. Verifique sua conexão.');
            errorElement.querySelector('.retry-button').onclick = () => {
                openVideoModal(videoId, button);
            };
            return false;
        }
    }

    function setupFocusTrap() {
        const previouslyFocused = document.activeElement;
        overlay.__previouslyFocused = previouslyFocused;
        if (closeBtn) closeBtn.focus();

        function trapFocus(e) {
            if (e.key !== 'Tab') return;
            const focusable = overlay.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (!focusable.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }

        if (overlay.__keydownListener) {
            document.removeEventListener('keydown', overlay.__keydownListener);
        }

        overlay.__keydownListener = function(e) {
            if (e.key === 'Escape') closeVideoModal();
            trapFocus(e);
        };

        document.addEventListener('keydown', overlay.__keydownListener);
    }

    function closeVideoModal() {
        if (!overlay || !modalContainer) return;

        // Stop and destroy current player
        if (currentPlayer && typeof currentPlayer.destroy === 'function') {
            try {
                currentPlayer.destroy();
            } catch (e) {
                console.warn('Error destroying player:', e);
            }
        }
        currentPlayer = null;

        // Reset modal state
        overlay.classList.remove('active');
        modalContainer.innerHTML = '';
        document.body.style.overflow = '';

        // Cleanup event listeners and focus management
        if (overlay.__keydownListener) {
            document.removeEventListener('keydown', overlay.__keydownListener);
            overlay.__keydownListener = null;
        }

        // Restore focus
        const prev = overlay.__previouslyFocused;
        if (prev && typeof prev.focus === 'function') {
            setTimeout(() => prev.focus(), 0);
        }
        overlay.__previouslyFocused = null;
    }

    videoButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const videoId = this.dataset.videoId;
            const opened = openVideoModal(videoId, this);
            
            if (!opened) {
                // Fallback: open in new tab
                window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
            }
        });
    });

    // Modal close handlers
    if (closeBtn) {
        closeBtn.addEventListener('click', closeVideoModal);
    }

    if (overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) closeVideoModal();
        });
    }
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

    if (!faqItems || faqItems.length === 0) return;

    faqItems.forEach(item => {
        // HTML uses 'faq-pergunta' for the button and 'faq-resposta' for the panel
        const question = item.querySelector('.faq-pergunta');
        const answer = item.querySelector('.faq-resposta');
        if (!question) return;

        // ensure accessibility attributes
        question.setAttribute('aria-expanded', item.classList.contains('active') ? 'true' : 'false');
        if (answer && !answer.id) answer.id = `faq-${Math.random().toString(36).slice(2, 9)}`;
        if (answer) question.setAttribute('aria-controls', answer.id);

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Fecha todos os itens
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
                const q = faqItem.querySelector('.faq-pergunta');
                if (q) q.setAttribute('aria-expanded', 'false');
            });

            // Abre o item clicado
            if (!isActive) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
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