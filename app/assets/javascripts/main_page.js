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
  $scope.receiverCreateForm = true;
  $scope.receiverEditForm = true;

  $scope.toggleCreate = function() {
    $scope.receiverCreateForm = !$scope.receiverCreateForm;
  };

  $scope.toggleEdit = function(receiver) {
    $scope.receiverEditForm = true;
    $scope.receiverSelected = receiver;
    $scope.receiverEditForm = !$scope.receiverEditForm;
    $scope.receiverFormData = receiver;
  };

	$scope.postcards = Postcards.query();
  $scope.receiverList = [];

	$scope.createReceiver = function() {
	  var receiver = Postcards.save($scope.receiverFormData);
    $scope.postcards.push(receiver);
	  $scope.receiverCreateForm = true;
    return $scope.receiverFormData = {};
	};

	$scope.updateReceiver = function(receiver){
    var receiver = $scope.receiverFormData;
    receiver.$update(receiver);
    $scope.receiverEditForm = true;
    $scope.postcards = Postcards.query();
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

  $scope.addAllToList = function(){
    $scope.receiverList.push(postcards);
  };

  $scope.removeFromList = function(receiver){
    $scope.receiverList.splice( $scope.receiverList.indexOf(receiver), 1 );
  };

  $scope.removeAllFromList = function(){
    $scope.receiverList.splice($scope.receiverList);
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