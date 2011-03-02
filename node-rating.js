require.paths.unshift('./lib');
var express = require('express')
  , app = express.createServer()
  , db
  , mongoose = require('mongoose');

var currentHour = function() {
  var hour = new Date();
  hour.setMinutes(0);
  hour.setSeconds(0);
  hour.setMilliseconds(0);
  return hour;
};

app.configure(function () {
  app.use(express.cookieDecoder());
  app.use(express.bodyDecoder());
  app.use(express.staticProvider(__dirname + '/public'));
});

app.configure('development', function() {
  app.use(express.logger());
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.set('db-uri', 'mongodb://localhost/rating_development');
});

app.configure('test', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.set('db-uri', 'mongodb://localhost/rating_test');
});

db = mongoose.createConnection(app.set('db-uri'));
app.Hit = require('hit').Hit(db);
app.Rate = require('rate').Rate(db);

app.get('/hit/:context/:subject/:id', function(req, res) {
  var queryData = {
      date: currentHour()
    , context: req.params.context
    , subject: req.params.subject
    , id: req.params.id };

  app.Hit.total(queryData, function (err, count) {
     res.send(count.toString(), 200);
  });

});

app.get('/rate/:context/:subject/:id', function(req, res) {
  var queryData = {
      context: req.params.context
    , subject: req.params.subject
    , id: req.params.id };

  app.Rate.total(queryData, function (err, count) {
     res.send(count.toString(), 200);
  });
});

app.post('/hit/:context/:subject/:id', function(req, res) {
  var hitData = {context: req.params.context, subject: req.params.subject, id: req.params.id, date: currentHour()};
  app.Hit.hit(hitData, function (err) {
    if (err) { res.send(500); res.end(); }
    res.send(200);
  });
});

app.post('/rate/:context/:subject/:id', function(req, res) {
  var cookieName = "rate_" + req.params.context + "_" + req.params.subject + "_" + req.params.id;

  if (cookieName in req.cookies) {
    res.send(400);
    res.end();
  }

  var rateData = {context: req.params.context, subject: req.params.subject, id: req.params.id, date: currentHour()};
  app.Rate.rate(rateData, function (err) {
    if (err) { res.send(500); res.end(); }
    res.cookie(cookieName, "true", { expires: new Date(Date.now() + (1000 * 60 * 60 * 24 * 365)), httpOnly: true });
    res.send(200);
  });
});
module.exports = app;
