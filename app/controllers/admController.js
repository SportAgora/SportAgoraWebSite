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
            console.log(errors)
            return res.render('pages/adm/eventos', {  
            dados: {
              eventos: resultado.eventos,
              esportes,
              novoEsporte:"",
              paginador: {
                pagina_atual: pagina,
                total_paginas
            },
            },
            dadosNotificacao: { 
                      titulo: errors.titulo || "Erro", 
                      mensagem: errors.mensagem || "Ocorreu um erro", 
                      tipo: "error", 
            }
          })
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
            },
            pesquisa : ""
            });
        }catch(e){
            console.error(e)
            throw e;
        }
    },
    pesquisarUsuarios: async (req,res) =>{
        try{
            const pagina = parseInt(req.query.pagina) || 1;
            const limite = 10;
            const offset = (pagina - 1) * limite;
            const resultado = await AdmModel.UserListarComPaginacaoNome(req.body.pesquisa, offset, limite) 

            const total_paginas = Math.ceil(resultado.total / limite);
            res.render('pages/adm/usuarios', {
            usuarios: resultado.usuarios,
            paginador: {
                pagina_atual: pagina,
                total_paginas
            },
            pesquisa : req.body.pesquisa
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
            tipo: tipo
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
            },
            erros: null,
            dadosNotificacao: null
            });
            
        }catch(e){
            console.error(e)
            throw e;
        }
  },
    criarEsporte: async (req, res) => {
      try {
        const {novoEsporte} = req.body;
        var foto, foto2;
        console.log(req.files)

        if (req.session.erroMulter) {
          return carregarEventosErro(
            { titulo: "Erro ao enviar foto", mensagem: req.session.erroMulter.msg },
            req, res
          );
        }

        if (!req.files) {
              console.log("Nenhuma foto enviada");
                return carregarEventosErro({titulo:"Erro ao enviar foto", mensagem: "O envio da foto do esporte é obrigatório."} ,req,res);
              } else {

                if (req.files['foto']) {
                  const caminhoFoto = "imagens/esportes/" + req.files['foto'][0].filename;
                  foto = caminhoFoto;
                } else {
                  return carregarEventosErro({titulo:"Erro ao enviar foto", mensagem: "O envio da foto do esporte é obrigatório."} ,req,res);
                }

                if (req.files['foto2']) {
                  const caminhoFoto2 = "imagens/esportes/" + req.files['foto2'][0].filename;
                  foto2 = caminhoFoto2;
                } else {
                  return carregarEventosErro({titulo:"Erro ao enviar banner", mensagem: "O envio do banner do esporte é obrigatório."} ,req,res);
                }
              }

        if (novoEsporte){
        const esporteExistente = await AdmModel.EsportFindName(novoEsporte);
        if (esporteExistente) {
         return carregarEventosErro({titulo:"Esporte existe", mensagem: "Este esporte já existe, verifique se o nome foi inserido corretamente."} ,req,res);
      }

        const esporteReturn = await AdmModel.EsportCreate({nome:novoEsporte, foto:foto, banner:foto2});
        
        console.log("Sucesso ao criar esporte: " + esporteReturn)
  
        res.redirect("/adm/eventos");
       
      } else {
        return carregarEventosErro({titulo:"Esporte", mensagem: "Verifique se tudo foi incluso corretamente."},req,res);
      }
    } catch (e) {
        console.error(e);
      return carregarEventosErro({titulo:"Esporte", mensagem: "Ocorreu um erro desconhecido ao tentar criar um esporte."},req,res);
    }
    },
    apagarEsporte: async (req, res) => {
      try{
      const { esportesSelecionados } = req.body;
      if (!esportesSelecionados || esportesSelecionados.length === 0) {
        return carregarEventosErro({titulo:"Esporte", mensagem: "Nenhum esporte selecionado."},req,res)
      }

      const ids = Array.isArray(esportesSelecionados) ? esportesSelecionados : [esportesSelecionados];

      await AdmModel.EsportDelete(ids);
      return res.redirect('/adm/eventos');

      } catch(e) {
        console.error(e);
        return carregarEventosErro({titulo:"Esporte", mensagem: "Ocorreu um erro desconhecido ao apagar o esporte."},req,res);
      }
    },
    carregarDenuncias: async (req,res) =>{
      try{
          const evento_id = req.query.id || null;
          const evento = evento_id ? await AdmModel.EventoFindId(evento_id) : null;
          if (evento_id && !evento) {
            return carregarEventosErro({titulo:"Denúncias", mensagem: "Evento não encontrado."},req,res);
          }
          const resultado = await AdmModel.DenunciasFindEventoId(evento_id)
          console.log(resultado)
          res.render('pages/adm/denuncias', {
            evento,
            denuncias: resultado,
          });
      } catch (e){
        console.error(e)
        return carregarEventosErro({titulo:"Denúncias", mensagem: "Ocorreu um erro desconhecido ao carregar as denúncias."},req,res);
      }

    },
    apagarDenuncia: async (req,res) => {
      console.log("chegou")
      try{

          const den_id = req.query.den_id || null;
          const apagar = await AdmModel.DenunciaFindId(den_id)
          if (!apagar) {
            return res.redirect('error')
          }

          const deletar = await AdmModel.DenunciaDelete(den_id)

          const resultado = await AdmModel.DenunciasFindEventoId(req.query.id)
          if (resultado != null) {
            return res.redirect('/adm/eventos/denuncias?id=' + req.query.id)
          } else {
            return res.redirect('/adm/eventos')
          }

      } catch(e){
        console.error(e)
        return carregarEventosErro({titulo:"Denúncias", mensagem: "Ocorreu um erro desconhecido ao apagar a denúncia."},req,res);
      }
    },
    carregarUsuario: async (req, res) => {
        try {
            const id = req.query.id;
            if (!id) {
                return res.status(400).send('ID do usuário não fornecido');
            }
            const usuario = await AdmModel.UserFindId(id);
            if (!usuario) {
                return res.status(404).send('Usuário não encontrado');
            }
            res.render('pages/adm/sobre_usuario', { usuario });
        } catch (e) {
            console.error(e);
            res.status(500).send('Erro interno do servidor');
        }
    }
}