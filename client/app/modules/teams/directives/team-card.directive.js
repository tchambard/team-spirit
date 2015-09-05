'use strict';
/**
 * @ngdoc directive
 * @name com.module.core.directive:teamCard
 * @restrict E
 * @description Dashboard Box
 * @param {string} name Box Title
 * @param {string} color bg-color
 * @param {string} icon Ionic-icon class
 * @param {string} quantity Title
 * @param {string} href ui-shref link
 */
angular.module('com.module.core')
  .directive('teamCard', function() {
    return {
      restrict: 'E',
      templateUrl: 'modules/teams/views/cards/team-card.html',
      scope: {
    	team: '=',
    	id: '@',
        name: '@',
        color: '@',
        icon: '@',
        quantity: '@',
        href: '@',
        img: '@'
      }
    };
  });
