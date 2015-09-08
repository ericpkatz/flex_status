var bcrypt = require('bcrypt');
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
  'mongoose_express_assessment',
  'tripplanner_static_ui'
];

var UserSchema = mongoose.Schema({
  initials: { type: String, required: true, unique: true},
  password: { type: String, required: true },
  hashed: { type: Boolean, default: false }
});

UserSchema.pre('save', function(next){
  if(!this.isNew)
    next();
  var that = this;
  bcrypt.genSalt(10, function(err, salt){
    bcrypt.hash(that.password, salt, function(err, hash){
      that.password = hash;
      that.hashed = true;
      next();
    });
  });
});

UserSchema.statics.findByInitials = function(initials){
  return User.findOne({initials: initials});
}

UserSchema.statics.hashPasswords = function(initials){
  User.find({})
    .then(function(users){
      users.forEach(function(user){
        if(user.hashed !== true){
          bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(user.password, salt, function(err, hash){
              user.password = hash;
              user.hashed = true;
              console.log(user);
              user.save();
            });
          });
        }
      });
    });
}

UserSchema.methods.comparePassword = function(password){
  var that = this;
  return new Promise(function(resolve, reject){
    bcrypt.compare(password, that.password, function(err, res){
      if(res === true)
        return resolve(that);
      reject('bad password');
    });
  });
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
