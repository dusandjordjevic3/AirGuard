let map;  // Deklarisi map varijablu globalno
let airQualityChart; 

// FETCHUJ podatke kvaliteta vazduha sa lokacije na koju korisnik klikne
function fetchAirQualityData(lat, lon) {
    const apiKey = '0fbc73ca9d538f366974430561845774';  // API KLJUC
    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const airData = data.list[0].components;  // izvuci komponente kvaliteta vazduha
            // prikazi podatke u jednoj popup sekciji
            displayAirQuality(airData, lat, lon);
        })
        .catch(error => {
            console.error('Error fetching air quality data:', error);
            displayAirQualityError(lat, lon);  // hendlovanje gresaka
        });
}

// Funkcija za ažuriranje grafikona novim podacima o kvalitetu vazduha
function updateChart(data) {
    // Azuriraj podatke na grafikonu
    airQualityChart.data.datasets[0].data = [
        data.pm2_5,
        data.pm10,
        data.no2,
        data.so2,
        data.co,
        data.o3
    ];
    
    // Azuriraj oznake grafikona
    airQualityChart.data.labels = ['PM2.5', 'PM10', 'NO2', 'SO2', 'CO', 'O3'];

    // osvezi grafikon da vidis nove podatke
    airQualityChart.update();
}

