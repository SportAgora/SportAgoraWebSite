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
}
}