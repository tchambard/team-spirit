'use strict';
angular.module('com.module.teams')
  .config(function($stateProvider) {
    $stateProvider
      .state('dashboard.teams', {
        url: '',
        templateUrl: 'modules/teams/views/list.html',
        controller: 'TeamsCtrl',
        authenticate: true
      })
      .state('app.team', {
        abstract: true,
        url: '/team',
        templateUrl: 'modules/teams/views/main.html'
      })

      .state('app.team.details', {
        url: '/:id',
        authenticate: false,
        views: {

            '': {
            	controller: 'TeamViewCtrl',
            	templateUrl: 'modules/teams/views/view.html'
            },

            'logo@app.team.details': {
            	controller: function($scope) {
            		$scope = $scope.$parent;  
            	},
            	templateUrl: 'modules/teams/views/cards/logo-card.html'
            },

            'members@app.team.details': { 
            	controller: function($scope) {
            		$scope = $scope.$parent;  
            	},
                templateUrl: 'modules/teams/views/cards/members-card.html'
            },
            
            'json@app.team.details': {
            	controller: function($scope) {
            		$scope = $scope.$parent;  
            	},
            	templateUrl: 'modules/teams/views/cards/json-card.html'
            },
        }
        
      })
      .state('app.team.members', {
    	  url: '/:id/members',
    	  templateUrl: 'modules/teams/views/members.html',
    	  controller: 'TeamMembersCtrl',
    	  authenticate: true
      })
      .state('app.team.add', {
        url: '/add',
        templateUrl: 'modules/teams/views/form.html',
        controller: 'TeamsCtrl',
        authenticate: true
      })
      .state('app.team.edit', {
        url: '/edit/:id',
        templateUrl: 'modules/teams/views/form.html',
        controller: 'TeamsCtrl',
        authenticate: true
      })

      .state('app.team.delete', {
        url: '/delete/:id',
        controller: 'TeamsCtrl',
        authenticate: true
      });
  });
