var express = require("express");
var bodyParser = require('body-parser');
var User = require('./models').User;
var db = require('./config/db');

db.connect()
  .then(function(connection){
    console.log('connected to database ' + connection.name);
  })
  .catch(function(err){
    console.log(err);
  });

if(process.env.SEED)
  db.seed()
    .then(function(results){
      console.log(results);
    });

var Promise = require('bluebird');

var app = express();
app.locals.pretty = true;

app.use(bodyParser.urlencoded({extended: false}));

app.set("view engine", "jade");


app.get('/results', function(req, res){
  User.find()
    .then(function(users){
      res.render('results', { users: users, workshops: User.workshops(), tab: '/results' });
    });
});

app.get('/:id?', function(req, res){
  if(req.params.id)
    User.findById(req.params.id)
      .then(function(user){
          user.password = null;
          res.render('index', { user: user, workshops: User.workshops(), tab: '/', error: req.query.error });
      });
  else
    res.render('index', { user: new User(), workshops: User.workshops(), tab: '/', error: req.query.error });
});

var _user;
app.post('/', function(req, res){
  new Promise(function(resolve, reject){
    if(!req.body.initials)
      reject("Initials are required")
    else
      resolve(req.body.initials);
  })
  .then(function(initials){
    return User.findOne({initials: initials});
  })
  .then(function(user){
    if(!user)
      user = new User(req.body);
    else if(user.password != req.body.password){
      _user = user;
      _user.password = null;
      User.workshops().forEach(function(ws){
        _user[ws] = req.body[ws];
      });
      throw('Bad password');
    }
    else
      User.workshops().forEach(function(ws){
        user[ws] = req.body[ws];
      });
    return user.save();
  })
  .then(function(user){
      res.redirect("/results") 
    })
    .catch(function(ex){
      res.render('index', { user: _user, workshops: User.workshops(), tab: '/', error: ex });
    });
});


var port = process.env.PORT || 3000;

app.listen(port, function(){
  console.log('connected to server on port ' + port);

});

process.on('uncaughtException', function(err){
  if(err.errno == 'EADDRINUSE')
    console.log('PORT ' + port + ' is currently in use ');
  else
    console.log(err);
  process.exit(1);
});

