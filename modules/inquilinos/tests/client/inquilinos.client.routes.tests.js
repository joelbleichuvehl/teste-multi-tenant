(function () {
  'use strict';

  describe('Inquilinos Route Tests', function () {
    // Initialize global variables
    var $scope,
      InquilinosService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _InquilinosService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      InquilinosService = _InquilinosService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('inquilinos');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/inquilinos');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('List Route', function () {
        var liststate;
        beforeEach(inject(function ($state) {
          liststate = $state.get('inquilinos.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have template', function () {
          expect(liststate.templateUrl).toBe('modules/inquilinos/client/views/list-inquilinos.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          InquilinosController,
          mockInquilino;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('inquilinos.view');
          $templateCache.put('modules/inquilinos/client/views/view-inquilino.client.view.html', '');

          // create mock inquilino
          mockInquilino = new InquilinosService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Inquilino about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          InquilinosController = $controller('InquilinosController as vm', {
            $scope: $scope,
            inquilinoResolve: mockInquilino
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:inquilinoId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.inquilinoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            inquilinoId: 1
          })).toEqual('/inquilinos/1');
        }));

        it('should attach an inquilino to the controller scope', function () {
          expect($scope.vm.inquilino._id).toBe(mockInquilino._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/inquilinos/client/views/view-inquilino.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          InquilinosController,
          mockInquilino;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('inquilinos.create');
          $templateCache.put('modules/inquilinos/client/views/form-inquilino.client.view.html', '');

          // create mock inquilino
          mockInquilino = new InquilinosService();

          // Initialize Controller
          InquilinosController = $controller('InquilinosController as vm', {
            $scope: $scope,
            inquilinoResolve: mockInquilino
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.inquilinoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/inquilinos/create');
        }));

        it('should attach an inquilino to the controller scope', function () {
          expect($scope.vm.inquilino._id).toBe(mockInquilino._id);
          expect($scope.vm.inquilino._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/inquilinos/client/views/form-inquilino.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          InquilinosController,
          mockInquilino;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('inquilinos.edit');
          $templateCache.put('modules/inquilinos/client/views/form-inquilino.client.view.html', '');

          // create mock inquilino
          mockInquilino = new InquilinosService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Inquilino about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          InquilinosController = $controller('InquilinosController as vm', {
            $scope: $scope,
            inquilinoResolve: mockInquilino
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:inquilinoId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.inquilinoResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            inquilinoId: 1
          })).toEqual('/inquilinos/1/edit');
        }));

        it('should attach an inquilino to the controller scope', function () {
          expect($scope.vm.inquilino._id).toBe(mockInquilino._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/inquilinos/client/views/form-inquilino.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope) {
          $state.go('inquilinos.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('inquilinos/');
          $rootScope.$digest();

          expect($location.path()).toBe('/inquilinos');
          expect($state.current.templateUrl).toBe('modules/inquilinos/client/views/list-inquilinos.client.view.html');
        }));
      });

    });
  });
}());
