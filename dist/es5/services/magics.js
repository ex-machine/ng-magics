/// <reference path="../typings/globals.d.ts"/>
/// <reference path="../typings/lib.d.ts"/>
var angular = require('angular');
var constants_1 = require('./constants');
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
        this._brake = (this._provider.performanceOptions.brake === 'throttle')
            ? throttle
            : debounce;
        this._delay = this._provider.performanceOptions.delay;
        var cache = $cacheFactory('magics');
        this._scenes = cache.put('scenes', {});
        this._stages = cache.put('stages', {});
        this.stage('default', {});
    }
    MagicsInstance.prototype._isEmpty = function (val) {
        return ([null, undefined, ''].indexOf(val) >= 0);
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
            globalSceneOptions: this._provider.sceneOptions,
            // TODO: custom container	
            container: this._provider.container || $window
        }, options);
        var stage = this._stages[name] = new scrollMagic.Controller(stageOptions);
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
        var scene = this._scenes[name] = (new scrollMagic.Scene(options)).addTo(stage);
        if (this._provider.debug) {
            scene.addIndicators(angular.extend({}, this._provider.debugOptions, {
                name: name
            }));
        }
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
    MagicsInstance.prototype.onSceneEnter = function (name, handler) {
        var _this = this;
        var brakedHandler = this._brake(handler, this._delay);
        this._scenes[name].on('enter.ngMagics', brakedHandler);
        return function () {
            var scene = _this._scenes[name];
            if (scene) {
                scene.off('enter.ngMagics', brakedHandler);
            }
        };
    };
    MagicsInstance.prototype.onSceneLeave = function (name, handler) {
        var _this = this;
        var brakedHandler = this._brake(handler, this._delay);
        var scene = this._scenes[name];
        scene.on('leave.ngMagics', brakedHandler);
        return function () {
            var scene = _this._scenes[name];
            if (scene) {
                scene.off('leave.ngMagics', brakedHandler);
            }
        };
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
