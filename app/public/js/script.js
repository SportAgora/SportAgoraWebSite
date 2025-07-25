
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

// notificação
const painel = document.getElementById("painelNotificacoes");
const botao = document.getElementById("botaoNotificacao");
const lista = document.getElementById("listaNotificacoes");
const badge = document.getElementById("badgeNotificacao");

const notificacoes = [
  {
    id: 1,
    imagem: "/imagens/perfil1.png",
    texto: "João comentou em seu post.",
    tempo: "2m",
    lida: false
  },
  {
    id: 2,
    imagem: "/imagens/perfil2.png",
    texto: "Maria curtiu sua publicação.",
    tempo: "10m",
    lida: false
  },
  {
    id: 3,
    imagem: "/imagens/perfil3.png",
    texto: "Carlos começou a te seguir.",
    tempo: "1h",
    lida: true
  }
];

function renderizarNotificacoes() {
  lista.innerHTML = "";
  notificacoes.forEach(n => {
    const item = document.createElement("div");
    item.classList.add("notificacao-item");

    item.innerHTML = `
      <div style="position: relative;">
        <img src="${n.imagem}" alt="Usuário">
        ${!n.lida ? '<span class="bolinha-verde"></span>' : ''}
      </div>
      <div class="notificacao-texto">
        <strong>${n.texto}</strong>
        <span>${n.tempo}</span>
      </div>
    `;
    lista.appendChild(item);
  });
}

function atualizarBadge() {
  const naoLidas = notificacoes.filter(n => !n.lida);
  if (naoLidas.length > 0) {
    badge.textContent = naoLidas.length;
    badge.classList.remove("oculto");
  } else {
    badge.classList.add("oculto");
  }
}

function marcarTodasComoLidas() {
  notificacoes.forEach(n => n.lida = true);
}

botao.addEventListener("click", (e) => {
  e.stopPropagation();
  painel.classList.toggle("oculto");

  if (!painel.classList.contains("oculto")) {
    marcarTodasComoLidas();
    renderizarNotificacoes();
    atualizarBadge();
  }
});

document.addEventListener("click", (e) => {
  if (!painel.contains(e.target) && !botao.contains(e.target)) {
    painel.classList.add("oculto");
  }
});

renderizarNotificacoes();
atualizarBadge();

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

function mostrarSugestoes() {
  const input = document.getElementById("inputPesquisa");
  const painel = document.getElementById("sugestoes");
  const valor = input.value.trim().toLowerCase();

  painel.innerHTML = ""; // limpa sugestões anteriores

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
      li.onclick = () => selecionarSugestao(item);
      painel.appendChild(li);
    });
  }

  painel.classList.remove("oculto");
}

function selecionarSugestao(texto) {
  document.getElementById("inputPesquisa").value = texto;
  document.getElementById("sugestoes").classList.add("oculto");
  // Aqui você pode redirecionar para a página do item
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
      window.location.href = "/erro"; // redireciona para página de erro
    } else {
      selecionarSugestao(valor);
    }
  }
}
