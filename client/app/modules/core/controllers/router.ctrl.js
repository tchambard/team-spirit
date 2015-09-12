'use strict';
/**
 * @ngdoc function
 * @name com.module.core.controller:RouteCtrl
 * @description Redirect for acess
 * @requires $q
 * @requires $scope
 * @requires $state
 * @requires $location
 * @requires AppAuth
 **/
angular.module('com.module.core')
  .controller('RouteCtrl', function($q, $rootScope, $scope, $state, $location, AppAuth) {
    if (!AppAuth.currentUser) {
      console.log('Redirect to home');
      $location.path('/home');
    } else {
      console.log('Redirect to dashboard');
      $rootScope.currentUser = AppAuth.currentUser;
      $location.path('/dashboard');
    }
  });
