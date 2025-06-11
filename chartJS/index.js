import { fetchData } from "./fonction/fetchData.js";
import nbCategorie from "./graphique/nbCategorie.js";
import nbPortOuvert from "./graphique/nbPortOuvert.js";
import nbSecteur from "./graphique/nbSecteur.js";

//récupère les données
const dataOriginal = await fetchData(true);
console.log(dataOriginal.results);

//graphique du nombre de catégorie
nbCategorie(dataOriginal);

nbPortOuvert(dataOriginal);

nbSecteur(dataOriginal);