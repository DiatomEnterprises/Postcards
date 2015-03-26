var app = angular.module('Postcards', ['ngResource', 'ngRoute', 'ngTagsInput', 'angularUtils.directives.dirPagination', 'toaster']);

app.factory('Postcards', [
  '$resource', function($resource) {
    return $resource('/postcards/:id.json', {}, {
      update: {method:'PUT', params: {id: '@id'}},
      update_owners: {method:'PUT', params: {id: 'update_owners'}},
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
    if(state == 'open')
      $scope.backup = angular.copy($scope.accounts);
    else if(state == 'close') $scope.accounts = angular.copy($scope.backup);

    $scope.accountEditForm = state == 'open' ? false : true;
    $scope.accountEditFormData = account;
    if($scope.accountEditFormData)
    {
      $scope.accountEditFormData.password = '';
      $scope.accountEditFormData.password_confirmation = '';
    }
  };

  $scope.accountToggleCreate = function() {
    $scope.accountCreateForm = !$scope.accountCreateForm;
    $scope.accountCreateFormData = {};
  };

  $scope.accountToggleDelete = function(account){
    if (confirm('Are you sure you want to delete this account?')){
      Accounts.remove(account, function(res) {
        $scope.accounts.splice($scope.accounts.indexOf(account), 1);
        $scope.makeNotification('success', '', 'Account removed successfully');
      }, function(error) {
        $scope.makeNotification('error', 'Removal error', error.data.errors);
      });
    }
  };

  $scope.accountUpdate = function(){
    if($scope.accountEditFormData.password == '')
      delete $scope.accountEditFormData.password;

    if($scope.accountEditFormData.password_confirmation == '')
      delete $scope.accountEditFormData.password_confirmation;

    var account = $scope.accountEditFormData;
    var index = $scope.accounts.indexOf(account);
    account.roles = $scope.normalRoles(account.roles);

    Accounts.update(account, function(res) {
      $scope.accounts[index] = res;
      $scope.accountToggleEdit('update');
      $scope.makeNotification('success', '', 'Account updated successfully');
    }, function(error) {
      $scope.accounts = $scope.backup;
      $scope.makeNotification('error', 'Update error', error.data.errors);
    });
  };

  $scope.accountCreate = function() {
    var account = $scope.accountCreateFormData;
    account.roles = $scope.normalRoles(account.roles);

    Accounts.save(account, function(res) {
      $scope.accounts.push(res);
      $scope.accountToggleCreate();
      $scope.makeNotification('success', '', res.email + ' created successfully');
    }, function(error) {
      $scope.makeNotification('error', 'Creation error', error.data.errors);
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

  $scope.makeNotification = function(type, title, messages) {
    toaster.pop(type, title, $scope.getAllErrorMessages(messages), $scope.message_time, 'trustedHtml');
  };

  $scope.getAllErrorMessages = function(errors) {
    if(typeof errors !== 'string')
    {
      var html = '<ul>'; 
      for(var i = 0; i < errors.length; i++) {
        html = html + '<li>' + errors[i] + '</li>';
      };
      html += '</ul>';
      return html;
    }
    else return errors;
  };

  $scope.validatePassword = function(form_data) {
    if(form_data)
      return form_data.password != form_data.password_confirmation;
    else return false;
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
    if(state == 'open')
      $scope.backup = angular.copy($scope.postcards);
    else if(state == 'close') $scope.postcards = angular.copy($scope.backup);

    $scope.receiverEditForm = state == 'open' ? false : true;
    $scope.receiverEditFormData = receiver;
    if(!$scope.receiverEditForm)
      $scope.receiverEditFormData.birthday = $scope.getValidDate();
  };

  $scope.receiverToggleCreate = function() {
    $scope.receiverCreateForm = !$scope.receiverCreateForm;
    $scope.receiverCreateFormData = {};
  };

  $scope.receiverToggleDelete = function(receiver) {
    if (confirm('Are you sure you want to delete this receiver?')){
      Postcards.remove(receiver, function(res) {
        $scope.postcards.splice($scope.postcards.indexOf(receiver), 1);
        $scope.makeNotification('success', '', 'Receiver removed successfully');
      }, function(error) {
        $scope.makeNotification('error', 'Removal error', error.data.errors);
      });
    }
  };

  $scope.ownerToggleEdit = function() {
    $scope.ownerEditForm = !$scope.ownerEditForm;
  };

  $scope.filterToggleForm = function() {
    $scope.filterForm = !$scope.filterForm;
  };

  $scope.receiverUpdate = function() {
    var receiver = $scope.receiverEditFormData;
    var index = $scope.postcards.indexOf(receiver);

    Postcards.update(receiver, function(res) {
      $scope.postcards[index] = res;
      $scope.receiverToggleEdit('update');
      $scope.makeNotification('success', '', 'Receiver updated successfully');
    }, function(error) {
      $scope.postcards = $scope.backup;
      $scope.makeNotification('error', 'Update error', error.data.errors);
    });
  };

  $scope.receiverCreate = function() {
    var receiver = $scope.receiverCreateFormData;

    Postcards.save(receiver, function(res) {
      $scope.postcards.push(res);
      $scope.receiverToggleCreate();
      $scope.makeNotification('success', '', 'Receiver created successfully');
    }, function(error) {
      $scope.makeNotification('error', 'Creation error', error.data.errors);
    });
  };

  $scope.ownerUpdate = function() {
    Postcards.update_owners($scope.ownerFormData, function(res) {
      $scope.postcards = Postcards.query();
      $scope.ownerToggleEdit();
      $scope.makeNotification('success', '', res.count + ' receivers updated successfully');
    }, function(error) {
      $scope.makeNotification('error', 'Update error', error.data.errors);
    });
  };

// Receiver manipulation
  $scope.addToList = function(receiver) {
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

// Filter options
  $scope.currentPage = 1;
  $scope.pageSize = 10;
  $scope.months = [
    {key: '1', value: '01 - Jan'},
    {key: '2', value: '02 - Feb'},
    {key: '3', value: '03 - Mar'},
    {key: '4', value: '04 - Apr'},
    {key: '5', value: '05 - May'},
    {key: '6', value: '06 - Jun'},
    {key: '7', value: '07 - Jul'},
    {key: '8', value: '08 - Aug'},
    {key: '9', value: '09 - Sep'},
    {key: '10', value: '10 - Oct'},
    {key: '11', value: '11 - Nov'},
    {key: '12', value: '12 - Dec'}
  ];

  $scope.filterStartEnd = function() {
    $scope.postcards = Postcards.query($scope.filterDate);
  };

  $scope.filterMonth = function() {
    $scope.postcards = Postcards.query($scope.filterDate);
  };

  $scope.filterClear = function(type) {
    if(type == 'month')
      delete $scope.filterDate.month;
    else if(type == 'startend')
    {
      delete $scope.filterDate.start_date;
      delete $scope.filterDate.end_date;
    };

    $scope.postcards = Postcards.query();
  };

  $scope.filterList = function() {
    var index;
    for (i = $scope.filteredList.length; i >= 0 ; i--) {
      index = $scope.postcards.indexOf($scope.filteredList[i]);
      $scope.postcards.splice(index, 1);
    };
  };

// Some usefull functions
  $scope.receiverChangeEmail = function () {
    var result = $scope.accounts_full.filter(function( obj ) {
      return obj.id == $scope.receiverEditFormData.account_id;
    });
    $scope.receiverEditFormData.email = result[0].email;
  };

  $scope.getValidDate = function () {
    return new Date($scope.receiverEditFormData.birthday);
  };

  $scope.getAccounts = function () {
    Accounts.query(function(res) {
      $scope.accounts = angular.copy(res);
      $scope.accounts_full = angular.copy(res);
      $scope.accounts_full.push({id: 0, email: 'undefined'});
    }, function(error) {
      $scope.makeNotification('error', 'Getting accounts error', error.data.errors);
    });
  };

  $scope.ownerTooltipInfo = function(email) {
    if(email == 'undefined')
      return 'Account has been deleted!';
    else return email;    
  };

  $scope.makeNotification = function(type, title, messages) {
    toaster.pop(type, title, $scope.getAllErrorMessages(messages), $scope.message_time, 'trustedHtml');
  };

  $scope.getAllErrorMessages = function(errors) {
    if(typeof errors !== 'string')
    {
      var html = '<ul>'; 
      for(var i = 0; i < errors.length; i++) {
        html = html + '<li>' + errors[i] + '</li>';
      };
      html += '</ul>';
      return html;
    }
    else return errors;
  };
}]);
