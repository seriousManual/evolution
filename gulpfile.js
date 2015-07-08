var gulp = require('gulp');
var bower = require('gulp-bower');
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
        .src(SOURCE_DIR + '/js/app.js')
        .pipe(browserify()).on('error', gutil.log)
        .pipe(gulp.dest(TARGET_DIR));
});

gulp.task('bower_components', function () {
    return bower();
});

gulp.task('libscripts', ['bower_components'], function () {
    return gulp.src([
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/fabric/dist/fabric.min.js'
    ])
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(TARGET_DIR));
});

////////////////////////////////////////////////////// manage //////////////////////////////////////////////////

gulp.task('dev', function (callback) {
    build(function() {
        gulp.watch(SOURCE_DIR + '/js/**/*.js', ['scripts']);

        callback();
    });
});

gulp.task('build', function (callback) {
    build(callback);
});

function build(callback) {
    sequence('clean', ['libscripts', 'scripts'], callback);
}