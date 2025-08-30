var express = require('express');
var router = express.Router();
const admController = require("../controllers/admController");
const usuariosController = require("../controllers/usuariosController");
const uploadFile = require("../helpers/uploader")("./app/public/imagens/perfil/");

const verificarAdm = admController.verificarAdm;

router.get("/login", (req, res) => {
  res.render("pages/adm/login", {
  erro: null,  erros: null,  dados: { email: "", senha: "" },  retorno: null
});
});

router.post("/login",  (req, res) => { usuariosController.autenticarUsuario(req, res, "administrador")});


router.get('/home',verificarAdm, function(req,res){
    res.render('pages/adm/home');  
})


 
router.get('/buscar_usuario', verificarAdm,function(req,res){
  res.render('pages/adm/buscar_usuario');  
}) 



router.get('/teste', verificarAdm, function(req,res){
  res.render('pages/adm/teste');  
}) 


router.get('/usuarios', verificarAdm, function(req,res){
  admController.carregarUsuarios(req,res);
}) 

router.get('/usuario_ex', verificarAdm, function(req,res){
  res.render('pages/adm/usuario_ex');  
}) 

router.get('/cadastro_concluido', verificarAdm, function(req,res){
  res.render('pages/adm/cadastro_concluido');  
}) 

router.get('/eventos', verificarAdm, function(req,res){
  admController.carregarEventos(req,res);
}) 

router.post('/criar-assunto', verificarAdm,
  admController.criarAssunto
);

router.post('/apagar-assunto', verificarAdm,
  admController.apagarAssunto
);

router.post('/criar-categoria', verificarAdm,
  admController.criarCategoria
);

router.post('/apagar-categoria', verificarAdm,
  admController.apagarCategoria
);


router.get('/descricaoEvento', verificarAdm, function(req,res){
  res.render('pages/adm/descricaoEvento');  
}) 

router.get('/', verificarAdm, function(req,res){
  res.redirect('/adm/home')
})

router.get('/novousuario', verificarAdm, (req, res) => {
  res.render('pages/adm/novousuario', 
  { "erros": null, "dados": {"nome":"","email":"","senha":"","repsenha":""},"retorno":null });
});

router.post('/novousuario', verificarAdm,
  admController.regrasValidacao, 
  admController.cadastrarUsuario
);

router.post('/usuarios/:id',
  verificarAdm,
  admController.apagarUsuario
)

module.exports = router;