var angular = require("angular");
angular.module('furiousBM.routes', [require("angular-route")])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {
        templateUrl:'bench/dist/partials/home.html',
        controller:'HomeCtrl'
    })
    .otherwise({
        redirectTo:'/home'
    });
}])