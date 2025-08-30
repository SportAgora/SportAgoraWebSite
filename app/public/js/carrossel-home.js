const eventos = [
  {
    imagem: "/imagens/banner1.png",
    titulo: "VIII Congresso Internacional CBMA de Arbitragem",
    local: "Rio de Janeiro - SP",
    data: "Quinta, 08 de Ago às 09:00",
    link: "/infoevento"
  },
  {
    imagem: "/imagens/esporte-montanha.png",
    titulo: "Festival na Montanha",
    local: "São Paulo - SP",
    data: "Segunda, 01 de Set às 14:00",
    link: "/infoevento"
  },
  {
    imagem: "/imagens/natação-evento.png",
    titulo: "Campeonato Nacional de Natação",
    local: "Belo Horizonte - SP",
    data: "Domingo, 17 de Out às 08:30",
    link: "/infoevento"
  },
  {
    imagem: "/imagens/campeonato-basquete.png",
    titulo: "Aricadura Run 2025",
    local: "Florianópolis - SP",
    data: "Sexta, 23 de Ago às 10:00",
    link: "/infoevento"
  },
  {
    imagem: "/imagens/campeonato-futebol.png",
    titulo: "Campeonato de Futebol da Vazéa",
    local: "Salvador - SP",
    data: "Sábado, 10 de Nov às 20:00",
    link: "/infoevento"
  },
  {
    imagem: "/imagens/circuito natação.png",
    titulo: "Circuito de Natação",
    local: "Curitiba - SP",
    data: "Quarta, 28 de Ago às 15:00",
    link: "/infoevento"
  },
  {
    imagem: "/imagens/campeonato-atletismo.png",
    titulo: "Em Busca Do Melhor Atleta",
    local: "Brasília - SP",
    data: "Terça, 15 de Set às 09:00",
    link: "/infoevento"
  },
  {
    imagem: "/imagens/campeonato-bmx.png",
    titulo: "Desafio Da Subida Da Montanha ",
    local: "Manaus - SP",
    data: "Quinta, 03 de Out às 11:00",
    link: "/infoevento"
  },
  {
    imagem: "/imagens/campeonato-skate.png",
    titulo: " Encontro dos Skatistas",
    local: "Recife - SP",
    data: "Domingo, 24 de Nov às 16:00",
    link: "/infoevento"
  },
  {
    imagem: "/imagens/campeonato-ciclismo.png",
    titulo: "Corrida Proficional De Cicilosmo",
    local: "Porto Alegre - SP",
    data: "Sábado, 30 de Ago às 10:00",
    link: "/infoevento"
  }
];

let slideAtual = 0;
let intervalo;

function carregarCarrossel() {
  const inner = document.getElementById("carousel-inner");
  const indicators = document.getElementById("carousel-indicators");

  eventos.forEach((evento, index) => {
    const div = document.createElement("div");
    div.classList.add("carousel-slide");
    const img = document.createElement("img");
    img.src = evento.imagem;
    img.alt = evento.titulo;
    div.appendChild(img);
    inner.appendChild(div);

    const indicador = document.createElement("div");
    indicador.addEventListener("click", () => irParaSlide(index));
    indicators.appendChild(indicador);
  });

  atualizarSlide();
  iniciarAutoSlide();
}

function atualizarSlide() {
  const inner = document.getElementById("carousel-inner");
  const indicadores = document.querySelectorAll(".carousel-indicators div");

  inner.style.transform = `translateX(-${slideAtual * 100}%)`;

  indicadores.forEach((ind, i) =>
    ind.classList.toggle("active", i === slideAtual)
  );

  const evento = eventos[slideAtual];
  document.getElementById("evento-titulo").textContent = evento.titulo;
  document.getElementById("evento-local").textContent = evento.local;
  document.getElementById("evento-data").textContent = evento.data;
  document.getElementById("carousel-link").href = evento.link;
}

function mudarSlide(direcao) {
  slideAtual = (slideAtual + direcao + eventos.length) % eventos.length;
  atualizarSlide();
  reiniciarAutoSlide();
}

function irParaSlide(index) {
  slideAtual = index;
  atualizarSlide();
  reiniciarAutoSlide();
}

function iniciarAutoSlide() {
  intervalo = setInterval(() => mudarSlide(1), 6000);
}

function reiniciarAutoSlide() {
  clearInterval(intervalo);
  iniciarAutoSlide();
}

document.addEventListener("DOMContentLoaded", carregarCarrossel);

