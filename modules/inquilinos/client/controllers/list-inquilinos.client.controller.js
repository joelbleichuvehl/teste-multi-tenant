(function () {
  'use strict';

  angular
    .module('inquilinos')
    .controller('InquilinosListController', InquilinosListController);

  InquilinosListController.$inject = ['InquilinosService', 'Authentication'];

  function InquilinosListController(InquilinosService, Authentication) {
    var vm = this;

    vm.inquilinos = InquilinosService.query();
    vm.authentication = Authentication;
  }
}());
