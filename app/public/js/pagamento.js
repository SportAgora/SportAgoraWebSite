document.getElementById('pagamento-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita o envio do formulário
    
    // Coleta os valores dos campos
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const cpf = document.getElementById('cpf').value;
    const cardNumber = document.getElementById('card-number').value;
    const expiryDate = document.getElementById('expiry-date').value;
    const securityCode = document.getElementById('security-code').value;
    
    // Verifica se todos os campos estão preenchidos
    if (!firstName || !lastName || !cpf || !cardNumber || !expiryDate || !securityCode) {
        alert('Por favor, preencha todos os campos.');
        return;
    }
    
    // Validação de CPF (muito básica)
    const cpfPattern = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (!cpfPattern.test(cpf)) {
        alert('CPF inválido. O formato deve ser XXX.XXX.XXX-XX.');
        return;
    }
    
    // Validação do Número do Cartão (muito básica)
    const cardPattern = /^\d{4} \d{4} \d{4} \d{4}$/;
    if (!cardPattern.test(cardNumber)) {
        alert('Número do cartão inválido. O formato deve ser XXXX XXXX XXXX XXXX.');
        return;
    }
    
    // Validação da Data de Validade
    const expiryPattern = /^\d{2}\/\d{2}$/;
    if (!expiryPattern.test(expiryDate)) {
        alert('Data de validade inválida. O formato deve ser MM/AA.');
        return;
    }
    
    // Validação do Código de Segurança
    const securityPattern = /^\d{3}$/;
    if (!securityPattern.test(securityCode)) {
        alert('Código de segurança inválido. Deve ter 3 dígitos.');
        return;
    }
    
    // Se todas as validações passarem
    alert('Formulário enviado com sucesso!');
});
