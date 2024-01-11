let searchBtn = document.querySelector('.cityForm button');
let userInput = document.querySelector('.cityForm input');
let searchHistory = document.querySelector('.searchHistory');

let currentDay = document.querySelector('.currentDay');

let weekForecastOrder = document.querySelector('.weekForecastOrder');

let localCity = 'city';
let storedValue = localStorage.getItem(localCity);
if(storedValue !== null){
    storedValue = JSON.parse(localStorage.getItem(localCity));
    // console.log(storedValue);
    spawnLocalStorage();
}
else
{
    // console.log('im empty');
    storedValue = [];
}

let city;
let APIKey = '5c61b62ab32ba9cc4324066a4d6430fa';
let dayURL;

function getWeatherEmoji(weatherCondition) {
    const emojiMap = {
        'Clear': '☀️',
        'Clouds': '☁️',
        'Rain': '🌧️',
        'Snow': '❄️',
    };

    return emojiMap[weatherCondition] || '❓';
}

function todaysDate(){
    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth() + 1;
    var day = currentDate.getDate();
    var formattedDate = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);
    return formattedDate;
}

function resetElements(){
    if(currentDay.hasChildNodes()) {
        while (currentDay.firstChild) {
            currentDay.removeChild(currentDay.firstChild);
        }
    }
    if(weekForecastOrder.hasChildNodes()) {
        while (weekForecastOrder.firstChild) {
            weekForecastOrder.removeChild(weekForecastOrder.firstChild);
        }
    }
}

function formatDate(date){
    let components = date.split('-');
    return components[1] + '-' + components[2] + '-' + components[0];
}

function createCDE(currentCity, date, currentEmoji, currentTemp, currentWind, currentHumidity){
    let city = document.createElement('h1');
    let temp = document.createElement('h4');
    let wind = document.createElement('h4');
    let humidity = document.createElement('h4');
    city.textContent = currentCity + ' (' + formatDate(date) + ') ' + currentEmoji;
    temp.textContent = 'Temp: ' + currentTemp + '°F';
    wind.textContent = 'Wind: ' + currentWind + 'MPH';
    humidity.textContent = 'Humidity: ' + currentHumidity + '%';
    currentDay.append(city,temp,wind,humidity);
}

function createWE(weekDate, currentEmoji, currentTemp, currentWind, currentHumidity){
    let div = document.createElement('div');
    let date = document.createElement('h3');
    let emoji = document.createElement('h4');
    let temp = document.createElement('h4');
    let wind = document.createElement('h4');
    let humidity = document.createElement('h4');

    let check = weekDate.indexOf(' ');
    if (check !== -1) {
        weekDate = weekDate.substring(0, check);
    }

    div.classList.add('fiveDaysForecast');
    date.textContent = '(' + formatDate(weekDate) + ')';
    emoji.textContent = currentEmoji;
    temp.textContent = 'Temp: ' + currentTemp + '°F';
    wind.textContent = 'Wind: ' + currentWind + 'MPH';
    humidity.textContent = 'Humidity: ' + currentHumidity + '%';
    div.append(date,emoji,temp,wind,humidity);
    weekForecastOrder.append(div);
}

