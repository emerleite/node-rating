require('./helper/test-helper');

var testCase = require('nodeunit').testCase,
    mongoose = require('mongoose').Mongoose,
    db = mongoose.connect('mongodb://localhost/rating_test'),
    Rate = require('rate').Rate(db);

module.exports = testCase({
    setUp: function (callback) {
        callback();
    },
    tearDown: function (callback) {
        Rate.remove({}, function () {});
        callback();
    },
    'It should have correct context, subject and id': function (test) {
        var rate = new Rate();
        rate.context = 'video';
        rate.subject = 'media';
        rate.id = '1234';p
        rate.save(function(err,doc) {
            this.rate = rate;
            test.equals (doc.context, 'video');
            test.equals (doc.subject, 'media');
            test.equals (doc.id, '1234');
            test.done();
        });
    }
});
