/// <reference path="../typings/globals.d.ts"/>
/// <reference path="../typings/lib.d.ts"/>
var angular = require('angular');
var debottle_1 = require('debottle');
exports.__esModule = true;
exports["default"] = angular.module('ngMagics.constants', [])
    .constant('debounce', debottle_1.debounce)
    .constant('throttle', debottle_1.throttle)
    .constant('scrollMagic', (function () {
    if (typeof ScrollMagic !== 'undefined') {
        return ScrollMagic;
    }
})())
    .constant('Tween', (function () {
    var Tween;
    // module bundler global substitution
    if (typeof TweenMax !== 'undefined') {
        Tween = TweenMax;
    }
    else if (typeof TweenLite !== 'undefined') {
        Tween = TweenLite;
    }
    else if (typeof GreenSockGlobals !== 'undefined') {
        Tween = GreenSockGlobals.TweenMax || GreenSockGlobals.TweenLite;
    }
    return Tween;
})())
    .constant('tweenEasing', (function () {
    if (typeof GreenSockGlobals !== 'undefined') {
        return GreenSockGlobals.com.greensock.easing;
    }
})())
    .name;
