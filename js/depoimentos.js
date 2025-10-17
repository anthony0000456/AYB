document.addEventListener('DOMContentLoaded', function() {
    // Configuração dos vídeos de depoimentos com IDs reais do YouTube
    const depoimentos = {
        'VIDEO_ID_1': {
            id: 'VTv1OuHrPFA',
            title: 'Depoimento Carolina Santos - Terapeuta Integrativa'
        },
        'VIDEO_ID_2': {
            id: 'TzXpZD-5l3k',
            title: 'Depoimento Rafael Oliveira - Fisioterapeuta'
        },
        'VIDEO_ID_3': {
            id: 'sNcYAOlKGhU',
            title: 'Depoimento Marina Lima - Professora de Yoga'
        }
    };

    const overlay = document.querySelector('.depoimentos-overlay');
    const modal = document.querySelector('.video-modal');
    const videoContainer = modal.querySelector('.video-container');
    const closeButton = modal.querySelector('.close-modal');

    // Função para criar o iframe do YouTube com melhor performance
    function createYouTubeIframe(videoId) {
        return `<iframe 
            width="100%" 
            height="100%" 
            src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&showinfo=0" 
            title="YouTube video player" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
        </iframe>`;
    }

    // Adicionar listeners para os botões de play com feedback visual
    document.querySelectorAll('.play-button').forEach(button => {
        button.addEventListener('click', function() {
            const videoId = depoimentos[this.dataset.videoId].id;
            this.classList.add('clicked');
            
            // Animar fade do overlay
            overlay.style.display = 'flex';
            setTimeout(() => overlay.classList.add('active'), 10);
            
            // Carregar vídeo
            videoContainer.innerHTML = createYouTubeIframe(videoId);
            document.body.style.overflow = 'hidden';
            
            // Remover efeito de click
            setTimeout(() => this.classList.remove('clicked'), 200);
        });
    });

    // Melhorar a função de fechar modal com animação
    function closeModal() {
        overlay.classList.remove('active');
        setTimeout(() => {
            overlay.style.display = 'none';
            videoContainer.innerHTML = '';
        }, 300);
        document.body.style.overflow = '';
    }

    closeButton.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal();
        }
    });

    // Fechar com tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeModal();
        }
    });

    // Preload das thumbnails dos vídeos em alta qualidade
    document.querySelectorAll('.video-thumb').forEach(thumb => {
        const button = thumb.parentElement.querySelector('.play-button');
        const videoId = depoimentos[button.dataset.videoId].id;
        
        // Tentar carregar thumbnail em alta qualidade primeiro
        const img = new Image();
        img.onload = function() {
            thumb.src = this.src;
        };
        img.onerror = function() {
            // Se falhar, usar thumbnail padrão
            thumb.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        };
        img.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    });
});