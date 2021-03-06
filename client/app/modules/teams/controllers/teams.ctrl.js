'use strict';
var app = angular.module('com.module.teams');

app.controller('TeamViewCtrl', function($scope, $stateParams, $state, CoreService, Team, TeamSvc, gettextCatalog) {
	  

	
	$scope.getLogoModalData = function() {
		return {
			id: $scope.team.id,
			prop: "logo",
			url: $scope.team.avatarUrl,
			uploadFn: Team.setLogo,
			ratio: 1 / 1
		};
	};
	
	$scope.getBanModalData = function() {
		return {
			id: $scope.team.id,
			prop: "ban",
			url: $scope.team.banUrl,
			uploadFn: Team.setBan,
			ratio: 3 / 1
		};
	};
	
	if ($stateParams.id) {   
		TeamSvc.getTeamById($stateParams.id, function(err, team) {
		  if (err) {
			  CoreService.toastError(gettextCatalog.getString('Error getting team: ' + err.message));
			  throw err;
		  }
		  $scope.team = team;
		});
	} else {
		$scope.team = {};
	}
	  
	  
	  
}).controller('TeamMembersCtrl', function($scope, $stateParams, $state, CoreService, Team, TeamSvc, gettextCatalog) {
	  
	$scope.getTeam = function(id) {
		return TeamSvc.getTeamById($stateParams.id, function(err, team) {
		  if (err) CoreService.toastError(gettextCatalog.getString('Error getting team: ' + err.message));
		  $scope.team = team;
	  });
	};
	
	
	if ($stateParams.id) {   
		TeamSvc.getTeamById($stateParams.id, function(err, team) {
		  if (err) {
			  CoreService.toastError(gettextCatalog.getString('Error getting team: ' + err.message));
			  throw err;
		  }
		  $scope.team = team;
		});
	} else {
		$scope.team = {};
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
				if (t.logo) {
					t.avatarUrl = "/api/Teams/getBlob?id="+ t.id;
				} else {
					//t.avatarUrl = "https://www.trynova.org/wp-content/uploads/2012/07/TEAM.jpg";
				}

				return t;
			});
		});
	};


	  $scope.delete = function(id) {
		    CoreService.confirm(gettextCatalog.getString('Are you sure?'),
		      gettextCatalog.getString('Deleting this cannot be undone'),
		      function() {
		        Team.deleteById(id, function(value, responseHeaders) {
		        	console.log(JSON.stringify(value));
		            CoreService.toastSuccess(gettextCatalog.getString(
		              'Team deleted'), gettextCatalog.getString(
		              'Your team is deleted!'));
		            $state.go('app.team.list', {}, {reload: true});
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
	      $state.go('app.team.view', {id: t.id}, {reload: true});
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
	  
	  
	  
}).controller('TeamPhotosCtrl', function($scope, $stateParams, $state, CoreService, Team, TeamSvc, gettextCatalog) {

	
	TeamSvc.getTeamById($stateParams.id, function(err, team) {
		  if (err) {
			  CoreService.toastError(gettextCatalog.getString('Error getting team: ' + err.message));
			  throw err;
		  }
		  if (team.photos) {
			  $scope.photos = [];
			  team.photos.forEach(function(photo) {
				  $scope.photos.push({
					 title: photo.filename,
					 url: "/api/Teams/getPhoto?id="+photo.blobId
				  });
			  });
		  }
		});
	console.log("photos:", $scope.team);
	
});