'use strict';

let webpack = require('webpack');

module.exports = (karmaConfig) => {
	let config = {
		basePath: '',
		frameworks: [
			'phantomjs-shim',
			'jasmine',
			'jasmine-matchers'
		],
		files: [
            'unit/_prereqs.js',
            // 'unit/index.oldSpec.js',
			// 'unit/prerequisite.spec.js'
			'unit/**/*.spec.js'
		],
		preprocessors: {
			'unit/**/*.js': ['webpack', 'sourcemap']
		},
		webpack: {
			cache: true,
			resolve: {},
			devtool: 'inline-source-map',
			module: {
				loaders: [
					// disable AMD in UMD modules
					{
						loader: 'imports?define=>false'
					},
					{
						test: /\.js$/,
						loader: 'babel-loader',
						exclude: /(node_modules|bower_components)/
					}
				]
			},
			plugins: [
				new webpack.ProvidePlugin({
					// does not expose ScrollMagic global when modular environment is detected
					ScrollMagic: 'scrollmagic'
				})
			],
			externals: {}
		},
		exclude: [],
		reporters: ['spec'],
		port: 9876,
		captureTimeout: 20000,
		colors: true,
		// logLevel: karmaConfig.LOG_WARN,
		// logLevel: karmaConfig.LOG_DEBUG,
		logLevel: karmaConfig.LOG_INFO,
		// autoWatch: false,
		// singleRun: true,
		// browsers: ['Chrome'],
		browsers: ['PhantomJS'],
		customLaunchers: {
			Chrome_Travis_CI: {
				base: 'Chrome',
				flags: ['--no-sandbox']
			}
		}
	};

	// if (process.env.TRAVIS) {
	// 	config.browsers = ['Chrome_Travis_CI'];
	// }

	karmaConfig.set(config)
}