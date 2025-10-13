// models/model-usuario.js
const pool = require("../../config/pool-conexoes");
const moment = require("moment");
const bcrypt = require("bcryptjs");
 
const UsuarioModel = {
  // Regras de validação 
  // Buscar usuário por ID
  findId: async (id) => {
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
  findByEmail: async (email) => {
    try {
      const query = "SELECT * FROM usuarios WHERE usu_email = ?";
      const [rows] = await pool.query(query, [email]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error("Erro ao verificar email:", error);
      throw error;
    }
  },

  findByName: async (nome) => {
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
  create: async (userData) => {
    try {
      const { nome, email, senha, foto, banner, status, nasc } = userData;
 
      // Preparar os dados para inserção
      const data = {
        usu_nome : nome,
        usu_email:  email,
        usu_senha: senha, // Já deve estar com hash
        usu_foto:foto,
        usu_banner:banner,
        usu_status: status || 0, // Padrão para inativo
        usu_nasc: nasc ? moment(nasc).format('YYYY-MM-DD') : null,
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
  atualizar: async (id, userData) => {
    try {
      const { nome, email, nasc, telefone, plano, tipo, foto, banner, senha} = userData;
 
      // Preparar os dados para atualização
      const data = {
        usu_nome: nome,
        usu_email: email,
        usu_senha:senha,
        usu_nasc: nasc ? moment(nasc).format('YYYY-MM-DD') : null,
        contato_id: telefone,
        plano_id : plano,
        tipo : tipo,
        usu_foto : foto,
        usu_banner : banner,
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
  excluir: async (id) => {
    try {
      const query = "DELETE FROM usuarios WHERE usu_id = ?";
      const [result] = await pool.query(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      throw error;
    }
  },
 
  // Alterar senha do usuário
  alterarSenha: async (id, novaSenha) => {
    try {
      // Hash da nova senha
      const senhaHash = await bcrypt.hash(novaSenha, 10);
     
      const query = "UPDATE usuarios SET usu_senha = ? WHERE usu_id = ?";
      const [result] = await pool.query(query, [senhaHash, id]);
     
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      throw error;
    }
  },

  ativarConta: async (id) => {
    try {
     
      const query = "UPDATE usuarios SET usu_status = ? WHERE usu_id = ?";
      const [result] = await pool.query(query, [1, id]);
     
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      throw error;
    }
  },
  ativarPlano: async (id) => {
    try {
     
      const query = "UPDATE usuarios SET tipo = ? WHERE usu_id = ?";
      const [result] = await pool.query(query, ['o', id]);
     
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      throw error;
    }
  },
  findIngressosInscritos: async (usuarioId) => {
    try {
  const query = `
    SELECT 
      i.ingresso_id,
      i.ingresso_nome,
      i.ingresso_valor,
      i.ingresso_meia,        
      e.evento_nome,
      e.evento_foto,
      e.evento_data_hora,
      ie.inscricao_id
    FROM inscricao_evento ie
    JOIN ingressos i ON ie.ingresso_id = i.ingresso_id
    JOIN eventos e ON ie.evento_id = e.evento_id
    WHERE ie.usuario_id = ?
      AND ie.pagamento_feito = true
  `;

  const [rows] = await pool.query(query, [usuarioId]);

  return rows;

} catch(error){
  console.error("Erro ao buscar ingressos inscritos:", error);
  throw error;
}
  }



};
 
module.exports = UsuarioModel;
 

 
 