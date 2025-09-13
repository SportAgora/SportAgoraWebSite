document.addEventListener("DOMContentLoaded", function () {
    const senhaInput = document.getElementById("senha");
    const repsenhaInput = document.getElementById("repsenha");
    const toggleBtn = document.getElementById("toggleSenha");
    const ctoggleBtn = document.getElementById("ctoggleSenha");

    toggleBtn.addEventListener("click", function () {
        const isPassword = senhaInput.type === "password";
        senhaInput.type = isPassword ? "text" : "password";
        toggleBtn.textContent = isPassword ? "🙈" : "👁️"; // Alterna o ícone
    });
    ctoggleBtn.addEventListener("click", function () {
        const isPassword = repsenhaInput.type === "password";
        repsenhaInput.type = isPassword ? "text" : "password";
        ctoggleBtn.textContent = isPassword ? "🙈" : "👁️"; // Alterna o ícone
    });
});