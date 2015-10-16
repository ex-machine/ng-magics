/// <reference path="./typings/globals.d.ts"/>
/// <reference path="./typings/lib.d.ts"/>
var angular = require('angular');
var magics_scene_1 = require('./directives/magics-scene');
var magics_spy_1 = require('./directives/magics-spy');
var magics_stage_1 = require('./directives/magics-stage');
var constants_1 = require('./services/constants');
var magics_1 = require('./services/magics');
exports.__esModule = true;
exports["default"] = angular.module('ngMagics', [
    magics_scene_1["default"],
    magics_spy_1["default"],
    magics_stage_1["default"],
    constants_1["default"],
    magics_1["default"]
])
    .name;
