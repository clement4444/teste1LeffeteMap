import { fetchData } from "./fonction/fetchData.js";
import { defIcon } from "./fonction/marker.js";
import allCategories from "./constante/categorie.js";

// crée la map en set la vue sur Paris
const map = L.map('map').setView([48.8566, 2.3522], 13);

// charge la map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Ajout d’un marqueur
// L.marker([48.8566, 2.3522])
//     .addTo(map)
//     .bindPopup('Paris 🇫🇷')
//     .openPopup();

const data = await fetchData(true);

const allLayers = {};

//crée les différentes layeur
allCategories.forEach((categorie) => {
    //crée un layer
    const layerGroup = L.layerGroup();
    //ajoute a objet le layerGroup
    allLayers[categorie] = layerGroup;
})

for (const item of data.results) {

    if (item.geo_point && item.geo_point.lat && item.geo_point.lon) {
        //crée un icon que ajoute apres
        const icon = L.icon({
            iconUrl: `/public/image/marker/${defIcon(item.categories_de_metiers)}`,
            iconSize: [60, 40],
        });
        //crée un marquer avec l'icon au bonne corrdonnée
        L.marker([item.geo_point.lat, item.geo_point.lon], { icon: icon })
            .addTo(allLayers[item.categories_de_metiers])
            .bindPopup(`${item.entreprise}<br/>${item.categories_de_metiers}`, { autoClose: false, closeOnClick: false });
    }
}

//afficher sur la map les layers
Object.values(allLayers).forEach(layerGroup => {
    layerGroup.addTo(map);
});


//pour afficher / cacher les layers
function switchHideLayer(categorie, bnt) {
    if (map.hasLayer(allLayers[categorie])) {
        map.removeLayer(allLayers[categorie]);
        bnt.classList.add("action");
    } else {
        map.addLayer(allLayers[categorie]);
        bnt.classList.remove("action");
    }
}

//relier la fontion a tout les bouton
const bnt1 = document.querySelector("#filtreBnt1");
const bnt2 = document.querySelector("#filtreBnt2");
const bnt3 = document.querySelector("#filtreBnt3");
const bnt4 = document.querySelector("#filtreBnt4");

bnt1.addEventListener("click", () => switchHideLayer("Métiers de la conduite de travaux", bnt1));
bnt2.addEventListener("click", () => switchHideLayer("Métiers du gros œuvre", bnt2));
bnt3.addEventListener("click", () => switchHideLayer("Métiers de l'accompagnement du chantier", bnt3));
bnt4.addEventListener("click", () => switchHideLayer("Métiers d'art", bnt4));