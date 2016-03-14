var global = eval.call(null, 'this');
var jasmineEnv = jasmine.getEnv();

function spec(suite) {
	if (suite && !suite.hasOwnProperty('_spec')) {
		Object.defineProperty(suite, '_spec', {
			get: function () {
				return global._spec;
			},
			configurable: true
		});
	}

	if (!('_spec' in global)) {
		global._spec = global._$ = null;

		jasmineEnv.beforeEach(function () {
			global._spec = global._$ = this;
		}); 

		jasmineEnv.afterEach(function () {
			global._spec = global._$ = null;
		});
	}

	return global._spec;
}

function get(_depNames) {
	var deps = {};
	var depNames = Array.isArray(_depNames) ? _depNames : [].slice.call(arguments);

	fn.$inject = depNames;
	function fn() {
		var args = arguments;

		angular.forEach(depNames, function (depName, i) {
			deps[depName] = args[i]; 
		});
	}

	angular.mock.inject(fn);
	
	return deps;
}

spec();

module.exports = exports = {
	get: get,
	inject: angular.mock.inject,
	module: angular.mock.module,

	extend: Object.assign,

	j$: jasmine,
	any: jasmine.any,
	anything: jasmine.anything,
	arrayContaining: jasmine.arrayContaining,
	asymmetricMatch: jasmine.asymmetricMatch,
	createSpy: jasmine.createSpy,
	createSpyObj: jasmine.createSpyObj,
	objectContaining: jasmine.objectContaining,
	stringMatching: jasmine.stringMatching,

	log: console.log.bind(console),
	debug: console.debug.bind(console),
	info: console.info.bind(console),
	warn: console.warn.bind(console),
	error: console.error.bind(console)
}

angular.forEach(exports, function (val, key) {
	exports['_' + key] = val;
	global['_' + key] = val;
});
