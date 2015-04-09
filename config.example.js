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

if(process.env.MONGO_HOST) {
  var host = process.env.MONGO_HOST;
  var port = process.env.MONGO_PORT || 27017;
  var db = process.env.MONGO_DB || 'jobukyu';
  module.exports.mongo.url = 'mongodb://' + host + ':' + port + '/' + db;
}

if(process.env.MONGO_JSON) {
  var mongoJSON = JSON.parse(process.env.MONGO_JSON);
  var host = processmongoJSON.host || 'localhost';
  var port = processmongoJSON.host || 27017;
  var db = processmongoJSON.host || 'jobukyu';
  module.exports.mongo.url = 'mongodb://' + mongo.host + ':' + mongo.port + '/' + mongo.db;
}

if(process.env.PORT) {
  module.exports.port = process.env.PORT;
}

if(process.env.ETCD_ENDPOINT) {
  var etcd = new (require('node-etcd'))('172.17.42.1', '4001');
  var reply = etcd.getSync("/services/jobukyu/mongo");

  if(reply.body && reply.body.node && reply.body.node.value) {
    var mongo = JSON.parse(reply.body.node.value);
    module.exports.mongo.url = 'mongodb://' + mongo.host + ':' + mongo.port + '/jobukyu';
  } else {
    throw new Error('Unable to get info from etcd');
  }
}
