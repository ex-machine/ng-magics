'use strict';

let promisify = require('pify');

let Deferred = require('es6-deferred');
let del = promisify(require('del'));
let Dgeni = require('dgeni');
let extend = require('extend');
let KarmaServer = require('karma').Server;
let nunjucks = require('nunjucks');
let path = require('path');

let gulp = require('gulp');

let gulp$ = extend(require('gulp-load-plugins')(), {
	small: require('small').gulp,
	runSequence: promisify(require('run-sequence'))
});



gulp.task('clean', () => del(['./dist/*']));

gulp.task('build', () => gulp$.runSequence(
	'build:es5',
	'build:umd'
));

gulp.task('build:es5', () => {
	return gulp.src(['src/**/*.ts'])
	.pipe(gulp$.typescript({
		module: 'commonjs',
		noImplicitAny: false
	}))
	.pipe(gulp$.debug({ title: 'build:es5' }))
	.pipe(gulp.dest('dist/es5'));
});

gulp.task('build:es6', () => {
	return gulp.src(['src/**/*.ts'])
	.pipe(gulp$.typescript({
		module: 'commonjs',
		target: 'es6',
		noImplicitAny: false
	}))
	.pipe(gulp$.debug({ title: 'build:es6' }))
	.pipe(gulp.dest('dist/es6'));
});

gulp.task('build:umd', () => {
	let packageName = 'ng-magics';

	return gulp.src(['dist/es5/**/*.js'])
	.pipe(gulp$.small('index.js', {
		externalResolve: ['node_modules'],
		globalModules: {
			angular: {
				universal: 'angular'
			}
		},
		exportPackage: {
			universal: packageName 
		},
		outputFileName: {
			universal: packageName + '.js'
		}
	}))
	.pipe(gulp$.debug({ title: 'build:umd' }))
	.pipe(gulp.dest('dist'));
});

gulp.task('minify', () => {
	return gulp.src(['dist/**.js'])
	.pipe(gulp$.sourcemaps.init())
	.pipe(gulp$.uglify({
		compress : {
			screw_ie8 : false
		}
	}))
	.pipe(gulp$.rename({
		suffix: '.min'
	}))
	.pipe(gulp$.sourcemaps.write('.'))
	.pipe(gulp$.debug({ title: 'minify' }))
	.pipe(gulp.dest('dist'));
});

gulp.task('test', (cb) => {
	new KarmaServer({
		configFile: path.resolve('test/karma.conf.js'),
		// files: []
	}, cb).start();
});

gulp.task('lint', () => gulp$.runSequence(
	'lint:src',
	'lint:test'
));

gulp.task('lint:src', () => {
	return gulp.src(['src/**/*.ts'])
	.pipe(gulp$.debug({ title: 'lint:src' }))
	.pipe(gulp$.tslint())
	.pipe(gulp$.tslint.report('verbose'));
});

gulp.task('lint:test', () => {
	return gulp.src(['test/unit/**/*.js'])
	.pipe(gulp$.debug({ title: 'lint:test' }))
	.pipe(gulp$.eslint())
	.pipe(gulp$.eslint.format())
	.pipe(gulp$.eslint.failAfterError());
});

gulp.task('docs', () => gulp$.runSequence(
	'docs:api',
	'docs:readme'
));

gulp.task('docs:api', () => {
	return new Dgeni([require('./docs')]).generate();
});

gulp.task('docs:readme', () => {
	let tags = {
		variableStart: '{$',
		variableEnd: '$}'
	};

	return new Promise((resolve, reject) => {
		gulp.src(['docs/api/**/*.md'])
		.pipe(gulp$.concat('api.md'))
		// remove extra line breaks from Dgeni output
		.pipe(gulp$.replace(/((?:[\t ]*\r?\n){2})(?:[\t ]*\r?\n)+/g, '$1'))
		// shift down # headings
		.pipe(gulp$.replace(/^( {0,3})(#+) ?(.+?) ?\2?(.*)$/mg, '$1#$2$3$4'))
		// shift down == headings
		.pipe(gulp$.replace(/(^|\r?\n)( {0,3})(\S.*)\r?\n={2,}(\s)/g, '$1# $2$3'))
		// shift down -- headings
		.pipe(gulp$.replace(/(^|\r?\n)( {0,3})(\S.*)\r?\n={2,}(\s)/g, '$1# $2$3'))
		.on('data', function (file) {
			resolve(file.contents.toString());
		})
		.on('error', reject);
	}).then((apiContent) => {
		let deferred = new Deferred;

		gulp.src(['docs/README.template'])
		.pipe(gulp$.nunjucks.compile({ api: apiContent }, {
			env: nunjucks.configure({ tags: tags })
		}))
		.pipe(gulp$.rename({ extname: '.md' }))
		.pipe(gulp$.debug({ title: 'docs:readme' }))
		.pipe(gulp.dest('.'))
		.on('end', deferred.resolve)
		.on('error', deferred.reject)
	});
});



gulp.task('help', gulp$.taskListing);

gulp.task('default', () => gulp$.runSequence(
	'clean',
	'build',
	'minify',
	'test'
));
