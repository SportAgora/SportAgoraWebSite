const PagsModel = require('../models/model-pags');
const { body, validationResult } = require("express-validator");
const axios = require('axios'); 

module.exports = {
    carregarHome: async (req,res) =>{
        try{
            const pagina = parseInt(req.query.pagina) || 1;
            const limite = 18;
            const offset = (pagina - 1) * limite;
            const resultado = await PagsModel.EventosListarComPaginacao(offset, limite) 

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
    visualizarEvento: async (req, res) => {
    try {
      const id = req.query.id;
      const evento = await PagsModel.buscarPagPorId(id);

      if (!evento) {
        return res.render('pages/erro',
            {
            error: 404,
            mensagem: "Página não encontrada"
        }
        );
      }

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

    const ingresso = await PagsModel.buscarIngressosPorEvento(id);
    evento.ingressos = ingresso;
    console.log(evento)
    res.render('pages/evento', {evento});
    } catch (error) {
      console.error(error);
      res.render('pages/error',
        {
            error: 404,
            mensagem: "Página não encontrada"
        }
      );
    }
    },
    carregarFiltrosRapidos: async (req,res, next) =>{
        try{
            const esporte = await PagsModel.EsportFindAll();
            res.locals.filtro_rapido = esporte;
            next();
        }catch(e){
            console.error(e)
            throw e;
        }
      },
    pesquisarEventos: async (req, res) => {
        try {
            const termo = req.query.q; // pega ?q= do form
            const eventos = await PagsModel.buscarEventos(termo);
            res.render('pages/pesquisa', { eventos, termo });
        } catch (e) {
            console.error(e);
            res.status(500).send("Erro ao pesquisar eventos");
        }
    },
    paginaFiltroRapido: async (req,res) =>{
        try{
            const pagina = parseInt(req.query.pagina) || 1;
            const limite = 18;
            const offset = (pagina - 1) * limite;
            const resultado = await PagsModel.EventosListarComPaginacaoFiltroRapido(offset, limite, req.query.id) 

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

            const filtro_usado = await PagsModel.buscarEsporteId(req.query.id);

            res.render('pages/filtro-rapido', {
            filtro_usado,
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