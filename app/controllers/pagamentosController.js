const PagamentoModel = require('../models/model-pagamento');
const mercadopago = require('mercadopago');

module.exports = {

  criarPagamentoEvento: async (req, res) => {
    const { usuario_id, evento_id, ingresso_id } = req.body;

    try {
      const [ingressoRows] = await db.query(
        'SELECT * FROM ingresso WHERE ingresso_id = ?',
        [ingresso_id]
      );
      const ingresso = ingressoRows[0];
      if (!ingresso) return res.status(404).send('Ingresso não encontrado');

      const preference = {
        items: [
          {
            title: ingresso.ingresso_nome,
            quantity: 1,
            currency_id: 'BRL',
            unit_price: ingresso.ingresso_valor
          }
        ],
        back_urls: {
          success: `http://localhost:3000/success-pagamento-evento?usuario_id=${usuario_id}&evento_id=${evento_id}&ingresso_id=${ingresso_id}`,
          failure: 'http://localhost:3000/erro',
          pending: 'http://localhost:3000/pagamento-evento'
        },
        auto_return: 'approved'
      };

      const response = await mercadopago.preferences.create(preference);
      res.json({ init_point: response.body.init_point });

    } catch (err) {
      console.error(err);
      res.status(500).send('Erro ao criar pagamento');
    }
  },

  confirmarInscricao: async (req, res) => {
    const { usuario_id, evento_id, ingresso_id } = req.query;

    try {
      const [ingressoRows] = await db.query(
        'SELECT ingresso_quantidade, IFNULL(ingresso_vendido,0) as vendido FROM ingresso WHERE ingresso_id = ?',
        [ingresso_id]
      );
      const ingresso = ingressoRows[0];
      if (ingresso.ingresso_quantidade - ingresso.vendido <= 0) return res.send('Ingressos esgotados');

      await db.query(
        'INSERT INTO inscricao_evento (usuario_id, evento_id, ingresso_id) VALUES (?, ?, ?)',
        [usuario_id, evento_id, ingresso_id]
      );

      await db.query(
        'UPDATE ingresso SET ingresso_vendido = ingresso_vendido + 1 WHERE ingresso_id = ?',
        [ingresso_id]
      );

      res.render('pages/inscrito', { mensagem: 'Inscrição confirmada!' });

    } catch (err) {
      console.error(err);
      res.status(500).send('Erro ao confirmar inscrição');
    }
  }

};