
document.addEventListener('DOMContentLoaded', () => {
    const affectedPage = document.getElementById('affected');
    const vaccinatedPage = document.getElementById('vaccinated');
    const neighborsPage = document.getElementById('neighbors');
    const pages = [affectedPage, vaccinatedPage, neighborsPage];

    const affectedSelect = document.getElementById('country-select-affected');
    const vaccinatedSelect = document.getElementById('country-select-vaccinated');
    const neighborTableBody = document.querySelector('#neighbor-table tbody');
    
    const countryList = ['USA', 'India', 'Brazil', 'France', 'Turkey']; // Add more countries as needed

    function showPage(pageId) {
        pages.forEach(page => page.classList.remove('active'));
        document.getElementById(pageId).classList.add('active');
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const pageId = event.target.getAttribute('data-page');
            showPage(pageId);
        });
    });

    function populateCountrySelect(selectElement) {
        countryList.forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            selectElement.appendChild(option);
        });
    }

    function fetchCovidData(url) {
        return fetch(url).then(response => response.json());
    }

    function createLineChart(ctx, labels, datasets) {
        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Count'
                        }
                    }
                }
            }
        });
    }

    function updateAffectedChart(country) {
        const url = `https://disease.sh/v3/covid-19/historical/${country}?lastdays=30`;
        fetchCovidData(url).then(data => {
            const timeline = data.timeline;
            const labels = Object.keys(timeline.cases);
            const casesData = Object.values(timeline.cases);
            const deathsData = Object.values(timeline.deaths);
            const recoveredData = Object.values(timeline.recovered);
            
            const datasets = [
                {
                    label: 'Cases',
                    data: casesData,
                    borderColor: 'blue',
                    fill: false
                },
                {
                    label: 'Deaths',
                    data: deathsData,
                    borderColor: 'red',
                    fill: false
                },
                {
                    label: 'Recovered',
                    data: recoveredData,
                    borderColor: 'green',
                    fill: false
                }
            ];
            
            const ctx = document.getElementById('affectedChart').getContext('2d');
            createLineChart(ctx, labels, datasets);
        });
    }

    function updateVaccinatedChart(country) {
        const url = `https://disease.sh/v3/covid-19/vaccine/coverage/countries/${country}?lastdays=30`;
        fetchCovidData(url).then(data => {
            const timeline = data.timeline;
            const labels = Object.keys(timeline);
            const vaccinatedData = Object.values(timeline);
            
            const datasets = [
                {
                    label: 'Vaccinated',
                    data: vaccinatedData,
                    borderColor: 'purple',
                    fill: false
                }
            ];
            
            const ctx = document.getElementById('vaccinatedChart').getContext('2d');
            createLineChart(ctx, labels, datasets);
        });
    }

    function updateNeighborTable() {
        const countries = ['India', 'Sri Lanka', 'Bangladesh', 'China', 'Nepal'];
        const rows = countries.map(country => {
            const url = `https://disease.sh/v3/covid-19/countries/${country}`;
            return fetchCovidData(url).then(data => {
                return `
                    <tr>
                        <td>${data.country}</td>
                        <td>${data.cases}</td>
                        <td>${data.deaths}</td>
                        <td>${data.recovered}</td>
                        <td>${data.vaccinated}</td>
                    </tr>
                `;
            });
        });

        Promise.all(rows).then(rowsHtml => {
            neighborTableBody.innerHTML = rowsHtml.join('');
        });
    }

    populateCountrySelect(affectedSelect);
    populateCountrySelect(vaccinatedSelect);

    affectedSelect.addEventListener('change', () => updateAffectedChart(affectedSelect.value));
    vaccinatedSelect.addEventListener('change', () => updateVaccinatedChart(vaccinatedSelect.value));

    // Initialize default selections
    affectedSelect.value = countryList[0];
    vaccinatedSelect.value = countryList[0];

    updateAffectedChart(countryList[0]);
    updateVaccinatedChart(countryList[0]);
    updateNeighborTable();

    showPage('affected'); // Show the affected page by default
});
