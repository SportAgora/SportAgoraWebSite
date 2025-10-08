const PratiqueModel = require('../models/model-pratique');

module.exports = {
    carregarMapa: async (req, res) => {
        try {
            const locais = await PratiqueModel.listarLocais();
            res.render('pages/pratique', { locais });
        } catch (error) {
            console.error(error);
            res.status(500).send('Erro ao carregar o mapa');
    }
    }
}
