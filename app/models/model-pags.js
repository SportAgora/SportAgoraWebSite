const pool = require("../../config/pool-conexoes");
const moment = require("moment");
const bcrypt = require("bcryptjs");

const PaginaModel = {
    EventosListarComPaginacao: async (offset, limite) => {
          try {
            const queryEventos = `
                    SELECT * FROM eventos
                    ORDER BY evento_data_publicacao
                    LIMIT ? OFFSET ?
            
                  `;
                 
                  // Consulta para obter o total de usuários
                  const queryTotal = "SELECT COUNT(*) as total FROM usuario";
                 
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
    buscarPagPorId: async (id) => {
          try {
            const query = "SELECT * FROM eventos WHERE evento_id = ?";
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
  }
}

module.exports = PaginaModel;