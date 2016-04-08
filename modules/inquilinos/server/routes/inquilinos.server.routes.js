'use strict';

/**
 * Module dependencies
 */
var inquilinosPolicy = require('../policies/inquilinos.server.policy'),
  inquilinos = require('../controllers/inquilinos.server.controller');

module.exports = function (app) {
  // Inquilinos collection routes
  app.route('/api/inquilinos').all(inquilinosPolicy.isAllowed)
    .get(inquilinos.list)
    .post(inquilinos.create);

  // Single inquilino routes
  app.route('/api/inquilinos/:inquilinoId').all(inquilinosPolicy.isAllowed)
    .get(inquilinos.read)
    .put(inquilinos.update)
    .delete(inquilinos.delete);

  // Finish by binding the inquilino middleware
  app.param('inquilinoId', inquilinos.inquilinoByID);
};
