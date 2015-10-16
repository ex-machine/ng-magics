describe('ngMagics.magics.scrollToScene', function () {
	beforeEach(() => _module('ngMagics'));

	beforeEach(() => _extend(_$, _get('$rootScope', '$q', '$window', 'magics', 'scrollMagic', 'Tween')));

	let stage;
	let scene;

	beforeEach(() => {
		spyOn(_$.Tween, 'to').and.callThrough();

		stage = _$.magics._stages.default;
		spyOn(stage, 'scrollTo').and.callThrough();

		scene = _$.magics.scene('some');
		spyOn(scene, 'scrollOffset').and.returnValue(100);
		spyOn(scene, 'controller').and.callThrough();
	});

	it('accepts scene object with offset', () => {
		let Deferred = _$.$q.defer().constructor;
		let Promise = _$.$q.when().constructor;

		let scrollPromise = _$.magics.scrollToScene(scene, 1);

		expect(scene.scrollOffset).toHaveBeenCalled();
		expect(scene.controller).toHaveBeenCalled();

		expect(stage.scrollTo).toHaveBeenCalledWith(101, [_$.$window, _any(Deferred)]);

		expect(scrollPromise instanceof Promise).toBe(true);
	});

	it('accepts existing scene name', () => {
		let Deferred = _$.$q.defer().constructor;
		let Promise = _$.$q.when().constructor;

		let scrollPromise = _$.magics.scrollToScene('some');

		expect(scene.scrollOffset).toHaveBeenCalled();
		expect(scene.controller).toHaveBeenCalled();

		expect(stage.scrollTo).toHaveBeenCalledWith(100, [_$.$window, _any(Deferred)]);

		expect(scrollPromise instanceof Promise).toBe(true);
	});

	it('rejects non-existing scene name', () => {
		expect(_$.magics.scrollToScene('awesome')).toBe(false);
		expect(stage.scrollTo).not.toHaveBeenCalled();
	});

	it('triggers scroll handler', (done) => {
		let { scrollOptions } = _$.magics._provider;

		_$.magics.scrollToScene('some');

		expect(_$.Tween.to).toHaveBeenCalledWith(
			_$.$window,
			scrollOptions.duration,
			{
				scrollTo: {
					autoKill: true,
					onAutoKill: _any(Function),
					y: 100
				},
				ease: scrollOptions.ease,
				onComplete: _any(Function)
			}
		);

		spyOn(_$.$rootScope, '$apply').and.callThrough();

		let delay = scrollOptions.duration * 1000 + 50;
		setTimeout(() => {
			expect(_$.$rootScope.$apply).toHaveBeenCalledWith();
			done();
		}, delay);
	});
});
