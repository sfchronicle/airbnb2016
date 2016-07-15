require("component-responsive-frame/child");
require("angular");
var app = angular.module("search", []);
var inside = require('point-in-polygon');
      
var placeSearch, autocomplete;
var latitude, longitude;

function initAutocomplete() {
	autocomplete = new google.maps.places.Autocomplete(
	    (document.getElementById('autocomplete')),
	      {
	        types: ['geocode']
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

			  var polygon = neighborhoodData.features[i].geometry.coordinates[0];
			  var district = neighborhoodData.features[i].properties.name;
			  var userinput = [longitude, latitude];
			  var yourneighborhood = "";
			  var aboutyourarea = document.getElementById('aboutyourarea');

			  console.log(district);

			  if (inside(userinput, polygon) == true) {
			  	aboutyourarea.innerHTML = '';
			    yourneighborhood = district;
			    aboutyourarea.insertAdjacentHTML('afterbegin','<p>You live in <span style="font-family: AntennaMedium">' + yourneighborhood + "</span>.</p>");

			    if ((yourneighborhood == "Outer Mission") || (yourneighborhood == "West of Twin Peaks")) {
			    	aboutyourarea.insertAdjacentHTML("beforeend","Data for your neighborhood is not available.");
			    }
			    else {
			    	aboutyourarea.insertAdjacentHTML("beforeend","In " + yourneighborhood + ", there were a total of __ Airbnb listings.");
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

app.controller("SearchController", ["$scope", function($scope) {

	$scope.searchKeyword = "";
	$scope.sortType     = 'neighborhood';
	$scope.sortReverse  = false;

	$scope.searchdb = databaseData;

}]);
