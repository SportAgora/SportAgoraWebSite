const pool = require("../../config/pool-conexoes");
const { apagarLocal } = require("../controllers/pratiqueController");

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
buscarLocaisPorNome: async (termoPesquisa) => {
  try {
    const termoBusca = termoPesquisa ? `%${termoPesquisa}%` : '%';

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
      WHERE l.local_nome LIKE ?
      GROUP BY l.local_id;
    `, [termoBusca]);

    return locais;
  } catch (err) {
    console.error('Erro ao buscar locais:', err);
    return [];
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

    // Normaliza o campo de esportes (string ou array)
    const esportesSelecionados = Array.isArray(dados.esportes)
  ? dados.esportes
  : dados.esportes
  ? [dados.esportes]
  : [];

    // Inserção na tabela 'solicitacoes'
    const querySolicitacao = `
      INSERT INTO solicitacoes 
      (solicitacao_nome, solicitacao_endereco, solicitacao_foto, solicitacao_link, usuario_id)
      VALUES (?, ?, ?, ?, ?)
    `;

    const valuesSolicitacao = [
      dados.nome,         // solicitacao_nome
      dados.endereco,     // solicitacao_endereco
      dados.foto,         // solicitacao_foto
      dados.link,         // solicitacao_link
      userid              // usuario_id (usu_id)
    ];

    const [resultadoSolicitacao] = await conexao.query(querySolicitacao, valuesSolicitacao);
    const solicitacaoId = resultadoSolicitacao.insertId;

    // Inserção na tabela 'solicitacoes_esportes'
    if (esportesSelecionados.length > 0) {
      const valuesEsportes = esportesSelecionados.map(id => [solicitacaoId, parseInt(id)]);

      await conexao.query(
        `INSERT INTO solicitacoes_esportes (solicitacao_id, esporte_id) VALUES ?`,
        [valuesEsportes]
      );
    }

    await conexao.commit();
    console.log("Solicitação gravada com sucesso!");
    return { sucesso: true, solicitacaoId };

  } catch (e) {
    await conexao.rollback();
    console.error("Erro ao gravar solicitação:", e);
    throw e;
  } finally {
    conexao.release();
  }
}
}