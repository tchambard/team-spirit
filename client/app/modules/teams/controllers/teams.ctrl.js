'use strict';
var app = angular.module('com.module.teams');


app.controller('TeamsCtrl', function($scope, $stateParams, $state, CoreService,
  Team, TeamSvc, gettextCatalog) {


	var getTeam = $scope.getTeam = function(id) {
		return TeamSvc.getTeamById($stateParams.id, function(err, team) {
		  if (err) CoreService.toastError(gettextCatalog.getString('Error getting team: ' + err.message));
		  $scope.team = team;
	  });
	};
	
  if ($stateParams.id) {
    
	  getTeam($stateParams.id);
	
  } else {
    $scope.team = {};
  }



  $scope.sortType     = 'lastName'; // set the default sort type
  $scope.sortReverse  = false;  // set the default sort order
  $scope.loading = true;
  
  
	$scope.getTeams = function() {
		Team.find({}, function(teams) {
			$scope.loading = false;
			$scope.teams = teams.map(function(t) {
				if (t.avatarId) {
					t.avatarUrl = CoreService.env.apiUrl +  "/Teams/{id}/getAvatar?id="+ t.id ;
				} else {
					t.avatarUrl = "https://www.trynova.org/wp-content/uploads/2012/07/TEAM.jpg";
				}
				return t;
			});
		});
	}


	  $scope.delete = function(id) {
		  console.log("ID: "+JSON.stringify(id,null,2));
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

  

}).controller('TeamEditCtrl', function($scope, $stateParams, $state, CoreService, Team, TeamSvc, gettextCatalog, $modalInstance, team) {
	$scope.team = team;
	$scope.onSubmit = function() {
	    Team.upsert($scope.team, function() {
	      CoreService.toastSuccess(gettextCatalog.getString('Team saved'),
	        gettextCatalog.getString('Modifications saved!'));
	      $modalInstance.close();
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