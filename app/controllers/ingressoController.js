const ingressosModel = require('../models/model-ingressos');
const {MercadoPagoConfig, Preference, Payment} = require('mercadopago');
const { body, validationResult } = require('express-validator');
const {validarCPF} = require("../helpers/validar_pagamento");

const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

module.exports = {
carregarInscricaoEvento: async (req, res) => {
    try {
    const eventoId = req.query.id;
    const evento = await ingressosModel.buscarPagPorId(eventoId);

    let ingressos = JSON.parse(req.body.ingressosSelecionados);

     ingressos = ingressos.map(i => {
      const [id, tipo] = i.id.split('_');
      return { id, tipo, qtd: i.qtd };
    });

    const ingressosDados = await ingressosModel.buscarIngressos(ingressos);
    console.log(ingressosDados);
    res.render('pages/evento-inscricao', { 
        evento, 
        ingressos: ingressosDados, 
        dados: {
            telefone:"",
            cpf:"",
            nascimento:"",
            genero:""
        }
    });

    } catch (e) {
    console.error(e);
    res.redirect('/erro')
    }
    },
    regrasValidacaoPagamento: [
    body("telefone").matches(/^\d{2}\d{9}$/)
    .withMessage("Telefone inválido"),
    body("cpf").custom(cpf => {
            if (!validarCPF(cpf)) {
                throw new Error("CPF inválido");
            }
            return true;
        }),
    body("nascimento").custom(value => {
    const hoje = new Date();
    const dataNasc = new Date(value);
    let idade = hoje.getFullYear() - dataNasc.getFullYear();
    const m = hoje.getMonth() - dataNasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < dataNasc.getDate())) {
        idade--;
    }
    if (idade < 14) {
        throw new Error("Você precisa ter mais de 14 anos");
    }
    return true; // precisa retornar true se estiver válido
})
    ],

    pagamentoEvento: async (req, res) => {
    const {telefone, cpf, nascimento, genero} = req.body;
    let dados = {
        telefone,
        cpf,
        nascimento,
        genero
    }
    const evento = JSON.parse(req.body.evento);
    let ingressos = JSON.parse(req.body.ingressos);
        
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        console.log(errors);
        return res.render('pages/evento-inscricao',{
            dados,
            erros: errors,
            evento,
            ingressos
        })
    }

    try {
            const items = ingressos.map(ingresso => {
            // calcula o valor, dividindo por 2 se for meia
            const valor = ingresso.ingresso_meia === 1
                ? parseFloat(ingresso.ingresso_valor) / 2
                : parseFloat(ingresso.ingresso_valor);

            return {
                title: ingresso.ingresso_nome,
                unit_price: valor,
                quantity: ingresso.qtd
            };
            });

            const preference = new Preference(mp);
            const ingressosPag = await preference.create({
            body: {
                items,
                back_urls: {
                    success: `${process.env.URL_BASE}/ingresso/sucesso`,
                    failure: `${process.env.URL_BASE}/ingresso/erro`,
                    pending: `${process.env.URL_BASE}/ingresso/pending`
                },
                auto_return: "approved", // volta automaticamente ao site quando aprovado
                // NÃO PASSAMOS payer_email → o MP vai pedir na hora do checkout
                },
            });

    return res.redirect(ingressosPag.init_point)    
    } catch (e) {
    console.error(e);
    res.redirect('/erro')
    }
    },
    sucesso: async (req, res) => {
        const { payment_id } = req.query;

        // Create a Payment instance using the existing mp configuration
        const paymentClient = new Payment(mp);

        // buscar pagamento no Mercado Pago pra confirmar
        const payment = await paymentClient.get({id: payment_id}); // Use the correct method: get

        if(payment.status === 'approved') {
            // atualizar o usuário no banco
            // const userId = req.session.usuario.id;
            // await UsuarioModel.ativarPlano(userId);
            // req.session.usuario.tipo = 'organizador'

            console.log("Pagamento aprovado:", payment);

            return res.redirect('/confpagamento');
        }

        // se não aprovado
        res.redirect('/ingresso/erro');
    },

    erro: (req, res) => {
        res.redirect("/erro");
    },

    webhook: async (req, res) => {
   try {
    const notification = req.body; // aqui é a notificação do MP
    const paymentClient = new Payment(mp); // Instantiate here or outside module.exports

  if(notification.type === "payment") {
      const paymentId = notification.data.id;
      
      // Corrected line
      const payment = await paymentClient.get({id: paymentId}); 

            if(payment.status === "approved") {
                // const email = payment.payer.email;
                // const usuario = await UsuarioModel.buscarPorEmail(email);
                // if(usuario) await UsuarioModel.ativarPlano(usuario.id);
                console.log("Pagamento aprovado via webhook:", payment);
            }
        }

        res.sendStatus(200);
    } catch(err) {
        console.error(err);
        res.sendStatus(500);
    }
}   
}