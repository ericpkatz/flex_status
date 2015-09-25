var gulp = require('gulp');
var sass = require('gulp-sass'); 
var bower = require('gulp-bower');

var WorkshopData = {
  "twitterjs" : {},
  "practical_promises":{},
  "FQL": {},
  "SQL": {},
  "twitterSQL": {},
  "wikistack": {},
  "promises": {},
  "shoestring": {
    url: 'https://learn.fullstackacademy.com/workshop/55d23008b7a9010300b812f5/concepts',
    keyConcepts: [
      'sass can be used to dynamically create style sheets',
      'using sass can lead to much more modular style sheets',
      'a gulp task can be use to compile changing sass files',
      'compiled css files need not be included in a repository'
    ]
  },
  'express_self_assessment': {},
  'mongoose_express_assessment': {},
  'tripplanner_static_ui': {
    url: 'https://learn.fullstackacademy.com/workshop/54ad96ac8143c90b009db942/concepts',
    keyConcepts: [
      'bower can be used to install front end dependencies',
      'bower is for client side libraries while npm is for server side libraries',
      'data can be passed to swig templates'
    ]
  },
  'tripplanner_live_ui': {
    url: 'https://learn.fullstackacademy.com/workshop/54d7ef971a8f780c00b1d741/concepts',
    keyConcepts: [
      'jQuery can be used for finding elements and creating elements',
      'event handlers can only be added to existing elements',
      'By putting event handlers on parent elements, we can avoid putting them on elements created dynamically',
      'In order to keep client side applications in sync, both models and views need to be updated',
      'Within event handlers, this will always point to a DOM element'
    ]
  },
  'tripplanner_persist': {
    url: 'https://learn.fullstackacademy.com/workshop/54d9cf34379abb0c0085b9bf/concepts',
    keyConcepts: [
      'The jQuery library has methods to create AJAX requests',
      'For a CRUD which uses AJAX, we should have at least 4 routes for each model',
      'The following verbs should be represented: get, post, delete, and PUT or PATCH',
      'Although jQuery provides us with many useful classes, it is not a framework which has strong opinions on modularity'
    ]
  
  },
  'angular-intro': {
    url: 'https://learn.fullstackacademy.com/workshop/54dcbc54bc8f2a0c0033c4af/concepts',
    keyConcepts: [
        "A Controllers main role is to provide a scope for the view",
        "The Controller function is instantiated for each use of the controller",
        "The $scope is live. Changes to $scope values change view. Changes to view can change $scope"
    ]
  },
  'angular-factories': {
    url: 'https://learn.fullstackacademy.com/workshop/54e0cd3f2150f80c004007b6/concepts',
    keyConcepts:[
      'Angular factories are singleton objects',
      'They are instantiated the first time they are injected',
      'Since factories are singletons, they can retain state'
    ]
  }
};



gulp.task('bower', function(){
  return bower();
});

gulp.task('seed:workshops', function(){
  var db =require('./config/db'); 
  var User = require('./models').User;
  var Workshop = require('./models').Workshop;
  db.connect()
    .then(function(){
      return Workshop.remove();
    })
    .then(function(){
      var User = require('./models').User;
      return User.workshops(); 
    })
    .then(function(workshops){
      //generate workshops to save
      var promises = workshops.map(function(workshop){
        var ws = new Workshop(WorkshopData[workshop]);
        ws.key = workshop;
        return ws.save();
      });
      return Promise.all(promises); 
    })
    .then(function(results){
      console.log(results);
    })
    .then(function(){
      return db.disconnect();
    })
    .then(function(conn){
      //console.log(conn);
    });

});

gulp.task('sass', function(){
  gulp.src('assets/styles/**/*.scss')
  .pipe(sass())
  .pipe(gulp.dest('public/styles'));
});

gulp.task('watch:sass', ['sass'], function(){
  gulp.watch('assets/styles/**/*.scss', ['sass'], ['sass']);
});

gulp.task('install', ['sass', 'bower', 'seed:workshops'], function(){

});
