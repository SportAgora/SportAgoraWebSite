document.addEventListener('DOMContentLoaded', function() {
    // Initialize and add the map with a higher zoom level
    const map = L.map('map').setView([-23.5055, -46.8798], 15); // Ajuste o valor do zoom para 15

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const locations = [
        { name: 'Ginásio Poliesportivo', position: [-23.501, -46.881] },
        { name: 'Parque Municipal', position: [-23.506, -46.876] },
        { name: 'Clube Esportivo', position: [-23.509, -46.873] },
    ];

    locations.forEach(location => {
        L.marker(location.position).addTo(map)
            .bindPopup(location.name)
            .openPopup();
    });
});