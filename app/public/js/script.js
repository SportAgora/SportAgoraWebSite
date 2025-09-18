
const loginButton = document.querySelector('.login-button');
const menuPanel = document.getElementById('menu-panel');

loginButton.addEventListener('click', () => {
    menuPanel.classList.toggle('open');

    if (menuPanel.classList.contains('open')) {
        menuPanel.style.display = 'block';
    } else {
        setTimeout(() => {
            menuPanel.style.display = 'none';
        }, 300);
    }
});


const hamburgerMenu = document.querySelector('.hamburger-menu');
const mobileMenu = document.getElementById('mobile-menu');

hamburgerMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
});

document.addEventListener('DOMContentLoaded', function() {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const loginButton = document.getElementById('login-button');
    const menuPanel = document.getElementById('menu-panel');
    const mobileSearchBar = document.getElementById('mobile-search-bar');

    hamburgerMenu.addEventListener('click', function() {
        if (mobileMenu.classList.contains('open')) {
            mobileMenu.classList.remove('open');
        } else {
            mobileMenu.classList.add('open');
        }
    });

    loginButton.addEventListener('click', function() {
        if (menuPanel.classList.contains('open')) {
            menuPanel.classList.remove('open');
        } else {
            menuPanel.classList.add('open');
        }
    });
});

//search bar

// Usar a mesma lista de sugestões
const sugestoesFixas = [
  "evento de futebol",
  "esportes de bola",
  "corrida de rua",
  "campeonato de vôlei",
  "aula de zumba",
  "treino funcional",
  "futebol society",
  "evento de dança",
  "hip hop",
  "evento de basquete"
];

// Funções para PC (já existentes)
function mostrarSugestoes() {
  const input = document.getElementById("inputPesquisa");
  const painel = document.getElementById("sugestoes");
  mostrarSugestoesGenerico(input, painel);
}

function selecionarSugestao(texto, inputId, painelId) {
  document.getElementById(inputId).value = texto;
  document.getElementById(painelId).classList.add("oculto");
  alert(`Redirecionando para: ${texto}`);
}

function limparPesquisa() {
  document.getElementById("inputPesquisa").value = "";
  document.getElementById("sugestoes").classList.add("oculto");
}

function verificarEnter(event) {
  if (event.key === "Enter") {
    const valor = document.getElementById("inputPesquisa").value.trim().toLowerCase();
    const encontrado = sugestoesFixas.some(item => item.toLowerCase().includes(valor));
    if (!encontrado) {
      window.location.href = "/erro";
    } else {
      selecionarSugestao(valor, "inputPesquisa", "sugestoes");
    }
  }
}

// Funções para Mobile (novas)
function mostrarSugestoesMobile() {
  const input = document.getElementById("inputPesquisaMobile");
  const painel = document.getElementById("sugestoesMobile");
  mostrarSugestoesGenerico(input, painel);
}

function limparPesquisaMobile() {
  document.getElementById("inputPesquisaMobile").value = "";
  document.getElementById("sugestoesMobile").classList.add("oculto");
}

function verificarEnterMobile(event) {
  if (event.key === "Enter") {
    const valor = document.getElementById("inputPesquisaMobile").value.trim().toLowerCase();
    const encontrado = sugestoesFixas.some(item => item.toLowerCase().includes(valor));
    if (!encontrado) {
      window.location.href = "/erro";
    } else {
      selecionarSugestao(valor, "inputPesquisaMobile", "sugestoesMobile");
    }
  }
}

// Função genérica para mostrar sugestões (evita repetir código)
function mostrarSugestoesGenerico(input, painel) {
  const valor = input.value.trim().toLowerCase();
  painel.innerHTML = "";

  if (valor === "") {
    painel.classList.add("oculto");
    return;
  }

  const resultados = sugestoesFixas.filter(item => item.toLowerCase().includes(valor));

  if (resultados.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Nenhuma pesquisa encontrada";
    li.style.color = "#999";
    painel.appendChild(li);
  } else {
    resultados.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item;
      li.onclick = () => selecionarSugestao(item, input.id, painel.id);
      painel.appendChild(li);
    });
  }

  painel.classList.remove("oculto");
}


function selecionarSugestao(texto) {
  document.getElementById("inputPesquisa").value = texto;
  document.getElementById("sugestoes").classList.add("oculto");
  alert(`Redirecionando para: ${texto}`);
}

function limparPesquisa() {
  document.getElementById("inputPesquisa").value = "";
  document.getElementById("sugestoes").classList.add("oculto");
}

function verificarEnter(event) {
  if (event.key === "Enter") {
    const valor = document.getElementById("inputPesquisa").value.trim().toLowerCase();
    const encontrado = sugestoesFixas.some(item => item.toLowerCase().includes(valor));
    if (!encontrado) {
      window.location.href = "/erro"; 
    } else {
      selecionarSugestao(valor);
    }
  }
}
