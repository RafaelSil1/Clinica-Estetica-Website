document.addEventListener("DOMContentLoaded", () => {
    
    // --- FUNÇÕES UTILITÁRIAS (PERFORMANCE) ---
    // Evita que eventos como resize travem a tela disparando centenas de vezes por segundo
    const debounce = (func, wait = 100) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

    // --- 1. CARROSSEL DE TRANSFORMAÇÕES ---
    const track = document.querySelector(".carousel-track");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    const cards = document.querySelectorAll(".transformation-card");

    // Executa a lógica do carrossel SOMENTE se os elementos existirem no HTML
    if (track && cards.length > 0 && prevBtn && nextBtn) {
        let currentIndex = 0;

        const getItemsPerSlide = () => window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;

        const updateCarousel = () => {
            const isMobile = window.innerWidth <= 768;

            // Se for mobile, resetamos o transform (o CSS controla a exibição em lista)
            if (isMobile) {
                track.style.transform = "none";
                return;
            }

            const itemsPerSlide = getItemsPerSlide();
            const maxIndex = Math.max(0, cards.length - itemsPerSlide);

            currentIndex = Math.min(Math.max(currentIndex, 0), maxIndex);

            const cardWidth = cards[0]?.getBoundingClientRect().width || 0;
            const gap = 24; // Espaçamento entre cards
            track.style.transform = `translateX(-${currentIndex * (cardWidth + gap)}px)`;

            // Atualiza botões
            prevBtn.style.opacity = currentIndex === 0 ? "0.3" : "1";
            prevBtn.style.cursor = currentIndex === 0 ? "default" : "pointer";
            nextBtn.style.opacity = currentIndex === maxIndex ? "0.3" : "1";
            nextBtn.style.cursor = currentIndex === maxIndex ? "default" : "pointer";
        };

        nextBtn.addEventListener("click", () => { 
            const maxIndex = Math.max(0, cards.length - getItemsPerSlide());
            if (currentIndex < maxIndex) { 
                currentIndex++; 
                updateCarousel(); 
            } 
        });

        prevBtn.addEventListener("click", () => { 
            if (currentIndex > 0) { 
                currentIndex--; 
                updateCarousel(); 
            } 
        });

        // Evento de resize otimizado com debounce
        window.addEventListener("resize", debounce(updateCarousel, 150));
        updateCarousel();
    }

    // --- 2. BOTÃO VOLTAR AO TOPO ---
    const btnScrollTop = document.getElementById("btnScrollTop");

    if (btnScrollTop) {
        // Debounce para não travar o scroll do navegador
        const handleScroll = debounce(() => {
            if (window.scrollY > 400) {
                btnScrollTop.classList.add("show");
            } else {
                btnScrollTop.classList.remove("show");
            }
        }, 50);

        window.addEventListener("scroll", handleScroll, { passive: true });

        btnScrollTop.addEventListener("click", (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // --- 3. CONTADORES ANIMADOS SOMENTE AO ROLAR ATÉ ELES ---
    const statsSection = document.querySelector(".stats-container");
    const counters = document.querySelectorAll(".stat-number");

    if (counters.length > 0) {
        const startCounterAnimation = (counter) => {
            const rawText = counter.innerText;
            const targetNumber = parseInt(rawText.replace(/\D/g, ""), 10);
            if (isNaN(targetNumber)) return;

            let startTime = null;
            const duration = 2000; // 2 segundos de animação

            const animate = (currentTime) => {
                if (!startTime) startTime = currentTime;
                const progressRatio = Math.min((currentTime - startTime) / duration, 1);
                const currentNumber = Math.floor(progressRatio * targetNumber);

                let formatted = currentNumber.toLocaleString("pt-BR");
                if (rawText.trim().startsWith("+")) {
                    formatted = (rawText.includes("+ ") ? "+ " : "+") + formatted;
                }

                counter.innerText = formatted;

                if (progressRatio < 1) {
                    requestAnimationFrame(animate);
                }
            };

            requestAnimationFrame(animate);
        };

        // Dispara a animação apenas quando a seção aparecer na tela
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    counters.forEach(counter => startCounterAnimation(counter));
                    observer.unobserve(entry.target); // Roda apenas 1 vez
                }
            });
        }, { threshold: 0.3 });

        if (statsSection) {
            statsObserver.observe(statsSection);
        } else {
            // Fallback caso não exista container específico
            counters.forEach(counter => startCounterAnimation(counter));
        }
    }

    // --- 4. EFEITO SCROLL REVEAL ---
    const hiddenElements = document.querySelectorAll('.hidden-element');

    if (hiddenElements.length > 0) {
        const appearanceObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show-element');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        hiddenElements.forEach(el => appearanceObserver.observe(el));
    }
});