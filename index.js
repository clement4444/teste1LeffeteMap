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


let clownActif = false;
// parti déplacement
const bntClown = document.querySelector("#filtreBnt5");

bntClown.addEventListener("click", () => {
    if (clownActif) {
        clownActif = false;
        bntClown.classList.remove("action");
    } else {
        clownActif = true;
        bntClown.classList.add("action");
    }
});


let mousse = { lat: 0, lng: 0 };
//écoute la souris sur la map
map.on('mousemove', function (e) {
    mousse = { lat: e.latlng.lat, lng: e.latlng.lng };
});

function approche(actuel, cible) {
    if (actuel < cible) return actuel + 0.00101000001000101;
    if (actuel > cible) return actuel - 0.00101000001000101;
    return actuel; // égal, donc on ne change rien
}

function approche2(actuel, cible) {
    const diff = Math.abs(actuel - cible);
    if (diff < 0.001) return actuel; // si la différence est très petite, on ne change pas
    if (actuel < cible) return actuel + diff / 100;
    if (actuel > cible) return actuel - diff / 100;
}

setInterval(() => {
    //si le clown est actif
    if (clownActif) {
        //on parcourt tout les layers
        map.eachLayer(layer => {
            //si c'est c'est un layeur et pas un marker
            if (layer instanceof L.LayerGroup) {
                //on parcourt toute le layeur a la recherche des markers
                layer.eachLayer(marker => {
                    //si c'est un marker
                    if (marker instanceof L.Marker) {
                        //  {lat: 49.152203, lng: 0.74478}
                        const markerLat = marker.getLatLng();
                        const diffLat = Math.abs(markerLat.lat - mousse.lat);
                        const diffLng = Math.abs(markerLat.lng - mousse.lng);
                        marker.setLatLng({
                            lat: approche2(markerLat.lat, mousse.lat),
                            lng: approche2(markerLat.lng, mousse.lng)
                        });
                    }
                });
            }
        });
    }
}, 100);