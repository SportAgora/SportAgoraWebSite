const OrganizadorModel = require('../models/model-organizador');
const { body, validationResult } = require("express-validator");

const {removeImg}= require("../helpers/removeImg")

 
module.exports = {
  criarEventoValidacao: [
    body("nome").isLength({min:10}).withMessage("O nome do evento está muito curto."),
    body("nome").isLength({max:150}).withMessage("O nome do evento está muito longo."),

    body("data_inicio").custom((value) => {
        return value.getTime() > new Date().getTime() .getTime()
      }).withMessage("A data de início das vendas precisa ser posterior a data atual."),
    body("data_fim").custom((value, { req }) => {
      return value.getTime() > req.body("data_inicio")
    }).withMessage("A data de fim das vendas precisa ser posterior a data de início das vendas."),
    body("data_hora").custom((value, { req }) => {
      return value.getTime() > req.body("data_fim")
    }).withMessage("A data de ínício do evento precisa ser posterior a data do fim das vendas."),

    body("descricao").isLength({min:100}).withMessage("O texto está  muito curto."),
    body("descricao").isLength({max:1500}).withMessage("O texto está  muito longo."),

    body("ing_nome").isLength({min:5}).withMessage("O nome do ingresso precisa ser maior"),
    body("ing_nome").isLength({max:70}).withMessage("O nome do ingresso precisa ser menor"),

    body("ing_valor").custom((value) => {
      return ing_valor >= 0;
    }),
    body("ing_quantidade").custom((value) => {
      return ing_valor >= 1;
    }),
   ],
  

  criarEvento: async (req, res) => {
    const dadocategoria = await OrganizadorModel.CategoriasFindAll();
    const dadoassunto = await OrganizadorModel.AssuntosFindAll();
    const errors = validationResult(req);
    const erroMulter = req.session.erroMulter;
        if(!errors.isEmpty() || erroMulter != null) {
              lista =  !errors.isEmpty() ? errors : {formatter:null, errors:[]};
                if(erroMulter != null ){
                    lista.errors.push(erroMulter);
              } 
            console.log(lista);
            return res.render('pages/criar-evento',{
                dados: req.body,
                erros: lista,
                categoria:dadocategoria,
                assunto: dadoassunto
            })
        }
        
    try{
      const {nome, categoria, assunto, data, hora, data_inicio, hora_inicio, data_final, hora_final, descricao, cep, numero, complemento} = req.body;
      const { ingressos } = req.body;
      
      const ingressoIDs = await OrganizadorModel.createIngresso(ingressos)

      if (!req.files || !req.files.foto) {
              console.log("ERRO NO CARAI DA PORRA DA IMAGEM: " + req.files)
              return res.render('pages/criar-evento',{
                dados: req.body,
                erros: null,
                categoria:dadocategoria,
                assunto: dadoassunto
      }) //colocar msg que precisa mandar foto

      } else {
        var caminhoFoto = "imagens/evento/" + req.files.foto[0].filename;
        console.log(caminhoFoto)
      }

      const evento = {
        user : req.session.usuario.id,
        categoria,
        assunto,
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
      console.log(evento)

      const resultado = await OrganizadorModel.createEvent(evento, ingressoIDs)
      console.log(resultado)

      if (resultado == false){
        OrganizadorModel.ApagarIngresso(ingresso)
        removeImg(caminhoFoto);
      }

      return res.send( "Evento criado com sucesso!" )
    }catch(e){
      console.error(e)

      return res.redirect("/erro")
    }
  }, 
  carregarCriarEvento: async (req, res) => {
  try {
    const categoria = await OrganizadorModel.CategoriasFindAll();
    const assunto = await OrganizadorModel.AssuntosFindAll();

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
          categoria: categoria,
          assunto: assunto
         }
    });

  } catch (err) {
    console.error(err);
    return res.redirect("/login");
  }
},

}