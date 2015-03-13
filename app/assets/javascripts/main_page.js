var app = angular.module('Postcards', ['ngResource', 'ngRoute', 'ngTagsInput', 'angularUtils.directives.dirPagination']);

app.config(function($routeProvider, $locationProvider) {
  // $locationProvider.html5Mode(true);
  $routeProvider
    .when('/', {
      templateUrl : 'postcards/index.html',
      controller  : 'PostcardsCtrl'
    })

    .when('/postcards', {
      templateUrl : 'postcards/index.html',
      controller  : 'PostcardsCtrl'
    })

    .when('/accounts', {
      templateUrl : 'accounts/index.html',
      controller  : 'AccountsCtrl'
    });
});

app.factory('Postcards', [
  '$resource', function($resource) {
    return $resource('/postcards/:id.json', {}, {
      query: {method:'GET', params:{id:''}, isArray:true},
      post: {method:'POST'},
      update: {method:'PUT', params: {id: '@id'}},
      remove: {method:'DELETE', params: {id: '@id'}},
      show: {method:'GET', params: {id: '@id', receivers: '@receivers', birthday: '@birthday'}}
    });
  }
]);

app.factory('Accounts', [
  '$resource', function($resource) {
    return $resource('/accounts/:id.json', {}, {
      query: {method:'GET', params:{id:''}, isArray:true},
      post: {method:'POST'},
      update: {method:'PUT', params: {id: '@id'}},
      remove: {method:'DELETE', params: {id: '@id'}},
      get_roles: {method:'get', params: {id: 'get_roles'}}
    });
  }
]);

app.controller('AccountsCtrl', ['$scope', '$http', '$window', 'Accounts', function($scope, $http, $window, Accounts) {
  $scope.accountEditForm = true;
  $scope.accountCreateForm = true;
  $scope.roleCreateForm = true;
  $scope.accounts = Accounts.query();
  $scope.roles = Accounts.get_roles();

  $scope.accountToggleEdit = function(state, account) {
    $scope.accountEditForm = state;
    $scope.accountEditFormData = account;
  };

  $scope.accountToggleCreate = function() {
    $scope.accountCreateForm = !$scope.accountCreateForm;
    $scope.accountCreateFormData = {};
  };

  $scope.accountToggleDelete = function(account){
    if (confirm('Are you sure you want to delete this account?')){
      account.$remove({ id: account.id }, function(){
        $scope.accounts.splice($scope.accounts.indexOf(account), 1);
      });
    }
  };

  $scope.accountUpdate = function(){
    var account = $scope.accountEditFormData;
    account.roles = angular.toJson($scope.normalRoles(account.roles));
    account.$update(account);
    $scope.accountToggleEdit(true, account);
    return $scope.accountEditFormData = {};
  };

  $scope.accountCreate = function() {
    $scope.accountCreateFormData.roles = $scope.normalRoles($scope.accountCreateFormData.roles);
    var account = Accounts.save($scope.accountCreateFormData);
    $scope.accounts.push(account);
    $scope.accountToggleCreate();
  };

  $scope.normalRoles = function(roles) {
    if(Object.prototype.toString.call(roles[0]) == '[object Object]')
      return roles.map(function(role) { return role.text; });
    else return roles;
  };

  $scope.textRoles = function() {
    array = [], text = {};
    $scope.roles.roles.map(function(role) { array.push(text['text'] = role) });
    return array;
  };
}]);

app.controller('PostcardsCtrl', ['$scope', '$http', '$window', 'Postcards', 'Accounts', function($scope, $http, $window, Postcards, Accounts) {
  $scope.receiverCreateForm = true;
  $scope.receiverEditForm = true;
  $scope.ownerEditForm = true;
  $scope.filterForm = true;

  $scope.orderByField = 'firstName';
  $scope.reverseSort = false;

  $scope.toggleCreate = function() {
    $scope.receiverCreateForm = !$scope.receiverCreateForm;
    $scope.receiverCreateFormData = {};
  };

  $scope.toggleEdit = function(state, receiver) {
    $scope.receiverEditForm = state;
    $scope.receiverEditFormData = receiver;
    $scope.receiverEditFormData.birthday = $scope.getValidDate()
  };

  $scope.toggleOwnerChange = function() {
    $scope.ownerEditForm = !$scope.ownerEditForm;
  };

  $scope.toggleFilterForm = function(){
    $scope.filterForm = !$scope.filterForm;
  };

  $scope.postcards = Postcards.query();
  $scope.receiverList = [];

  $scope.createReceiver = function() {
    var receiver = Postcards.save($scope.receiverCreateFormData);
    $scope.postcards.push(receiver);
    $scope.toggleCreate();
    return $scope.receiverCreateFormData = {};
  };

  $scope.updateReceiver = function(){
    var receiver = $scope.receiverEditFormData;
    receiver.$update(receiver);
    $scope.toggleEdit(true, receiver);
    return $scope.receiverEditFormData = {};
  };

  $scope.deleteReceiver = function(receiver){
    if (confirm('Are you sure you want to delete this receiver?')){
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
    $scope.receiverList.push.apply($scope.receiverList, $scope.filteredList);
    $scope.filterList();
  };

  $scope.removeFromList = function(receiver){
    $scope.receiverList.splice( $scope.receiverList.indexOf(receiver), 1 );
    $scope.postcards.push(receiver);
  };

  $scope.removeAllFromList = function(){
    $scope.postcards.push.apply($scope.postcards, $scope.receiverList);
    $scope.receiverList.splice($scope.receiverList);
  };

  $scope.checkClosingReceiverList = function(){
    if($scope.receiverList.length > 0)
    {
      return true;
    }
    else
    {
      $scope.birthdayPostcard = false;
      return false;
    };
  };

  $scope.sendNotification = function(list){
    var receiver_ids = {};
    for (i = 0; i < list.length; i++) {
      receiver_ids['receiver_' + i] = list[i].id;
    };

    pdf = Postcards.show({ id: 1, receivers: receiver_ids, birthday: $scope.birthdayPostcard});
    pdf.$promise.then(function(data){
      $window.open( $window.location.protocol+"//"+$window.location.host+data.link );
    });
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

  $scope.filterList = function() {
    var index;
    for (i = $scope.filteredList.length; i >= 0 ; i--) {
      index = $scope.postcards.indexOf($scope.filteredList[i]);
      $scope.postcards.splice(index, 1);
    };
  };

  $scope.getValidDate = function () {
    return new Date($scope.receiverEditFormData.birthday);
  };

  $scope.getAccounts = function () {
    $scope.accounts = Accounts.query();
  };

  $scope.months = [
    {key: "1", value: "01 - Jan"},
    {key: "2", value: "02 - Feb"},
    {key: "3", value: "03 - Mar"},
    {key: "4", value: "04 - Apr"},
    {key: "5", value: "05 - May"},
    {key: "6", value: "06 - Jun"},
    {key: "7", value: "07 - Jul"},
    {key: "8", value: "08 - Aug"},
    {key: "9", value: "09 - Sep"},
    {key: "10", value: "10 - Oct"},
    {key: "11", value: "11 - Nov"},
    {key: "12", value: "12 - Dec"}
  ];

  $scope.getBds = function() {
    var month = $scope.filterBd;
    $scope.postcards = Postcards.query(month);
  };

  $scope.clearBds = function() {
    $scope.filterBd.month = '';
    $scope.postcards = Postcards.query();
  };

}]);
