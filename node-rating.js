require.paths.unshift('./lib');
require.paths.unshift('./vendor/mongoose');

var express = require('express'),
    app = express.createServer(),
    db,
    mongoose = require('mongoose').Mongoose;

app.configure(function () {
    app.use(express.logger());
    app.use(express.cookieDecoder());
    app.use(express.bodyDecoder());
    app.use(express.staticProvider(__dirname + '/public'));
});

app.configure('development', function() {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.set('db-uri', 'mongodb://localhost/rating_development');
});

app.configure('test', function() {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.set('db-uri', 'mongodb://localhost/rating_test');
});

db = mongoose.connect(app.set('db-uri'));
app.Hit = require('hit').Hit(db);
app.Rate = require('rate').Rate(db);

app.post('/hit/:context/:subject/:id', function(req, res) {
    var hit = new app.Hit();
    hit.context = req.params.context;
    hit.subject = req.params.subject;
    hit.id = req.params.id;
    hit.save(function(err,doc) {
        if (!err) {
            res.send(200);
        } else {
            res.send(500);
        }
    });
});

app.post('/rate/:context/:subject/:id', function(req, res) {
    var cookie_name = "rate_" + req.params.context + "_" + req.params.subject + "_" + req.params.id;

    if (cookie_name in req.cookies) { 
        res.send(400);
    }

    var rate = new app.Rate();
    rate.context = req.params.context;
    rate.subject = req.params.subject;
    rate.id = req.params.id;
    rate.save(function(err,doc) {
        if (!err) {
            res.cookie(cookie_name, "true", { expires: new Date(Date.now() + (1000 * 60 * 60 * 24 * 365)), httpOnly: true });
            res.send(200);
        } else {
            res.send(500);
        }
    });
});
module.exports = app;
