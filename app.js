const express = require('express');
const app = express();
const port = 3000;
const axios = require('axios');
const helmet = require('helmet');
const session = require('express-session');
const flash = require('connect-flash');
require("dotenv").config();
 
 
 
app.use(helmet({
  contentSecurityPolicy: false // ⚠️ Apenas para desenvolvimento!
}));
 
// Configuração de arquivos estáticos
app.use(express.static('app/public'));
 
// Configuração do view engine
app.set('view engine', 'ejs');
app.set('views', './app/views');
 
// Middleware para parsing de dados
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 
 
app.use(session({
  secret: 'sportagoranota10',
  resave: false,
  saveUninitialized: false, // ⚠️ Altere para FALSE!
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    secure: false // ⚠️ Defina como true em produção (HTTPS)
  }
}));
 
// Configuração do flash messages (após a sessão)
app.use(flash());
 
// Middleware para disponibilizar variáveis para as views
app.use((req, res, next) => {
  res.locals.sucesso = req.flash("sucesso");
  res.locals.erro = req.flash("erro");
  res.locals.usuario = req.session.usuario || null;
  next();
});
 
// Middleware para definir o tipo MIME correto
app.use((req, res, next) => {
  if (req.path.endsWith('.js')) {
    res.setHeader('Content-Type', 'application/javascript');
  }
  next();
});
 
// Importar o middleware de guest (APÓS a configuração da sessão)
const guestMiddleware = require('./app/helpers/guestMiddleware');
 
// Aplicar o middleware de guest às rotas específicas
app.use('/login', guestMiddleware);
app.use('/cadastre-se', guestMiddleware);
 
// Importar e usar as rotas
const rotas = require('./app/routes/router');
app.use('/', rotas);
 
// REMOVER: Esta rota está duplicada e deve estar no arquivo de rotas
// app.get('/cadastre-se', (req, res) => {
//   res.render('cadastre-se', {
//     dados: {},
//     erros: []
//   });
// });
 
// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor ouvindo na porta ${port}\nhttp://localhost:${port}`);
});
 