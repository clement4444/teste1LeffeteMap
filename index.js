import { fetchData, defIcon } from "./fonction/utils.js";

// crée la map en set la vue sur Paris
const map = L.map('map').setView([48.8566, 2.3522], 13);

// charge la map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Ajout d’un marqueur
L.marker([48.8566, 2.3522])
    .addTo(map)
    .bindPopup('Paris 🇫🇷')
    .openPopup();

const data = await fetchData();

for (const item of data.results) {

    if (item.geo_point && item.geo_point.lat && item.geo_point.lon) {
        //crée un icon que ajoute apres
        const icon = L.icon({
            iconUrl: `./public/image/marker/${defIcon(item.categories_de_metiers)}`,
            iconSize: [60, 40],
        });

        //crée un marquer avec l'icon au bonne corrdonnée
        L.marker([item.geo_point.lat, item.geo_point.lon], { icon: icon })
            .addTo(map)
            .bindPopup(item.entreprise);
    }
}