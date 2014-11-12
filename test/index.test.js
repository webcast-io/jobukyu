'use strict';


// Dependencies & config
//
var request   = require('request');
var assert    = require('assert');
var config    = require('../config');
var nock      = require('nock');
var http      = require('http');
var _         = require('lodash');

// The url used for HTTP requests to the API
//
var url = 'http://localhost:' + config.port;



// Create Queue API App for the tests
//
var app = require('../index')(config);



describe('API', function () {

  before(function(done) {
    http.createServer(app).listen(config.port, done);
  });


  describe('GET /jobs', function () {



    describe('when no jobs exist', function () {

      // Clear the database
      //
      beforeEach(function (done) {
        app.models.job.remove({}, done);
      });

      it('should return a list of jobs on the queue, formatted in JSON', function (done) {

        request(url + '/jobs', {json: true}, function (err, res, body) {
          assert.deepEqual([], body);
          assert.equal(200, res.statusCode);
          done(err);
        });

      });

    });



    describe('when jobs exist', function () {



      // Clear the database, then put some jobs in the queue
      // that have attributes that the test checks for
      //
      beforeEach(function (done) {

        // Remove all jobs in the database
        //
        app.models.job.remove({}, function (err) {

          // Raise an error if it occurred
          //
          if (err) { throw err; }

          // Prepare some sample seed data
          //
          var jobSeedData = [
            {name: 'A low priority job'           , type: 'process_pdf', priority: 3},
            {name: 'A high priority job'          , type: 'process_pdf', priority: 10},
            {name: 'A medium priority job'        , type: 'process_pdf', priority: 6},
            {name: 'Another medium priority job'  , type: 'process_pdf', priority: 6}
          ];

          // Will save a job into the database, and call done when the last one is processed
          //
          function processJob (jobSeedData, i) {
            new app.models.job(jobSeedData[i]).save(function(err){
              if (i === jobSeedData.length-1) { done(err); }
            });
          }

          // Loops through each job seed data item, and processes it
          //
          for (var i=0;i<jobSeedData.length;i++) {
            processJob(jobSeedData, i);
          }

        });

      });



      it('should return those jobs by order of priority, then creation date', function (done) {

        request(url + '/jobs', {json: true}, function (err, res, body) {

          assert.equal(4, body.length);
          assert.equal(10, body[0].priority);
          assert.equal(6, body[1].priority);
          assert.equal(6, body[2].priority);
          assert.equal(3, body[3].priority);

          // TODO - check this
          // Check it sorts by created date on a secondary level
          // var secondDate  = new Date(body[1].created_at).getTime();
          // var thirdDate   = new Date(body[2].created_at).getTime();
          // assert(secondDate < thirdDate);
          done(err);

        });

      });

    });

  });



  describe('GET /jobs/new', function () {


    // Wipe the database, then populate with seed data
    //
    beforeEach(function (done) {

      app.models.job.remove({}, function (err) {

        // Raise an error if it occurred
        //
        if (err) { throw err; }

        // Prepare some sample seed data
        //
        var jobSeedData = [
          {name: 'A low priority job'           , type: 'process_pdf', status: 'new',         priority: 3},
          {name: 'A high priority job'          , type: 'process_pdf', status: 'processing'},
          {name: 'A medium priority job'        , type: 'process_pdf', status: 'completed'},
          {name: 'Another medium priority job'  , type: 'process_pdf', status: 'failed'},
          {name: 'Another high priority job'    , type: 'process_pdf', status: 'new',         priority: 10}
        ];

        // Will save a job into the database, and call done when the last one is processed
        //
        function processJob (jobSeedData, i) {
          new app.models.job(jobSeedData[i]).save(function(err){
            if (i === jobSeedData.length-1) { done(err); }
          });
        }

        // Loops through each job seed data item, and processes it
        //
        for (var i=0;i<jobSeedData.length;i++) {
          processJob(jobSeedData, i);
        }

      });

    });



    it('should return a list of jobs in the queue, that have a new status', function (done) {

      request(url + '/jobs/new', {json: true}, function (err, res, body) {

        assert.equal(2, body.length);
        assert.equal('new', body[0].status);
        assert.equal('new', body[1].status);
        done(err);

      });

    });



    it('should return that list by order of priority, then creation date', function (done) {

      request(url + '/jobs/new', {json: true}, function (err, res, body) {

        assert.equal('Another high priority job'  , body[0].name);
        assert.equal('A low priority job'         , body[1].name);
        done(err);

      });

    });

  });



  describe('GET /jobs/processing', function () {


    // Wipe the database, then populate with seed data
    //
    beforeEach(function (done) {

      app.models.job.remove({}, function (err) {

        // Raise an error if it occurred
        //
        if (err) { throw err; }

        // Prepare some sample seed data
        //
        var jobSeedData = [
          {name: 'A low priority job'           , type: 'process_pdf', status: 'processing',         priority: 3},
          {name: 'A high priority job'          , type: 'process_pdf', status: 'new'},
          {name: 'A medium priority job'        , type: 'process_pdf', status: 'completed'},
          {name: 'Another medium priority job'  , type: 'process_pdf', status: 'failed'},
          {name: 'Another high priority job'    , type: 'process_pdf', status: 'processing',         priority: 10}
        ];

        // Will save a job into the database, and call done when the last one is processed
        //
        function processJob (jobSeedData, i) {
          new app.models.job(jobSeedData[i]).save(function(err){
            if (i === jobSeedData.length-1) { done(err); }
          });
        }

        // Loops through each job seed data item, and processes it
        //
        for (var i=0;i<jobSeedData.length;i++) {
          processJob(jobSeedData, i);
        }

      });

    });



    it('should return a list of jobs in the queue, that have a processing status', function (done) {

      request(url + '/jobs/processing', {json: true}, function (err, res, body) {

        assert.equal(2, body.length);
        assert.equal('processing', body[0].status);
        assert.equal('processing', body[1].status);
        done(err);

      });

    });

    it('should return that list by order of priority, then creation date', function (done) {

      request(url + '/jobs/processing', {json: true}, function (err, res, body) {

        assert.equal('Another high priority job'  , body[0].name);
        assert.equal('A low priority job'         , body[1].name);
        done(err);

      });

    });

  });



  describe('GET /jobs/completed', function () {



    // Wipe the database, then populate with seed data
    //
    beforeEach(function (done) {

      app.models.job.remove({}, function (err) {

        // Raise an error if it occurred
        //
        if (err) {throw err;}

        // Prepare some sample seed data
        //
        var jobSeedData = [
          {name: 'A low priority job'           , type: 'process_pdf', status: 'completed',         priority: 3},
          {name: 'A high priority job'          , type: 'process_pdf', status: 'new'},
          {name: 'A medium priority job'        , type: 'process_pdf', status: 'processing'},
          {name: 'Another medium priority job'  , type: 'process_pdf', status: 'failed'},
          {name: 'Another high priority job'    , type: 'process_pdf', status: 'completed',         priority: 10}
        ];

        // Will save a job into the database, and call done when the last one is processed
        //
        function processJob (jobSeedData, i) {
          new app.models.job(jobSeedData[i]).save(function(err){
            if (i === jobSeedData.length-1) { done(err); }
          });
        }

        // Loops through each job seed data item, and processes it
        //
        for (var i=0;i<jobSeedData.length;i++) {
          processJob(jobSeedData, i);
        }

      });

    });


    it('should return a list of jobs in the queue, that have a completed status', function (done) {

      request(url + '/jobs/completed', {json: true}, function (err, res, body) {

        assert.equal(2, body.length);
        assert.equal('completed', body[0].status);
        assert.equal('completed', body[1].status);
        done(err);

      });

    });

    it('should return that list by order of priority, then creation date', function (done) {

      request(url + '/jobs/completed', {json: true}, function (err, res, body) {

        assert.equal('Another high priority job'  , body[0].name);
        assert.equal('A low priority job'         , body[1].name);
        done(err);

      });

    });

  });



  describe('GET /jobs/failed', function () {


    // Wipe the database, then populate with seed data
    //
    beforeEach(function (done) {

      app.models.job.remove({}, function (err) {

        // Raise an error if it occurred
        //
        if (err) {throw err;}

        // Prepare some sample seed data
        //
        var jobSeedData = [
          {name: 'A low priority job'           , type: 'process_pdf', status: 'failed',         priority: 3},
          {name: 'A high priority job'          , type: 'process_pdf', status: 'new'},
          {name: 'A medium priority job'        , type: 'process_pdf', status: 'processing'},
          {name: 'Another medium priority job'  , type: 'process_pdf', status: 'completed'},
          {name: 'Another high priority job'    , type: 'process_pdf', status: 'failed',         priority: 10}
        ];

        // Will save a job into the database, and call done when the last one is processed
        //
        function processJob (jobSeedData, i) {
          new app.models.job(jobSeedData[i]).save(function(err){
            if (i === jobSeedData.length-1) { done(err); }
          });
        }

        // Loops through each job seed data item, and processes it
        //
        for (var i=0;i<jobSeedData.length;i++) {
          processJob(jobSeedData, i);
        }
      });

    });


    it('should return a list of jobs in the queue, that have a failed status', function (done) {

      request(url + '/jobs/failed', {json: true}, function (err, res, body) {

        assert.equal(2, body.length);
        assert.equal('failed', body[0].status);
        assert.equal('failed', body[1].status);
        done(err);

      });

    });

    it('should return that list by order of priority, then creation date', function (done) {

      request(url + '/jobs/failed', {json: true}, function (err, res, body) {

        assert.equal('Another high priority job'  , body[0].name);
        assert.equal('A low priority job'         , body[1].name);
        done(err);

      });

    });

  });



  describe('GET /jobs/search', function () {



    // Wipe the database, then populate with seed data
    //
    beforeEach(function (done) {

      app.models.job.remove({}, function (err) {

        // Raise an error if it occurred
        //
        if (err) {throw err;}

        // Prepare some sample seed data
        //
        var jobSeedData = [
          {name: 'process pdf 1 on dev'       , type: 'process_pdf_development'   , status: 'new'},
          {name: 'process pdf 2 on dev'       , type: 'process_pdf_devlopment'    , status: 'processing'},
          {name: 'process pdf 1 on staging'   , type: 'process_pdf_staging'       , status: 'new'}
        ];

        // Will save a job into the database, and call done when the last one is processed
        //
        function processJob (jobSeedData, i) {
          new app.models.job(jobSeedData[i]).save(function(err){
            if (i === jobSeedData.length-1) { done(err); }
          });
        }

        // Loops through each job seed data item, and processes it
        //
        for (var i=0;i<jobSeedData.length;i++) {
          processJob(jobSeedData, i);
        }

      });

    });



    it('should return a list of jobs in the queue, based on the search criteria', function (done) {

      request(url + '/jobs/search?status=new&type=process_pdf_development', {json: true}, function (err, res, body) {

        assert.equal(1, body.length);
        assert.equal('process pdf 1 on dev'  , body[0].name);
        done(err);

      });

    });

  });



  describe('POST /jobs', function () {



    beforeEach(function (done) {

      // Clear the database
      //
      app.models.job.remove({}, done);

    });


    describe('if successful', function () {

      it('should return the job object, and fire any completed webhooks', function(done) {

        var jobSeedData         = {
          name                : 'An example job for an item',
          type                : 'process_pdf',
          priority            : 5,
          metadata            : {
            item_id           : '39ej29dj92j0d2',
            input             : 'http://my-site-url.com/path-to-results.pdf'
          },
          webhooks            : {
            completed         : [{url: 'http://my-site-url.com/api/items/39ej29dj92j0d2', method: 'PUT'}]
          }

        };

        request.post({url: url + '/jobs', body: {job: jobSeedData}, json: true}, function (err, res, body) {

          assert.equal('new', body.status);
          assert.equal('http://my-site-url.com/path-to-results.pdf', body.metadata.input);
          assert.equal('http://my-site-url.com/api/items/39ej29dj92j0d2', body.webhooks.completed[0].url);
          assert.equal(201, res.statusCode);
          done(err);

        });

      });

    });



    describe('if not successful', function () {

      it('should show an error, explain what went wrong, and fire any failed webhooks');
      // TODO - test when:
      // * name is not provided, or blank
      // * type is not provided, or blank
      // * retries is the wrong type
      // * webhooks is malformed

    });

  });



  describe('GET /jobs/:id', function () {

    var id = null;

    beforeEach(function (done) {

      // Clear the database
      //
      app.models.job.remove({}, function (err) {

        if (err) {throw err;}

        // create a job, based on this seed data
        //
        var jobSeedData         = {
          name                : 'An example job for an item',
          type                : 'process_pdf',
          priority            : 5,
          metadata            : {
            item_id           : '39ej29dj92j0d2',
            input             : 'http://my-site-url.com/path-to-results.pdf'
          }
        };

        var job = new app.models.job(jobSeedData);
        job.save(function (err) {
          id = job.id;
          done(err);
        });

      });

    });



    describe('when the id matches a record', function () {

      it('should return a job object, whose id matches that given in the url', function (done) {

        request(url + '/jobs/' + id, {json: true}, function (err, res, body) {

          assert.equal(id, body._id);
          assert.equal(200, res.statusCode);
          done(err);

        });

      });

    });



    describe('when the id does not match a record', function () {

      it('should inform the person that we cannot find a job with that id');

    });

  });



  describe('PUT /jobs/:id', function () {



    var id = null;



    beforeEach(function (done) {

      // clear the database, then create a job record
      // for it
      app.models.job.remove({}, function (err) {

        if (err) {throw err;}

        var jobSeedData         = {
          name                : 'An example job for an item',
          type                : 'process_pdf',
          priority            : 5,
          metadata            : {
            item_id           : '39ej29dj92j0d2',
            input             : 'http://my-site-url.com/path-to-results.pdf'
          }
        };

        var job = new app.models.job(jobSeedData);
        job.save(function (err) {
          id = job.id;
          done(err);
        });

      });

    });



    describe('when successful', function () {

      it('should return an amended job object, whose id matches that given in the url', function (done) {

        var dataAmendment = {
          name  : 'FR 2013'
        };

        request.put({url: url + '/jobs/' + id, body: {job: dataAmendment}, json: true}, function (err, res, body) {

          assert.equal('FR 2013', body.name);
          assert.equal(201, res.statusCode);
          done(err);

        });



      });

    });



    describe('when not successful', function () {

      it('should show the error, and explain what is wrong');
      // TODO - test when:
      // * name is blank
      // * type is blank
      // * retries is the wrong type
      // * webhooks is malformed

    });

  });



  describe('PUT /jobs/:id/take', function () {



    var id = null;



    beforeEach(function (done) {

      // clear the database, then create a job record
      // for it
      app.models.job.remove({}, function (err) {

        if (err) {throw err;}

        var jobSeedData         = {
          name                : 'An example job for an item',
          type                : 'process_pdf',
          priority            : 5,
          metadata            : {
            item_id           : '39ej29dj92j0d2',
            input             : 'http://my-site-url.com/path-to-results.pdf'
          },
          webhooks            : {
            processing        : [{url:  'http://my-site-url.com/api/items/39ej29dj92j0d2/in_progress', method: 'GET'}]
          }
        };

        var job = new app.models.job(jobSeedData);
        job.save(function (err) {
          id = job.id;
          done(err);
        });

      });

    });



    describe('when successful', function () {



      it('should return the job with the status of processing', function (done) {

        nock('http://my-site-url.com')
        .get('/api/items/39ej29dj92j0d2/in_progress')
        .reply(200, {_id:'39ej29dj92j0d2'});

        request.put({url: url + '/jobs/' + id + '/take', json: true}, function (err, res, body) {

          assert.equal('processing', body.status);
          assert.equal(201, res.statusCode);
          done(err);

        });

      });



      it('should execute any webhooks for the processing state', function (done) {

        var expectedWebhook = nock('http://my-site-url.com')
        .get('/api/items/39ej29dj92j0d2/in_progress')
        .reply(200, {_id:'39ej29dj92j0d2'});

        request.put({url: url + '/jobs/' + id + '/take', json: true}, function (err) {

          setTimeout(function () {
            assert(expectedWebhook.isDone());
            done(err);
          }, 100);

        });
      });

    });



    describe('when not successful', function () {

      it('should show the error, and explain what is wrong');

    });

  });



  describe('PUT /jobs/:id/release', function () {



    var id = null;



    beforeEach(function (done) {

      // clear the database, then create a job record
      // for it
      app.models.job.remove({}, function (err) {

        if (err) {throw err;}

        var jobSeedData         = {
          name                : 'An example job for an item',
          type                : 'process_pdf',
          priority            : 5,
          status              : 'processing',
          metadata            : {
            item_id           : '39ej29dj92j0d2',
            input             : 'http://my-site-url.com/path-to-results.pdf'
          },
          webhooks            : {
            completed         : [{url: 'http://my-site-url.com/api/items/39ej29dj92j0d2', method: 'PUT'}]
          }

        };

        var job = new app.models.job(jobSeedData);
        job.save(function (err) {
          id = job.id;
          done(err);
        });

      });

    });



    describe('when successful', function () {

      it('should return the job with the status of new', function (done) {

        request.put({url: url + '/jobs/' + id + '/release', json: true}, function (err, res, body) {

          assert.equal('new', body.status);
          assert.equal(201, res.statusCode);
          done(err);

        });

      });

    });



    describe('when not successful', function () {

      it('should show the error, and explain what is wrong');

    });

  });



  describe('PUT /jobs/:id/complete', function () {



    var id = null;



    beforeEach(function (done) {

      // clear the database, then create a job record
      // for it
      app.models.job.remove({}, function (err) {

        if (err) {throw err;}

        var jobSeedData         = {
          name                : 'An example job for an item',
          type                : 'process_pdf',
          priority            : 5,
          status              : 'processing',
          metadata            : {
            item_id           : '39ej29dj92j0d2',
            input             : 'http://my-site-url.com/path-to-results.pdf'
          },
          webhooks            : {
            completed         : [{url: 'http://my-site-url.com/api/items/39ej29dj92j0d2', method: 'PUT', data: 'dataToSend'}]
          }

        };

        var job = new app.models.job(jobSeedData);
        job.save(function (err) {
          id = job.id;
          done(err);
        });

      });

    });



    describe('when successful', function () {

      it('should return the amended job with a status of complete, and amended metadata about the complete job', function (done) {

        nock('http://my-site-url.com')
        .put('/api/items/39ej29dj92j0d2')
        .reply(200, {_id:'39ej29dj92j0d2'});

        request.put({url: url + '/jobs/' + id + '/complete', json: true}, function (err, res, body) {

          assert.equal('completed', body.status);
          assert.equal(201, res.statusCode);
          done(err);

        });

      });



      it('should if specified, send scoped metadata to the webhook', function (done) {

        var item = {
          name : 'FX Results 2013',
          url  : 'http://tango.s3.amazonaws.com/items/39ej29dj92j0d2/pdf/fx-results-2013.pdf'
        };

        var job = {
          metadata: {
            dataToSend: {
              item: item
            }
          }
        };


        var expectedWebhook = nock('http://my-site-url.com')
        .put('/api/items/39ej29dj92j0d2', {item: item})
        .reply(201, {_id:'39ej29dj92j0d2'});

        request.put({url: url + '/jobs/' + id + '/complete', body: {job: job}, json: true}, function(err) {

          setTimeout(function () {
            assert(expectedWebhook.isDone());
            done(err);
          }, 100);

        });

      });

    });



    describe('when not successful', function () {

      it('should show the error, and explain what is wrong');

    });

  });



  describe('PUT /jobs/:id/fail', function () {



    var id = null;



    beforeEach(function (done) {

      // clear the database, then create a job record
      // for it
      app.models.job.remove({}, function (err) {

        if (err) {throw err;}

        var jobSeedData         = {
          name                : 'An example job for an item',
          type                : 'process_pdf',
          priority            : 5,
          status              : 'processing',
          metadata            : {
            item_id           : '39ej29dj92j0d2',
            input             : 'http://my-site-url.com/path-to-results.pdf'
          }

        };

        var job = new app.models.job(jobSeedData);
        job.save(function (err) {
          id = job.id;
          done(err);
        });

      });

    });



    describe('when successful', function () {

      it('should return the amended job with a status of failed, and amended metadata about the error', function (done) {

        var metadata = {error: 'File not found'};

        request.put({url: url + '/jobs/' + id + '/fail', body: {job: {metadata: metadata}}, json: true}, function (err, res, body) {

          assert.equal('failed', body.status);
          assert.equal(metadata.error, body.metadata.error);
          assert.equal(201, res.statusCode);
          done(err);

        });

      });

    });



    describe('when not successful', function () {

      it('should show the error, and explain what is wrong');

    });

  });



  describe('PUT /jobs/:id/fail', function () {



    var id = null;



    beforeEach(function (done) {

              // clear the database, then create a job record
              // for it
              app.models.job.remove({}, function (err) {

                if (err) {throw err;}

                var jobSeedData         = {
                  name                : 'An example job for an item',
                  type                : 'process_pdf',
                  priority            : 5,
                  status              : 'processing',
                  metadata            : {
                    item_id           : '39ej29dj92j0d2',
                    input             : 'http://my-site-url.com/path-to-results.pdf'
                  }

                };

                var job = new app.models.job(jobSeedData);
                job.save(function (err) {
                  if (err) { throw err; }
                  id = job.id;
                  app.models.job.fail(id, {}, function (err) {
                    done(err);
                  });
                });

              });

            });



    describe('when successful', function () {

      it('should return the amended job with a status of new', function (done) {

        request.put({url: url + '/jobs/' + id + '/retry', json: true}, function (err, res, body) {

          assert.equal('new', body.status);
          assert.equal(201, res.statusCode);
          done(err);

        });

      });

    });

  });



  describe('DELETE /jobs/:id', function () {



    var id = null;



    beforeEach(function (done) {

      // clear the database, then create a job record
      // for it
      app.models.job.remove({}, function (err) {

        if (err) {throw err;}

        var jobSeedData         = {
          name                : 'An example job for an item',
          type                : 'process_pdf',
          priority            : 5,
          status              : 'processing',
          metadata            : {
            item_id           : '39ej29dj92j0d2',
            input             : 'http://my-site-url.com/path-to-results.pdf'
          }
        };

        var job = new app.models.job(jobSeedData);
        job.save(function (err) {
          id = job.id;
          done(err);
        });

      });

    });



    describe('when successful', function () {

      it('should return the id of the job that was deleted', function (done) {

        request.del({url: url + '/jobs/' + id, json: true}, function (err, res, body) {

          assert.equal(id, body.id);
          assert.equal(200, res.statusCode);

          request.get({url: url + '/jobs', json: true}, function (err, res, body) {
            assert.deepEqual([], body);
            assert.equal(200, res.statusCode);
            done(err);
          });
        });

      });

    });



    describe('when not successful', function () {

      it('should show the error, and explain what is wrong', function (done) {

        // Attempt to delete a job with a malformed, incorrect id

        request.del({url: url + '/jobs/' + '9h87g76f86df', json: true}, function (err, res) {

          assert.equal(422, res.statusCode);
          done(err);
          
        });

      });

    });


  });

  describe('with authentication', function() {

    var authConfig = _.clone(config);
    authConfig.port ++;
    authConfig.auth = {
      username: 'beep',
      password: 'boop'
    };
    var authUrl = 'http://localhost:' + authConfig.port;


    before(function(done) {
      var authApp = require('../index')(authConfig, app.db);
      http.createServer(authApp).listen(authConfig.port, done);
    });

    it('should send a 403 status code if no auth given', function(done) {
      request(authUrl, function(err, res) {
        assert.ifError(err);
        assert.equal(res.statusCode, 403);
        done();
      });
    });

    it('should send a 403 status code if wrong auth given', function(done) {
      request({
        url: authUrl,
        auth: {
          user: 'nouser',
          pass: 'withawrongpass'
        }
      }, function(err, res) {
        assert.ifError(err);
        assert.equal(res.statusCode, 403);
        done();
      });
    });

    it('should send a 200 status code if correct auth given', function(done) {
      request({
        url: authUrl,
        auth: authConfig.auth
      }, function(err, res) {
        assert.ifError(err);
        assert.equal(res.statusCode, 200);
        done();
      });
    });

  });



    describe('deep merging metadata on complete/fail', function() {

    var id = null;

    beforeEach(function (done) {

      // clear the database, then create a job record
      // for it
      app.models.job.remove({}, function (err) {

        if (err) {throw err;}

        var jobSeedData         = {
          name                : 'An example job for an item',
          type                : 'process_pdf',
          priority            : 5,
          status              : 'processing',
          metadata            : {
            cars: { value1: 1, value2: 2 }
          }

        };

        var job = new app.models.job(jobSeedData);
        job.save(function (err) {
          id = job.id;
          done(err);
        });

      });

    });

    it('should overwrite old values when deep merging', function(done) {
      request.put({url: url + '/jobs/' + id + '/complete', json: {
        job: {metadata: {cars: { value2: 3 }}}
      }}, function (err, res, body) {
        assert.equal(3, body.metadata.cars.value2);
        done(err);

      });
    });

  });

});