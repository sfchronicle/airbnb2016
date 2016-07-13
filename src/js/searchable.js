require("component-responsive-frame/child");
require("angular");
var app = angular.module("search", []);
var inside = require('point-in-polygon');

app.controller("SearchController", ["$scope", function($scope) {

	$scope.searchKeyword = "";
	$scope.sortType     = 'neighborhood';
	$scope.sortReverse  = false;

	$scope.searchdb = databaseData;

}]);
