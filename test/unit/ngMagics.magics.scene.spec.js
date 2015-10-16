describe('ngMagics.magics.scene', function () {
	beforeEach(() => _module('ngMagics'));

	beforeEach(() => _extend(_$, _get('$window', 'magics', 'scrollMagic')));

	let SceneSpy;
	let addTo;
	let addIndicators;

	beforeEach(() => {
		let Scene = _$.scrollMagic.Scene;

		// no ScrollMagic.Scene.prototype to spy on scene methods
		SceneSpy = spyOn(_$.scrollMagic, 'Scene').and.callFake((...args) => {
			// proto for ScrollMagic internal instanceof checks
			let scene = Object.create(SceneSpy.prototype);

			Scene.apply(scene, args);

			addTo = spyOn(scene, 'addTo').and.callThrough();
			addIndicators = spyOn(scene, 'addIndicators').and.callThrough();

			return scene;
		});
	});

	describe('default stage', function () {
		it('creates scene', () => {
			let defaultStage = _$.magics._stages.default;
			let scene = _$.magics.scene('some');

			expect(scene instanceof _$.scrollMagic.Scene).toBe(true);
			expect(scene).toBe(_$.magics._scenes.some);

			expect(_$.scrollMagic.Scene).toHaveBeenCalledWith(undefined);
			expect(addTo).toHaveBeenCalledWith(defaultStage);
		});
	});

	describe('custom stage', function () {
		it('creates scene', () => {
			let customStage = _$.magics.stage('custom');
			let scene = _$.magics.scene('some', { duration: 100 }, 'custom');

			expect(scene instanceof _$.scrollMagic.Scene).toBe(true);
			expect(scene).toBe(_$.magics._scenes.some);

			expect(_$.scrollMagic.Scene).toHaveBeenCalledWith({ duration: 100 });
			expect(addTo).toHaveBeenCalledWith(customStage);
		});

		it('reuses existing scene', () => {
			_$.magics.stage('custom');
			_$.magics.scene('some', {}, 'custom');

			SceneSpy.calls.reset();
			_$.magics.scene('some', {}, 'custom');

			expect(_$.scrollMagic.Scene).not.toHaveBeenCalled();
		});

		it('debugs scene with default options', () => {
			_$.magics._provider.debug = true;

			_$.magics.stage('custom');
			let scene = _$.magics.scene('some', {}, 'custom');

			expect(scene instanceof _$.scrollMagic.Scene).toBe(true);
			expect(addIndicators).toHaveBeenCalledWith({ name: 'some' });
		});

		it('debugs scene with custom options', () => {
			_$.magics._provider.debug = true;
			_$.magics._provider.debugOptions = {
				colorStart: '#bad',
				colorEnd: '#fab'
			};

			_$.magics.stage('custom');
			let scene = _$.magics.scene('some', {}, 'custom');

			expect(scene instanceof _$.scrollMagic.Scene).toBe(true);
			expect(addIndicators).toHaveBeenCalledWith({
				name: 'some',
				colorStart: '#bad',
				colorEnd: '#fab'
			});
		});

		it('sets up events', () => {
			spyOn(_$.magics, 'onSceneEnter');
			spyOn(_$.magics, 'onSceneLeave');

			_$.magics.stage('custom');
			_$.magics.scene('some', {}, 'custom');

			expect(_$.magics.onSceneEnter).toHaveBeenCalledWith('some', _any(Function));
			expect(_$.magics.onSceneLeave).toHaveBeenCalledWith('some', _any(Function));
		});

		it('is patched', () => {
			expect(_$.magics.scene('some')).toHaveMember('$$patched');

			let scene = _$.magics.scene('some').destroy();

			expect(scene).toBeFalsy();
			expect(_$.magics._scenes).not.toHaveMember('some');
		});

	});
});
