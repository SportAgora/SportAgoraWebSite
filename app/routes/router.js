var express = require('express');
var router = express.Router();
const guestMiddleware = require('../helpers/guestMiddleware');
const usuariosController = require("../controllers/usuariosController");
const assinaturaController = require('../controllers/assinaturaController');
const eventController = require("../controllers/eventController");
const pagsController = require("../controllers/pagsController");
const ingressoController = require("../controllers/ingressoController");
const pratiqueController = require("../controllers/pratiqueController");


const uploadFile = require("../helpers/uploader")("./app/public/imagens/perfil/");

const uploadFilePratique = require("../helpers/uploader")("./app/public/imagens/pratique/");

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

function verificarOrganizador(req, res, next) {
  if (req.session && req.session.usuario && req.session.usuario.tipo === "o") {
    return next();
  }
  res.redirect("/planos");
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

router.get('/meus-eventos', verificarAutenticacao, verificarOrganizador, function(req,res){
  eventController.carregarMeusEventos(req,res);
})

router.get('/editar-evento', verificarAutenticacao, verificarOrganizador, function(req,res){
  eventController.carregarEditarEvento(req,res);
})

router.post('/editar-evento', uploadFileEvent(['foto']), verificarAutenticacao, verificarOrganizador, function(req,res){
  eventController.editarEvento(req,res);
})

router.get('/apagar-evento', verificarAutenticacao, verificarOrganizador, eventController.editarEventoValidacao,function(req,res){
  eventController.apagarEvento(req,res);
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

router.get('/planos', verificarAutenticacao, function(req,res){
    if (req.session.usuario.tipo !== "o"){
    res.render('pages/planos');
  } else res.redirect('/meu-plano')
})

router.get('/notificacoes', function(req,res){
  res.render('pages/notificacoes');  
})

router.get('/pagamento-evento', function(req,res){
    res.render('pages/pagamento-evento');  
})

router.get('/home', function(req,res){res.redirect('/')})

router.get('/erro', function(req,res){
  res.render('pages/error', {error:500, mensagem:"Algo deu errado no servidor."});  
})

/* PAGAMENTOS */

router.post("/assinatura/criar", verificarAutenticacao, assinaturaController.criar);
router.get("/assinatura/sucesso", verificarAutenticacao, assinaturaController.sucesso);
router.get("/assinatura/erro", assinaturaController.erro);
router.post("/assinatura/webhook", assinaturaController.webhook);

router.get('/meu-plano', verificarAutenticacao,  verificarOrganizador, function(req,res){
    res.render('pages/meu-plano');
})

/* EVENTOS */

router.get('/criar-evento',  verificarAutenticacao, verificarOrganizador, function(req,res){
  eventController.carregarCriarEvento(req,res);
});

router.post('/criar-evento',
  verificarAutenticacao,
  verificarOrganizador,
  uploadFileEvent(["foto"]),
    eventController.criarEventoValidacao,
  eventController.criarEvento
);

router.get('/evento', (req, res) => {
  pagsController.visualizarEvento(req, res);
});

router.post('/denunciar-evento', verificarAutenticacao, (req,res) => {
   pagsController.denunciarEvento(req,res);
});

router.post('/inscricao-evento', verificarAutenticacao, (req, res) => {
  ingressoController.carregarInscricaoEvento(req, res);
});

router.post('/inscricao', verificarAutenticacao, ingressoController.regrasValidacaoPagamento, (req,res) => {
  ingressoController.pagamentoEvento(req,res);
});

router.get("/ingresso/sucesso", verificarAutenticacao, ingressoController.sucesso);
router.get("/ingresso/erro", ingressoController.erro);

router.get('/visualizar_ingresso', function(req,res){
  res.render('pages/visualizar_ingresso');  
});

router.get('/solitacao-enviada', function(req,res){
  res.render('pages/solitacao-enviada');  
});

router.get('/sobre-ingresso', verificarAutenticacao, function(req,res){
  ingressoController.carregarIngresso(req,res);
});

router.get('/validar-ingresso', verificarAutenticacao, function(req,res){
  ingressoController.carregarValidarIngresso(req,res);
});

router.post('/validar-ingresso', verificarAutenticacao, function(req,res){
  ingressoController.validarIngresso(req,res);
});
/* MAPA */

router.get('/pratique', pratiqueController.carregarMapa);

router.get('/pratique/solicitacao', verificarAutenticacao, pratiqueController.carregarSolicitacao);

router.post('/pratique/solicitacao',
  verificarAutenticacao,
  uploadFilePratique(["foto"]),
  pratiqueController.regrasValidacaoSolicitacao,
  function(req,res){
    pratiqueController.gravarSolicitacao(req,res);
  }
);


//improvisado pro email
router.get('/pag-secreta', function(req,res){
  res.render('pages/enviar_notificacao')
}
)

router.post('/enviar-notificacao', function(req,res){
  eventController.enviarNotificacao(req,res);
});


module.exports = router;
