/// <reference path="../typings/globals.d.ts"/>
/// <reference path="../typings/lib.d.ts"/>
var angular = require('angular');
var magics_1 = require('../services/magics');
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
        $scope.$on('sceneEnter:' + sceneName, function (e) {
            $scope.$apply(function () { return _this.flag(true); });
        });
        $scope.$on('sceneLeave:' + sceneName, function (e) {
            $scope.$apply(function () { return _this.flag(false); });
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
