import env from "/env/env.js";

//fonction pour fetch 100 par 100
async function fetch100(data, nb) {
    // fait la requet
    const reponse = await fetch(`${env.apiUrl}?limit=100&offset=${nb}`);
    console.log("Donner fetche")
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

//function pour récupérer toute les données
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