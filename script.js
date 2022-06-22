
const weekdaysMap = [[0,'Mon'],[1,'Thu'],[2,'Wed'],[3,'Thu'],[4,'Fri'],[5,'Sat'],[6,'Sun']];

const iconNames = ['sun','cloud','rain','storm','snow'];

const currentDay = new Date().getDay();

//const ålesundCoordinates = ['62.4709','6.15464','6'];
const ålesundCoordinates = ['63.4709','10.39464','6'];


/* Retrieves the data from given location*/
async function fetchWeatherDataArray(){

let requestWeatherJSON = 'https://api.met.no/weatherapi/locationforecast/2.0/compact?altitude=' + ålesundCoordinates[2] + '&lat=' + ålesundCoordinates[1] + 
'&lon=' + ålesundCoordinates[0];
let request = new Request(requestWeatherJSON);
let response = await fetch(request);
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
    var dayToBeAdded = undefined;

    let sunnyWeather = iconDescription.includes('clear');
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

            //let iconClone = document.getElementsByClassName('.' + findMatchingIcon(daySummary));

            currentDayIcon.classList.add(findMatchingIcon(daySummary));

            index = index + 1;
        }
    });

}

/* Main function */
document.addEventListener("DOMContentLoaded", function() {

    initializeIcons();

    let weekDays = document.querySelector('.weekDays');

    let counter = 0;

    while(counter < weekDays.classList.length){

        let currentIndex = counter % 6;

        weekDays.classList.add(weekdaysMap[counter])
    }

  });

// function showContent() {
//   var temp = document.getElementsByTagName("template")[0];
//   var clon = temp.content.cloneNode(true);
//   document.body.appendChild(clon);
// }; 