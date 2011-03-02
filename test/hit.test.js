var testHelper = require('./helper/test-helper')
  , DatabaseCleaner = require('database-cleaner')
  , databaseCleaner = new DatabaseCleaner('mongodb')
  , testCase = require('nodeunit').testCase
  , mongoose = require('mongoose')
  , db = mongoose.createConnection('mongodb://localhost/rating_test')
  , Hit = require('hit').Hit(db);

module.exports = testCase({
  setUp: function (callback) {
    callback();
  },
  tearDown: function (callback) {
    databaseCleaner.clean(mongoose.createConnection('mongodb://localhost/rating_test').db, callback);
  },
  'It should have correct context, subject and id': function (test) {
    var hitData = {context: 'video', subject: 'media', id: '1234', date: testHelper.fakeDate()};
    Hit.hit(hitData, function(err) {
      test.strictEqual(err, null);
      test.done();
    });
  },
  'it should write only one record for the current hour': function (test) {
    var currentHour = testHelper.fakeDate();

    Hit.collection.insert({context: 'video', subject: 'media', id: '1234', date: currentHour}, function (err) {
      Hit.hit({context: 'video', subject: 'media', id: '1234', date: currentHour}, function (err){
        test.ok(!err, "should not raise error");
        Hit.count({context: 'video', subject: 'media', id: '1234', date: currentHour}, function(err, count) {
          test.equal(count, 1, "should have only one record");
          test.done();
        });
      });
    });
  },
  'it should write different records when different hour': function (test) {
    var currentHour = testHelper.fakeDate(10);
    var nextHour = testHelper.fakeDate(11);

    Hit.collection.insert({context: 'video', subject: 'media', id: '1234', date: currentHour}, function (err) {
      Hit.hit({context: 'video', subject: 'media', id: '1234', date: nextHour}, function (err){
        test.ok(!err, "should not raise error");
        Hit.count({context: 'video', subject: 'media', id: '1234'}, function(err, count) {
          test.equal(count, 2, "should have two record");
          test.done();
        });
      });
    });
  },
  'it should increment total when the same hour': function (test) {
    var currentHour = testHelper.fakeDate();

    Hit.collection.insert({context: 'video', subject: 'media', id: '1234', date: currentHour}, function (err) {
      Hit.hit({context: 'video', subject: 'media', id: '1234', date: currentHour}, function (err){
        test.ok(!err, "should not raise error");
        Hit.total({context: 'video', subject: 'media', id: '1234', date: currentHour}, function (err, total) {
          test.equal(total, 2, "should have two record");
          test.done();
        });
      });
    });
  },
  'it should not increment total when the different hour': function (test) {
    var currentHour = testHelper.fakeDate(10);
    var nextHour = testHelper.fakeDate(11);

    Hit.collection.insert({context: 'video', subject: 'media', id: '1234', date: currentHour}, function (err) {
      Hit.hit({context: 'video', subject: 'media', id: '1234', date: nextHour}, function (err){
        test.ok(!err, "should not raise error");
        Hit.total({context: 'video', subject: 'media', id: '1234', date: currentHour}, function (err, total) {
          test.equal(total, 1, "should have two record");
          test.done();
        });
      });
    });
  },
  'it should require date': function(test) {
    var hitData = {context: 'video', subject: 'media', id: '1234'};
    Hit.hit(hitData, function (err) {
      test.ok(err, "should raise validation error");
      test.done();
    });
  }
});
