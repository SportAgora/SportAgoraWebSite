document.addEventListener("DOMContentLoaded", () => {
  const precos = {};
  const quantidades = {};

  // Pega todas as linhas de ingresso
  document.querySelectorAll('.ingresso-linha').forEach(linha => {
    const span = linha.querySelector('span[id^="quantidade-"]');
    const precoEl = linha.querySelector('.preco-ingresso');
    if (!span || !precoEl) return;

    const id = span.id.replace('quantidade-', '');
    quantidades[id] = 0;
    let preco = parseFloat(precoEl.innerText.replace('R$ ', '').replace(',', '.'));
    precos[id] = preco;
  });

  window.alterarQuantidade = function(id, delta) {
    const novaQuantidade = quantidades[id] + delta;
    if (novaQuantidade >= 0 && novaQuantidade <= 3) {
      quantidades[id] = novaQuantidade;
      document.getElementById(`quantidade-${id}`).innerText = novaQuantidade;
      atualizarTotal();
    }
  };

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
