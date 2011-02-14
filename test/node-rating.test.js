var testHelper = require('./helper/test-helper')
  , app = require('../node-rating')
  , mongoose = require('mongoose')
  , databaseCleaner = require('database-cleaner')
  , testCase = require('nodeunit').testCase
  , testPort = '3000';

module.exports = testCase({
  setUp: function (callback) {
    app.listen(testPort);
      this.requestParams = {
        host: 'localhost'
      , port: testPort
      , method: 'GET'
      , body: ''
      , headers: {
          contentType: 'text/plain'
      }
    };
    callback();
  },
  tearDown: function (callback) {
    app.close();
    databaseCleaner.clean(mongoose.createConnection('mongodb://localhost/rating_test').db);
    if (this.hitStub) this.hitStub.restore();
    if (this.rateStub) this.rateStub.restore();
    debugger;
    callback();
  },
  'should return 500 when can not hit': function (test) {
    this.hitStub = testHelper.stub(app.Hit, {
      save: function(callback) {callback.apply(this, [{}, null]);}
    });
    this.requestParams.uri = '/hit/videos/media/123';
    this.requestParams.method = 'POST';

    testHelper.makeRequest(this.requestParams, function(response) {
      test.equals (response.statusCode, 500);
      test.done();
    });
  },
  'should return 200 when hit': function (test) {
    this.requestParams.uri = '/hit/videos/media/123';
    this.requestParams.method = 'POST';
    
    testHelper.makeRequest(this.requestParams, function(response) {
      test.equals (response.statusCode, 200);
      test.done();
    });
  },
  'should return 200 when rate': function(test) {
    this.requestParams.uri = '/rate/videos/media/123';
    this.requestParams.method = 'POST';

    testHelper.makeRequest(this.requestParams, function(response) {
      test.equals (response.statusCode, 200);
      var regexp_cookie = /rate_videos_media_123=true/;
      test.ok(regexp_cookie.test(response.headers['set-cookie']));
      test.done();
    });
  },
  'should return 400 when rate more than 1 time': function(test) {
    this.requestParams.uri = '/rate/videos/media/123';
    this.requestParams.method = 'POST';
    this.requestParams.headers.cookie = 'rate_videos_media_123=rate';

    testHelper.makeRequest(this.requestParams, function(response) {
      test.equals (response.statusCode, 400);
      test.done();
    });
  },
  'should return 500 when can not rate': function (test) {
    this.rateStub = testHelper.stub(app.Rate, {
      save: function(callback) {callback.apply(this, [{}, null]);}
    });
    this.requestParams.uri = '/rate/videos/media/123';
    this.requestParams.method = 'POST';

    testHelper.makeRequest(this.requestParams, function(response) {
      test.equals (response.statusCode, 500);
      test.done();
    });
  },
  'should get hit count given an element': function(test) {
    var requestParams = this.requestParams;
    requestParams.uri = '/hit/videos/media/123';
    requestParams.method = 'POST';

    testHelper.makeRequest(requestParams, function(response) {
      testHelper.makeRequest(requestParams, function(response) {
        requestParams.method = 'GET';
        testHelper.makeRequest(requestParams, function(response) {
          test.equals (response.body, '2');
          test.done();
        });
      });
    });
  },
  'should get thumbs up count given an element': function(test) {
    var requestParams = this.requestParams;
    requestParams.uri = '/rate/videos/media/123';
    requestParams.method = 'POST';

    testHelper.makeRequest(requestParams, function(response) {
      testHelper.makeRequest(requestParams, function(response) {
        requestParams.method = 'GET';
        testHelper.makeRequest(requestParams, function(response) {
          test.equals (response.body, '2');
          test.done();
        });
      });
    });
  }
});
