const UsuarioModel = require('../models/model-usuario');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require("express-validator");
const https = require("https");
const jwt = require("jsonwebtoken");
const { enviarEmail } = require("../helpers/email");
const emailAtivarConta = require("../helpers/email-ativar-conta");

const {removeImg }= require("../helpers/removeImg")

 
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
                erros: errors,
                dadosNotificacao: ""
            })
        }

    try {

      const {nome, email, senha } = req.body;

      if (email){
      const usuarioExistente = await UsuarioModel.findByEmail(email);
      if (usuarioExistente) {
       return res.render("pages/registro", {
        dados: req.body,
        erros: { errors: [{ path: 'email', msg: "Este email já está cadastrado" }] },
        dadosNotificacao: {
          titulo: "Falha ao cadastrar!",
          mensagem: "Este e-mail já está cadastrado!",
          tipo: "error",
        },
      });
    }

    if (nome){
      const nomeExistente = await UsuarioModel.findByName(nome);
      if (nomeExistente) {
        return res.render("pages/registro", {
        dados: req.body,
        erros: { errors: [{ path: 'nome', msg: "Este nome já está cadastrado" }] },
        dadosNotificacao: {
          titulo: "Falha ao cadastrar!",
          mensagem: "Este nome já está cadastrado!",
          tipo: "error",
        },
      });
    }
  }

      }
     
      const senhaHash = await bcrypt.hash(senha, 10);
     
      const novoUsuario = await UsuarioModel.create({
        nome: nome,
        email: email,
        senha: senhaHash,
        foto: "imagens/usuarios/default_user.jpg",
        banner: "imagens/usuarios/default_background.jpg",
        status: 0
      });

      const token = jwt.sign(
        { userId: novoUsuario },
        process.env.SECRET_KEY
      );

      console.log("criou o token")

      const html = require('../helpers/email-ativar-conta')(process.env.URL_BASE, token, nome);
      console.log("configurou o email")
      enviarEmail(email, "Cadastro no site SportAgora", null, html, ()=>{
        return res.render("pages/registro", {
          erros: null,
          dadosNotificacao: {
            titulo: "Cadastro realizado!",
            mensagem: "Novo usuário criado com sucesso!<br>"+
            "Enviamos um e-mail para a ativação de sua conta",
            tipo: "success",
          },
          dados: req.body
        });
      });
      console.log("mandou o email")
      return res.redirect('/login')
     
    } catch (e) {
      console.error(e);
      res.render("pages/registro", {
      dados: req.body,
      erros: { errors: [{ path: 'email', msg: "Ocorreu um erro ao criar a conta" }] },
      dadosNotificacao: "",
    });
    }
  },

  ativarConta: async (req, res) => {
  try {
    const token = req.query.token;

    // Verifica o token de forma síncrona
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Busca o usuário
    const user = await UsuarioModel.findId(decoded.userId);
    if (!user) {
      console.log({ message: "Usuário não encontrado" });
      return res.render("pages/login", {
        erros: null,
        dadosNotificacao: {
        titulo: "Algo deu errado!",
        mensagem: "Conta não encontrada, verifique o link de ativação.",
        tipo: "error",
        },
        dados: { email: "", senha: "" },
        retorno: null
      });
    }

    // Ativa a conta
    await UsuarioModel.ativarConta(decoded.userId);

    // Renderiza página de login com notificação
    res.render("pages/login", {
      erros: null,
      dadosNotificacao: {
        titulo: "Sucesso",
        mensagem: "Conta ativada, use seu e-mail e senha para acessar o seu perfil!",
        tipo: "success",
      },
      dados: { email: "", senha: "" },
      retorno: null
    });

  } catch (err) {
    console.log({ message: "Token inválido ou expirado", err });
    res.render("pages/login", {
      erros: ["Token inválido ou expirado"],
      dadosNotificacao: null,
      dados: { email: "", senha: "" },
      retorno: null
    });
  }
}
,

  regrasValidacaoFormNovaSenha: [
    body("senha")
      .isStrongPassword()
      .withMessage(
        "A senha deve ter no mínimo 8 caracteres (mínimo 1 letra maiúscula, 1 caractere especial e 1 número)"
      )
      ,
    body("rep_senha")
      .isStrongPassword()
      .withMessage(
        "A senha deve ter no mínimo 8 caracteres (mínimo 1 letra maiúscula, 1 caractere especial e 1 número)"
      ).custom(async (value, { req }) => {
        if (value !== req.body.rep_senha) {
          throw new Error("As senhas não são iguais!");
        }
      }),
  ],

  regrasValidacaoFormRecSenha: [
    body("email")
      .isEmail()
      .withMessage("Digite um e-mail válido!")
      .custom(async (value) => {
        const nomeUsu = await UsuarioModel.findByEmail(value);
        if (!nomeUsu) {
          throw new Error("E-mail não encontrado");
        }
      }),
  ],


  recuperarSenha: async (req, res) => {
    const erros = validationResult(req);
    console.error(erros);
    if (!erros.isEmpty()) {
      return res.render("pages/recuperar-senha", {
        dados: req.body,
        dadosNotificacao: null,
        erros: erros
      });
    }
    try {
      //logica do token
      user = await UsuarioModel.findByEmail(req.body.email);
      const token = jwt.sign(
        { userId: user.usu_id, expiresIn: "25m" },
        process.env.SECRET_KEY
      );

      //enviar e-mail com link usando o token
      html = require("../helpers/email-reset-senha")(process.env.URL_BASE, token, user.usu_nome)
      enviarEmail(req.body.email, "Pedido de recuperação de senha", null, html, ()=>{
        return res.render("pages/recuperar-senha", {
          erros: null,
          dadosNotificacao: {
            titulo: "Recuperação de senha",
            mensagem: "Enviamos um e-mail com instruções para resetar sua senha",
            tipo: "success",
          },
          dados: req.body
        });
      });

    } catch (e) {
      console.log(e);
    }
  },

  validarTokenNovaSenha: async (req, res) => {
    //receber token da URL
    const token = req.query.token;
    console.log(token);
    //validar token
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        res.render("pages/recuperar-senha", {
          erros: null,
          dadosNotificacao: { titulo: "Link expirado!", mensagem: "Insira seu e-mail para iniciar o reset de senha.", tipo: "error", },
          dados: req.body,
          
        });
      } else {
        res.render("pages/resetar-senha", {
          erros: null,
          usuario: req.session.usuario,
          usu_id: decoded.userId,
          dadosNotificacao: null
        });
      }
    });
  },

  regrasValidacaoFormNovaSenha: [
    body("senha")
      .isStrongPassword()
      .withMessage(
        "A senha deve ter no mínimo 8 caracteres (mínimo 1 letra maiúscula, 1 caractere especial e 1 número)"
      )
      .custom(async (value, { req }) => {
        if (value !== req.body.rep_senha) {
          throw new Error("As senhas não são iguais!");
        }
      }),
    body("rep_senha")
      .isStrongPassword()
      .withMessage(
        "A senha deve ter no mínimo 8 caracteres (mínimo 1 letra maiúscula, 1 caractere especial e 1 número)"
      ),
  ],
  
  resetarSenha: async (req, res) => {
    const erros = validationResult(req);
    console.log(erros);
    if (!erros.isEmpty()) {
      return res.render("pages/resetar-senha", {
        erros: erros,
        dadosNotificacao: null,
        dados: req.body,
        usu_id: req.body.usu_id
      });
    }
    try {
      //gravar nova senha
      senha = await bcrypt.hash(req.body.senha, 10);
      console.log(req.body.usu_id);
      console.log(senha);
      console.log(req.body.senha);
      const resetar = await UsuarioModel.atualizar(req.body.usu_id, {senha:senha} );
      console.log(resetar);
      res.redirect("/login");
    } catch (e) {
      console.log(e);
    }
  },


  regrasValidacaoLogin :[
  body("email").isEmail().withMessage("Email inválido.")
],
 

