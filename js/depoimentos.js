document.addEventListener('DOMContentLoaded', function() {
    // Este arquivo apenas faz preload das thumbnails dos depoimentos.
    // A abertura do modal e a criação do iframe são tratadas em js/landing.js

    document.querySelectorAll('.video-thumb').forEach(thumb => {
        const parent = thumb.parentElement;
        if (!parent) return;
        const button = parent.querySelector('.play-button');
        if (!button) return;
        const videoId = button.dataset.videoId;
        if (!videoId) return;

        const img = new Image();
        img.onload = function() { thumb.src = this.src; };
        img.onerror = function() { thumb.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`; };
        img.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    });
});