// Inicijalizacija Chart.js
function initializeChart() {
    const ctx = document.getElementById('airQualityChart').getContext('2d');
    
    airQualityChart = new Chart(ctx, {
        type: 'bar',  // tip grafikona, u ovom slucaju bar
        data: {
            labels: ['PM2.5', 'PM10', 'NO2', 'SO2', 'CO', 'O3'],  // Oznake za parametre kvaliteta vazduha
            datasets: [{
                label: 'Parametri',
                data: [0, 0, 0, 0, 0, 0],  // Podrazumevani podaci, biće ažurirani dinamički
                backgroundColor: [ // boje za pozadinske boje 
                    'rgba(75, 192, 192, 0.2)', 
                    'rgba(153, 102, 255, 0.2)', 
                    'rgba(255, 159, 64, 0.2)', 
                    'rgba(255, 99, 132, 0.2)', 
                    'rgba(54, 162, 235, 0.2)', 
                    'rgba(255, 206, 86, 0.2)'  
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 2,
                // Uklonite debljinu trake da biste omogućili dinamičko skaliranje
                categoryPercentage: 0.8,  // Podešava razmak između šipki
                barPercentage: 0.9       // Podešava širinu svake pojedinačne trake
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Parametri za kvalitet vazduha',
                    font: {
                        size: 24,  // velicina fonta
                        family: 'Arial', // tip fontova (opciono)
                        weight: 'bold',  // Težina fonta (opciono)
                    },
                    color: '#ffffff'  // Red color for title text
                },
                legend: {
                    labels: {
                        font: {
                            size: 18,
                            family: 'Arial', //tip fontova (opciono)
                            weight: 'bold',  //Težina fonta (opciono)
                    },
                    color: '#ffffff'  // Crvena boja za tekst naslova
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba (0, 0, 0, 0.1)',
                        lineWidth: 0.5
                    },
                    ticks: {
                        font: {
                            size: 16,
                            family: 'Arial', //tip fontova (opciono)
                            weight: 'bold',  //Težina fonta (opciono)
                    },
                    color: '#ffffff'  // Crvena boja za tekst naslova
                    }
                },
                x: {
                    grid: {
                        color: 'rgba (0, 0, 0, 0.1)',
                        lineWidth: 0.5
                    },
                    ticks: {
                        font: {
                            size: 16,
                            family: 'Arial', //tip fontova (opciono)
                            weight: 'bold',  // Težina fonta (opciono)
                    },
                    color: '#ffffff'  // Crvena boja za tekst naslova
                    }
                }
            }
        }
    });
}

// Funkcija za određivanje boje na osnovu vrednosti kvaliteta vazduha
function getAirQualityColor(value, type) {
    // Primeri pragova za različite parametre
    const thresholds = {
        pm2_5: { healthy: 12, questionable: 35 },
        pm10: { healthy: 20, questionable: 50 },
        no2: { healthy: 50, questionable: 100 },
        so2: { healthy: 0.5, questionable: 2 },
        co: { healthy: 1, questionable: 5 },
        o3: { healthy: 60, questionable: 120 }
    };

    // Odredite da li je vrednost zdrava, upitna ili nezdrava
    let color = 'green';  // Podrazumevano zeleno (zdravo)
    
    if (value > thresholds[type].questionable) {
        color = 'red';  // nezdravo
    } else if (value > thresholds[type].healthy) {
        color = 'yellow';  // upitno
    }

    return color;
}

// Napravite element kruga sa odgovarajućom bojom
function createQualityCircle(color) {
    const circle = document.createElement('div');
    circle.style.width = '15px';
    circle.style.height = '15px';
    circle.style.borderRadius = '50%';
    circle.style.backgroundColor = color;
    circle.style.display = 'inline-block';
    circle.style.marginLeft = '5px';
    circle.style.float = 'right'; 
    circle.style.verticalAlign = 'middle';
    return circle;
}

// Prikažite podatke o kvalitetu vazduha u iskačućem prozoru ili odeljku
function displayAirQuality(data, lat, lon) {
    // Ažurirajte grafikon kada budu dostupni novi podaci
    updateChart(data); // <-- Ovde pozovite updateChart sa podacima
    const popupContent = `
        <h3>Kvalitet vazduha na ovoj lokaciji:</h3><br>
        <p style="display:inline;">PM2.5: ${data.pm2_5} µg/m³ ${createQualityCircle(getAirQualityColor(data.pm2_5, 'pm2_5')).outerHTML}</p>
        <p style="display:inline;">PM10: ${data.pm10} µg/m³ ${createQualityCircle(getAirQualityColor(data.pm10, 'pm10')).outerHTML}</p>
        <p style="display:inline;">NO2: ${data.no2} µg/m³ ${createQualityCircle(getAirQualityColor(data.no2, 'no2')).outerHTML}</p>
        <p style="display:inline;">SO2: ${data.so2} µg/m³ ${createQualityCircle(getAirQualityColor(data.so2, 'so2')).outerHTML}</p>
        <p style="display:inline;">CO: ${data.co} µg/m³ ${createQualityCircle(getAirQualityColor(data.co, 'co')).outerHTML}</p>
        <p style="display:inline;">O3: ${data.o3} µg/m³ ${createQualityCircle(getAirQualityColor(data.o3, 'o3')).outerHTML}</p>
    `;

    // Napravite marker sa iskačućim prozorom koji prikazuje podatke o kvalitetu vazduha
    L.popup()
        .setLatLng([lat, lon])
        .setContent(popupContent)
        .openOn(map);

}
// Rukovanje greškom u preuzimanju podataka o kvalitetu vazduha
function displayAirQualityError(lat, lon) {
    const popupContent = `
        <h3>Ne mogu da učitam podatke na ovoj lokaciji.</h3>
    `;
    L.popup()
        .setLatLng([lat, lon])
        .setContent(popupContent)
        .openOn(map);
}

// Podesite mapu sa Leaflet.js
function initializeMap() {
    map = L.map('map').setView([44.8176, 20.4633], 7);  // Koordinate za Srbiju

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    // Slušalac događaja za klikove na mapu
    map.on('click', function (event) {
        const lat = event.latlng.lat;
        const lon = event.latlng.lng;

        // Preuzmite podatke o kvalitetu vazduha za lokaciju na koju ste kliknuli
        fetchAirQualityData(lat, lon);
    });
}

// Inicijalizujte mapu
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
    initializeChart();
});

document.addEventListener('DOMContentLoaded', function() {
    const heading = document.querySelector('h1');
    const text = heading.textContent;
    
    // Obrišite sadržaj teksta
    heading.textContent = '';

    // Umotajte svako slovo u raspon i dodajte ga u naslov
    text.split('').forEach((letter, index) => {
        const span = document.createElement('span');
        span.textContent = letter;
        span.style.setProperty('--letter-index', index); // Podesite prilagođeno odlaganje
        heading.appendChild(span);
    });

// Umotajte svako slovo naslova u oznaku span radi animacije
document.querySelector('.animated-heading').innerHTML = document.querySelector('.animated-heading').textContent.split('').map(function(letter, index) {
    return `<span style="animation-delay: ${index * 0.1}s;">${letter}</span>`;
}).join('');


});