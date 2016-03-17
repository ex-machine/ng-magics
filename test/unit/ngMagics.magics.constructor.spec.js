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
			_module(
				($provide, magicsProvider) => {
					$provide.constant('debounce', jasmine.createSpy('debounce'));
					magicsProvider.performanceOptions.brake = 'debounce';
				}
			);

			_extend(_$, _get('magics', 'debounce'));

			let handler = () => {};

			_$.magics._brake(handler, 10);
			expect(_$.debounce).toHaveBeenCalledWith(handler, 10);
		});

		it('is "throttle"', () => {
			_module(
				($provide, magicsProvider) => {
					$provide.constant('throttle', jasmine.createSpy('throttle'));
					magicsProvider.performanceOptions.brake = 'throttle';
				}
			);

			_extend(_$, _get('magics', 'throttle'));

			let handler = () => {};
			_$.magics._brake(handler, 10);

			expect(_$.throttle).toHaveBeenCalledWith(handler, 10);
		});

		it('is custom function', () => {
			var customBrake = jasmine.createSpy('customBrake');

			_module((magicsProvider) => {
				magicsProvider.performanceOptions.brake = customBrake;
			});

			_extend(_$, _get('magics'));

			let handler = () => {};
			_$.magics._brake(handler, 10);

			expect(customBrake).toHaveBeenCalledWith(handler, 10);
		});

		it('is "debounce" by default', () => {
			_module(
				($provide, magicsProvider) => {
					$provide.constant('debounce', jasmine.createSpy('debounce'));
					_extend(_$, { magicsProvider });
				}
			);

			_extend(_$, _get('magics', 'debounce'));

			let handler = () => {};
			_$.magics._brake(handler, 10);

			expect(_$.magicsProvider.performanceOptions.brake).toBe('debounce');
			expect(_$.debounce).toHaveBeenCalledWith(handler, 10);
		});
	});

	describe('...', function () {
		beforeEach(() => _extend(_$, _get('magics', 'scrollMagic')));

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
