/*!
 * Gulpfile
 */

'use strict';

var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var header = require('gulp-header');
var minify = require('gulp-uglify');

// Handle package information
var pkg = require('./package.json');
pkg.year = String(new Date().getFullYear());

var banner = '/*!\n' +
             ' * <%= pkg.title %> v<%= pkg.version %> <<%= pkg.homepage %>>\n' +
             ' * Copyright 2014-<%= pkg.year %> <%= pkg.author.name %> <<%= pkg.author.url %>>\n' +
             ' * Released under the <%= pkg.license %> license <https://github.com/cheich/jquery.scrollmenu/blob/master/LICENSE>\n' +
             ' */\n';

gulp.task('default', function() {
  return gulp.src('src/jquery.scrollmenu.js')
    .pipe(sourcemaps.init())
    .pipe(minify())
    .pipe(header(banner, { pkg: pkg }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist'));
});
