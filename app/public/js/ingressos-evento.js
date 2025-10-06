document.addEventListener("DOMContentLoaded", () => {
  const precos = {};
  const quantidades = {};
  const ingressosSelecionados = {};

  // Pega todas as linhas de ingresso
  document.querySelectorAll('.ingresso-linha').forEach(linha => {
    const span = linha.querySelector('span[id^="quantidade-"]');
    const precoEl = linha.querySelector('.preco-ingresso');
    if (!span || !precoEl) return;

    const id = span.id.replace('quantidade-', '');
    quantidades[id] = 0;
    let precoTexto = precoEl.textContent.trim()
      .replace(/\s/g, '')        // remove espaços
      .replace('R$', '')         // remove o símbolo
      .replace('.', '')          // remove separador de milhar
      .replace(',', '.');        // converte vírgula em ponto
    let preco = parseFloat(precoTexto) || 0;
    precos[id] = preco;
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

  // --- Scroll até ingressos no mobile ---
  const btnIngressos = document.getElementById("btn-ingressos-mobile");
  const boxDireita = document.getElementById("box-direita");

  if (btnIngressos && boxDireita) {
    btnIngressos.addEventListener("click", () => {
      boxDireita.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
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
    }
  });