export default function nbSecteur(dataOriginal) {
    const ctx = document.getElementById('nbSecteur');

    //compte chaque catégorie de métier
    const nbParSecteur = {};
    for (const element of dataOriginal.results) {
        nbParSecteur[element.secteur_d_activite] = (nbParSecteur[element.secteur_d_activite] || 0) + 1;
    }
    console.log(nbParSecteur);
    console.log(Object.entries(nbParSecteur).sort((a, b) => a[1] - b[1]))

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.entries(nbParSecteur).sort((a, b) => a[1] - b[1]).reverse().map(item => item[0]),
            datasets: [{
                label: 'nombre',
                data: Object.values(nbParSecteur).sort((a, b) => b - a).map(item => item),
                borderWidth: 1,
                borderColor: '#000',
                backgroundColor: ["#000091", "#f95a5c", "#e2cf58", "#65c48b"],
            }]
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
                    display: false,
                }
            }
        }
    });
}