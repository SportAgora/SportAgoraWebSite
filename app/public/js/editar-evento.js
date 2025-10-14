/* editar-evento.js
   JS para Editar Evento:
   - inicializa Quill
   - atualiza campo hidden descricao antes do submit
   - preview de imagem para #foto → .foto-preview-existente
   - compatível com CropperJS (se existir modal/cropper)
   - busca CEP via ViaCEP
   - manipulação de ingressos (adicionar/remover)
   - outras pequenas melhorias
*/

document.addEventListener('DOMContentLoaded', function () {

  /* ---------------- Quill editor ---------------- */
  (function initQuill() {
    const editorEl = document.getElementById('editor');
    const descricaoInput = document.getElementById('descricao');
    if (editorEl) {
      const quill = new Quill('#editor', {
        modules: { toolbar: '#toolbar' },
        theme: 'snow',
        placeholder: 'Adicione aqui a descrição do seu evento...'
      });
      // preencher se já existir valor
      if (descricaoInput && descricaoInput.value) {
        quill.root.innerHTML = descricaoInput.value;
      }
      // Antes de enviar o form, atualiza o hidden
      const formulario = document.querySelector('#evento-form');
      if (formulario) {
        formulario.addEventListener('submit', function () {
          if (descricaoInput) descricaoInput.value = quill.root.innerHTML;
        });
      }
    }
  })();


  /* ---------------- Preview de imagem (foto do evento) ----------------
     - elemento file input: #foto
     - preview container: .foto-preview-existente (espera um <img>)
     - se existir Cropper modal (id="cropperModal" e #cropperImage) usa ele, senão faz preview simples.
  */
  (function imagePreviewAndCrop() {
    const input = document.getElementById('foto');
    const previewContainer = document.querySelector('.foto-preview-existente');
    if (!input || !previewContainer) return;

    // tenta encontrar img existente dentro do container, ou cria
    let img = previewContainer.querySelector('img');
    if (!img) {
      img = document.createElement('img');
      img.alt = 'Preview da foto do local';
      previewContainer.appendChild(img);
    }

    // Se existir cropper modal/elementos (compatibilidade com editar-perfil)
    const cropperModal = document.getElementById('cropperModal');
    const cropperImage = document.getElementById('cropperImage');
    let cropperInstance = null;
    let currentFileForCrop = null;

    input.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      // leitura para preview imediato
      const reader = new FileReader();
      reader.onload = function (evt) {
        const url = evt.target.result;
        // se houver cropper modal e imagem para cropper, use-o
        if (cropperModal && cropperImage && typeof Cropper !== 'undefined') {
          // abre modal com cropper
          cropperImage.src = url;
          cropperModal.style.display = 'flex';
          // destrói cropper se existir
          if (cropperInstance) cropperInstance.destroy();
          // cria novo cropper com razão quadrada leve (ofereça retângulo se preferir)
          cropperInstance = new Cropper(cropperImage, {
            aspectRatio: 16 / 10,
            viewMode: 1,
            background: false,
            autoCropArea: 1,
            movable: true,
            zoomable: true
          });
          currentFileForCrop = file;
        } else {
          // sem cropper: apenas preview
          img.src = url;
          img.onload = () => URL.revokeObjectURL(url); // limpeza opcional
        }
      };
      reader.readAsDataURL(file);
    });

    // Caso exista cropper modal com botões padrão em outra página (editar-perfil),
    // tentamos conectar aos botões se existirem.
    const confirmCrop = document.getElementById('confirmCrop');
    const cancelCrop = document.getElementById('cancelCrop');
    const closeModal = document.querySelector('.close');

    function closeCropperModal() {
      if (cropperInstance) { cropperInstance.destroy(); cropperInstance = null; }
      if (cropperModal) cropperModal.style.display = 'none';
      // limpa imagem do cropperImage por segurança
      if (cropperImage) cropperImage.src = '';
      currentFileForCrop = null;
    }

    if (confirmCrop) {
      confirmCrop.addEventListener('click', () => {
        if (!cropperInstance) return;
        const canvas = cropperInstance.getCroppedCanvas({
          width: 1200,
          height: 750,
          imageSmoothingQuality: 'high'
        });
        canvas.toBlob(blob => {
          // cria URL para preview imediato
          const url = URL.createObjectURL(blob);
          img.src = url;

          // substitui o File input com o blob recortado
          const newFile = new File([blob], (currentFileForCrop && currentFileForCrop.name) ? currentFileForCrop.name : 'foto-evento.png', { type: 'image/png' });
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(newFile);
          input.files = dataTransfer.files;

          // fecha modal
          closeCropperModal();
        }, 'image/png');
      });
    }

    if (cancelCrop) {
      cancelCrop.addEventListener('click', () => closeCropperModal());
    }
    if (closeModal) {
      closeModal.addEventListener('click', () => closeCropperModal());
    }
    // fechar modal clicando fora
    window.addEventListener('click', (ev) => {
      if (ev.target === cropperModal) closeCropperModal();
    });

  })();


  /* ---------------- CEP auto-complete (ViaCEP) ---------------- */
  (function cepAutocomplete() {
    const cepInput = document.getElementById('cep');
    if (!cepInput) return;

    const get = id => document.getElementById(id);
    const setVal = (id, v) => { const el = get(id); if (el) el.value = v || ''; };
    const toggleSpinner = (show) => {
      const sp = get('spinner');
      if (sp) sp.style.display = show ? 'inline-block' : 'none';
    };
    const limpaCampos = () => ['rua','bairro','cidade','estado'].forEach(id => setVal(id, ''));

    cepInput.addEventListener('input', (e) => {
      // formata como 00000-000
      const digits = e.target.value.replace(/\D/g, '').slice(0, 8);
      e.target.value = digits.replace(/(\d{5})(\d)/, '$1-$2');
    });

    async function buscaCEP() {
      try {
        const cep = cepInput.value.replace(/\D/g, '');
        if (cep.length !== 8) { limpaCampos(); return; }
        toggleSpinner(true);
        const resp = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();
        if (data.erro) { limpaCampos(); return; }
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
    // busca se houver valor ao carregar
    if (cepInput.value) buscaCEP();
  })();


  /* ---------------- Ingressos (adicionar/remover) ----------------
     - Espera elementos com ids usados no HTML base: publicar-ingresso, nome-ingresso, valor-ingresso, quantidade-ingresso, meia-entrada
     - tabela com id #ingresso-tabela
  */
  (function ingressosHandler() {
    const publicarBtn = document.getElementById('publicar-ingresso');
    if (!publicarBtn) return; // se não houver seção de ingressos, sai
    let meiaEntradaAtivo = false;

    const meiaBtn = document.getElementById('meia-entrada');
    if (meiaBtn) {
      meiaBtn.addEventListener('click', () => {
        meiaEntradaAtivo = !meiaEntradaAtivo;
        meiaBtn.textContent = meiaEntradaAtivo ? 'Meia-entrada ativada' : 'Adicionar meia-entrada';
        meiaBtn.classList.toggle('active', meiaEntradaAtivo);
      });
    }

    function criarLinhaIngresso(nome, valor, quantidade, meiaEntrada) {
      const tabela = document.querySelector('#ingresso-tabela tbody');
      if (!tabela) return;
      const novaLinha = document.createElement('tr');
      let valorMeia = meiaEntrada ? (valor / 2).toFixed(2) : '-';
      const ingressoId = Date.now() + Math.floor(Math.random() * 1000);
      novaLinha.setAttribute("data-id", ingressoId);
      novaLinha.innerHTML = `
        <td>${nome}${meiaEntrada ? ' (meia-entrada)' : ''}</td>
        <td>R$ ${parseFloat(valor).toFixed(2)}</td>
        <td>${quantidade}</td>
        <td>${meiaEntrada ? `R$ ${valorMeia}` : 'Não'}</td>
        <td><button type="button" class="remover-ingresso">❌ Remover</button></td>
      `;
      tabela.appendChild(novaLinha);

      // adiciona hidden inputs ao form para envio
      const form = document.getElementById('evento-form');
      if (form) {
        form.insertAdjacentHTML('beforeend',
          `<input type="hidden" data-id="${ingressoId}" name="ingressos[nome][]" value="${escapeHtml(nome)}">
           <input type="hidden" data-id="${ingressoId}" name="ingressos[valor][]" value="${parseFloat(valor).toFixed(2)}">
           <input type="hidden" data-id="${ingressoId}" name="ingressos[quantidade][]" value="${quantidade}">
           <input type="hidden" data-id="${ingressoId}" name="ingressos[meia][]" value="${meiaEntrada ? 1 : 0}">`
        );
      }
    }

    // proteção simples contra XSS em inserção de hidden
    function escapeHtml(text) {
      return String(text).replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m]));
    }

    publicarBtn.addEventListener('click', (ev) => {
      ev.preventDefault();
      const nome = document.getElementById('nome-ingresso')?.value?.trim();
      const valorRaw = document.getElementById('valor-ingresso')?.value;
      const quantidadeRaw = document.getElementById('quantidade-ingresso')?.value;
      const valor = parseFloat(String(valorRaw).replace(',', '.'));
      const quantidade = parseInt(quantidadeRaw, 10);

      if (!nome || isNaN(valor) || valor <= 0 || isNaN(quantidade) || quantidade <= 0) {
        alert("Preencha todos os campos corretamente!");
        return;
      }
      criarLinhaIngresso(nome, valor, quantidade, meiaEntradaAtivo);

      // limpa campos
      if (document.getElementById('nome-ingresso')) document.getElementById('nome-ingresso').value = "";
      if (document.getElementById('valor-ingresso')) document.getElementById('valor-ingresso').value = "";
      if (document.getElementById('quantidade-ingresso')) document.getElementById('quantidade-ingresso').value = "";
      meiaEntradaAtivo = false;
      if (meiaBtn) { meiaBtn.textContent = 'Adicionar meia-entrada'; meiaBtn.classList.remove('active'); }
    });

    // remover ingressos (delegation)
    const tabelaWrap = document.querySelector('#ingresso-tabela');
    if (tabelaWrap) {
      tabelaWrap.addEventListener('click', (e) => {
        if (e.target.classList.contains('remover-ingresso')) {
          const linha = e.target.closest('tr');
          if (!linha) return;
          const ingressoId = linha.getAttribute('data-id');
          linha.remove();
          // remove hidden inputs
          document.querySelectorAll(`#evento-form input[data-id="${ingressoId}"]`).forEach(i => i.remove());
        }
      });
    }

    // se existir array global ingressos (injetado pelo servidor), adiciona-os
    if (typeof ingressos !== 'undefined' && Array.isArray(ingressos)) {
      ingressos.forEach(i => {
        try {
          adicionaIngressoPreenchido(i);
        } catch (err) { console.warn('erro ao adicionar ingresso inicial', err); }
      });
    }

    function adicionaIngressoPreenchido(i) {
      const nome = i.ingresso_nome || i.nome || '';
      const valor = parseFloat(i.ingresso_valor || i.valor || 0);
      const quantidade = i.ingresso_quantidade || i.quantidade || 1;
      const meia = (i.ingresso_meia == 1 || i.ingresso_meia === true);
      criarLinhaIngresso(nome, valor, quantidade, meia);
    }

  })();


  /* ---------------- fallback / melhorias pequenas ---------------- */
  (function smallEnhancements() {
    // faz com que botões com classe .publicar-evento ou .public-btn não quebrem layout em telas pequenas
    document.querySelectorAll('.publicar-evento, .public-btn').forEach(btn => {
      btn.addEventListener('click', () => btn.blur());
    });
  })();

}); // fim DOMContentLoaded

