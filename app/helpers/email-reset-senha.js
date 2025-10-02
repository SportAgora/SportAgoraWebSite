module.exports = (url, token)=>{

    return ` <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperação de Senha</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
    <style>
    body {
        font-family: Arial, sans-serif;
        background-color: #f0f0f0;
        margin: 0;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: "Montserrat", sans-serif;
    }
    .container {
        background-color: #ffffff;
        margin: 50px;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        max-width: 600px;
    }
    .header{
        background-color: #2a8d3f;
        color: white;
        padding: 10px 20px;
        text-align: center;
        border-radius: 8px 8px 0 0;
        display: flex;
        flex-direction: row-reverse;
        justify-content: center;
        align-items: center;
    }
    .content {
        padding: 20px;
        text-align: center;
    }
    .content p {
        font-size: 16px;
    }
    .button {
        display: inline-block;
        padding: 10px 20px;
        margin-top: 20px;
        background-color: #28a745;
        color: white;
        text-decoration: none;
        border-radius: 5px;
    }
    footer {
        padding: 10px 20px; 
        text-align: center;
        font-size: 13px;
        color: #777777; 
    }
    .logo {
        height: 90px;
        margin-right: 15px;
        margin-left: 20px;
    }
    b {
        color: #2a8d3f;
    }
    </style>
</head>
<body>
    <section class="container">
        <article class="header">
            <h1>Recuperação de Senha</h1>
            <img src="${url}/imagens/SportAgora.png" alt="Logo" class="logo">
        </article>
        <article class="content">
            <p>${nome}, recebemos uma solicitação para redefinir sua senha no <b>SportAgora!</b> Clique no botão abaixo para redefinir sua senha:</p>
            <a href="${url}/reset-senha?token=${token}" class="button">Redefinir Senha</a>
        </article>
        <footer>
            <p>Se você não solicitou esta alteração, por favor ignore este email.</p>
        </footer>
    </section>
</body>
</html>`
    
    }