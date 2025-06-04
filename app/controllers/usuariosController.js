const UsuarioModel = require('../models/model-usuario');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require("express-validator");

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
        foto: "imagens/usuarios/default_user.jpg",
        banner: "imagens/usuarios/default_background.jpg"
      });
     
      // AUTOLOGIN: Criar sessão diretamente após cadastro
      req.session.usuario = {
        id: novoUsuario.insertId, // ID do novo usuário
        email: email,
        foto: "imagens/usuarios/default_user.jpg",
        banner: "imagens/usuarios/default_background.jpg"
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
  body("email").isEmail().withMessage("Email inválido.")
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
          erros: { errors: [{ path: 'senha', msg: "Senha incorreta." }] }
        });
      }
     
      // Criar a sessão do usuário
      req.session.usuario = {
        id: usuario.usu_id,
        email: usuario.usu_email,
        nome: usuario.usu_nome,
        foto: usuario.usu_foto,
        banner: usuario.usu_banner
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
        foto: userinfos.usu_foto,
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
        valores: {
        id: userinfos.usu_id,
        nome: userinfos.usu_nome,
        email: userinfos.usu_email,
        arroba: userinfos.perf_nome,
        bio: userinfos.biografia,
        foto: userinfos.usu_foto,
        banner: userinfos.usu_banner
        // telefone: userinfos.quantidade_seguidores,
        // cep: userinfos.quantidade_seguindo,
        // numero_cep: userinfos.numero_cep
        },
        listaErros:"",
        dadosNotificacao:""
    });

  } catch (err) {
    console.error(err);
    // Aqui também use return pra garantir que não continue
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
            return res.render("pages/editar-perfil", { listaErros: lista, valores: {
              nome: req.body.nome,
                email: req.body.email,
                foto: req.session.usuario.foto,
                banner: req.session.usuario.banner,
                senha: ""
                
              }, 
              dadosNotificacao: {
            titulo: "Erro ao atualizar o perfil!",
            mensagem: "Verifique os campos destacados!",
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
                  if (dadosForm.foto !== caminhoFoto && caminhoFoto !== "imagens/usuarios/default_user.jpg") removeImg(dadosForm.foto);
                  dadosForm.foto = caminhoFoto;
                  console.log(caminhoFoto)
                }

                if (req.files.banner) {
                  const caminhoBanner = "imagens/perfil/" + req.files.banner[0].filename;
                  if (dadosForm.banner !== caminhoBanner && caminhoBanner !== "imagens/usuarios/default_background.jpg") removeImg(dadosForm.banner);
                  dadosForm.banner = caminhoBanner;
                }
              }


            let resultUpdate = await UsuarioModel.atualizar(req.session.usuario.id, dadosForm);
            console.log(resultUpdate)
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
                    listaErros: null,
                    valores: valores,
                     dadosNotificacao: { titulo: "Perfil! atualizado com sucesso", mensagem: "Alterações Gravadas", tipo: "success" }
                  });
                } else {
                  //salvo certo mas sem alterar nada
                  console.log("nada pra salvar")
                  res.render("pages/editar-perfil", {
                    listaErros: null,
                    valores: dadosForm,
                     dadosNotificacao: { titulo: "Perfil! atualizado com sucesso", mensagem: "Sem alterações", tipo: "success" }
                });
                }
            }

    } catch(e){
      console.log(e)
      res.render("pages/editar-perfil", {valores: req.body,
        dadosNotificacao: { listaErros: erros, titulo: "Erro ao atualizar o perfil!", mensagem: "Verifique os valores digitados!", tipo: "error" }
      })

    }
  },
};
 