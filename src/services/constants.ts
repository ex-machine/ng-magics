/// <reference path="../typings/globals.d.ts"/>
/// <reference path="../typings/lib.d.ts"/>

import * as angular from 'angular';

import { debounce, throttle } from 'debottle'

export default angular.module('ngMagics.constants', [])
	.constant('debounce', debounce)
	.constant('throttle', throttle)
	.constant('scrollMagic', (() => {
		if (typeof ScrollMagic !== 'undefined') {
			return ScrollMagic;
		}
	})())
	.constant('Tween', (() => {
		let Tween;

		// module bundler global substitution
		if (typeof TweenMax !== 'undefined') {
			Tween = TweenMax;
		} else if (typeof TweenLite !== 'undefined') {
			Tween = TweenLite;
		} else if (typeof GreenSockGlobals !== 'undefined') {
			Tween = GreenSockGlobals.TweenMax || GreenSockGlobals.TweenLite;
		}

		return Tween;
	})())
	.constant('tweenEasing', (() => {
		if (typeof GreenSockGlobals !== 'undefined') {
			return GreenSockGlobals.com.greensock.easing;
		}
	})())
	.name;
