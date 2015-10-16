describe('ngMagics.magicsStage', function () {
	beforeEach(() => _module('ngMagics'));

	beforeEach(() => _extend(_$, _get('$compile', '$rootScope', 'magicsStageDirective', 'magics', 'scrollMagic')));

	let scope;

	beforeEach(() => {
		scope = _$.$rootScope.$new();

		let directiveController = _$.magicsStageDirective[0].controller;
		spyOn(directiveController.prototype, 'init').and.callThrough();
	});

	describe('default stage', function () {
		let element;
		let ctrl;

		beforeEach(() => {
			spyOn(_$.magics, 'stage').and.callThrough();

			element = _$.$compile('<p magics-stage>')(scope);
			ctrl = element.controller('magicsStage');
			scope.$digest();
		});

		it('inits', () => {
			expect(ctrl).toBeObject();
			expect(ctrl.init).toHaveBeenCalledWith();
		});

		it('gets stage', () => {
			expect(_$.magics.stage).toHaveBeenCalledWith('default');

			expect(ctrl.stage instanceof _$.scrollMagic.Controller).toBe(true);
			expect(ctrl.stageName).toBe('default');
			expect(ctrl.stageOptions).toEqual({});
			expect(ctrl.stage).toBe(_$.magics._stages.default);
		});

		it('reuses existing stage', () => {
			let defaultStage = _$.magics._stages.default;

			expect(ctrl.stage).toBe(defaultStage);

			spyOn(defaultStage, 'destroy').and.callThrough();

			element.remove();
			expect(defaultStage.destroy).not.toHaveBeenCalled();
		});
	});

	describe('custom stage', function () {
		let element;
		let ctrl;

		beforeEach(() => {
			spyOn(_$.magics, 'stage').and.callThrough();

			element = _$.$compile('<p magics-stage="custom" magics-stage-options="{ vertical: false }">')(scope);
			ctrl = element.controller('magicsStage');
			scope.$digest();
		});


		it('inits', () => {
			expect(ctrl).toBeObject();
			expect(ctrl.init).toHaveBeenCalledWith();
		});

		it('gets stage', () => {
			expect(_$.magics.stage).toHaveBeenCalledWith('custom', _objectContaining({ vertical: false }));

			expect(ctrl.stage instanceof _$.scrollMagic.Controller).toBe(true);
			expect(ctrl.stageName).toBe('custom');
			expect(ctrl.stageOptions).toEqual({ vertical: false });
			expect(ctrl.stage).toBe(_$.magics._stages.custom);
		});

		it('creates new stage', () => {
			let customStage = ctrl.stage;
			let defaultStage = _$.magics._stages.default;

			expect(customStage).not.toBe(defaultStage);

			spyOn(customStage, 'destroy').and.callThrough();

			element.remove();
			expect(customStage.destroy).toHaveBeenCalled();
		});

		it('reuses existing stage', () => {
			let customStage = _$.magics._stages.custom;

			let element = _$.$compile('<p magics-stage="custom" magics-stage-options="{}">')(scope);
			let ctrl = element.controller('magicsStage');
			scope.$digest();

			expect(_$.magics.stage).toHaveBeenCalledWith('custom');
			expect(ctrl.stage).toBe(customStage);

			spyOn(customStage, 'destroy').and.callThrough();

			element.remove();
			expect(customStage.destroy).not.toHaveBeenCalled();
		});
	});
});
