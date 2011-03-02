var mongoose = require('mongoose')
  , Rate;

Rate = new mongoose.Schema({
    context: { type: String, index: true}
  , subject: { type: String, index: true}
  , id: { type: String, index: true}
  , date: {type: Date, index:true}
  , total: {type: Number, default: 1}
});
var util = require('util');
Rate.static('rate', function(data, callback) {
    if (!data.date) {
      callback(true);
      return;
    }
    var RateModel = this;
    this.findOne(data, function (err, rate) {
      if (rate) {
        rate.total++;
        rate.save(callback);
      } else {
        rate = new RateModel(data);
        rate.save(callback);
      }
    });
});

Rate.static('total', function (data, callback) {
  this.findOne(data, function (err, rate) { 
      callback(null, rate.total.valueOf()); 
  });
});

mongoose.model('Rate', Rate);
   
exports.Rate = function(db) {
  return db.model('Rate');
}
