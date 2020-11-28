/*
 * AngularJS TableTools Plugin
 *  Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

!function(){
	'use strict';
	const pkg = require('./package'),
		gulp = require('gulp'),
		rename = require('gulp-rename'),
		sourcemaps = require('gulp-sourcemaps'),
		uglify = require('gulp-uglify-es').default,
		eslint = require('gulp-eslint');

	gulp.task('js', function(){
		return gulp.src('src/*.js')
			.pipe(sourcemaps.init())
			.pipe(eslint())
			.pipe(eslint.format())
			.pipe(eslint.failOnError())
			.pipe(gulp.dest('dist'))
			.pipe(rename(pkg.name + '.min.js'))
			.pipe(uglify())
			.pipe(sourcemaps.write('./', {includeContent: false}))
			.pipe(gulp.dest('dist'));
	});

	gulp.task('watch', function() {
		gulp.watch('src/*.js', gulp.series('js'));
	})

	//
	exports.default = gulp.series('js');
}();
