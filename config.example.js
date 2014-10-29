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
  },

  docker: {
    port: 3800,
    mongo: {
      url: 'mongodb://' + process.env.MONGO_1_PORT_27017_TCP_ADDR + ':' + process.env.MONGO_1_PORT_27017_TCP_PORT + '/jobukyu_docker'
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

// Overwrite for Heroku Instances

if(process.env.MONGOHQ_URL) {
  module.exports.mongo.url = process.env.MONGOHQ_URL;
}