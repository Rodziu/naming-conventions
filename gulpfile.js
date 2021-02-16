!function() {
	'use strict';
	const gulp = require('gulp'),
		ts = require('gulp-typescript'),
		sourcemaps = require('gulp-sourcemaps'),
		eslint = require('gulp-eslint'),
		through2 = require('through2'),
		webpack = require('webpack'),
		webpackStream = require('webpack-stream');

	gulp.task('ts', () => {
		const tsProject = ts.createProject('tsconfig.json');
		return gulp.src([
			'src/naming-conventions.ts',
		])
			.pipe(eslint())
			.pipe(eslint.format())
			.pipe(eslint.failOnError())
			.pipe(sourcemaps.init())
			.pipe(tsProject())
			.pipe(sourcemaps.write())
			.pipe(gulp.dest('.build'))
			.pipe(through2.obj((file, enc, cb) => {
				if (!file.basename.includes('.d.ts')) {
					cb();
					return;
				}
				cb(null, file);
			}))
			.pipe(gulp.dest('dist'))
	});

	gulp.task('bundle', () => {
		return _bundle(false);
	});

	gulp.task('bundle:prod', () => {
		return _bundle(true);
	});

	function _bundle(production) {
		return gulp.src('dummy', {allowEmpty: true})
			.pipe(webpackStream({
				entry: {
					'NamingConventions': './.build/naming-conventions.js'
				},
				mode: production ? 'production' : 'development',
				output: {
					devtoolNamespace: 'NamingConventions',
					filename: (pathData) => {
						let name = pathData.chunk.name;
						return name.substring(0, 1).toLowerCase()
							+ name.substring(1).replace(/[A-Z]/g, (letter) => {
								return '-' + letter.toLowerCase();
							})
							+ (production ? '.min' : '') + '.js'
					},
					library: '[name]',
					libraryTarget: 'umd',
					libraryExport: 'default',
					umdNamedDefine: true,
					globalObject: 'window'
				},
				module: {
					rules: [
						{
							test: /\.js$/,
							enforce: 'pre',
							use: ['source-map-loader'],
						},
					],
				},
				devtool: 'source-map'
			}, webpack))
			.pipe(gulp.dest('dist'));
	}

	gulp.task('watch', function() {
		[
			['src/naming-conventions.ts', 'ts'],
		].forEach(([src, task]) => {
			gulp.watch(src, {}, gulp.series(task, 'bundle', 'bundle:prod'));
		});
	});

	//
	exports.default = gulp.series('ts', 'bundle', 'bundle:prod');
}();
