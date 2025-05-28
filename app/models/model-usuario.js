// models/model-usuario.js
const pool = require("../../config/pool-conexoes");
const moment = require("moment");
const bcrypt = require("bcryptjs");
 
const UsuarioModel = {
  // Regras de validação 
  // Buscar usuário por ID
  findId: async (id) => {
    try {
      const query = "SELECT * FROM USUARIO WHERE id = ?";
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
      const query = "SELECT * FROM USUARIO WHERE Email = ?";
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
        nome,
        email,
        senha: senha, // Já deve estar com hash
        // Telefone: Telefone || null,
        // DataNascimento: DataNascimento ? moment(DataNascimento).format('YYYY-MM-DD') : null,
        // LogradouroId: LogradouroId || null
      };
 
      // Construir a query dinamicamente
      const fields = Object.keys(data).filter(key => data[key] !== null);
      const values = fields.map(field => data[field]);
      const placeholders = fields.map(() => '?').join(', ');
     
      const query = `INSERT INTO USUARIO (${fields.join(', ')}) VALUES (${placeholders})`;
     
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
      const { nome, email, telefone, data_nascimento, logradouro_id, cpf } = userData;
 
      // Preparar os dados para atualização
      const data = {
        nome: nome,
        Email: email,
        Telefone: telefone || null,
        DataNascimento: data_nascimento ? moment(data_nascimento).format('YYYY-MM-DD') : null,
        LogradouroId: logradouro_id || null,
        Cpf: cpf ? formatCPF(cpf) : null
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
     
      const query = `UPDATE USUARIO SET ${updates.join(', ')} WHERE id = ?`;
     
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
      const query = "DELETE FROM USUARIO WHERE id = ?";
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
        SELECT * FROM USUARIO
        ORDER BY nome
        LIMIT ? OFFSET ?
      `;
     
      // Consulta para obter o total de usuários
      const queryTotal = "SELECT COUNT(*) as total FROM USUARIO";
     
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
     
      const query = "UPDATE USUARIO SET SenhaHash = ? WHERE id = ?";
      const [result] = await pool.query(query, [senhaHash, id]);
     
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      throw error;
    }
  }
};
 
module.exports = UsuarioModel;
 

 
 