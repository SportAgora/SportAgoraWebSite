     //CODIGO CARROSEL

     document.addEventListener("DOMContentLoaded", function() {
        const carousel = document.querySelector('.carousel');
        const items = document.querySelectorAll('.carousel-item');
        const leftArrow = document.querySelector('.left-arrow');
        const rightArrow = document.querySelector('.right-arrow');
    
        let index = 0;
        const itemsPerPage = 5;
        const totalItems = items.length;
    
        function updateCarousel() {
            const offset = index * -20; 
            carousel.style.transform = `translateX(${offset}%)`;
        }
        
        rightArrow.addEventListener('click', () => {
            if (index < totalItems - itemsPerPage) {
                index++;
            } else {
                index = 0; 
            }
            updateCarousel();
        });
    
        leftArrow.addEventListener('click', () => {
            if (index > 0) {
                index--;
            } else {
                index = totalItems - itemsPerPage; 
            }
            updateCarousel();
        });
    });    

