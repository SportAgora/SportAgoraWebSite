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
},
  buscarInscricaoPorId: async (inscricaoId) => {
    try {
      const query = `
       SELECT 
    ie.*,
    u.usu_nome AS usuario_nome,
    u.usu_email AS usuario_email,
    e.evento_id,
    e.usuario_id AS evento_dono_id, -- renomeado
    e.esporte_id,
    e.evento_nome,
    e.evento_foto,
    e.evento_data_hora,
    e.evento_endereco_cep,
    e.evento_endereco_numero,
    e.evento_endereco_complemento,
    e.evento_endereco_uf,
    e.evento_endereco_cidade,
    e.evento_ativo,
    i.ingresso_nome,
    i.ingresso_valor,
    i.ingresso_meia
    FROM inscricao_evento ie
    JOIN usuarios u ON ie.usuario_id = u.usu_id
    JOIN eventos e ON ie.evento_id = e.evento_id
    JOIN ingressos i ON ie.ingresso_id = i.ingresso_id AND ie.evento_id = i.evento_id
    WHERE ie.inscricao_id = ?
      `;
      const [rows] = await pool.query(query, [inscricaoId]);
      return rows.length > 0 ? rows[0] : null;
    }
    catch (error) {
      console.error("Erro ao buscar inscrição por ID:", error);
      throw error;
    }
  },
  validarInscricao: async (inscricaoId) => {
    try {
      const queryCheck = "SELECT * FROM inscricao_evento WHERE inscricao_id = ? AND pagamento_feito = true";
      const [rowsCheck] = await pool.query(queryCheck, [inscricaoId]);
      if (rowsCheck.length === 0) return false;
      const query = "UPDATE inscricao_evento SET entrada_validada = true WHERE inscricao_id = ?";
      await pool.query(query, [inscricaoId]);
      return true;
    } catch (error) {
      console.error("Erro ao validar inscrição:", error);
      throw error;
    }
  }

}