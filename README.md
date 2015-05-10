Jobukyu
=======

A flexible, REST-based job queue. 

[![Build Status](https://travis-ci.org/webcast-io/jobukyu.svg?branch=master)](https://travis-ci.org/webcast-io/jobukyu)
[![Coverage Status](https://coveralls.io/repos/webcast-io/jobukyu/badge.svg?branch=master)](https://coveralls.io/r/webcast-io/jobukyu?branch=master)
[![Code Climate](https://codeclimate.com/github/webcast-io/jobukyu.svg)](https://codeclimate.com/github/webcast-io/jobukyu)
[![Codacy Badge](https://www.codacy.com/project/badge/6c6fafd068624d1daf0c7df5b440a1c9)](https://www.codacy.com/public/webcast-io/jobukyu.git)

Features
---

- Create, modify, and remove jobs via a REST API
- Basic authentication
- Store arbitrary data in the job
- Transmit data on job updates via Web Hooks
- Quick start using jobukyu's command line interface

Why Jobukyu?
---

At Axisto Media, we had a requirement to run a processor-intensive task (generating images of slides from a PDF file) on a server separate to those running the web application.

We originally tried Kue, but encountered issues using it, and so decided to create a tool that handled failing jobs gracefully.

In order to cater for the different kind of processor-intensive jobs we handle at Axisto, we created a tool that did not require implicit knowledge of our web application - it simply provided a REST API that the web application could interact with, store any kind of JSON data that we needed the job worker to know, and a way for the Job Queue to communicate the state of those jobs back to the web application.



Dependencies
---

* Node.js (0.10+)
* MongoDB (2.4.6+)

Installation and Boot
---

    git clone git://github.com/webcast-io/jobukyu
    cd jobukyu
    npm install

Then, make a copy of the config.example.js file

    npm run config

... and supply your preferred database credentials and port to run the app on.

Boot the server

    npm start

Usage
---

The Job Queue is accessed via a REST API. There is a single resource called <code>job</code>.

Adding Authentication
---

In your config file add the hash `auth` with elements username and password.

    auth: {
      username: 'CrazyEd',
      password: 'd03sJ0bukyu'
    }

REST API
---

    GET     /jobs                 Lists all of the jobs in the queue, regardless of status
    POST    /jobs                 Creates a job
    GET     /jobs/new             Lists all of the jobs that are yet to be processed
    GET     /jobs/processing      Lists all of the jobs that are being processed
    GET     /jobs/completed       Lists all of the jobs that have completed
    GET     /jobs/failed          Lists all of the jobs that failed
    GET     /jobs/search          Search for jobs based on search criteria
    GET     /jobs/:id             Shows a job's details
    PUT     /jobs/:id             Updates a job
    PUT     /jobs/:id/take        Marks a job's status as 'processing', so that no other workers can take it
    PUT     /jobs/:id/release     Marks a job's status as 'new', so that other workers can take it
    PUT     /jobs/:id/complete    Marks a job's status as 'completed'
    PUT     /jobs/:id/fail        Marks a job's status as 'failed'
    PUT     /jobs/:id/retry       Marks a job's status from 'failed' to 'new'
    DELETE  /jobs/:id             Deletes a job from the queue

CLI
---

The Job Queue can be installed and run from the command line:

Installing npm release:

    $ npm install -g jobukyu

Installing git release:

    $ npm install -g git://github.com/webcast-io/jobukyu

Run using CLI

    $ jobukyu

Run using CLI (with a path to a config file)

    $ jobukyu --config ./my_custom_config.json

Run using CLI (with a default/example config)

    $ jobukyu --default-config

Deployment
----------

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

