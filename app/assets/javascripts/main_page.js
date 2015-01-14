var app = angular.module("Postcards", ["ngResource"]);

app.factory("Postcards", [
  "$resource", function($resource) {
    return $resource('/postcards/:id', {}, {
      query: {method:'GET', params:{id:''}, isArray:true},
      post: {method:'POST'},
      update: {method:'PUT', params: {id: '@id'}},
      remove: {method:'DELETE', params: {id: '@id'}},
      show: {method:'get', params: {id: '@id', receivers: '@receivers'}}
    });
  }
]);

app.controller("PostcardsCtrl", function($scope, Postcards, $window) {
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
    var i;
    var receiver_ids = {};
    for (i = 0; i < list.length; i++) {
      receiver_ids['receiver_'+i] = list[i].id;
    };
    pdf = Postcards.show({ id: 1, receivers: receiver_ids});
    pdf.$promise.then(function(data){
      $window.open( $window.location.protocol+"//"+$window.location.host+data.link );
    });
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