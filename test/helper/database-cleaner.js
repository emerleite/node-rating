require('./test-helper');

var mongoose = require('mongoose');

exports.clean = function () {
  var db = mongoose.createConnection('mongodb://localhost/rating_test'),
  Hit = require('hit').Hit(db),
  Rate = require('rate').Rate(db);
  
  Hit.remove({}, function () {});
  Rate.remove({}, function () {});
}
