const PagsModel = require('../models/model-pags');
const { body, validationResult } = require("express-validator");

module.exports = {
    carregarHome: async (req,res) =>{
        try{
            const pagina = parseInt(req.query.pagina) || 1;
            const limite = 18;
            const offset = (pagina - 1) * limite;
            const resultado = await PagsModel.EventosListarComPaginacao(offset, limite) 

            const total_paginas = Math.ceil(resultado.total / limite);
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