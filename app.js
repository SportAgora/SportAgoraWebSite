const express = require('express');
const app = express();
const port = 3000;
const axios = require('axios');
const helmet = require('helmet');
const session = require('express-session');
const flash = require('connect-flash');
const mercadopago = require('mercadopago');
require("dotenv").config();
const { transporter } = require('./app/helpers/email');
 
app.use(helmet({
  contentSecurityPolicy: false // apenas para desenvolvimento
}));
 
app.use(express.static('app/public'));
 
app.set('view engine', 'ejs');
app.set('views', './app/views');
 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 
const mp = new mercadopago.MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});
 
app.use(session({
  secret: 'sportagoranota10',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    secure: false 
  }
}));
 
// Configuração do flash messages (após a sessão)
app.use(flash());
 
// Middleware para disponibilizar variáveis para as views
app.use((req, res, next) => {
  res.locals.usuario = req.session.usuario;
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
app.use('/cadastro', guestMiddleware);
 
// Importar e usar as rotas
const rotas = require('./app/routes/router');
app.use('/', rotas);

const rotasAdm = require('./app/routes/routerAdm');
app.use('/adm/', rotasAdm);

app.use((req, res, next) => {
  // Se nenhuma rota anterior corresponder, crie um objeto de erro ou envie diretamente a página 404
  res.status(404).render('pages/error', { error: "404", mensagem: "Página não encontrada." }); // Passa a URL solicitada para o template
});

transporter.verify(function(error, success) {
    if (error) {
        console.error("=========================================");
        console.error("ERRO CRÍTICO: FALHA NA CONEXÃO SMTP!");
        console.error("O servidor de e-mail NÃO está funcionando corretamente.");
        console.error("Erro:", error.message); // Exibe o erro específico (e.g., ETIMEDOUT, EAUTH)
        console.error("=========================================");
        
        // Iniciar o servidor
        app.listen(port, () => {
          console.log(`Servidor ouvindo na porta ${port}\nhttp://localhost:${port}`);
        });
    } else {
        console.log("=========================================");
        console.log("Conexão SMTP OK!");
        console.log("O servidor está pronto para enviar e-mails.");
        console.log("=========================================");

        // Iniciar o servidor
        app.listen(port, () => {
          console.log(`Servidor ouvindo na porta ${port}\nhttp://localhost:${port}`);
        });
    }
});


 