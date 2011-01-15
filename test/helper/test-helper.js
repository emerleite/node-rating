process.env.NODE_ENV = 'test';
var path = require('path');
var http = require('http');

require.paths.unshift('lib');
require.paths.unshift('vendor/mongoose');

exports.makeRequest = function (params, callback) {
    var client = http.createClient(params.port, params.host);
    var request = client.request(params.method, params.uri, {'host': params.host +':' + params.port, 'Content-Type': params.headers.contentType, 'Content-length': params.body.length}); 
    request.on('response', callback);
    request.end(params.body, 'utf8');
};

