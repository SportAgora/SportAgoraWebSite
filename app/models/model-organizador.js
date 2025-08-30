// models/model-organizador.js
const pool = require("../../config/pool-conexoes");
const moment = require("moment");
 
const OrganizadorModel = {
createEvent: async (eventData, ingressoID) => {
    try {
      const { user, categoria, assunto, nome, foto, data_inicio, data_fim, data_hora, cep, numero, complemento, descricao} = eventData;
      // Preparar os dados para inserção
      const event = {
        usuario_id: user,
        categoria_id: categoria,
        assunto_id: assunto,
        evento_nome : nome,
        evento_foto: foto,
        evento_data_publicacao: moment().format('YYYY-MM-DD HH:mm:ss'),
        evento_data_inicio: data_inicio,
        evento_data_fim: data_fim,
        evento_data_hora: data_hora,
        evento_descricao: descricao,
        evento_endereco_numero: numero,
        evento_endereco_complemento: complemento,
        evento_endereco_cep: cep,
        ingresso_id: ingressoID
      };
      
      const eventFields = Object.keys(event).filter(key => event[key] !== null);
      const eventValues = eventFields.map(field => event[field]);
      const eventPlaceholders = eventFields.map(() => '?').join(', ');
     
      const eventQuery = `INSERT INTO eventos (${eventFields.join(', ')}) VALUES (${eventPlaceholders})`;
     
      const [eventResult] = await pool.query(eventQuery, eventValues);
      return eventResult.insertId;
    } catch (error) {
      console.error("Erro ao criar evento: \n", error);
      throw error;
    }
  },

   CategoriasFindAll: async () => {
      try {
        const query = "SELECT * FROM categoria";
        const [rows] = await pool.query(query);
        return rows.length > 0 ? rows : null;
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
        throw error;
      }
    },

    AssuntosFindAll: async () => {
      try {
        const query = "SELECT * FROM assunto";
        const [rows] = await pool.query(query);
        return rows.length > 0 ? rows : null;
      } catch (error) {
        console.error("Erro ao buscar assuntos:", error);
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

    return result.insertId;
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
};
 
module.exports = OrganizadorModel;