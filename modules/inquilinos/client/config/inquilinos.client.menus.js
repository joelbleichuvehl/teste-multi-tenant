(function () {
  'use strict';

  angular
    .module('inquilinos')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Inquilinos',
      state: 'inquilinos',
      type: 'dropdown',
      roles: ['root']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'inquilinos', {
      title: 'List Inquilinos',
      state: 'inquilinos.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'inquilinos', {
      title: 'Create Inquilino',
      state: 'inquilinos.create',
      roles: ['root']
    });
  }
}());
