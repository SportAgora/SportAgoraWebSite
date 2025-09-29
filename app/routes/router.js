var express = require('express');
var router = express.Router();
const guestMiddleware = require('../helpers/guestMiddleware');
const usuariosController = require("../controllers/usuariosController");
const assinaturaController = require('../controllers/assinaturaController');
const eventController = require("../controllers/eventController");
const pagsController = require("../controllers/pagsController");


const uploadFile = require("../helpers/uploader")("./app/public/imagens/perfil/");

const uploadFileEvent = require("../helpers/uploader")("./app/public/imagens/evento/");

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

router.get('/cadastro', guestMiddleware, (req, res) => {
  res.render('pages/registro', 
  { "erros": null, "dados": {"email":"","senha":""},dadosNotificacao:"","retorno":null });
});

router.post('/cadastrar',
  usuariosController.regrasValidacao, 
  usuariosController.cadastrarUsuarioNormal);

router.get(
  "/ativar-conta",
  async function (req, res) {
    usuariosController.ativarConta(req, res);
  }
);

router.get("/login", (req, res) => {
  res.render("pages/login", {
  erro: null,  erros: null,  dados: { email: "", senha: "" }, dadosNotificacao:"",  retorno: null
});
});

router.post("/login",   usuariosController.regrasValidacaoLogin, usuariosController.autenticarUsuario);

// Rota de logout
router.get("/logout", usuariosController.logout);
router.post("/logout", usuariosController.logout);

router.get("/recuperar-senha", 
  function(req, res){
    res.render("pages/recuperar-senha",
      { erros: null, dadosNotificacao: null });
});

router.post("/recuperar-senha",
  usuariosController.regrasValidacaoFormRecSenha, 
  function(req, res){
    usuariosController.recuperarSenha(req, res);
});

router.get("/reset-senha", 
  function(req, res){
    usuariosController.validarTokenNovaSenha(req, res);
  });

  
router.get("/reset-senha-teste", 
  function(req, res){
      res.render("pages/resetar-senha",
      { erros: null, dadosNotificacao: null,"usu_id":"" });
  });
  
router.post("/resetar-senha", 
    usuariosController.regrasValidacaoFormNovaSenha,
  function(req, res){
    usuariosController.resetarSenha(req, res);
});

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

router.get('/meus-eventos', verificarAutenticacao, function(req,res){
  eventController.carregarMeusEventos(req,res);
})

router.get('/editar-evento', verificarAutenticacao, function(req,res){
  eventController.carregarEditarEvento(req,res);
})

/*

PAGINAS

*/

router.get('/pesquisar', pagsController.pesquisarEventos);

router.get('/', 
  pagsController.carregarFiltrosRapidos, 
  function(req,res){
    pagsController.carregarHome(req,res);
})

router.get('/filtros-rapidos',
  pagsController.carregarFiltrosRapidos,
  function(req,res){
    pagsController.paginaFiltroRapido(req,res);
})

router.get('/eventos', function(req,res){
    res.redirect('/home');  
})

router.get('/pratique', function(req,res){
    res.render('pages/pratique');  
})

router.get('/planos', function(req,res){
    res.render('pages/planos');  
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

router.get('/notificacoes', function(req,res){
  res.render('pages/notificacoes');  
})


router.get('/meu-plano', function(req,res){
    res.render('pages/meu-plano');  
})


router.get('/pagamento-evento', function(req,res){
    res.render('pages/pagamento-evento');  
})

router.get('/inscrito', function(req,res){
    res.render('pages/inscrito');  
})

router.get('/item-do-carrosel', pagsController.carregarFiltrosRapidos, function(req,res){
  res.render('pages/item-do-carrosel');  
})


router.get('/infoevento-natacao.ejs', function(req,res){
  res.render('pages/infoevento-natacao.ejs');  
})

router.get('/home', function(req,res){res.redirect('/')})

router.get('/erro', function(req,res){
  res.render('pages/error', {error:500, mensagem:"Algo deu errado no servidor."});  
})

/* PAGAMENTOS */

router.post("/assinatura/criar", assinaturaController.criar);
router.get("/assinatura/sucesso", assinaturaController.sucesso);
router.get("/assinatura/erro", assinaturaController.erro);
router.post("/assinatura/webhook", assinaturaController.webhook);


/* EVENTOS */

router.get('/criar-evento',  verificarAutenticacao, function(req,res){
  eventController.carregarCriarEvento(req,res);
})

router.post('/criar-evento',
  verificarAutenticacao,
  uploadFileEvent(["foto"]),
    eventController.criarEventoValidacao,
  eventController.criarEvento
);

router.get('/evento', (req, res) => {
  pagsController.visualizarEvento(req, res);
});

module.exports = router;
