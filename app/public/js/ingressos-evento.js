document.addEventListener("DOMContentLoaded", () => {
  const precos = {};
  const quantidades = {};
  const ingressosSelecionados = {};

  document.querySelectorAll('.ingresso-linha').forEach(linha => {
    const span = linha.querySelector('span[id^="quantidade-"]');
    const precoEl = linha.querySelector('.preco-ingresso');
    if (!span || !precoEl) return;

    const id = span.id.replace('quantidade-', '');
    quantidades[id] = 0;
    let precoTexto = precoEl.textContent.trim()
      .replace(/\s/g, '')
      .replace('R$', '')
      .replace('.', '')
      .replace(',', '.');
    precos[id] = parseFloat(precoTexto) || 0;
  });

  window.alterarQuantidade = function(id, delta, event) {
    if (event) event.preventDefault();
    const novaQuantidade = quantidades[id] + delta;
    if (novaQuantidade >= 0 && novaQuantidade <= 3) {
      quantidades[id] = novaQuantidade;
      document.getElementById(`quantidade-${id}`).innerText = novaQuantidade;
      ingressosSelecionados[id] = novaQuantidade;
      atualizarHidden();
      atualizarTotal();
      atualizarBotaoInscrever();
    }
  };

  function atualizarHidden() {
    const filtrados = Object.entries(ingressosSelecionados)
      .filter(([_, qtd]) => qtd > 0)
      .map(([id, qtd]) => ({ id, qtd }));
    document.getElementById('ingressosSelecionados').value = JSON.stringify(filtrados);
  }

  function atualizarTotal() {
    let total = 0;
    for (const id in quantidades) {
      total += quantidades[id] * precos[id];
    }
    document.getElementById("valor-total").innerText =
      "R$ " + total.toFixed(2).replace(".", ",");
  }

  // --- Botão Inscrever-se ---
  const btnInscrever = document.getElementById('btnInscrever');

  function atualizarBotaoInscrever() {
    const totalSelecionado = Object.values(quantidades).reduce((a, b) => a + b, 0);
    if (totalSelecionado > 0) {
      btnInscrever.disabled = false;
      btnInscrever.style.opacity = 1;
    } else {
      btnInscrever.disabled = true;
      btnInscrever.style.opacity = 0.5;
    }
  }

  btnInscrever.addEventListener('click', function(e) {
    const totalSelecionado = Object.values(quantidades).reduce((a, b) => a + b, 0);
    if (totalSelecionado === 0) {
      e.preventDefault();
      new Notify({
        status: 'warning',
        title: 'Aviso',
        text: 'Você precisa selecionar pelo menos um ingresso antes de se inscrever!',
        effect: 'fade',
        speed: 300,
        autoclose: true,
        autotimeout: 3000
      });
    }
  });

  // Inicializa botão desativado
  atualizarBotaoInscrever();
 
});

 //  Denunciar
  function abrirModalDenuncia() {
    document.getElementById('modal-denuncia').style.display = 'flex';
  }

  function fecharModalDenuncia() {
    document.getElementById('modal-denuncia').style.display = 'none';
  }

  function confirmarModalDenuncia() {
    document.getElementById('modal-denuncia').style.display = 'none';
    document.getElementById('denuncia-form').submit();
  }

  // Fechar ao clicar fora do conteúdo
  window.addEventListener('click', function(event) {
    const modal = document.getElementById('modal-denuncia');
    if (event.target === modal) {
      fecharModalDenuncia();
    }})