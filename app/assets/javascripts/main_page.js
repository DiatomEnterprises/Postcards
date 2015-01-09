var app = angular.module("Postcards", ["ngResource"]);

app.factory("Postcards", [
  "$resource", function($resource) {
    return $resource("/postcards", {
      id: "@id"
    }, {
      create: {
      	method: "POST"
      }
    });
  }
]);

app.factory("Postcard", [
  "$resource", function($resource) {
    return $resource("/postcards/:id", {
      id: "@id"
    }, {
      update: {
        method: "PUT"
      },
      remove: {
      	method: "DELETE"
      }
    });
  }
]);

app.controller("PostcardsCtrl", function($scope, Postcard) {
	$scope.postcards = Postcards.query();

	$scope.addReceiver = function() {
	  var receiver = Postcard.save($scope.newReceiver);
	  $scope.receivers.push(receiver);
	  return $scope.newReceiver = {};
	};

	$scope.updateReceiver = function(receiver){
		
	};

	$scope.deleteReceiver = function(receiver){

	};

});