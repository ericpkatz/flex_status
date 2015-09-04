var Promise = require('bluebird');
var mongoose = require('mongoose');

module.exports = {
  connect: connect
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
