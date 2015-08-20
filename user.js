var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/flex_status_db" || process.env.CONN, function(msg){
  console.log(msg);
});

var workshops = [
  "twitterjs",
  "FQL",
  "SQL",
  "twitterSQL",
  "wikistack"
];

var UserSchema = mongoose.Schema({
  initials: { type: String, required: true, unique: true}
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
