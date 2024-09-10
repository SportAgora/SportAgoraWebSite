
var map = L.map('map').setView([-23.5120, -46.8764], 15); 

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var locais = [
    {
        nome: "Centro Esportivo do Engenho Novo",
        coords: [-23.508320, -46.879759]
    },
    {
        nome: "CIE (Centro de Iniciação Esportiva)",
        coords: [-23.506477, -46.879247]
    },
    {
        nome: "Complexo Esportivo Vila Porto",
        coords: [-23.516296, -46.882218]
    },
    {
        nome: "Complexo Esportivo Jardim Silveira",
        coords: [-23.524246, -46.885038]
    },
    {
        nome: "Ginásio Poliesportivo",
        coords: [-23.5120, -46.8764]
    }
];

// Adicionando marcadores no mapa para cada local
locais.forEach(function(local) {
    L.marker(local.coords)
        .addTo(map)
        .bindPopup(`<b>${local.nome}</b>`)
        .openPopup();
});
