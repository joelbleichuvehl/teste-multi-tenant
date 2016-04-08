(function (app) {
  'use strict';

  app.registerModule('inquilinos', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('inquilinos.services');
  app.registerModule('inquilinos.routes', ['ui.router', 'core.routes', 'inquilinos.services']);
}(ApplicationConfiguration));
