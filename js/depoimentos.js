// Gerenciador de depoimentos em vídeo
const testimonialManager = (function() {
    let youtubeApiLoaded = false;
    let onYouTubeIframeAPIReady = null;

    function loadYoutubeAPI() {
        if (youtubeApiLoaded) return Promise.resolve();

        return new Promise((resolve, reject) => {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            window.onYouTubeIframeAPIReady = function() {
                youtubeApiLoaded = true;
                if (onYouTubeIframeAPIReady) onYouTubeIframeAPIReady();
                resolve();
            };

            // Timeout after 10 seconds
            setTimeout(() => reject(new Error('YouTube API load timeout')), 10000);
        });
    }

    function preloadThumbnails() {
        document.querySelectorAll('.video-thumb').forEach(thumb => {
            const parent = thumb.parentElement;
            if (!parent) return;
            const button = parent.querySelector('.play-button');
            if (!button) return;
            const videoId = button.dataset.videoId;
            if (!videoId) return;

            // Add loading state
            thumb.classList.add('loading');
            button.setAttribute('aria-label', 'Carregando thumbnail...');

            // Try to load high quality thumbnail first
            const img = new Image();
            img.onload = function() {
                thumb.src = this.src;
                thumb.classList.remove('loading');
                button.setAttribute('aria-label', 'Reproduzir vídeo');
            };
            img.onerror = function() {
                // Fallback to standard quality
                thumb.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                thumb.classList.remove('loading');
                button.setAttribute('aria-label', 'Reproduzir vídeo');
            };
            img.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        });
    }

    return {
        init() {
            // Preload thumbnails immediately
            preloadThumbnails();
            
            // Start loading YouTube API
            loadYoutubeAPI().catch(error => {
                console.error('Erro ao carregar API do YouTube:', error);
                // Add fallback for thumbnail clicks
                document.querySelectorAll('.play-button').forEach(button => {
                    button.addEventListener('click', (e) => {
                        e.preventDefault();
                        const videoId = button.dataset.videoId;
                        if (!videoId) return;
                        
                        // Open in new tab as fallback
                        window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
                    });
                });
            });
        },
        
        isApiLoaded() {
            return youtubeApiLoaded;
        },
        
        onApiReady(callback) {
            if (youtubeApiLoaded) {
                callback();
            } else {
                onYouTubeIframeAPIReady = callback;
            }
        }
    };
})();

document.addEventListener('DOMContentLoaded', function() {
    testimonialManager.init();
});