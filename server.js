var express = require("express");
var bodyParser = require('body-parser');
var User = require('./user');
var Promise = require('bluebird');

var app = express();
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
          res.render('index', { user: user, workshops: User.workshops(), tab: '/', error: req.query.error });
      });
  else
    res.render('index', { user: new User(), workshops: User.workshops(), tab: '/', error: req.query.error });
});

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
      res.render('index', { workshops: User.workshops(), tab: '/', error: ex });
    });
});


app.listen(process.env.PORT);
