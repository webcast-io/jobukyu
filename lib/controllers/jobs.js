'use strict';



// Loads the controller
//
// @app   {Object}    The connectjs application instance
//
function main (app) {

  return {


    // GET /jobs
    //
    index: function (req,res) {
      app.models.job
      .find({})
      .sort('-priority')
      .exec(function (err, jobs){
        res.json(jobs);
      });
    },

    // POST /jobs
    //
    create: function (req,res) {
      var job = new app.models.job(req.body.job);
      job.save(function (err) {
        if (err) {
          res.json(422, err);
        } else {
          res.json(201, job);
        }
      });
    },



    // GET /jobs/search
    //
    search: function (req,res) {
      app.models.job
      .find(req.query)
      .sort('-priority')
      .exec(function (err, jobs){
        if (err) {
          res.json(422, err);
        } else {
          res.json(jobs);
        }
      });
    },



    // GET /jobs/new
    //
    new: function (req,res) {
      app.models.job
      .find({status: 'new'})
      .sort('-priority')
      .exec(function (err, jobs){
        res.json(jobs);
      });
    },



    // GET /jobs/processing
    //
    processing: function (req,res) {
      app.models.job
      .find({status: 'processing'})
      .sort('-priority')
      .exec(function (err, jobs){
        res.json(jobs);
      });
    },



    // GET /jobs/completed
    //
    completed: function (req,res) {
      app.models.job
      .find({status: 'completed'})
      .sort('-priority')
      .exec(function (err, jobs){
        res.json(jobs);
      });
    },



    // GET /jobs/failed
    //
    failed: function (req,res) {
      app.models.job
      .find({status: 'failed'})
      .sort('-priority')
      .exec(function (err, jobs){
        res.json(jobs);
      });
    },



    // GET /jobs/:id
    //
    show: function (req,res) {
      app.models.job
      .findOne({_id: req.params.id})
      .exec(function (err, job) {
        if (err) {
          res.json(422, err);
        } else {
          if (job) {
            res.json(job);
          } else {
            res.json(404, {message: 'Job not found with id ' + req.params.id});
          }
        }
      });
    },



    // PUT /jobs/:id
    //
    update: function (req,res) {
      app.models.job
      .findOneAndUpdate({_id: req.params.id}, req.body.job, {}, function (err, job) {
        if (err) {
          res.json(422, err);
        } else {
          if (job) {
            res.json(201, job);
          } else {
            res.json(404, {message: 'Job not found with id ' + req.params.id});
          }
        }
      });
    },



    // PUT /jobs/:id/take
    //
    take: function (req,res) {
      app.models.job.take(req.params.id, function(err, job){
        if (err) {
          res.json(422, err);
        } else {
          if (job) {
            res.json(201, job);
          } else {
            res.json(404, {message: 'Job not found with id ' + req.params.id + ' and that is available to take'});
          }
        }
      });
    },



    // PUT /jobs/:id/release
    //
    release: function (req,res) {
      app.models.job.release(req.params.id, function(err, job){
        if (err) {
          res.json(422, err);
        } else {
          if (job) {
            res.json(201, job);
          } else {
            res.json(404, {message: 'Job not found with id ' + req.params.id + ' and that is available to release'});
          }
        }
      });
    },



    // PUT /jobs/:id/complete
    //
    complete: function (req,res) {
      var metadata = {};
      if (req.body.job && req.body.job.metadata) {
        metadata = req.body.job.metadata;
      }
      app.models.job.complete(req.params.id, metadata, function(err, job){
        if (err) {
          res.json(422, err);
        } else {
          if (job) {
            res.json(201, job);
          } else {
            res.json(404, {message: 'Job not found with id ' + req.params.id + ' and that can be marked as completed'});
          }
        }
      });
    },



    // PUT /jobs/:id/fail
    //
    fail: function (req,res) {
      var metadata = {};
      if (req.body.job && req.body.job.metadata) {
        metadata = req.body.job.metadata;
      }
      app.models.job.fail(req.params.id, metadata, function (err, job){
        if (err) {
          res.json(422, err);
        } else {
          if (job) {
            res.json(201, job);
          } else {
            res.json(404, {message: 'Job not found with id ' + req.params.id + ' and that can be marked as failed'});
          }
        }
      });
    },



    retry: function (req, res) {
      app.models.job.retry(req.params.id, function (err, job) {
        if (err) {
          res.json(422, err);
        } else {
          if (job) {
            res.json(201, job);
          } else {
            res.json(404, {message: 'Job not found with id ' + req.params.id + ' and that can be retried'});
          }
        }
      });
    },



    // DELETE /jobs/:id
    //
    delete: function (req,res) {
      var id = req.params.id;
      app.models.job.findByIdAndRemove(id, {}, function (err) {
        if (err) {
          res.json(422, err);
        } else {
          res.json(200, {id: id});
        }
      });
    }
  };
}



// Exposes the public API
//
module.exports = main;