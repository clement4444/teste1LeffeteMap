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

//pour afficher / cacher les layers
function switchHideLayer(categorie, bnt) {
    console.log(bnt)
    if (map.hasLayer(allLayers[categorie])) {
        map.removeLayer(allLayers[categorie]);
        bnt.classList.add("action");
    } else {
        map.addLayer(allLayers[categorie]);
        bnt.classList.remove("action");
    }
}

//crée les différentes layeur
allCategories.forEach((categorie, i) => {
    //crée un layer
    const layerGroup = L.layerGroup();
    // const layerGroup = L.markerClusterGroup();

    //ajoute a objet le layerGroup
    allLayers[categorie] = layerGroup;

    //créer le bouton de masquage 
    if (document.querySelector(`#filtreBnt${i + 1}`)) {
        document.querySelector(`#filtreBnt${i + 1}`).addEventListener("click", function () { switchHideLayer(categorie, this) });
    }
})

for (const item of data.results) {

    if (item.geo_point && item.geo_point.lat && item.geo_point.lon) {
        //crée un icon que ajoute apres
        const icon = L.icon({
            iconUrl: `/public/image/leaflet/marker/${defIcon(item.categories_de_metiers)}`,
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


// parti déplacement
let clownActif = false;
const bntClown = document.querySelector("#bntClown");

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
        // //crée un marqueur clown
        // const clownIcon = L.icon({
        //     iconUrl: '/public/image/leaflet/marker/marker_rose.svg',
        //     iconSize: [60, 40],
        // });
        // //ajoute le marqueur clown a la map
        // L.marker([mousse.lat, mousse.lng], { icon: clownIcon })
        //     .addTo(map)
        //     .bindPopup('Clown actif !', { autoClose: false, closeOnClick: false });
    }
}, 100);