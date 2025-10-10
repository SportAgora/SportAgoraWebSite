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
            FROM ingressos
            WHERE evento_id = ?
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
            const query = `SELECT * FROM ingressos WHERE ingresso_id IN (${placeholders})`;
            const [rows] = await pool.query(query, idsNumericos);
            return rows.map(r => {
            const info = ids.find(i => i.id == r.ingresso_id);
            return { ...r, tipo: info?.tipo, qtd: info?.qtd };
            });
          } catch (error) {
            console.error("Erro ao buscar ingressos:", error);
            throw error;
          }
        },
      criarInscricaoEvento: async (dados, ingressos) => {
      try {
      if (!ingressos || ingressos.length === 0) return [];

      const query = `
        INSERT INTO inscricao_evento 
        (usuario_id, evento_id, ingresso_id, telefone, cpf, genero, pagamento_feito)
        VALUES (?, ?, ?, ?, ?, ?, false)
      `;

      const results = [];

      for (const ing of ingressos) {
        const qtd = ing.qtd || 1; // se não tiver qtd, assume 1
      for (let i = 0; i < qtd; i++) {
        const [result] = await pool.query(query, [
          dados.usuario_id,
          dados.evento_id,
          ing.ingresso_id,
          dados.telefone,
          dados.cpf.replace(/\D/g, ""),
          dados.genero,
        ]);
        results.push(result.insertId);
      }
      }

      return results;
    } catch (error) {
      console.error("Erro ao criar inscrições:", error);
      throw error;
    }
  },
  ativarInscricaoPagamento: async (inscricaoIds) => { 
  try {
    if (!inscricaoIds || inscricaoIds.length === 0) return;
    const placeholders = inscricaoIds.map(() => '?').join(',');
    const query = `
      UPDATE inscricao_evento 
      SET pagamento_feito = true 
      WHERE inscricao_id IN (${placeholders})
    `;
    await pool.query(query, inscricaoIds);
    return true;
  } catch (error) {
    console.error("Erro ao ativar inscrições:", error);
    throw error;
  }
}

}