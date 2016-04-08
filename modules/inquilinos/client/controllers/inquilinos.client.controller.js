(function () {
  'use strict';

  angular
    .module('inquilinos')
    .controller('InquilinosController', InquilinosController);

  InquilinosController.$inject = ['$scope', '$state', 'inquilinoResolve', '$window', 'Authentication'];

  function InquilinosController($scope, $state, inquilino, $window, Authentication) {
    var vm = this;

    vm.inquilino = inquilino;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    // Remove existing Inquilino
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.inquilino.$remove($state.go('inquilinos.list'));
      }
    }

    // Save Inquilino
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.inquilinoForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.inquilino._id) {
        vm.inquilino.$update(successCallback, errorCallback);
      } else {
        vm.inquilino.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('inquilinos.view', {
          inquilinoId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
