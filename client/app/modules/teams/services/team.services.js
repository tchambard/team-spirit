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
	    	        include: ['members', 'logo', 'ban']
	    	      }
	    	    }, function(t) {
					if (t.logo) {
						t.avatarUrl = "/api/Teams/getLogo?id="+ t.logo.gridId;
					} else {
						//t.avatarUrl = "https://www.trynova.org/wp-content/uploads/2012/07/TEAM.jpg";
					}
					
					if (t.ban) {
						t.banUrl = "/api/Teams/getBan?id="+ t.ban.gridId;
					} else {
						//t.avatarUrl = "https://www.trynova.org/wp-content/uploads/2012/07/TEAM.jpg";
					}
	    	    	cb(null, t);
	    	    }, function(err) {
		    	    cb(err);
	    		});
	      
	      }
	  }
  });
