document.addEventListener("DOMContentLoaded", function() {

  // Quill editor
  const quill = new Quill('#editor', {
      modules: { toolbar: '#toolbar' },
      theme: 'snow',
      placeholder: 'Adicione aqui a descrição do seu evento...'
  });

  // Preenche o editor com o valor do hidden "descricao" se existir
  const descricaoInput = document.getElementById("descricao");
  if (descricaoInput && descricaoInput.value) {
      quill.root.innerHTML = descricaoInput.value;
  }

  // Atualiza o hidden input antes de enviar o formulário
  const formulario = document.querySelector('#evento-form');
  formulario.addEventListener('submit', function () {
      descricaoInput.value = quill.root.innerHTML;
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
const cepInput = document.getElementById('cep');
if (cepInput) {
  const get = (id) => document.getElementById(id);
  const setVal = (id, v) => { const el = get(id); if (el) el.value = v || ''; };
  const toggleSpinner = (show) => {
    const sp = get('spinner');
    if (sp) sp.style.display = show ? 'block' : 'none';
  };
  const limpaCampos = () => {
    ['rua','bairro','cidade','estado'].forEach(id => setVal(id, ''));
  };

  cepInput.addEventListener('input', (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 8);
    e.target.value = digits.replace(/(\d{5})(\d)/, '$1-$2');
  });

  async function buscaCEP() {
    try {
      const cep = cepInput.value.replace(/\D/g, '');
      if (cep.length !== 8) {
        limpaCampos();
        return;
      }

      toggleSpinner(true);

      const resp = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

      const data = await resp.json();
      if (data.erro) {
        limpaCampos();
        return;
      }

      setVal('rua', data.logradouro);
      setVal('bairro', data.bairro);
      setVal('cidade', data.localidade);
      setVal('estado', data.uf);
    } catch (err) {
      console.error('Erro no CEP:', err);
      limpaCampos();
    } finally {
      toggleSpinner(false);
    }
  }

  cepInput.addEventListener('blur', buscaCEP);

  // **chama a busca se já houver valor no CEP ao carregar a página**
  if (cepInput.value) buscaCEP();
}

  // Meia entrada toggle
  let meiaEntradaAtivo = false;
  const meiaEntradaBtn = document.getElementById('meia-entrada');

  meiaEntradaBtn.addEventListener('click', () => {
    meiaEntradaAtivo = !meiaEntradaAtivo;
    
    meiaEntradaBtn.classList.toggle('active');
    meiaEntradaBtn.textContent = meiaEntradaAtivo
      ? 'Meia-entrada ativada'
      : 'Adicionar meia-entrada';
  });
  
  // Publicar ingresso
  document.getElementById('publicar-ingresso').addEventListener('click', () => {
    const nome = document.getElementById('nome-ingresso').value;
    const valor = parseFloat(document.getElementById('valor-ingresso').value);
    const quantidade = parseInt(document.getElementById('quantidade-ingresso').value);

    if (!nome || isNaN(valor) || valor <= 0 || isNaN(quantidade) || quantidade <= 0) {
      alert("Preencha todos os campos corretamente!");
      return;
    }

    const tabela = document.querySelector('#ingresso-tabela tbody');
    const novaLinha = document.createElement('tr');
    let valorMeia = meiaEntradaAtivo ? (valor / 2).toFixed(2) : '-';
    const ingressoId = Date.now();

    novaLinha.setAttribute("data-id", ingressoId);
    novaLinha.innerHTML = `
      <td>${nome}${meiaEntradaAtivo ? ' (meia-entrada)' : ''}</td>
      <td>${valor.toFixed(2)}</td>
      <td>${quantidade}</td>
      <td>${meiaEntradaAtivo ? `R$ ${valorMeia}` : 'Não'}</td>
      <td>
        <button type="button" class="remover-ingresso">❌ Remover</button>
      </td>
    `;
    tabela.appendChild(novaLinha);

    const form = document.getElementById('evento-form');
    form.insertAdjacentHTML('beforeend', `
      <input type="hidden" data-id="${ingressoId}" name="ingressos[nome][]" value="${nome}">
      <input type="hidden" data-id="${ingressoId}" name="ingressos[valor][]" value="${valor}">
      <input type="hidden" data-id="${ingressoId}" name="ingressos[quantidade][]" value="${quantidade}">
      <input type="hidden" data-id="${ingressoId}" name="ingressos[meia][]" value="${meiaEntradaAtivo}">
    `);

    document.getElementById('nome-ingresso').value = "";
    document.getElementById('valor-ingresso').value = "";
    document.getElementById('quantidade-ingresso').value = "";
    meiaEntradaAtivo = false;
    meiaEntradaBtn.classList.remove('active');
    meiaEntradaBtn.textContent = 'Adicionar meia-entrada';
  });

  // Remover ingresso
  document.querySelector('#ingresso-tabela').addEventListener('click', (e) => {
  if (e.target.classList.contains('remover-ingresso')) {
    const linha = e.target.closest('tr');
    const ingressoId = linha.getAttribute("data-id");
    linha.remove();
    // Corrigido: pegar os inputs dentro do form correto
    document.querySelectorAll(`#evento-form input[data-id="${ingressoId}"]`)
      .forEach(input => input.remove());
  }
  });

});
