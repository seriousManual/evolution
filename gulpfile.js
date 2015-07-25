var express = require('express');
var gulp = require('gulp');
var bower = require('gulp-bower');
var concat = require('gulp-concat');
var rimraf = require('rimraf');
var browserify = require('gulp-browserify');
var sequence = require('run-sequence');
var gutil = require('gulp-util');

var SOURCE_DIR = 'src';
var BUILD_TARGET_DIR = 'build';
var REVEAL_TARGET_DIR = 'presentation/reveal';

gulp.task('clean', function (callback) {
    rimraf(BUILD_TARGET_DIR, function (error) {
        if (error) return callback(error);

        rimraf(REVEAL_TARGET_DIR, callback);
    });
});

////////////////////////////////////////////////////// script //////////////////////////////////////////////////

gulp.task('scripts', function () {
    return gulp
        .src(SOURCE_DIR + '/js/app.js')
        .pipe(browserify()).on('error', gutil.log)
        .pipe(gulp.dest(BUILD_TARGET_DIR));
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
        .pipe(gulp.dest(BUILD_TARGET_DIR));
});

////////////////////////////////////////////////////// presentation //////////////////////////////////////////////////

gulp.task('reveal', ['libscripts'], function () {
    return gulp.src('bower_components/reveal.js/**')
        .pipe(gulp.dest(REVEAL_TARGET_DIR));
});

gulp.task('staticserve', function (callback) {
    var port = 8080;

    express()
        .use(express.static(__dirname))
        .listen(port, function(error) {
            if (error) throw new Error(error);

            console.log('static server running, visit http://localhost:' + port + '/presentation/presentation.html');

            callback();
        });
});

////////////////////////////////////////////////////// manage //////////////////////////////////////////////////

gulp.task('dev', function (callback) {
    build(function () {
        gulp.watch(SOURCE_DIR + '/js/**/*.js', ['scripts']);

        callback();
    });
});

gulp.task('build', function (callback) {
    build(callback);
});

gulp.task('presentation', function (callback) {
    sequence('build', 'staticserve', callback);
});

function build (callback) {
    sequence('clean', ['libscripts', 'scripts', 'reveal'], callback);
}