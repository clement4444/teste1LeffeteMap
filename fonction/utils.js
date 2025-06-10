import env from "../env/env.js";

async function fetch100(data, nb) {
    // fait la requet
    const reponse = await fetch(`${env.apiUrl}?limit=100&offset=${nb}`);
    //conevrti en json
    const newData = await reponse.json();

    //si c'est le premier tour on revoit direct
    if (nb === 0) {
        return newData;
    }

    //rajoute les nouvelles données à l'objet data
    data.results = data.results.concat(newData.results || []);
    return data;
}

export async function fetchData(isSaved = false) {
    //si save on verifie si on a déjà les données
    if (isSaved && localStorage.getItem("dataEco")) {
        return JSON.parse(localStorage.getItem("dataEco"));
    }

    let compteurSecuite = 0;
    let nb = 0;
    let data = {};
    data = await fetch100(data, nb);

    //boucle pour récupérer toutes les données et pas seulement 100
    while (data.total_count > data.results.length && compteurSecuite < 5) {
        compteurSecuite++;
        nb += 100;
        data = await fetch100(data, nb);
    }

    //si save on sauvegarde dans le localStorage
    if (isSaved) {
        localStorage.setItem("dataEco", JSON.stringify(data));
    }

    return data;
}

export function defIcon(nom) {
    if (nom === "Métiers du gros œuvre") {
        return "marker_jaunne.svg";
    }
    else if (nom === "Métiers d'art") {
        return "marker_bleu.svg";
    }
    else if (nom === "Métiers de l'accompagnement du chantier") {
        return "marker_orange.svg";
    }
    else if (nom === "Métiers de la conduite de travaux") {
        return "marker_maron.svg";
    }
    return "marker_rose.svg";
}