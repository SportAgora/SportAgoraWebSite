// Perfil Kique Sexy

    function signinValidacao(){
        const firstnameValue = firstname.value()

        if(!firstnameValue){
        errorValidation(firstname, "Preencha essa campo!")
        } else {
        successValidation(firstname);
        window.location = "/perfilex"
        }
    }
    function perfilex(){
        window.location = "/perfilex"
    }
    function google(){
        window.location = "https://accounts.google.com/v3/signin/identifier?hl=pt-br&ifkv=AdF4I76brz77RqHPBbkuaG-GAYma5T1FHAMs83KjvQn5Ob61TqsbxQY3dieTODkP4gmNjQN6kUMl&flowName=GlifWebSignIn&flowEntry=ServiceLogin&dsh=S1309266331%3A1721574746137748&ddm=0"
    }
    function microsofiti(){
        window.location = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?scope=service%3A%3Aaccount.microsoft.com%3A%3AMBI_SSL+openid+profile+offline_access&response_type=code&client_id=81feaced-5ddd-41e7-8bef-3e20a2689bb7&redirect_uri=https%3A%2F%2Faccount.microsoft.com%2Fauth%2Fcomplete-signin-oauth&client-request-id=cc728ed1-81a2-41e7-abf2-f7b26754b559&x-client-SKU=MSAL.Desktop&x-client-Ver=4.61.3.0&x-client-OS=Windows+Server+2019+Datacenter&prompt=login&client_info=1&state=H4sIAAAAAAAEAAXBy6JCQAAA0H9pa-EdLVrEeDZikNeuEd1GSEMxX3_P2dWXygdJkDuKluwj0ADPD6eViALrPYgk0rPKZEqRUZ5rcVi-HzrcVtn9hYdi3uylde1uBuIyWUBQ4otR4W7w0rHycMbGJVi_ksVeAf9Uy0hEcEZBso9FWy9POGYYlfbQH1YozYXvGDesXd-c5d9J_82sbKvK75bAuuPJ_TOc1kabn1qSM01shU6Hdb1chdj-xVtLqyhFnKMbI9x87NkmWs4-ybz44wIgEZX-uXjTSd54Cjp5Pi-zV58e6l-x0WtVCwU1aW2qzQj0C_j6nGQI1kgsYwz4ZXKG99IRKtOpkHEyTd14tsX0Fhky5h9kCgfVyeHa3I10neGNRrpBUGKh43H3DxnzaaZaAQAA&msaoauth2=true&lc=1046&sso_reload=true"
    }
    function sus(){
        window.location = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    }

    //botoes para aparecer postagens, curtidos e time

    // function postagens(){
    //     var display = document.querySelector(".postagensPerfil").style.display;
    //     if(display == "none"){
    //         document.getElementsByClassName(".postagensPerfil").style.display = "flex";
    //     } else {
    //         document.getElementsByClassName(".postagensPerfil").style.display = "none";
    //     }
    // }

    function editPerfil() {
        var editPerfil = document.querySelector('.editPerfil');
            editPerfil.style.display = 'flex';
                window.scrollTo(0,0);
                document.getElementsByTagName('body')[0].style.overflow = 'hidden';
    }
    function salvar() {
        var editPerfil = document.querySelector('.editPerfil');
        editPerfil.style.display = 'none';
            window.scrollTo(0,0);
            document.getElementsByTagName('body')[0].style.overflow = 'visible';
    }
    function adicionar(){
        window.location = "/planos"
    }
    function mudarAbaPerfil(abaSelecionada){
        var abaPostagens = document.querySelector('.postagensPerfil');
        var abaCurtidos = document.querySelector('.curtidosPerfil');
        var abaTime = document.querySelector('.timePerfil');

        var selecPostagem = document.querySelector('#botaoPostagens');
        var selecCurtidos = document.querySelector('#botaoCurtidos');
        var selecTime = document.querySelector('#botaoTime');

        if(abaSelecionada == "postagens"){

            abaPostagens.style.display = 'block';
            abaTime.style.display = 'none';
            abaCurtidos.style.display = 'none';

            selecPostagem.style.color = 'var(--preto)';
            selecCurtidos.style.color = 'var(--cinza)';
            selecTime.style.color = 'var(--cinza)';

            selecPostagem.style.textDecoration = "underline";
            selecCurtidos.style.textDecoration = "none";
            selecTime.style.textDecoration = "none";

        } else if(abaSelecionada == "curtidos") {

            abaCurtidos.style.display = 'block';
            abaTime.style.display = 'none';
            abaPostagens.style.display = 'none';

            selecPostagem.style.color = 'var(--cinza)';
            selecCurtidos.style.color = 'var(--preto)';
            selecTime.style.color = 'var(--cinza)';

            selecPostagem.style.textDecoration = "none";
            selecCurtidos.style.textDecoration = "underline";
            selecTime.style.textDecoration = "none";

        } else if(abaSelecionada == "time") {

            abaTime.style.display = 'grid';
            abaPostagens.style.display = 'none';
            abaCurtidos.style.display = 'none';

            selecPostagem.style.color = 'var(--cinza)';
            selecCurtidos.style.color = 'var(--cinza)';
            selecTime.style.color = 'var(--preto)';

            selecPostagem.style.textDecoration = "none";
            selecCurtidos.style.textDecoration = "none";
            selecTime.style.textDecoration = "underline";
        }
    }
