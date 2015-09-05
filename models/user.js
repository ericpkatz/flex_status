var mongoose = require('mongoose');

// mongoose.connect(process.env.CONN || "mongodb://localhost/flex_status_db"  , function(msg){
// });

var workshopSchema = mongoose.Schema({
  key: String,
  displayName: String,
  keyConcepts: [String]
});


var workshops = [
  "twitterjs",
  "practical_promises",
  "FQL",
  "SQL",
  "twitterSQL",
  "wikistack",
  "promises",
  "shoestring",
  'express_self_assessment',
  'mongoose_express_assessment'
];

var UserSchema = mongoose.Schema({
  initials: { type: String, required: true, unique: true},
  password: { type: String, required: true }
});

UserSchema.statics.findByInitials = function(initials){
  return User.findOne({initials: initials});
}

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
