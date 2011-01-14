process.env.NODE_ENV = 'test';

var app = require('../node-rating'),
    http = require('http'),
    testCase = require('nodeunit').testCase;

function makeRequest(params, callback) {
    var client = http.createClient(params.port, params.host);
    var request = client.request(params.method, params.uri, {'host': params.host +':' + params.port, 'Content-Type': params.headers.contentType, 'Content-length': params.body.length}); 
    request.on('response', callback);
    request.end(params.body, 'utf8');
}

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
        callback();
    },
    'should return 200': function (test) {
        this.requestParams.uri = '/hit/videos/media/123';
        this.requestParams.method = 'POST';

        makeRequest(this.requestParams, function(response) {
            test.equals (response.statusCode, 200);
            test.done();
        });
    }
});
