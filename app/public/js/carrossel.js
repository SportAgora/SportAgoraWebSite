function initCarousel(carouselContainer) {
    const carousel = carouselContainer.querySelector('.carousel');
    const leftArrow = carouselContainer.querySelector('.left-arrow');
    const rightArrow = carouselContainer.querySelector('.right-arrow');
    let scrollAmount = 0;
    const itemWidth = carousel.querySelector('.carousel-item').offsetWidth;
    const maxScroll = carousel.scrollWidth - carousel.offsetWidth;

    rightArrow.addEventListener('click', () => {
        if (scrollAmount + itemWidth * 5 < maxScroll) {
            scrollAmount += itemWidth * 5;
        } else {
            scrollAmount = maxScroll;
        }
        carousel.style.transform = `translateX(-${scrollAmount}px)`;
    });

    leftArrow.addEventListener('click', () => {
        if (scrollAmount - itemWidth * 5 > 0) {
            scrollAmount -= itemWidth * 5;
        } else {
            scrollAmount = 0;
        }
        carousel.style.transform = `translateX(-${scrollAmount}px)`;
    });

    // Swipe / Drag
    let isDown = false;
    let startX;
    let scrollLeft;

    const startDrag = (x) => {
        isDown = true;
        startX = x - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
        carousel.classList.add('active');
    };

    const endDrag = () => {
        isDown = false;
        carousel.classList.remove('active');
    };

    const moveDrag = (x) => {
        if (!isDown) return;
        const walk = (x - startX) * 2;
        carousel.scrollLeft = scrollLeft - walk;
    };

    carousel.addEventListener('mousedown', (e) => startDrag(e.pageX));
    carousel.addEventListener('mouseup', endDrag);
    carousel.addEventListener('mouseleave', endDrag);
    carousel.addEventListener('mousemove', (e) => moveDrag(e.pageX));

    carousel.addEventListener('touchstart', (e) => startDrag(e.touches[0].pageX));
    carousel.addEventListener('touchend', endDrag);
    carousel.addEventListener('touchmove', (e) => moveDrag(e.touches[0].pageX));
}

// Inicializa todos os carrosseis da página
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.carousel-container').forEach(container => initCarousel(container));
});
