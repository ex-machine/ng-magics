describe('prerequisite', function () {
	it('has "ScrollMagic" global', () => {
		expect(typeof ScrollMagic).not.toBe('undefined');
	});

	it('has "GreenSockGlobals" global', () => {
		expect(typeof GreenSockGlobals).not.toBe('undefined');
	});

	it('has "TweenLite" constructor as global or "GreenSockGlobals" property', () => {
		expect([
			typeof TweenLite,
			typeof (GreenSockGlobals || {}).TweenLite
		]).toContain('function');
	});

	it('has easing definitions in "GreenSockGlobals" global', () => {
		var easingPackage;
		var easingFunction;
		var easingObject;

		expect(() => {
			easingPackage = GreenSockGlobals.com.greensock.easing;
			easingFunction = easingPackage.Power2;
			easingObject = easingPackage.Power2.easeInOut;
		}).not.toThrow();

		expect(easingPackage).toBeObject();
		expect(easingFunction).toBeFunction();
		expect(easingObject).toBeObject();
	});
});
