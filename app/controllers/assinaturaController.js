const {MercadoPagoConfig, Preference} = require('mercadopago');
const UsuarioModel = require('../models/model-usuario');

const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

module.exports = {
  criar: async (req, res) => {
        try {
            const preference = new Preference(mp);
            const assinatura = await preference.create({
            body: {
                items: [
                    {
                    title: 'SportAgora - Assinatura Premium',
                    unit_price: 29.9,
                    quantity: 1,
                    }
                ],
                back_urls: {
                    success: `${process.env.URL_BASE}/assinatura/sucesso`,
                    failure: `${process.env.URL_BASE}/assinatura/erro`,
                    pending: `${process.env.URL_BASE}/assinatura/pending`
                },
                auto_return: "approved", // volta automaticamente ao site quando aprovado
                // NÃO PASSAMOS payer_email → o MP vai pedir na hora do checkout
                },
            });

            res.redirect(assinatura.init_point);
        } catch (error) {
            console.error(error);
            res.redirect("/assinatura/erro");
        }
    },

    sucesso: async (req, res) => {
        const { payment_id } = req.query;

        // buscar pagamento no Mercado Pago pra confirmar
        const payment = await mp.payment.get(payment_id);

        if(payment.status === 'approved') {
            // atualizar o usuário no banco
            const userId = req.session.usuario.id;
            await UsuarioModel.ativarPlano(userId);

            return res.redirect('/perfil');
        }

        // se não aprovado
        res.redirect('/assinatura/erro');
    },

    erro: (req, res) => {
        res.render("assinatura/erro");
    },

    webhook: async (req, res) => {
   try {
          const notification = req.body; // aqui é a notificação do MP

        if(notification.type === "payment") {
            const paymentId = notification.data.id;
            const payment = await mp.payment.get(paymentId);

            if(payment.status === "approved") {
                const email = payment.payer.email;
                const usuario = await UsuarioModel.buscarPorEmail(email);
                if(usuario) await UsuarioModel.ativarPlano(usuario.id);
            }
        }

        res.sendStatus(200);
    } catch(err) {
        console.error(err);
        res.sendStatus(500);
    }
}

};