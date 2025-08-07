const AdmModel = require('../models/model-adm');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require("express-validator");

const {removeImg }= require("../helpers/removeImg")

 
module.exports = {
    regrasValidacao: [
        body("nome").isLength({min:3,max:30}).withMessage("Insira um nome válido."),
        body("email").isEmail().withMessage("Email inválido."),
        body("senha").isStrongPassword().withMessage("Senha muito fraca!"),
        body("repsenha").custom((value, { req }) => {
        return value === req.body.senha;
        }).withMessage("Senhas estão diferentes")
     ],
    carregarUsuarios: async (req,res) =>{
        try{
            const pagina = parseInt(req.query.pagina) || 1;
            const limite = 10;
            const offset = (pagina - 1) * limite;
            const resultado = await AdmModel.UserListarComPaginacao(offset, limite) 

            const total_paginas = Math.ceil(resultado.total / limite);
            res.render('pages/adm/usuarios', {
            usuarios: resultado.usuarios,
            paginador: {
                pagina_atual: pagina,
                total_paginas
            }
            });
        }catch(e){
            console.error(e)
            throw e;
        }
    },
    cadastrarUsuario: async (req, res) => {
        const errors = validationResult(req);
            if(!errors.isEmpty()) {
                console.log(errors);
                return res.render('pages/adm/novousuario',{
                    dados: req.body,
                    erros: errors
                })
            }
    
        try {
    
          const {nome, email, senha, tipo} = req.body;
    
          if (email){
          const usuarioExistente = await AdmModel.UserFindByEmail(email);
          if (usuarioExistente) {
           return res.render("pages/adm/novousuario", {
            dados: req.body,
            erros: { errors: [{ path: 'email', msg: "Este email já está cadastrado" }] }
          });
        }
    
        if (nome){
          const nomeExistente = await AdmModel.UserFindByName(nome);
          if (nomeExistente) {
            return res.render("pages/adm/novousuario", {
            dados: req.body,
            erros: { errors: [{ path: 'nome', msg: "Este nome já está cadastrado" }] }
                });
                }
                }
            }
         
          const senhaHash = await bcrypt.hash(senha, 10);
         
          const novoUsuario = await AdmModel.UserCreate({
            nome: nome,
            email: email,
            senha: senhaHash,
            foto: "imagens/usuarios/default_user.jpg",
            banner: "imagens/usuarios/default_background.jpg",
            tipo: tipo == "adm" ? "administrador" : "comum"
          });
         
          const usuario = await AdmModel.UserFindByEmail(email);
          
          console.log("Sucesso! " + usuario)
    
          res.redirect("/adm/usuarios");
         
        } catch (e) {
          console.error(e);
          res.render("pages/adm/novousuario", {
          dados: req.body,
          erros: { errors: [{ path: 'email', msg: "Ocorreu um erro ao criar a conta" }] }
        });
    
          
        }
      },
      apagarUsuario: async (req,res) => {
        try{
            const id = req.params.id
            console.log(id)
            const user = await AdmModel.UserExcluir(id)
            console.log("Sucesso! " + user)
            res.redirect('/adm/usuarios')
        }catch(e){
            console.error(e);
            return true
        }      
    }
}