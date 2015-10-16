/// <reference path="../typings/globals.d.ts"/>
/// <reference path="../typings/lib.d.ts"/>

import * as angular from 'angular';

import magicsModule from '../services/magics';

class MagicsSpyDirectiveController {
	static $inject = ['$scope', '$element', '$attrs', '$parse', 'magics'];

	_flag;
	_flagSetter;

	$ = <any> {};

	constructor(...deps) {
		let self = <INgConstructor> this.constructor;

		angular.forEach(self.$inject, (depName, i) => {
			this.$[depName] = deps[i];
		});

		//

		let { $scope, $attrs, $parse } = this.$;

		// uninterpolated attribute
		if ($attrs.magicsSpy) {
			let setter = $parse($attrs.magicsSpy).assign;

			if (setter) {
				this._flagSetter = (val) => setter($scope, val);
			}
		}
	}

	// TODO: get/set
	flag(val) {
		if (arguments.length) {
			this._flag = val;

			if (this._flagSetter) {
				this._flagSetter(val);
			}
		}

		return this._flag;
	}

	init(sceneName) {
		let { $scope, $element, $attrs, magics } = this.$;

		let progressHandler = $scope.$eval($attrs.magicsSpyProgress);

		if (progressHandler) {
			let offSceneProgress = magics.onSceneProgress(sceneName, progressHandler);

			$element.on('$destroy', () => offSceneProgress());
		}

		// TODO: ? $rootScope
		$scope.$on('sceneEnter:' + sceneName, (e) => {
			$scope.$apply(() => this.flag(true));
		});

		$scope.$on('sceneLeave:' + sceneName, (e) => {
			$scope.$apply(() => this.flag(false));
		});
	}
}

export default angular.module('ngMagics.magicsSpy', [magicsModule])
	.directive('magicsSpy', ['magics', (magics) => ({
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
			pre: (scope, element, attrs, ctrls) => {
				let [spyCtrl, sceneCtrl] = ctrls;

				let parentSceneName = (sceneCtrl || {}).sceneName;
				let sceneName = attrs.magicsSpyScene || parentSceneName;

				if (magics._isEmpty(sceneName)) {
					return;
				}

				spyCtrl.init(sceneName);
			}
		}
	})])
	.name;
