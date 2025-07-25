const eventos = [
  {
    imagem: "/imagens/banner1.png",
    titulo: "VIII Congresso Internacional CBMA de Arbitragem",
    local: "Rio de Janeiro - RJ",
    data: "Quinta, 07 de Ago às 09:00",
    link: "/infopost1"
  },
  {
    imagem: "/imagens/banner2.jpg",
    titulo: "Maratona de Desenvolvimento Web",
    local: "São Paulo - SP",
    data: "Segunda, 01 de Set às 14:00",
    link: "/infopost2"
  },
  {
    imagem: "/imagens/banner3.jpg",
    titulo: "Campeonato Nacional de Atletismo",
    local: "Belo Horizonte - MG",
    data: "Domingo, 17 de Out às 08:30",
    link: "/infopost3"
  },
  {
    imagem: "/imagens/banner4.jpg",
    titulo: "Feira de Startups Inovadoras",
    local: "Florianópolis - SC",
    data: "Sexta, 23 de Ago às 10:00",
    link: "/infopost4"
  },
  {
    imagem: "/imagens/banner5.jpg",
    titulo: "Festival de Dança Urbana",
    local: "Salvador - BA",
    data: "Sábado, 10 de Nov às 20:00",
    link: "/infopost5"
  },
  {
    imagem: "/imagens/banner6.jpg",
    titulo: "Oficina de Teatro e Expressão",
    local: "Curitiba - PR",
    data: "Quarta, 28 de Ago às 15:00",
    link: "/infopost6"
  },
  {
    imagem: "/imagens/banner7.jpg",
    titulo: "Semana Nacional de Robótica",
    local: "Brasília - DF",
    data: "Terça, 15 de Set às 09:00",
    link: "/infopost7"
  },
  {
    imagem: "/imagens/banner8.jpg",
    titulo: "Fórum de Sustentabilidade Ambiental",
    local: "Manaus - AM",
    data: "Quinta, 03 de Out às 11:00",
    link: "/infopost8"
  },
  {
    imagem: "/imagens/banner9.jpg",
    titulo: "Encontro de Escritores Brasileiros",
    local: "Recife - PE",
    data: "Domingo, 24 de Nov às 16:00",
    link: "/infopost9"
  },
  {
    imagem: "/imagens/banner10.jpg",
    titulo: "Congresso Internacional de Psicologia",
    local: "Porto Alegre - RS",
    data: "Sábado, 30 de Ago às 10:00",
    link: "/infopost10"
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

