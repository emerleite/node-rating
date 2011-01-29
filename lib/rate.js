var mongoose = require('mongoose')
  , Rate;

Rate = new mongoose.Schema({
    context: { type: String, index: true}
  , subject: { type: String, index: true}
  , id: { type: String, index: true}
});

mongoose.model('Rate', Rate);
   
exports.Rate = function(db) {
  return db.model('Rate');
}
