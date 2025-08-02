const AdmModel = require('../models/model-adm');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require("express-validator");

const {removeImg }= require("../helpers/removeImg")

 
module.exports = {
    carregarUsuarios: async (req,res) =>{
        try{
            const usuarios = await AdmModel.UserListarComPaginacao() 
        }catch(e){
            console.error(e)
            throw e;
        }
    }
}