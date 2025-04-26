const userModel = require('../models/userModel');
const {body, validationResult} = require("express-validator");
const userController = {
    CreateUserValidationRules : [
        body("nome").isLength({min:3,max:30}).withMessage("Insira um nome válido."),
        body("email").isEmail().withMessage("Email inválido."),
        body("senha").isStrongPassword().withMessage("Senha muito fraca!"),
        body("repsenha").custom((value, { req }) => {
        return value === req.body.senha;
    }).withMessage("Senhas estão diferentes"),
        
    ],
    createUser: async (req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            console.log(errors);
            return res.render('pages/registro',{
                valores: req.body,
                erros: errors
            })
        }

        var dadosForm = {
            nome : req.body.nome,
            email : req.body.email,
            senha : req.body.senha
        }
        
        res.render("pages/perfilex")
        try {
            results = await userModel.create(dadosForm)
        } catch (e) {
            console.log(e)
            res.json({erro: "falha ao acessar dados"})
        }
    }
}

module.exports = userController;