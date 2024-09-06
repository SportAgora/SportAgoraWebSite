document.querySelectorAll('.coracao, .coracao-mini').forEach(coracao => {
    coracao.addEventListener('click', () => {
      coracao.classList.toggle('liked');
    });
  });