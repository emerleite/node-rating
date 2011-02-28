require.paths.unshift('./lib');
var express = require('express')
  , app = express.createServer()
  , db
  , mongoose = require('mongoose');

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
      context: req.params.context
    , subject: req.params.subject
    , id: req.params.id };

  app.Hit.count(queryData, function (err, count) {
     res.send(count.toString(), 200);
  });

});

app.get('/rate/:context/:subject/:id', function(req, res) {
  var queryData = {
      context: req.params.context
    , subject: req.params.subject
    , id: req.params.id };

  app.Rate.count(queryData, function (err, count) {
     res.send(count.toString(), 200);
  });
});

app.post('/hit/:context/:subject/:id', function(req, res) {
  var hit = new app.Hit();
  hit.context = req.params.context;
  hit.subject = req.params.subject;
  hit.id = req.params.id;
  hit.save(function(err) {
    if (!err) {
      res.send(200);
    } else {
      res.send(500);
    }
  });
});

app.post('/rate/:context/:subject/:id', function(req, res) {
  var cookieName = "rate_" + req.params.context + "_" + req.params.subject + "_" + req.params.id;

  if (cookieName in req.cookies) {
    res.send(400);
  }

  var rate = new app.Rate();
  rate.context = req.params.context;
  rate.subject = req.params.subject;
  rate.id = req.params.id;
  rate.save(function(err) {
    if (!err) {
      res.cookie(cookieName, "true", { expires: new Date(Date.now() + (1000 * 60 * 60 * 24 * 365)), httpOnly: true });
      res.send(200);
    } else {
      res.send(500);
    }
  });
});
module.exports = app;
