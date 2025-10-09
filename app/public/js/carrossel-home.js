let slideAtual = 0;
let intervalo;
let startX = 0;
let endX = 0;

function carregarCarrossel() {
  const inner = document.getElementById("carousel-inner");
  const indicators = document.getElementById("carousel-indicators");

  eventos_js.forEach((evento, index) => {
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

  adicionarSwipe(); 
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

  const evento = eventos_js[slideAtual];
  document.getElementById("evento-titulo").textContent = evento.titulo;
  document.getElementById("evento-local").textContent = evento.local;
  document.getElementById("evento-data").textContent = evento.data;
  document.getElementById("carousel-link").href = evento.link;
  document.getElementById("carousel-link2").href = evento.link;
}

function mudarSlide(direcao) {
  slideAtual = (slideAtual + direcao + eventos_js.length) % eventos_js.length;
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

function adicionarSwipe() {
  const carrossel = document.getElementById("carousel-home");

  carrossel.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  carrossel.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].clientX;
    if (startX - endX > 50) {
      mudarSlide(1); 
    } else if (endX - startX > 50) {
      mudarSlide(-1); 
    }
  });
}

document.addEventListener("DOMContentLoaded", carregarCarrossel);
