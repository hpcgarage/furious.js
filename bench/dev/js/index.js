var Benchmark = require("benchmark").Benchmark;
var angular = require("angular");
var angular_route = require('angular-route');
var angularChart = require('angular-chart.js')
angular.module('furiousBM', ['furiousBM.controllers', 'furiousBM.routes', 'chart.js']);
angular.module('furiousBM.controllers',['chart.js']);
angular.module('furiousBM.routes',[]);