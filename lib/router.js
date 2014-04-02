
'use strict';

var connectRoute = require('connect-route');

module.exports = function(app) {

  ////////////////
  /* API routes */
  ////////////////

  return connectRoute(function (router) {

    router.get('/',                     app.controllers.site.index);
    router.get('/jobs',                 app.controllers.jobs.index);
    router.post('/jobs',                app.controllers.jobs.create);
    router.get('/jobs/search',          app.controllers.jobs.search);
    router.get('/jobs/new',             app.controllers.jobs.new);
    router.get('/jobs/processing',      app.controllers.jobs.processing);
    router.get('/jobs/completed',       app.controllers.jobs.completed);
    router.get('/jobs/failed',          app.controllers.jobs.failed);
    router.get('/jobs/:id',             app.controllers.jobs.show);
    router.put('/jobs/:id',             app.controllers.jobs.update);
    router.put('/jobs/:id/take',        app.controllers.jobs.take);
    router.put('/jobs/:id/release',     app.controllers.jobs.release);
    router.put('/jobs/:id/complete',    app.controllers.jobs.complete);
    router.put('/jobs/:id/fail',        app.controllers.jobs.fail);
    router.put('/jobs/:id/retry',       app.controllers.jobs.retry);
    router.delete('/jobs/:id',          app.controllers.jobs.delete);

  });

};