const btnProximo = document.getElementById('btnProximo');
const btnConfirmar = document.getElementById('btnConfirmar');
const pagamentoSection = document.getElementById('pagamento');
var cpfInput = document.getElementById('cpf');

btnProximo.addEventListener('click', () => {
  const telefone = document.getElementById('telefone').value.trim();
  const cpf = cpfInput.value.replace(/\D/g, '');
  const nascimento = document.getElementById('nascimento').value;
  const genero = document.getElementById('genero').value;

  if (!telefone) {
    alert('Informe o telefone.');
    return;
  }

  if (!cpf || cpf.length !== 11) {
    alert('CPF inválido. Insira 11 números.');
    return;
  }

  if (!nascimento) {
    alert('Informe a data de nascimento.');
    return;
  }

  if (!genero) {
    alert('Selecione o gênero.');
    return;
  }

  pagamentoSection.classList.remove('hidden');
  btnProximo.disabled = true;
});

btnConfirmar.addEventListener('click', () => {
  const nomeCartao = document.getElementById('nomeCartao').value.trim();
  const numeroCartao = document.getElementById('numeroCartao').value.trim();
  const validadeCartao = document.getElementById('validadeCartao').value.trim();
  const codigoSeguranca = document.getElementById('codigoSeguranca').value.trim();

  if (!nomeCartao || !numeroCartao || !validadeCartao || !codigoSeguranca) {
    alert('Preencha todos os dados do pagamento.');
    return;
  }

  alert('Pagamento confirmado! Redirecionando...');
  window.location.href = 'confirmacao.html';
});

// Máscara automática para CPF: 000.000.000-00
cpfInput.addEventListener('input', function(e) {
  let value = e.target.value.replace(/\D/g, '');
  if (value.length > 11) value = value.slice(0, 11);

  value = value.replace(/(\d{3})(\d)/, '$1.$2')
               .replace(/(\d{3})(\d)/, '$1.$2')
               .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

  e.target.value = value;
});


document.addEventListener('DOMContentLoaded', function() {
  var cpfInput = document.getElementById('cpf');
  cpfInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 9) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
    } else if (value.length > 6) {
      value = value.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
    } else if (value.length > 3) {
      value = value.replace(/(\d{3})(\d+)/, "$1.$2");
    }

    e.target.value = value;
  });
});
