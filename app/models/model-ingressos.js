const pool = require("../../config/pool-conexoes");

module.exports= {
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
      buscarIngressos: async (ids) => {
          try {
            if (!ids || ids.length === 0) return [];
      
            const idsNumericos = ids.map(i => i.id);
            const placeholders = ids.map(() => '?').join(',');
            const query = `SELECT * FROM ingresso WHERE ingresso_id IN (${placeholders})`;
            const [rows] = await pool.query(query, idsNumericos);
            return rows.map(r => {
            const info = ids.find(i => i.id == r.ingresso_id);
            return { ...r, tipo: info?.tipo, qtd: info?.qtd };
            });
          } catch (error) {
            console.error("Erro ao buscar ingressos:", error);
            throw error;
          }
        }
}