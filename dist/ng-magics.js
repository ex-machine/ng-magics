(function(__root, __factory) { if (typeof define === "function" && define.amd) { define("ng-magics", ["angular"], __factory);} else if (typeof exports === "object") {module.exports = __factory(require("angular"));} else {__root["ng-magics"] = __factory(angular);}})(this, (function(__small$_mod_0) {
var exports = {};
var __small$_4 = (function() {
var exports = {};
/// <reference path="../typings/globals.d.ts"/>
/// <reference path="../typings/lib.d.ts"/>
var angular = __small$_mod_0;
var debottle_1 = ((function() {
var exports = {};
var apply = ((function() {
var exports = {};
function apply(self, fn, args) {
	var selfless = (self === undefined) || (self === null);
	var length = args ? args.length : 0;
	
	switch (length) {
		case 0:
			return selfless ? fn() : fn.call(self);
		case 1:
			return selfless ? fn(args[0]) : fn.call(self, args[0]);
		case 2:
			return selfless ? fn(args[0], args[1]) : fn.call(self, args[0], args[1]);
		case 3:
			return selfless ? fn(args[0], args[1], args[2]) : fn.call(self, args[0], args[1], args[2]);
		case 4:
			return selfless ? fn(args[0], args[1], args[2], args[3]) : fn.call(self, args[0], args[1], args[2], args[3]);
		case 5:
			return selfless ? fn(args[0], args[1], args[2], args[3], args[4]) : fn.call(self, args[0], args[1], args[2], args[3], args[4]);
		case 6:
			return selfless ? fn(args[0], args[1], args[2], args[3], args[4], args[5]) : fn.call(self, args[0], args[1], args[2], args[3], args[4], args[5]);
		// the crucial point
		case 7:
			return selfless ? fn(args[0], args[1], args[2], args[3], args[4], args[5], args[6]) : fn.call(self, args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
		default:
			return selfless ? fn.apply(null, args) : fn.apply(self, args);
	}
}

exports = apply;
return exports;
})());

function Debottle(delay) {
	this.$delay = delay;

	this.$cancel = function () {
		return clearTimeout(this.$timeout);
	}
}

function debounce(fn, delay, cb) {
	if (arguments.length === 2 && typeof delay === 'function') {
		cb = delay;
		delay = undefined;
	}

	var self = debouncedFn;
	Debottle.call(self, delay);

	function debouncedFn() {
		var args = arguments;

		if (self.$timeout !== undefined)
			self.$cancel();

		self.$timeout = setTimeout(function () {
			if (typeof cb !== 'function')
				return apply(null, fn, args);

			try {
				cb(null, apply(null, fn, args));
			} catch (e)	{
				cb(e);
			}
		}, self.$delay);
	};

	return self;
}

function throttle(fn, delay, cb) {
	if (arguments.length === 2 && typeof delay === 'function') {
		cb = delay;
		delay = undefined;
	}

	var self = throttledFn;
	Debottle.call(self, delay);

	function throttledFn() {
		var args = arguments;

		if (self.$timeout !== undefined)
			return;

		self.$timeout = setTimeout(function () {
			self.$timeout = undefined;
		}, self.$delay);

		if (typeof cb !== 'function')
			return apply(null, fn, args);

		try {
			cb(null, apply(null, fn, args));
		} catch (e)	{
			cb(e);
		}
	};

	return self;
}

exports.debounce = debounce;
exports.throttle = throttle;

return exports;
})());
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

return exports;
})();
var __small$_5 = (function() {
var exports = {};
/// <reference path="../typings/globals.d.ts"/>
/// <reference path="../typings/lib.d.ts"/>
var angular = __small$_mod_0;
var constants_1 = __small$_4;
var MagicsProvider = (function () {
    function MagicsProvider() {
        var _this = this;
        var deps = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            deps[_i - 0] = arguments[_i];
        }
        this.$ = {};
        this.debug = false;
        this.debugOptions = {};
        this.sceneOptions = {};
        this.stageOptions = {};
        this.pinOptions = {};
        this.performanceOptions = {
            brake: 'debounce',
            delay: 50
        };
        var self = this.constructor;
        angular.forEach(self.$inject, function (depName, i) {
            _this.$[depName] = deps[i];
        });
        // TODO: proper typing
        this.$get.$inject = MagicsInstance.$inject;
        this.scrollOptions = {
            y: true,
            duration: 0.75,
            ease: this.$.tweenEasing.Power2.easeInOut
        };
    }
    MagicsProvider.prototype.$get = function () {
        var deps = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            deps[_i - 0] = arguments[_i];
        }
        var instance = Object.create(MagicsInstance.prototype);
        MagicsInstance.apply(instance, [this].concat(deps));
        return instance;
    };
    MagicsProvider.$inject = ['tweenEasing'];
    return MagicsProvider;
})();
var MagicsInstance = (function () {
    function MagicsInstance(provider) {
        var _this = this;
        var deps = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            deps[_i - 1] = arguments[_i];
        }
        this.$ = {};
        // TODO: swappable method
        // stage.scrollTo accepts 1 optional argument
        this._scrollHandler = function (target, _a) {
            var container = _a[0], deferred = _a[1];
            var _b = _this.$, $rootScope = _b.$rootScope, Tween = _b.Tween;
            var scrollOptions = _this._provider.scrollOptions;
            function completeHandler() {
                deferred.resolve();
                $rootScope.$apply();
            }
            function autoKillHandler() {
                deferred.reject();
                $rootScope.$apply();
            }
            var scrollToOptions = {
                autoKill: true,
                onAutoKill: autoKillHandler
            };
            if (scrollOptions.x) {
                scrollToOptions.x = target;
            }
            if (scrollOptions.y) {
                scrollToOptions.y = target;
            }
            Tween.to(container, scrollOptions.duration, {
                scrollTo: scrollToOptions,
                ease: scrollOptions.ease,
                onComplete: completeHandler
            });
        };
        var self = this.constructor;
        angular.forEach(self.$inject, function (depName, i) {
            _this.$[depName] = deps[i];
        });
        this._provider = provider;
        //
        var _a = this.$, $cacheFactory = _a.$cacheFactory, debounce = _a.debounce, throttle = _a.throttle;
        var cache = $cacheFactory('magics');
        this._scenes = cache.put('scenes', {});
        this._stages = cache.put('stages', {});
        this.stage('default', {});
    }
    // TODO: test _brake
    MagicsInstance.prototype._brake = function (handler, delay) {
        var brake;
        var brakeOption = this._provider.performanceOptions.brake;
        if (brakeOption === 'throttle') {
            brake = this.$.throttle;
        }
        else if (brakeOption === 'debounce') {
            brake = this.$.debounce;
        }
        else if (typeof brakeOption === 'function') {
            brake = brakeOption;
        }
        else {
            brake = function (handler) { return handler; };
        }
        return brake(handler, delay);
    };
    MagicsInstance.prototype._isEmpty = function (val) {
        return ([null, undefined, ''].indexOf(val) >= 0);
    };
    // TODO: test _onSceneBraked
    MagicsInstance.prototype._onSceneBraked = function (eventName, name, handler) {
        var _this = this;
        var brakedHandler = this._brake(handler, this._provider.performanceOptions.delay);
        this._scenes[name].on(eventName, brakedHandler);
        return function () {
            var scene = _this._scenes[name];
            if (scene) {
                scene.off(eventName, brakedHandler);
            }
        };
    };
    MagicsInstance.prototype._patch = function (name, type, instance) {
        var _this = this;
        if ('$$patched' in instance) {
            return instance;
        }
        var destroy_ = instance.destroy;
        instance.destroy = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            if (type === 'stage' && name === 'default') {
                // original .destroy() return null
                return true;
            }
            // handling stage/scene name is not possible when decorating with .extend()
            var storageName = '_' + type + 's';
            delete _this[storageName][name];
            return destroy_.apply(instance, args);
        };
        instance.$$patched = true;
        return instance;
    };
    MagicsInstance.prototype.stage = function (name, options) {
        var _a = this.$, $window = _a.$window, scrollMagic = _a.scrollMagic;
        if (this._isEmpty(name)) {
            name = 'default';
        }
        // TODO: duplicate warning for 'options'
        if (name in this._stages) {
            return this._stages[name];
        }
        var stageOptions = angular.extend({}, this._provider.stageOptions, {
            // TODO: custom container	
            container: this._provider.container || $window
        }, options);
        // TODO?: refactor to ScrollMagic API
        if ('sceneOptions' in stageOptions) {
            var sceneOptions = stageOptions.sceneOptions;
            delete stageOptions.sceneOptions;
        }
        var stage = this._stages[name] = new scrollMagic.Controller(stageOptions);
        stage._sceneOptions = sceneOptions;
        stage.scrollTo(this._scrollHandler);
        return this._patch(name, 'stage', stage);
    };
    MagicsInstance.prototype.scene = function (name, options, stageName) {
        var _a = this.$, $rootScope = _a.$rootScope, scrollMagic = _a.scrollMagic;
        // TODO: duplicate warning for 'options'
        if (name in this._scenes) {
            return this._scenes[name];
        }
        if (this._isEmpty(stageName)) {
            stageName = 'default';
        }
        var stage = this._stages[stageName];
        // TODO: test sceneOptions
        var sceneOptions = angular.extend({}, this._provider.sceneOptions, stage._sceneOptions, options);
        var scene = this._scenes[name] = (new scrollMagic.Scene(sceneOptions)).addTo(stage);
        if (this._provider.debug) {
            scene.addIndicators(angular.extend({}, this._provider.debugOptions, {
                name: name
            }));
        }
        this.onScene(name, function (e) {
            $rootScope.$broadcast('scene:' + name, e);
            $rootScope.$broadcast('scene', name, e);
        });
        this.onSceneEnter(name, function (e) {
            $rootScope.$broadcast('sceneEnter:' + name, e);
            $rootScope.$broadcast('sceneEnter', name, e);
        });
        this.onSceneLeave(name, function (e) {
            $rootScope.$broadcast('sceneLeave:' + name, e);
            $rootScope.$broadcast('sceneLeave', name, e);
        });
        return this._patch(name, 'scene', scene);
    };
    MagicsInstance.prototype.scrollToScene = function (scene, offset) {
        var _a = this.$, $q = _a.$q, scrollMagic = _a.scrollMagic;
        offset = offset || 0;
        if (angular.isString(scene)) {
            scene = this._scenes[scene];
        }
        if (!(scene instanceof scrollMagic.Scene)) {
            return false;
        }
        var target = scene.scrollOffset() + offset;
        var stage = scene.controller();
        var container = stage.info('container');
        var deferred = $q.defer();
        // the proper use case for Deferred, one and only
        stage.scrollTo(target, [container, deferred]);
        return deferred.promise;
    };
    // TODO: ? stage namespacing, brake per stage
    // TODO: additional params
    MagicsInstance.prototype.onScene = function (name, handler) {
        return this._onSceneBraked('enter.ngMagics leave.ngMagics', name, handler);
    };
    MagicsInstance.prototype.onSceneEnter = function (name, handler) {
        return this._onSceneBraked('enter.ngMagics', name, handler);
    };
    MagicsInstance.prototype.onSceneLeave = function (name, handler) {
        return this._onSceneBraked('leave.ngMagics', name, handler);
    };
    // TODO: onScenePoint
    MagicsInstance.prototype.onSceneProgress = function (name, handler) {
        var _this = this;
        var scene = this._scenes[name];
        scene.on('progress.ngMagics', handler);
        return function () {
            var scene = _this._scenes[name];
            if (scene) {
                scene.off('progress.ngMagics', handler);
            }
        };
    };
    MagicsInstance.prototype.onSceneDestroy = function (name, handler) {
        var _this = this;
        var scene = this._scenes[name];
        scene.on('destroy.ngMagics', handler);
        return function () {
            var scene = _this._scenes[name];
            if (scene) {
                scene.off('destroy.ngMagics', handler);
            }
        };
    };
    MagicsInstance.$inject = ['$cacheFactory', '$q', '$rootScope', '$window', 'debounce', 'throttle', 'scrollMagic', 'Tween'];
    return MagicsInstance;
})();
exports.__esModule = true;
exports["default"] = angular.module('ngMagics.magics', [constants_1["default"]])
    .provider('magics', MagicsProvider)
    .name;

return exports;
})();
/// <reference path="./typings/globals.d.ts"/>
/// <reference path="./typings/lib.d.ts"/>
var angular = __small$_mod_0;
var magics_scene_1 = ((function() {
var exports = {};
/// <reference path="../typings/globals.d.ts"/>
/// <reference path="../typings/lib.d.ts"/>
var angular = __small$_mod_0;
var magics_1 = __small$_5;
var MagicsSceneDirectiveController = (function () {
    function MagicsSceneDirectiveController() {
        var _this = this;
        var deps = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            deps[_i - 0] = arguments[_i];
        }
        this.$ = {};
        var self = this.constructor;
        angular.forEach(self.$inject, function (depName, i) {
            _this.$[depName] = deps[i];
        });
        //
        var _a = this.$, $scope = _a.$scope, $element = _a.$element, $attrs = _a.$attrs;
        var expando = angular.element.expando;
        // TODO: global option to get scene name from 'id' attr
        // uninterpolated attribute
        this.sceneName = $attrs.magicsScene || (expando + '.' + $element[0][expando]);
        // TODO: filter duration, offset, triggerHook, reverse
        this.sceneOptions = $scope.$eval($attrs.magicsSceneOptions) || {};
    }
    MagicsSceneDirectiveController.prototype.init = function (stageName) {
        var _this = this;
        var _a = this.$, $element = _a.$element, magics = _a.magics;
        // TODO: avoid _scenes check
        // TODO: duplicate warning
        if (this.sceneName in magics._scenes) {
            this.scene = magics.scene(this.sceneName);
            return;
        }
        this.scene = magics.scene(this.sceneName, this.sceneOptions, stageName);
        var element = $element[0];
        // TODO: spec
        this.scene.triggerElement(element);
        if (!('duration' in this.sceneOptions)) {
            // TODO: ? stage property
            var stage = magics.stage(stageName);
            var isVertical = stage.info('vertical');
            // TODO: ? separate method
            this.scene.duration(function () {
                // TODO: caching
                return isVertical ? element.offsetHeight : element.offsetWidth;
            });
        }
        $element.on('$destroy', function () {
            magics.scene(_this.sceneName).destroy();
        });
    };
    MagicsSceneDirectiveController.$inject = ['$scope', '$element', '$attrs', '$rootScope', 'magics'];
    return MagicsSceneDirectiveController;
})();
exports.__esModule = true;
exports["default"] = angular.module('ngMagics.magicsScene', [magics_1["default"]])
    .directive('magicsScene', function () { return ({
    /**
     * @ngdoc directive
     * @name magicsScene
     *
     * @element ANY
     * @restrict A
     *
     * @param {string=} magicsScene Scene name.
     * @param {Object=} magicsSceneOptions Options that are used on scene creation.
     *
     * @description Creates a new scene or reuses the existing one
     * on either the stage specified by `magicsStage` directive or 'default' stage.
     */
    restrict: 'A',
    require: ['magicsScene', '?^magicsStage'],
    controller: MagicsSceneDirectiveController,
    link: {
        pre: function (scope, element, attrs, ctrls) {
            var sceneCtrl = ctrls[0], stageCtrl = ctrls[1];
            var stageName = (stageCtrl || {}).stageName;
            sceneCtrl.init(stageName);
        }
    }
}); })
    .name;

return exports;
})());
var magics_spy_1 = ((function() {
var exports = {};
/// <reference path="../typings/globals.d.ts"/>
/// <reference path="../typings/lib.d.ts"/>
var angular = __small$_mod_0;
var magics_1 = __small$_5;
var MagicsSpyDirectiveController = (function () {
    function MagicsSpyDirectiveController() {
        var _this = this;
        var deps = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            deps[_i - 0] = arguments[_i];
        }
        this.$ = {};
        var self = this.constructor;
        angular.forEach(self.$inject, function (depName, i) {
            _this.$[depName] = deps[i];
        });
        //
        var _a = this.$, $scope = _a.$scope, $attrs = _a.$attrs, $parse = _a.$parse;
        // uninterpolated attribute
        if ($attrs.magicsSpy) {
            var setter = $parse($attrs.magicsSpy).assign;
            if (setter) {
                this._flagSetter = function (val) { return setter($scope, val); };
            }
        }
    }
    // TODO: get/set
    MagicsSpyDirectiveController.prototype.flag = function (val) {
        if (arguments.length) {
            this._flag = val;
            if (this._flagSetter) {
                this._flagSetter(val);
            }
        }
        return this._flag;
    };
    MagicsSpyDirectiveController.prototype.init = function (sceneName) {
        var _this = this;
        var _a = this.$, $scope = _a.$scope, $element = _a.$element, $attrs = _a.$attrs, magics = _a.magics;
        var progressHandler = $scope.$eval($attrs.magicsSpyProgress);
        if (progressHandler) {
            var offSceneProgress = magics.onSceneProgress(sceneName, progressHandler);
            $element.on('$destroy', function () { return offSceneProgress(); });
        }
        // TODO: ? $rootScope
        $scope.$on('scene:' + sceneName, function ($e, e) {
            var state;
            if (e.type === 'enter') {
                state = true;
            }
            else if (e.type === 'leave') {
                state = false;
            }
            $scope.$apply(function () { return _this.flag(state); });
        });
    };
    MagicsSpyDirectiveController.$inject = ['$scope', '$element', '$attrs', '$parse', 'magics'];
    return MagicsSpyDirectiveController;
})();
exports.__esModule = true;
exports["default"] = angular.module('ngMagics.magicsSpy', [magics_1["default"]])
    .directive('magicsSpy', ['magics', function (magics) { return ({
        /**
         * @ngdoc directive
         * @name magicsSpy
         *
         * @element ANY
         * @restrict A
         *
         * @param {expression=} magicsSpy Scope variable flag *(read-only)*.
         * @param {string=} magicsSpyScene Scene name.
         * @param {expression=} magicsSpyProgress Scene progress callback function.
         *
         * @description Sets up a spy for the scene specified
         *  by either parent `magicsScene` directive or `magicsSpyScene` attribute.
         */
        restrict: 'A',
        require: ['magicsSpy', '?^magicsScene'],
        controller: MagicsSpyDirectiveController,
        link: {
            pre: function (scope, element, attrs, ctrls) {
                var spyCtrl = ctrls[0], sceneCtrl = ctrls[1];
                var parentSceneName = (sceneCtrl || {}).sceneName;
                var sceneName = attrs.magicsSpyScene || parentSceneName;
                if (magics._isEmpty(sceneName)) {
                    return;
                }
                spyCtrl.init(sceneName);
            }
        }
    }); }])
    .name;

return exports;
})());
var magics_stage_1 = ((function() {
var exports = {};
/// <reference path="../typings/globals.d.ts"/>
/// <reference path="../typings/lib.d.ts"/>
var angular = __small$_mod_0;
var magics_1 = __small$_5;
var MagicsStageDirectiveController = (function () {
    function MagicsStageDirectiveController() {
        var _this = this;
        var deps = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            deps[_i - 0] = arguments[_i];
        }
        this.$ = {};
        var self = this.constructor;
        angular.forEach(self.$inject, function (depName, i) {
            _this.$[depName] = deps[i];
        });
        //
        var _a = this.$, $scope = _a.$scope, $attrs = _a.$attrs;
        // uninterpolated attribute
        this.stageName = $attrs.magicsStage || 'default';
        // TODO: filter vertical, refreshInterval
        this.stageOptions = $scope.$eval($attrs.magicsStageOptions) || {};
        // TODO: custom scrollTo function
    }
    MagicsStageDirectiveController.prototype.init = function () {
        var _this = this;
        var _a = this.$, $element = _a.$element, magics = _a.magics;
        // TODO: avoid _stages check
        // TODO: duplicate warning
        if (this.stageName in magics._stages) {
            this.stage = magics.stage(this.stageName);
            return;
        }
        var stageOptions = angular.extend({}, this.stageOptions, { container: $element[0] });
        this.stage = magics.stage(this.stageName, stageOptions);
        // TODO: ? scope on destroy
        $element.on('$destroy', function () {
            magics.stage(_this.stageName).destroy();
        });
    };
    MagicsStageDirectiveController.$inject = ['$scope', '$element', '$attrs', 'magics'];
    return MagicsStageDirectiveController;
})();
exports.__esModule = true;
exports["default"] = angular.module('ngMagics.magicsStage', [magics_1["default"]])
    .directive('magicsStage', function () { return ({
    /**
     * @ngdoc directive
     * @name magicsStage
     *
     * @element ANY
     * @restrict A
     *
     * @param {string=} magicsStage Stage name.
     * @param {Object=} magicsStageOptions Options that have to be passed  to `magics.stage`.
     *
     * @description Creates a new stage or reuses the existing one.
     */
    restrict: 'A',
    controller: MagicsStageDirectiveController,
    link: {
        pre: function (scope, element, attrs, ctrl) {
            ctrl.init();
        }
    }
}); })
    .name;

return exports;
})());
var constants_1 = __small$_4;
var magics_1 = __small$_5;
exports.__esModule = true;
exports["default"] = angular.module('ngMagics', [
    magics_scene_1["default"],
    magics_spy_1["default"],
    magics_stage_1["default"],
    constants_1["default"],
    magics_1["default"]
])
    .name;

return exports;
}))