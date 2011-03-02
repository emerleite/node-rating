var testHelper = require('./helper/test-helper')
  , databaseCleaner = require('database-cleaner')
  , testCase = require('nodeunit').testCase
  , mongoose = require('mongoose')
  , db = mongoose.createConnection('mongodb://localhost/rating_test')
  , Rate = require('rate').Rate(db);

module.exports = testCase({
  setUp: function (callback) {
    callback();
  },
  tearDown: function (callback) {
    databaseCleaner.clean(mongoose.createConnection('mongodb://localhost/rating_test').db, callback);
  },
  // 'It should have correct context, subject and id': function (test) {
  //   var rate = new Rate();
  //   rate.context = 'video';
  //   rate.subject = 'media';
  //   rate.id = '1234';
  //   rate.save(function(err) {
  //     test.strictEqual(err, null);
  //     test.ok(!rate.isNew);
  //     test.done();
  //   });
  // }
  'It should have correct context, subject and id': function (test) {
    var rateData = {context: 'video', subject: 'media', id: '1234', date: testHelper.fakeDate()};
    Rate.rate(rateData, function(err) {
      test.strictEqual(err, null);
      test.done();
    });
  },
  'it should write only one record for the current hour': function (test) {
    var currentHour = testHelper.fakeDate();

    Rate.collection.insert({context: 'video', subject: 'media', id: '1234', date: currentHour}, function (err) {
      Rate.rate({context: 'video', subject: 'media', id: '1234', date: currentHour}, function (err){
        test.ok(!err, "should not raise error");
        Rate.count({context: 'video', subject: 'media', id: '1234', date: currentHour}, function(err, count) {
          test.equal(count, 1, "should have only one record");
          test.done();
        });
      });
    });
  },
  'it should write different records when different hour': function (test) {
    var currentHour = testHelper.fakeDate(10);
    var nextHour = testHelper.fakeDate(11);

    Rate.collection.insert({context: 'video', subject: 'media', id: '1234', date: currentHour}, function (err) {
      Rate.rate({context: 'video', subject: 'media', id: '1234', date: nextHour}, function (err){
        test.ok(!err, "should not raise error");
        Rate.count({context: 'video', subject: 'media', id: '1234'}, function(err, count) {
          test.equal(count, 2, "should have two record");
          test.done();
        });
      });
    });
  },
  'it should increment total when the same hour': function (test) {
    var currentHour = testHelper.fakeDate();

    Rate.collection.insert({context: 'video', subject: 'media', id: '1234', date: currentHour}, function (err) {
      Rate.rate({context: 'video', subject: 'media', id: '1234', date: currentHour}, function (err){
        test.ok(!err, "should not raise error");
        Rate.total({context: 'video', subject: 'media', id: '1234', date: currentHour}, function (err, total) {
          test.equal(total, 2, "should have two record");
          test.done();
        });
      });
    });
  },
  'it should not increment total when the different hour': function (test) {
    var currentHour = testHelper.fakeDate(10);
    var nextHour = testHelper.fakeDate(11);

    Rate.collection.insert({context: 'video', subject: 'media', id: '1234', date: currentHour}, function (err) {
      Rate.rate({context: 'video', subject: 'media', id: '1234', date: nextHour}, function (err){
        test.ok(!err, "should not raise error");
        Rate.total({context: 'video', subject: 'media', id: '1234', date: currentHour}, function (err, total) {
          test.equal(total, 1, "should have two record");
          test.done();
        });
      });
    });
  },
  'it should require date': function(test) {
    var rateData = {context: 'video', subject: 'media', id: '1234'};
    Rate.rate(rateData, function (err) {
      test.ok(err, "should raise validation error");
      test.done();
    });
  }




});
