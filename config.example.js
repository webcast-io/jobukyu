'use strict';



// The configuration data, grouped by environment
//
var config = {



  development: {

    port: 3800,
    mongo: {
      url: 'mongodb://localhost/jobukyu_development'
    },
    log: true

  },



  test: {

    port: 3800,
    mongo: {
      url: 'mongodb://localhost/jobukyu_test'
    },
    log: false
  }



};



// Get the NODE environment
//
var env = process.env.NODE_ENV || 'development';



// Expose the public API
//
module.exports = config[env];