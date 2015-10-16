// TODO: scope scene* events
describe('ngMagics.magicsScene', function () {
	beforeEach(() => _module('ngMagics'));

	beforeEach(() => _extend(_$, _get('$compile', '$rootScope', 'magicsSceneDirective', 'magics', 'scrollMagic')));

	let scope;

	beforeEach(() => {
		scope = _$.$rootScope.$new();

		let directiveController = _$.magicsSceneDirective[0].controller;
		spyOn(directiveController.prototype, 'init').and.callThrough();
	});

	describe('unnamed scene on default stage', function () {
		let element;
		let ctrl;

		beforeEach(() => {
			spyOn(_$.magics, 'scene').and.callThrough();

			element = angular.element('<p magics-scene>');

			// ScrollMagic requires scenes' triggerElement to have parentNode
			_$.$compile(angular.element('<div>').append(element))(scope);

			ctrl = element.controller('magicsScene');
			scope.$digest();
		});

		it('inits', () => {
			expect(ctrl).toBeObject();
			// expect(ctrl.init).toHaveBeenCalledWith(undefined);
		});

		it('gets scene', () => {
			let sceneName = 'ng339.' + element[0].ng339;

			expect(_$.magics.scene).toHaveBeenCalledWith(sceneName, {}, undefined);

			// TODO: spy scene.duration()
			expect(ctrl.scene instanceof _$.scrollMagic.Scene).toBe(true);
			expect(ctrl.sceneName).toBe(sceneName);
			expect(ctrl.sceneOptions).toEqual({});
			expect(ctrl.scene).toBe(_$.magics._scenes[sceneName]);
		});
	});

	describe('named scene on custom stage', function () {
		let element;
		let ctrl;

		beforeEach(() => {
			spyOn(_$.magics, 'scene').and.callThrough();

			element = angular.element('<p magics-scene="some" magics-scene-options="{ duration: 100 }">');
			_$.$compile(angular.element('<div magics-stage="custom">').append(element))(scope);
			ctrl = element.controller('magicsScene');
			scope.$digest();
		});

		it('inits', () => {
			expect(ctrl).toBeObject();
			expect(ctrl.init).toHaveBeenCalledWith('custom');
		});

		it('gets scene', () => {
			expect(_$.magics.scene).toHaveBeenCalledWith('some', { duration: 100 }, 'custom');

			expect(ctrl.scene instanceof _$.scrollMagic.Scene).toBe(true);
			expect(ctrl.sceneName).toBe('some');
			expect(ctrl.sceneOptions).toEqual({ duration: 100 });
			expect(ctrl.scene).toBe(_$.magics._scenes.some);
		});

		it('creates new scene', () => {
			let scene = ctrl.scene;

			spyOn(scene, 'destroy').and.callThrough();

			element.remove();
			expect(scene.destroy).toHaveBeenCalled();
		});

		it('reuses existing scene', () => {
			let someScene = _$.magics._scenes.some;

			element = angular.element('<p magics-scene="some" magics-scene-options="{}">');

			// ScrollMagic requires scenes' triggerElement to have parentNode
			_$.$compile(angular.element('<div>').append(element))(scope);

			let ctrl = element.controller('magicsScene');
			scope.$digest();

			let scene = ctrl.scene;

			expect(_$.magics.scene).toHaveBeenCalledWith('some');
			expect(scene).toBe(someScene);

			spyOn(scene, 'destroy').and.callThrough();

			element.remove();
			expect(scene.destroy).not.toHaveBeenCalled();
		});
	});
});
