'use strict';

var auth = require('basic-auth');


// Loads the controller
//
// @app   {Object}    The config
//
function main (config) {

  return {

    isAuth: function(req, res, next) {

      if(!config.auth) {
        return next();
      }

      var user = auth(req);

      if(
        config.auth &&
        user &&
        config.auth.username === user.name &&
        config.auth.password === user.pass
      ) {
        return next();
      }

      res.json(403, { message: 'Permission Denied' });
    }

  };

}

module.exports = main;
