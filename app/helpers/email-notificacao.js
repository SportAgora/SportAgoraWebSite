module.exports = (nome_evento, hora_evento, local_evento, url, nome)=>{

return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Notificação Evento</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body style="margin: 0; padding: 0; background-color: #E6ECF0; font-family: 'Montserrat', Arial, sans-serif;">
    <center style="width: 100%; background-color: #E6ECF0;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); margin: 50px auto;">
            <tbody>
                
                <tr>
                    <td align="center" style="background-color: #A31C29; color: #ffffff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                        <h1 style="font-size: 24px; font-weight: 700; margin: 0;">Olá ${nome}!</h1>
                    </td>
                </tr>

                <tr>
                    <td align="center" style="padding: 20px; text-align: center;">
                        <p style="font-size: 16px; color: #333333; margin: 0 0 20px 0; line-height: 1.5;">
                            O <b style="color: #A31C29; font-weight: 600;">SportAgora</b> Informa que o evento que você se increveu está próxmo!
                        </p>
                        <p style="font-size: 16px; color: #333333; margin: 0 0 20px 0; line-height: 1.5;">
                            O Evento <b style="color: #A31C29; font-weight: 600;">${evento_nome}</b> irá acontercer no dia ${data_evento} no ${local_evento}!
                        </p>
                        
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin: 20px auto 0 auto;">
                            <tr>
                                
                                <td align="center" style="border-radius: 5px; background-color: #D72638;">
                                    <a href="${url}/ativar-conta?token=${token}" 
                                       target="_blank" 
                                       style="display: block; 
                                              padding: 12px 25px; 
                                              color: #ffffff; 
                                              font-weight: bold; 
                                              text-decoration: none; 
                                              border-radius: 5px; 
                                              font-size: 16px; 
                                              border: 1px solid #D72638;
                                              font-family: 'Montserrat', Arial, sans-serif;"
                                              >
                                        Abir Evento
                                    </a>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <tr>
                    <td align="center" style="padding: 10px 20px; text-align: center; font-size: 12px; color: #777777; border-top: 1px solid #f0f0f0;">
                        <p style="margin: 5px 0; font-size: 12px; color: #777777;">Se você não solicitou este email, por favor ignore-o.</p>
                    </td>
                </tr>
                
            </tbody>
        </table>
    </center>
</body>
</html>
`
}