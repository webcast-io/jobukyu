'use strict';



// Dependencies
//

var connect       = require('connect');
var router        = require('./lib/router');
var mongoose      = require('mongoose');

function createApp(config, mongo) {

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

  // Database connection
  //
  app.db = (mongo) ? mongo : mongoose.connect(config.mongo.url);

  // Models
  //
  if(app.db.models.Job) {
    app.models = {
      job: app.db.models.Job
    };
  } else {
    app.models = {
      job: require('./lib/models/job')(app.db).model
    };
  }

  // Controllers
  //
  app.controllers = {
    jobs: require('./lib/controllers/jobs')(app),
    site: require('./lib/controllers/site')()
  };

  app.use(router(app));

  return app;

}


// Expose the app as the public API
//
module.exports = createApp;