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
                items: [
                    {
                    title: descricao || "Produto/Evento",
                    unit_price: parseFloat(valor) || 29.9,
                    quantity: 1,
                    }
                ],
                back_urls: {
                    success: `${process.env.URL_BASE}/pagamento/sucesso`,
                    failure: `${process.env.URL_BASE}/pagamento/erro`,
                    pending: `${process.env.URL_BASE}/pagamento/pending`
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