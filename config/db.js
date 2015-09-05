var Promise = require('bluebird');
var mongoose = require('mongoose');
var User = require('../models').User;

module.exports = {
  connect: connect,
  seed: seed
};

var _promise;
function connect(){
  if(_promise)
    return _promise;
  _promise = new Promise(function(resolve, reject){
    var conn = process.env.CONN || 'mongodb://localhost/flex_status_db';
    mongoose.connect(conn, function(err){
      if(err)
        return reject('unable to connect to database with CONN ' + conn);
      resolve(mongoose.connection);
    });
  });
  return _promise;
  
}

function seed(){
  var prof =  new User({initials: 'prof', password: 'pw'});
  var flexor =  new User({initials: 'flexor', password: 'flex'});
  return this.connect()
    .then(function(){
      return Promise.all([User.remove({})])
    })
    .then(function(){
      return Promise.all([prof.save(), flexor.save()]);
    })
    .catch(function(err){
      console.log(err);
    });
}
