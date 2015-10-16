/// <reference path="../typings/globals.d.ts"/>
/// <reference path="../typings/lib.d.ts"/>
var angular = require('angular');
var magics_1 = require('../services/magics');
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
        if (!('duration' in this.sceneOptions)) {
            // TODO: ? stage property
            var stage = magics.stage(stageName);
            var element = $element[0];
            var isVertical = stage.info('vertical');
            // TODO: ? separate method
            this.scene.duration(function () {
                // TODO: caching
                return isVertical ? element.offsetHeight : element.offsetWidth;
            });
            // TODO: spec
            this.scene.triggerElement(element);
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
