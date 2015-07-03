var gulp = require('gulp');
var concat = require('gulp-concat');
var rimraf = require('rimraf');
var browserify = require('gulp-browserify');
var sequence = require('run-sequence');
var gutil = require('gulp-util');

var SOURCE_DIR = 'src';
var TARGET_DIR = 'build';

gulp.task('clean', function (callback) {
    rimraf(TARGET_DIR, callback);
});

////////////////////////////////////////////////////// script //////////////////////////////////////////////////

gulp.task('scripts', function () {
    return gulp
        .src(SOURCE_DIR + '/evolution.js')
        .pipe(browserify()).on('error', gutil.log)
        .pipe(gulp.dest(TARGET_DIR));
});

gulp.task('libscripts', function () {
    return gulp.src(SOURCE_DIR + '/vendor/**/*.js')
        .pipe(concat('external.js'))
        .pipe(gulp.dest(TARGET_DIR));
});

////////////////////////////////////////////////////// manage //////////////////////////////////////////////////

gulp.task('dev', function (callback) {
    build(function() {
        gulp.watch(SOURCE_DIR + '/**/*.js', ['scripts']);

        callback();
    });
});

gulp.task('build', function (callback) {
    build(callback);
});

function build(callback) {
    sequence('clean', 'libscripts', 'scripts', callback);
}