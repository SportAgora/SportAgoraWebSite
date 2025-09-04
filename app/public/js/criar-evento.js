

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
document.addEventListener('DOMContentLoaded', () => {
  const cepInput = document.getElementById('cep');

  if (!cepInput) {
    console.error('Campo #cep não encontrado.');
    return;
  }

  const get = (id) => document.getElementById(id);
  const setVal = (id, v) => { const el = get(id); if (el) el.value = v || ''; };
  const toggleSpinner = (show) => {
    const sp = get('spinner');
    if (sp) sp.style.display = show ? 'block' : 'none';
  };
  const limpaCampos = () => {
    ['rua','bairro','cidade','estado'].forEach(id => setVal(id, ''));
  };

  // Máscara de CEP enquanto digita
  cepInput.addEventListener('input', (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 8);
    e.target.value = digits.replace(/(\d{5})(\d)/, '$1-$2');
  });

  async function buscaCEP() {
    try {
      const cep = cepInput.value.replace(/\D/g, '');
      if (cep.length !== 8) {
        alert('CEP inválido!');
        return;
      }

      toggleSpinner(true);
      console.log('Buscando CEP:', cep);

      const resp = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

      const data = await resp.json();
      console.log('ViaCEP:', data);

      if (data.erro) {
        alert('CEP não encontrado!');
        limpaCampos();
        return;
      }

      setVal('rua', data.logradouro);
      setVal('bairro', data.bairro);
      setVal('cidade', data.localidade);
      setVal('estado', data.uf);
      setVal('complemento', data.complemento);
    } catch (err) {
      console.error('Erro no CEP:', err);
      alert('Erro ao buscar o CEP!');
    } finally {
      toggleSpinner(false);
    }
  }

  cepInput.addEventListener('blur', buscaCEP);
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

   // 🔒 Validação antes de prosseguir
  if (!nome || isNaN(valor) || valor <= 0 || isNaN(quantidade) || quantidade <= 0) {
    alert("Preencha todos os campos corretamente!");
    return; // não executa o resto
  }

  const tabela = document.querySelector('#ingresso-tabela tbody');
  const novaLinha = document.createElement('tr');

  let valorMeia = meiaEntradaAtivo ? (valor / 2).toFixed(2) : '-';

  // 👉 cria um id único
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

  // 👉 aqui usa o mesmo form que você já tem
  const form = document.getElementById('evento-form');
  form.insertAdjacentHTML('beforeend', `
    <input type="hidden" data-id="${ingressoId}" name="ingressos[nome][]" value="${nome}">
    <input type="hidden" data-id="${ingressoId}" name="ingressos[valor][]" value="${valor}">
    <input type="hidden" data-id="${ingressoId}" name="ingressos[quantidade][]" value="${quantidade}">
    <input type="hidden" data-id="${ingressoId}" name="ingressos[meia][]" value="${meiaEntradaAtivo}">
  `);

  // Limpar campos
  document.getElementById('nome-ingresso').value = "";
  document.getElementById('valor-ingresso').value = "";
  document.getElementById('quantidade-ingresso').value = "";
  meiaEntradaAtivo = false;
  document.getElementById('meia-entrada').textContent = 'Adicionar meia-entrada';
});

// 👉 Evento de clique nos botões de remover
document.querySelector('#ingresso-tabela').addEventListener('click', (e) => {
  if (e.target.classList.contains('remover-ingresso')) {
    const linha = e.target.closest('tr');
    const ingressoId = linha.getAttribute("data-id");

    // Remove a linha da tabela
    linha.remove();

    // Remove os inputs hidden correspondentes
    document.querySelectorAll(`#form-ingresso input[data-id="${ingressoId}"]`)
      .forEach(input => input.remove());
  }
});


  const formulario = document.querySelector('#evento-form');
  formulario.addEventListener('submit', function () {
    document.getElementById('descricao').value = quill.root.innerHTML;
  });