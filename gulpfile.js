var gulp = require('gulp');
var gutil = require('gulp-util');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var argv = require('yargs').argv;
var livereload = require('gulp-livereload');
var babel = require("gulp-babel");
var sourcemaps = require("gulp-sourcemaps");

var source = {
  js: [
    'node_modules/js-cookie/src/js.cookie.js',
    'src/plugin.js'
  ]
}

gulp.task('js', function() {

  var isProduction = (argv.production === undefined) ? false : true;

  gulp.src(source.js)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(concat('latest.js'))
    .pipe(gulpif(isProduction,uglify({ mangle: true })))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest('dist'))
    .pipe(livereload());

});

gulp.task('default', function () {
  livereload.listen();
  gulp.watch(['src/*.js'], ['js']);
});
