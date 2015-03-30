app.controller('AccountsCtrl', ['$scope', 'Accounts', 'toaster', function($scope, Accounts, toaster) {
  $scope.accountEditForm = true;
  $scope.accountCreateForm = true;
  $scope.accounts = Accounts.query();
  $scope.roles = Accounts.get_roles();
  $scope.notificationTime = 3000;

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

  $scope.accountToggleDelete = function(account) {
    if (confirm('Are you sure you want to delete this account?')) {
      Accounts.remove(account, function(res) {
        $scope.accounts.splice($scope.accounts.indexOf(account), 1);
        $scope.makeNotification('success', '', 'Account removed successfully');
      }, function(error) {
        $scope.makeNotification('error', 'Removal error', error.data.errors);
      });
    }
  };

  $scope.accountUpdate = function() {
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
    var array = [], text = {};
    $scope.roles.roles.map(function(role) { array.push(text['text'] = role) });
    return array;
  };

  $scope.makeNotification = function(type, title, messages) {
    toaster.pop(type, title, $scope.getAllErrorMessages(messages), $scope.notificationTime, 'trustedHtml');
  };

  $scope.getAllErrorMessages = function(errors) {
    if(errors && typeof errors !== 'string')
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