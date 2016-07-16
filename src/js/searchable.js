require("component-responsive-frame/child");
require("angular");
var $ = require("jquery");
var app = angular.module("search", []);
var inside = require('point-in-polygon');
   
var placeSearch, autocomplete;
var latitude, longitude;

function initAutocomplete() {
	var defaultBounds = new google.maps.LatLngBounds(
	  new google.maps.LatLng(37.707552,-122.516098),
	  new google.maps.LatLng(37.8327,-122.358856));

	autocomplete = new google.maps.places.Autocomplete(
	    (document.getElementById('autocomplete')),
	      {
	        bounds: defaultBounds,
	        componentRestrictions: {country: 'us'}
	      }
	    );

	autocomplete.addListener('place_changed', function(){
        var geocoder = new google.maps.Geocoder();
        var address = document.getElementById('autocomplete').value;

        geocoder.geocode({ 'address': address }, function (results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
              latitude = results[0].geometry.location.lat();
              longitude = results[0].geometry.location.lng();
              console.log(longitude + ", " + latitude);

			for (var i = 0; i < neighborhoodData.features.length; i++) {

			  for (var h = 0; h < neighborhoodData.features[i].geometry.coordinates[0].length; h++)

			  // move some of these variables into the if/else statement

			  var polygon = neighborhoodData.features[i].geometry.coordinates[0];
			  var neighbor = neighborhoodData.features[i].properties.name;
			  var userinput = [longitude, latitude];
			  var aboutyourarea = document.getElementById('aboutyourarea');

			  if (inside(userinput, polygon) == true) {
			  	aboutyourarea.innerHTML = '';
			    aboutyourarea.insertAdjacentHTML('afterbegin','You live in <span class="bold-text">' + neighbor + "</span>.");

			    if ((neighbor == "Outer Mission") || (neighbor == "West of Twin Peaks") || (neighbor == "Mission Bay") || (neighbor == "Japantown") || (neighbor == "West Portal") || (neighbor == "Seacliff") || (neighbor == "Lakeshore") || (neighbor == "Treasure Island/YBI") || (neighbor == "Presidio") || (neighbor == "Golden Gate Park")) {
			    	aboutyourarea.insertAdjacentHTML("beforeend","<p>Data for your neighborhood is not available.</p>");
			    }
			    else {
			    	for (var j = 0; j < databaseData.length; j++) {
			    		if (databaseData[j].neighborhood == neighbor) {
					    	aboutyourarea.insertAdjacentHTML("beforeend","<p><i class='fa fa-home' aria-hidden='true'></i>  <span class='bold-text'>" + neighbor + "</span> had a total of <span class='bold-text'>" + databaseData[j].listings + "</span> Airbnb listings.<br><br><span class='bold-text'>" + databaseData[j].property_1 + "</span> were entire home/apartment listings at <span class='bold-text'>" + databaseData[j].price_1 + "</span> per night,<br><span class='bold-text'>" + databaseData[j].property_2 + "</span> were private room listings at <span class='bold-text'>" + databaseData[j].price_2 + "</span> per night, and<br><span class='bold-text'>" + databaseData[j].property_3 + "</span> were shared room listings at <span class='bold-text'>" + databaseData[j].price_3 + "</span> per night.<br></p>");
					    	break;
			    		}
			    	}
			    }
			    break;
			  }
			  else if ((inside(userinput,polygon) == false) && (i == neighborhoodData.features.length - 1)) {
				  	aboutyourarea.innerHTML = '';
			    	aboutyourarea.insertAdjacentHTML('afterbegin',"<p>We couldn't locate your address.</p>");
			  }
			  else {
			  }
			}

          }
      })

	})
}

initAutocomplete();

$( "#addressbutton" ).click(function() {
  $("#neighborsearch").slideUp(300);
  if ($('#bottom').hasClass('fa-caret-down')) {
  	$('#bottom').removeClass('fa-caret-down').addClass('fa-caret-right');
  }

  $( "#addresssearch" ).slideToggle(300);

  if ($('#top').hasClass('fa-caret-right')) {
  	$('#top').removeClass('fa-caret-right').addClass('fa-caret-down');
  }
  else {
  	$('#top').removeClass('fa-caret-down').addClass('fa-caret-right');
  }
});

$( "#neighborbutton" ).click(function() {
  $("#addresssearch").slideUp(300);
  if ($('#top').hasClass('fa-caret-down')) {
  	$('#top').removeClass('fa-caret-down').addClass('fa-caret-right');
  }

  $( "#neighborsearch" ).slideToggle(300);

  if ($('#bottom').hasClass('fa-caret-right')) {
  	$('#bottom').removeClass('fa-caret-right').addClass('fa-caret-down');
  }
  else {
  	$('#bottom').removeClass('fa-caret-down').addClass('fa-caret-right');
  }
});

app.controller("SearchController", ["$scope", function($scope) {

	$scope.searchKeyword = "";
	$scope.sortType     = 'neighborhood';
	$scope.sortReverse  = false;

	$scope.searchdb = databaseData;

}]);
