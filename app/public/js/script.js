
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

// Mostra sugestões enquanto digita
function mostrarSugestoes(inputId, painelId) {
  const input = document.getElementById(inputId);
  const painel = document.getElementById(painelId);
  const valor = input.value.trim().toLowerCase();
  painel.innerHTML = "";

  if (!valor) {
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
      li.onclick = () => selecionarSugestao(item, inputId);
      painel.appendChild(li);
    });
  }

  painel.classList.remove("oculto");
}

// Limpar campo
function limparPesquisa(inputId, painelId) {
  document.getElementById(inputId).value = "";
  document.getElementById(painelId).classList.add("oculto");
}


// Selecionar sugestão → envia para pesquisa real
function selecionarSugestao(texto, inputId) {
  document.getElementById(inputId).value = texto;
  window.location.href = `/pesquisar?q=${encodeURIComponent(texto)}`;
}

// Enter no teclado → envia para pesquisa real
function verificarEnter(event, inputId) {
  if (event.key === "Enter") {
    event.preventDefault();
    const valor = document.getElementById(inputId).value.trim();
    if (!valor) return;
    window.location.href = `/pesquisar?q=${encodeURIComponent(valor)}`;
  }
}

//notificação-icone

let temNotificacoes = true;

// Mostra ou esconde o badge com base no estado
function atualizarBadge() {
    const badge = document.getElementById('notificacao-badge');
    if (temNotificacoes) {
        badge.style.display = 'block';
    } else {
        badge.style.display = 'none';
    }
}

// Função chamada ao clicar no botão
function verNotificacoes() {
    temNotificacoes = false; // Marca como lido
    atualizarBadge();        // Esconde o badge
    window.location.href = '/notificacoes'; // Redireciona
}

// Chamada inicial ao carregar a página
document.addEventListener('DOMContentLoaded', atualizarBadge);

function mostrarBadgeNotificacao(temNotificacoesNovas) {
  const badge = document.getElementById("notificacao-badge1");
  if (temNotificacoesNovas) {
      badge.style.display = "block";
  } else {
      badge.style.display = "none";
  }
}

// Exemplo: há notificações novas
mostrarBadgeNotificacao(true);

// Exemplo: notificações lidas
// mostrarBadgeNotificacao(false);
