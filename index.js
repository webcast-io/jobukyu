'use strict';



// Dependencies
//

var http          = require('http');
var path          = require('path');
var connect       = require('connect');
var connectRoute  = require('connect-route');
var mongoose      = require('mongoose');

var configPath = path.resolve(process.env.JOBUKYU_CONFIG_PATH || './config'), config;
try {
  config = require(process.env.JOBUKYU_CONFIG_PATH || './config');
} catch (e) {
  console.error('Unable to open config module/file ' + configPath);
  process.exit(1);
}


// App
//
var app = connect();



// Use the logger if environment config allows
//
if (config.log) {
  app.use(connect.logger('dev'));
}



// Append connect middleware
//
app.use(connect.query());
app.use(connect.json());



// Defines support for res.json in controller
// actions
//
// @req   {Object}    The http request object
// @res   {Object}    The http response object
// @next  {Function}  The function to execute once finished
//
app.use(function (req,res, next) {
  res.json = function (statusCodeOrBody, body) {
    var status = 200;
    if (typeof statusCodeOrBody === 'number') {
      status = statusCodeOrBody;
    } else {
      body = statusCodeOrBody;
    }
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = status;
    res.end(JSON.stringify(body));
  };
  next();
});



// Database connection
//
app.db = mongoose.connect(config.mongo.url);



// Models
//
app.models = {
  job: require('./lib/models/job')(app.db).model
};



// Controllers
//
app.controllers = {
  jobs: require('./lib/controllers/jobs')(app),
  site: require('./lib/controllers/site')(),
  auth: require('./lib/controllers/auth')(config)
};



////////////////
/* API routes */
////////////////

app.use(app.controllers.auth.isAuth);

app.use(connectRoute(function (router) {

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

}));



// Start the server
//
http.createServer(app).listen(config.port, function(){
  console.log('Jobukyu is listening on port', config.port);
});



// Expose the app as the public API
//
module.exports = app;