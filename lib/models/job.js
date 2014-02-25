'use strict';



// Dependencies
//
var _           = require('lodash'),
mongoose    = require('mongoose'),
request     = require('request'),
Schema      = mongoose.Schema;



// Processes a webhook by firing a HTTP request for it
//
// @webhook     {Object}    The webhook, consisting of url, http method, and data
// @metadata    {Object}    The job's metadata that will be sent as part of the HTTP request
//
function processWebhook (webhook, metadata) {

  // Scope the metadata to send to the job queue
  //
  if (webhook.data) {
    metadata = metadata[webhook.data];
  }

  switch(webhook.method.toLowerCase())
  {
  case 'post':
    request.post({url: webhook.url, body: metadata, json: true}, function(err) {
      if(err) { console.error(err); }
    });
    break;
  case 'put':
    request.put({url: webhook.url, body: metadata, json: true}, function(err) {
      if(err) { console.error(err); }
    });
    break;
  case 'patch':
    request.del({url: webhook.url, body: metadata, json: true}, function(err) {
      if(err) { console.error(err); }
    });
    break;
  case 'delete':
    request.del({url: webhook.url, json: true}, function(err) {
      if(err) { console.error(err); }
    });
    break;
  // get
  default:
    request(webhook.url, function(err) {
      if(err) { console.error(err); }
    });
  }

}



// Loads the mongoose connection to attach the model to
// 
// @db    {Object}    The mongoose connection 
// 
// return {Object}    The mongoose model and it's schema
//
function main (db) {



  // Define the collection schema
  //
  var schema  = new Schema({
    name            : String,
    type            : String,
    created_at      : {type: Date, default: Date.now},
    retries         : {type: Number, default: 0},
    priority        : {type: Number, default: 0},
    status          : {type: String, default: 'new'},
    metadata        : {},
    webhooks        : {
      processing  : {type: Array, default: []},
      completed   : {type: Array, default: []},
      failed      : {type: Array, default: []}
    }
  });



  // middleware to make HTTP requests to webhooks,
  // based on the status of the job
  //
  schema.post('save', function (job) {

        // Are there any webhooks for this job given it's current status?
        //
        var webhooks = job.webhooks[job.status];
        if (webhooks && webhooks.length > 0) {
          for (var i=0; i<webhooks.length;i++) {
            processWebhook(webhooks[i], job.metadata);
          }
        }

      });



  // Handles the logic for taking a job
  //
  // @id      {String}    The id of the job
  // @cb      {Function}  The function to execute once finished
  //
  schema.statics.take = function (id, cb) {
    this.findOne({_id: id, status: 'new'}, function (err, job) {
      if (err) {
        cb(err, null);
      } else {
        if (job) {
          job.status = 'processing';
          job.save(cb);
        } else {
          cb(null, null);
        }
      }
    });
  };



  // Handles the logic for releasing a job
  //
  // @id      {String}    The id of the job
  // @cb      {Function}  The function to execute once finished
  //
  schema.statics.release = function (id, cb) {
    this.findOne({_id: id, status: 'processing'}, function (err, job) {
      if (err) {
        cb(err, null);
      } else {
        if (job) {
          job.status = 'new';
          job.save(cb);
        } else {
          cb(null, null);
        }
      }
    });
  };



  // Handles the logic for completing a job
  //
  // @id          {String}    The id of the job
  // @metadata    {Object}    The job metadata to merge    
  // @cb          {Function}  The function to execute once finished
  //
  schema.statics.complete = function (id, metadata, cb) {
    this.findOne({_id: id, status: 'processing'}, function (err, job) {
      if (err) {
        cb(err, null);
      } else {
        if (job) {
          if (metadata) {
            job.metadata = _.merge(metadata, job.metadata);
          }
          job.status = 'completed';
          job.save(cb);
        } else {
          cb(null, null);
        }
      }
    });
  };



  // Handles the logic for failing a job
  //
  // @id          {String}    The id of the job
  // @metadata    {Object}    The job metadata to merge    
  // @cb          {Function}  The function to execute once finished
  //
  schema.statics.fail = function (id, metadata, cb) {
    this.findOne({_id: id, status: 'processing'}, function (err, job) {
      if (err) {
        cb(err, null);
      } else {
        if (job) {
          if (metadata) {
            job.metadata = _.merge(metadata, job.metadata);
          }
          job.status = 'failed';
          job.save(cb);
        } else {
          cb(null, null);
        }
      }
    });
  };



  // Handles the logic for retrying a job
  //
  // @id          {String}    The id of the job
  // @cb          {Function}  The function to execute once finished
  //
  schema.statics.retry = function (id, cb) {
    this.findOne({_id: id, status: 'failed'}, function (err, job) {
      if (err) {
        cb(err, null);
      } else {
        if (job) {
          job.status = 'new';
          job.save(cb);
        } else {
          cb(null,null);
        }
      }
    });
  };



  // Define the mongoose model
  //
  var model   = db.model('Job', schema);



  // Return the model and schema
  //
  return {
    schema  : schema,
    model   : model
  };
}



// Expose the public API
//
module.exports = main;