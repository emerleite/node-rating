process.env.NODE_ENV = 'test';
var path = require('path');
var http = require('http');

require.paths.unshift('lib');
require.paths.unshift('vendor/mongoose');

exports.makeRequest = function (params, callback) {
    var headers = {'host': params.host +':' + params.port, 'Content-Type': params.headers.contentType, 'Content-length': params.body.length};

    if (params.headers.cookie) { headers['Cookie'] = params.headers.cookie; }

    var client = http.createClient(params.port, params.host);
    var request = client.request(params.method, params.uri, headers); 

    request.on('response', callback);
    request.end(params.body, 'utf8');
};

exports.stub = function (target, fn) {
    var originalPrototype = target.prototype;
    target.prototype = fn;
    return {
        restore: function () {
            target.prototype = originalPrototype;
        }
    };
};
