//Setup basic info on page load
window.addEventListener("load", onPageLoad);

function onPageLoad(){
    let now = new Date();
    let date = document.querySelector('.location .date');
    date.innerText = dateBuilder(now);
    //getResults('Chicago');
}

const searchBox = document.querySelector('.search-box');
searchBox.addEventListener('keypress', setQuery);

//OpenWeather API Set Up
const baseURL = api.baseUrl;
const apiKey = api.API_KEY;

//Geolocation API
let locLat;
let locLong;
const activeLocation = document.querySelector('.get-location');
activeLocation.addEventListener("click", enableLocation);

function getError(err){
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

function getLocation(pos){
    const crd = pos.coords;
    locLat = crd.latitude;
    locLong = crd.longitude;
    getResultsLocation(locLat, locLong);
}

function enableLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(getLocation, getError);
    }else{
        alert("Your browser does not support Geolocation functionality. Please enter a location using the search bar.")
    }
}

//OpenWeather API Calls
function setQuery(evt){
    if(evt.keyCode == 13){
        getResults(searchBox.value);
    }
}

function getResults(query){
    fetch(`${baseURL}weather?q=${query}&units=metric&appid=${apiKey}`)
        .then(weather => {
            return weather.json();
        }).catch(err => console.log(err))
        .then(displayResults);
}

function getResultsLocation(locLat, locLong){
    fetch(`${baseURL}weather?lat=${locLat}&lon=${locLong}&units=metric&appid=${apiKey}`)
        .then(weather => {
            return weather.json();
        }).catch(err => console.log(err))
        .then(displayResults);
}

//Display OpenWeather API Data functions
function displayResults(weather){
    console.log(weather);
    let city = document.querySelector('.location .city');

    city.innerText = `${weather.name + ', ' + weather.sys.country}`;
    
    let now = new Date();
    let date = document.querySelector('.location .date');
    date.innerText = dateBuilder(now);

    let temp = document.querySelector('.current .temp');
    temp.innerHTML = `${Math.round(weather.main.temp)}<span>°c</span>`;

    let feelsLike = document.querySelector('.current .feels-like');
    feelsLike.innerHTML = `Feels Like: ${Math.round(weather.main.feels_like)}<span>°c</span>`;

    let weather_el = document.querySelector('.current .weather');
    weather_el.innerText = weather.weather[0].main;

    let humidity = document.querySelector('.current .humidity');
    humidity.innerText = `Humidity: ${weather.main.humidity}%`;

    let weatherIcon = document.querySelector('.current .weather-icon');
    weatherIcon.src = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;
    weatherIcon.alt = weather.weather[0].main;

    let hiLow = document.querySelector('.hi-low');
    hiLow.innerText = `${Math.round(weather.main.temp_max)}°c / ${Math.round(weather.main.temp_min)}°c`;
}

function dateBuilder(d){
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();
    return `${day} ${month} ${date}, ${year}`;
}