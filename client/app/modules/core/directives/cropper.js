'use strict';

/**
 * @ngdoc directive
 * @name com.module.core.directive:cropper
 * @description
 * # home
 */
angular.module('com.module.core')
  .directive('cropperView', function() {
	  return {
		templateUrl: 'modules/core/views/elements/modals/image.html',
        restrict: 'E',
        scope: false,
        link: function($scope, element, attrs){

            	
        	$scope.prop = attrs.cropperProperty;
        }
    };
  });
