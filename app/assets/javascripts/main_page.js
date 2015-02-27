var app = angular.module("Postcards", ["ngResource", 'angularUtils.directives.dirPagination']);

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

app.factory("Account", [
  "$resource", function($resource) {
    return $resource('/accounts/:id', {}, {
      show: { method: 'GET', params: {id: '@id'}}
    });
  }
]);

app.factory("Accounts", [
  "$resource", function($resource) {
    return $resource('/accounts', {}, {
      query: {method:'GET', params:{id:''}, isArray:true}
    });
  }
]);

app.controller("PostcardsCtrl", function($scope, $http, $window, Postcards, Accounts, Account) {
  $scope.receiverCreateForm = true;
  $scope.receiverEditForm = true;
  $scope.ownerEditForm = true;

  $scope.orderByField = 'firstName';
  $scope.reverseSort = false;

  $scope.toggleCreate = function() {
    $scope.receiverCreateForm = !$scope.receiverCreateForm;
  };

  $scope.toggleEdit = function(receiver) {
    $scope.receiverSelected = receiver;
    $scope.receiverEditForm = !$scope.receiverEditForm;
    $scope.receiverFormData = receiver;
  };

  $scope.editReceiver = function(idx, receiver){
    $scope.toggleEdit(receiver);
    $scope.postcards.splice(idx, 1);
  };

  $scope.cancelEditReceiver = function(receiver){
    $scope.toggleEdit();
    $scope.postcards.push(receiver);
  };

  $scope.toggleOwnerChange = function() {
    $scope.ownerEditForm = !$scope.ownerEditForm;
  };

  $scope.postcards = Postcards.query();
  $scope.accounts = Accounts.query();
  $scope.receiverList = [];

  $scope.createReceiver = function() {
    var receiver = Postcards.save($scope.receiverFormData);
    $scope.postcards.push(receiver);
    $scope.toggleCreate();
    return $scope.receiverFormData = {};
  };

  $scope.updateReceiver = function(){
    var receiver = $scope.receiverFormData;
    receiver.$update(receiver);
    $scope.postcards.push(receiver);
    $scope.toggleEdit();
    return $scope.receiverFormData = {};
  };

  $scope.deleteReceiver = function(receiver){
    if (confirm("Are you sure you want to delete this receiver?")){
      receiver.$remove({ id: receiver.id }, function(){
        $scope.postcards.splice( $scope.postcards.indexOf(receiver), 1 );
      });
    }
  };

  $scope.updateOwner = function(){
    var ids = $scope.ownerFormData;
    $http.put("/owners/1", ids); // this id is just for testing different http request!!
    $scope.ownerEditForm = true;
    $scope.postcards = Postcards.query();
  };

  $scope.getOwnerConacts = function(id){
    // console.log(id);
    $http.get("/owners", id);
  };

  $scope.addToList = function(receiver){
    $scope.receiverList.push(receiver);
    $scope.postcards.splice( $scope.postcards.indexOf(receiver), 1 );
  };

  $scope.addAllToList = function(){
    $scope.receiverList.push.apply($scope.receiverList, $scope.postcards);
    $scope.postcards.splice($scope.postcards);
  };

  $scope.removeFromList = function(receiver){
    $scope.receiverList.splice( $scope.receiverList.indexOf(receiver), 1 );
    $scope.postcards.push(receiver);
  };

  $scope.removeAllFromList = function(){
    $scope.postcards.push.apply($scope.postcards, $scope.receiverList);
    $scope.receiverList.splice($scope.receiverList);
  };

  $scope.sendNotification = function(list){
    console.log(list)
    var i;
    var receiver_ids = {'receivers' : {}};
    for (i = 0; i < list.length; i++) {
      receiver_ids['receivers'][list[i].id] = list[i].is_birthday || false;
    };
    pdf = Postcards.show({ id: 1, receivers: receiver_ids});
    pdf.$promise.then(function(data){
      $window.open( $window.location.protocol+"//"+$window.location.host+data.link );
    });
  };

  $scope.addBirthdayField = function (receiver){
    receiver.is_birthday = !receiver.is_birthday  
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

  $scope.filterReceivers = function() {
    var dates = $scope.filterDate;
    $scope.postcards = Postcards.query(dates);
  };

  $scope.clearFilter = function() {
    $scope.filterDate.start_date = '';
    $scope.filterDate.end_date = '';
    $scope.postcards = Postcards.query();
  };

  $scope.currentPage = 1;
  $scope.pageSize = 10;

});
