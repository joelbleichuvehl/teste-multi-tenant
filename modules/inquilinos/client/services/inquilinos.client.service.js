(function () {
  'use strict';

  angular
    .module('inquilinos.services')
    .factory('InquilinosService', InquilinosService);

  InquilinosService.$inject = ['$resource'];

  function InquilinosService($resource) {
    return $resource('api/inquilinos/:inquilinoId', {
      inquilinoId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
