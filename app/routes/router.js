var express = require('express');
var router = express.Router();
const { body, validationResult} = require("express-validator")
var {validarCPF, validarCartao, validarData} = require("../helpers/validar_pagamento");

router.get('/', function(req,res){
    res.render('pages/home');  
})

router.get('/eventos', function(req,res){
    res.render('pages/eventos');  
})

router.get('/pratique', function(req,res){
    res.render('pages/pratique');  
})

router.get('/login', function(req,res){
    res.render('pages/login', { "erros": null, "valores": {"email":"","senha":""},"retorno":null });  
})

router.get('/home', function(req,res){
    res.render('pages/home');  
})

router.get('/planos', function(req,res){
    res.render('pages/planos');  
})

router.get('/infopost', function(req,res){
    res.render('pages/infopost');  
})

router.get('/infoevento', function(req,res){
    res.render('pages/infoevento');  
})

router.get('/infoevento2', function(req,res){
    res.render('pages/infoevento2');  
})

router.get('/perfilex', function(req,res){
    res.render('pages/perfilex');  
})

router.get('/organizador', function(req,res){
    res.render('pages/organizador');  
})


router.get('/inscrito', function(req,res){
    res.render('pages/inscrito');  
})

router.get('/intem-do-carrosel', function(req,res){
  res.render('pages/intem-do-carrosel');  
})


router.get('/infoevento-natacao.ejs', function(req,res){
  res.render('pages/infoevento-natacao.ejs');  
})

router.get('/registro', function(req,res){
    res.render('pages/registro', { "erros": null, "valores": {"nome":"","email":"","senha":"","repsenha":""},"retorno":null });  
})

router.post(
    "/login_post",
    body("email").isEmail().withMessage("Email inválido."),
    body("senha").isStrongPassword().withMessage("Senha muito fraca!"),
    function (req, res) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors);
        return res.render("pages/login", { "erros": errors, "valores":req.body,"retorno":null});
      }
  
        return res.render("pages/perfilex", { "erros": null, "valores":req.body,"retorno":req.body});
    }
  );

  router.post(
    "/registro_post",
    body("nome").isLength({min:3,max:30}).withMessage("Insira um nome válido."),
    body("email").isEmail().withMessage("Email inválido."),
    body("senha").isStrongPassword().withMessage("Senha muito fraca!"),
    body("repsenha").custom((value, { req }) => {
        return value === req.body.senha;
    }).withMessage("Senhas estão diferentes"),
    function (req, res) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors);
        return res.render("pages/registro", { "erros": errors, "valores":req.body,"retorno":null});
      }
  
        return res.render("pages/perfilex", { "erros": null, "valores":req.body,"retorno":req.body});
    }
  );

  router.post(
    "/pagamento_selec",
    function (req, res) {
        let selected_plan = req.body.plano
        switch(selected_plan){
            case "basico" : selected_plan = "Sport Básico"; var price = "R$9,90"; break;
            case "premium" : selected_plan = "Sport Premium"; var price = "R$29,90"; break;
            case "plus" : selected_plan = "Sport Plus"; var price = "R$19,90"; break;
        }

        return res.render("pages/pagamento", {"erros": null,"valores":{"selecionado":selected_plan, "preco":price}})
    }


  )


  router.get('/pagamento', function(req,res){
    res.render('pages/pagamento', { "erros": null, "valores": {"nome":"","sobrenome":"","cpf":"","cartao_numero":"","cartao_validade":"","cartao_cvv":""},"retorno":null });  
})

  router.post(
    "/processar_pagamento",
    body("nome").isLength({min:3,max:30}).withMessage("Insira um nome válido."),
    body("sobrenome").isLength({min:3,max:30}).withMessage("Insira um sobrenome válido."),
    body("cpf")
    .custom((value) => {
        if (validarCPF(value)) {
          return true;
        } else {
          throw new Error('CPF inválido!');
        }
        }),
    body("cartao_numero")
    .custom((value) => {
      if (validarCartao(value)){
        return true
      } else {
        throw new Error("Cartão Inválido")
      }
    }),
    body("cartao_validade")
    .custom((value) => {
      if (validarData(value)){
        return true
      } else {
        throw new Error("Data Inválido")
      }
    }),
    body("cartao_cvv").isLength({min:3,max:3}).withMessage("Código Inválido"),
    function (req, res) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors);
        return res.render("pages/pagamento", { "erros": errors, "valores":req.body,"retorno":null});
      } else {
  
        return res.render("pages/confpagamento", { "erros": null, "valores":req.body,"retorno":req.body});
      }
    }
  );

module.exports = router;
