const AdmModel = require('../models/model-adm');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require("express-validator");

const {removeImg }= require("../helpers/removeImg")


async function  carregarEventosErro (errors,req,res){ 
          const pagina = parseInt(req.query.pagina) || 1;
            const limite = 10;
            const offset = (pagina - 1) * limite;
            const resultado = await AdmModel.EventosListarComPaginacao(offset, limite) 
            const total_paginas = Math.ceil(resultado.total / limite);
            const esportes = await AdmModel.EsportFindAll();
            return res.render('pages/adm/eventos', {
            
            dados: {
              eventos: resultado.eventos,
              esportes,
              novoEsporte:"",
              paginador: {
                pagina_atual: pagina,
                total_paginas
            },
            erros: errors
            }})
        } 
module.exports = {
    regrasValidacao: [
        body("nome").isLength({min:3,max:30}).withMessage("Insira um nome válido."),
        body("email").isEmail().withMessage("Email inválido."),
        body("senha").isStrongPassword().withMessage("Senha muito fraca!"),
        body("repsenha").custom((value, { req }) => {
        return value === req.body.senha;
        }).withMessage("Senhas estão diferentes")
     ],
      verificarAdm: async (req, res, next) => {
   try {
    if (!req.session || !req.session.usuario) {
      return res.redirect("/adm/login");
    }

    user = await AdmModel.UserFindId(req.session.usuario.id)
    user = user.tipo

    if (user !== "administrador") {
      return res.redirect("/");
    }

    next(); 
  } catch (error) {
    console.error("Erro no verificarNivel:", error);
    res.redirect("/adm/login");
  }
  },
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
    },
    carregarEventos: async (req,res) =>{
        try{
            const pagina = parseInt(req.query.pagina) || 1;
            const limite = 10;
            const offset = (pagina - 1) * limite;
            const resultado = await AdmModel.EventosListarComPaginacao(offset, limite) 

            const total_paginas = Math.ceil(resultado.total / limite);

            const esportes = await AdmModel.EsportFindAll();


            res.render('pages/adm/eventos', {
            
            dados: {
              eventos: resultado.eventos,
              esportes,
              novoEsporte:"",
              paginador: {
                pagina_atual: pagina,
                total_paginas
            }
            }
            
            });
        }catch(e){
            console.error(e)
            throw e;
        }
  },
    criarEsporte: async (req, res) => {
      try {
        
        const {novoEsporte} = req.body;
        if (novoEsporte){
        const esporteExistente = await AdmModel.EsportFindName(novoEsporte);
        if (esporteExistente) {
         return carregarEventosErro({ errors: [{ path: 'novoEsporte', msg: "Este esporte já existe"}] },req,res);
      }

        const esporteReturn = await AdmModel.EsportCreate({nome:novoEsporte});
        
        console.log("Sucesso ao criar esporte: " + esporteReturn)
  
        res.redirect("/adm/eventos");
       
      } else {
        return carregarEventosErro({ errors: [{ path: 'esporte', msg: "Insira um nome válido." }] },req,res);
      }
    } catch (e) {
        console.error(e);
      return carregarEventosErro({ errors: [{ path: 'esporte', msg: "Ocorreu um erro ao criar o esporte" }] },req,res);
    }
    },
    apagarEsporte: async (req, res) => {
      try{
      const { esportesSelecionados } = req.body;
      if (!esportesSelecionados || esportesSelecionados.length === 0) {
        return carregarEventosErro({ errors: [{ path: 'esporte', msg: "Nenhum esporte selecionado para exclusão" }] },req,res)
      }

      const ids = Array.isArray(esportesSelecionados) ? esportesSelecionados : [esportesSelecionados];

      await AdmModel.EsportesDelete(ids);
      return res.redirect('/adm/eventos');

      } catch(e) {
        console.error(e);
        return carregarEventosErro({ errors: [{ path: 'esporte', msg: "Ocorreu um erro ao apagar o esporte" }] },req,res);
      }
    },
}