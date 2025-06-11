export default function nbCategorie(dataOriginal) {
    const ctx = document.getElementById('nbCategorie');

    //compte chaque catégorie de métier
    const nbParCategorie = {};
    for (const element of dataOriginal.results) {
        nbParCategorie[element.categories_de_metiers] = (nbParCategorie[element.categories_de_metiers] || 0) + 1;
    }

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(nbParCategorie).map(item => item),
            datasets: [{
                label: 'nombre',
                data: Object.values(nbParCategorie).map(item => item),
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