var gulp = require('gulp');
var sass = require('gulp-sass'); 
var bower = require('gulp-bower');
var nodemon = require('gulp-nodemon');

var WorkshopData = {
  "data_structures": {
    url: 'https://learn.fullstackacademy.com/workshop/54aaa4f403dc870b00bd761f/concepts',
    keyConcepts: []
  },
  "sorting": {
    url: 'https://learn.fullstackacademy.com/workshop/54aaadadf54d7d0b0042d510/concepts',
    keyConcepts: []
  },
  "game_of_life": {
    url: 'https://learn.fullstackacademy.com/workshop/54aaa7a603dc870b00bd765a/concepts',
    keyConcepts: []
  },
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
  },
  'angular-directives': {
    url: 'https://learn.fullstackacademy.com/workshop/54e3d2ae3804d30c00ba04ce/concepts.',
    keyConcepts: [
      'A callback function for registering a directive needs to return a directive definition',
      'Directives enable reusability of user interface code.',
      'The first step in creating a directive is to move the desired html to a template and to create a directive with shared scope.',
      'For the sake of reusability directives should have isolate scope, this will result in less dependencies.',
      'Directives are named in camel case but used in hyphen case.'
    
    ]
  },
  'angular-ngModel-forms': {
    url: 'https://learn.fullstackacademy.com/workshop/552329c1c5d4410300eedb61/concepts',
    keyConcepts: []
  }

};



gulp.task('bower', function(){
  return bower();
});

gulp.task('seed:workshops', function(){
  var db =require('./config/db'); 
  var User = require('./models').User;
  var Workshop = require('./models').Workshop;
  return db.connect()
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
  return gulp.src('assets/styles/**/*.scss')
  .pipe(sass())
  .pipe(gulp.dest('public/styles'));
});

gulp.task('watch:sass', ['sass'], function(){
  gulp.watch('assets/styles/**/*.scss', ['sass'], ['sass']);
});

gulp.task('install', ['sass', 'bower', 'seed:workshops'], function(){

});

gulp.task('server:dev', ['install', 'watch:sass' ], function(){
  nodemon({
    script: 'server.js'
  });
});
