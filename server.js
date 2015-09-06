var express = require("express");
var bodyParser = require('body-parser');
var User = require('./models').User;
var db = require('./config/db');
var session = require('express-session');
var chalk = require('chalk');
var path = require('path');
var methodOverride = require('method-override');

db.connect()
  .then(function(connection){
    console.log(chalk.green('connected to database ' + connection.name));
  })
  .catch(function(err){
    console.log(chalk.red(err));
  });

if(process.env.SEED)
  db.seed()
    .then(function(results){
      console.log(results);
    });

var Promise = require('bluebird');

var app = express();
app.locals.pretty = true;

app.use(express.static(path.join(__dirname, 'public')));

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: false}));

app.use(session({ 
  secret: process.env.SECRET || 'foo',
  saveUninitialized: false,
  resave: false
}));

app.set("view engine", "jade");

app.use(function(req, res, next){
  if(!req.session._id)
    return next();
  User.findById(req.session._id)
    .then(function(user){
      res.locals.currentUser = user;
      next();
    })
    .catch(function(err){
      console.log(err);
      next(err);
    });
});


app.get('/results', function(req, res){
  User.find()
    .then(function(users){
      res.render('results', { users: users, workshops: User.workshops(), tab: '/results' });
    });
});

app.get('/logout', function(req, res, next){
  req.session._id = null;
  res.redirect('/');
});

app.get('/api/users/:q', function(req, res, next){
  User.find({initials: new RegExp(req.params.q, 'i')})
    .then(function(users){
      var initials = users.map(function(user){
        return user.initials;
      });
      res.send(initials);
    });
});

app.get('/api/user/:initials', function(req, res, next){
  User.findByInitials(req.params.initials)
    .then(function(user){
      user.password = null;
      res.send(user);
    });
});

app.get('/', function(req, res){
  if(res.locals.currentUser){
      res.locals.currentUser.password = null;
      res.render('index', { user: res.locals.currentUser, workshops: User.workshops(), tab: '/', error: req.query.error });
  }
  else
    res.render('index', { user: new User(), workshops: User.workshops(), tab: '/', error: req.query.error });
});

app.delete('/', function(req, res){
  res.locals.currentUser.remove()
    .then(function(){
      res.redirect('/');
    });
});

var _user;
app.post('/', function(req, res){
  if(res.locals.currentUser){
    var currentUser = res.locals.currentUser;
    User.workshops().forEach(function(ws){
      currentUser[ws] = req.body[ws];
    });
    currentUser.save()
      .then(function(){
        res.redirect('/results');
      });
    return;
  }

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
      req.session._id = user._id;
      res.redirect("/results") 
    })
    .catch(function(ex){
      console.log(ex);
      res.render('index', { user: _user || new User(), workshops: User.workshops(), tab: '/', error: ex });
    });
});


var port = process.env.PORT || 3000;

app.listen(port, function(){
  console.log(chalk.green('connected to server on port ' + port));

});

process.on('uncaughtException', function(err){
  if(err.errno == 'EADDRINUSE')
    console.log('PORT ' + port + ' is currently in use ');
  else
    console.log(err);
  process.exit(1);
});

