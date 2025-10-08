const pool = require("../../config/pool-conexoes");

module.exports = {
listarLocais: async () => {
  try {
    const [locais] = await pool.query(`
      SELECT 
        l.local_id,
        l.local_nome AS nome,
        l.local_foto AS foto,
        l.local_endereco AS endereco,
        l.local_latitude AS latitude,
        l.local_longitude AS longitude,
        GROUP_CONCAT(e.esporte_nome SEPARATOR ', ') AS esportes
      FROM locais l
      LEFT JOIN local_esporte le ON l.local_id = le.local_id
      LEFT JOIN esportes e ON le.esporte_id = e.esporte_id
      GROUP BY l.local_id;
    `);

    return locais; // retorna o array de locais
  } catch (err) {
    console.error('Erro ao listar locais:', err);
    return []; // retorna array vazio em caso de erro
  }
},
listarEsportes: async () => {
  try {
    const [esportes] = await pool.query('SELECT esporte_id, esporte_nome FROM esportes');
    return esportes; // retorna o array de esportes
  } catch (err) {
    console.error('Erro ao listar esportes:', err);
    return []; // retorna array vazio em caso de erro
  }
},
gravarSolicitacao: async (dados, userid) => {
  const conexao = await pool.getConnection();
  try {
    await conexao.beginTransaction();

    // Normaliza o campo de esportes
    const esportesSelecionados = Array.isArray(dados.esporte)
      ? dados.esporte
      : dados.esporte
      ? [dados.esporte]
      : [];

    // Insere a solicitação principal na tabela 'locais'
    const querySolicitacao = `
      INSERT INTO locais
      (local_nome, local_endereco, local_foto, local_latitude, local_longitude)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    // Assegura que as coordenadas sejam passadas (latitude e longitude)
    const valuesSolicitacao = [
      dados.nome,
      dados.endereco,
      dados.foto,
      dados.latitude,  // precisa vir nos dados
      dados.longitude, // precisa vir nos dados
    ];

    const [resultadoSolicitacao] = await conexao.query(querySolicitacao, valuesSolicitacao);
    const solicitacaoId = resultadoSolicitacao.insertId;

    // Se houver esportes selecionados, insere na tabela de ligação 'local_esporte'
    if (esportesSelecionados.length > 0) {
      const valuesEsportes = esportesSelecionados.map((id) => [solicitacaoId, id]);

      await conexao.query(
        `INSERT INTO local_esporte (local_id, esporte_id) VALUES ?`,
        [valuesEsportes]
      );
    }

    // Comita a transação
    await conexao.commit();
    console.log("Solicitação gravada com sucesso!");
    return { sucesso: true, solicitacaoId };
  } catch (e) {
    // Em caso de erro, faz rollback da transação
    await conexao.rollback();
    console.error("Erro ao gravar solicitação:", e);
    throw e;
  } finally {
    // Libera a conexão
    conexao.release();
  }
}
}