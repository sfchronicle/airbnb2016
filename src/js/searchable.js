require("component-responsive-frame/child");
require("angular");
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
					    	aboutyourarea.insertAdjacentHTML("beforeend","<p style='padding-top: 15px; margin-top: 15px'><span class='bold-text'>" + neighbor + "</span> had a total of <span class='bold-text'>" + databaseData[j].listings + "</span> Airbnb listings.<br><br>");

					    	//looking for entire homes/apts
					    	if (databaseData[j].property_1 > 1) {
						    	aboutyourarea.insertAdjacentHTML("beforeend","<p><span class='bold-text'>" + databaseData[j].property_1 + "</span> were entire home/apartment listings at <span class='bold-text'>" + databaseData[j].price_1 + "</span> per night.<br>");
					    	}
					    	else if (databaseData[j].property_1 == 1) {
						    	aboutyourarea.insertAdjacentHTML("beforeend","<p><span class='bold-text'>" + databaseData[j].property_1 + "</span> was an entire home/apartment listing at <span class='bold-text'>" + databaseData[j].price_1 + "</span> per night.<br>");					    		
					    	}
					    	else {
						    	aboutyourarea.insertAdjacentHTML("beforeend","<p>There were <span class='bold-text'>0</span> entire home/apartment listings in the area.<br>");					    		
					    	}
					    	//looking for private rooms
					    	if (databaseData[j].property_2 > 1) {
						    	aboutyourarea.insertAdjacentHTML("beforeend","<p><span class='bold-text'>" + databaseData[j].property_2 + "</span> were private room listings at <span class='bold-text'>" + databaseData[j].price_2 + "</span> per night.<br>");
					    	}
					    	else if (databaseData[j].property_2 == 1) {
						    	aboutyourarea.insertAdjacentHTML("beforeend","<p><span class='bold-text'>" + databaseData[j].property_2 + "</span> was private room listing at <span class='bold-text'>" + databaseData[j].price_2 + "</span> per night.<br>");					    		
					    	}
					    	else {
						    	aboutyourarea.insertAdjacentHTML("beforeend","<p>There were <span class='bold-text'>0</span> private room listings in the area.<br>");					    		
					    	}
					    	//looking for shared rooms
					    	if (databaseData[j].property_3 > 1) {
						    	aboutyourarea.insertAdjacentHTML("beforeend","<p style='padding-bottom: 20px; margin-bottom: 30px'><span class='bold-text'>" + databaseData[j].property_3 + "</span> were shared room listings at <span class='bold-text'>" + databaseData[j].price_3 + "</span> per night.</p>");
					    	}
					    	else if (databaseData[j].property_3 == 1) {
						    	aboutyourarea.insertAdjacentHTML("beforeend","<p style='padding-bottom: 20px; margin-bottom: 30px'><span class='bold-text'>" + databaseData[j].property_3 + "</span> was a shared room listing at <span class='bold-text'>" + databaseData[j].price_3 + "</span> per night.</p>");					    		
					    	}
					    	else {
						    	aboutyourarea.insertAdjacentHTML("beforeend","<p style='padding-bottom: 20px; margin-bottom: 30px'>There were <span class='bold-text'>0</span> shared room listings in the area.</p>");					    		
					    	}

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

var abutton = document.getElementById("addressbutton");
var nbutton = document.getElementById("neighborbutton");
var asearch = document.getElementById("addresssearch");
var nsearch = document.getElementById("neighborsearch");
var bottom = document.getElementById("bottom");
var top = document.getElementById("top");

abutton.addEventListener("click", function() {
  if (asearch.classList.contains('active')) {
  	asearch.classList.remove('active');
  }
  else {
  	nsearch.classList.remove('active');
  	asearch.classList.add('active');
  }

  if (bottom.classList.contains('fa-caret-down')) {
  	bottom.classList.remove('fa-caret-down');
  	bottom.classList.add('fa-caret-right');
  }

  if (top.classList.contains('fa-caret-right')) {
  	top.classList.remove('fa-caret-right');
  	top.classList.add('fa-caret-down');
  }
  else {
  	top.classList.remove('fa-caret-down');
  	top.classList.add('fa-caret-right');
  }
});

nbutton.addEventListener("click", function() {
  if (nsearch.classList.contains('active')) {
  	nsearch.classList.remove('active');
  }
  else {
  	asearch.classList.remove('active');
  	nsearch.classList.add('active');
  }

  if (top.classList.contains('fa-caret-down')) {
  	top.classList.remove('fa-caret-down');
  	top.classList.add('fa-caret-right');
  }

  if (bottom.classList.contains('fa-caret-right')) {
  	bottom.classList.remove('fa-caret-right');
  	bottom.classList.add('fa-caret-down');
  }
  else {
  	bottom.classList.remove('fa-caret-down');
  	bottom.classList.add('fa-caret-right');
  }
});

app.controller("SearchController", ["$scope", function($scope) {

	$scope.searchKeyword = "";
	$scope.sortType     = 'neighborhood';
	$scope.sortReverse  = false;

	$scope.searchdb = databaseData;

}]);
