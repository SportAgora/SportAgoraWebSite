const pool = require("../../config/pool-conexoes");

const PaginaModel = {
    EventosListarComPaginacao: async (offset, limite) => {
          try {
            const queryEventos = `
                    SELECT * FROM eventos
                    WHERE evento_ativo = 1
                    ORDER BY evento_data_publicacao
                    LIMIT ? OFFSET ?
            
                  `;
                 
                  // Consulta para obter o total
                  const queryTotal = "SELECT COUNT(*) as total FROM eventos WHERE evento_ativo = 1";
                 
                  // Executar as consultas
                  const [eventos] = await pool.query(queryEventos, [limite, offset]);
                  const [totalResult] = await pool.query(queryTotal);
                 
                  return {
                    eventos,
                    total: totalResult[0].total
                  };
          } catch (error) {
            console.error("Erro ao buscar eventos:", error);
            throw error;
          }
        },
    EventosListarComPaginacaoFiltroRapido: async (offset, limite, id) => {
          try {
            const queryEventos = `
                    SELECT * FROM eventos
                    WHERE esporte_id = ? and evento_ativo = 1
                    ORDER BY evento_data_publicacao
                    LIMIT ? OFFSET ?
            
                  `;
                 
                  // Consulta para obter o total de eventos
                  const queryTotal = "SELECT COUNT(*) as total FROM eventos WHERE esporte_id = ? and evento_ativo = 1";
                 
                  // Executar as consultas
                  const [eventos] = await pool.query(queryEventos, [id,limite, offset]);
                  const [totalResult] = await pool.query(queryTotal, [id]);
                 
                  return {
                    eventos,
                    total: totalResult[0].total
                  };
          } catch (error) {
            console.error("Erro ao buscar eventos:", error);
            throw error;
          }
        },
    buscarPagPorId: async (id) => {
          try {
            const query = "SELECT * FROM eventos WHERE evento_id = ? and evento_ativo = 1";
            const [rows] = await pool.query(query, [id]);
            return rows.length > 0 ? rows[0] : null;
          } catch (error) {
            console.error("Erro ao buscar evento por ID:", error);
            throw error;
          }
        },
    buscarIngressosPorEvento: async (eventoId) => {
    try {
      const query = `
        SELECT *
        FROM ingresso
        INNER JOIN evento_ingresso 
          ON evento_ingresso.ingresso_id = ingresso.ingresso_id
        WHERE evento_ingresso.evento_id = ?
      `;
      const [rows] = await pool.query(query, [eventoId]);
      return rows;
    } catch (error) {
      console.error("Erro ao buscar ingressos do evento:", error);
      throw error;
    }
  },
  EsportFindAll: async () => {
    try {
      const query = "SELECT * FROM esporte";
      const [rows] = await pool.query(query);
      return rows;
    } catch (error) {
      console.error("Erro ao buscar esportes:", error);
      throw error;
    }
  },
  buscarEsporteId: async (id) => {
    try {
      const query = "SELECT * FROM esporte WHERE esporte_id = ?";
      const [rows] = await pool.query(query, [id]);
      return rows[0];
    } catch (error) {
      console.error("Erro ao buscar esportes:", error);
      throw error;
    }
  },
  buscarEventos: async (termo) => {
  try {
    const query = `
      SELECT * 
      FROM eventos
      WHERE evento_nome LIKE ? 
      OR evento_descricao LIKE ?
      AND evento_ativo = 1
      ORDER BY evento_data_publicacao DESC
    `;
    const likeTermo = `%${termo}%`;
    const [rows] = await pool.query(query, [likeTermo, likeTermo]);
    return rows;
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    throw error;
  }
},
  verificarDenuncia: async (evento, user) => {
    try{
      const query = `
        SELECT * FROM denuncia
        WHERE den_evento_id = ? AND den_usuario_id = ?
      `;
      const [rows] = await pool.query(query, [evento, user]);
      return rows.length > 0;
    } catch(error){
      console.error("Erro ao verificar denúncia:", error);
      throw error;
    }
  },
  criarDenuncia: async (evento, user, desc) => {
    try{
      const query = `
        INSERT INTO denuncia (den_usuario_id, den_evento_id, den_descricao)
        VALUES (?, ?, ?)
      `;
      const [result] = await pool.query(query, [user, evento, desc]);
      return result.insertId;
    } catch(error){
      console.error("Erro ao registrar denúncia:", error);
      throw error;
    }
  }
}

module.exports = PaginaModel;