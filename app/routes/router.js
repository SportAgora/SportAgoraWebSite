const { body, validationResult} = require("express-validator")
var express = require('express');
var router = express.Router();
const guestMiddleware = require('../helpers/guestMiddleware');
const usuariosController = require("../controllers/usuariosController");
const pagamentoController = require('../controllers/pagamentosController');
const admController = require("../controllers/admController");
const eventController = require("../controllers/eventController");


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

const verificarAdm = usuariosController.verificarAdm;

router.use((req, res, next) => {
  res.locals.usuario = req.session.usuario || null;
  next();
});

router.get('/cadastro', guestMiddleware, (req, res) => {
  res.render('pages/registro', 
  { "erros": null, "dados": {"email":"","senha":""},"retorno":null });
});

router.post('/cadastrar',
  usuariosController.regrasValidacao, 
  usuariosController.cadastrarUsuarioNormal);

router.get("/login", (req, res) => {
  res.render("pages/login", {
  erro: null,  erros: null,  dados: { email: "", senha: "" },  retorno: null
});
});

router.post("/login",   usuariosController.regrasValidacaoLogin, usuariosController.autenticarUsuario);

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
  uploadFile(["foto","banner"]),
  usuariosController.regrasValidacaoPerfil,
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


router.get('/pagamento-evento', function(req,res){
    res.render('pages/pagamento-evento');  
})

router.get('/inscrito', function(req,res){
    res.render('pages/inscrito');  
})

router.get('/item-do-carrosel', function(req,res){
  res.render('pages/item-do-carrosel');  
})

router.get('/criar-post', function(req,res){
  res.render('pages/criar-post');  
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


router.get('/erro', function(req,res){
  res.render('pages/error');  
})


router.post('/pagamento_selec', pagamentoController.receberPlano);
router.post('/processar_pagamento', pagamentoController.processarPagamento);


/* EVENTOS */

router.get('/criar-evento',  verificarAutenticacao, function(req,res){
  eventController.carregarCriarEvento(req,res);
})

router.post('/criar-evento',
  verificarAutenticacao,
  eventController.criarEventoValidacao,
  eventController.criarEvento
);

/* ADM */

router.get("/adm/login", (req, res) => {
  res.render("pages/adm/login", {
  erro: null,  erros: null,  dados: { email: "", senha: "" },  retorno: null
});
});

router.post("/adm/login",  (req, res) => { usuariosController.autenticarUsuario(req, res, "administrador")});


router.get('/adm/home',verificarAdm, function(req,res){
    res.render('pages/adm/home');  
})


 
router.get('/adm/buscar_usuario', verificarAdm,function(req,res){
  res.render('pages/adm/buscar_usuario');  
}) 



router.get('/adm/teste', verificarAdm, function(req,res){
  res.render('pages/adm/teste');  
}) 


router.get('/adm/usuarios', verificarAdm, function(req,res){
  admController.carregarUsuarios(req,res);
}) 

router.get('/adm/usuario_ex', verificarAdm, function(req,res){
  res.render('pages/adm/usuario_ex');  
}) 

router.get('/adm/cadastro_concluido', verificarAdm, function(req,res){
  res.render('pages/adm/cadastro_concluido');  
}) 

router.get('/adm/eventos', verificarAdm, function(req,res){
  admController.carregarEventos(req,res);
}) 

router.post('/adm/criar-assunto', verificarAdm,
  admController.criarAssunto
);

router.post('/adm/apagar-assunto', verificarAdm,
  admController.apagarAssunto
);

router.post('/adm/criar-categoria', verificarAdm,
  admController.criarCategoria
);

router.post('/adm/apagar-categoria', verificarAdm,
  admController.apagarCategoria
);


router.get('/adm/descricaoEvento', verificarAdm, function(req,res){
  res.render('pages/adm/descricaoEvento');  
}) 

router.get('/adm', verificarAdm, function(req,res){
  res.redirect('/adm/home')
})

router.get('/adm/novousuario', verificarAdm, (req, res) => {
  res.render('pages/adm/novousuario', 
  { "erros": null, "dados": {"nome":"","email":"","senha":"","repsenha":""},"retorno":null });
});

router.post('/adm/novousuario', verificarAdm,
  admController.regrasValidacao, 
  admController.cadastrarUsuario
);

router.post('/adm/usuarios/:id',
  verificarAdm,
  admController.apagarUsuario
)


module.exports = router;
