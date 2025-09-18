const OrganizadorModel = require('../models/model-organizador');
const { body, validationResult } = require("express-validator");

const {removeImg}= require("../helpers/removeImg")

 
module.exports = {
  criarEventoValidacao: [
  body("nome")
    .isLength({ min: 10 }).withMessage("O nome do evento está muito curto.")
    .isLength({ max: 150 }).withMessage("O nome do evento está muito longo."),

 body("data_inicio").custom((value, { req }) => {
    const horaInicio = req.body.hora_inicio || "00:00";
    const inicio = new Date(`${value}T${horaInicio}`);
    if (isNaN(inicio)) throw new Error("Data de início inválida.");

    if (inicio.getTime() <= Date.now()) {
      throw new Error("O início das vendas precisa ser posterior à data e hora atual.");
    }
    return true;
  }),

  body("data_final").custom((value, { req }) => {
    const horaFinal = req.body.hora_final || "00:00";
    const inicio = new Date(`${req.body.data_inicio}T${req.body.hora_inicio || "00:00"}`);
    const fim = new Date(`${value}T${horaFinal}`);

    if (isNaN(fim) || isNaN(inicio)) throw new Error("Data final inválida.");

    if (fim.getTime() <= inicio.getTime()) {
      throw new Error("A data final precisa ser posterior à data de início das vendas.");
    }
    return true;
  }),

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
        if(!errors.isEmpty() || erroMulter != null) {
              lista =  !errors.isEmpty() ? errors : {formatter:null, errors:[]};
                if(erroMulter != null ){
                    lista.errors.push(erroMulter);
              } 
            console.log(lista);
            console.log(dadoesporte)
            return res.render('pages/criar-evento',{
                dados: req.body,
                erros: lista,
                esporte: dadoesporte,
                dadosNotificacao: null
            })
        }
        
    try{
      const {nome, esporte, data, hora, data_inicio, hora_inicio, data_final, hora_final, descricao, cep, numero, complemento} = req.body;
      const { ingressos } = req.body;
      
      const ingressoIDs = await OrganizadorModel.createIngresso(ingressos)

      if (!req.files || !req.files.foto) {
              return res.render('pages/criar-evento',{
                dados: req.body,
                erros: null,
                esporte:dadoesporte,
                dadosNotificacao: { 
                      titulo: "Foto não enviada", 
                      mensagem: "É obrigatório o envio de uma foto para o evento.", 
                      tipo: "error" 
                }
      })

      } else {
        var caminhoFoto = "imagens/evento/" + req.files.foto[0].filename;
        console.log(caminhoFoto)
      }

      const evento = {
        user : req.session.usuario.id,
        esporte,
        foto: caminhoFoto,
        nome,
        data_hora: data + " " + hora,
        data_inicio: data_inicio + " " + hora_inicio,
        data_fim: data_final + " " + hora_final,
        descricao,
        cep: cep.replace(/\D/g, ''),
        numero,
        complemento,
      }

      const resultado = await OrganizadorModel.createEvent(evento, ingressoIDs)

      if (resultado == false){
        OrganizadorModel.ApagarIngresso(ingressoIDs)
        removeImg(caminhoFoto);
      }

      return res.redirect("/evento?id="+resultado)
    }catch(e){
      console.error(e)

      return res.redirect("/error")
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
          data_inicio:"", 
          data_fim:"",
          data_hora:"", 
          descricao:"", 
          cep:"", 
          numero:"", 
          complemento:"",
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
        const resultado = await OrganizadorModel.visualizarEventosUsuarioPaginacao(req.session.usuario, offset, limite) 

        const total_paginas = Math.ceil(resultado.total / limite);

        for (let e of resultado.eventos) {
            if (e.evento_endereco_cep) {
                try {
                    const resposta = await axios.get(`https://viacep.com.br/ws/${e.evento_endereco_cep}/json/`);
                    e.cidade = resposta.data.localidade || '';
                    e.estado = resposta.data.uf || '';
                } catch (error) {
                    e.cidade = '';
                    e.estado = '';
                }
            } else {
                e.cidade = '';
                e.estado = '';
            }
        }

        res.render('pages/home', {
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

}