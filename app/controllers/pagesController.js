const PagesModel = require('../models/model-pages');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require("express-validator");

const {removeImg }= require("../helpers/removeImg")

 
module.exports = {
    carregarHome: async (req, res) => {
  try {
    const user = req.session.usuario;
    const userinfos = await UsuarioModel.findByEmail(user.email);
    
    res.render("pages/perfil", {
        usuario: {
        id: userinfos.usu_id,
        nome: userinfos.usu_nome,
        email: userinfos.usu_email,
        arroba: userinfos.perf_nome,
        bio: userinfos.biografia,
        seguidores: userinfos.quantidade_seguidores,
        seguindo: userinfos.quantidade_seguindo,
        foto: userinfos.usu_foto,
        banner: userinfos.usu_banner
        }
    });

  } catch (err) {
    console.error(err);
    return res.redirect("/login");
  }
},

}