// Carrega a biblioteca de gráficos do Google
google.charts.load('current', {
    'packages': ['geochart', 'corechart'],
});
google.charts.setOnLoadCallback(fetchDataAndDrawCharts);

function fetchDataAndDrawCharts() {
    // Busca os dados da API
    fetch('https://covid19-brazil-api.now.sh/api/report/v1/countries')
        .then(response => response.json())
        .then(data => {
            // Processa os dados para o gráfico de pizza
            let totalConfirmed = 0;
            let totalDeaths = 0;
            let totalRecovered = 0;

            data.data.forEach(country => {
                totalConfirmed += country.confirmed;
                totalDeaths += country.deaths;
                totalRecovered += country.recovered || 0; // Lida com o caso em que 'recovered' pode ser nulo
            });

            drawRegionsMap(data.data);
            drawPieChart(totalConfirmed, totalDeaths, totalRecovered);
        })
        .catch(error => console.error('Erro ao carregar os dados da API:', error));
}

function drawRegionsMap(data) {
    // Processa os dados da API para o formato aceito pelo gráfico
    const chartData = [['Country', 'Confirmed Cases']];
    data.forEach(country => {
        chartData.push([country.country, country.confirmed]);
    });

    // Converte os dados para o formato de DataTable do Google Charts
    const googleData = google.visualization.arrayToDataTable(chartData);
    const options = {
        colorAxis: { colors: ['#e0f2f1', '#004d40'] }
    };

    // Cria o gráfico e o desenha na div com id 'regions_div'
    const chart = new google.visualization.GeoChart(document.getElementById('regions_div'));
    chart.draw(googleData, options);
}

/* pizza */

function drawPieChart(totalConfirmed, totalDeaths, totalRecovered) {
    // Prepara os dados para o gráfico de pizza
    const pieData = google.visualization.arrayToDataTable([
        ['Status', 'Total'],
        ['Casos Confirmados', totalConfirmed],
        ['Mortes', totalDeaths],
        ['Recuperados', totalRecovered],
    ]);

    const options = {
        title: 'Total de Casos de COVID-19 pelo Mundo',
        is3D: true,
        slices: {
            0: { offset: 0.1 },
            1: { offset: 0.1 },
            2: { offset: 0.1 },
        },
    };

    // Cria e desenha o gráfico de pizza
    const pieChart = new google.visualization.PieChart(document.getElementById('piechart'));
    pieChart.draw(pieData, options);
}

// Carrega a biblioteca de gráficos do Google
google.charts.load('current', {
    'packages': ['geochart', 'corechart'],
});
google.charts.setOnLoadCallback(fetchDataAndDrawCharts);

function fetchDataAndDrawCharts() {
    fetch('https://covid19-brazil-api.now.sh/api/report/v1/countries')
        .then(response => response.json())
        .then(data => {
            let totalConfirmed = 0;
            let totalDeaths = 0;
            let totalRecovered = 0;

            data.data.forEach(country => {
                totalConfirmed += country.confirmed;
                totalDeaths += country.deaths;
                totalRecovered += country.recovered || 0;
            });

            drawRegionsMap(data.data);
            drawPieChart(totalConfirmed, totalDeaths, totalRecovered);

            // Chamada para buscar dados do Brasil
            fetchBrazilData();
        })
        .catch(error => console.error('Erro ao carregar os dados da API:', error));
}

function fetchBrazilData() {
    // API específica para dados dos estados do Brasil
    fetch('https://covid19-brazil-api.now.sh/api/report/v1')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('brazil-covid-table').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = ''; // Limpa o conteúdo existente

            data.data.forEach(state => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${state.uf}</td>
                    <td>${state.state}</td>
                    <td>${state.cases}</td>
                    <td>${state.deaths}</td>
                    <td>${state.suspects}</td>
                    <td>${state.refuses}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Erro ao carregar os dados do Brasil:', error));
}

function drawRegionsMap(data) {
    const chartData = [['Country', 'Confirmed Cases']];
    data.forEach(country => {
        chartData.push([country.country, country.confirmed]);
    });

    const googleData = google.visualization.arrayToDataTable(chartData);
    const options = {
        colorAxis: { colors: ['#e0f2f1', '#004d40'] }
    };

    const chart = new google.visualization.GeoChart(document.getElementById('regions_div'));
    chart.draw(googleData, options);
}

function drawPieChart(totalConfirmed, totalDeaths, totalRecovered) {
    const recoveryPercentage = (totalRecovered / totalConfirmed) * 100 || 0;

    const pieData = google.visualization.arrayToDataTable([
        ['Status', 'Total'],
        ['Casos Confirmados', totalConfirmed],
        ['Mortes', totalDeaths],
        ['Recuperados', totalRecovered],
        ['Recuperação (%)', recoveryPercentage]
    ]);

    const options = {
        title: 'Total de Casos de COVID-19 pelo Mundo',
        is3D: true,
        slices: {
            0: { offset: 0.1 },
            1: { offset: 0.1 },
            2: { offset: 0.1 },
            3: { offset: 0.1 },
        },
    };

    const pieChart = new google.visualization.PieChart(document.getElementById('piechart'));
    pieChart.draw(pieData, options);
}
    