/* Trecho a ser adicionado/substituído no editar-evento.js
   Garante recorte 16:9 com zoom manual e recorte opcional.
*/
document.addEventListener('DOMContentLoaded', function () {
  (function setupEventImageCropper() {
    const input = document.getElementById('foto'); 
    const previewContainer = document.querySelector('.foto-preview-existente');
    if (!input || !previewContainer) return;

    let previewImg = previewContainer.querySelector('img');
    if (!previewImg) {
      previewImg = document.createElement('img');
      previewImg.alt = 'Preview da foto do local';
      previewContainer.appendChild(previewImg);
    }

    const cropperModal = document.getElementById('cropperModal');
    const cropperImage = document.getElementById('cropperImage');
    const confirmBtn = document.getElementById('confirmCrop');
    const closeBtn = document.querySelector('.close');

    let cropperInstance = null;
    let originalFile = null;

    input.addEventListener('change', (ev) => {
      const file = ev.target.files && ev.target.files[0];
      if (!file) return;
      originalFile = file;

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;

        if (cropperModal && cropperImage && typeof Cropper !== 'undefined') {
          cropperImage.src = dataUrl;
          openModal();

          if (cropperInstance) cropperInstance.destroy();

          cropperImage.onload = () => {
            cropperInstance = new Cropper(cropperImage, {
              aspectRatio: 16 / 9,
              viewMode: 1,
              background: false,
              autoCropArea: 0.9,
              movable: true,
              zoomable: true,
              scalable: false,
              rotatable: false,
              dragMode: 'move'
            });
          };
        } else {
          // fallback preview
          previewImg.src = dataUrl;
        }
      };
      reader.readAsDataURL(file);
    });

    // Confirmar crop
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        if (!cropperInstance) return;

        const canvas = cropperInstance.getCroppedCanvas({
          width: 1200,
          height: Math.round(1200 * 9 / 16),
          imageSmoothingQuality: 'high'
        });

        canvas.toBlob((blob) => {
          if (!blob) return;

          const blobUrl = URL.createObjectURL(blob);
          previewImg.src = blobUrl;

          const newFile = new File([blob], originalFile?.name || 'evento-foto.png', { type: blob.type });
          const dt = new DataTransfer();
          dt.items.add(newFile);
          input.files = dt.files;

          destroyCropper();
          closeModal();
        }, 'image/png');
      });
    }

    // Bloquear fechamento sem recortar
    function warnMandatoryCrop() {
      alert("O recorte da imagem é obrigatório. Por favor, confirme o recorte antes de continuar.");
    }

    if (closeBtn) closeBtn.addEventListener('click', warnMandatoryCrop);
    window.addEventListener('click', (ev) => {
      if (ev.target === cropperModal) warnMandatoryCrop();
    });
    window.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape' && cropperModal.style.display === 'flex') warnMandatoryCrop();
    });

    function openModal() {
      if (!cropperModal) return;
      cropperModal.style.display = 'flex';
      cropperModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
  if (!cropperModal) return;
  cropperModal.style.display = 'none';
  cropperModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = 'auto'; // <-- troque '' por 'auto'
}

    function destroyCropper() {
      if (cropperInstance) {
        try { cropperInstance.destroy(); } catch (e) {}
        cropperInstance = null;
      }
      if (cropperImage) cropperImage.src = '';
      originalFile = null;
    }
  })();
});

window.addEventListener('load', () => {
  const confirmCrop = document.getElementById('confirmCrop');
  const cancelCrop = document.getElementById('cancelCrop');
  const cropperModal = document.getElementById('cropperModal');

  function restoreScroll() {
    document.body.style.overflow = 'auto';
  }

  if (confirmCrop) confirmCrop.addEventListener('click', restoreScroll);
  if (cancelCrop) cancelCrop.addEventListener('click', restoreScroll);
  if (cropperModal) {
    cropperModal.addEventListener('transitionend', restoreScroll);
  }
});