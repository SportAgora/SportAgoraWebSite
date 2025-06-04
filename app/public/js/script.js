
const loginButton = document.querySelector('.login-button');
const menuPanel = document.getElementById('menu-panel');

loginButton.addEventListener('click', () => {
    menuPanel.classList.toggle('open');

    if (menuPanel.classList.contains('open')) {
        menuPanel.style.display = 'block';
    } else {
        setTimeout(() => {
            menuPanel.style.display = 'none';
        }, 300);
    }
});


const hamburgerMenu = document.querySelector('.hamburger-menu');
const mobileMenu = document.getElementById('mobile-menu');

hamburgerMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
});

document.addEventListener('DOMContentLoaded', function() {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const loginButton = document.getElementById('login-button');
    const menuPanel = document.getElementById('menu-panel');
    const mobileSearchBar = document.getElementById('mobile-search-bar');

    hamburgerMenu.addEventListener('click', function() {
        if (mobileMenu.classList.contains('open')) {
            mobileMenu.classList.remove('open');
        } else {
            mobileMenu.classList.add('open');
        }
    });

    loginButton.addEventListener('click', function() {
        if (menuPanel.classList.contains('open')) {
            menuPanel.classList.remove('open');
        } else {
            menuPanel.classList.add('open');
        }
    });
});

