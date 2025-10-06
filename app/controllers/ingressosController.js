const PagsModel = require('../models/model-pags');

module.exports = {
carregarInscricaoEvento: async (req, res) => {
    try {
    const eventoId = req.query.id;
    const evento = await PagsModel.buscarPagPorId(eventoId);

    let ingressos = JSON.parse(req.body.ingressosSelecionados);

     ingressos = ingressos.map(i => {
      const [id, tipo] = i.id.split('_');
      return { id, tipo, qtd: i.qtd };
    });

    const ingressosDados = await PagsModel.buscarIngressos(ingressos);
    console.log(ingressosDados);
    res.render('pages/evento-inscricao', { 
        evento, 
        ingressos: ingressosDados, 
        dados: {
            telefone:"",
            cpf:"",
            nascimento:"",
            genero:""
        }
    });

    } catch (e) {
    console.error(e);
    res.redirect('/erro')
    }
    },
    regrasValidacaoPagamento: [
    body("telefone").matches(/^\d{2}\d{9}$/)
    .withMessage("Telefone inválido"),
    body("cpf").custom(cpf => {
            if (!validarCPF(cpf)) {
                throw new Error("CPF inválido");
            }
            return true;
        }),
    body("nascimento").custom(value => {
    const hoje = new Date();
    const dataNasc = new Date(value);
    let idade = hoje.getFullYear() - dataNasc.getFullYear();
    const m = hoje.getMonth() - dataNasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < dataNasc.getDate())) {
        idade--;
    }
    if (idade < 14) {
        throw new Error("Você precisa ter mais de 14 anos");
    }
    return true; // precisa retornar true se estiver válido
})
    ],

    pagamentoEvento: async (req, res) => {
    const {telefone, cpf, nascimento, genero} = req.body;
    let dados = {
        telefone,
        cpf,
        nascimento,
        genero
    }
    const evento = JSON.parse(req.body.evento);
    let ingressos = JSON.parse(req.body.ingressos);
        
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        console.log(errors);
        return res.render('pages/evento-inscricao',{
            dados,
            erros: errors,
            evento,
            ingressos
        })
    }

    try {
    console.log(dados);
    console.log(evento);
    console.log(ingressos);

    return res.render('pages/inscrito', { evento });
    
    } catch (e) {
    console.error(e);
    res.redirect('/erro')
    }
    }   
}