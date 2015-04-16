var app = angular.module('Postcards', ['ngResource', 'ngRoute', 'ngTagsInput', 'toaster', 'angular-table', '720kb.datepicker', 'monospaced.elastic']);

app.factory('Receivers', [
  '$resource', function($resource) {
    return $resource('/receivers/:id.json', {}, {
      update: {method:'PUT', params: {id: '@id'}},
      update_owners: {method:'PUT', params: {id: 'update_owners'}},
      show: {method:'GET', params: {id: '@id', receivers: '@receivers', birthday: '@birthday'}},
      pdf_templates: {method:'GET', params: {id: 'pdf_templates'}, isArray: true}
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
