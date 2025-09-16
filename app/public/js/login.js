// document.addEventListener("DOMContentLoaded", function () {
//     const senhaInput = document.getElementById("senha");
//     const repsenhaInput = document.getElementById("repsenha");
//     const toggleBtn = document.getElementById("toggleSenha");
//     const ctoggleBtn = document.getElementById("ctoggleSenha");

//     toggleBtn.addEventListener("click", function () {
//         const isPassword = senhaInput.type === "password";
//         senhaInput.type = isPassword ? "text" : "password";
//         toggleBtn.textContent = isPassword ? "🙈" : "👁️"; 
//     });
//     ctoggleBtn.addEventListener("click", function () {
//         const isPassword = repsenhaInput.type === "password";
//         repsenhaInput.type = isPassword ? "text" : "password";
//         ctoggleBtn.textContent = isPassword ? "🙈" : "👁️"; 
//     });
// });
document.addEventListener("DOMContentLoaded", function () {
    const senhaInput = document.getElementById("senha");
    const repsenhaInput = document.getElementById("repsenha");
    const toggleBtn = document.getElementById("toggleSenha");
    const ctoggleBtn = document.getElementById("ctoggleSenha");

    const imgAberto = "imagens/aberto.png";
    const imgFechado = "imagens/fechado.png";

    toggleBtn.addEventListener("click", function () {
        const isPassword = senhaInput.type === "password";
        senhaInput.type = isPassword ? "text" : "password";
        toggleBtn.innerHTML = `<img src="${isPassword ? imgAberto : imgFechado}" alt="Mostrar senha" width="20">`;
    });

    ctoggleBtn.addEventListener("click", function () {
        const isPassword = repsenhaInput.type === "password";
        repsenhaInput.type = isPassword ? "text" : "password";
        ctoggleBtn.innerHTML = `<img src="${isPassword ? imgAberto : imgFechado}" alt="Mostrar senha" width="20">`;
    });

    // Inicializa com imagem "fechado"
    toggleBtn.innerHTML = `<img src="${imgFechado}" alt="Mostrar senha" width="20">`;
    ctoggleBtn.innerHTML = `<img src="${imgFechado}" alt="Mostrar senha" width="20">`;
});