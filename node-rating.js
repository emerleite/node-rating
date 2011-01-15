require.paths.unshift(__dirname + '/lib');
require.paths.unshift(__dirname + '/vendor/mongoose');

var express = require('express'),
    app = express.createServer(),
    Hit,
    db,
    mongoose = require('mongoose').Mongoose;

app.configure(function () {
    app.use(express.logger());
    app.use(app.router);
    app.use(express.staticProvider(__dirname + '/public'));
    app.set('db-uri', 'mongodb://localhost/rating');
});

app.configure('test', function() {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.set('db-uri', 'mongodb://localhost/rating_test');
});

db = mongoose.connect(app.set('db-uri'));
app.Hit = Hit = require('hit').Hit(db);

app.post('/hit/:context/:subject/:id', function(req, res) {
    var hit = new Hit();
    hit.context = req.params.context;
    hit.subject = req.params.subject;
    hit.id = req.params.id;
    hit.save(function(err,doc) { 
        res.send(200);
    });
});

module.exports = app;
