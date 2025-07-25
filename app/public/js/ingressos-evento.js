  const precos = {
    pista: 40.00,
    meia: 20.00
  };

  const quantidades = {
    pista: 0,
    meia: 0
  };

  function alterarQuantidade(tipo, delta) {
    const novaQuantidade = quantidades[tipo] + delta;
    if (novaQuantidade >= 0 && novaQuantidade <= 3) {
      quantidades[tipo] = novaQuantidade;
      document.getElementById(`quantidade-${tipo}`).innerText = novaQuantidade;
      atualizarTotal();
    }
  }

  function atualizarTotal() {
    let total = 0;
    for (const tipo in quantidades) {
      total += quantidades[tipo] * precos[tipo];
    }
    document.getElementById("valor-total").innerText = "R$ " + total.toFixed(2).replace(".", ",");
  }

