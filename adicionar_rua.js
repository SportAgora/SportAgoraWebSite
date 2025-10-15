const mysql = require('mysql2/promise');
const axios = require('axios');

async function atualizarRuas() {
  // Conectar ao banco
  const connection = await mysql.createConnection({
    host: 'mainline.proxy.rlwy.net',      // ajuste se não for localhost
    user: 'root',           // seu usuário MySQL
    password: 'DzYQGqUAyrpqLnzcfiVtBAlHEjAGPuAH',  // sua senha
    database: 'railway',
    port: 35602
  });

  try {
    // Buscar eventos com seus CEPs
    const [eventos] = await connection.execute('SELECT evento_id, evento_endereco_cep FROM eventos');

    for (const evento of eventos) {
      const cep = evento.evento_endereco_cep;

      // Limpar o CEP (ex: remover traços)
      const cepLimpo = cep.replace(/\D/g, '');

      // Consultar ViaCEP
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);

        if (!response.data.erro) {
          const rua = response.data.logradouro || null;

          if (rua) {
            // Atualizar o campo evento_endereco_rua
            await connection.execute(
              'UPDATE eventos SET evento_endereco_rua = ? WHERE evento_id = ?',
              [rua, evento.evento_id]
            );

            console.log(`Evento ${evento.evento_id} atualizado com rua: ${rua}`);
          } else {
            console.log(`CEP ${cepLimpo} não retornou logradouro`);
          }
        } else {
          console.log(`CEP ${cepLimpo} não encontrado`);
        }
      } catch (err) {
        console.error(`Erro ao consultar CEP ${cepLimpo}:`, err.message);
      }
    }
  } catch (err) {
    console.error('Erro ao acessar o banco:', err.message);
  } finally {
    await connection.end();
  }
}

atualizarRuas();