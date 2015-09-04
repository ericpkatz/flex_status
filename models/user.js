var mongoose = require('mongoose');

// mongoose.connect(process.env.CONN || "mongodb://localhost/flex_status_db"  , function(msg){
// });

var workshops = [
  "twitterjs",
  "practical promises",
  "FQL",
  "SQL",
  "twitterSQL",
  "wikistack",
  "promises",
  "shoestring",
  'express self assessment',
  'mongoose express assessment'
];

var UserSchema = mongoose.Schema({
  initials: { type: String, required: true, unique: true},
  password: { type: String, required: true }
});

workshops.forEach(function(ws){
  var obj = {};
  obj[ws] = { type: Number, required: true, default: 0 };
  UserSchema.add(obj);
});

UserSchema.statics.workshops = function(){
  return workshops;
}

var User = mongoose.model("user", UserSchema);

module.exports = User;