
const weekdaysMap = new Map([[0,'Mon'],[1,'Thu'],[2,'Wed'],[3,'Thu'],[4,'Fri'],[5,'Sat'],[6,'Sun']]) ;
const numberOfDaysDisplayed = 7;
const currentDay = new Date().getDay();

let globalCityName = undefined;
let currentLatitude = undefined;
let currentLongitude = undefined;

/* Retrieves the data representing the city of the client */
async function fetchCityInformation(){

    const locationData = await fetch("http://ip-api.com/json");

    const locationDataJSON = await locationData.json();

    const cityName = locationDataJSON["city"];

    globalCityName = cityName;
    currentLatitude = locationDataJSON["lat"];
    currentLongitude = locationDataJSON["lon"];

    let newCityNameNode = document.querySelector("h1");
    let newCityName = document.createTextNode(cityName);
    newCityNameNode.append(newCityName);

    initializeIcons();
}

/* Retrieves the data from given location*/
async function fetchWeatherDataArray(){

let requestWeatherJSON = 'https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=' + currentLatitude
    + '&lon=' + currentLongitude;
let request = new Request(requestWeatherJSON);
let response =  await fetch(request);
let weatherData = await response.json();

let weatherReports = weatherData['properties']['timeseries'];
let presentableWeatherReports = [];
let index = 0;

while(presentableWeatherReports.length < 7){

  let currentDayReport = weatherReports[index]['time'];

  let tentshoursEqualTo1 = String(currentDayReport).charAt(11) === '1';
  let singlehoursEqualTo2 = currentDayReport.charAt(12) === '2';

  if(tentshoursEqualTo1 && singlehoursEqualTo2){
    presentableWeatherReports.push(weatherReports[index]);
  }
      index = index + 1;
 }

console.log(presentableWeatherReports);

return presentableWeatherReports;
}

/* Returns the number corresponding to weather description */
function findMatchingIcon(iconDescription){
    var dayToBeAdded = 'cloudy';

    let sunnyWeather = iconDescription.includes('clear');
    let partlyCloudyWeather = iconDescription.includes('partlycloudy') || iconDescription.includes('fair');
    let cloudyWeather = iconDescription.includes('cloud') || iconDescription.includes('fog');
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

    if(stormyWeather){
        dayToBeAdded = "stormy";
    }

    if(partlyCloudyWeather){
       dayToBeAdded = 'partly_cloudy';
    }

    return dayToBeAdded;
}

/* Initializes the icons of the webpage */
function initializeIcons(){
    let allDays = document.querySelector('.days');

     fetchWeatherDataArray().then(array => {

        let index = 0;

        while (index < allDays.childElementCount) {

            let daySummary = array[index]['data']['next_12_hours']['summary']['symbol_code'];

            let currentDayIcon = allDays.children.item(index);

            currentDayIcon.classList.add(findMatchingIcon(daySummary));

            index = index + 1;
        }
    });
}

/* Main function */
document.addEventListener("DOMContentLoaded", function() {

    fetchCityInformation();

    let weekDays = document.querySelector('.weekDays');

    let currentIndex = currentDay;
    let createdWeekdays = 0;

    while(createdWeekdays < numberOfDaysDisplayed){

        let textOfTheDay = weekdaysMap.get(currentIndex % 7);

        let weekDayElement = document.createElement("div");
        let weekDayText = document.createTextNode(textOfTheDay);
        weekDayElement.appendChild(weekDayText);
        weekDays.append(weekDayElement);

        currentIndex = currentIndex + 1;
        createdWeekdays += 1;
    }

  });

// function showContent() {
//   var temp = document.getElementsByTagName("template")[0];
//   var clon = temp.content.cloneNode(true);
//   document.body.appendChild(clon);
// }; 