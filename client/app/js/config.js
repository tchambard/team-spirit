"use strict";

 angular.module('config', []).constant('ENV', {name:'development',apiUrl:'http://0.0.0.0:3000/api/',siteUrl:'http://0.0.0.0:3000'});
 
 angular.module('ui.bootstrap.carousel', ['ui.bootstrap.transition'])
 .controller('CarouselController', ['$scope', '$timeout', '$transition', '$q', function ($scope, $timeout, $transition, $q) {
 }]).directive('carousel', [function() { 
     return { }
 }]);