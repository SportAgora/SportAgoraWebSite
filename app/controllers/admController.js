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

        if (user !== "a") {
          return res.redirect("/");
        }

        next(); 
      } catch (error) {
        console.error("Erro no verificar nivel:", error);
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
            // Adicionar contagens
            usuario.countIngressos = await AdmModel.UserCountIngressos(id);
            usuario.countEventos = await AdmModel.UserCountEventos(id);
            res.render('pages/adm/sobre_usuario', { usuario });
        } catch (e) {
            console.error(e);
            res.status(500).send('Erro interno do servidor');
        }
    },
    carregarSolicitacoes: async (req, res) => {
      try {
          const solicitacoes = await AdmModel.SolicitacoesFindAll();
          const locais = await AdmModel.LocalFindAll();
          res.render('pages/adm/solicitacao_local', { solicitacoes, locais });
      } catch (e) {
          console.error(e);
          res.status(500).send('Erro interno do servidor');
      }
    },
  carregarNovoLocal: async (req, res) => {
  try {
    const esportes = await AdmModel.EsportFindAll();
    let dados = {};
    
    if (req.query.id) {
      // Puxar dados da solicitação pelo id
      const solicitacao = await AdmModel.SolicitacaoFindById(req.query.id);
      if (solicitacao) {
        dados = {
          nome: solicitacao.solicitacao_nome,
          foto: solicitacao.solicitacao_foto || "",
          endereco: solicitacao.solicitacao_endereco,
          latitude: solicitacao.solicitacao_latitude,
          longitude: solicitacao.solicitacao_longitude,
          esportes: solicitacao.esportes ? solicitacao.esportes.map(e => e.id) : [],
          id: req.query.id || null
        };
      }
    } else {
      // Formulário em branco
      dados = {
        nome: "",
        foto: "",
        endereco: "",
        latitude: "",
        longitude: "",
        esportes: [],
        id: null
      };
    }

    

    res.render("pages/adm/local_novo", {
      dados,
      erros: null,
      esportes
    });
  } catch (error) {
    console.error(error);
    res.send("Erro ao carregar página de novo local");
  }
},
  novoLocalCreate: async (req, res) => {
    try {
      const { nome, endereco, latitude, longitude, esportes, id } = req.body;
      let foto;
      if (req.files && req.files.foto && req.files.foto[0]) {
          foto = "imagens/pratique/" + req.files.foto[0].filename;
      } else {
          // Mantém a foto antiga se nenhuma nova for enviada
          foto = req.body.foto_antiga || null;
      }

      // Verifica se enviou arquivo
      if(req.files && req.files.foto && req.files.foto[0]){
        foto = req.files.foto[0].filename;
        const caminhoFoto = "imagens/pratique/" + foto
        foto = caminhoFoto;
      }

      // Criar local
      const localId = await AdmModel.LocalCreate({
        nome,
        foto,
        endereco,
        latitude: Number(latitude),
        longitude: Number(longitude)
      });

      console.log(localId)

      // Associar esportes
      if(esportes){
        // esportes pode vir como string se for 1 único, então transforma em array
        const esportesIds = Array.isArray(esportes) ? esportes : [esportes];
        await AdmModel.LocalAddEsportes(localId, esportesIds);
      }
    
    if (id) {
      // Apagar solicitação se veio id na query
      await AdmModel.SolicitacoesRemoverById(id);
    }
    return res.redirect(`/adm/solicitacoes`); // página de listagem
    } catch (error) {
      console.error(error);
      const esportesLista = await AdmModel.EsportFindAll();
      res.render("pages/adm/local_novo", {
        dados: req.body,
        erros: { errors: [{ path: "geral", msg: "Erro ao criar local" }] },
        esportes: esportesLista
      });
    }
  },
  carregarSolicitacoesRemover: async (req, res) => {
    try {
      const id = req.query.id;
      if (!id) return res.redirect('/adm/solicitacoes');

      const solicitacoes = await AdmModel.SolicitacoesRemoverById(id);

      return res.redirect('/adm/solicitacoes');
    } catch (e) {
        console.error(e);
        res.status(500).send('Erro interno do servidor');
    }
  },
  carregarEditarLocal: async (req, res) => {
    try {
      const id = req.body.id || req.query.id;

      // Busca o local com esportes associados
      const local = await AdmModel.LocalFindId(id);
      if (!local) {
        return res.status(404).send("Local não encontrado");
      }

      // Busca todos os esportes para preencher o select/checkboxes
      const esportes = await AdmModel.EsportFindAll();

      // Extrai IDs dos esportes associados ao local
      const esportesLocalIds = local.esportes.map(e => e.esporte_id);

      return res.render("pages/adm/local_editar", {
        erros: null,
        dados: {
          local_id: local.local_id,
          local_nome: local.local_nome,
          local_endereco: local.local_endereco,
          local_latitude: local.local_latitude,
          local_longitude: local.local_longitude,
          local_foto: local.local_foto,
          esportesSelecionados: esportesLocalIds,
        },
        esportes: esportes,
        dadosNotificacao: null,
      });
    } catch (e) {
      console.error("Erro ao carregar local:", e);
      res.status(500).send("Erro interno no servidor");
    }
  },

  // Edita o local e salva alterações no banco
  editarLocal: async (req, res) => {
    const erros = validationResult(req);
    const erroMulter = req.session.erroMulter;


    console.log(req.files)

    // Se houver erros de validação ou upload
    if (!erros.isEmpty() || erroMulter != null) {
      const lista = !erros.isEmpty() ? erros : { formatter: null, errors: [] };
      if (erroMulter != null) lista.errors.push(erroMulter);

      console.log(lista);
      return res.render("pages/adm/local_editar", {
        erros: lista,
        dados: {
          local_nome: req.body.nome,
          local_endereco: req.body.endereco,
          local_latitude: req.body.latitude,
          local_longitude: req.body.longitude,
          local_foto: req.body.fotoAntiga,
          esportesSelecionados: req.body.esportes || [],
        },
        esportes: await AdmModel.EsportFindAll(),
        dadosNotificacao: {
          titulo: "Erro ao atualizar o local!",
          mensagem: "Verifique se os dados foram inseridos corretamente.",
          tipo: "error",
        },
      });
    }

    try {
      const id = req.body.id || req.query.id;

      // Monta dados do formulário
      const dadosForm = {
        nome: req.body.nome,
        endereco: req.body.endereco,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        foto: req.body.fotoAntiga,
        esportes: req.body.esportes
          ? Array.isArray(req.body.esportes)
            ? req.body.esportes
            : [req.body.esportes]
          : [],
      };

      // Se houve upload de imagem nova
      if (req.files && req.files.foto) {
        const caminhoFoto = "imagens/pratique/" + req.files.foto[0].filename;

        if (dadosForm.foto && dadosForm.foto !== caminhoFoto) {
          removeImg(dadosForm.foto);
        }

        dadosForm.foto = caminhoFoto;
      }

      // Atualiza no banco
      const resultUpdate = await AdmModel.editarLocal(id, dadosForm);

      // Verifica resultado
      if (resultUpdate && resultUpdate.sucesso) {
        console.log("Local atualizado com sucesso!");
        const localAtualizado = await AdmModel.LocalFindId(id);

        return res.render("pages/adm/local_editar", {
          erros: null,
          dados: {
            local_id: localAtualizado.local_id,
            local_nome: localAtualizado.local_nome,
            local_endereco: localAtualizado.local_endereco,
            local_latitude: localAtualizado.local_latitude,
            local_longitude: localAtualizado.local_longitude,
            local_foto: localAtualizado.local_foto,
            esportesSelecionados: localAtualizado.esportes.map(e => e.esporte_id),
          },
          esportes: await AdmModel.EsportFindAll(),
          dadosNotificacao: {
            titulo: "Local atualizado com sucesso!",
            mensagem: "As alterações foram salvas com êxito.",
            tipo: "success",
          },
        });
      } else {
        console.log("Nada para salvar.");
        return res.render("pages/adm/local_editar", {
          erros: null,
          dados: dadosForm,
          esportes: await AdmModel.EsportFindAll(),
          dadosNotificacao: {
            titulo: "Local atualizado!",
            mensagem: "Nenhuma alteração detectada.",
            tipo: "success",
          },
        });
      }
    } catch (e) {
      console.error("Erro ao editar local:", e);
      res.render("pages/adm/local_editar", {
        dados: req.body,
        esportes: await AdmModel.EsportFindAll(),
        erros: erros,
        dadosNotificacao: {
          titulo: "Erro ao atualizar o local!",
          mensagem: "Verifique os valores digitados e tente novamente.",
          tipo: "error",
        },
      });
    }
  },
  apagarLocal: async (req,res) => {
    try {
      const id = req.query.id;
      if (!id) return res.redirect('/adm/solicitacoes');

      const local = await AdmModel.LocalRemoverById(id);

      return res.redirect('/adm/solicitacoes');
    } catch (e) {
        console.error(e);
        res.status(500).send('Erro interno do servidor');
    }
  }

}