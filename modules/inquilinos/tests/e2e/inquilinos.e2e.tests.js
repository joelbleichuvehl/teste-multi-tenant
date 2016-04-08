'use strict';

describe('Inquilinos E2E Tests:', function () {
  describe('Test inquilinos page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/inquilinos');
      expect(element.all(by.repeater('inquilino in inquilinos')).count()).toEqual(0);
    });
  });
});