autenticarUsuario: async (req, res, tipo = "comum") => {
    let pag = "pages/login";
      switch(tipo){
        case "comum": pag = 'pages/login'; break;
        case "organizador": pag = 'pages/login'; break;
        case "administrador": pag = 'pages/adm/login'; break;
        default : pag = 'pages/login'; break;
      }
    try {

      const errors = validationResult(req);
        if(!errors.isEmpty()) {
            console.log(errors);
            return res.render(pag,{
                dados: req.body,
                erros: errors
            })
        }

      const { email, senha } = req.body;
     
      const usuario = await UsuarioModel.findByEmail(email);
     
      if (!usuario) {
        return res.render(pag, {
           dados: req.body,
          erros: { errors: [{ path: 'email', msg: "Este email não está cadastrado ou está digitado errado." }] },
          dadosNotificacao: {
            titulo: "E-mail não cadastrado",
            mensagem: "Este e-mail não está cadastrado ou está digitado errado.",
            tipo: "error",
          }
        });
      }
     
      const senhaCorreta = await bcrypt.compare(senha, usuario.usu_senha);
     
      if (!senhaCorreta) {
        return res.render(pag, {
           dados: req.body,
          erros: { errors: [{ path: 'senha', msg: "Senha incorreta." }] },
          dadosNotificacao: {
            titulo: "Senha incorreta",
            mensagem: "A senha digitada está incorreta.",
            tipo: "error",
          }
        });
      }
     
      req.session.usuario = {
        id: usuario.usu_id,
        email: usuario.usu_email,
        nome: usuario.usu_nome,
        foto: usuario.usu_foto,
        banner: usuario.usu_banner,
        tipo: usuario.tipo
      };
      
      if (usuario.tipo === "administrador") {
       res.redirect("/adm/home");
      } else {
        res.redirect("/perfil");
      }
    } catch (error) {
      console.error(error);
      res.render(pag, {
        dados: req.body,
        erros: { errors: [{ path: 'email', msg: "Erro ao logar, tente novamente mais tarde." }] },
        dadosNotificacao: {
            titulo: "Algo deu errado!",
            mensagem: "Algum erro ocorreu, tente novamente mais tarde.",
            tipo: "error",
          }
      });
    }
  },
 
  logout: (req, res) => {
    req.session.destroy(() => {
      res.redirect("/login");
    });
  },

  carregarPerfil: async (req, res) => {
  try {
    const user = req.session.usuario;
    var userinfos = await UsuarioModel.findByEmail(user.email);
    userinfos.tipo = userinfos.tipo[0].toUpperCase() + userinfos.tipo.substring(1);
    res.render("pages/perfil", {
        usuario: {
        id: userinfos.usu_id,
        nome: userinfos.usu_nome,
        email: userinfos.usu_email,
        arroba: userinfos.perf_nome,
        seguidores: userinfos.quantidade_seguidores,
        seguindo: userinfos.quantidade_seguindo,
        foto: userinfos.usu_foto,
        banner: userinfos.usu_banner,
        tipo: userinfos.tipo
        },
        dadosNotificacao:""
    });

  } catch (err) {
    console.error(err);
    return res.redirect("/login");
  }
},

  carregarEditarPerfil: async (req, res) => {
  try {
    const user = req.session.usuario;
    const userinfos = await UsuarioModel.findByEmail(user.email);
    
    res.render("pages/editar-perfil", {
        valores: {
        id: userinfos.usu_id,
        nome: userinfos.usu_nome,
        email: userinfos.usu_email,
        arroba: userinfos.perf_nome,
        foto: userinfos.usu_foto,
        banner: userinfos.usu_banner
        },
        erros:"",
        dadosNotificacao:""
    });

  } catch (err) {
    console.error(err);
    return res.redirect("/login");
  }
},

    regrasValidacaoPerfil: [
        body("nome")
        .optional()
            .isLength({ min: 3, max: 45 }).withMessage("Nome deve ter de 3 a 45 caracteres!"),
        body("email")
        .optional()
            .isEmail().withMessage("Digite um e-mail válido!"),
        body("senha")
        .optional({ checkFalsy: true })
        .isStrongPassword().withMessage("Senha muito fraca!"),
        body("repsenha").custom((value, { req }) => {
          return value === req.body.senha;
        }).withMessage("Senhas estão diferentes")
    ],

    gravarPerfil: async (req, res) => {
    
      const erros = validationResult(req);
      const erroMulter = req.session.erroMulter;
       if (!erros.isEmpty() || erroMulter != null ) {
            lista =  !erros.isEmpty() ? erros : {formatter:null, errors:[]};
            if(erroMulter != null ){
                lista.errors.push(erroMulter);
            } 
            console.log(lista)
            return res.render("pages/editar-perfil", { erros: lista, 
              valores: {
              nome: req.body.nome,
                email: req.body.email,
                foto: req.session.usuario.foto,
                banner: req.session.usuario.banner,
                senha: ""
                
              }, 
              dadosNotificacao: {
                  titulo: "Erro ao atualizar o perfil!",
                  mensagem: "Verifique se os dados foram inseridos corretamente.",
                  tipo: "error"
              } })
        }
        try {
            var dadosForm = {
                nome: req.body.nome,
                email: req.body.email,
                foto: req.session.usuario.foto,
                banner: req.session.usuario.banner,
                senha: req.body.senha
            };

              if (req.body.senha && req.body.senha.trim() !== "") {
                  dadosForm.senha = bcrypt.hashSync(req.body.senha, 10);
              } else {
                  delete dadosForm.senha; // Remove do objeto para não sobrescrever
              }
            if (!req.files || (!req.files.foto && !req.files.banner)) {
                console.log("Nenhuma imagem enviada.");
              } else {
                if (req.files.foto) {
                  const caminhoFoto = "imagens/perfil/" + req.files.foto[0].filename;
                  if (dadosForm.foto !== caminhoFoto && dadosForm.foto !== "imagens/usuarios/default_user.jpg") removeImg(dadosForm.foto);
                  dadosForm.foto = caminhoFoto;
                }

                if (req.files.banner) {
                  const caminhoBanner = "imagens/perfil/" + req.files.banner[0].filename;
                  if (dadosForm.banner !== caminhoBanner && dadosForm.banner !== "imagens/usuarios/default_background.jpg") removeImg(dadosForm.banner);
                  dadosForm.banner = caminhoBanner;
                }
              }


            let resultUpdate = await UsuarioModel.atualizar(req.session.usuario.id, dadosForm);
            if (resultUpdate) {
                if (resultUpdate.changedRows == 1) {
                  var result = await UsuarioModel.findId(req.session.usuario.id);
                  var usuario = {
                    nome: result.usu_nome,
                    id: result.usu_id,
                    foto: result.usu_foto,
                    email: result.usu_email,
                    banner: result.usu_banner
                  }
                
                  
                   req.session.usuario = usuario;

                  var valores = usuario;
                  valores.senha = "";
                  console.log("salvo")

                  //salvo certo
                  res.render("pages/editar-perfil", {
                    erros: null,
                    valores: valores,
                    dadosNotificacao: { 
                      titulo: "Perfil! atualizado com sucesso", 
                      mensagem: "Alterações Gravadas", 
                      tipo: "success" 
                  }
                  });
                } else {
                  //salvo certo mas sem alterar nada
                  console.log("nada pra salvar")
                  res.render("pages/editar-perfil", {
                    erros: null,
                    valores: dadosForm,
                    dadosNotificacao: { 
                      titulo: "Perfil! atualizado com sucesso", 
                      mensagem: "Sem alterações", 
                      tipo: "success" 
                    }
                });
                }
            }

    } catch(e){
      console.log(e)
      res.render("pages/editar-perfil", {valores: req.body, erros: erros,
        dadosNotificacao: {  
          titulo: "Erro ao atualizar o perfil!", 
          mensagem: "Verifique os valores digitados!", 
          tipo: "error" 
        }
      })

    }
  },
};