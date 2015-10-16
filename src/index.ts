/// <reference path="./typings/globals.d.ts"/>
/// <reference path="./typings/lib.d.ts"/>

import * as angular from 'angular';

import magicsSceneModule from './directives/magics-scene';
import magicsSpyModule from './directives/magics-spy';
import magicsStageModule from './directives/magics-stage';
import constantsModule from './services/constants';
import magicsModule from './services/magics';

export default angular.module('ngMagics', [
	magicsSceneModule,
	magicsSpyModule,
	magicsStageModule,
	constantsModule,
	magicsModule
])
	.name;
