const cores_claro = {
  erro: "#812222",
  principal: "#8D5EFF",
  principal_escura: "#5730B3",
  principal_claro: "#A078FF",
  complementar: "#B3A82A",
  complementar2: "#FFF426",
  branco: "#F1F1F1",
  preto: "#1B1B1B",
  cinza: "#6C757D",
  cinza_escuro:"#333",
  cinza_claro:"#929292",
  background: "#E6ECF0"
};

const cores_escuro = {
  erro: "#812222",
  principal: "#8D5EFF",
  principal_escura: "#5730B3",
  principal_claro: "#A078FF",
  complementar: "#FFF426",
  complementar2: "#B3A82A",
  branco: "#1B1B1B",
  preto: "#F1F1F1",
  cinza: "#6C757D",
  cinza_escuro:"#929292",
  cinza_claro:"#333",
  background: "#0D0D0D"
};

function aplicarCores(cores) {
  for (const chave in cores) {
    document.documentElement.style.setProperty(`--${chave}`, cores[chave]);
  }
}

function setDarkMode() {
  aplicarCores(cores_escuro);
  document.body.classList.remove('light-mode');
  document.body.classList.add('dark-mode');
  localStorage.setItem('mode', 'dark');
  // animações específicas do dark mode aqui, se quiser
}

function setLightMode() {
  aplicarCores(cores_claro);
  document.body.classList.remove('dark-mode');
  document.body.classList.add('light-mode');
  localStorage.setItem('mode', 'light');
  // animações específicas do light mode aqui, se quiser
}

function toggleMode() {
  const mode = localStorage.getItem('mode');
  if (mode === 'dark') {
    setLightMode();
  } else {
    setDarkMode();
  }
}

function loadMode() {
  const mode = localStorage.getItem('mode');
  if (mode === 'dark') {
    setDarkMode();
  } else {
    setLightMode();
  }
}

window.onload = () => {
  loadMode();
  // animação inicial do sol, lua, etc.
};
