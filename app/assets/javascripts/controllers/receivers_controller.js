app.controller('ReceiversCtrl', ['$filter', '$scope', '$window', 'Receivers', 'Accounts', 'toaster', function($filter, $scope, $window, Receivers, Accounts, toaster) {

  $scope.receiverCreateForm = true;
  $scope.receiverEditForm = true;
  $scope.receiverFilterForm = true;
  $scope.ownerEditForm = true;
  $scope.dataLoaded = true;
  $scope.notificationTime = 3000;
  $scope.dateFormat = 'MM/dd/yyyy';

  $scope.receiverList = [];
  $scope.receiverListFake = [];
  $scope.receiverListSend = [];
  $scope.templateList = [];
  $scope.receiverListFilter = {};
  $scope.receiverListFilter.itemsPerPage = 10;

  Receivers.query(function(res) {
    $scope.receiverList = angular.copy(res);
    $scope.receiverListFake = angular.copy(res);
    $scope.filterMonthsList();
    $scope.currentPageWatcher();
    $scope.getTemplates();
  }, function(error) {
    $scope.makeNotification('error', 'Loading data error', error.data.errors);
  });

  $scope.receiverToggleEdit = function(state, receiver) {
    if(state == 'open')
      $scope.backup = angular.copy($scope.receiverListFake);
    else if(state == 'close') $scope.receiverListFake = angular.copy($scope.backup);

    $scope.receiverEditForm = state == 'open' ? false : true;
    $scope.receiverEditFormData = receiver;
    if(!$scope.receiverEditForm)
      $scope.receiverEditFormData.birthday = $scope.getValidDate($scope.receiverEditFormData.birthday);
  };

  $scope.receiverToggleCreate = function() {
    $scope.receiverCreateForm = !$scope.receiverCreateForm;
    $scope.receiverCreateFormData = {};
  };

  $scope.receiverToggleDelete = function(receiver) {
    if (confirm('Are you sure you want to delete this receiver?')) {
      Receivers.remove(receiver, function(res) {
        $scope.receiverListFake.splice($scope.receiverListFake.indexOf(receiver), 1);
        $scope.makeNotification('success', '', 'Receiver removed successfully');

        if(receiver == $scope.receiverEditFormData)
          $scope.receiverToggleEdit('delete');
      }, function(error) {
        $scope.makeNotification('error', 'Removal error', error.data.errors);
      });
    }
  };

  $scope.ownerToggleEdit = function() {
    $scope.ownerEditForm = !$scope.ownerEditForm;
  };

  $scope.filterToggleForm = function() {
    $scope.receiverFilterForm = !$scope.receiverFilterForm;
  };

  $scope.receiverUpdate = function() {
    var receiver = angular.copy($scope.receiverEditFormData);
    var index = $scope.receiverList.indexOf(receiver);
    receiver.birthday = new Date(receiver.birthday);

    Receivers.update(receiver, function(res) {
      $scope.receiverList[index] = res;
      $scope.receiverListFake[index] = res;
      $scope.receiverToggleEdit('update');
      $scope.makeNotification('success', '', 'Receiver updated successfully');
    }, function(error) {
      $scope.receiverList = $scope.backup;
      $scope.receiverListFake = $scope.backup;
      $scope.makeNotification('error', 'Update error', error.data.errors);
    });
  };

  $scope.receiverCreate = function() {
    var receiver = angular.copy($scope.receiverCreateFormData);
    receiver.birthday = new Date(receiver.birthday);

    Receivers.save(receiver, function(res) {
      $scope.receiverList.push(res);
      $scope.receiverListFake.push(res);
      $scope.receiverToggleCreate();
      $scope.makeNotification('success', '', 'Receiver created successfully');
    }, function(error) {
      $scope.makeNotification('error', 'Creation error', error.data.errors);
    });
  };

  $scope.ownerUpdate = function() {
    Receivers.update_owners($scope.ownerFormData, function(res) {
      $scope.loadReceivers();
      $scope.ownerToggleEdit();
      $scope.makeNotification('success', '', res.count + ' receivers updated successfully');
    }, function(error) {
      $scope.makeNotification('error', 'Update error', error.data.errors);
    });
  };

// Receiver manipulation
  $scope.addToList = function(receiver) {
    $scope.receiverListSend.push.apply($scope.receiverListSend, [receiver]);
    $scope.receiverListFake.splice( $scope.receiverListFake.indexOf(receiver), 1 );
  };

  $scope.addAllToList = function() {
    $scope.receiverListSend.push.apply($scope.receiverListSend, $scope.receiverListFake);
    $scope.filterList($scope.receiverListFake);
  };

  $scope.addPageToList = function() {
    var page = $scope.receiverListPage;

    $scope.receiverListSend.push.apply($scope.receiverListSend, page);
    $scope.filterList(page);
    $scope.receiverListPage = [];
  };

  $scope.removeFromList = function(receiver) {
    receiver.additional_info = '';
    receiver.additional_show = false;

    $scope.receiverListSend.splice( $scope.receiverListSend.indexOf(receiver), 1 );
    $scope.receiverListFake.push(receiver);
  };

  $scope.removeAllFromList = function() {
    for(var i = 0; i < $scope.receiverListSend.length; i++)
    {
      $scope.receiverListSend[i].additional_show = false;
      $scope.receiverListSend[i].additional_info = '';
    }

    $scope.receiverListFake.push.apply($scope.receiverListFake, $scope.receiverListSend);
    $scope.receiverListSend.splice($scope.receiverListSend);
  };

  $scope.switchAdditionalInfo = function(receiver) {
    receiver.additional_show = !receiver.additional_show;
    for(var i = 0; i < $scope.receiverListSend.length; i++)
    {
      if($scope.receiverListSend[i] != receiver)
        $scope.receiverListSend[i].additional_show = false;
    }
  };

  $scope.additionalInfo = function(receiver) {
    return receiver ? receiver.additional_show : false;
  };

  $scope.checkClosingReceiverList = function() {
    if($scope.receiverListSend.length > 0)
    {
      return true;
    }
    else
    {
      $scope.birthdayPostcard = false;
      return false;
    };
  };

  $scope.sendNotification = function(list) {
    var receiver_data = {};
    for(i = 0; i < list.length; i++) {
      receiver_data['receiver_' + i] = {};
      receiver_data['receiver_' + i]['id'] = list[i].id;
      receiver_data['receiver_' + i]['info'] = list[i].additional_info;
    };

    $scope.templatePostcard = $scope.templateList[0];
    pdf = Receivers.show({ id: 1, receivers: receiver_data, birthday: $scope.birthdayPostcard, template: $scope.templatePostcard});
    pdf.$promise.then(function(data) {
      $window.open( $window.location.protocol+"//"+$window.location.host+data.link );
    });
  };

  $scope.searchingText = function(filtered_list) {
    $scope.receiverListFake = angular.copy(filtered_list);
    if($scope.receiverListSend.length)
      $scope.filterList($scope.receiverListSend);
  };

  $scope.loadReceivers = function(params) {
    Receivers.query(params, function(res) {
      $scope.receiverList = angular.copy(res);
      $scope.receiverListFake = angular.copy(res);
    }, function(error) {
      $scope.makeNotification('error', 'Loading data error', error.data.errors);
    });
  };

// Filter options
  $scope.filterMonthsList = function() {
    var months = [], string = '';
    var year = new Date().getFullYear();

    for(i = 0; i < 12 ; i++) {
      string = ("0" + (i+1)).slice(-2) + " - ";
      months.push(string + $filter('date')(new Date(year, i), 'MMMM'));
    }
    $scope.monthsList = months;
  };

  $scope.filterStartEnd = function() {
    $scope.loadReceivers($scope.filterDate);
  };

  $scope.filterMonth = function() {
    $scope.loadReceivers($scope.filterDate);
  };

  $scope.filterClear = function(type) {
    if(type == 'month')
      delete $scope.filterDate.month;
    else if(type == 'startend')
    {
      delete $scope.filterDate.start_date;
      delete $scope.filterDate.end_date;
    };

    $scope.loadReceivers();
  };

  $scope.filterList = function(list) {
    var index;
    for(i = list.length-1; i >= 0 ; i--) {
      index = $scope.receiverListFake.indexOf(list[i]);
      $scope.receiverListFake.splice(index, 1);
    };
  };

// Some usefull functions
  $scope.receiverChangeEmail = function () {
    var result = $scope.accounts_full.filter(function( obj ) {
      return obj.id == $scope.receiverEditFormData.account_id;
    });

    $scope.receiverEditFormData.email = result[0].email;
  };

  $scope.getValidDate = function (date) {
    if(date)
      return $filter('date')(new Date(date), $scope.dateFormat);
    else return '';
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

  $scope.ownerTooltipInfo = function(receiver) {
    if(receiver.email == 'undefined')
      $scope.ownerTooltip = 'Account has been deleted!';
    else
    {
      if($scope.accounts)
      {
        account = $filter('filter')($scope.accounts, receiver.account_id)[0];
        $scope.ownerTooltip = account.first_name + ' ' + account.last_name; 
      }
      else $scope.ownerTooltip = receiver.email;    
    }
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

  $scope.hasContentLoaded = function() {
    return $scope.dataLoaded == true && $scope.receiverListFake.length > 0;
  };

  $scope.getTemplates = function() {
    Receivers.pdf_templates(function(res) {
      $scope.templateList = angular.copy(res);
      $scope.templatePostcard = $scope.templateList[0];
    }, function(error) {
      $scope.makeNotification('error', 'Loading data error', error.data.errors);
    });
  };

  $scope.currentPageWatcher = function() {
    for(var cs = $scope.$$childHead; cs; cs = cs.$$nextSibling) {
      if(cs.sortedAndPaginatedList) {
        cs.$watch('sortedAndPaginatedList', function(value) {
          $scope.receiverListPage = value;
          $scope.dataLoaded = value.length > 0;
        }, true);
      };
    };
  };
}]);
