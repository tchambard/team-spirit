'use strict';
angular.module('com.module.teams')
  .config(function($stateProvider) {
    $stateProvider
      .state('app.teams', {
        abstract: true,
        url: '/teams',
        templateUrl: 'modules/teams/views/main.html'
      })
      .state('app.teams.list', {
        url: '',
        templateUrl: 'modules/teams/views/list.html',
        controller: 'TeamsCtrl',
        authenticate: true
      })
      .state('app.teams.view', {
        url: '/view/:id',
        
        authenticate: false,
        views: {

            '': {
            	controller: 'TeamViewCtrl',
            	templateUrl: 'modules/teams/views/view.html'
            },

            'logo@app.teams.view': {
            	controller: function($scope) {
            		$scope = $scope.$parent;  
            	},
            	templateUrl: 'modules/teams/views/cards/logo-card.html'
            },

            'members@app.teams.view': { 
            	controller: function($scope) {
            		$scope = $scope.$parent;  
            	},
                templateUrl: 'modules/teams/views/cards/members-card.html'
            },
            
            'json@app.teams.view': {
            	controller: function($scope) {
            		$scope = $scope.$parent;  
            	},
            	templateUrl: 'modules/teams/views/cards/json-card.html'
            },
        }
        
      })
      .state('app.teams.add', {
        url: '/add',
        templateUrl: 'modules/teams/views/form.html',
        controller: 'TeamsCtrl',
        authenticate: true
      })
      .state('app.teams.edit', {
        url: '/edit/:id',
        templateUrl: 'modules/teams/views/form.html',
        controller: 'TeamsCtrl',
        authenticate: true
      })

      .state('app.teams.delete', {
        url: '/delete/:id',
        controller: 'TeamsCtrl',
        authenticate: true
      });
  });
