require('./helper/test-helper');

//console.log(require.paths);

var testCase = require('nodeunit').testCase,
    mongoose = require('mongoose').Mongoose,
    db = mongoose.connect('mongodb://localhost/rating_test'),
    Hit = require('hit').Hit(db);

module.exports = testCase({
    setUp: function (callback) {
        callback();
    },
    tearDown: function (callback) {
        Hit.remove({}, function () {});
        callback();
    },
    'It should have correct context and id': function (test) {
        var hit = new Hit();
        hit.context = 'video';
        hit.subject = 'media';
        hit.id = '1234';
        hit.save(function(err,doc) {
            this.hit = hit;
            test.equals (doc.context, 'video');
            test.equals (doc.subject, 'media');
            test.equals (doc.id, '1234');
            test.done();
        });
    }
});
