//REFAZER POIS MUDAMOS O PAGAMENTO



// const pagamentoModel = require('../models/model-usuario');
// const bcrypt = require('bcryptjs');
const { body, validationResult } = require("express-validator");
const {validarCPF, validarCartao, validarData} = require("../helpers/validar_pagamento")
 
module.exports = {
    regrasValidacaoPagamento: [
    body('nome')
      .isLength({ min: 2 }).withMessage('Nome deve ter ao menos 2 caracteres.')
      .trim().escape(),

    body('sobrenome')
      .isLength({ min: 2 }).withMessage('Sobrenome deve ter ao menos 2 caracteres.')
      .trim().escape(),

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
    body("cartao_cvv").isLength({min:3,max:3}).withMessage("Código Inválido")
  ],

  receberPlano: (req, res) => {
    try {
      const planoSelecionado = req.body.plano; // vem do form POST
      const planos = {
        basico: 'Sport Básico',
        premium: 'Sport Premium',
        plus: 'Sport Plus'
      };

      const nomePlano = planos[planoSelecionado] || 'Plano desconhecido';

      switch(planoSelecionado){
            case "basico" :  var price = "R$9,90"; break;
            case "premium" :  var price = "R$29,90"; break;
            case "plus" : var price = "R$19,90"; break;
            default: var price = "R$9,90;"; break;
        }

      // Renderiza a view de pagamento passando o nome do plano
      res.render('pages/pagamento', { erros: null, valores: {
    nome: req.body.nome,
    sobrenome: req.body.sobrenome,
    cpf: req.body.cpf,
    cartao_numero: req.body.cartao_numero ,
    cartao_validade: req.body.cartao_validade ,
    cartao_cvv: req.body.cartao_cvv,
    plano: nomePlano,  
    preco: price
  },});

    } catch (error) {
      console.error(error);
      // Em caso de erro, pode redirecionar ou renderizar uma página de erro
      res.render('pages/planos', {
        erros: { errors: [{ msg: "Erro ao processar o plano selecionado." }] }
      });
    }
  },


  processarPagamento: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('pages/pagamento', {
        erros: errors,
        valores: req.body
      });
    }

    // Se passou na validação, pode continuar o processamento do pagamento
    const {
      nome, sobrenome, cpf,
      cartao_numero, cartao_validade,
      cartao_cvv, permicao, plano, preco
    } = req.body;

    // Aqui você faz o processamento real do pagamento (exemplo fictício)
    // Depois redireciona ou mostra confirmação
    try {
      // TODO: Implementar lógica de pagamento

      res.redirect('/perfilex');
    } catch (error) {
      console.error(error);
      res.render('pages/pagamento', {
        erros: { errors: [{ msg: 'Erro ao processar o pagamento. Tente novamente.' }] },
        valores: req.body
      });
    }
  }

};
