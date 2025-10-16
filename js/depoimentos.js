// Funcionalidade dos vídeos de depoimentos
document.addEventListener('DOMContentLoaded', function() {
    const playButtons = document.querySelectorAll('.play-button');
    const overlay = document.querySelector('.depoimentos-overlay');
    const videoModal = document.querySelector('.video-modal');
    const videoContainer = document.querySelector('.video-container');
    const closeButton = document.querySelector('.close-modal');

    // Configuração dos IDs dos vídeos do YouTube
    const videoIds = {
        'VIDEO_ID_1': 'YOUTUBE_VIDEO_ID_1',
        'VIDEO_ID_2': 'YOUTUBE_VIDEO_ID_2',
        'VIDEO_ID_3': 'YOUTUBE_VIDEO_ID_3'
    };

    function createVideoIframe(videoId) {
        return `<iframe width="560" height="315" 
                src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
                title="YouTube video player" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen></iframe>`;
    }

    function openVideoModal(videoId) {
        const youtubeId = videoIds[videoId];
        videoContainer.innerHTML = createVideoIframe(youtubeId);
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Previne rolagem quando modal está aberto
    }

    function closeVideoModal() {
        overlay.classList.remove('active');
        videoContainer.innerHTML = ''; // Remove o iframe
        document.body.style.overflow = ''; // Restaura a rolagem
    }

    // Event listeners
    playButtons.forEach(button => {
        button.addEventListener('click', () => {
            const videoId = button.getAttribute('data-video-id');
            openVideoModal(videoId);
        });
    });

    closeButton.addEventListener('click', closeVideoModal);

    // Fecha o modal ao clicar fora do vídeo
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeVideoModal();
        }
    });

    // Fecha o modal ao pressionar ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeVideoModal();
        }
    });
});