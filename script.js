async function getWeather() {
    const city = document.getElementById('city').value;
    const apiKey = 'bd5e378503939ddaee76f12ad7a97608'; // Your API key

    if (!city) {
        alert("Please enter a city name");
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=7&units=metric&appid=${apiKey}`;

    try {
        console.log('Fetching current weather...');
        const currentWeatherResponse = await fetch(currentWeatherUrl);
        if (!currentWeatherResponse.ok) throw new Error(`Current weather fetch failed: ${currentWeatherResponse.statusText}`);
        const currentWeatherData = await currentWeatherResponse.json();

        console.log('Fetching forecast...');
        const forecastResponse = await fetch(forecastUrl);
        if (!forecastResponse.ok) throw new Error(`Forecast fetch failed: ${forecastResponse.statusText}`);
        const forecastData = await forecastResponse.json();

        console.log('Current Weather Data:', currentWeatherData); // Debugging line
        console.log('Forecast Data:', forecastData); // Debugging line

        displayWeather(currentWeatherData, forecastData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data. Please check the console for more details.');
    }
}

function displayWeather(currentData, forecastData) {
    const cityName = document.getElementById('city-name');
    const todayWeather = document.getElementById('today-weather');
    const weatherInfo = document.getElementById('weather-info');
    const ctx = document.getElementById('weatherChart').getContext('2d');

    // Display today's weather
    cityName.textContent = currentData.name;
    todayWeather.textContent = `Today: ${currentData.weather[0].description}, Temperature: ${currentData.main.temp}°C`;
    weatherInfo.style.display = 'block';

    // Display weekly forecast
    const dates = forecastData.list.map(item => new Date(item.dt * 1000).toLocaleDateString());
    const temperatures = forecastData.list.map(item => item.main.temp);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatures,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
