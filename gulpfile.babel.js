'use strict';

import gulp from 'gulp';
import gutil from 'gulp-util';
import gulpif from 'gulp-if';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
import yargs from 'yargs';
import livereload from 'gulp-livereload';
import babel from "gulp-babel";
import sourcemaps from "gulp-sourcemaps";

const source = {
  js: [
    'src/websocket_rails.0.0.1.min.js',
    'node_modules/js-cookie/src/js.cookie.js',
    'src/detect-browser.js',
    'src/plugin.js'
  ]
}

gulp.task('js', function() {

  let isProduction = (yargs.argv.production === undefined) ? false : true;

  gulp.src(source.js)
    .pipe(sourcemaps.init())
    .pipe(babel({
      ignore: [
        'src/websocket_rails.0.0.1.min.js'
      ]
    }))
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
