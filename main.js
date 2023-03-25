const searchBox = document.querySelector('.search-box');
searchBox.addEventListener('keypress', setQuery);

const baseURL = api.baseUrl;
const apiKey = api.API_KEY;
let locLat;
let locLong;
const activeLocation = document.querySelector('.get-location');
activeLocation.addEventListener("click", enableLocation);

function getError(err){
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

function getResultsLocation(locLat, locLong){
    fetch(`${baseURL}weather?lat=${locLat}&lon=${locLong}&units=metric&appid=${apiKey}`)
        .then(weather => {
            return weather.json();
        }).catch(err => console.log(err))
        .then(displayResults);
}

function getLocation(pos){
    const crd = pos.coords;
    locLat = crd.latitude;
    locLong = crd.longitude;
    console.log("Your current position is:");
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);

    getResultsLocation(locLat, locLong);
}

function enableLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(getLocation, getError);
    }else{
        alert("Your browser does not support Geolocation functionality. Please enter a location using the search bar.")
    }
}


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

function displayResults(weather){
    console.log(weather);
    let city = document.querySelector('.location .city');

    city.innerText = `${weather.name + ', ' + weather.sys.country}`;
    
    let now = new Date();
    let date = document.querySelector('.location .date');
    date.innerText = dateBuilder(now);

    let temp = document.querySelector('.current .temp');
    temp.innerHTML = `${Math.round(weather.main.temp)}<span>°c</span>`;

    let weather_el = document.querySelector('.current .weather');
    weather_el.innerText = weather.weather[0].main;

    let hiLow = document.querySelector('.hi-low');
    hiLow.innerText = `${weather.main.temp_max}°c / ${weather.main.temp_min}°c`;
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