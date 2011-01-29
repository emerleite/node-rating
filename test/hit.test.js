require('./helper/test-helper');

var testCase = require('nodeunit').testCase
  , mongoose = require('mongoose')
  , db = mongoose.createConnection('mongodb://localhost/rating_test')
  , Hit = require('hit').Hit(db);

//console.log(require('sys').inspect(mongoose));

module.exports = testCase({
  setUp: function (callback) {
    callback();
  },
  tearDown: function (callback) {
    Hit.remove({}, function () {});
    callback();
  },
  'It should have correct context, subject and id': function (test) {
    var hitData = {context: 'video', subject: 'media', id: '1234'};
    var hit = new Hit(hitData);
    hit.save(function(err) {
      test.strictEqual(err, null);
      test.ok(!hit.isNew);
      test.done();
    });
  }
});
