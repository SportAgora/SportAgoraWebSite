const {MercadoPagoConfig, PreApproval} = require('mercadopago');

const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

module.exports = {
  criar: async (req, res) => {
        try {
            const preapproval = new PreApproval(mp);
            console.log(`${process.env.URL_BASE}/assinatura/sucesso`)
            const assinatura = await preapproval.create({
            body: {
                reason: "Assinatura Premium",
                auto_recurring: {
                    frequency: 1,
                    frequency_type: "months", // cobra todo mês
                    transaction_amount: 29.90,
                    currency_id: "BRL",
                    start_date: new Date(),
                    end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)) // 1 ano
                },
                back_url: `${process.env.URL_BASE}/assinatura/sucesso`, 
                payer_email: req.session.usuario.email
            },
            });

            res.redirect(assinatura.init_point);
        } catch (error) {
            console.error(error);
            res.redirect("/assinatura/erro");
        }
    },

    sucesso: (req, res) => {
        return res.redirect('/perfil')
    },

    erro: (req, res) => {
        res.render("assinatura/erro");
    },

    webhook: async (req, res) => {
        try {
            const evento = req.body;

            if (evento.type === "preapproval") {
                const data = evento.data;
                // Aqui você pega o email ou ID do usuário e atualiza no banco
                // Exemplo:
                // await Usuario.update({ usu_tipo: "organizador" }, { where: { usu_email: data.payer_email } });
            }

            res.sendStatus(200);
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    }

};