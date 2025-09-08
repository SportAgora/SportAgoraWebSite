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
}

module.exports = PaginaModel;