var testHelper = require('./helper/test-helper'),
    app = require('../node-rating'),
    databaseCleaner = require('./helper/database-cleaner'),
    testCase = require('nodeunit').testCase,
    testPort = '3000';

module.exports = testCase({
    setUp: function (callback) {
        app.listen(testPort);
        this.requestParams = {
            host: 'localhost',
            port: testPort,
            method: 'GET',
            body: '',
            headers: {
                contentType: 'text/plain',
            }
        };
        callback();
    },
    tearDown: function (callback) {
        app.close();
        databaseCleaner.clean();
        if (this.hitStub) this.hitStub.restore();
        callback();
    },
    'should return 500 when can not save': function (test) {
        this.hitStub = testHelper.stub(app.Hit, {
	          save: function(callback) {callback.apply(this, [{}, null]);},
        });
        this.requestParams.uri = '/hit/videos/media/123';
        this.requestParams.method = 'POST';

        testHelper.makeRequest(this.requestParams, function(response) {
            test.equals (response.statusCode, 500);
            test.done();
        });
    },
    'should return 200 when can save': function (test) {
        this.requestParams.uri = '/hit/videos/media/123';
        this.requestParams.method = 'POST';

        testHelper.makeRequest(this.requestParams, function(response) {
            test.equals (response.statusCode, 200);
            test.done();
        });
    },
});
