var gulp = require('gulp');
var sass = require('gulp-sass');
var bower = require('gulp-bower');

gulp.task('bower', function(){
  return bower();
});

gulp.task('sass', function(){
  gulp.src('assets/styles/**/*.scss')
  .pipe(sass())
  .pipe(gulp.dest('public/styles'));
});

gulp.task('install', ['sass', 'bower'], function(){

});
