var mongoose = require('mongoose')
  , Hit;

Hit = new mongoose.Schema({
    context: { type: String, index: true}
  , subject: { type: String, index: true}
  , id: { type: String, index: true}
  , date: {type: Date, index:true}
  , total: {type: Number, default: 1}
});
var util = require('util');
Hit.static('hit', function(data, callback) {
    if (!data.date) {
      callback(true);
      return;
    }
    var HitModel = this;
    this.findOne(data, function (err, hit) {
      if (hit) {
        hit.total++;
        hit.save(callback);
      } else {
        hit = new HitModel(data);
        hit.save(callback);
      }
    });
});

Hit.static('total', function (data, callback) {
  this.findOne(data, function (err, hit) { 
      callback(null, hit.total.valueOf()); 
  });
});

mongoose.model('Hit', Hit);
   
exports.Hit = function(db) {
  return db.model('Hit');
}
