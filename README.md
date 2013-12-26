jobukyu
=======

A flexible, REST-based job queue. 


Features
---

- Create, modify, and remove jobs via a REST API
- Store arbitrary data in the job
- Transmit data on job updates via Web Hooks

Dependencies
---

* Node.js (0.10+)
* MongoDB (2.4.6+)

Installation and Boot
---

    git clone git@github.com:sc-live/jobukyu.git
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

