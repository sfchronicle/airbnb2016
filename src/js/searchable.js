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
			  var district = neighborhoodData.features[i].properties.name;
			  var userinput = [longitude, latitude];
			  var yourneighborhood = "";
			  var aboutyourarea = document.getElementById('aboutyourarea');

			  if (inside(userinput, polygon) == true) {
			  	aboutyourarea.innerHTML = '';
			    yourneighborhood = district;
			    aboutyourarea.insertAdjacentHTML('afterbegin','You live in <span style="font-family: AntennaMedium">' + yourneighborhood + "</span>.");

			    if ((yourneighborhood == "Outer Mission") || (yourneighborhood == "West of Twin Peaks")) {
			    	aboutyourarea.insertAdjacentHTML("beforeend","<p>Data for your neighborhood is not available.</p>");
			    }
			    else {
			    	aboutyourarea.insertAdjacentHTML("beforeend","<p>" + yourneighborhood + " had a total of ___ listings.</p>");
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
  $( "#addresssearch" ).slideToggle(300);

  if ($('#top').hasClass('fa-caret-right')) {
  	$('#top').removeClass('fa-caret-right').addClass('fa-caret-down');
  }
  else {
  	$('#top').removeClass('fa-caret-down').addClass('fa-caret-right');
  }
});

$( "#neighborbutton" ).click(function() {
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
