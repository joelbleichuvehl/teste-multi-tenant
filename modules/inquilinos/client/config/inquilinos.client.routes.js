(function () {
  'use strict';

  angular
    .module('inquilinos.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('inquilinos', {
        abstract: true,
        url: '/inquilinos',
        template: '<ui-view/>'
      })
      .state('inquilinos.list', {
        url: '',
        templateUrl: 'modules/inquilinos/client/views/list-inquilinos.client.view.html',
        controller: 'InquilinosListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Inquilinos List'
        }
      })
      .state('inquilinos.create', {
        url: '/create',
        templateUrl: 'modules/inquilinos/client/views/form-inquilino.client.view.html',
        controller: 'InquilinosController',
        controllerAs: 'vm',
        resolve: {
          inquilinoResolve: newInquilino
        },
        data: {
          roles: ['root'],
          pageTitle: 'Inquilinos Create'
        }
      })
      .state('inquilinos.edit', {
        url: '/:inquilinoId/edit',
        templateUrl: 'modules/inquilinos/client/views/form-inquilino.client.view.html',
        controller: 'InquilinosController',
        controllerAs: 'vm',
        resolve: {
          inquilinoResolve: getInquilino
        },
        data: {
          roles: ['root'],
          pageTitle: 'Edit Inquilino {{ inquilinoResolve.title }}'
        }
      })
      .state('inquilinos.view', {
        url: '/:inquilinoId',
        templateUrl: 'modules/inquilinos/client/views/view-inquilino.client.view.html',
        controller: 'InquilinosController',
        controllerAs: 'vm',
        resolve: {
          inquilinoResolve: getInquilino
        },
        data: {
          pageTitle: 'Inquilino {{ inquilinoResolve.title }}'
        }
      });
  }

  getInquilino.$inject = ['$stateParams', 'InquilinosService'];

  function getInquilino($stateParams, InquilinosService) {
    return InquilinosService.get({
      inquilinoId: $stateParams.inquilinoId
    }).$promise;
  }

  newInquilino.$inject = ['InquilinosService'];

  function newInquilino(InquilinosService) {
    return new InquilinosService();
  }
}());
