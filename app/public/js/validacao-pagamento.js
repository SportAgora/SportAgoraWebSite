document.addEventListener('DOMContentLoaded', function() {
  const cpfInput = document.getElementById('cpf');
  const telefoneInput = document.getElementById('telefone');
  const form = document.querySelector('.formulario');
  const btnProximo = document.getElementById('btnProximo');
  const pagamentoSection = document.getElementById('pagamento');

  // Máscara CPF: 000.000.000-00
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

  // Máscara Telefone: (DD)XXXXX-XXXX
  telefoneInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 6) {
      value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1)$2-$3");
    } else if (value.length > 2) {
      value = value.replace(/(\d{2})(\d+)/, "($1)$2");
    }

    e.target.value = value;
  });

  // Ajusta valor do telefone antes de enviar
  form.addEventListener('submit', function() {
    let telefone = telefoneInput.value.replace(/\D/g, '');
    if (telefone.length > 11) telefone = telefone.slice(-11);
    telefoneInput.value = telefone;
  });

  // Validação ao clicar em Próximo
  // btnProximo.addEventListener('click', function(e) {
  //   e.preventDefault();
  //   const telefone = telefoneInput.value.replace(/\D/g, '');
  //   const cpf = cpfInput.value.replace(/\D/g, '');
  //   const nascimento = document.getElementById('nascimento').value;
  //   const genero = document.getElementById('genero').value;

  //   if (!telefone) return alert('Informe o telefone.');
  //   if (!cpf || cpf.length !== 11) return alert('CPF inválido. Insira 11 números.');
  //   if (!nascimento) return alert('Informe a data de nascimento.');
  //   if (!genero) return alert('Selecione o gênero.');

  //   pagamentoSection.classList.remove('hidden');
  //   btnProximo.disabled = true;
  // });
});
