'use strict';
angular.module('com.module.teams')
  .run(function($rootScope, gettextCatalog) {
	    $rootScope.addMenu(gettextCatalog.getString('Teams'),
	    	      'app.team.list', 'fa-users');

  });
