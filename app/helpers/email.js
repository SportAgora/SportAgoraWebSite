const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587, // Porta recomendada para envio de e-mails com STARTTLS
    secure: false, // Não usa SSL/TLS direto
    auth: {
        user: process.env.EMAIL_USER, // Seu e-mail
        pass: process.env.SECRET_KEY  // Sua senha, ou preferencialmente o senha configurada para App password
    },
    tls:{
        secure: false,
        ignoreTLS: true,
        rejectUnauthorized: false, // ignorar certificado digital - APENAS EM DESENVOLVIMENTO
    },
    connectionTimeout: 10000,
    socketTimeout: 10000,
});

function enviarEmail(to, subject, text=null, html = null, callback) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject
    };
    if(text!= null){
        mailOptions.text = text;
    }else if(html != null){
        mailOptions.html = html
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log("email enviado");
            if (callback && typeof callback === 'function') {
                // Chama a função de callback apenas em caso de sucesso no envio do e-mail
                callback();
            } 
        }
    });

}

module.exports = { enviarEmail }
