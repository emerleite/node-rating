require('./helper/test-helper');

var testCase = require('nodeunit').testCase
  , mongoose = require('mongoose')
  , db = mongoose.createConnection('mongodb://localhost/rating_test')
  , Rate = require('rate').Rate(db);

module.exports = testCase({
  setUp: function (callback) {
    callback();
  },
  tearDown: function (callback) {
    Rate.remove({}, function () {});
    callback();
  },
  'It should have correct context, subject and id': function (test) {
    var rate = new Rate();
    rate.context = 'video';
    rate.subject = 'media';
    rate.id = '1234';
    rate.save(function(err) {
      test.strictEqual(err, null);
      test.ok(!rate.isNew);
      test.done();
    });
  }
});
