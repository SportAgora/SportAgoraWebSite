// models/model-organizador.js
const pool = require("../../config/pool-conexoes");
const moment = require("moment");
const bcrypt = require("bcryptjs");
 
const OrganizadorModel = {
createEvent: async (eventData, ingressoData) => {
    try {
      const { user, categoria, assunto, nome, foto, data_inicio, data_fim, data_hora, cep, numero, complemento, descricao} = eventData;
      const { ing_nome, ing_valor, ing_quantidade, ing_meia} = ingressoData;

      const ingresso = {
        ingresso_nome: ing_nome,
        ingresso_valor: ing_valor,
        ingresso_quantidade: ing_quantidade,
        ingresso_meia: ing_meia
      };
 
      // Construir a query dinamicamente
      const fields = Object.keys(ingresso).filter(key => ingresso[key] !== null);
      const values = fields.map(field => ingresso[field]);
      const placeholders = fields.map(() => '?').join(', ');
     
      const query = `INSERT INTO ingresso (${fields.join(', ')}) VALUES (${placeholders})`;
     
      const [result] = await pool.query(query, values);

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
        ingresso_id: result.insertId
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
  }
};
 
module.exports = OrganizadorModel;