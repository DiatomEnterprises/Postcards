var app = angular.module('Postcards', ['ngResource', 'ngRoute', 'ngTagsInput', 'angularUtils.directives.dirPagination', 'ui.utils', 'toaster']);

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
      update: {method:'PUT', params: {id: '@id'}},
      get_roles: {method:'get', params: {id: 'get_roles'}}
    });
  }
]);

app.controller('AccountsCtrl', ['$scope', '$http', '$window', 'Accounts', 'toaster', function($scope, $http, $window, Accounts, toaster) {
  $scope.accountEditForm = true;
  $scope.accountCreateForm = true;
  $scope.accounts = Accounts.query();
  $scope.roles = Accounts.get_roles();
  $scope.message_time = 3000;

  $scope.accountToggleEdit = function(state, account) {
    if(!state)
      $scope.backup = angular.copy($scope.accounts);
    else $scope.accounts = angular.copy($scope.backup);

    $scope.accountEditForm = state;
    $scope.accountEditFormData = account;
  };

  $scope.accountToggleCreate = function() {
    $scope.accountCreateForm = !$scope.accountCreateForm;
    $scope.accountCreateFormData = {};
  };

  $scope.accountToggleDelete = function(account){
    if (confirm('Are you sure you want to delete this account?')){
      Accounts.remove(account, function(res) {
        $scope.accounts.splice($scope.accounts.indexOf(account), 1);
        toaster.pop('success', '', 'Account removed successfully', $scope.message_time, 'trustedHtml');
      }, function(error) {
        toaster.pop('error', 'Removal error', $scope.getAllErrorMessages(error.data.errors), $scope.message_time, 'trustedHtml');
      });
    }
  };

  $scope.accountUpdate = function(){
    var account = $scope.accountEditFormData;
    var index = $scope.accounts.indexOf(account);
    account.roles = $scope.normalRoles(account.roles);

    Accounts.update(account, function(res) {
      $scope.accounts[index] = res;
      toaster.pop('success', '', 'Account updated successfully', $scope.message_time, 'trustedHtml');
    }, function(error) {
      $scope.accounts = $scope.backup;
      toaster.pop('error', 'Update error', $scope.getAllErrorMessages(error.data.errors), $scope.message_time, 'trustedHtml');
    });

    $scope.accountToggleEdit(true);
  };

  $scope.accountCreate = function() {
    var account = $scope.accountCreateFormData;
    account.roles = $scope.normalRoles(account.roles);

    Accounts.save(account, function(res) {
      $scope.accounts.push(res);
      $scope.accountToggleCreate();
      toaster.pop('success', '', res.email + ' created successfully', $scope.message_time, 'trustedHtml');
    }, function(error) {
      toaster.pop('error', 'Creation error', $scope.getAllErrorMessages(error.data.errors), $scope.message_time, 'trustedHtml');
    });
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

  $scope.formValidations = function(form, data) {
    return form.password_confirmation.$error.validator || !(data && data.roles && data.roles.length > 0);
  };

  $scope.getAllErrorMessages = function(errors) {
    var html = '<ul>'; 
    for(var i = 0; i < errors.length; i++) {
      html = html + '<li>' + errors[i] + '</li>';
    };
    html += '</ul>';
    return html;
  };
}]);

app.controller('PostcardsCtrl', ['$scope', '$http', '$window', 'Postcards', 'Accounts', 'toaster', function($scope, $http, $window, Postcards, Accounts, toaster) {
  $scope.receiverCreateForm = true;
  $scope.receiverEditForm = true;
  $scope.ownerEditForm = true;
  $scope.filterForm = true;
  $scope.message_time = 3000;

  $scope.postcards = Postcards.query();
  $scope.receiverList = [];

  $scope.orderByField = 'firstName';
  $scope.reverseSort = false;

  $scope.receiverToggleEdit = function(state, receiver) {
    if(!state)
      $scope.backup = angular.copy($scope.postcards);
    else $scope.postcards = angular.copy($scope.backup);

    $scope.receiverEditForm = state;
    $scope.receiverEditFormData = receiver;
    if(!state)
      $scope.receiverEditFormData.birthday = $scope.getValidDate();
  };

  $scope.receiverToggleCreate = function() {
    $scope.receiverCreateForm = !$scope.receiverCreateForm;
    $scope.receiverCreateFormData = {};
  };

  $scope.receiverToggleDelete = function(receiver){
    if (confirm('Are you sure you want to delete this receiver?')){
      Postcards.remove(receiver, function(res) {
        $scope.postcards.splice($scope.postcards.indexOf(receiver), 1);
        toaster.pop('success', '', 'Receiver removed successfully', $scope.message_time, 'trustedHtml');
      }, function(error) {
        toaster.pop('error', 'Removal error', $scope.getAllErrorMessages(error.data.errors), $scope.message_time, 'trustedHtml');
      });
    }
  };

  $scope.ownerToggleChange = function() {
    $scope.ownerEditForm = !$scope.ownerEditForm;
  };

  $scope.filterToggleForm = function(){
    $scope.filterForm = !$scope.filterForm;
  };

  $scope.receiverUpdate = function(){
    var receiver = $scope.receiverEditFormData;
    var index = $scope.postcards.indexOf(receiver);

    Postcards.update(receiver, function(res) {
      $scope.postcards[index] = res;
      toaster.pop('success', '', 'Receiver updated successfully', $scope.message_time, 'trustedHtml');
    }, function(error) {
      $scope.postcards = $scope.backup;
      toaster.pop('error', 'Update error', $scope.getAllErrorMessages(error.data.errors), $scope.message_time, 'trustedHtml');
    });

    $scope.receiverToggleEdit(true);
  };

  $scope.receiverCreate = function() {
    var receiver = $scope.receiverCreateFormData;

    Postcards.save(receiver, function(res) {
      $scope.postcards.push(res);
      $scope.receiverToggleCreate();
      toaster.pop('success', '', 'Receiver created successfully', $scope.message_time, 'trustedHtml');
    }, function(error) {
      toaster.pop('error', 'Creation error', $scope.getAllErrorMessages(error.data.errors), $scope.message_time, 'trustedHtml');
    });
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

  $scope.getAllErrorMessages = function(errors) {
    var html = '<ul>'; 
    for(var i = 0; i < errors.length; i++) {
      html = html + '<li>' + errors[i] + '</li>';
    };
    html += '</ul>';
    return html;
  };
}]);
