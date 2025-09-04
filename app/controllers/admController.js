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
            const assuntos = await AdmModel.AssuntosFindAll();
            const categorias = await AdmModel.CategoriasFindAll();
            return res.render('pages/adm/eventos', {
            
            dados: {
              eventos: resultado.eventos,
              assuntos,
              categorias,
              novoAssunto:"",
              novaCategoria:"",
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

            const assuntos = await AdmModel.AssuntosFindAll();
            const categorias = await AdmModel.CategoriasFindAll();


            res.render('pages/adm/eventos', {
            
            dados: {
              eventos: resultado.eventos,
              assuntos,
              categorias,
              novoAssunto:"",
              novaCategoria:"",
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
    criarAssunto: async (req, res) => {
      try {
        
        const {novoAssunto} = req.body;
        if (novoAssunto){
        const assuntoExistente = await AdmModel.AssuntosFindName(novoAssunto);
        if (assuntoExistente) {
         return carregarEventosErro({ errors: [{ path: 'novoAssunto', msg: "Este assunto já existe"}] },req,res);
      }

        const assuntoReturn = await AdmModel.AssuntoCreate({nome:novoAssunto});
        
        console.log("Sucesso ao criar assunto: " + assuntoReturn)
  
        res.redirect("/adm/eventos");
       
      } else {
        return carregarEventosErro({ errors: [{ path: 'assunto', msg: "Insira um nome válido." }] },req,res);
      }
    } catch (e) {
        console.error(e);
      return carregarEventosErro({ errors: [{ path: 'assunto', msg: "Ocorreu um erro ao criar o assunto" }] },req,res);
    }
    },
    apagarAssunto: async (req, res) => {
      try{
      const { assuntosSelecionados } = req.body;
      if (!assuntosSelecionados || assuntosSelecionados.length === 0) {
        return carregarEventosErro({ errors: [{ path: 'assunto', msg: "Nenhum assunto selecionado para exclusão" }] },req,res)
      }

      const ids = Array.isArray(assuntosSelecionados) ? assuntosSelecionados : [assuntosSelecionados];

      await AdmModel.AssuntosDelete(ids);
      return res.redirect('/adm/eventos');

      } catch(e) {
        console.error(e);
        return carregarEventosErro({ errors: [{ path: 'assunto', msg: "Ocorreu um erro ao apagar o assunto" }] },req,res);
      }
    },

    criarCategoria: async (req, res) => {
      try {
        const {novaCategoria} = req.body;
        if (novaCategoria){
        const categoriaExistente = await AdmModel.CategoriasFindName(novaCategoria);
        if (categoriaExistente) {
         return carregarEventosErro({ errors: [{ path: 'novaCategoria', msg: "Esta categoria já existe"}] },req,res);
      }

        const categoriaReturn = await AdmModel.CategoriaCreate({nome:novaCategoria});
        
        console.log("Sucesso ao criar categoria: " + categoriaReturn)
  
        res.redirect("/adm/eventos");
       
      } else {
        return carregarEventosErro({ errors: [{ path: 'categoria', msg: "Insira um nome válido." }] },req,res);
      }
    } catch (e) {
        console.error(e);
      return carregarEventosErro({ errors: [{ path: 'categoria', msg: "Ocorreu um erro ao criar a categoria" }] },req,res);
    }
    },
    apagarCategoria: async (req, res) => {
      try{
      const { categoriasSelecionados } = req.body;
      if (!categoriasSelecionados || categoriasSelecionados.length === 0) {
        return carregarEventosErro({ errors: [{ path: 'categoria', msg: "Nenhuma categoria selecionada para exclusão" }] },req,res)
      }

      const ids = Array.isArray(categoriasSelecionados) ? categoriasSelecionados : [categoriasSelecionados];

      await AdmModel.CategoriasDelete(ids);
      return res.redirect('/adm/eventos');

      } catch(e) {
        console.error(e);
        return carregarEventosErro({ errors: [{ path: 'categoria', msg: "Ocorreu um erro ao apagar a categoria" }] },req,res);
      }
    }
}