/* Constant varaibles */
const weekdaysMap = new Map([[0,'Mon'],[1,'Thu'],[2,'Wed'],[3,'Thu'],[4,'Fri'],[5,'Sat'],[6,'Sun']]) ;
const numberOfDaysDisplayed = 7;
const currentDayNumber = new Date().getDay();

/* Data required to generate weather report */
let globalCityName = undefined;
let currentLatitude = undefined;
let currentLongitude = undefined;

/* Retrieves the data containing the city of the client */
async function fetchLocationData(){
    const locationData = await fetch("http://ip-api.com/json");

    const locationDataJSON = await locationData.json();

    const cityName = locationDataJSON["city"];

    globalCityName = cityName;
    currentLatitude = locationDataJSON["lat"];
    currentLongitude = locationDataJSON["lon"];
}

/* Retrieves a week's worth of weather data from given location */
async function fetchWeatherDataArray(){

// Fetches the weatherdata and converts it to JSON format
let requestWeatherJSON = 'https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=' + currentLatitude
    + '&lon=' + currentLongitude;
let request = new Request(requestWeatherJSON);
let response =  await fetch(request);
let weatherData = await response.json();

let weatherReports = weatherData['properties']['timeseries'];
let presentableWeatherReports = [];
let index = 0;

// Filters out any weatherdata that isn't from 12:00 in the day
while(presentableWeatherReports.length < 7){

  let currentDayReport = weatherReports[index]['time'];

  let tentshoursEqualTo1 = String(currentDayReport).charAt(11) === '1';
  let singlehoursEqualTo2 = currentDayReport.charAt(12) === '2';

  if(tentshoursEqualTo1 && singlehoursEqualTo2){
    presentableWeatherReports.push(weatherReports[index]);
  }
      index = index + 1;
 }

return presentableWeatherReports;
}

/* Returns an iconID corresponding to given icon description*/
function findMatchingIcon(iconDescription){
    let dayToBeAdded;

    let sunnyWeather = iconDescription.includes('clear');
    let partlyCloudyWeather = iconDescription.includes('partlycloudy');
    let cloudyWeather = iconDescription.includes('cloud') || iconDescription.includes('fog') || iconDescription.includes('fair');
    let rainyWeather = iconDescription.includes('rain') || iconDescription.includes('sleet');
    let stormyWeather = iconDescription.includes('storm');
    let snowyWeather = iconDescription.includes('snow');

    if(rainyWeather){
        dayToBeAdded = 'rainy';
    }
    if(sunnyWeather){
        dayToBeAdded = 'sunny';
    }
    if(cloudyWeather){
        dayToBeAdded = 'cloudy';
    }
    if(partlyCloudyWeather){
        dayToBeAdded = 'partly_cloudy';
    }
    if(stormyWeather){
        dayToBeAdded = "stormy";
    }

    console.log(iconDescription);

    return dayToBeAdded;
}

/* Initializes the icons of the webpage */
function createIconsDisplay(){

    let allDays = document.querySelector('.days');

     fetchWeatherDataArray().then(array => {

         console.log(array);

        let index = 0;

        while (index < allDays.childElementCount) {

            let daySummary = array[index]['data']['next_12_hours']['summary']['symbol_code'];

            let currentDayIcon = allDays.children.item(index);

            currentDayIcon.classList.add(findMatchingIcon(daySummary));

            index = index + 1;
        }
    });
}

/* Creates the days of the week displayed */
function createWeekdaysDisplay() {
    let weekDays = document.querySelector('.weekDays');

    let currentIndex = currentDayNumber;
    let createdWeekdays = 0;

    while (createdWeekdays < numberOfDaysDisplayed) {

        let textOfTheDay = weekdaysMap.get(currentIndex % 7);

        let weekDayElement = document.createElement("div");
        let weekDayText = document.createTextNode(textOfTheDay);
        weekDayElement.appendChild(weekDayText);
        weekDays.append(weekDayElement);

        currentIndex = currentIndex + 1;
        createdWeekdays += 1;
    }
}
/* Creates the city display of the webpage */
function createCityDisplay() {
    let newCityNameNode = document.querySelector("h1");
    let newCityName = document.createTextNode(globalCityName);
    newCityNameNode.append(newCityName);
}
/* Initializes the webpage components */
async function initialize(){

    await fetchLocationData();

    createCityDisplay();
    createIconsDisplay();
    createWeekdaysDisplay();
}

/* Main function */
document.addEventListener("DOMContentLoaded", function() {
    initialize();
});