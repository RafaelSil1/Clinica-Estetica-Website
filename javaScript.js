document.addEventListener("DOMContentLoaded", () => {
    // --- 1. CARROSSEL DE TRANSFORMAÇÕES ---
    const track = document.querySelector(".carousel-track");
    const [prevBtn, nextBtn] = [document.querySelector(".prev-btn"), document.querySelector(".next-btn")];
    const cards = document.querySelectorAll(".transformation-card");
    let currentIndex = 0;

    // Retorna a quantidade de itens visíveis por largura de tela
    const getItemsPerSlide = () => window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;

    function updateCarousel() {
        const itemsPerSlide = getItemsPerSlide();
        const maxIndex = Math.max(0, cards.length - itemsPerSlide);

        currentIndex = Math.min(Math.max(currentIndex, 0), maxIndex);

        const cardWidth = cards[0]?.getBoundingClientRect().width || 0;
        track.style.transform = `translateX(-${currentIndex * (cardWidth + 24)}px)`;

        // Atualiza estado visual dos botões
        prevBtn.style.opacity = currentIndex === 0 ? "0.3" : "1";
        prevBtn.style.cursor = currentIndex === 0 ? "default" : "pointer";
        nextBtn.style.opacity = currentIndex === maxIndex ? "0.3" : "1";
        nextBtn.style.cursor = currentIndex === maxIndex ? "default" : "pointer";
    }

    nextBtn.addEventListener("click", () => { if (currentIndex < cards.length - getItemsPerSlide()) { currentIndex++; updateCarousel(); } });
    prevBtn.addEventListener("click", () => { if (currentIndex > 0) { currentIndex--; updateCarousel(); } });
    window.addEventListener("resize", updateCarousel);
    updateCarousel();

    // --- 2. BOTÃO VOLTAR AO TOPO (CORRIGIDO) ---
    const btnScrollTop = document.getElementById("btnScrollTop");

    window.addEventListener("scroll", () => {
        btnScrollTop.classList.toggle("show", window.scrollY > 400);
    });

    btnScrollTop.addEventListener("click", (e) => {
        e.preventDefault(); // Impede o navegador de dar o "salto" abrupto instantâneo
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    // --- 3. CONTADORES ANIMADOS (NÚMEROS) ---
    document.querySelectorAll(".stat-number").forEach(counter => {
        const rawText = counter.innerText;
        const targetNumber = parseInt(rawText.replace(/\D/g, ""), 10);
        if (isNaN(targetNumber)) return;

        let startTime = null;

        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progressRatio = Math.min((currentTime - startTime) / 2000, 1); // 2000ms fixos
            const currentNumber = Math.floor(progressRatio * targetNumber);

            let formatted = currentNumber.toLocaleString("pt-BR");
            if (rawText.trim().startsWith("+")) {
                formatted = (rawText.includes("+ ") ? "+ " : "+") + formatted;
            }

            counter.innerText = formatted;
            if (progressRatio < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    });

    // --- 4. EFEITO SCROLL REVEAL (INTERSECTION OBSERVER) ---
    const appearanceObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-element');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.hidden-element').forEach(el => appearanceObserver.observe(el));
});