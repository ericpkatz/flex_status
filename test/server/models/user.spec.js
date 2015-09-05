var expect = require('chai').expect;
var db = require('../../../config/db');
var User = require('../../../models').User;
var Promise = require('bluebird');

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
      expect(users.length).to.equal(2);
    });

    describe('by initials', function(){
      var prof, flexor;
      beforeEach(function(done){

        Promise.all([ User.findByInitials('prof'), User.findByInitials('flexor')])
          .then(function(results){
            prof = results[0];
            flexor = results[1];
            done();
          });
      });

      it('prof can be found', function(){
        expect(prof.initials).to.equal('prof');
      });
      it('flexor can be found', function(){
        expect(flexor.initials).to.equal('flexor');
      });
    
    });
  });
});
