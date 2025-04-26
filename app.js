const express = require('express');
const app = express();
const env = require("dotenv").config();

app.use(express.static('app/public'));

app.set('view engine', 'ejs');
app.set('views', './app/views');


app.use(express.urlencoded({"extended":true}));
app.use(express.json())

var rotas = require('./app/routes/router');
app.use('/', rotas);

app.listen(process.env.APP_PORT, ()=>{
    console.log(`Servidor onLine!\nhttp://localhost:${process.env.APP_PORT}`);
});
