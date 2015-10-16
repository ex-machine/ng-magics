// TODO: onScene*
describe('ngMagics.magics.constructor', function () {
	beforeEach(() => _module('ngMagics'));

	describe('provider assignment', function () {
		beforeEach(() => _module((magicsProvider) => {
			_extend(_$, { magicsProvider });
		}));

		beforeEach(() => _extend(_$, _get('magics')));

		it('gets provider\'s instance', () => {
			expect(_$.magics._provider).toBe(_$.magicsProvider);
		});

	});

	describe('braking function', function () {
		it('is "debounce"', () => {
			_module((magicsProvider) => {
				magicsProvider.performanceOptions.brake = 'debounce';
			});

			_extend(_$, _get('magics', 'debounce'));

			expect(_$.magics._brake).toBe(_$.debounce);
		});

		it('is "throttle"', () => {
			_module((magicsProvider) => {
				magicsProvider.performanceOptions.brake = 'throttle';
			});

			_extend(_$, _get('magics', 'throttle'));

			expect(_$.magics._brake).toBe(_$.throttle);
		});

		it('is "debounce" by default', () => {
			_extend(_$, _get('magics', 'debounce'));

			expect(_$.magics._brake).toBe(_$.debounce);
		});

	});

	describe('...', function () {
		beforeEach(() => _extend(_$, _get('magics', 'scrollMagic')));

		it('gets braking delay from configuration', () => {
			expect(_$.magics._delay).toBe(_$.magics._provider.performanceOptions.delay);
		});

		it('injects dependencies', () => {
			let deps = _get('$cacheFactory', '$q', '$rootScope', '$window', 'debounce', 'throttle', 'scrollMagic', 'Tween');
			expect(_$.magics.$).toBeObject();
			expect(_$.magics.$).toEqual(deps);
		});

		it('has stage/scene storages', _inject(($cacheFactory) => {
			let cache = $cacheFactory.get('magics');

			expect(cache).toBeObject();

			expect(_$.magics._scenes).toBe(cache.get('scenes'));
			expect(_$.magics._scenes).toBeObject();

			expect(_$.magics._stages).toBe(cache.get('stages'));
			expect(_$.magics._stages).toBeObject();
		}));

		it('has default window stage', _inject(($window) => {
			let defaultStage = _$.magics._stages.default;

			expect(defaultStage instanceof _$.scrollMagic.Controller).toBe(true);
			expect(defaultStage.info().container).toBe($window);
		}));
	});
});
