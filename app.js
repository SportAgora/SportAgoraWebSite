const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('app/public'));

app.set('view engine', 'ejs');
app.set('views', './app/views');


app.use(express.urlencoded({"extended":true}));
app.use(express.json())

var rotas = require('./app/routes/router');
app.use('/', rotas);

app.set("/navbar", './app/views/partial/navbar');

app.listen(port, () =>{
    console.log(`Servidor online \nhttp://localhost:${port}`);
})
