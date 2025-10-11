// models/model-usuario.js
const pool = require("../../config/pool-conexoes");
const moment = require("moment");
const bcrypt = require("bcryptjs");
 
const uploadFile = require("../helpers/uploader")("./app/public/imagens/pratique/");

const AdmModel = {
    UserFindId: async (id) => {
    try {
      const query = "SELECT * FROM usuarios WHERE usu_id = ?";
      const [rows] = await pool.query(query, [id]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error("Erro ao buscar usuário por ID:", error);
      throw error;
    }
  },
 
  // Verificar se email já existe
  UserFindByEmail: async (email) => {
    try {
      const query = "SELECT * FROM usuarios WHERE usu_email = ?";
      const [rows] = await pool.query(query, [email]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error("Erro ao verificar email:", error);
      throw error;
    }
  },

  UserFindByName: async (nome) => {
    try {
      const query = "SELECT * FROM usuarios WHERE usu_nome = ?";
      const [rows] = await pool.query(query, [nome]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error("Erro ao verificar nome:", error);
      throw error;
    }
  },
 
  // Criar novo usuário
  UserCreate: async (userData) => {
    try {
      const { nome, email, senha, foto, banner, tipo } = userData;
 
      // Preparar os dados para inserção
      const data = {
        usu_nome : nome,
        usu_email:  email,
        usu_senha: senha, // Já deve estar com hash
        perf_nome: nome,
        usu_foto:foto,
        usu_banner:banner,
        tipo:tipo,
        usu_status: 1 // Ativo por padrão
      };
 
      // Construir a query dinamicamente
      const fields = Object.keys(data).filter(key => data[key] !== null);
      const values = fields.map(field => data[field]);
      const placeholders = fields.map(() => '?').join(', ');
     
      const query = `INSERT INTO usuarios (${fields.join(', ')}) VALUES (${placeholders})`;
     
      const [result] = await pool.query(query, values);
      return result.insertId;
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      throw error;
    }
  },
 
  // Atualizar usuário
  UserAtualizar: async (id, userData) => {
    try {
      const { nome, email, data_nascimento, tipo, foto, banner, senha, status} = userData;
 
      // Preparar os dados para atualização
      const data = {
        usu_nome: nome,
        usu_email: email,
        usu_senha:senha,
        usu_nasc: data_nascimento ? moment(data_nascimento).format('YYYY-MM-DD') : null,
        usu_foto: foto,
        usu_banner: banner,
        tipo: tipo,
        usu_status: status
      };
 
      // Construir a query dinamicamente
      const updates = Object.entries(data)
        .filter(([_, value]) => value !== undefined)
        .map(([key, _]) => `${key} = ?`);
     
      const values = Object.entries(data)
        .filter(([_, value]) => value !== undefined)
        .map(([_, value]) => value);
     
      // Adicionar o ID no final dos valores
      values.push(id);
     
      const query = `UPDATE usuarios SET ${updates.join(', ')} WHERE usu_id= ?`;
     
      const [result] = await pool.query(query, values);
      return result;
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      throw error;
    }
  },
 
  // Excluir usuário
  UserExcluir: async (id) => {
    try {
      const query = "UPDATE usuarios SET usu_status = 0 WHERE usu_id = ?";
      const [result] = await pool.query(query, [id]);
      return "Apagado com sucesso"
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      throw error;
    }
  },
 
  // Alterar senha do usuário
  UserAlterarSenha: async (id, novaSenha) => {
    try {
      // Hash da nova senha
      const senhaHash = await bcrypt.hash(novaSenha, 10);
     
      const query = "UPDATE usuarios SET senha = ? WHERE id = ?";
      const [result] = await pool.query(query, [senhaHash, id]);
     
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      throw error;
    }
  },
    // Listar usuários com paginação
  UserListarComPaginacao: async (offset, limite) => {
    try {
      // Consulta para obter os usuários com paginação
      const queryUsuarios = `
        SELECT * FROM usuarios
        WHERE usu_status = 1
        ORDER BY usu_nome
        LIMIT ? OFFSET ?

      `;
     
      // Consulta para obter o total de usuários
      const queryTotal = "SELECT COUNT(*) as total FROM usuarios WHERE usu_status = 1";
     
      // Executar as consultas
      const [usuarios] = await pool.query(queryUsuarios, [limite, offset]);
      const [totalResult] = await pool.query(queryTotal);
     
      return {
        usuarios,
        total: totalResult[0].total
      };
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
      throw error;
    }
  },
  UserListarComPaginacaoNome: async (nome,offset, limite) => {
    try {
      // Consulta para obter os usuários com paginação
      const queryUsuarios = `
        SELECT * FROM usuarios
        WHERE usu_status = 1 AND usu_nome LIKE ?
        ORDER BY usu_nome
        LIMIT ? OFFSET ?

      `;
     
      // Consulta para obter o total de usuários
      const queryTotal = "SELECT COUNT(*) as total FROM usuarios WHERE usu_status = 1";

      nome = `%${nome}%`
      // Executar as consultas
      const [usuarios] = await pool.query(queryUsuarios, [nome,limite, offset]);
      const [totalResult] = await pool.query(queryTotal);
     
      return {
        usuarios,
        total: totalResult[0].total
      };
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
      throw error;
    }
  },
  CustomFind: async (table, line, nome) => {
    try {
      const query = "SELECT * FROM ? WHERE ? = ?";
      const [rows] = await pool.query(query, [table,line,nome]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error("Erro ao verificar nome:", error);
      throw error;
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
  EventosListarComPaginacao: async (offset, limite) => {
    try {
      // Consulta para obter os usuários com paginação
      const queryEventos = 
        `SELECT 
            e.evento_id,
            e.evento_nome,
            e.evento_descricao,
            e.evento_data_inicio,
            e.evento_data_fim,
            e.evento_data_hora,
            s.esporte_nome,
            COUNT(d.den_id) AS denuncias_count
        FROM eventos e
        LEFT JOIN esportes s ON e.esporte_id = s.esporte_id
        LEFT JOIN denuncias d ON e.evento_id = d.den_evento_id
        WHERE e.evento_ativo = 1
        GROUP BY e.evento_id
        LIMIT ?, ?`;
     
      // Consulta para obter o total de eventos
      const queryTotal = "SELECT COUNT(*) as total FROM eventos";
     
      // Executar as consultas
      const [eventos] = await pool.query(queryEventos, [offset, limite]);
      const [totalResult] = await pool.query(queryTotal);
     
      return {
        eventos,
        total: totalResult[0].total
      };
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
      throw error;
    }
  },
 EventosListarComPaginacaoPesquisa: async (offset, limite, termo) => {
  try {
    // Consulta para obter os usuários com paginação e pesquisa
    const queryEventos = 
      `SELECT 
          e.evento_id,
          e.evento_nome,
          e.evento_descricao,
          e.evento_data_inicio,
          e.evento_data_fim,
          e.evento_data_hora,
          s.esporte_nome,
          COUNT(d.den_id) AS denuncias_count
      FROM eventos e
      LEFT JOIN esportes s ON e.esporte_id = s.esporte_id
      LEFT JOIN denuncias d ON e.evento_id = d.den_evento_id
      WHERE e.evento_nome LIKE ?
      AND e.evento_ativo = 1
      GROUP BY e.evento_id
      LIMIT ?, ?`;
   
    // Consulta para obter o total de eventos filtrados
    const queryTotal = "SELECT COUNT(*) as total FROM eventos WHERE evento_nome LIKE ?";

    const searchTerm = `%${termo}%`;

    // Executar as consultas
    const [eventos] = await pool.query(queryEventos, [searchTerm, offset, limite]);
    const [totalResult] = await pool.query(queryTotal, [searchTerm]);
   
    return {
      eventos,
      total: totalResult[0].total
    };
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    throw error;
  }
  },
  buscarEventoPorId: async (id) => {
  const [rows] = await pool.query("SELECT * FROM eventos WHERE evento_id = ?", [id]);
  return rows[0];
},

atualizarEvento: async (dados) => {
  const sql = `
    UPDATE eventos 
    SET evento_nome = ?, evento_descricao = ?, evento_data_hora = ?, 
        evento_endereco_cep = ?, evento_endereco_numero = ?, evento_endereco_complemento = ?, 
        esporte_id = ?, evento_foto = COALESCE(?, evento_foto)
    WHERE evento_id = ?
  `;
  const params = [
    dados.nome,
    dados.descricao,
    dados.data_hora,
    dados.cep,
    dados.numero,
    dados.complemento,
    dados.esporte_id,
    dados.foto,
    dados.evento_id,
  ];
  await pool.query(sql, params);
},

buscarEsportes: async () => {
  const [rows] = await pool.query("SELECT * FROM esportes");
  return rows;
},
  EsportCreate: async (esporteData) => {
    try {
      const {nome, foto, banner} = esporteData;
 
      // Preparar os dados para inserção
      const data = {
        esporte_nome : nome,
        esporte_foto : foto,
        esporte_banner: banner
      };
 
      // Construir a query dinamicamente
      const fields = Object.keys(data).filter(key => data[key] !== null);
      const values = fields.map(field => data[field]);
      const placeholders = fields.map(() => '?').join(', ');
     
      const query = `INSERT INTO esportes (${fields.join(', ')}) VALUES (${placeholders})`;
     
      const [result] = await pool.query(query, values);
      return result.insertId;
    } catch (error) {
      console.error("Erro ao criar esporte:", error);
      throw error;
    }
  },
    EsportFindAll: async () => {
      try {
        const query = "SELECT * FROM esportes";
        const [rows] = await pool.query(query);
        return rows
      } catch (error) {
        console.error("Erro ao buscar esporte:", error);
        throw error;
      }
    },
    EsportFindName: async (name) => {
      try {
        const query = "SELECT * FROM esportes WHERE esporte_nome = ?";
        const [rows] = await pool.query(query, [name]);
         return rows.length > 0 ? rows[0] : null; // retorna objeto ou null
      } catch (error) {
        console.error("Erro ao buscar esporte:", error);
        throw error;
      }
    },
    EsportDelete: async (ids) => {
      try {
        if (!Array.isArray(ids) || ids.length === 0) {
          throw new Error("IDs inválidos para exclusão");
        }
        const placeholders = ids.map(() => '?').join(', ');
        const query = `DELETE FROM esportes WHERE esporte_id IN (${placeholders})`;
        const [result] = await pool.query(query, ids);
        return result;
      } catch (error) {
        console.error("Erro ao excluir esportes:", error);
        throw error;
      }
    },
    EventoFindId: async (id) => {
    try {
      const query = "SELECT * FROM eventos WHERE evento_id = ?";
      const [rows] = await pool.query(query, [id]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error("Erro ao buscar evento por ID:", error);
      throw error;
    }
    },
    DenunciasFindEventoId: async (id) => {
    try {
      const query = "SELECT * FROM denuncias WHERE den_evento_id = ?";
      const [rows] = await pool.query(query, [id]);
      return rows.length > 0 ? rows : null;
    } catch (error) {
      console.error("Erro ao buscar denuncia por ID:", error);
      throw error;
    }
    },
    DenunciaFindId: async (id) => {
    try {
      const query = "SELECT * FROM denuncias WHERE den_id = ?";
      const [rows] = await pool.query(query, [id]);
      return rows.length > 0 ? rows : null;
    } catch (error) {
      console.error("Erro ao buscar denuncia por ID:", error);
      throw error;
    }
    },
    DenunciaDelete: async (id) => {
      try {
        const query = `DELETE FROM denuncias WHERE den_id = ?`;
        const [result] = await pool.query(query, id);
        return result;
      } catch (error) {
        console.error("Erro ao excluir denúncia:", error);
        throw error;
      }
    },
    UserCountEventos: async (id) => {
      try {
        const query = "SELECT COUNT(*) as count FROM eventos WHERE usuario_id = ?";
        const [rows] = await pool.query(query, [id]);
        return rows[0].count;
      } catch (error) {
        console.error("Erro ao contar eventos do usuário:", error);
        throw error;
      }
    },
    UserCountIngressos: async (id) => {
      try {
        const query = "SELECT COUNT(*) as count FROM inscricao_evento WHERE usuario_id = ?";
        const [rows] = await pool.query(query, [id]);
        return rows[0].count;
      } catch (error) {
        console.error("Erro ao contar ingressos do usuário:", error);
        throw error;
      }
    },
    SolicitacoesFindAll: async (pesquisa) => {
    try {
      if (pesquisa && pesquisa.trim() !== '') {
      console.log('banco:', pesquisa)
      const query = `
        SELECT 
          s.*,
          se.esporte_id,
          e.esporte_nome
        FROM solicitacoes s
        LEFT JOIN solicitacoes_esportes se ON s.solicitacao_id = se.solicitacao_id
        LEFT JOIN esportes e ON se.esporte_id = e.esporte_id
        WHERE s.solicitacao_status = 0 AND s.solicitacao_nome LIKE ?
      `;
       var [rows] = await pool.query(query, [`%${pesquisa.trim()}%`]);
      } else {
      var query = `
        SELECT 
          s.*,
          se.esporte_id,
          e.esporte_nome
        FROM solicitacoes s
        LEFT JOIN solicitacoes_esportes se ON s.solicitacao_id = se.solicitacao_id
        LEFT JOIN esportes e ON se.esporte_id = e.esporte_id
        WHERE s.solicitacao_status = 0
      `;
       var [rows] = await pool.query(query);
      }
     

      // Agrupar esportes por solicitacao_id
      const grouped = {};
      rows.forEach(row => {
        const id = row.solicitacao_id;
        if (!grouped[id]) {
          grouped[id] = { ...row, esportes: [] };
        }
        if (row.esporte_id && row.esporte_nome) {
          grouped[id].esportes.push({ id: row.esporte_id, nome: row.esporte_nome });
        }
      });

      return Object.values(grouped);
    } catch (error) {
      console.error("Erro ao buscar solicitações:", error);
      throw error;
    }
  },
  SolicitacaoFindById: async (id) => {
  try {
    const query = `
      SELECT 
        s.*,
        se.esporte_id,
        e.esporte_nome
      FROM solicitacoes s
      LEFT JOIN solicitacoes_esportes se ON s.solicitacao_id = se.solicitacao_id
      LEFT JOIN esportes e ON se.esporte_id = e.esporte_id
      WHERE s.solicitacao_id = ?
    `;
    const [rows] = await pool.query(query, [id]);

    if (rows.length === 0) return null;

    // Agrupar esportes
    const grouped = {
      ...rows[0],
      esportes: []
    };

    rows.forEach(row => {
      if (row.esporte_id && row.esporte_nome) {
        grouped.esportes.push({ id: row.esporte_id, nome: row.esporte_nome });
      }
    });

    return grouped;
  } catch (error) {
    console.error("Erro ao buscar solicitação pelo id:", error);
    throw error;
  }
},// No model-adm.js
SolicitacoesRemoverById: async (solicitacaoId) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Remove os esportes associados
    await conn.query(
      "DELETE FROM solicitacoes_esportes WHERE solicitacao_id = ?",
      [solicitacaoId]
    );

    // Remove a solicitação
    const [result] = await conn.query(
      "DELETE FROM solicitacoes WHERE solicitacao_id = ?",
      [solicitacaoId]
    );

    await conn.commit();
    return result;
  } catch (error) {
    await conn.rollback();
    console.error("Erro ao remover solicitação:", error);
    throw error;
  } finally {
    conn.release();
  }
},
LocalCreate: async (localData) => {
    try {
      const { nome, foto, endereco, latitude, longitude } = localData;

      const query = `
        INSERT INTO locais 
          (local_nome, local_foto, local_endereco, local_latitude, local_longitude)
        VALUES (?, ?, ?, ?, ?)
      `;
      const [result] = await pool.query(query, [nome, foto, endereco, latitude, longitude]);
      return result.insertId;
    } catch (error) {
      console.error("Erro ao criar local:", error);
      throw error;
    }
  },

  // Associar esportes ao local
  LocalAddEsportes: async (localId, esportesIds) => {
    try {
      if(!Array.isArray(esportesIds) || esportesIds.length === 0) return;

      const values = esportesIds.map(esporteId => [localId, esporteId]);
      const query = "INSERT INTO local_esporte (local_id, esporte_id) VALUES ?";
      const [result] = await pool.query(query, [values]);
      return result;
    } catch (error) {
      console.error("Erro ao associar esportes ao local:", error);
      throw error;
    }
  },
  LocalFindAll: async (pesquisa) => {
  try {
    if (pesquisa && pesquisa.trim() !== '') {
    const query = `
      SELECT 
        l.*,
        le.esporte_id,
        e.esporte_nome
      FROM locais l
      LEFT JOIN local_esporte le ON l.local_id = le.local_id
      LEFT JOIN esportes e ON le.esporte_id = e.esporte_id
      WHERE l.local_ativo = 1 AND (l.local_nome LIKE ?)
    `;
    var [rows] = await pool.query(query,[`%${pesquisa.trim()}%`]);
    } else {
    const query = `
      SELECT 
        l.*,
        le.esporte_id,
        e.esporte_nome
      FROM locais l
      LEFT JOIN local_esporte le ON l.local_id = le.local_id
      LEFT JOIN esportes e ON le.esporte_id = e.esporte_id
      WHERE l.local_ativo = 1
    `;
    var [rows] = await pool.query(query);
    }

    // Agrupar esportes por local_id
    const grouped = {};
    rows.forEach(row => {
      const id = row.local_id;
      if (!grouped[id]) {
        grouped[id] = { ...row, esportes: [] };
      }
      if (row.esporte_id && row.esporte_nome) {
        grouped[id].esportes.push({ id: row.esporte_id, nome: row.esporte_nome });
      }
    });

    return Object.values(grouped);
  } catch (error) {
    console.error("Erro ao buscar locais:", error);
    throw error;
  }
}, 
  LocalFindId: async (id) => {
  try {
    // Busca o local principal
    const [locais] = await pool.query(
      "SELECT * FROM locais WHERE local_id = ? AND local_ativo = 1",
      [id]
    );

    if (locais.length === 0) {
      return null; // Local não encontrado ou inativo
    }

    const local = locais[0];

    // Busca os esportes associados ao local
    const [esportes] = await pool.query(
      `SELECT e.esporte_id, e.esporte_nome 
       FROM local_esporte le
       INNER JOIN esportes e ON e.esporte_id = le.esporte_id
       WHERE le.local_id = ?`,
      [id]
    );

    // Retorna o local com os esportes vinculados
    return {
      local_id: local.local_id,
      local_nome: local.local_nome,
      local_endereco: local.local_endereco,
      local_latitude: local.local_latitude,
      local_longitude: local.local_longitude,
      local_foto: local.local_foto,
      local_ativo: local.local_ativo,
      esportes: esportes || [],
    };
  } catch (error) {
    console.error("Erro ao buscar local por ID:", error);
    throw error;
  }
},

editarLocal: async (id, dados) => {
  const conn = await pool.getConnection();
  try {
    const { nome, foto, endereco, latitude, longitude, esportes } = dados;

    await conn.beginTransaction();

    // Cria objeto apenas com os campos enviados
    const campos = {
      local_nome: nome,
      local_foto: foto,
      local_endereco: endereco,
      local_latitude: latitude,
      local_longitude: longitude
    };

    // Montar query de atualização dinâmica
    const updates = Object.entries(campos)
      .filter(([_, valor]) => valor !== undefined && valor !== null)
      .map(([campo, _]) => `${campo} = ?`);

    const values = Object.entries(campos)
      .filter(([_, valor]) => valor !== undefined && valor !== null)
      .map(([_, valor]) => valor);

    if (updates.length > 0) {
      const queryUpdate = `UPDATE locais SET ${updates.join(", ")} WHERE local_id = ?`;
      values.push(id);
      await conn.query(queryUpdate, values);
    }

    // Atualizar esportes se enviados
    if (Array.isArray(esportes)) {
      // Apaga associações antigas
      await conn.query("DELETE FROM local_esporte WHERE local_id = ?", [id]);

      if (esportes.length > 0) {
        // Insere novas associações
        const valuesEsportes = esportes.map(esporteId => [id, esporteId]);
        await conn.query("INSERT INTO local_esporte (local_id, esporte_id) VALUES ?", [valuesEsportes]);
      }
    }

    await conn.commit();
    return { sucesso: true, mensagem: "Local atualizado com sucesso" };
  } catch (error) {
    await conn.rollback();
    console.error("Erro ao editar local:", error);
    throw error;
  } finally {
    conn.release();
  }
},
LocalRemoverById: async (localId) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Remove os esportes associados
    await conn.query(
      "DELETE FROM local_esporte WHERE local_id = ?",
      [localId]
    );

    // Remove a solicitação
    const [result] = await conn.query(
      "DELETE FROM locais WHERE local_id = ?",
      [localId]
    );

    await conn.commit();
    return result;
  } catch (error) {
    await conn.rollback();
    console.error("Erro ao remover local:", error);
    throw error;
  } finally {
    conn.release();
  }
},
    
}

module.exports = AdmModel;
