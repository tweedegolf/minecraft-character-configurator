var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var browserify = require('browserify');
var watchify = require('watchify');

var b = browserify({
  entries: './js/app.js',
  paths: ['./node_modules'],
  debug: true
});

gulp.task("default", function () {
  return gulp.src("js/*.js")
    .pipe(sourcemaps.init())
    .pipe(babel({
        presets: ['es2015', 'react']
    }))
    .pipe(concat("app.js"))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("build"));
});