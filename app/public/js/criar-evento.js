// Quill editor
const quill = new Quill('#editor', {
    modules: { toolbar: '#toolbar' },
    theme: 'snow',
    placeholder: 'Adicione aqui a descrição do seu evento...'
  });
  
  // Preview da imagem
  const imageInput = document.getElementById('image-input');
  const imageDrop = document.getElementById('image-drop');
  const imagePreview = document.getElementById('image-preview');
  
  imageDrop.addEventListener('click', () => imageInput.click());
  
  imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    const reader = new FileReader();
  
    reader.onload = function (e) {
      imagePreview.src = e.target.result;
      imagePreview.style.display = 'block';
      document.getElementById('image-text').style.display = 'none';
    };
  
    if (file) reader.readAsDataURL(file);
  });
  
  // CEP auto-complete
  document.getElementById('cep').addEventListener('blur', function () {
    const cep = this.value.replace(/\D/g, '');
    if (cep.length !== 8) return;
  
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then(res => res.json())
      .then(data => {
        if (!data.erro) {
          document.getElementById('rua').value = data.logradouro;
          document.getElementById('bairro').value = data.bairro;
          document.getElementById('cidade').value = data.localidade;
          document.getElementById('estado').value = data.uf;
        }
      });
  });
  
  // Meia entrada toggle
  let meiaEntradaAtivo = false;
  
  document.getElementById('meia-entrada').addEventListener('click', () => {
    meiaEntradaAtivo = !meiaEntradaAtivo;
    document.getElementById('meia-entrada').textContent = meiaEntradaAtivo
      ? 'Meia-entrada ativada'
      : 'Adicionar meia-entrada';
  });
  
  // Publicar ingresso
  document.getElementById('publicar-ingresso').addEventListener('click', () => {
    const nome = document.getElementById('nome-ingresso').value;
    const valor = parseFloat(document.getElementById('valor-ingresso').value);
    const quantidade = parseInt(document.getElementById('quantidade-ingresso').value);
    const tabela = document.querySelector('#ingresso-tabela tbody');
    const novaLinha = document.createElement('tr');
  
    let valorMeia = meiaEntradaAtivo ? (valor / 2).toFixed(2) : '-';
  
    novaLinha.innerHTML = `
      <td>${nome}${meiaEntradaAtivo ? ' (meia-entrada)' : ''}</td>
      <td>${valor.toFixed(2)}</td>
      <td>${quantidade}</td>
      <td>${meiaEntradaAtivo ? `R$ ${valorMeia}` : 'Não'}</td>
    `;
  
    tabela.appendChild(novaLinha);
  });
  
  // Publicar evento
  document.getElementById('evento-form').addEventListener('submit', function (e) {
    e.preventDefault();
    alert('Evento publicado com sucesso!');
    window.location.href = 'pagina-final.html';
  });
  