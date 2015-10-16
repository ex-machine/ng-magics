/// <reference path="../typings/globals.d.ts"/>
/// <reference path="../typings/lib.d.ts"/>
var angular = require('angular');
var magics_1 = require('../services/magics');
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
