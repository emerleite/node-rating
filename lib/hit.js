require.paths.unshift('vendor/mongoose');
var mongoose = require('mongoose').Mongoose;

mongoose.model('Hit', {
  properties: ['context', 'subject', 'id'],
  indexes: ['context', 'subject', 'id']
});
   
exports.Hit = function(db) {
  return db.model('Hit');
}
