describe('ngMagics.magicsSpy', function () {
	beforeEach(() => _module('ngMagics'));

	beforeEach(() => _extend(_$, _get('$compile', '$rootScope', 'magics', 'magicsSpyDirective')));

	let scope;

	beforeEach(() => {
		scope = _$.$rootScope.$new();

		let directiveController = _$.magicsSpyDirective[0].controller;
		spyOn(directiveController.prototype, 'init').and.callThrough();
	});

	describe('spy on no scene', function () {
		let element;
		let ctrl;

		it('skips init', () => {
			element = _$.$compile('<p magics-spy>')(scope);
			ctrl = element.controller('magicsSpy');
			scope.$digest();

			expect(ctrl).toBeObject();
			expect(ctrl.init).not.toHaveBeenCalled();
		});
	});

	describe('spy on specified scene', function () {
		let element;
		let ctrl;

		it('inits', () => {
			_$.magics.scene('some');

			element = angular.element('<p magics-spy magics-spy-scene="some">');

			// ScrollMagic requires scenes' triggerElement to have parentNode
			_$.$compile(angular.element('<div>').append(element))(scope);

			ctrl = element.controller('magicsSpy');
			scope.$digest();

			expect(ctrl).toBeObject();
			expect(ctrl.init).toHaveBeenCalledWith('some');
		});
	});

	describe('spy on parent scene', function () {
		let element;
		let ctrl;

		describe('without progress handler', function () {
			beforeEach(() => {
				spyOn(_$.magics, 'onSceneProgress').and.callThrough();

				element = angular.element('<p magics-spy>');
				let sceneElement = angular.element('<div magics-scene="some">').append(element);

				// ScrollMagic requires scenes' triggerElement to have parentNode
				_$.$compile(angular.element('<div>').append(sceneElement))(scope);
				ctrl = element.controller('magicsSpy');
				scope.$digest();
			});

			it('inits', () => {
				expect(ctrl).toBeObject();
				expect(ctrl.init).toHaveBeenCalledWith('some');
			});

			it('skips "progress" event setup', () => {
				expect(ctrl).toBeObject();
				expect(_$.magics.onSceneProgress).not.toHaveBeenCalled();
			});
		});

		describe('with progress handler', function () {
			let progressHandler;

			beforeEach(() => {
				spyOn(_$.magics, 'onSceneProgress').and.callThrough();

				progressHandler = scope.progressHandler = _createSpy('progressHandler');

				element = angular.element('<p magics-spy magics-spy-progress="progressHandler">');
				let sceneElement = angular.element('<div magics-scene="some">').append(element);

				// ScrollMagic requires scenes' triggerElement to have parentNode
				_$.$compile(angular.element('<div>').append(sceneElement))(scope);

				ctrl = element.controller('magicsSpy');
				scope.$digest();

				// scope.flag;
			});

			it('inits', () => {
				expect(ctrl).toBeObject();
				expect(ctrl.init).toHaveBeenCalledWith('some');
			});

			it('does "progress" event setup', () => {
				expect(_$.magics.onSceneProgress).toHaveBeenCalledWith('some', progressHandler);
			});
		});

		describe('without scope flag', function () {
			beforeEach(() => {
				element = angular.element('<p magics-spy>');
				let sceneElement = angular.element('<div magics-scene="some">').append(element);

				// ScrollMagic requires scenes' triggerElement to have parentNode
				_$.$compile(angular.element('<div>').append(sceneElement))(scope);

				ctrl = element.controller('magicsSpy');
				scope.$digest();

				spyOn(ctrl, 'flag').and.callThrough();
			});

			it('inits', () => {
				expect(ctrl).toBeObject();
				expect(ctrl.init).toHaveBeenCalledWith('some');
			});

			it('sets internal flag on "enter"', () => {
				expect(ctrl._flagSetter).toBe(undefined);

				scope.$broadcast('scene:some', { type: 'enter' });

				expect(ctrl.flag).toHaveBeenCalledWith(true);
				expect(ctrl._flag).toBe(true);
			});

			it('unsets internal flag on "leave"', () => {
				expect(ctrl._flagSetter).toBe(undefined);

				scope.$broadcast('scene:some', { type: 'leave' });

				expect(ctrl.flag).toHaveBeenCalledWith(false);
				expect(ctrl._flag).toBe(false);
			});
		});

		describe('with scope flag', function () {
			beforeEach(() => {
				element = angular.element('<p magics-spy="flag">');
				let sceneElement = angular.element('<div magics-scene="some">').append(element);

				// ScrollMagic requires scenes' triggerElement to have parentNode
				_$.$compile(angular.element('<div>').append(sceneElement))(scope);

				ctrl = element.controller('magicsSpy');
				scope.$digest();

				spyOn(ctrl, 'flag').and.callThrough();
				spyOn(ctrl, '_flagSetter').and.callThrough();
			});

			it('inits', () => {
				expect(ctrl).toBeObject();
				expect(ctrl.init).toHaveBeenCalledWith('some');
			});

			it('sets scope flag on "enter"', () => {
				scope.$broadcast('scene:some', { type: 'enter' });

				expect(ctrl.flag).toHaveBeenCalledWith(true);
				expect(ctrl._flagSetter).toHaveBeenCalledWith(true);
				expect(ctrl._flag).toBe(true);

				expect(scope.flag).toBe(true);
			});

			it('unsets scope flag on "leave"', () => {
				scope.$broadcast('scene:some', { type: 'leave' });

				expect(ctrl.flag).toHaveBeenCalledWith(false);
				expect(ctrl._flagSetter).toHaveBeenCalledWith(false);
				expect(ctrl._flag).toBe(false);

				expect(scope.flag).toBe(false);
			});
		});

		describe('with invalid scope flag', function () {
			beforeEach(() => {
				element = angular.element('<p magics-spy="null">');
				let sceneElement = angular.element('<div magics-scene="some">').append(element);

				// ScrollMagic requires scenes' triggerElement to have parentNode
				_$.$compile(angular.element('<div>').append(sceneElement))(scope);

				ctrl = element.controller('magicsSpy');
				scope.$digest();

				spyOn(ctrl, 'flag').and.callThrough();
			});

			it('inits', () => {
				expect(ctrl).toBeObject();
				expect(ctrl.init).toHaveBeenCalledWith('some');
			});

			it('sets internal and skips scope flag', () => {
				expect(ctrl._flagSetter).toBe(undefined);

				expect(() => scope.$broadcast('scene:some', { type: 'enter' })).not.toThrow();

				expect(ctrl.flag).toHaveBeenCalledWith(true);
				expect(ctrl._flag).toBe(true);

				expect(scope.null).toBe(undefined);
			});
		});
	});
});
