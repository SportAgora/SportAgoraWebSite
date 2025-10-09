const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Defina o host explicitamente
    port: 587, 
    auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.SECRET_KEY
  },

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

module.exports = { enviarEmail, transporter }
