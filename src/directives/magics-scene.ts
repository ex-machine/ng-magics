/// <reference path="../typings/globals.d.ts"/>
/// <reference path="../typings/lib.d.ts"/>

import * as angular from 'angular';

import magicsModule from '../services/magics';

class MagicsSceneDirectiveController {
	static $inject = ['$scope', '$element', '$attrs', '$rootScope', 'magics'];

	sceneName;
	sceneOptions;
	scene;

	$ = <any> {};

	constructor(...deps) {
		let self = <INgConstructor> this.constructor;

		angular.forEach(self.$inject, (depName, i) => {
			this.$[depName] = deps[i];
		});

		//

		let { $scope, $element, $attrs } = this.$;

		let expando = angular.element.expando;

		// TODO: global option to get scene name from 'id' attr

		// uninterpolated attribute
		this.sceneName = $attrs.magicsScene || (expando + '.' + $element[0][expando]);

		// TODO: filter duration, offset, triggerHook, reverse
		this.sceneOptions = $scope.$eval($attrs.magicsSceneOptions) || {};
	}

	init(stageName) {
		let { $element, magics } = this.$;

		// TODO: avoid _scenes check
		// TODO: duplicate warning
		if (this.sceneName in magics._scenes) {
			this.scene = magics.scene(this.sceneName);
			return;
		}

		this.scene = magics.scene(this.sceneName, this.sceneOptions, stageName);

		let element = $element[0];
		// TODO: spec
		this.scene.triggerElement(element);

		if (!('duration' in this.sceneOptions)) {
			// TODO: ? stage property
			let stage = magics.stage(stageName);
			let isVertical = stage.info('vertical');

			// TODO: ? separate method
			this.scene.duration(() => {
				// TODO: caching
				return isVertical ? element.offsetHeight : element.offsetWidth;
			});
		}

		$element.on('$destroy', () => {
			magics.scene(this.sceneName).destroy();
		});
	}
}

export default angular.module('ngMagics.magicsScene', [magicsModule])
	.directive('magicsScene', () => ({
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
			pre: (scope, element, attrs, ctrls) => {
				let [sceneCtrl, stageCtrl] = ctrls;
				let stageName = (stageCtrl || {}).stageName;

				sceneCtrl.init(stageName);
			}
		}
	}))
	.name;
