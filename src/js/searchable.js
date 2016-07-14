require("component-responsive-frame/child");
require("angular");
var app = angular.module("search", []);
var inside = require('point-in-polygon');

for (var i = 0; i < neighborhoodData.features.length; i++) {

  for (var h = 0; h < neighborhoodData.features[i].geometry.coordinates[0].length; h++)

  var polygon = neighborhoodData.features[i].geometry.coordinates[0][h];
  var district = neighborhoodData.features[i].properties.neighbourhood;
  var userinput = [120, 30];

  console.log(polygon);

  if (inside(userinput, polygon) == true) {
    console.log("hello!");
    console.log(district);
  }
  else {
    console.log("fail");
    console.log(district);
  }
}

app.controller("SearchController", ["$scope", function($scope) {

	$scope.searchKeyword = "";
	$scope.sortType     = 'neighborhood';
	$scope.sortReverse  = false;

	$scope.searchdb = databaseData;

}]);
