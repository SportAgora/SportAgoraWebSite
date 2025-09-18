// models/model-organizador.js
const pool = require("../../config/pool-conexoes");
const moment = require("moment");
 
const OrganizadorModel = {
    createEvent: async (eventData, ingressoIDs) => {
      try {
        const { 
          user, esporte,  nome, foto, 
          data_inicio, data_fim, data_hora, 
          cep, numero, complemento, descricao
        } = eventData;

        // 1. Monta objeto do evento (sem ingresso_id)
        const event = {
          usuario_id: user,
          esporte_id: esporte,
          evento_nome: nome,
          evento_foto: foto,
          evento_data_publicacao: moment().format('YYYY-MM-DD HH:mm:ss'),
          evento_data_inicio: data_inicio,
          evento_data_fim: data_fim,
          evento_data_hora: data_hora,
          evento_descricao: descricao,
          evento_endereco_numero: numero,
          evento_endereco_complemento: complemento,
          evento_endereco_cep: cep
        };

        // 2. Prepara query dinâmica
        const eventFields = Object.keys(event).filter(key => event[key] !== null);
        const eventValues = eventFields.map(field => event[field]);
        const eventPlaceholders = eventFields.map(() => '?').join(', ');

        const eventQuery = `
          INSERT INTO eventos (${eventFields.join(', ')}) 
          VALUES (${eventPlaceholders})
        `;

        // 3. Insere evento na tabela
        const [eventResult] = await pool.query(eventQuery, eventValues);
        const eventId = eventResult.insertId;

        // 4. Relaciona ingressos (se existirem)
        if (ingressoIDs && ingressoIDs.length > 0) {
          const placeholders = ingressoIDs.map(() => '(?, ?)').join(', ');
          const values = [];
          
          ingressoIDs.forEach(ingId => {
            values.push(eventId, ingId);
          });

          const relQuery = `
            INSERT INTO evento_ingresso (evento_id, ingresso_id) 
            VALUES ${placeholders}
          `;
          await pool.query(relQuery, values);
        }

        // 5. Retorna ID do evento criado
        return eventId;

      } catch (error) {
        console.error("Erro ao criar evento: \n", error);
        return false;
      }
    },

   EsportFindAll: async () => {
      try {
        const query = "SELECT * FROM esporte";
        const [rows] = await pool.query(query);
        return rows.length > 0 ? rows : null;
      } catch (error) {
        console.error("Erro ao buscar esportes:", error);
        throw error;
      }
    },

    createIngresso: async (ingressos) => {
  try {
    const ingressosFormatados = ingressos.nome.map((nome, index) => ({
      ingresso_nome: nome,
      ingresso_valor: parseFloat(ingressos.valor[index]),
      ingresso_quantidade: parseInt(ingressos.quantidade[index], 10),
      ingresso_meia: ingressos.meia[index] === 'true'
    }));

    if (ingressosFormatados.length === 0) return null;

    const fields = ['ingresso_nome', 'ingresso_valor', 'ingresso_quantidade', 'ingresso_meia'];
    const placeholders = ingressosFormatados.map(() => '(?, ?, ?, ?)').join(', ');
    const values = [];

    ingressosFormatados.forEach(i => {
      values.push(i.ingresso_nome, i.ingresso_valor, i.ingresso_quantidade, i.ingresso_meia);
    });

    const query = `INSERT INTO ingresso (${fields.join(', ')}) VALUES ${placeholders}`;
    const [result] = await pool.query(query, values);

    // pegar todos os IDs gerados
    const firstId = result.insertId;
    const total = result.affectedRows;
    const ids = Array.from({ length: total }, (_, i) => firstId + i);

    return ids;
  } catch (error) {
    console.error("Erro ao criar ingressos: \n", error);
    throw error;
  }
},
  ApagarIngresso: async (ingressoId) => {
    try {
     
      const query = `DELETE FROM ingresso WHERE ingresso_id = ?`;
     
      const [result] = await pool.query(query, ingressoId);

      return result
    } catch (error) {
      console.error("Erro ao criar evento: \n", error);
      throw error;
    }
  },
  visualizarEventosUsuarioPaginacao: async (usuarioId, offset, limite) => {
    try {
      // 1. Busca eventos do usuário com paginação
      const queryEventos = `
        SELECT * FROM eventos
        WHERE usuario_id = ?
        ORDER BY evento_data_publicacao DESC
        LIMIT ? OFFSET ?
      `;
  
      // 2. Consulta para obter o total de eventos do usuário
      const queryTotal = `
        SELECT COUNT(*) as total FROM eventos WHERE usuario_id = ?
      `;
  
      // Executar as consultas
      const [eventos] = await pool.query(queryEventos, [usuarioId, limite, offset]);
      const [totalResult] = await pool.query(queryTotal, [usuarioId]);
  
      if (eventos.length === 0) return { eventos: [], total: 0 };
  
      // 3. Para cada evento, buscar ingressos associados
      const eventosComIngressos = await Promise.all(eventos.map(async (evento) => {
        const queryIngressos = `
          SELECT i.* FROM ingresso i
          INNER JOIN evento_ingresso ei ON i.ingresso_id = ei.ingresso_id
          WHERE ei.evento_id = ?
        `;
        const [ingressos] = await pool.query(queryIngressos, [evento.evento_id]);
  
        return {
          ...evento,
          ingressos
        };
      }));
  
      return {
        eventos: eventosComIngressos,
        total: totalResult[0].total
      };
  
    } catch (error) {
      console.error("Erro ao buscar eventos do usuário com paginação: \n", error);
      throw error;
    }
  }
  
};
 
module.exports = OrganizadorModel;