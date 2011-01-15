require.paths.unshift('./lib');
require.paths.unshift('./vendor/mongoose');

var express = require('express'),
    app = express.createServer(),
//    Hit,
    db,
    mongoose = require('mongoose').Mongoose;

app.configure(function () {
    app.use(express.logger());
    app.use(app.router);
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

module.exports = app;
