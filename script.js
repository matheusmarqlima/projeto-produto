document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica do Carrossel de Depoimentos ---
    const carouselTrack = document.querySelector('.carousel-track');
    const slides = Array.from(carouselTrack.children);
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const dotsContainer = document.querySelector('.carousel-dots');

    let currentSlideIndex = 0; 
    let dots = []; // Mantenha dots como uma variável no escopo superior para acessibilidade

    const getSlideAndGapWidth = () => {
        const slideStyle = window.getComputedStyle(slides[0]);
        const slideWidth = parseFloat(slideStyle.width);
        const gap = parseFloat(window.getComputedStyle(carouselTrack).gap); 
        const actualGap = isNaN(gap) ? 0 : gap;
        return slideWidth + actualGap;
    };

    let totalSlideMovementWidth = 0;

    const updateCarouselDimensions = () => {
        totalSlideMovementWidth = getSlideAndGapWidth();
        carouselTrack.style.transform = 'translateX(-' + currentSlideIndex * totalSlideMovementWidth + 'px)';
    };

    // Função para mover o carrossel para um slide específico
    const moveToSlide = (track, targetIndex) => {
        track.style.transform = 'translateX(-' + targetIndex * totalSlideMovementWidth + 'px)';
        
        const currentSlide = track.querySelector('.testimonial-slide.current-slide');
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

    // --- NOVA FUNÇÃO: Limpa todos os pontos existentes ---
    const clearDots = () => {
        while (dotsContainer.firstChild) {
            dotsContainer.removeChild(dotsContainer.firstChild);
        }
        dots = []; // Limpa também o array de referência
    };

    // --- NOVA FUNÇÃO: Gera e adiciona os pontos ---
    const generateDots = () => {
        clearDots(); // Limpa antes de gerar
        slides.forEach((slide, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.dataset.slideIndex = index;
            dotsContainer.appendChild(dot);
        });
        dots = Array.from(dotsContainer.children); // Recaptura os pontos recém-criados
    };


    // Inicialização do carrossel
    const initializeCarousel = () => {
        generateDots(); // Gera os pontos na inicialização
        updateCarouselDimensions(); // Calcula dimensões
        
        // Remove a classe 'current-slide' de qualquer slide caso já exista
        slides.forEach(slide => slide.classList.remove('current-slide'));
        // Marca o primeiro slide como atual
        slides[0].classList.add('current-slide');
        
        // Remove a classe 'active' de qualquer dot caso já exista
        dots.forEach(dot => dot.classList.remove('active'));
        // Marca o primeiro ponto como ativo
        dots[0].classList.add('active'); 

        showHideArrows(prevButton, nextButton, currentSlideIndex, slides.length);
    };

    // Chama a inicialização
    initializeCarousel();


    // Event Listeners para as setas
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

    // Event Listeners para os pontos
    dotsContainer.addEventListener('click', (e) => {
        const targetDot = e.target.closest('.dot');

        if (!targetDot) return;

        const targetIndex = parseInt(targetDot.dataset.slideIndex);
        
        if (targetIndex === currentSlideIndex) return; 

        currentSlideIndex = targetIndex;
        moveToSlide(carouselTrack, currentSlideIndex);
        updateDots(currentSlideIndex);
        showHideArrows(prevButton, nextButton, currentSlideIndex, slides.length);
    });

    // Re-calcular a largura se a janela for redimensionada (para responsividade)
    window.addEventListener('resize', updateCarouselDimensions);


    // --- Fim Lógica do Carrossel de Depoimentos ---


    // --- Lógica do Formulário de Contato ---
    const contactForm = document.querySelector('.contact-form');
    // Cria um elemento para exibir mensagens de feedback (se ainda não existir)
    let formMessage = contactForm.querySelector('.form-message');
    if (!formMessage) {
        formMessage = document.createElement('div'); 
        formMessage.classList.add('form-message');
        contactForm.appendChild(formMessage);
    }

    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();

        formMessage.textContent = '';
        formMessage.classList.remove('success', 'error', 'loading'); // Limpa todas as classes de estado

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        if (!validateEmail(email)) {
            formMessage.textContent = 'Por favor, insira um e-mail válido.';
            formMessage.classList.add('error');
            // Torna a mensagem visível
            formMessage.style.display = 'block';
            formMessage.style.opacity = '1';
            return;
        }

        console.log('Dados do formulário a serem enviados:', { name, email, message });
        
        formMessage.textContent = 'Enviando...';
        formMessage.classList.add('loading');
        // Torna a mensagem visível
        formMessage.style.display = 'block';
        formMessage.style.opacity = '1';
        
        setTimeout(() => {
            const success = Math.random() > 0.1;

            formMessage.classList.remove('loading');

            if (success) {
                formMessage.textContent = 'Mensagem enviada com sucesso! Em breve entraremos em contato.';
                formMessage.classList.add('success');
                contactForm.reset();
            } else {
                formMessage.textContent = 'Ocorreu um erro ao enviar a mensagem. Por favor, tente novamente.';
                formMessage.classList.add('error');
            }
            // A mensagem permanecerá visível até a próxima interação ou um timer para escondê-la
        }, 1500);
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    // --- Lógica para o Rodapé (Ano Atual) ---
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
    // --- Fim Lógica para o Rodapé ---
});