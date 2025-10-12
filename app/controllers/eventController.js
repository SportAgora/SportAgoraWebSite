const OrganizadorModel = require('../models/model-organizador');
const { body, validationResult } = require("express-validator");
const axios = require('axios')
const {removeImg}= require("../helpers/removeImg");
 
module.exports = {
  criarEventoValidacao: [
  body("nome")
    .isLength({ min: 10 }).withMessage("O nome do evento está muito curto.")
    .isLength({ max: 150 }).withMessage("O nome do evento está muito longo."),

  body("data").custom((value, { req }) => {
    const horaEvento = req.body.hora_evento || "00:00";
    const evento = new Date(`${value}T${horaEvento}`);
    const fim = new Date(`${req.body.data_final}T${req.body.hora_final || "00:00"}`);

    if (isNaN(evento) || isNaN(fim)) throw new Error("Data do evento inválida.");

    if (evento.getTime() <= fim.getTime()) {
      throw new Error("A data do evento precisa ser posterior ao fim das vendas.");
    }
    return true;
  }),
  body("descricao")
    .isLength({ min: 100 }).withMessage("O texto está muito curto.")
    .isLength({ max: 1500 }).withMessage("O texto está muito longo.")
],
  

  criarEvento: async (req, res) => {
  const dadoesporte = await OrganizadorModel.EsportFindAll();
  const errors = validationResult(req);
  const erroMulter = req.session.erroMulter;
  delete req.session.erroMulter;

  let caminhoFoto = null;

  // Se o usuário enviou uma nova foto
  if (req.files && req.files.foto && req.files.foto.length > 0) {
    caminhoFoto = "imagens/evento/" + req.files.foto[0].filename;
  }

  // Se não enviou foto nem tinha anterior
  if (!caminhoFoto && !req.body.fotoAntiga) {
    return res.render('pages/criar-evento', {
      dados: req.body,
      erros: null,
      esporte: dadoesporte,
      dadosNotificacao: { 
        titulo: "Foto não enviada", 
        mensagem: "É obrigatório o envio de uma foto para o evento.", 
        tipo: "error" 
      }
    });
  }

  // Usa a foto anterior caso o form tenha erro
  if (!errors.isEmpty() || erroMulter) {
    const lista = !errors.isEmpty() ? errors : { formatter: null, errors: [] };
    if (erroMulter) lista.errors.push(erroMulter);

    const dados = {
      ...req.body,
      foto: caminhoFoto || req.body.fotoAntiga // mantém a antiga se não tiver nova
    };

    return res.render('pages/criar-evento', {
      dados,
      erros: lista,
      esporte: dadoesporte,
      dadosNotificacao: null
    });
  }

  try {
    const { nome, esporte, data, hora,  descricao, cep, numero, complemento, uf, cidade, ingressos } = req.body;

    const evento = {
      user: req.session.usuario.id,
      esporte,
      foto: caminhoFoto || req.body.fotoAntiga,
      nome,
      data_hora: data + " " + hora,
      descricao,
      cep: cep.replace(/\D/g, ''),
      numero,
      complemento,
      uf,
      cidade
    };

    const resultado = await OrganizadorModel.createEvent(evento);
    const ingressoIDs = await OrganizadorModel.createIngresso(ingressos, resultado);

    if (!resultado) {
      OrganizadorModel.ApagarIngresso(ingressoIDs);
      removeImg(caminhoFoto);
    }

    return res.redirect("/evento?id=" + resultado);
  } catch (e) {
    console.error(e);
    return res.redirect("/error");
  }
},

  carregarCriarEvento: async (req, res) => {
  try {
    const esporte = await OrganizadorModel.EsportFindAll();

    res.render("pages/criar-evento", {
        "erros": null, 
        "dados": {
          nome:"",
          foto:"", 
          data_hora:"", 
          descricao:"", 
          cep:"", 
          numero:"", 
          complemento:"",
          uf:"",
          cidade:"",
          ing_nome:"", 
          ing_valor:"", 
          ing_quantidade:"", 
          ing_meia:"",
        },
        esporte,
        dadosNotificacao: null
    });

  } catch (err) {
    console.error(err);
    return res.redirect("/login");
  }
  },
  carregarMeusEventos: async (req,res) =>{
    try{
        const pagina = parseInt(req.query.pagina) || 1;
        const limite = 18;
        const offset = (pagina - 1) * limite;
        const resultado = await OrganizadorModel.visualizarEventosUsuarioPaginacao(req.session.usuario.id, offset, limite) 

        const total_paginas = Math.ceil(resultado.total / limite);

        for (const evento of resultado.eventos) {
          if (evento.evento_endereco_cep) {
            try {
              const resposta = await axios.get(`https://viacep.com.br/ws/${evento.evento_endereco_cep}/json/`);
              evento.logradouro = resposta.data.logradouro || '';
              evento.cidade = resposta.data.localidade || '';
              evento.estado = resposta.data.uf || '';
            } catch (error) {
              evento.logradouro = '';
              evento.cidade = '';
              evento.estado = '';
            }
          } else {
            evento.logradouro = '';
            evento.cidade = '';
            evento.estado = '';
          }
        }

        return res.render('pages/meus-eventos', {
        eventos: resultado.eventos,
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
  carregarEditarEvento: async (req,res) =>{
    try {
      const esporte = await OrganizadorModel.EsportFindAll();
      const dados = await OrganizadorModel.visualizarEventoId(req.query.id)
      dados.ingressos= await OrganizadorModel.visualizarIngressoEventoId(req.query.id)
      const inscritos = await OrganizadorModel.contarUsuariosEventoId(req.query.id)

      if (dados.usuario_id == req.session.usuario.id) {
        
          if (dados.evento_endereco_cep) {
            try {
              const resposta = await axios.get(`https://viacep.com.br/ws/${evento.evento_endereco_cep}/json/`);
              dados.logradouro = resposta.data.logradouro || '';
              dados.cidade = resposta.data.localidade || '';
              dados.estado = resposta.data.uf || '';
              dados.bairro = resposta.data.uf || '';
            } catch (error) {
              dados.logradouro = '';
              dados.cidade = '';
              dados.estado = '';
              dados.bairro = '';
            }
          } else {
            dados.logradouro = '';
            dados.cidade = '';
            dados.estado = '';
            dados.bairro = '';
          }
        
  
      res.render("pages/editar-evento", {
          "erros": null, 
          dados,
          esporte,
          dadosNotificacao: null,
          inscritos
      });
      } else {
        return res.render("pages/error", {error:"403", mensagem:"Você não tem permissão de acessar esta página."})
      }
    } catch (err) {
      console.error(err);
      return res.redirect("/error");
    }
  },
  editarEventoValidacao: [
  body("nome")
    .isLength({ min: 10 }).withMessage("O nome do evento está muito curto.")
    .isLength({ max: 150 }).withMessage("O nome do evento está muito longo."),
  body("data").custom((value, { req }) => {
    const horaEvento = req.body.hora || "00:00";
    const evento = new Date(`${value}T${horaEvento}`);
    const fim = new Date(`${req.body.data_final}T${req.body.hora_final || "00:00"}`);
    if (isNaN(evento) || isNaN(fim)) throw new Error("Data do evento inválida.");
    if (evento.getTime() <= fim.getTime()) throw new Error("A data do evento precisa ser posterior ao fim das vendas.");
    return true;
  }),
  body("descricao")
    .isLength({ min: 100 }).withMessage("O texto está muito curto.")
    .isLength({ max: 5000 }).withMessage("O texto está muito longo.")
],
editarEvento: async (req, res) => {
  const errors = validationResult(req);
  const inscritos = await OrganizadorModel.contarUsuariosEventoId(req.body.evento_id)
  const erroMulter = req.session.erroMulter;
  delete req.session.erroMulter;

  let caminhoFoto = null;
  
  if (req.files && req.files.foto && req.files.foto.length > 0) {
    caminhoFoto = "imagens/evento/" + req.files.foto[0].filename;
  }

  try {
    console.log(req.body)
    const eventoExistente = await OrganizadorModel.visualizarEventoId(req.body.evento_id);
    console.log(eventoExistente)
    if (eventoExistente.usuario_id !== req.session.usuario.id) {
      return res.render("pages/error", {error:"403", mensagem:"Você não tem permissão de acessar esta página."});
    }

    if (!errors.isEmpty() || erroMulter) {
      const lista = !errors.isEmpty() ? errors : { formatter: null, errors: [] };
      if (erroMulter) lista.errors.push(erroMulter);

      return res.render("pages/editar-evento", {
        dados: { ...req.body, foto: caminhoFoto || eventoExistente.evento_foto },
        erros: lista,
        esporte: await OrganizadorModel.EsportFindAll(),
        dadosNotificacao: null,
        inscritos
      });
    }

    const { nome, esporte, data, hora, descricao, cep, numero, complemento, uf, cidade } = req.body;

    // Atualizar endereço pelo CEP se necessário
    let logradouro = '';
    let bairro = '';
    let cidadeAPI = cidade;
    let ufAPI = uf;

    if (cep) {
      try {
        const resposta = await axios.get(`https://viacep.com.br/ws/${cep.replace(/\D/g,'')}/json/`);
        logradouro = resposta.data.logradouro || '';
        bairro = resposta.data.bairro || '';
        cidadeAPI = resposta.data.localidade || cidade;
        ufAPI = resposta.data.uf || uf;
      } catch {
        logradouro = '';
        bairro = '';
      }
    }

    const eventoAtualizado = {
      esporte_id: esporte,
      evento_nome: nome,
      evento_foto: caminhoFoto || eventoExistente.evento_foto,
      evento_data_hora: data + " " + hora,
      evento_descricao: descricao,
      evento_endereco_cep: cep.replace(/\D/g,''),
      evento_endereco_numero: numero,
      evento_endereco_complemento: complemento,
      evento_endereco_uf: ufAPI,
      evento_endereco_cidade: cidadeAPI,
    };

    await OrganizadorModel.atualizarEvento(req.body.evento_id, eventoAtualizado);


    return res.redirect("/editar-evento?id=" + req.body.evento_id);
  } catch (err) {
    console.error(err);
    if (caminhoFoto) removeImg(caminhoFoto);
    return res.redirect("/error");
  }
},
apagarEvento: async (req,res) => {
  const id = req.query.id
  const user_id = req.session.usuario.id;
  const evento = await OrganizadorModel.visualizarEventoId(id);
  if (id == '' || user_id !== evento.usuario_id ) {
    return res.redirect('/error')
  }
  await OrganizadorModel.EventoApagar(id);
  return res.redirect('/meus-eventos')
}
}