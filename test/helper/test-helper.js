process.env.NODE_ENV = 'test';
var path = require('path')
  , http = require('http');

require.paths.unshift('lib');

exports.makeRequest = function (params, callback) {
  var headers = {'host': params.host +':' + params.port, 'Content-Type': params.headers.contentType, 'Content-length': params.body.length};
  
  if (params.headers.cookie) { headers['Cookie'] = params.headers.cookie; }
  
  var client = http.createClient(params.port, params.host);
  var request = client.request(params.method, params.uri, headers); 
  
  request.on('response', function (response) {
    response.body = '';
    response.on('data', function (chunk) {
      response.body += chunk;
    });
    response.on('end', function () {
      callback.apply(null, [response]);
    });
  });

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

exports.fakeDate = function(hour) {
  var currentHour = new Date();
  currentHour.setMinutes(0);
  currentHour.setSeconds(0);
  currentHour.setMilliseconds(0);
  if (hour) {
    currentHour.setHours(hour);
  }
  return currentHour;
};
