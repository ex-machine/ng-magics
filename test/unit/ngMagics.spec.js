describe('ngMagics', function () {
	it('bootstraps module', () => {
		expect(() => _module('ngMagics')).not.toThrow();

		let { $rootScope } = _get('$rootScope');

		expect($rootScope).toBeObject();
	});

	it('has constants', () => {
		_module('ngMagics');

		let deps = _get('debounce', 'throttle', 'scrollMagic', 'Tween', 'tweenEasing');

		angular.forEach(deps, (dep) => {
			expect(dep).toBeTruthy();
		});
	});
});
