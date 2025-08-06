const AdmModel = require('../models/model-adm');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require("express-validator");

const {removeImg }= require("../helpers/removeImg")

 
module.exports = {
    carregarUsuarios: async (req,res) =>{
        try{
            const pagina = parseInt(req.query.pagina) || 1;
            const limite = 10;
            const offset = (pagina - 1) * limite;
            const resultado = await AdmModel.UserListarComPaginacao(offset, limite) 

            const total_paginas = Math.ceil(resultado.total / limite);
            console.log(resultado)
            res.render('pages/adm/usuarios', {
            usuarios: resultado.usuarios,
            paginador: {
                pagina_atual: pagina,
                total_paginas
            }
            });
        }catch(e){
            console.error(e)
            throw e;
        }
    }
}