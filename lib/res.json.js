'use strict';

// Defines support for res.json in controller
// actions
//
// @req   {Object}    The http request object
// @res   {Object}    The http response object
// @next  {Functioroutern}  The function to execute once finished
//
module.exports = function (req,res, next) {

  res.json = function (statusCodeOrBody, body) {
    var status = 200;
    if (typeof statusCodeOrBody === 'number') {
      status = statusCodeOrBody;
    } else {
      body = statusCodeOrBody;
    }
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = status;
    res.end(JSON.stringify(body));
  };
  next();
};