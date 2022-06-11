
$(document).ready(function(){
    var dayGrid = document.querySelector('.days');
    var firstIcon = document.querySelector('.day1');
    var secondIcon = document.querySelector('.day2');
    var thirdIcon = document.querySelector('.day3');
    var fourthIcon = document.querySelector('.day4');
    var fifthIcon = document.querySelector('.day5');
    var sixthIcon = document.querySelector('.day6');
    var seventhIcon = document.querySelector('.day7');


    firstIcon.classList.add('sunny');
    secondIcon.classList.add('sunny');
    thirdIcon.classList.add('cloudy');
    fourthIcon.classList.add('rainy');
    fifthIcon.classList.add('rainy');
    sixthIcon.classList.add('stormy');
    seventhIcon.classList.add('cloudy');


  
    //dayGrid.firstChild.replaceWith(firstIcon);
    

    //dayGrid.classList.add(firstIcon);
    //secondIcon.classList.add('sunny');
    //thirdIcon.classList.add('cloudy');

});

function showContent() {
  var temp = document.getElementsByTagName("template")[0];
  var clon = temp.content.cloneNode(true);
  document.body.appendChild(clon);
}; 