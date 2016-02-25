'use strict';

// Requires
var gulp       = require('gulp');

// Include plugins
var gulpsync   = require('gulp-sync')(gulp); // To do all these tasks in bulk
var concat     = require('gulp-concat');
var uglify     = require('gulp-uglify');
var minify     = require('gulp-minify-css');
// var sourcemaps = require('gulp-sourcemaps');
// var clean      = require('gulp-clean'); // Clean

// Paths
var vendordir  = './vendor/';
var source     = './src/';
var build      = './dist/';
var jsdir      = './js/';
var cssdir     = './css/';

var project    = 'yacollist';

// "_js" = concat
gulp.task('_js', function() {
    return gulp.src(source + jsdir + '*.js')
        .pipe(concat(project.toLocaleLowerCase() + '.js'))
        .pipe(gulp.dest(build + jsdir));
});

// "_vendor" = Copy vendor files to dist
gulp.task('_vendor', function() {
    return gulp.src(source + jsdir + vendordir + '*.js')
        .pipe(gulp.dest(build + jsdir + vendordir));
});

// "_css" = Copy CSS files to dist
gulp.task('_css', function() {
    return gulp.src(source + cssdir + '*.css')
        .pipe(concat(project.toLocaleLowerCase() + '.css'))
        .pipe(gulp.dest(build + cssdir));
});

// "js" = uglify + concat
gulp.task('js', function() {
    return gulp.src(source + jsdir + '*.js')
        .pipe(uglify())
        .pipe(concat(project.toLocaleLowerCase() + '.js'))
        .pipe(gulp.dest(build + jsdir));
});

// "vendor" = Copy & uglify vendor files to dist
gulp.task('vendor', function() {
    return gulp.src(source + jsdir + vendordir + '*.js')
        .pipe(uglify())
        .pipe(gulp.dest(build + jsdir + vendordir));
});

// "_css" = Copy CSS files to dist
gulp.task('_css', function() {
    return gulp.src(source + cssdir + '*.css')
        .pipe(minify())
        .pipe(concat(project.toLocaleLowerCase() + '.css'))
        .pipe(gulp.dest(build + cssdir));
});

// ========================================
// Main tasks

// "watch" = Automatically build on file change
gulp.task('watch', function () {
    gulp.watch(source + jsdir + '*.js', ['_js']);
    gulp.watch(source + cssdir + '*.css', ['_css']);
});

// "dist" = Make a distribution (build)
gulp.task('dist', gulpsync.sync(['clean-dist', 'js', 'css', 'vendor']));

// "build" = Make a simple build without optimizations
gulp.task('build', gulpsync.sync(['_js', '_css', '_vendor']));
// Default task
gulp.task('default', ['build']);
