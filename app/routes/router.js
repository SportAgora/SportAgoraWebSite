const { body, validationResult} = require("express-validator")
var express = require('express');
var router = express.Router();
const guestMiddleware = require('../helpers/guestMiddleware');
const usuariosController = require("../controllers/usuariosController");
const pagamentoController = require('../controllers/pagamentosController');

const uploadFile = require("../helpers/uploader")("./app/public/imagens/perfil/");
/*

AUTENTICACAO

*/

function verificarAutenticacao(req, res, next) {
  if (req.session && req.session.usuario) {
    return next();
  }
  res.redirect("/login");
}

router.use((req, res, next) => {
  res.locals.usuario = req.session.usuario || null;
  next();
});

// Rotas de autenticação (mantidas apenas uma vez)
router.get('/cadastro', guestMiddleware, (req, res) => {
  res.render('pages/registro', 
  { "erros": null, "dados": {"email":"","senha":""},"retorno":null });
});

router.post('/cadastrar',
  usuariosController.regrasValidacao, 
  usuariosController.cadastrarUsuarioNormal); // Sem autologin

router.get("/login", (req, res) => {
  res.render("pages/login", {
  erro: null,  erros: null,  dados: { email: "", senha: "" },  retorno: null
});
});

router.post("/login",   usuariosController.regrasValidacaoLogin, usuariosController.autenticarUsuario);

// // Rota de perfil (protegida)
// router.get("/alterar_perfil", verificarAutenticacao, (req, res) => {
// res.render("pages/alterar-perfil", { usuario: req.session.usuario });
// });

// router.post("/alterar_perfil", verificarAutenticacao, (req, res) => {
// res.redirect("pages/alterar-perfil"); 
// });

// Rota de logout
router.get("/logout", usuariosController.logout);
router.post("/logout", usuariosController.logout);

/*

PAGINAS

*/

router.get('/perfil',verificarAutenticacao, usuariosController.carregarPerfil)

router.get('/editar-perfil', verificarAutenticacao, usuariosController.carregarEditarPerfil)

router.post('/salvar-perfil', 
  verificarAutenticacao, 
  uploadFile("foto"),
  // usuariosController.regrasValidacaoPerfil,
  async function(req,res){
    usuariosController.gravarPerfil(req,res);
  }
)

router.get('/', function(req,res){
    res.render('pages/home');  
})

router.get('/eventos', function(req,res){
    res.render('pages/eventos');  
})

router.get('/pratique', function(req,res){
    res.render('pages/pratique');  
})

router.get('/planos', function(req,res){
    res.render('pages/planos');  
})

router.get('/infopost', function(req,res){
    res.render('pages/infopost');  
})

router.get('/infoevento', function(req,res){
    res.render('pages/infoevento');  
})

router.get('/infoevento2', function(req,res){
    res.render('pages/infoevento2');  
})

router.get('/perfilex', function(req,res){
    res.render('pages/perfilex');  
})

router.get('/organizador', function(req,res){
    res.render('pages/organizador');  
})


router.get('/inscrito', function(req,res){
    res.render('pages/inscrito');  
})

router.get('/item-do-carrosel', function(req,res){
  res.render('pages/item-do-carrosel');  
})


router.get('/infoevento-natacao.ejs', function(req,res){
  res.render('pages/infoevento-natacao.ejs');  
})

router.post(
  '/processar_pagamento',
  pagamentoController.regrasValidacaoPagamento,
  pagamentoController.processarPagamento
);

router.get('/home', function(req,res){res.redirect('/')})



router.post('/pagamento_selec', pagamentoController.receberPlano);
router.post('/processar_pagamento', pagamentoController.processarPagamento);


/* ADM */

router.get('/adm/home', function(req,res){
    res.render('pages/adm/home');  
}) 

router.get('/adm/login', function(req,res){
    res.render('pages/adm/login');  
}) 

router.get('/adm/novo_usuario', function(req,res){
    res.render('pages/adm/novousuario');  
}) 

router.get('/adm/postagem', function(req,res){
    res.render('pages/adm/postagem');  
}) 

router.get('/adm/usuarios', function(req,res){
    res.render('pages/adm/usuarios');  
}) 

router.get('/pagamento-evento', function(req,res){
  res.render('pages/pagamento-evento');  
})

router.get('/criar-evento', function(req,res){
  res.render('pages/criar-evento');  
})





module.exports = router;