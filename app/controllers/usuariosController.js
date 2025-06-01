const UsuarioModel = require('../models/model-usuario');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require("express-validator");
const removeImg = require("../helpers/removeImg"); 
 
module.exports = {
  regrasValidacao: [
    body("nome").isLength({min:3,max:30}).withMessage("Insira um nome válido."),
    body("email").isEmail().withMessage("Email inválido."),
    body("senha").isStrongPassword().withMessage("Senha muito fraca!"),
    body("repsenha").custom((value, { req }) => {
    return value === req.body.senha;
    }).withMessage("Senhas estão diferentes")
  ],
  

  cadastrarUsuarioNormal: async (req, res) => {
    
    const errors = validationResult(req);
        if(!errors.isEmpty()) {
            console.log(errors);
            return res.render('pages/registro',{
                dados: req.body,
                erros: errors
            })
        }

    try {

      const {nome, email, senha } = req.body;
     
      // Verificar se email já existe
      if (email){
      const usuarioExistente = await UsuarioModel.findByEmail(email);
      if (usuarioExistente) {
        res.render("pages/registro", {
        dados: req.body,
        erros: { errors: [{ path: 'email', msg: "Este email já está cadastrado" }] }
      });
    }
      }
     
      // Hash da senha
      const senhaHash = await bcrypt.hash(senha, 10);
     
      // Criar o usuário
      const novoUsuario = await UsuarioModel.create({
        nome: nome,
        email: email,
        senha: senhaHash,
      });
     
      // AUTOLOGIN: Criar sessão diretamente após cadastro
      req.session.usuario = {
        id: novoUsuario.insertId, // ID do novo usuário
        email: email,
        nome: nome
      };
     
      // Redirecionar para contaConsumidor
      res.redirect("/perfil");
     
    } catch (e) {
      console.error(e);
      res.render("pages/registro", {
  dados: req.body,
  erros: { errors: [{ path: 'email', msg: "Ocorreu um erro ao criar a conta" }] }
});

      
    }
  },

  regrasValidacaoLogin :[
  body("email").isEmail().withMessage("Email inválido."),
  body("senha").notEmpty().withMessage("Senha obrigatória.")
],
 
  // Autenticar usuário (login)
autenticarUsuario: async (req, res) => {
    try {
      const errors = validationResult(req);
        if(!errors.isEmpty()) {
            console.log(errors);
            return res.render('pages/login',{
                dados: req.body,
                erros: errors
            })
        }

      const { email, senha } = req.body;
     
      // Buscar usuário pelo email
      const usuario = await UsuarioModel.findByEmail(email);
     
      if (!usuario) {
        return res.render("pages/login", {
           dados: req.body,
          erros: { errors: [{ path: 'email', msg: "Este email não está cadastrado ou está digitado errado." }] }
        });
      }
     
      // Verificar se a senha está correta
      const senhaCorreta = await bcrypt.compare(senha, usuario.usu_senha);
     
      if (!senhaCorreta) {
        return res.render("pages/login", {
           dados: req.body,
          erros: { errors: [{ path: 'email', msg: "Senha incorreta." }] }
        });
      }
     
      // Criar a sessão do usuário
      req.session.usuario = {
        id: usuario.usu_id,
        email: usuario.usu_email,
        nome: usuario.usu_nome
      };
     
       res.redirect("/perfil");
    } catch (error) {
      console.error(error);
      res.render("pages/login", {
        dados: req.body,
        erros: { errors: [{ path: 'email', msg: "Erro ao logar, tente novamente mais tarde." }] }
      });
    }
  },
 
  // Logout
  logout: (req, res) => {
    req.session.destroy(() => {
      res.redirect("/login");
    });
  },

  carregarPerfil: async (req, res) => {
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
        foto: userinfos.usu_img,
        banner: userinfos.usu_banner
        }
    });

  } catch (err) {
    console.error(err);
    // Aqui também use return pra garantir que não continue
    return res.redirect("/login");
  }
},

  carregarEditarPerfil: async (req, res) => {
  try {
    const user = req.session.usuario;
    const userinfos = await UsuarioModel.findByEmail(user.email);
    
    res.render("pages/editar-perfil", {
        usuario: {
        id: userinfos.usu_id,
        nome: userinfos.usu_nome,
        email: userinfos.usu_email,
        arroba: userinfos.perf_nome,
        bio: userinfos.biografia,
        foto: userinfos.usu_img,
        banner: userinfos.usu_banner
        // telefone: userinfos.quantidade_seguidores,
        // cep: userinfos.quantidade_seguindo,
        // numero_cep: userinfos.numero_cep
        }
    });

  } catch (err) {
    console.error(err);
    // Aqui também use return pra garantir que não continue
    return res.redirect("/login");
  }
},  
    regrasValidacaoEditarPerfil: [
  body("nome").isLength({ min: 3 }).withMessage("Nome deve ter pelo menos 3 letras."),
  body("email").isEmail().withMessage("Email inválido."),
  body("senha").optional({ checkFalsy: true }).isStrongPassword().withMessage("Senha fraca. Use letras, números e símbolos."),
  body("repsenha").custom((value, { req }) => {
    if (req.body.senha && value !== req.body.senha) {
      throw new Error("Senhas não coincidem.");
    }
    return true;
  })
    ],
    gravarPerfil: async (req, res) => {
    const errors = validationResult(req);
    const erroMulter = req.session.erroMulter;

    if (!errors.isEmpty() || erroMulter != null) {
      let listaErros = !errors.isEmpty() ? errors : { formatter: null, errors: [] };
      if (erroMulter) {
        listaErros.errors.push(erroMulter);
      }
      console.log(listaErros)
      return res.render("pages/editar-perfil", {
        dados: req.body,
        erros: listaErros
      });
    }

    try {
      const { nome, email, senha, arroba, bio } = req.body;

      const dadosAtualizados = {
        usu_nome: nome,
        usu_email: email,
        perf_nome: arroba,
        biografia: bio
      };

      if (senha && senha !== "") {
        dadosAtualizados.usu_senha = await bcrypt.hash(senha, 10);
      }

      const imagemPerfil = req.files?.fotoPerfil?.[0];
      const imagemBanner = req.files?.fotoBanner?.[0];

      if (imagemPerfil) {
      dadosAtualizados.usu_img = "imagem/perfil/" + imagemPerfil.filename;
      removeImg(req.session.usuario.foto); 
      }

      if (imagemBanner) {
      dadosAtualizados.banner_img = "imagem/perfil/" + imagemBanner.filename;
      removeImg(req.session.usuario.banner); 
      }

      const resultado = await UsuarioModel.atualizar(req.session.usuario.id, dadosAtualizados);

      if (resultado.changedRows === 1) {
        const usuarioAtualizado = await UsuarioModel.findByEmail(email);

        req.session.usuario = {
          nome: usuarioAtualizado.usu_nome,
          email: usuarioAtualizado.usu_email,
          foto: usuarioAtualizado.usu_img,
          banner: usuarioAtualizado.usu_banner
        };

        res.render("pages/editar-perfil", {
          dados: req.body,
          erros: null,
          usuario: {
            nome: usuarioAtualizado.usu_nome,
            email: usuarioAtualizado.usu_email,
            arroba: usuarioAtualizado.perf_nome,
            bio: usuarioAtualizado.biografia,
            foto: usuarioAtualizado.usu_img,
            banner: usuarioAtualizado.usu_banner
          }
        });
      } else {
        res.render("pages/editar-perfil", {
          dados: req.body,
          erros: null,
          usuario: req.body
        });
      }

    } catch (e) {
      console.error(e);
      res.render("pages/editar-perfil", {
        dados: req.body,
        erros: { errors: [{ path: 'email', msg: "Erro ao atualizar o perfil. Tente novamente mais tarde." }] }
      });
    }
  }

  

};
 