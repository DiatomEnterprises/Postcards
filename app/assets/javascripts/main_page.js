var app = angular.module("Postcards", ["ngResource"]);

app.factory("Postcards", [
  "$resource", function($resource) {
    return $resource('/postcards/:id', {}, {
      query: {method:'GET', params:{id:''}, isArray:true},
      post: {method:'POST'},
      update: {method:'PUT', params: {id: '@id'}},
      remove: {method:'DELETE', params: {id: '@id'}}
    });
  }
]);

app.controller("PostcardsCtrl", function($scope, Postcards) {
  $scope.receiverForm = true;
  $scope.toggle = function() {
    $scope.receiverForm = !$scope.receiverForm;
  };

	$scope.postcards = Postcards.query();
  $scope.receiverList = [];

	$scope.addReceiver = function() {
	  var receiver = Postcards.save($scope.receiverFormData);
    $scope.postcards.push(receiver);
	  $scope.receiverForm = true;
    return $scope.receiverFormData = {};
	};

  $scope.editReceiver = function(receiver){
    $scope.receiverForm = !$scope.receiverForm;
    $scope.receiverFormData = receiver
  };

	$scope.updateReceiver = function(receiver){
    receiver.$update({ id: receiver.id }, receiver)
	};

	$scope.deleteReceiver = function(receiver){
    if (confirm("Are you sure you want to delete this receiver?")){
      receiver.$remove({ id: receiver.id }, function(){
        $scope.postcards.splice( $scope.postcards.indexOf(receiver), 1 );
      });
    }
	};

  $scope.addToList = function(receiver){
    $scope.receiverList.push(receiver);
  };

  $scope.removeFromList = function(receiver){
    $scope.receiverList.splice( $scope.receiverList.indexOf(receiver), 1 );
  };

  $scope.sendNotification = function(list){
    console.log("TODO");
  };

  $scope.containsObject = function(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (angular.equals(list[i], obj)) {
            return false;
        }
    }
    return true;
  };

});