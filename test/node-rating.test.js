var testHelper = require('./helper/test-helper');

var app = require('../node-rating'),
    testCase = require('nodeunit').testCase;
    databaseCleaner = require('./helper/database-cleaner');

module.exports = testCase({
    setUp: function (callback) {
        app.listen('3000');
        this.requestParams = {
            host: 'localhost',
            port: '3000',
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
        callback();
    },
    'should return 200': function (test) {
        this.requestParams.uri = '/hit/videos/media/123';
        this.requestParams.method = 'POST';

        testHelper.makeRequest(this.requestParams, function(response) {
            test.equals (response.statusCode, 200);
            test.done();
        });
    }
});
