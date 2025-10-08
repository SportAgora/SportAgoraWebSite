const { body, validationResult } = require('express-validator');
const PratiqueModel = require('../models/model-pratique');
const multer = require('multer');

module.exports = {
    carregarMapa: async (req, res) => {
        try {
            const locais = await PratiqueModel.listarLocais();
            res.render('pages/pratique', { locais });
        } catch (error) {
            console.error(error);
            res.status(500).send('Erro ao carregar o mapa');
    }
    },
    carregarSolicitacao: async (req, res) => {
        esportes = await PratiqueModel.listarEsportes();
        res.render('pages/solicitacao-pratique', {
            dados : {
                nome:"",
                endereco:"",
                foto:"",
                tipo:"",
                link:""
            },
            esportes,
            erros: null,
            dadosNotificacao: null
        }
        );
    },
    regrasValidacaoSolicitacao: [
    body('nome').isLength({min:5,max:50}).withMessage('O nome do local é obrigatório.'),
    body('endereco').isLength({min:5,max:100}).withMessage('O endereço do local é obrigatório.'),
    body('link').isLength({min:10,max:150}).withMessage('O link do local é muito grande.'),
    ],
    gravarSolicitacao: async (req, res) => {
  try {
    const esportes = await PratiqueModel.listarEsportes();
    const errors = validationResult(req);
    const erroMulter = req.session.erroMulter;
    delete req.session.erroMulter; // limpa a sessão pra não ficar persistindo

    // Se não enviou a foto
    console.log(req.files);
    if (!req.files || !req.files.foto || req.files.foto.length === 0) {
      return res.render('pages/solicitacao-pratique', {
        dados: req.body,
        erros: null,
        esportes,
        dadosNotificacao: { 
          titulo: "Foto não enviada", 
          mensagem: "É obrigatório o envio de uma foto para o evento.", 
          tipo: "error" 
        }
      });
    }

    // Caminho salvo da imagem
    const caminhoFoto = "imagens/pratique/" + req.files.foto[0].filename;

    // Verifica erros de validação
    if (!errors.isEmpty() || erroMulter) {
      const listaErros = errors.array();
      if (erroMulter) listaErros.push(erroMulter);

      return res.render('pages/solicitacao-pratique', {
        erros: listaErros,
        dados: req.body,
        esportes,
        dadosNotificacao: null
      });
    }

    // Monta dados para gravação
    const dados = {
      ...req.body,
      foto: caminhoFoto
    };

    await PratiqueModel.gravarSolicitacao(dados, req.session.usuario.id);
    return res.render('pages/solicitacao-enviada', { dados: req.body.nome });

  } catch (error) {
    console.error("Erro ao gravar solicitação:", error);
    return res.redirect('/erro');
  }
}
}
