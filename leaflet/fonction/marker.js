
// fonction pour choisir une icone
export function defIcon(nom) {
    if (nom === "Métiers du gros œuvre") {
        return "marker_orange.svg";
    }
    else if (nom === "Métiers d'art") {
        return "marker_vert.svg";
    }
    else if (nom === "Métiers de l'accompagnement du chantier") {
        return "marker_jaunne.svg";
    }
    else if (nom === "Métiers de la conduite de travaux") {
        return "marker_bleu.svg";
    }
    return "marker_rose.svg";
}