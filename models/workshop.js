var mongoose = require('mongoose');


var WorkshopSchema = mongoose.Schema({
  key: String,
  displayName: String,
  url: String,
  keyConcepts: [String]
});

var Workshop = mongoose.model('workshop', WorkshopSchema);

module.exports = Workshop;

