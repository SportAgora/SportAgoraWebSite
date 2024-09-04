const loginButton = document.querySelector('.login-button');
const menuPanel = document.getElementById('menu-panel');

loginButton.addEventListener('click', () => {
    menuPanel.style.display = menuPanel.style.display === 'block' ? 'none' : 'block';
});

window.addEventListener('click', (event) => {
    if (!loginButton.contains(event.target) && !menuPanel.contains(event.target)) {
        menuPanel.style.display = 'none';
    }
});