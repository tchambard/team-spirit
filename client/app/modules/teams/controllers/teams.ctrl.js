'use strict';
var app = angular.module('com.module.teams');

app.controller('TeamViewCtrl', function($scope, $stateParams, $state, CoreService, Team, TeamSvc, gettextCatalog) {
	  
	$scope.getTeam = function(id) {
		return TeamSvc.getTeamById($stateParams.id, function(err, team) {
		  if (err) CoreService.toastError(gettextCatalog.getString('Error getting team: ' + err.message));
		  $scope.team = team;
	  });
	};
	
	if ($stateParams.id) {   
		$scope.team = $scope.getTeam($stateParams.id);
	} else {
		$scope.team = {};
	}
	  
	  
	  
}).controller('TeamLogoCtrl', function($scope, $stateParams, $state, CoreService, Team, TeamSvc, gettextCatalog) {
	$scope = $scope.$parent;
    $scope.reload = function(){
    	$state.transitionTo($state.current, $state.params, { reload: true, inherit: true, notify: true })
    }
	  
	  
}).controller('TeamMembersCtrl', function($scope, $stateParams, $state, CoreService, Team, TeamSvc, gettextCatalog) {
	$scope = $scope.$parent;
	  
	  
	  
}).controller('TeamJsonCtrl', function($scope, $stateParams, $state, CoreService, Team, TeamSvc, gettextCatalog) {
	$scope = $scope.$parent;
	$scope.getLogoModalData = function() {
		return {
			id: $scope.team.id,
			url: $scope.team.avatarUrl,
			uploadFn: TeamSvc.uploadLogo
		}
	}
	  
	  
}).controller('TeamsCtrl', function($scope, $stateParams, $state, CoreService,
  Team, TeamSvc, gettextCatalog) {

  $scope.sortType     = 'lastName'; // set the default sort type
  $scope.sortReverse  = false;  // set the default sort order
  $scope.loading = true;
  
  
	$scope.getTeams = function() {
		Team.find({}, function(teams) {
			$scope.loading = false;
			$scope.teams = teams.map(function(t) {
				if (t.logoId) {
					t.avatarUrl = CoreService.env.apiUrl +  "/Teams/{id}/getLogo?id="+ t.id ;
				} else {
					//t.avatarUrl = "https://www.trynova.org/wp-content/uploads/2012/07/TEAM.jpg";
				}
				return t;
			});
		});
	}


	  $scope.delete = function(id) {
		    CoreService.confirm(gettextCatalog.getString('Are you sure?'),
		      gettextCatalog.getString('Deleting this cannot be undone'),
		      function() {
		        Team.deleteById(id, function(value, responseHeaders) {
		        	console.log(JSON.stringify(value));
		            CoreService.toastSuccess(gettextCatalog.getString(
		              'Team deleted'), gettextCatalog.getString(
		              'Your team is deleted!'));
		            $state.go('app.teams.list', {}, {reload: true});
		          },
		          function(err) {
		            CoreService.toastError(gettextCatalog.getString(
		              'Error deleting team'), gettextCatalog.getString(
		              'Your team is not deleted:' + err));
		          });
		      },
		      function() {
		        return false;
		      });
		  };

  

}).controller('TeamCreateCtrl', function($scope, $stateParams, $state, CoreService, Team, TeamSvc, gettextCatalog, $modalInstance) {
	$scope.team = {};
	$scope.onSubmit = function() {
	    Team.create($scope.team, function(t) {
	      CoreService.toastSuccess(gettextCatalog.getString('Team saved'));
	      $modalInstance.close();
	      $state.go('app.teams.view', {id: t.id}, {reload: true});
	    }, function(err) {
	      CoreService.toastError(gettextCatalog.getString(
	        'Error saving team: ', +err));
	    });
	  };

	  $scope.formFields = [{
	    key: 'name',
	    type: 'text',
	    label: gettextCatalog.getString('Name'),
	    required: true
	  }, {
	    key: 'mainColor',
	    type: 'text',
	    label: gettextCatalog.getString('Main color')
	  }];

	  $scope.formOptions = {
	    uniqueFormId: true,
	    hideSubmit: false,
	    submitCopy: gettextCatalog.getString('Save')
	  };
	  
	  
	  

});