require.paths.unshift('vendor/mongoose');
var mongoose = require('mongoose').Mongoose;

mongoose.model('Rate', {
  properties: ['context', 'subject', 'id'],
  indexes: ['context', 'subject', 'id']
});
   
exports.Rate = function(db) {
  return db.model('Rate');
}
