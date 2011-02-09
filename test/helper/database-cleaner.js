require('./test-helper');

var mongoose = require('mongoose');

exports.clean = function () {
  var db = mongoose.createConnection('mongodb://localhost/rating_test').db;
  db.collections( function (skip, collections) {
    collections.forEach(function (collection) {
      collection.remove({}, function () {});
    });
  });
};
