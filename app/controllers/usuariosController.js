const UsuarioModel = require('../models/model-usuario');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require("express-validator");
 
module.exports = {
  regrasValidacao: [
    body("nome").isLength({min:3,max:30}).withMessage("Insira um nome válido."),
    body("email").isEmail().withMessage("Email inválido."),
    body("senha").isStrongPassword().withMessage("Senha muito fraca!"),
    body("repsenha").custom((value, { req }) => {
    return value === req.body.senha;
    }).withMessage("Senhas estão diferentes")
  ],
  

  cadastrarUsuarioNormal: async (req, res) => {
    
    const errors = validationResult(req);
        if(!errors.isEmpty()) {
            console.log(errors);
            return res.render('pages/registro',{
                dados: req.body,
                erros: errors
            })
        }

    try {

      const {nome, email, senha } = req.body;
     
      // Verificar se email já existe
      if (email){
      const usuarioExistente = await UsuarioModel.findByEmail(email);
      if (usuarioExistente) {
        res.render("pages/registro", {
        dados: req.body,
        erros: { errors: [{ path: 'email', msg: "Este email já está cadastrado" }] }
      });
    }
      }
     
      // Hash da senha
      const senhaHash = await bcrypt.hash(senha, 10);
     
      // Criar o usuário
      const novoUsuario = await UsuarioModel.create({
        nome: nome,
        email: email,
        senha: senhaHash
      });
     
      // AUTOLOGIN: Criar sessão diretamente após cadastro
      req.session.usuario = {
        id: novoUsuario.insertId, // ID do novo usuário
        email: email,
        nome: nome
      };
     
      // Redirecionar para contaConsumidor
      res.redirect("/perfilex");
     
    } catch (e) {
      console.error(e);
      res.render("pages/registro", {
  dados: req.body,
  erros: { errors: [{ path: 'email', msg: "Ocorreu um erro ao criar a conta" }] }
});

      
    }
  },

  regrasValidacaoLogin :[
  body("email").isEmail().withMessage("Email inválido."),
  body("senha").notEmpty().withMessage("Senha obrigatória.")
],
 
  // Autenticar usuário (login)
autenticarUsuario: async (req, res) => {
    try {
      const errors = validationResult(req);
        if(!errors.isEmpty()) {
            console.log(errors);
            return res.render('pages/login',{
                dados: req.body,
                erros: errors
            })
        }

      const { email, senha } = req.body;
     
      // Buscar usuário pelo email
      const usuario = await UsuarioModel.findByEmail(email);
     
      if (!usuario) {
        return res.render("pages/login", {
           dados: req.body,
          erros: { errors: [{ path: 'email', msg: "Este email não está cadastrado ou está digitado errado." }] }
        });
      }
     
      // Verificar se a senha está correta
      const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
     
      if (!senhaCorreta) {
        return res.render("pages/login", {
           dados: req.body,
          erros: { errors: [{ path: 'email', msg: "Senha incorreta." }] }
        });
      }
     
      // Criar a sessão do usuário
      req.session.usuario = {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome
      };
     
       res.redirect("/perfilex");
    } catch (error) {
      console.error(error);
      res.render("pages/login", {
        dados: req.body,
        erros: { errors: [{ path: 'email', msg: "Erro ao logar, tente novamente mais tarde." }] }
      });
    }
  },
 
  // Logout
  logout: (req, res) => {
    req.session.destroy(() => {
      res.redirect("/login");
    });
  }
};
 