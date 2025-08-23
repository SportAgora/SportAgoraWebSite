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
    const errors = validationResult(req);
        if(!errors.isEmpty()) {
            console.log(errors);
            return res.render('pages/criar-evento',{
                dados: req.body,
                erros: errors
            })
        }
        
    try{
      const {nome, categoria, assunto, foto, data_inicio, data_fim, data_hora, descricao, cep, numero, complemento} = req.body;
      const { ing_nome, ing_valor, ing_quantidade, ing_meia} = req.body;

      const evento = {
        user : req.session.usuario.id,
        categoria: categoria,
        assunto: assunto,
        foto: foto,
        nome: nome,
        data_inicio: data_inicio,
        data_fim: data_fim,
        data_hora: data_hora,
        descricao: descricao,
        cep: cep,
        numero: numero,
        complemento: complemento
      }

      const ingresso = {
        ing_nome : ing_nome,
        ing_valor: ing_valor,
        ing_quantidade : ing_quantidade,
        ing_meia : ing_meia
      }

      const resultado = await OrganizadorModel.createEvent(evento,ingresso)

    }catch(e){
      console.error(e)
      throw e
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
          categoria: "" ,
          assunto:"", 
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