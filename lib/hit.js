var mongoose = require('mongoose')
  , Hit;

Hit = new mongoose.Schema({
    context: { type: String, index: true}
  , subject: { type: String, index: true}
  , id: { type: String, index: true}
});

mongoose.model('Hit', Hit);
   
exports.Hit = function(db) {
  return db.model('Hit');
}
