'use strict';

/*jshint sub:true*/
/*jshint camelcase: false */

angular.module('com.module.teams')
  .factory('TeamSvc', function(Team, CoreService) {
    return {
	      getTeamById: function(id, cb) {
	    	  var team;
	    	  Team.findOne({
	    	      filter: {
	    	        where: {
	    	          id: id
	    	        },
	    	        include: ['members']
	    	      }
	    	    }, function(team) {
	    	    	if (team.logoId) {
	    	    		team.avatarUrl = CoreService.env.apiUrl +  "/Teams/{id}/getlogo?id="+ team.id ;
	    	    	} else {
	    	    		//team.avatarUrl = "https://www.trynova.org/wp-content/uploads/2012/07/TEAM.jpg";
	    	    	}
	    	    	cb(null, team);
	    	    }, function(err) {
		    	    cb(err);
	    		});
	      
	      },
	      uploadLogo: function(id, data, cb) {
	    	  console.log("UPLOAD LOGO SVC CALLED");
	    	  Team.setLogo({id: id}, {data: data}, function(result, headers) {
	    		  	console.log("headers: "+JSON.stringify(headers,null,2));
	    	    	cb(null, result);
	    	    }, function(err) {
		    	    cb(err);
	    		});
	      }
	  }
  });
