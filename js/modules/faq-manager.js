// Gerenciador de FAQ
export class FAQManager {
    constructor() {
        this.faqItems = document.querySelectorAll('.faq-item');
        this.setupFAQ();
    }

    setupFAQ() {
        // Restore FAQ state from storage
        this.restoreState();

        this.faqItems.forEach(item => {
            const button = item.querySelector('.faq-pergunta');
            const answer = item.querySelector('.faq-resposta');

            if (button && answer) {
                // Setup ARIA attributes
                this.setupAccessibility(button, answer);

                // Add click handler
                button.addEventListener('click', () => this.toggleFAQ(item));

                // Handle keyboard navigation
                button.addEventListener('keydown', (e) => this.handleKeyPress(e, item));
            }
        });

        // Save state when leaving page
        window.addEventListener('beforeunload', () => this.saveState());
    }

    setupAccessibility(button, answer) {
        // Set proper ARIA attributes
        button.setAttribute('aria-expanded', 'false');
        const id = `faq-answer-${Math.random().toString(36).substr(2, 9)}`;
        answer.id = id;
        button.setAttribute('aria-controls', id);
        button.setAttribute('role', 'button');
    }

    toggleFAQ(item) {
        const button = item.querySelector('.faq-pergunta');
        const answer = item.querySelector('.faq-resposta');
        const isExpanded = button.getAttribute('aria-expanded') === 'true';

        // Toggle state
        button.setAttribute('aria-expanded', !isExpanded);
        button.classList.toggle('active');
        answer.classList.toggle('active');

        // Handle animation
        if (!isExpanded) {
            answer.style.maxHeight = `${answer.scrollHeight}px`;
            answer.style.opacity = '1';
        } else {
            answer.style.maxHeight = '0';
            answer.style.opacity = '0';
        }

        // Save state
        this.saveState();
    }

    handleKeyPress(event, item) {
        switch(event.key) {
            case ' ':
            case 'Enter':
                event.preventDefault();
                this.toggleFAQ(item);
                break;
            case 'ArrowDown':
                event.preventDefault();
                this.focusNextFAQ(item);
                break;
            case 'ArrowUp':
                event.preventDefault();
                this.focusPreviousFAQ(item);
                break;
            case 'Home':
                event.preventDefault();
                this.focusFirstFAQ();
                break;
            case 'End':
                event.preventDefault();
                this.focusLastFAQ();
                break;
        }
    }

    focusNextFAQ(currentItem) {
        const items = Array.from(this.faqItems);
        const currentIndex = items.indexOf(currentItem);
        const nextItem = items[currentIndex + 1];
        
        if (nextItem) {
            nextItem.querySelector('.faq-pergunta').focus();
        }
    }

    focusPreviousFAQ(currentItem) {
        const items = Array.from(this.faqItems);
        const currentIndex = items.indexOf(currentItem);
        const previousItem = items[currentIndex - 1];
        
        if (previousItem) {
            previousItem.querySelector('.faq-pergunta').focus();
        }
    }

    focusFirstFAQ() {
        const firstButton = this.faqItems[0]?.querySelector('.faq-pergunta');
        if (firstButton) firstButton.focus();
    }

    focusLastFAQ() {
        const lastButton = this.faqItems[this.faqItems.length - 1]?.querySelector('.faq-pergunta');
        if (lastButton) lastButton.focus();
    }

    saveState() {
        const state = Array.from(this.faqItems).map(item => {
            const button = item.querySelector('.faq-pergunta');
            return button.getAttribute('aria-expanded') === 'true';
        });

        try {
            localStorage.setItem('faqState', JSON.stringify(state));
        } catch (e) {
            console.warn('Failed to save FAQ state:', e);
        }
    }

    restoreState() {
        try {
            const savedState = localStorage.getItem('faqState');
            if (savedState) {
                const state = JSON.parse(savedState);
                state.forEach((isExpanded, index) => {
                    if (isExpanded && this.faqItems[index]) {
                        this.toggleFAQ(this.faqItems[index]);
                    }
                });
            }
        } catch (e) {
            console.warn('Failed to restore FAQ state:', e);
        }
    }
}