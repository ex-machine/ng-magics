describe('ngMagics.magics.stage', function () {
	beforeEach(() => _module('ngMagics'));

	let Controller;
	let ControllerSpy;

	// make default stage an instance of the spy and not the original
	beforeEach(() => _module((scrollMagic) => {
		Controller = scrollMagic.Controller;
		ControllerSpy = spyOn(scrollMagic, 'Controller').and.callThrough();
	}));

	beforeEach(() => _extend(_$, _get('$window', 'magics', 'scrollMagic')));

	describe('default stage', function () {
		it('gets stage', () => {
			let defaultStage = _$.magics._stages.default;

			ControllerSpy.calls.reset();

			expect(defaultStage instanceof _$.scrollMagic.Controller).toBe(true);
			expect(_$.magics.stage('default')).toBe(defaultStage);

			expect(_$.scrollMagic.Controller).not.toHaveBeenCalled();
		});

		it('gets stage by default', () => {
			let defaultStage = _$.magics._stages.default;

			ControllerSpy.calls.reset();

			expect(_$.magics.stage()).toBe(defaultStage);
			expect(_$.magics.stage('')).toBe(defaultStage);
			expect(_$.magics.stage(null, {})).toBe(defaultStage);

			expect(_$.scrollMagic.Controller).not.toHaveBeenCalled();
		});

		it('is patched', () => {
			expect(_$.magics.stage()).toHaveMember('$$patched');
			expect(_$.magics.stage('default').destroy()).toBe(true);
			expect(_$.magics._stages).toHaveMember('default');
			expect(_$.magics._stages.default instanceof _$.scrollMagic.Controller).toBe(true);
		});
	});

	describe('custom stage', function () {
		it('creates stage', () => {
			let customStage = _$.magics.stage('custom', { vertical: false });

			expect(customStage instanceof _$.scrollMagic.Controller).toBe(true);
			expect(customStage).toBe(_$.magics._stages.custom);

			expect(_$.scrollMagic.Controller).toHaveBeenCalledWith({
				vertical: false,
				globalSceneOptions: {},
				container: _$.$window
			});
		});

		it('reuses existing stage', () => {
			_$.magics.stage('custom');

			ControllerSpy.calls.reset();
			_$.magics.stage('custom');

			expect(_$.scrollMagic.Controller).not.toHaveBeenCalled();
		});

		it('sets scrollTo handler', () => {
			let scrollTo;

			// no ScrollMagic.Controller.prototype to spy on stage methods
			ControllerSpy.and.callFake((...args) => {
				let stage = Object.create(ControllerSpy.prototype);

				Controller.apply(stage, args);
				scrollTo = spyOn(stage, 'scrollTo').and.callThrough();

				return stage;
			});

			_$.magics.stage('custom');

			expect(scrollTo).toHaveBeenCalledWith(_$.magics._scrollHandler);
		});

		it('is patched', () => {
			expect(_$.magics.stage()).toHaveMember('$$patched');
			expect(_$.magics.stage('custom').destroy()).toBeFalsy();
			expect(_$.magics._stages).not.toHaveMember('custom');
		});
	});

	describe('detached stage', function () {
		let customContainer;

		beforeEach(() => {
			customContainer = _$.magics._provider.container = angular.element('<p>')[0];
		});

		it('creates stage', () => {
			let customStage = _$.magics.stage('custom', {});

			expect(customStage instanceof _$.scrollMagic.Controller).toBe(true);
			expect(customStage).toBe(_$.magics._stages.custom);

			expect(_$.scrollMagic.Controller).toHaveBeenCalledWith({
				globalSceneOptions: {},
				container: customContainer
			});
		});

		it('replaces container with window', () => {
			let customStage = _$.magics.stage('custom', {});

			expect(customStage.info('container')).toBe(_$.$window);
		});
	});

});
