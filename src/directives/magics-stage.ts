/// <reference path="../typings/globals.d.ts"/>
/// <reference path="../typings/lib.d.ts"/>

import * as angular from 'angular';

import magicsModule from '../services/magics';

class MagicsStageDirectiveController {
	static $inject = ['$scope', '$element', '$attrs', 'magics'];

	stageName;
	stageOptions;
	stage;

	$ = <any> {};

	constructor(...deps) {
		let self = <INgConstructor> this.constructor;

		angular.forEach(self.$inject, (depName, i) => {
			this.$[depName] = deps[i];
		});

		//

		let { $scope, $attrs } = this.$;

		// uninterpolated attribute
		this.stageName = $attrs.magicsStage || 'default';

		// TODO: filter vertical, refreshInterval
		this.stageOptions = $scope.$eval($attrs.magicsStageOptions) || {};

		// TODO: custom scrollTo function
	}

	init() {
		let { $element, magics } = this.$;

		// TODO: avoid _stages check
		// TODO: duplicate warning
		if (this.stageName in magics._stages) {
			this.stage = magics.stage(this.stageName);
			return;
		}

		let stageOptions = angular.extend({}, this.stageOptions, { container: $element[0] });

		this.stage = magics.stage(this.stageName, stageOptions);

		// TODO: ? scope on destroy
		$element.on('$destroy', () => {
			magics.stage(this.stageName).destroy();
		});
	}
}

export default angular.module('ngMagics.magicsStage', [magicsModule])
	.directive('magicsStage', () => ({
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
			pre: (scope, element, attrs, ctrl) => {
				ctrl.init();
			}
		}
	}))
	.name;
