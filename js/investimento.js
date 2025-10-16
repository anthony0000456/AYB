// Funcionalidade do FAQ na seção de investimento
document.addEventListener('DOMContentLoaded', function() {
    // Funcionalidade do FAQ
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const pergunta = item.querySelector('.faq-pergunta');
        const resposta = item.querySelector('.faq-resposta');
        
        pergunta.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Fecha todos os itens
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-resposta').style.maxHeight = '0';
                }
            });

            // Toggle do item clicado
            item.classList.toggle('active');
            
            if (!isActive) {
                resposta.style.maxHeight = resposta.scrollHeight + 'px';
            } else {
                resposta.style.maxHeight = '0';
            }
        });
    });

    // Funcionalidade dos botões de plano
    const btnsPlano = document.querySelectorAll('.btn-plano');
    btnsPlano.forEach(btn => {
        btn.addEventListener('click', () => {
            const plano = btn.getAttribute('data-plano');
            
            // Efeito de clique
            btn.classList.add('clicked');
            setTimeout(() => btn.classList.remove('clicked'), 200);

            // Aqui você pode adicionar a lógica para redirecionar para a página de checkout
            // ou abrir um modal de formulário de inscrição
            console.log(`Plano selecionado: ${plano}`);
        });
    });

    // Scroll suave para a seção de planos
    const btnScrollToPlanos = document.querySelector('[data-scroll-to="planos"]');
    if (btnScrollToPlanos) {
        btnScrollToPlanos.addEventListener('click', (e) => {
            e.preventDefault();
            const planosSection = document.querySelector('.planos-grid');
            if (planosSection) {
                planosSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // Animações ao scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Adiciona observador aos elementos com classe animate-on-scroll
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.observe(element);
    });

    // Contador de vagas restantes (efeito psicológico)
    const vagasElement = document.querySelector('.vagas-limitadas span');
    if (vagasElement) {
        const vagasRestantes = Math.floor(Math.random() * (10 - 3 + 1)) + 3; // Entre 3 e 10 vagas
        vagasElement.textContent = `Apenas ${vagasRestantes} vagas restantes para a turma de 2025!`;
    }
});