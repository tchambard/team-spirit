'use strict';

/**
 * @ngdoc directive
 * @name com.module.core.directive:modal
 * @description
 * # home
 */
angular.module('com.module.core')
  .directive('modalViewUrl', function($modal) {
	  return {
        restrict: 'A', // A: attribute
        scope: { // isolate scope
            'modalViewUrl': '@', // modal view url to render the modal content
            'modalController': '@', // modal view controller (optional)
            'modalData': '@'
        },
        link: function($scope, element, attrs){
            element.bind('click', function(){
                // see modal reference from ui bootstrap at <http://angular-ui.github.io>
                var data = {
                    animation: true,
                    templateUrl: $scope.modalViewUrl,
                    controller: $scope.modalController,    
                    resolve: {}
                };
                data.resolve[$scope.modalData] = function () {
                    return $scope.$parent[$scope.modalData];
                }
            	
            	var modalInstance = $modal.open(data);
            });
        }
    };
  });