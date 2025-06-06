document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica do Carrossel de Depoimentos ---
    const carouselTrack = document.querySelector('.carousel-track');
    const slides = Array.from(carouselTrack.children);
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const dotsContainer = document.querySelector('.carousel-dots');

    let currentSlideIndex = 0; // O índice do slide atualmente visível
    
    // Função para obter a largura computada de um slide E o valor do gap do track
    const getSlideAndGapWidth = () => {
        // Pega o primeiro slide para calcular a largura
        const slideStyle = window.getComputedStyle(slides[0]);
        const slideWidth = parseFloat(slideStyle.width); // Largura do slide (sem margin ou padding extras)

        // Pega o gap do elemento pai (.carousel-track)
        const gap = parseFloat(window.getComputedStyle(carouselTrack).gap); 
        
        // Se o gap não for um número válido (ex: 'normal' ou 0px), o parseFloat pode retornar NaN.
        // Se NaN, assume 0 para evitar problemas no cálculo.
        const actualGap = isNaN(gap) ? 0 : gap;

        return slideWidth + actualGap; // Largura total de um slide + seu espaçamento
    };

    let totalSlideMovementWidth = 0; // Inicializa com 0, será calculado após o DOM

    // Função para atualizar a largura total do movimento e reposicionar o carrossel
    const updateCarouselDimensions = () => {
        totalSlideMovementWidth = getSlideAndGapWidth();
        // Reposiciona o carrossel para o slide atual após a dimensão ser atualizada
        carouselTrack.style.transform = 'translateX(-' + currentSlideIndex * totalSlideMovementWidth + 'px)';
    };

    // Inicializa as dimensões do carrossel assim que o DOM estiver pronto
    updateCarouselDimensions();

    // Re-calcular a largura se a janela for redimensionada (para responsividade)
    window.addEventListener('resize', updateCarouselDimensions);


    // Função para mover o carrossel para um slide específico
    const moveToSlide = (track, targetIndex) => {
        track.style.transform = 'translateX(-' + targetIndex * totalSlideMovementWidth + 'px)';
        
        // Atualiza a classe 'current-slide'
        const currentSlide = track.querySelector('.current-slide');
        if (currentSlide) {
            currentSlide.classList.remove('current-slide');
        }
        slides[targetIndex].classList.add('current-slide');
    };

    // Função para atualizar os pontos de navegação
    const updateDots = (targetIndex) => {
        const currentActiveDot = dotsContainer.querySelector('.dot.active');
        if (currentActiveDot) {
            currentActiveDot.classList.remove('active');
        }
        dots[targetIndex].classList.add('active');
    };

    // Função para mostrar/esconder as setas de navegação
    const showHideArrows = (prevButton, nextButton, targetIndex, totalSlides) => {
        if (targetIndex === 0) {
            prevButton.classList.add('is-hidden');
        } else {
            prevButton.classList.remove('is-hidden');
        }

        if (targetIndex === totalSlides - 1) {
            nextButton.classList.add('is-hidden');
        } else {
            nextButton.classList.remove('is-hidden');
        }
    };

    // 1. Gerar os pontos de navegação
    slides.forEach((slide, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.dataset.slideIndex = index; // Adiciona um índice para referência
        if (index === 0) {
            dot.classList.add('active'); // Primeiro ponto ativo por padrão
        }
        dotsContainer.appendChild(dot);
    });
    const dots = Array.from(dotsContainer.children); // Pega todos os pontos criados

    // 2. Event Listeners para as setas
    nextButton.addEventListener('click', () => {
        if (currentSlideIndex < slides.length - 1) {
            currentSlideIndex++;
            moveToSlide(carouselTrack, currentSlideIndex);
            updateDots(currentSlideIndex);
            showHideArrows(prevButton, nextButton, currentSlideIndex, slides.length);
        }
    });

    prevButton.addEventListener('click', () => {
        if (currentSlideIndex > 0) {
            currentSlideIndex--;
            moveToSlide(carouselTrack, currentSlideIndex);
            updateDots(currentSlideIndex);
            showHideArrows(prevButton, nextButton, currentSlideIndex, slides.length);
        }
    });

    // 3. Event Listeners para os pontos
    dotsContainer.addEventListener('click', (e) => {
        const targetDot = e.target.closest('.dot'); // Garante que clicou num ponto

        if (!targetDot) return; // Se não clicou num ponto, sai

        const targetIndex = parseInt(targetDot.dataset.slideIndex);
        
        // Verifica se clicou no slide atual para evitar movimento desnecessário
        if (targetIndex === currentSlideIndex) return; 

        currentSlideIndex = targetIndex; // Atualiza o índice do slide atual
        moveToSlide(carouselTrack, currentSlideIndex);
        updateDots(currentSlideIndex);
        showHideArrows(prevButton, nextButton, currentSlideIndex, slides.length);
    });

    // Inicialização final: Marca o primeiro slide como atual e atualiza setas
    // Garante que o primeiro slide tenha a classe 'current-slide' para o JS encontrá-lo
    slides[0].classList.add('current-slide');
    showHideArrows(prevButton, nextButton, currentSlideIndex, slides.length);

    // --- Fim Lógica do Carrossel de Depoimentos ---
});