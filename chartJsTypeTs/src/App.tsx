import './App.css'
import { Chart } from 'chart.js';
import type { ChartConfiguration } from 'chart.js';

function App() {

  const config: ChartConfiguration = {
    type: 'bar',
    data: {
      labels: ["h", "g"],
      datasets: [{
        label: 'nombre',
        data: [1, 2, 3, 4],
        borderWidth: 1,
        borderColor: '#000',
        backgroundColor: ["#000091", "#f95a5c", "#e2cf58", "#65c48b"],
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          display: false
        },
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            padding: 20,
          }
        }
      }
    }
  }

  console.log(config);


  return (null)
}

export default App
