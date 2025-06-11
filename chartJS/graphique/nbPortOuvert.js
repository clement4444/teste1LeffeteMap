export default function nbPortOuvert(dataOriginal) {
    const ctx = document.getElementById('nbPortOuvert');

    //compte chaque catégorie de métier
    //est_ce_que_votre_entreprise_atelier_ouvre_ses_portes_au_public
    const nbPorte = { "oui": 0, "non": 0 };
    for (const element of dataOriginal.results) {
        if (["oui", "Oui", "OUI"].includes(element.est_ce_que_votre_entreprise_atelier_ouvre_ses_portes_au_public)) {
            nbPorte["oui"] = nbPorte.oui + 1;
        } else {
            nbPorte["non"] = nbPorte.non + 1;
        }
    }

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Porte ouvert"],
            datasets: [{
                label: "nombre entreprise qui ouvre leur porte",
                data: [nbPorte.oui],
                borderWidth: 1,
                borderColor: '#000',
                backgroundColor: ["#65c48b"],
            },
            {
                label: "nombre entreprise qui ne ouvre pas leur porte",
                data: [nbPorte.non],
                borderWidth: 1,
                borderColor: '#000',
                backgroundColor: ["#f95a5c"],
            },]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
                x: {
                    display: false,
                },
            },
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        padding: 50,
                    },
                },
            }
        }
    });
}