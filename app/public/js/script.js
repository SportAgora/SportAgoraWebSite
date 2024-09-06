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
