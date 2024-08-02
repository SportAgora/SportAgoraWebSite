var express = require('express');
var router = express.Router();

router.get('/', function(req,res){
    res.render('pages/home');  
})

router.get('/eventos', function(req,res){
    res.render('pages/eventos');  
})

router.get('/pratique', function(req,res){
    res.render('pages/pratique');  
})

router.get('/login', function(req,res){
    res.render('pages/login');  
})

router.get('/home', function(req,res){
    res.render('pages/home');  
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

module.exports = router;