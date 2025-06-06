document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica do Carrossel de Depoimentos ---
    const carouselTrack = document.querySelector('.carousel-track');
    const slides = Array.from(carouselTrack.children);
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const dotsContainer = document.querySelector('.carousel-dots');

    let currentSlideIndex = 0; 
    
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

    updateCarouselDimensions();
    window.addEventListener('resize', updateCarouselDimensions);

    const moveToSlide = (track, targetIndex) => {
        track.style.transform = 'translateX(-' + targetIndex * totalSlideMovementWidth + 'px)';
        
        const currentSlide = track.querySelector('.current-slide');
        if (currentSlide) {
            currentSlide.classList.remove('current-slide');
        }
        slides[targetIndex].classList.add('current-slide');
    };

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

    slides.forEach((slide, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.dataset.slideIndex = index;
        if (index === 0) {
            dot.classList.add('active');
        }
        dotsContainer.appendChild(dot);
    });
    const dots = Array.from(dotsContainer.children);

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

    slides[0].classList.add('current-slide');
    showHideArrows(prevButton, nextButton, currentSlideIndex, slides.length);

    // --- Fim Lógica do Carrossel de Depoimentos ---


    // --- Lógica do Formulário de Contato ---
    const contactForm = document.querySelector('.contact-form');
    // Cria um elemento para exibir mensagens de feedback
    const formMessage = document.createElement('div'); 
    formMessage.classList.add('form-message');
    contactForm.appendChild(formMessage); // Adiciona a mensagem dentro do formulário

    contactForm.addEventListener('submit', (event) => {
        event.preventDefault(); // IMPEDE O RECARREGAMENTO DA PÁGINA

        // Limpa mensagens anteriores
        formMessage.textContent = '';
        formMessage.classList.remove('success', 'error');

        // Coleta os dados do formulário
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        // Validação simples de e-mail (além do required do HTML)
        if (!validateEmail(email)) {
            formMessage.textContent = 'Por favor, insira um e-mail válido.';
            formMessage.classList.add('error');
            return; // Sai da função se o e-mail for inválido
        }

        // Simula o envio (substituir por uma chamada real a um backend em um projeto real)
        console.log('Dados do formulário a serem enviados:', { name, email, message });
        
        // Exibe uma mensagem de "enviando..."
        formMessage.textContent = 'Enviando...';
        formMessage.classList.add('loading');
        
        setTimeout(() => {
            // Em um cenário real, aqui você faria uma requisição Fetch/XMLHttpRequest para um backend
            // Ex: fetch('/api/send-contact', { method: 'POST', body: JSON.stringify({ name, email, message }) })
            // .then(response => response.json())
            // .then(data => { /* ... */ })
            // .catch(error => { /* ... */ });

            // Simulação de sucesso/erro
            const success = Math.random() > 0.1; // 90% de chance de sucesso para o estudo

            formMessage.classList.remove('loading');

            if (success) {
                formMessage.textContent = 'Mensagem enviada com sucesso! Em breve entraremos em contato.';
                formMessage.classList.add('success');
                contactForm.reset(); // Limpa o formulário
            } else {
                formMessage.textContent = 'Ocorreu um erro ao enviar a mensagem. Por favor, tente novamente.';
                formMessage.classList.add('error');
            }
        }, 1500); // Simula um atraso de 1.5 segundos para o envio
    });

    // Função auxiliar para validar e-mail (pode ser mais robusta)
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    // --- Fim Lógica do Formulário de Contato ---
});