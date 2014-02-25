'use strict';



// Dependencies
//
var fs = require('fs');



// Used to hold cache data for the html views,
// so that we don't execute fs.readFile multiple times
//
var cache = {};



// Reads a file from the cache, unless 
//
// @path  {String}    The path to the html file
// @cb    {Function}  The function to execute once finished
//
function readFileFromCache (path, cb) {
  if (cache[path]) {
    cb(null, cache[path]);
  } else {
    fs.readFile(path, function(err, data) {
      if (err) {
        cb(err, null);
      } else {
        cache[path] = data;
        cb(err, data);
      }
    });
  }
}



// Loads the controller
//
function main () {

  return {

    // GET /
    //
    index: function (req,res) {
      console.log();
      readFileFromCache(__dirname + '/../views/site/index.html', function(err, data){
        if (err) {
          res.json(500, err);
        } else {
          res.setHeader('Content-Type', 'text/html');
          res.statusCode = 200;
          res.end(data);
        }
      });
    }
  };
}



// Exposes the public API
//
module.exports = main;