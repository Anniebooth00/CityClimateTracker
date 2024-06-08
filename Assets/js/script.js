// Add event listener to the search button
document.getElementById('searchButton').addEventListener('click', function() {
    var city = document.getElementById('cityInput').value; // Get the value from the input field
    if (city) { // Check if the input is not empty
        getWeatherData(city); // Fetch weather data for the city
        updateSearchHistory(city); // Update search history
        document.getElementById('cityInput').value = ''; // Clear the input field
    }
});

// Function to fetch weather data from the API
function getWeatherData(city) {
    var apiKey = 'c897dfafee3999b0dcc5455a5b2a036f'; // API key for OpenWeatherMap
    var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`; // API URL with city and API key

    fetch(apiUrl)
        .then(response => response.json()) // Convert response to JSON
        .then(data => {
            displayCurrentWeather(data); // Display current weather data
            displayForecast(data); // Display weather forecast
        })
        .catch(error => console.error('Error fetching weather data:', error)); // Log errors to the console
}

// Function to display current weather data
function displayCurrentWeather(data) {
    var weatherDetails = document.getElementById('weatherDetails'); // Get the weather details container
    var currentWeather = data.list[0]; // Get the current weather data from the API response

    var weatherHtml = `
        <h4>${data.city.name} (${new Date(currentWeather.dt_txt).toLocaleDateString()})</h4>
        <img src="http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png" alt="${currentWeather.weather[0].description}">
        <p>Temperature: ${(currentWeather.main.temp - 273.15).toFixed(2)} °C</p>
        <p>Humidity: ${currentWeather.main.humidity}%</p>
        <p>Wind Speed: ${currentWeather.wind.speed} m/s</p>
    `; // HTML content for current weather

    weatherDetails.innerHTML = weatherHtml; // Insert the HTML content into the weather details container
}

// Function to display weather forecast
function displayForecast(data) {
    var forecastContainer = document.querySelector('.searchedCity .five-day'); // Get the forecast container
    forecastContainer.innerHTML = ''; // Clear previous forecast

    var forecastDays = {}; // Object to hold forecast data grouped by date

    // Group forecast data by date
    data.list.forEach(forecast => {
        var date = new Date(forecast.dt_txt).toLocaleDateString();

        if (!forecastDays[date]) {
            forecastDays[date] = [];
        }

        forecastDays[date].push(forecast);
    });

    // Iterate over the grouped forecast data and generate HTML for each day
    Object.keys(forecastDays).slice(0, 5).forEach(date => {
        var forecasts = forecastDays[date];
        var averageTemp = forecasts.reduce((sum, f) => sum + f.main.temp, 0) / forecasts.length;
        var averageHumidity = forecasts.reduce((sum, f) => sum + f.main.humidity, 0) / forecasts.length;
        var averageWindSpeed = forecasts.reduce((sum, f) => sum + f.wind.speed, 0) / forecasts.length;
        var weatherIcon = forecasts[Math.floor(forecasts.length / 2)].weather[0].icon;

        var dayHtml = `
            <div class="forecast-card">
                <h5>${date}</h5>
                <img src="http://openweathermap.org/img/wn/${weatherIcon}.png" alt="Weather icon">
                <p>Temp: ${(averageTemp - 273.15).toFixed(2)} °C</p>
                <p>Wind: ${averageWindSpeed.toFixed(2)} m/s</p>
                <p>Humidity: ${averageHumidity}%</p>
            </div>
        `; // HTML content for forecast day

        forecastContainer.innerHTML += dayHtml; // Append the HTML content to the forecast container
    });
}

// Function to update the search history
function updateSearchHistory(city) {
    var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || []; // Get search history from localStorage

    if (!searchHistory.includes(city)) { // Check if the city is not already in the search history
        searchHistory.push(city); // Add the city to the search history
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory)); // Save updated search history to localStorage
    }

    displaySearchHistory(); // Display the updated search history
}

// Function to display the search history
function displaySearchHistory() {
    var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || []; // Get search history from localStorage
    var searchHistoryContainer = document.querySelector('.searchedBox .searchHistory'); // Get the search history container

    searchHistoryContainer.innerHTML = ''; // Clear previous search history
    searchHistory.forEach(city => { // Iterate over the search history
        var cityElement = document.createElement('div'); // Create a new div element for each city
        cityElement.textContent = city; // Set the text content to the city name
        cityElement.addEventListener('click', function() {
            getWeatherData(city); // Add click event to fetch weather data for the city
        });
        searchHistoryContainer.appendChild(cityElement); // Append the city element to the search history container
    });
}

// Initialize the search history when the page loads
document.addEventListener('DOMContentLoaded', function() {
    displaySearchHistory(); // Display the search history on page load
});
