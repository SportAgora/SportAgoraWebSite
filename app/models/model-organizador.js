// models/model-organizador.js
const pool = require("../../config/pool-conexoes");
const moment = require("moment");
 
const OrganizadorModel = {
    createEvent: async (eventData) => {
  try {
    const { 
      user, esporte, nome, foto, data_hora, 
      cep, numero, complemento, uf, cidade, descricao, rua, estado
    } = eventData;

    const event = {
      usuario_id: user,
      esporte_id: esporte,
      evento_nome: nome,
      evento_foto: foto,
      evento_data_publicacao: moment().format('YYYY-MM-DD HH:mm:ss'),
      evento_data_hora: data_hora,
      evento_descricao: descricao,
      evento_endereco_rua: rua,
      evento_endereco_numero: numero,
      evento_endereco_complemento: complemento,
      evento_endereco_uf: uf,
      evento_endereco_cidade: cidade,
      evento_endereco_estado: estado,
      evento_endereco_cep: cep
    };

    const fields = Object.keys(event).filter(k => event[k] !== null);
    const values = fields.map(k => event[k]);
    const placeholders = fields.map(() => '?').join(', ');

    const query = `
      INSERT INTO eventos (${fields.join(', ')})
      VALUES (${placeholders})
    `;

    const [result] = await pool.query(query, values);
    return result.insertId;

  } catch (error) {
    console.error("Erro ao criar evento:\n", error);
    return false;
  }
},

   EsportFindAll: async () => {
      try {
        const query = "SELECT * FROM esportes";
        const [rows] = await pool.query(query);
        return rows.length > 0 ? rows : null;
      } catch (error) {
        console.error("Erro ao buscar esportes:", error);
        throw error;
      }
    },

    createIngresso: async (ingressos, eventoId) => {
  try {
    const ingressosFormatados = [];

    ingressos.nome.forEach((nome, index) => {
      const valor = parseFloat(ingressos.valor[index]);
      const quantidade = parseInt(ingressos.quantidade[index], 10);
      const meia = ingressos.meia[index] === 'true';

      // Sempre cria o ingresso inteiro
      ingressosFormatados.push({
        ingresso_nome: nome,
        ingresso_valor: valor,
        ingresso_quantidade: quantidade,
        ingresso_meia: 0, // inteiro
        evento_id: eventoId
      });

      // Se for meia, cria também o ingresso meia
      if (meia) {
        ingressosFormatados.push({
          ingresso_nome: nome,
          ingresso_valor: valor / 2,
          ingresso_quantidade: quantidade,
          ingresso_meia: 1, // meia
          evento_id: eventoId
        });
      }
    });

    if (ingressosFormatados.length === 0) return null;

    const fields = ['ingresso_nome', 'ingresso_valor', 'ingresso_quantidade', 'ingresso_meia', 'evento_id'];
    const placeholders = ingressosFormatados.map(() => '(?, ?, ?, ?, ?)').join(', ');
    const values = [];

    ingressosFormatados.forEach(i => {
      values.push(i.ingresso_nome, i.ingresso_valor, i.ingresso_quantidade, i.ingresso_meia, i.evento_id);
    });

    const query = `INSERT INTO ingressos (${fields.join(', ')}) VALUES ${placeholders}`;
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
     
      const query = `DELETE FROM ingressos WHERE ingresso_id = ?`;
     
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
      AND evento_ativo = 1
      ORDER BY evento_data_publicacao DESC
      LIMIT ? OFFSET ?
    `;

    // 2. Conta total de eventos do usuário
    const queryTotal = `
      SELECT COUNT(*) AS total 
      FROM eventos 
      WHERE usuario_id = ? AND evento_ativo = 1
    `;

    const [eventos] = await pool.query(queryEventos, [usuarioId, limite, offset]);
    const [totalResult] = await pool.query(queryTotal, [usuarioId]);

    if (eventos.length === 0) return { eventos: [], total: 0 };

    // 3. Busca ingressos de cada evento (sem tabela intermediária)
    const eventosComIngressos = await Promise.all(eventos.map(async (evento) => {
      const queryIngressos = `
        SELECT * FROM ingressos
        WHERE evento_id = ?
      `;
      const [ingressos] = await pool.query(queryIngressos, [evento.evento_id]);

      return { ...evento, ingressos };
    }));

    return {
      eventos: eventosComIngressos,
      total: totalResult[0].total
    };

  } catch (error) {
    console.error("Erro ao buscar eventos do usuário com paginação:\n", error);
    throw error;
  }
},
  visualizarEventoId: async (id) => {
    try {
      const query = "SELECT * FROM eventos WHERE evento_id = ? and evento_ativo = 1";
      const [rows] = await pool.query(query, [id]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
      throw error;
    }
  },
  
  visualizarIngressoEventoId: async (id) => {
  try {
    const query = `
      SELECT * FROM ingressos
      WHERE evento_id = ?
    `;
    const [rows] = await pool.query(query, [id]);
    return rows.length > 0 ? rows : null;
  } catch (error) {
    console.error("Erro ao buscar ingressos do evento:", error);
    throw error;
  }
},
  atualizarEvento: async (evento_id, dados) => {
  try {
    await pool.query(
      `UPDATE eventos SET 
        esporte_id = ?, 
        evento_nome = ?, 
        evento_foto = ?, 
        evento_data_hora = ?, 
        evento_descricao = ?, 
        evento_endereco_cep = ?, 
        evento_endereco_rua = ?,
        evento_endereco_numero = ?, 
        evento_endereco_complemento = ?, 
        evento_endereco_uf = ?, 
        evento_endereco_cidade = ?,
        evento_endereco_estado = ?
      WHERE evento_id = ?`,
      [
        dados.esporte_id,
        dados.evento_nome,
        dados.evento_foto,
        dados.evento_data_hora,
        dados.evento_descricao,
        dados.evento_endereco_cep,
        dados.evento_endereco_rua,
        dados.evento_endereco_numero,
        dados.evento_endereco_complemento,
        dados.evento_endereco_uf,
        dados.evento_endereco_cidade,
        dados.evento_endereco_estado,
        evento_id
      ]
    );

    return true;
  } catch (err) {
    console.error("Erro ao atualizar evento:", err);
    throw err;
  }
},
EventoApagar: async (id) => {
    try {
      const query = "UPDATE eventos SET evento_ativo = 0 WHERE evento_id = ?"
      const [row] = await pool.query(query, [id])
      return true;
    } catch(e) {
      console.error('Erro ao apagar evento: ', e)
      throw e;
    }
  },
  contarUsuariosEventoId: async (id) => {
    try{
      const query = `SELECT COUNT(usuario_id) AS total_inscritos
                    FROM inscricao_evento
                    WHERE evento_id = ?;`
      const [rows] = await pool.query(query,[id])
      return rows.length > 0 ? rows[0] : null;
    } catch(e){
      console.error("Erro ao contar quantas pessoas se inscreveram no evento: ", e)
      throw e;
    }
  }
  
  
};
 
module.exports = OrganizadorModel;