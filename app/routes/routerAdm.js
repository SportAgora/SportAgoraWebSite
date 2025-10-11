var express = require('express');
var router = express.Router();
const admController = require("../controllers/admController");
const usuariosController = require("../controllers/usuariosController");
const uploadFile = require("../helpers/uploader")("./app/public/imagens/pratique");
const uploadFileUsuario = require("../helpers/uploader")("./app/public/imagens/usuarios");
const uploadFileEvento = require("../helpers/uploader")("./app/public/imagens/evento");

const verificarAdm = admController.verificarAdm;

router.get("/login", (req, res) => {
  res.render("pages/adm/login", {
  erro: null,  erros: null,  dados: { email: "", senha: "" },  retorno: null
});
});

router.post("/login",  (req, res) => { usuariosController.autenticarUsuario(req, res, "a")});


router.get('/home',verificarAdm, function(req,res){
    res.render('pages/adm/home');  
})
 
router.post('/buscar_usuario', verificarAdm,function(req,res){
  admController.pesquisarUsuarios(req,res);
}) 

router.get('/usuarios', verificarAdm, function(req,res){
  admController.carregarUsuarios(req,res);
})

router.get('/usuarios/sobre_usuario', verificarAdm, function(req,res){
  admController.carregarUsuario(req,res);
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
router.get("/eventos/editar", verificarAdm, (req, res) => {
  admController.carregarEditarEvento(req, res);
});

router.post("/eventos/editar", verificarAdm, uploadFileEvento(["foto"]), (req, res) => {
  admController.editarEvento(req, res);
});


router.post('/criar-esporte', verificarAdm, uploadFile(['foto','foto2']),
  admController.criarEsporte
);

router.post('/apagar-esporte', verificarAdm,
  admController.apagarEsporte
);

router.post('/eventos/denuncias/apagar', verificarAdm, function(req,res){
  admController.apagarDenuncia(req,res);
})

router.get('/eventos/denuncias', verificarAdm, function(req,res){
  admController.carregarDenuncias(req,res);
})

router.get('/eventos/apagar', verificarAdm, function(req,res){
  admController.apagarEvento(req,res)
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

router.get('/solicitacoes', verificarAdm, function(req,res){
  admController.carregarSolicitacoes(req,res);
}) 
router.post('/solicitacoes_pesquisa', verificarAdm, function(req,res){
  console.log('oxi')
  admController.carregarSolicitacoes(req,res);
}) 

router.get('/local_novo', verificarAdm, function(req,res){
  admController.carregarNovoLocal(req,res);
})

router.post('/local_novo', uploadFile(["foto"]), verificarAdm, admController.regrasValidacaoLocal, 
function(req,res){
  admController.novoLocalCreate(req,res);
})

router.get('/solicitacoes_remover', verificarAdm, function(req,res){
  admController.carregarSolicitacoesRemover(req,res);
})

router.get('/local_remover', verificarAdm, function(req,res){
  admController.apagarLocal(req,res);
})

router.get('/local_editar', verificarAdm, function(req,res){
  admController.carregarEditarLocal(req,res);
})

router.post('/local_editar', uploadFile(["foto"]), verificarAdm, admController.regrasValidacaoEditarLocal, function(req,res){
  admController.editarLocal(req,res);
})

router.post(
  '/editar-usuario', 
  uploadFileUsuario(['foto']), // Usa o Multer para lidar com o campo 'foto'
  (req, res, next) => {
      // Limpa o erro do Multer na sessão para ser tratado no controller
      if (req.fileValidationError) {
          req.session.erroMulter = { path: 'foto', msg: req.fileValidationError };
      }
      next();
  },
  verificarAdm,
  admController.regrasValidacaoEdicao, // Aplica as regras de validação para edição
  admController.editarUsuario
)

module.exports = router;