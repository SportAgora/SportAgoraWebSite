const carousel = document.querySelector('.carousel');
const leftArrow = document.querySelector('.left-arrow');
const rightArrow = document.querySelector('.right-arrow');
let scrollAmount = 0;
const itemWidth = document.querySelector('.carousel-item').offsetWidth;
const maxScroll = carousel.scrollWidth - carousel.offsetWidth;

// Função para mover o carrossel para a direita com animação
rightArrow.addEventListener('click', () => {
    if (scrollAmount + itemWidth * 5 < maxScroll) {
        scrollAmount += itemWidth * 5; // Avançar 5 itens
    } else {
        scrollAmount = maxScroll; // Parar no final
    }
    carousel.style.transform = `translateX(-${scrollAmount}px)`; // Animação para mover
});

// Função para mover o carrossel para a esquerda com animação
leftArrow.addEventListener('click', () => {
    if (scrollAmount - itemWidth * 5 > 0) {
        scrollAmount -= itemWidth * 5; // Voltar 5 itens
    } else {
        scrollAmount = 0; // Parar no início
    }
    carousel.style.transform = `translateX(-${scrollAmount}px)`; // Animação para mover
});

// Função para scroll em dispositivos móveis e desktops com toque
let isDown = false;
let startX;
let scrollLeft;

carousel.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
    carousel.classList.add('active');
});

carousel.addEventListener('mouseleave', () => {
    isDown = false;
    carousel.classList.remove('active');
});

carousel.addEventListener('mouseup', () => {
    isDown = false;
    carousel.classList.remove('active');
});

carousel.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 2; // Ajuste de sensibilidade
    carousel.scrollLeft = scrollLeft - walk;
});

// Toque para dispositivos móveis
carousel.addEventListener('touchstart', (e) => {
    isDown = true;
    startX = e.touches[0].pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
});

carousel.addEventListener('touchend', () => {
    isDown = false;
});

carousel.addEventListener('touchmove', (e) => {
    if (!isDown) return;
    const x = e.touches[0].pageX - carousel.offsetLeft;
    const walk = (x - startX) * 2; // Ajuste de sensibilidade
    carousel.scrollLeft = scrollLeft - walk;
});
