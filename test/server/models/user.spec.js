var expect = require('chai').expect;
var db = require('../../../config/db');
var User = require('../../../models').User;

describe('User', function(){
  beforeEach(function(done){
    db.seed()
      .then(function(){
        done();
      });
  });
  it('is defined', function(){
    expect(User).to.be.ok
  });

  describe('seeded data', function(){
    var users;
    beforeEach(function(done){
      User.find({})
        .then(function(_users){
          users = _users;
          done();
        });
    
    });
    it('there is one user', function(){
      expect(users.length).to.equal(1);
    });

    describe('by initials', function(){
      var user;
      beforeEach(function(done){

        User.findByInitials('prof')
          .then(function(_user){
            user = _user;
            done();
          
          });
      
      });

      it('returns user', function(){
        expect(user.initials).to.equal('prof');
      });
    
    });
  });
});
