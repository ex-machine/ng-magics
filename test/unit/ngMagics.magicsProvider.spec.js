describe('ngMagics.magicsProvider', function () {
	beforeEach(() => _module('ngMagics'));

	beforeEach(() => _module((magicsProvider) => {
		_extend(_$, { magicsProvider });
	}));

	// when _get/_inject is omitted in beforeEach,
	// _inject wrapper becomes mandatory in specs
	// to access 'magicsProvider', due to race conditions
	beforeEach(() => _extend(_$, _get('tweenEasing')));

	it('injects dependencies', () => {
		expect(_$.magicsProvider.$).toBeObject();
		expect(_$.magicsProvider.$.tweenEasing).toBe(_$.tweenEasing);
	});

	it('has default configuration', () => {
		let props = ['debug', 'debugOptions', 'sceneOptions', 'stageOptions', 'pinOptions', 'scrollOptions', 'performanceOptions'];

		for (let prop of props) {
			expect(_$.magicsProvider).toHaveMember(prop);
		}
	});

	it('has $get constructor', () => {
		expect(_$.magicsProvider.$get).toBeFunction();
	});
});
