// models/model-usuario.js
const pool = require("../../config/pool-conexoes");
const moment = require("moment");
const bcrypt = require("bcryptjs");
 
const UsuarioModel = {
  // Regras de validação 
  // Buscar usuário por ID
  findId: async (id) => {
    try {
      const query = "SELECT * FROM usuario WHERE usu_id = ?";
      const [rows] = await pool.query(query, [id]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error("Erro ao buscar usuário por ID:", error);
      throw error;
    }
  },
 
  // Verificar se email já existe
  findByEmail: async (email) => {
    try {
      const query = "SELECT * FROM usuario WHERE usu_email = ?";
      const [rows] = await pool.query(query, [email]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error("Erro ao verificar email:", error);
      throw error;
    }
  },
 
  // Criar novo usuário
  create: async (userData) => {
    try {
      const { nome, email, senha } = userData;
 
      // Preparar os dados para inserção
      const data = {
        usu_nome : nome,
        usu_email:email,
        usu_senha: senha, // Já deve estar com hash
      };
 
      // Construir a query dinamicamente
      const fields = Object.keys(data).filter(key => data[key] !== null);
      const values = fields.map(field => data[field]);
      const placeholders = fields.map(() => '?').join(', ');
     
      const query = `INSERT INTO usuario (${fields.join(', ')}) VALUES (${placeholders})`;
     
      const [result] = await pool.query(query, values);
      return result.insertId;
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      throw error;
    }
  },
 
  // Atualizar usuário
  atualizar: async (id, userData) => {
    try {
      const { nome, arroba, email, data_nascimento, logradouro_id, cpf, telefone, plano, tipo, foto, banner, bio} = userData;
 
      // Preparar os dados para atualização
      const data = {
        usu_nome: nome,
        perf_nome : arroba,
        usu_email: email,
        usu_nasc: data_nascimento ? moment(data_nascimento).format('YYYY-MM-DD') : null,
        endereco_id: logradouro_id || null,
        usu_cpf: cpf ? formatCPF(cpf) : null,
        contato_id: telefone,
        plano_id : plano,
        tipo : tipo,
        perf_foto : foto,
        banner : banner,
        biografia : bio
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
     
      const query = `UPDATE usuario SET ${updates.join(', ')} WHERE id = ?`;
     
      const [result] = await pool.query(query, values);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      throw error;
    }
  },
 
  // Excluir usuário
  excluir: async (id) => {
    try {
      const query = "DELETE FROM usuario WHERE id = ?";
      const [result] = await pool.query(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      throw error;
    }
  },
 
  // Listar usuários com paginação
  listarComPaginacao: async (offset, limite) => {
    try {
      // Consulta para obter os usuários com paginação
      const queryUsuarios = `
        SELECT * FROM usuario
        ORDER BY nome
        LIMIT ? OFFSET ?
      `;
     
      // Consulta para obter o total de usuários
      const queryTotal = "SELECT COUNT(*) as total FROM usuario";
     
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
 
  // Alterar senha do usuário
  alterarSenha: async (id, novaSenha) => {
    try {
      // Hash da nova senha
      const senhaHash = await bcrypt.hash(novaSenha, 10);
     
      const query = "UPDATE USUARIO SET senha = ? WHERE id = ?";
      const [result] = await pool.query(query, [senhaHash, id]);
     
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      throw error;
    }
  }
};
 
module.exports = UsuarioModel;
 

 
 