function getApi() {
    resetElements();
    city = userInput.value;
    dayURL = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + APIKey;
  
    fetch(dayURL)
    .then(function (response) {
        if(response.ok){
            return response.json();
        }
    })
    .then(function (data) {
        console.log(data);

        if(storedValue.length === 0){
            storedValue.push(data.name);
            localStorage.setItem('city', JSON.stringify(storedValue));
            setLocalStorage();
        }
        else if(storedValue.indexOf(data.name) === -1){
            storedValue.push(data.name);
            localStorage.setItem('city', JSON.stringify(storedValue));
            setLocalStorage();
            // console.log(storedValue);
        }
        
        let currentCity = data.name;
        let currentEmoji = getWeatherEmoji(data.weather[0].main);
        let currentTemp = parseFloat(((data.main.temp-273.15)* 9/5 + 32).toFixed(2));
        let currentWind = data.wind.speed;
        let currentHumidity = data.main.humidity;

        createCDE(currentCity, todaysDate(), currentEmoji, currentTemp, currentWind, currentHumidity);

        let weekURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + APIKey + '&units=imperial';

        fetch(weekURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // console.log(data);
            createWE(data.list[4].dt_txt, getWeatherEmoji(data.list[4].weather[0].main), parseFloat((data.list[4].main.temp).toFixed(2)), data.list[4].wind.speed, data.list[4].main.humidity);
            createWE(data.list[12].dt_txt, getWeatherEmoji(data.list[12].weather[0].main), parseFloat((data.list[12].main.temp).toFixed(2)), data.list[12].wind.speed, data.list[12].main.humidity);
            createWE(data.list[20].dt_txt, getWeatherEmoji(data.list[20].weather[0].main), parseFloat((data.list[20].main.temp).toFixed(2)), data.list[20].wind.speed, data.list[20].main.humidity);
            createWE(data.list[28].dt_txt, getWeatherEmoji(data.list[28].weather[0].main), parseFloat((data.list[28].main.temp).toFixed(2)), data.list[28].wind.speed, data.list[28].main.humidity);
            createWE(data.list[36].dt_txt, getWeatherEmoji(data.list[36].weather[0].main), parseFloat((data.list[36].main.temp).toFixed(2)), data.list[36].wind.speed, data.list[36].main.humidity);
        });
    });
}
searchBtn.addEventListener('click', getApi);

function getHistoryApi(city) {
    resetElements();
    dayURL = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + APIKey;
  
    fetch(dayURL)
    .then(function (response) {
        if(response.ok){
            return response.json();
        }
    })
    .then(function (data) {
        // console.log(data);
        let currentCity = data.name;
        let currentEmoji = getWeatherEmoji(data.weather[0].main);
        let currentTemp = parseFloat(((data.main.temp-273.15)* 9/5 + 32).toFixed(2));
        let currentWind = data.wind.speed;
        let currentHumidity = data.main.humidity;

        createCDE(currentCity, todaysDate(), currentEmoji, currentTemp, currentWind, currentHumidity);

        let weekURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + APIKey + '&units=imperial';

        fetch(weekURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // console.log(data);
            createWE(data.list[4].dt_txt, getWeatherEmoji(data.list[4].weather[0].main), parseFloat((data.list[4].main.temp).toFixed(2)), data.list[4].wind.speed, data.list[4].main.humidity);
            createWE(data.list[12].dt_txt, getWeatherEmoji(data.list[12].weather[0].main), parseFloat((data.list[12].main.temp).toFixed(2)), data.list[12].wind.speed, data.list[12].main.humidity);
            createWE(data.list[20].dt_txt, getWeatherEmoji(data.list[20].weather[0].main), parseFloat((data.list[20].main.temp).toFixed(2)), data.list[20].wind.speed, data.list[20].main.humidity);
            createWE(data.list[28].dt_txt, getWeatherEmoji(data.list[28].weather[0].main), parseFloat((data.list[28].main.temp).toFixed(2)), data.list[28].wind.speed, data.list[28].main.humidity);
            createWE(data.list[36].dt_txt, getWeatherEmoji(data.list[36].weather[0].main), parseFloat((data.list[36].main.temp).toFixed(2)), data.list[36].wind.speed, data.list[36].main.humidity);
        });
    });
}

function spawnLocalStorage(){
    for(let i = 0; i < storedValue.length; i++){
        btn = document.createElement('button');
        btn.textContent = storedValue[i];
        btn.setAttribute('id', storedValue[i]);
        btn.addEventListener('click', function (event) {
            getHistoryApi(event.currentTarget.id);
            // console.log('I made it here');
        });
        searchHistory.append(btn);
    }
}

function setLocalStorage(){
    btn = document.createElement('button');
    lastIndex = storedValue.length-1;
    btn.textContent = storedValue[lastIndex];
    btn.setAttribute('id', storedValue[lastIndex]);
    btn.addEventListener('click', function (event) {
        getHistoryApi(event.currentTarget.id);
        console.log('I made it here');
    });
    searchHistory.append(btn);
}